# API 명세

- 기준일: 2026-10-28
- 배포 Base URL: `https://medicine-guide-ai.vercel.app/api`
- 로컬 Base URL: `http://localhost:3000/api` (`frontend/`에서 `vercel dev` 기본 포트 사용)
- 별도 FastAPI 서버나 `localhost:8000` API는 운영하지 않습니다. API 키가 필요한 분석 요청은 Vercel 서버리스 함수에서 Gemini로 전달합니다.

## `GET /health`

Vercel 서버리스 함수의 생존 여부를 확인합니다. Gemini 호출이나 약 분석 기능까지 검증하지는 않습니다.

정상 응답 `200`:

```json
{
  "status": "ok",
  "service": "medicine-guide-ai",
  "timestamp": "2026-10-28T06:12:18.587Z"
}
```

GET 이외의 메서드는 `405` JSON 오류를 반환합니다.

## `POST /analyze`

요청 헤더는 `Content-Type: application/json`입니다.

사진 분석 요청:

```json
{
  "type": "image",
  "image": "data:image/jpeg;base64,...",
  "savedMeds": ["저장된 약 이름"]
}
```

약 이름 직접 검색 요청:

```json
{
  "type": "text",
  "query": "약 이름 또는 증상",
  "savedMeds": ["저장된 약 이름"]
}
```

- `savedMeds`는 선택 항목이며 서버에서 문자열만 받고 최대 30개, 각 60자로 제한합니다.
- `query`는 100자로 제한합니다.
- 이미지 입력은 `data:image/...;base64,` 형식이어야 합니다. 앱은 브라우저에서 긴 변을 최대 1400px로 축소해 전송합니다.
- 정상 응답 `200`: `{ "title": string, "comparison": string, "medicines": [...] }`
- 공통 오류 응답은 `{ "error": string }` 형식입니다.

| 상태 | 상황 |
|---:|---|
| `400` | 요청 형식 또는 이미지 형식 오류 |
| `405` | POST 이외의 메서드 |
| `422` | 분석 결과에서 약 이름을 읽지 못함 |
| `500` | `GEMINI_API_KEY` 미설정 또는 처리 중 예기치 않은 오류 |
| `502` | Gemini API 호출 실패 |

이미지는 서버 파일로 저장하지 않습니다. Gemini 키는 서버 환경변수 `GEMINI_API_KEY`에서만 읽습니다.
