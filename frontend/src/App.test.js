import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

const analysisResult = {
  title: '복약 안내 결과', comparison: '함께 복용할 때 약사에게 확인하세요.',
  prescription: { hospitalName: '예시 의원', manufactureDate: '2026-10-29', days: 3 },
  medicines: [{ name: '타이레놀', efficacy: '통증과 열을 낮춥니다.', dosage: '처방된 용법을 따르세요.', warning: '복용 전 의사·약사에게 확인하세요.' }],
};
const response = (data = analysisResult) => ({ ok: true, json: async () => data });
const navigate = (name) => fireEvent.click(screen.getAllByRole('button', { name, exact: true })[0]);
const openPhoto = () => fireEvent.click(screen.getByRole('button', { name: /사진으로 추가/ }));
const openName = () => fireEvent.click(screen.getByRole('button', { name: /이름으로 추가/ }));
const search = (query = '타이레놀') => {
  openName();
  fireEvent.change(screen.getByRole('searchbox', { name: '약·영양제 이름' }), { target: { value: query } });
  fireEvent.click(screen.getByRole('button', { name: '검색하기' }));
};
const selectSearchResult = async () => {
  fireEvent.click(await screen.findByRole('button', { name: '타이레놀 선택' }));
  await screen.findByRole('heading', { name: '복약 안내 결과' });
};
const save = () => {
  fireEvent.click(screen.getByRole('checkbox', { name: /중복 확인 결과/ }));
  fireEvent.click(screen.getByRole('button', { name: '확인한 약·영양제 저장하기' }));
};
const file = new File(['photo'], 'bag.png', { type: 'image/png' });
const upload = () => {
  fireEvent.click(screen.getByRole('checkbox', { name: /외부 AI 전송/ }));
  fireEvent.change(screen.getByLabelText('약봉투 또는 제품·성분표 사진 선택'), { target: { files: [file] } });
};
const OriginalImage = global.Image;
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  global.Image = class {
    width = 600;
    height = 800;
    set src(value) { Promise.resolve().then(() => this.onload()); }
  };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: jest.fn() });
  jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,dGVzdA==');
  window.scrollTo = jest.fn();
});
afterAll(() => { global.Image = OriginalImage; jest.restoreAllMocks(); });
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext.mockReturnValue({ drawImage: jest.fn() });
  HTMLCanvasElement.prototype.toDataURL.mockReturnValue('data:image/jpeg;base64,dGVzdA==');
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue(response());
  URL.createObjectURL = jest.fn().mockReturnValue('blob:test-photo');
  URL.revokeObjectURL = jest.fn();
});

