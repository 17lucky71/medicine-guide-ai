# frontend

의약품 안내 AI의 React 앱과 Vercel 서버리스 함수(`api/analyze.js`)가 들어 있는 폴더입니다.
프로젝트 설명, 실행 방법, 배포 방법은 저장소 루트의 [README.md](../README.md)를 참고하세요.

## 자주 쓰는 명령
- `npm install` : 패키지 설치
- `vercel dev` : 화면과 서버리스 함수를 함께 로컬 실행 (`.env.local`에 `GEMINI_API_KEY` 필요)
- `npm test -- --watchAll=false` : 테스트 실행
- `npm run build` : 배포용 빌드
