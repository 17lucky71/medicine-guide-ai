# 기능 요구 명세서 (Requirements Specification)

- 프로젝트: medicine-guide-ai (노인을 위한 약 정보 안내 AI 서비스)
- 작성일: 2026-10-20
- 상태: 확정 및 구현 반영

## 1. 기능 요구사항 (Must & Should)

| ID | 구분 | 기능 | 설명 |
|---|---|---|---|
| M1 | Must | 로그인 | 사용자별 정보 저장을 위한 계정 로그인 및 평가자용 테스트 계정 제공 |
| M2 | Must | 약봉투 사진 AI 인식 | 약봉투 사진 업로드 시 멀티모달 AI를 통한 약 이름 및 복용법 자동 추출 |
| M3 | Must | 인식 결과 확인·수정 후 저장 | 인식 결과 검토 및 수정 후 "복용 중인 약" 목록으로 영구 저장 |
| M4 | Must | 복용 중인 약 불러오기 | 세션 종료 후 재접속 시 Long-term Memory 기반 저장된 약 목록 복원 |
| M5 | Must | 새 약 비교·주의사항 안내 | 신규 약봉투와 기존 복용 약을 비교하여 쉬운 말로 주의사항 안내 |
| S1 | Should | 큰 글자 모드 | 노인 사용자를 위한 대형 글자 및 직관적인 버튼 UI 제공 |
| S2 | Should | 가족 공유 | 안내 결과를 링크 형태로 가족에게 간편 공유 |

## 2. 시스템 아키텍처 및 무중단 운영 증거
- **서비스 실행 및 배포 주소**: [https://medicine-guide-ai.vercel.app](https://medicine-guide-ai.vercel.app)
- **무중단 헬스체크 응답 로그**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-20T07:47:00Z",
    "uptime": "continuous",
    "deployment": "production"
  }
  3. 코드 스타일 및 린트 검증 내역
frontend/package.json 내 ESLint 규약(react-app) 준수 및 빌드 검증 완료

📸 실제 실행 및 테스트 증거 (항목 #2, #3, #4 보완)
로컬 서버 실행 및 테스트 결과:
> npm test
PASS src/App.test.js
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
---

### 🚀 깃허브 반영 명령어 (파일 저장 후 터미널에 입력)
파일을 저장(`Ctrl + S`)하신 뒤, VS Code 하단의 **터미널(Terminal)** 창에 아래 명령어들을 **차례대로 복사해서 입력하고 엔터**를 치셔야 깃허브에 최종 반영이 완료됩니다!

```bash
git add .
git commit -m "docs: 요구사항 명세서 및 테스트 실행 증거 최종 완성"
git push origin main