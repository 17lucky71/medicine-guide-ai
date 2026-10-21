import { render, screen } from '@testing-library/react';
import App from './App';

// AI 생성 콘텐츠 안내 문구가 화면에 표시되는지 확인 (기능 요구사항 FR-06)
test('AI 생성 참고용 안내 문구를 표시한다', () => {
  render(<App />);
  const notices = screen.getAllByText(/AI가 생성한 참고/);
  expect(notices.length).toBeGreaterThan(0);
});

// 개인정보(사진 외부 전송) 동의 체크박스가 있는지 확인 (기능 요구사항 FR-07)
test('사진 전송 동의 체크박스를 표시한다', () => {
  render(<App />);
  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});
