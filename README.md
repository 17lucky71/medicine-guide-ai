# medicine-guide-ai

노인을 위한 약 정보 안내 AI 서비스 (OCR 기반 복약 안내)

> 이 서비스는 참고용이며, 의사·약사의 상담을 대체하지 않습니다. 안내 내용은 AI가 생성한 것입니다.

## 1. 개요
약봉투/처방전 사진을 OCR로 인식하고, 복용 중인 약과 새 약을 비교해
부작용과 주의사항을 알려 주는 서비스입니다.

## 프로젝트 배경

### 왜 만들었나
병원에서 처방받은 약은 이름이 어렵고 복용법과 주의사항이 작은 글씨로 적혀 있어,
내용을 정확히 이해하기 어렵습니다. 특히 이미 복용 중인 약이 있는 상태에서 새 약을 받으면
함께 먹어도 되는지 확인하기가 쉽지 않습니다.

### 왜 필요한가
- 여러 약을 함께 복용하면 약물 상호작용과 중복 복용의 위험이 커집니다.
- 약 정보를 찾으려면 검색이나 앱 조작이 필요한데, 약봉투를 사진으로 찍는 것만으로
  정보를 확인할 수 있다면 접근성이 크게 좋아집니다.

### 왜 노인인가
- 노인은 복용하는 약의 종류가 많아 상호작용과 부작용 위험이 큽니다.
- 작은 글씨와 복잡한 설명을 읽기 어렵고, 스마트폰 앱 조작에 익숙하지 않은 경우가 많습니다.
- 자녀·보호자가 멀리 있어 복약 상태를 함께 확인하기 어렵습니다.

### 해결 방법
- OCR로 약봉투를 자동 인식하고, 사용자가 확인·수정
- 복용 중인 약 기록을 저장해 새 약과 비교하고 주의사항 안내
- 큰 글자와 단순한 화면, 가족 공유 기능 제공

## 2. 팀원 역할
| 이름 | 역할 | 기여 요약 |
|---|---|---|
| 최영진 | 기획·문서·배포 | 기획서 틀 작성, 회의록 정리, 저장소 생성 및 README 작성 |
| 장보윤 | OCR 기능 | OCR 분석 후 확인·저장 기능 제안, 회의실 예약 |
| 이채리 | 약 비교·화면 | 큰 글자·가족 공유 기능, 복용 약 기초 데이터 저장 제안 |

## 3. 기술 스택

| 구분 | 기술 |
|---|---|
| 언어 | Python / JavaScript |
| 프레임워크 | FastAPI / React |
| OCR | Tesseract OCR 또는 Google Vision API |
| AI/추천 로직 | 약물 정보 비교 로직, LLM 기반 안내 생성 |
| DB | SQLite / PostgreSQL |
| 배포 | Docker / Render / Vercel |
| 기타 | OpenAI API, GitHub |

## 4. 실행 방법

### 1) 저장소 클론 및 이동
```bash
git clone [https://github.com/your-username/medicine-guide-ai.git](https://github.com/your-username/medicine-guide-ai.git)
cd medicine-guide-ai

### 2) 환경변수 설정
OPENAI_API_KEY=your_api_key
OCR_API_KEY=your_ocr_key
DATABASE_URL=your_database_url

### 2) 백엔드 실행
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### 3) 프론트엔드 실행
cd frontend
npm install
npm run dev

### 4) 환경변수 설정
OPENAI_API_KEY=your_api_key
OCR_API_KEY=your_ocr_key
DATABASE_URL=your_database_url

## 5. 결과

### 1) 구현결과
1) 구현 결과
약봉투/처방전 사진 업로드 기능 구현
OCR로 약 이름과 복용 정보를 추출
사용자가 인식 결과를 직접 확인하고 수정 가능
복용 중인 약과 새 약의 중복/주의 사항 안내
큰 글씨 중심의 노인 친화적 화면 구성
가족 공유 기능 또는 복약 기록 저장 기능 제공

### 2) 주요화면
메인 화면: 사진 업로드 및 약 정보 조회 시작
OCR 결과 화면: 인식된 약 이름/복용법 확인 및 수정
복약 비교 화면: 기존 복용 약과 새 약 비교
주의사항 화면: 부작용, 상호작용, 복용 시 유의사항 표시
기록 화면: 복용 약 목록과 이전 기록 확인\


## 배포 URL 및 평가자 접속 방법
URL: https://your-deployment-url.com
테스트 계정
아이디: 
비밀번호: 

## 6. 서비스 화면 캡처
메인 화면
OCR 결과 확인 화면
약 비교 결과 화면
예시
![메인 화면](./images/main.png)
![OCR 결과 화면](./images/ocr-result.png)
![약 비교 결과 화면](./images/compare-result.png)

## 7. 한계점 및 향후 개선
한계점
OCR 정확도가 이미지 품질에 따라 달라질 수 있음
일부 약 정보는 데이터베이스에 없을 수 있음
AI 설명이 실제 의료 판단을 완전히 대체할 수 없음

향후 개선
OCR 정확도 향상
약 정보 데이터베이스 확장
보호자 알림 기능 추가
음성 안내 기능 추가
복약 알림 기능 추가

##8. 주의사항
본 서비스는 참고용이며 진료나 처방을 대체하지 않습니다.
이상 증상 발생 시 즉시 의료진과 상담해야 합니다.
약 복용 전에는 반드시 의사 또는 약사의 안내를 확인해야 합니다.
응급 상황에서는 즉시 119 또는 가까운 의료기관에 연락해야 합니다.

##9. 라이선스
이 프로젝트의 라이선스는 추후 추가합니다.

##10. 문의
프로젝트 관련 문의는 아래로 연락할 수 있습니다.
Email: your-email@example.com
GitHub: https://github.com/your-username