test('첫 화면은 두 선택만 표시하고 입력은 팝업으로 연다', () => {
  render(<App />);
  expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  openPhoto();
  expect(screen.getByRole('dialog', { name: '사진으로 추가' })).toBeInTheDocument();
  expect(screen.getByLabelText('약봉투 또는 제품·성분표 사진 선택')).toBeDisabled();
  expect(document.body).toHaveStyle({ overflow: 'hidden' });
  fireEvent.click(screen.getByRole('button', { name: '입력 창 닫기' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
});
test('사진 전송에 동의해야 사진 선택이 가능하다', () => {
  render(<App />); openPhoto(); fireEvent.click(screen.getByRole('checkbox'));
  expect(screen.getByLabelText('약봉투 또는 제품·성분표 사진 선택')).toBeEnabled();
});
test('저장 후 메뉴로 재등록하면 이전 사진과 동의는 초기화하고 저장 목록은 유지한다', async () => {
  render(<App />); openPhoto(); upload();
  await screen.findByRole('heading', { name: '복약 안내 결과' }); save();
  expect(screen.getByRole('status')).toHaveTextContent('복용 목록에 저장했어요');
  const saved = localStorage.getItem('savedPrescriptions');
  expect(JSON.parse(saved)[0].hospitalName).toBe('예시 의원');
  navigate('약·영양제 추가'); openPhoto();
  expect(screen.queryByRole('img', { name: /분석 중/ })).not.toBeInTheDocument();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(screen.getByLabelText('약봉투 또는 제품·성분표 사진 선택')).toBeDisabled();
  expect(localStorage.getItem('savedPrescriptions')).toBe(saved);
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-photo');
  upload(); await screen.findByRole('heading', { name: '복약 안내 결과' }); save();
  expect(JSON.parse(localStorage.getItem('savedPrescriptions'))).toHaveLength(2);
});
test('완료 화면의 다른 약 추가 버튼은 빈 입력으로 시작한다', async () => {
  render(<App />); search(); await selectSearchResult(); save();
  fireEvent.click(screen.getByRole('button', { name: '다른 약·영양제 추가하기' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  openName(); expect(screen.getByRole('searchbox')).toHaveValue('');
  expect(screen.queryByRole('button', { name: '타이레놀 선택' })).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('myMeds'))).toEqual(['타이레놀']);
});
test('검색어가 없으면 검색 버튼은 비활성화된다', () => {
  render(<App />); openName(); expect(screen.getByRole('button', { name: '검색하기' })).toBeDisabled();
});
test('검색과 선택 시 저장 약 목록을 전달하고 선택 제품의 비교 결과를 표시한다', async () => {
  localStorage.setItem('myMeds', JSON.stringify(['비타민D']));
  render(<App />); search('  타이레놀  ');
  await screen.findByRole('button', { name: '타이레놀 선택' });
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ type: 'text', query: '타이레놀', savedMeds: ['비타민D'] });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await selectSearchResult();
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByText(/함께 복용할 때 약사에게 확인하세요/)).toBeInTheDocument();
  expect(screen.getByDisplayValue('타이레놀')).toBeInTheDocument();
});
test('검색 결과가 없으면 성분표 사진 입력으로 전환한다', async () => {
  global.fetch.mockResolvedValue(response({ ...analysisResult, medicines: [] }));
  render(<App />); search('확인불가제품');
  fireEvent.click(await screen.findByRole('button', { name: '제품·성분표 사진으로 추가' }));
  expect(screen.getByRole('dialog', { name: '사진으로 추가' })).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toHaveValue('product');
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
test('제품 사진은 병원별 약봉투 대신 개별 목록에 저장한다', async () => {
  render(<App />); openPhoto();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'product' } }); upload();
  await screen.findByRole('heading', { name: '복약 안내 결과' }); save();
  expect(localStorage.getItem('savedPrescriptions')).toBeNull();
  expect(screen.getByRole('heading', { name: '개별 추가한 약·영양제' })).toBeInTheDocument();
});
test('API 오류를 팝업 안에 표시하고 다시 검색할 수 있다', async () => {
  global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: '분석 서버 연결 오류' }) });
  render(<App />); search();
  expect(await screen.findByRole('alert')).toHaveTextContent('분석 서버 연결 오류');
  expect(within(screen.getByRole('dialog')).getByRole('button', { name: '검색하기' })).toBeEnabled();
});
test('닫은 검색 팝업의 늦은 응답이 새 팝업을 덮어쓰지 않는다', async () => {
  let resolveRequest;
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveRequest = resolve; }));
  render(<App />); search();
  const signal = global.fetch.mock.calls[0][1].signal;
  fireEvent.click(screen.getByRole('button', { name: '입력 창 닫기' })); openPhoto();
  expect(signal.aborted).toBe(true);
  await act(async () => { resolveRequest(response()); });
  expect(screen.getByRole('dialog', { name: '사진으로 추가' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '타이레놀 선택' })).not.toBeInTheDocument();
});
test('취소한 사진 분석의 늦은 응답은 결과 화면으로 이동시키지 않는다', async () => {
  let resolveRequest;
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveRequest = resolve; }));
  render(<App />); openPhoto(); upload();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  fireEvent.click(screen.getByRole('button', { name: '입력 창 닫기' })); openPhoto();
  await act(async () => { resolveRequest(response()); });
  expect(screen.getByRole('dialog', { name: '사진으로 추가' })).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(screen.queryByRole('heading', { name: '복약 안내 결과' })).not.toBeInTheDocument();
});
test('중복 주의 확인 후 저장을 허용하고 같은 결과의 반복 저장은 막는다', async () => {
  global.fetch.mockResolvedValue(response({ ...analysisResult, comparison: '중복 성분: 아세트아미노펜. 약사에게 확인하세요.' }));
  render(<App />); search(); await selectSearchResult();
  expect(screen.getByRole('button', { name: '확인한 약·영양제 저장하기' })).toBeDisabled();
  save(); navigate('복약안내');
  expect(screen.getByRole('button', { name: '저장 완료' })).toBeDisabled();
});
test('약 이름을 수정하면 이전 비교 결과는 무효화된다', async () => {
  render(<App />); search(); await selectSearchResult();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.change(screen.getByRole('textbox', { name: '약 이름' }), { target: { value: '다른 제품' } });
  expect(screen.getByText(/제품 이름이 변경되었습니다/)).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
test('저장된 약 삭제를 저장소에 반영한다', () => {
  localStorage.setItem('myMeds', JSON.stringify(['타이레놀'])); render(<App />); navigate('내 복용약');
  fireEvent.click(screen.getByRole('button', { name: '타이레놀 삭제' }));
  expect(screen.getByText('아직 저장한 약이 없어요')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('myMeds'))).toEqual([]);
});
test('특대 글자 설정과 안내 메뉴의 시작 버튼이 동작한다', () => {
  render(<App />); fireEvent.click(screen.getByRole('button', { name: '특대' }));
  expect(screen.getByTestId('app-shell')).toHaveStyle({ fontSize: '20px' });
  navigate('복약안내'); fireEvent.click(screen.getByRole('button', { name: '약·영양제 추가하러 가기' }));
  expect(screen.getByRole('heading', { name: '약·영양제 추가하기' })).toBeInTheDocument();
  navigate('사용안내'); fireEvent.click(screen.getByRole('button', { name: '약·영양제 추가 시작하기' }));
  expect(screen.getByRole('heading', { name: '약·영양제 추가하기' })).toBeInTheDocument();
});
