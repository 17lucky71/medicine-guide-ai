# 코드 품질 자동검증·리팩토링 기록

## 자동검증

- ESLint 설정은 `frontend/package.json`의 `react-app` 및 `react-app/jest` 규칙을 사용합니다.
- 로컬 검사 명령: `cd frontend` 후 `npm run lint`.
- 2026-10-28 로컬 실행 결과: ESLint 오류·경고 없이 종료 코드 0. [실행 기록](eslint-local-2026-10-28.txt)
- GitHub Actions: `.github/workflows/quality.yml`이 모든 PR과 main 반영 시 Node 20, `npm ci`, `npm run lint`를 실행합니다.
- CRA/Tailwind 하위 의존성의 선택적 peer와 `npm ci` 잠금이 맞도록 `yaml@2.9.1`을 개발 의존성으로 명시했습니다 (`c068c78`).
- PR #20에서 GitHub Actions를 실제 실행해 `npm ci`와 ESLint가 통과했습니다. [원격 실행 기록](eslint-ci-2026-10-28.md)

## 코드 정리

- `App.js`에서 UI 상태 처리와 localStorage 직접 접근을 분리했습니다.
- `medicationStorage.js`가 저장 약 목록을 읽고 쓰며, JSON 오류·저장소 접근 불가 시 빈 목록/무시 동작을 한곳에서 처리합니다.
- 동작 목적은 기존과 같고, 화면 컴포넌트가 저장소 예외 처리를 직접 담당하지 않도록 책임을 나눴습니다.

이 변경은 Git 기록의 `refactor: isolate medication storage and add ESLint CI` 커밋으로 확인할 수 있습니다.
