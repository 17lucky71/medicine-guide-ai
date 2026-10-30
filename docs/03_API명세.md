# API 명세

- 기준일: 2026-10-28
- 배포 Base URL: `https://medicine-guide-ai.vercel.app/api`
- 로컬 Base URL: `http://localhost:3000/api` (`frontend/`에서 `vercel dev` 기본 포트 사용)
- 별도 FastAPI 서버나 `localhost:8000` API는 운영하지 않습니다. 분석 요청은 Vercel 서버리스 함수에서 AI 제공자로 전달합니다.

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
  "query": "약·영양제 제품 이름",
  "savedMeds": ["저장된 약 이름"]
}
```

- `savedMeds`는 선택 항목이며 서버에서 문자열만 받고 최대 30개, 각 60자로 제한합니다.
- `query`는 100자로 제한합니다.
- 이미지 입력은 `data:image/...;base64,` 형식이어야 합니다. 앱은 브라우저에서 긴 변을 최대 1400px로 축소해 전송합니다.
- 정상 응답 `200`: `{ "title": string, "comparison": string, "medicines": [...] }`
- 공통 오류 응답은 `{ "error": string }` 형식입니다.

## AI 처리 방식과 데이터 출처

- 사진 요청은 OCR 엔진이 문자열을 먼저 추출하는 방식이 아닙니다. 축소한 이미지 자체를 AI 모델에 보내고 모델이 읽은 내용을 JSON으로 반환합니다.
- 텍스트 요청은 사용자가 입력한 약·영양제 이름을 AI 모델에 전달해 정보를 생성하도록 합니다.
- 기본 제공자는 Gemini(`GEMINI_API_KEY`, 기본 모델 `gemini-2.5-flash`)입니다. 기관 API 키(`INSTITUTION_OPENAI_API_KEY`)와 주소를 설정하면 Gemini 사용량 한도 초과 시 OpenAI 호환 API를 대체 경로로 사용할 수 있습니다.
- 현재 식약처 등 공신력 있는 의약품 DB 조회나 결과 대조는 구현되어 있지 않습니다. 이름 검색 결과와 효능·복용법·주의사항은 AI 생성 결과이며 공식 DB에서 확인한 정보가 아닙니다.
- 이미지 파일은 앱 서버에 저장하지 않지만 분석을 위해 외부 AI 제공자에게 전송됩니다. 저장된 약 이름 목록은 브라우저 `localStorage`에 보관되고 다음 분석 요청에 포함됩니다.

| 상태 | 상황 |
|---:|---|
| `400` | 요청 형식 또는 이미지 형식 오류 |
| `405` | POST 이외의 메서드 |
| `422` | 사진 또는 이름 분석 결과에서 약 정보를 확인하지 못함 |
| `500` | 두 AI 제공자 키가 모두 없거나 처리 중 예기치 않은 오류 |
| `502` | 설정된 AI 제공자 API 호출 실패 |

이미지는 서버 파일로 저장하지 않습니다. AI 키는 서버 환경변수에서만 읽습니다.
