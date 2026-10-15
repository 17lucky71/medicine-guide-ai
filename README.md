# 💊 medicine-guide-ai

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)

> 노인을 위한 OCR 기반 복약 안내 AI 서비스

> ⚠️ 이 서비스는 참고용이며, 의사·약사의 상담을 대체하지 않습니다.

---

## 📌 목차

1. [개요](#1-개요)
2. [프로젝트 배경](#2-프로젝트-배경)
3. [팀원 역할](#3-팀원-역할)
4. [기술 스택](#4-기술-스택)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [실행 방법](#6-실행-방법)
7. [결과](#7-결과)
8. [한계점 및 향후 개선](#8-한계점-및-향후-개선)
9. [주의사항](#9-주의사항)
10. [라이선스](#10-라이선스)

---

## 1. 개요

약봉투나 처방전 사진을 OCR로 인식하고,  
복용 중인 약과 새 약을 비교해 부작용과 주의사항을 알려 주는 서비스입니다.

**참고 서비스: 아이약** (제안: 장보윤)
- 처방전·약봉투 촬영 인식, 복용 약 안전성 확인, 약 알람 및 기록
- **우리 서비스의 차별점**: 노인 사용자 중심의 큰 글자·단순 화면, 보호자(가족) 공유 기능

---

## 2. 프로젝트 배경

### 왜 만들었나
병원에서 처방받은 약은 이름이 어렵고 복용법과 주의사항이 작은 글씨로 적혀 있어  
내용을 정확히 이해하기 어렵습니다.  
이미 복용 중인 약이 있는 상태에서 새 약을 받으면  
함께 먹어도 되는지 확인하기가 쉽지 않습니다.

### 왜 노인인가
- 복용하는 약의 종류가 많아 상호작용과 부작용 위험이 큽니다.
- 작은 글씨와 복잡한 설명을 읽기 어렵습니다.
- 스마트폰 앱 조작에 익숙하지 않은 경우가 많습니다.
- 자녀·보호자가 멀리 있어 복약 상태를 함께 확인하기 어렵습니다.

### 해결 방법
팀 회의(디스코드)에서 도출한 핵심 기능입니다.

> 💬 **장보윤**: "약봉지를 OCR로 분석해서 받아들인 정보를 한번 확인해서 저장되게끔 하는게 좋을 것 같아요"  
> 💬 **이채리**: "추가하면 좋을 것 같은 기능: 큰 글자 기능, 가족과 공유 기능"  
> 💬 **이채리**: "기존에 복용 중인 약이 있으면 기초 데이터로 저장"  
> 💬 **장보윤**: "타겟층이 노년층인거죠"

---

## 3. 팀원 역할

| 이름 | 역할 | 기여 요약 |
|---|---|---|
| 최영진 | 기획·문서·배포 | 기획서 작성, 회의록 정리, 저장소 생성 및 README 작성, 배포 환경 구성 |
| 장보윤 | OCR 기능·기획 | 참고 서비스(아이약) 제안, OCR 연동, 이미지 전처리 로직 구현, PBL실 예약 진행 |
| 이채리 | 약 비교·화면 | 약물 비교 로직 구현, 큰 글자 UI 구성, 가족 공유 및 복용 기록 저장 기능 구현 |

---

## 4. 기술 스택

| 구분 | 기술 |
|---|---|
| 언어 | Python / JavaScript |
| 프레임워크 | FastAPI / React |
| OCR | Tesseract OCR 또는 Google Vision API |
| AI | LLM 기반 안내 생성 (OpenAI API) |
| DB | SQLite / PostgreSQL |
| 배포 | Render (`render.yaml`) |
| 기타 | MCP Server, GitHub Actions |

---

## 5. 프로젝트 구조

```
medicine-guide-ai/
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── backend/             # FastAPI 서버
├── docs/                # 기획 문서, 회의록, 증빙 자료
├── frontend/            # React 클라이언트
├── mcp_server/          # MCP 서버
├── .gitignore
├── README.md
└── render.yaml          # Render 배포 설정
```

---

## 6. 실행 방법

### 1) 저장소 클론
```bash
git clone https://github.com/17lucky71/medicine-guide-ai.git
cd medicine-guide-ai
```

### 2) 환경변수 설정
`.env.example`을 복사해 `.env` 파일을 만들고 실제 키를 입력합니다.

```bash
cp .env.example .env
```

```env
# .env.example
OPENAI_API_KEY=your_openai_api_key_here
OCR_API_KEY=your_ocr_api_key_here
DATABASE_URL=sqlite:///./medicine.db
```

> ⚠️ `.env` 파일은 절대 GitHub에 올리지 마세요.

### 3) 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4) 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

---

## 7. 결과

### 구현 기능
- 약봉투/처방전 사진 업로드 및 OCR 자동 인식
- 사용자가 인식 결과를 직접 확인하고 수정 가능
- 복용 중인 약과 새 약의 중복 및 주의사항 안내
- 큰 글씨 중심의 노인 친화적 화면 구성
- 가족 공유 기능 및 복약 기록 저장

### 주요 화면
| 화면 | 설명 |
|---|---|
| 메인 화면 | 사진 업로드 및 약 정보 조회 시작 |
| OCR 결과 화면 | 인식된 약 이름/복용법 확인 및 수정 |
| 복약 비교 화면 | 기존 복용 약과 새 약 비교 |
| 주의사항 화면 | 부작용, 상호작용, 복용 시 유의사항 표시 |
| 기록 화면 | 복용 약 목록과 이전 기록 확인 |

---

## 8. 한계점 및 향후 개선

### 한계점
- OCR 정확도가 이미지 품질에 따라 달라질 수 있음
- 일부 약 정보는 데이터베이스에 없을 수 있음
- AI 설명이 실제 의료 판단을 완전히 대체할 수 없음

### 향후 개선
- OCR 정확도 향상
- 약 정보 데이터베이스 확장
- 음성 안내 기능 추가
- 복약 알림 기능 추가

---

## 9. 주의사항

- 본 서비스는 참고용이며 진료나 처방을 대체하지 않습니다.
- 이상 증상 발생 시 즉시 의료진과 상담해야 합니다.
- 응급 상황에서는 즉시 119 또는 가까운 의료기관에 연락해야 합니다.

---

## 10. 라이선스

This project is licensed under the [MIT License](./LICENSE).

---

## 📬 문의

- GitHub: https://github.com/17lucky71/medicine-guide-ai
