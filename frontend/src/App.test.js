import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const analysisResult = {
  title: '복약 안내 결과',
  comparison: '함께 복용할 때 약사에게 확인하세요.',
  medicines: [
    {
      name: '타이레놀',
      efficacy: '통증과 열을 낮춥니다.',
      dosage: '처방된 용법을 따르세요.',
      warning: '복용 전 의사·약사에게 확인하세요.'
    }
  ]
};

const clickNavigation = (label) => {
  fireEvent.click(screen.getAllByRole('button', { name: label })[0]);
};

const enterSearch = (value) => {
  fireEvent.change(screen.getByRole('searchbox', { name: '약 이름이나 증상' }), {
    target: { value }
  });
  fireEvent.click(screen.getByRole('button', { name: '검색하기' }));
};

const mockSuccessfulAnalysis = () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => analysisResult
  });
};

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

test('AI 생성 참고용 안내 문구를 표시한다', () => {
  render(<App />);

  expect(screen.getAllByText(/AI가 생성한 참고/).length).toBeGreaterThan(0);
});

test('사진 전송 동의 체크박스를 표시한다', () => {
  render(<App />);

  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});

test('내 복용약 메뉴를 선택하면 저장 약 화면을 보여준다', () => {
  render(<App />);

  clickNavigation('내 복용약');

  expect(screen.getByRole('heading', { name: '내 복용약' })).toBeInTheDocument();
  expect(screen.getByText('아직 저장한 약이 없어요')).toBeInTheDocument();
});

test('복약안내의 시작 버튼을 누르면 처방전 분석 화면으로 이동한다', () => {
  render(<App />);
  clickNavigation('복약안내');

  fireEvent.click(screen.getByRole('button', { name: '처방전 분석하러 가기' }));

  expect(screen.getByRole('heading', { name: '처방전 분석' })).toBeInTheDocument();
});

test('사용안내의 분석 시작 버튼을 누르면 처방전 분석 화면으로 이동한다', () => {
  render(<App />);
  clickNavigation('사용안내');

  fireEvent.click(screen.getByRole('button', { name: '처방전 분석 시작하기' }));

  expect(screen.getByRole('heading', { name: '처방전 분석' })).toBeInTheDocument();
});

test('글자 크기 선택이 앱의 글자 크기를 바꾼다', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '특대' }));

  expect(screen.getByTestId('app-shell')).toHaveStyle({ fontSize: '20px' });
});

test('약 이름을 입력하기 전에는 검색 버튼이 비활성화되어 있다', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: '검색하기' })).toBeDisabled();
});

test('검색어 앞뒤 공백을 제거하고 저장된 약 목록과 함께 API를 호출한다', async () => {
  localStorage.setItem('myMeds', JSON.stringify(['이부프로펜']));
  mockSuccessfulAnalysis();
  render(<App />);

  enterSearch('  타이레놀  ');

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  const request = JSON.parse(global.fetch.mock.calls[0][1].body);

  expect(global.fetch.mock.calls[0][0]).toBe('/api/analyze');
  expect(request).toEqual({
    type: 'text',
    query: '타이레놀',
    savedMeds: ['이부프로펜']
  });
});

test('분석 성공 시 약 정보와 저장된 약 비교 안내를 표시한다', async () => {
  mockSuccessfulAnalysis();
  render(<App />);

  enterSearch('타이레놀');

  expect(await screen.findByRole('heading', { name: '복약 안내 결과' })).toBeInTheDocument();
  expect(screen.getByDisplayValue('타이레놀')).toBeInTheDocument();
  expect(screen.getByText('통증과 열을 낮춥니다.')).toBeInTheDocument();
  expect(screen.getByText(/함께 복용할 때 약사에게 확인하세요/)).toBeInTheDocument();
});

test('분석 API 오류를 사용자에게 표시한다', async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ error: '분석 서버에 연결할 수 없습니다.' })
  });
  render(<App />);

  enterSearch('타이레놀');

  expect(await screen.findByRole('alert')).toHaveTextContent('분석 서버에 연결할 수 없습니다.');
});

test('확인한 약을 저장하고 내 복용약 메뉴에서 확인할 수 있다', async () => {
  mockSuccessfulAnalysis();
  render(<App />);
  enterSearch('타이레놀');
  await screen.findByRole('heading', { name: '복약 안내 결과' });

  fireEvent.click(screen.getByRole('button', { name: '확인한 약을 복용 중인 약으로 저장' }));

  expect(screen.getByRole('status')).toHaveTextContent('1개 약을 저장했습니다.');
  expect(JSON.parse(localStorage.getItem('myMeds'))).toEqual(['타이레놀']);

  clickNavigation('내 복용약');
  expect(screen.getByText('타이레놀')).toBeInTheDocument();
});

test('저장된 약을 삭제하면 목록과 localStorage에서 제거한다', () => {
  localStorage.setItem('myMeds', JSON.stringify(['타이레놀']));
  render(<App />);
  clickNavigation('내 복용약');

  fireEvent.click(screen.getByRole('button', { name: '타이레놀 삭제' }));

  expect(screen.getByText('아직 저장한 약이 없어요')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('myMeds'))).toEqual([]);
});

test('이미 저장된 약은 다시 저장해도 중복되지 않는다', async () => {
  localStorage.setItem('myMeds', JSON.stringify(['타이레놀']));
  mockSuccessfulAnalysis();
  render(<App />);
  enterSearch('타이레놀');
  await screen.findByRole('heading', { name: '복약 안내 결과' });

  fireEvent.click(screen.getByRole('button', { name: '확인한 약을 복용 중인 약으로 저장' }));

  expect(JSON.parse(localStorage.getItem('myMeds'))).toEqual(['타이레놀']);
});
