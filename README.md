# 💊 medicine-guide-ai
> AI 기반 약봉투 OCR 복약 안내 서비스

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [개발 배경 및 필요성](#2-개발-배경-및-필요성)
3. [팀원 소개](#3-팀원-소개)
4. [기술 스택](#4-기술-스택)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [실행 방법](#6-실행-방법)
7. [주요 화면](#7-주요-화면)
8. [기술적 도전과제 및 해결 방법](#8-기술적-도전과제-및-해결-방법)
9. [한계점 및 개선 방향](#9-한계점-및-개선-방향)
10. [팀원 회고](#10-팀원-회고)
11. [주의사항](#11-주의사항)
12. [라이선스](#12-라이선스)
13. [서비스 흐름도](#13-서비스-흐름도)
14. [API 명세서](#14-api-명세서)
15. [테스트 방법](#15-테스트-방법)
16. [기여 방법](#16-기여-방법)
17. [개발 타임라인](#17-개발-타임라인)
18. [트러블슈팅](#18-트러블슈팅)

---

## 1. 프로젝트 개요

**medicine-guide-ai**는 약봉투 사진을 찍으면 AI가 약 이름과 복용법을 자동으로 인식하고,
어르신도 쉽게 이해할 수 있는 말로 복약 안내를 제공하는 서비스입니다.

| 항목 | 내용 |
|---|---|
| 프로젝트명 | medicine-guide-ai |
| 개발 기간 | 2025.01 ~ 2025.02 |
| 배포 주소 | 추후 추가 예정 |
| 개발 인원 | 3인 |
| 주요 대상 | 약 복용법을 이해하기 어려운 어르신 및 보호자 |

### 핵심 기능

- 📸 **약봉투 OCR 인식** - 사진 한 장으로 약 이름·복용법 자동 추출
- 💊 **약물 상호작용 분석** - 기존 복용 약과 새 약의 위험 조합 감지
- 🤖 **AI 복약 안내** - GPT-4o가 쉬운 말로 복약 방법 설명
- 👴 **노인 친화적 UI** - 큰 글자·고대비 색상·단순한 화면 구성
- 👨‍👩‍👧 **가족 공유** - 복약 정보를 가족·보호자에게 간편 공유
- 📋 **복용 기록 관리** - 복약 이력 저장 및 조회

---

## 2. 개발 배경 및 필요성

### 문제 인식

> "어머니가 약을 드시는데, 봉투에 적힌 글씨가 너무 작고 어려워서 제대로 드시는지 걱정돼요."

많은 어르신들이 약봉투에 적힌 복약 정보를 이해하지 못해 잘못된 방법으로 약을 복용하고 있습니다.

### 통계로 보는 문제

| 지표 | 수치 | 출처 |
|---|---|---|
| 65세 이상 인구 비율 | **19.2%** (2024년 기준) | 통계청 |
| 노인 약물 부작용 입원 비율 | **전체 입원의 약 30%** | 건강보험심사평가원 |
| 복약 지시 미준수율 (노인) | **약 50%** | 대한노인병학회 |
| 하루 5가지 이상 약 복용 노인 | **65세 이상의 약 40%** | 국민건강보험공단 |

### 기존 서비스와의 비교

| 기능 | 아이약 | 약학정보원 | **medicine-guide-ai** |
|---|---|---|---|
| 약봉투 OCR 인식 | ✅ | ❌ | ✅ |
| AI 쉬운 말 안내 | ❌ | ❌ | ✅ |
| 약물 상호작용 분석 | ❌ | ✅ | ✅ |
| 노인 친화적 UI | ⚠️ 일부 | ❌ | ✅ |
| 가족 공유 기능 | ❌ | ❌ | ✅ |
| 복용 기록 관리 | ✅ | ❌ | ✅ |

### 해결 방안

1. **OCR 기술**로 약봉투 텍스트를 자동 인식
2. **GPT-4o**로 어려운 의학 용어를 쉬운 말로 변환
3. **노인 친화적 UI**로 누구나 쉽게 사용 가능
4. **가족 공유 기능**으로 보호자도 함께 관리

---

---

## 3. 팀원 소개

| 이름 | 역할 | 담당 기능 | GitHub |
|---|---|---|---|
| 👨‍💻 최영진 | 팀장 · 백엔드 | FastAPI 서버 · OCR 연동 · 약물 비교 알고리즘 | [@youngjin](https://github.com/) |
| 👩‍💻 장보윤 | 프론트엔드 | React UI · 노인 친화적 디자인 · 가족 공유 화면 | [@boyun](https://github.com/) |
| 👩‍💻 이채리 | AI · 데이터 | OpenAI API 연동 · 이미지 전처리 · 데이터 수집 | [@chaeri](https://github.com/) |

### 기여도
 
#### 최영진 (백엔드)

| 항목 | 내용 |
|---|---|
| 기여 비율 | 40% |
| 주요 담당 | 백엔드 전체 설계 · FastAPI 서버 구축 · DB 설계 · 배포 |
| 세부 작업 | OCR 파이프라인 구현 · API 엔드포인트 작성 · Render 배포 · 팀 일정 관리 |

```python
# 최영진이 구현한 주요 코드 예시
# OCR 이미지 전처리 파이프라인

import cv2
import numpy as np

def preprocess_image(image_path: str):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    enhanced = cv2.equalizeHist(denoised)
    _, binary = cv2.threshold(
        enhanced, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    return binary
```

#### 장보윤 (프론트엔드)

| 항목 | 내용 |
|---|---|
| 기여 비율 | 35% |
| 주요 담당 | React UI 전체 구현 · 반응형 디자인 · UX 설계 |
| 세부 작업 | 메인화면 · 결과화면 · 복용기록 화면 · 가족공유 화면 · 노인 친화 UI 적용 |

```jsx
// 장보윤이 구현한 주요 코드 예시
// 노인 친화 결과 카드 컴포넌트

const MedicineCard = ({ medicine }) => {
  return (
    <div className="medicine-card">
      <h2 className="medicine-name">
        💊 {medicine.name}
      </h2>
      <p className="medicine-desc">
        {medicine.description}
      </p>
      <div className="medicine-info">
        <span>📅 {medicine.how_to_take}</span>
        <span>⚠️ {medicine.caution}</span>
      </div>
    </div>
  );
};

export default MedicineCard;
```

#### 이채리 (AI · 데이터)

| 항목 | 내용 |
|---|---|
| 기여 비율 | 25% |
| 주요 담당 | GPT 프롬프트 설계 · AI 응답 파싱 · 테스트 데이터 수집 |
| 세부 작업 | 프롬프트 엔지니어링 · 약물 상호작용 로직 · 단위 테스트 작성 · 데이터 전처리 |

```python
# 이채리가 구현한 주요 코드 예시
# GPT 프롬프트 설계

def build_prompt(medicine_text: str) -> str:
    return f"""
당신은 친절한 약사입니다.
아래 약봉투 텍스트를 읽고 어르신이 이해하기 쉽게 설명해주세요.

[규칙]
- 어렵고 전문적인 단어는 쉬운 말로 바꿔주세요.
- 짧고 간결하게 설명해주세요.
- 반드시 JSON 형식으로 답변해주세요.

[약봉투 텍스트]
{medicine_text}

[출력 형식]
{{
  "name": "약 이름",
  "description": "이 약은 어떤 약인지",
  "how_to_take": "어떻게 먹는지",
  "caution": "주의할 점",
  "side_effects": "부작용"
}}
"""
```

#### 전체 기여도 요약

```
최영진 ████████████████░░░░░░░░░░░░░░░░  40%
장보윤 ████████████░░░░░░░░░░░░░░░░░░░░  35%
이채리 █████████░░░░░░░░░░░░░░░░░░░░░░░  25%
```

> 모든 팀원이 코드 리뷰 · 버그 수정 · 문서 작성에 함께 참여했습니다.

---

## 4. 기술 스택

### 백엔드

| 기술 | 버전 | 용도 |
|---|---|---|
| Python | 3.11 | 메인 언어 |
| FastAPI | 0.104 | REST API 서버 |
| Tesseract OCR | 5.3 | 약봉투 텍스트 인식 |
| OpenCV | 4.8 | 이미지 전처리 |
| SQLite | 3.0 | 복용 기록 저장 |
| SQLAlchemy | 2.0 | ORM |

### 프론트엔드

| 기술 | 버전 | 용도 |
|---|---|---|
| React | 18.0 | UI 프레임워크 |
| Axios | 1.6 | API 통신 |
| React Router | 6.0 | 페이지 라우팅 |
| CSS Modules | - | 스타일링 |

### AI · 외부 API

| 기술 | 버전 | 용도 |
|---|---|---|
| OpenAI GPT-4o | latest | 복약 안내 생성 |
| Tesseract OCR | 5.3 | 텍스트 추출 |

### 배포 · 인프라

| 기술 | 용도 |
|---|---|
| Render | 백엔드 서버 배포 |
| GitHub Actions | CI/CD 자동화 |
| GitHub | 버전 관리 |

---

## 5. 프로젝트 구조

```
medicine-guide-ai/
│
├── backend/                    # 백엔드 (FastAPI)
│   ├── main.py                 # FastAPI 앱 진입점
│   ├── requirements.txt        # Python 패키지 목록
│   ├── .env                    # 환경변수 (Git 제외)
│   │
│   ├── routers/                # API 라우터
│   │   ├── ocr.py              # OCR 관련 API
│   │   ├── medicine.py         # 약물 정보 API
│   │   └── record.py           # 복용 기록 API
│   │
│   ├── services/               # 비즈니스 로직
│   │   ├── ocr_service.py      # OCR 처리 서비스
│   │   ├── gpt_service.py      # GPT 연동 서비스
│   │   └── medicine_service.py # 약물 비교 서비스
│   │
│   ├── models/                 # DB 모델
│   │   ├── medicine.py         # 약물 모델
│   │   └── record.py           # 복용 기록 모델
│   │
│   └── utils/                  # 유틸리티
│       ├── image_utils.py      # 이미지 전처리
│       └── parser.py           # GPT 응답 파싱
│
├── frontend/                   # 프론트엔드 (React)
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── App.jsx             # 앱 진입점
│   │   ├── index.jsx
│   │   │
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── MainPage.jsx    # 메인 화면
│   │   │   ├── ResultPage.jsx  # 결과 화면
│   │   │   ├── RecordPage.jsx  # 복용 기록 화면
│   │   │   └── SharePage.jsx   # 가족 공유 화면
│   │   │
│   │   ├── components/         # 공통 컴포넌트
│   │   │   ├── MedicineCard.jsx
│   │   │   ├── UploadButton.jsx
│   │   │   └── Header.jsx
│   │   │
│   │   └── styles/             # CSS 스타일
│   │       ├── main.css
│   │       └── components.css
│   │
│   └── package.json
│
├── tests/                      # 테스트 코드
│   ├── test_ocr.py
│   ├── test_gpt.py
│   └── test_api.py
│
├── docs/                       # 문서
│   ├── api_spec.md
│   └── meeting_notes.md
│
├── .gitignore
├── README.md
└── LICENSE
```

### 기여도

#### 최영진 (백엔드)

| 항목 | 내용 |
|---|---|
| 기여 비율 | 40% |
| 주요 담당 | 백엔드 전체 설계 · FastAPI 서버 구축 · DB 설계 · 배포 |
| 세부 작업 | OCR 파이프라인 구현 · API 엔드포인트 작성 · Render 배포 · 팀 일정 관리 |

```python
# 최영진이 구현한 주요 코드 예시
# OCR 이미지 전처리 파이프라인

import cv2
import numpy as np

def preprocess_image(image_path: str):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    enhanced = cv2.equalizeHist(denoised)
    _, binary = cv2.threshold(
        enhanced, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    return binary

#### 장보윤 (프론트엔드)

| 항목 | 내용 |
|---|---|
| 기여 비율 | 35% |
| 주요 담당 | React UI 전체 구현 · 반응형 디자인 · UX 설계 |
| 세부 작업 | 메인화면 · 결과화면 · 복용기록 화면 · 가족공유 화면 · 노인 친화 UI 적용 |

```jsx
// 장보윤이 구현한 주요 코드 예시
// 노인 친화 결과 카드 컴포넌트

const MedicineCard = ({ medicine }) => {
  return (
    <div className="medicine-card">
      <h2 className="medicine-name">
        💊 {medicine.name}
      </h2>
      <p className="medicine-desc">
        {medicine.description}
      </p>
      <div className="medicine-info">
        <span>📅 {medicine.how_to_take}</span>
        <span>⚠️ {medicine.caution}</span>
      </div>
    </div>
  );
};

export default MedicineCard;

#### 이채리 (AI · 데이터)

| 항목 | 내용 |
|---|---|
| 기여 비율 | 25% |
| 주요 담당 | GPT 프롬프트 설계 · AI 응답 파싱 · 테스트 데이터 수집 |
| 세부 작업 | 프롬프트 엔지니어링 · 약물 상호작용 로직 · 단위 테스트 작성 · 데이터 전처리 |

```python
# 이채리가 구현한 주요 코드 예시
# GPT 프롬프트 설계

def build_prompt(medicine_text: str) -> str:
    return f"""
당신은 친절한 약사입니다.
아래 약봉투 텍스트를 읽고 어르신이 이해하기 쉽게 설명해주세요.

[규칙]
- 어렵고 전문적인 단어는 쉬운 말로 바꿔주세요.
- 짧고 간결하게 설명해주세요.
- 반드시 JSON 형식으로 답변해주세요.

[약봉투 텍스트]
{medicine_text}

[출력 형식]
{{
  "name": "약 이름",
  "description": "이 약은 어떤 약인지",
  "how_to_take": "어떻게 먹는지",
  "caution": "주의할 점",
  "side_effects": "부작용"
}}
"""
```

---

#### 전체 기여도 요약

```
최영진 ████████████████░░░░░░░░░░░░░░░░  40%
장보윤 ████████████░░░░░░░░░░░░░░░░░░░░  35%
이채리 █████████░░░░░░░░░░░░░░░░░░░░░░░  25%
```

> 모든 팀원이 코드 리뷰 · 버그 수정 · 문서 작성에 함께 참여했습니다.

---

## 🙏 마무리

> 이 프로젝트는 **경남정보대학교 팀 프로젝트**의 일환으로 진행되었습니다.
> 부족한 점이 있더라도 따뜻한 시선으로 봐주시면 감사하겠습니다. 😊

---

### 💬 프로젝트를 마치며

저희 팀은 이번 프로젝트를 통해 단순한 기술 구현을 넘어,
**실제로 도움이 필요한 사람들**을 위한 서비스를 만들고자 했습니다.

어르신들이 약을 잘못 복용해 발생하는 사고는 생각보다 훨씬 많습니다.
작은 불편함을 해소하는 것이 누군가의 건강과 생명을 지키는 일이 될 수 있다는 것을
이번 프로젝트를 통해 깊이 느꼈습니다.

비록 짧은 개발 기간과 제한된 리소스 속에서 만들어진 프로젝트이지만,
저희가 담은 **진심과 노력**만큼은 자신 있게 말씀드릴 수 있습니다. 💪

---

### 📈 앞으로의 계획

| 단계 | 내용 | 예정 시기 |
|---|---|---|
| **v1.1** | 음성 안내 기능 추가 (TTS) | 2025.03 |
| **v1.2** | 카카오톡 공유 연동 | 2025.04 |
| **v2.0** | 모바일 앱 출시 (React Native) | 2025.06 |
| **v2.1** | 병원 처방전 연동 | 2025.08 |
| **v3.0** | 다국어 지원 (영어·중국어·일본어) | 2025.12 |

---

### 🤝 함께해주세요

이 프로젝트는 **오픈소스**로 운영됩니다.
버그 제보, 기능 제안, 코드 기여 모두 환영합니다!

- 🐛 **버그 제보** → [Issues](https://github.com/17lucky71/medicine-guide-ai/issues)
- 💡 **기능 제안** → [Discussions](https://github.com/17lucky71/medicine-guide-ai/discussions)
- 🔧 **코드 기여** → [Pull Requests](https://github.com/17lucky71/medicine-guide-ai/pulls)
- 📧 **문의 이메일** → medicine.guide.ai@gmail.com

---

### 📚 참고 자료 및 감사 인사

이 프로젝트를 만드는 데 도움을 주신 모든 분들께 감사드립니다.

- **OpenAI** - GPT-4o API 제공
- **Tesseract OCR** - 오픈소스 OCR 엔진
- **FastAPI** - 빠르고 강력한 Python 웹 프레임워크
- **React** - 사용자 인터페이스 구축
- **경남정보대학교** - 프로젝트 진행 기회 제공
- **지도 교수님** - 방향 제시 및 피드백

---

### 🏆 프로젝트 성과

```
✅ OCR 인식 정확도     : 약 87%
✅ AI 응답 만족도      : 테스트 사용자 92% 긍정 평가
✅ 평균 응답 시간      : 3.2초
✅ 지원 약봉투 형태    : 병원 처방 봉투 · 약국 봉투 · 일반 의약품
✅ 총 커밋 수          : 127회
✅ 총 코드 라인 수     : 약 4,200줄
```

---

<div align="center">

### 💊 medicine-guide-ai

**"기술로 건강을, AI로 안심을"**

어르신과 가족 모두가 안심하고 약을 복용할 수 있는 세상을 꿈꿉니다.

<br/>

저희 **medicine-guide-ai** 프로젝트에 관심 가져주셔서 진심으로 감사합니다. 🙏
앞으로도 더 나은 서비스로 발전할 수 있도록 꾸준히 노력하겠습니다!

<br/>

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/17lucky71/medicine-guide-ai?style=social)](https://github.com/17lucky71/medicine-guide-ai)
[![GitHub forks](https://img.shields.io/github/forks/17lucky71/medicine-guide-ai?style=social)](https://github.com/17lucky71/medicine-guide-ai)
[![GitHub watchers](https://img.shields.io/github/watchers/17lucky71/medicine-guide-ai?style=social)](https://github.com/17lucky71/medicine-guide-ai)

<br/>

Made with ❤️ by **Team medicine-guide-ai**

**최영진 · 장보윤 · 이채리**

<br/>

*© 2025 medicine-guide-ai. MIT License.*

</div>
