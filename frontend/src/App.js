import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('medium');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 텍스트 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setResult({
        name: query,
        efficacy: '통증 완화, 해열 및 소염 작용을 돕습니다.',
        dosage: '1일 3회, 식후 30분 복용 (증상에 따라 조절)',
        warning: '복용 중 음주는 피해주시고, 졸음이 올 수 있으니 운전 시 주의하세요.',
      });
      setLoading(false);
    }, 600);
  };

  // 이미지 파일 선택(업로드) 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setLoading(true);

      // OCR 분석 시뮬레이션 (나중에 백엔드 OCR API와 연동할 수 있습니다)
      setTimeout(() => {
        setQuery('타이레놀정 500mg (OCR 인식)');
        setResult({
          name: '타이레놀정 500mg (약봉투 인식 결과)',
          efficacy: '발열 및 통증, 두통, 신경통, 근육통 완화',
          dosage: '1일 3~4회, 필요시 공복을 피하여 복용',
          warning: '매일 한 잔 이상 술을 마시는 사람이 이 약을 복용할 경우 간 손상이 유발될 수 있습니다.',
        });
        setLoading(false);
      }, 1000);
    }
  };

  // 음성 안내 (TTS) 기능
  const handleSpeak = () => {
    if (!result) return;
    window.speechSynthesis.cancel();

    const textToSpeak = `
      약 이름, ${result.name}. 
      효능 및 효과, ${result.efficacy}. 
      용법 및 용량, ${result.dosage}. 
      주의사항, ${result.warning}
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`container font-${fontSize}`}>
      <header className="header">
        <div className="top-controls">
          <div className="logo-badge">AI Health Guide</div>
          <div className="font-resizer">
            <span>글자 크기:</span>
            <button 
              className={fontSize === 'small' ? 'active' : ''} 
              onClick={() => setFontSize('small')}
            >보통</button>
            <button 
              className={fontSize === 'medium' ? 'active' : ''} 
              onClick={() => setFontSize('medium')}
            >크게</button>
            <button 
              className={fontSize === 'large' ? 'active' : ''} 
              onClick={() => setFontSize('large')}
            >매우 크게</button>
          </div>
        </div>

        <h1>💊 약봉투 AI 안내 서비스</h1>
        <p>약봉투 사진을 찍어 올리거나, 약 이름을 직접 입력해 주세요.</p>
      </header>

      {/* OCR 사진 업로드 박스 */}
      <div className="upload-section">
        <label htmlFor="ocr-file-input" className="upload-box">
          <div className="upload-icon">📷</div>
          <div className="upload-text">
            <strong>약봉투 사진 업로드하기</strong>
            <span>카메라로 촬영하거나 갤러리에서 선택하세요</span>
          </div>
          <input 
            id="ocr-file-input" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </label>
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="약봉투 미리보기" />
            <p>✅ 사진이 업로드되었습니다. OCR 분석 중...</p>
          </div>
        )}
      </div>

      <div className="divider"><span>또는 직접 검색</span></div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 타이레놀, 감기약 복용법, 두통..."
          className="search-input"
        />
        <button type="submit" className="search-button">검색하기</button>
      </form>

      {loading && <div className="loading-message">⏳ AI가 약 정보를 분석하고 있습니다...</div>}

      {result && !loading && (
        <div className="result-card">
          <div className="result-header">
            <span className="badge">복약 안내 결과</span>
            <div className="result-title-row">
              <h2>{result.name}</h2>
              <button onClick={handleSpeak} className="tts-button" title="음성으로 듣기">
                🔊 음성 안내 듣기
              </button>
            </div>
          </div>
          <div className="result-body">
            <div className="result-item">
              <strong>✨ 효능 및 효과</strong>
              <p>{result.efficacy}</p>
            </div>
            <div className="result-item">
              <strong>⏰ 용법 및 용량</strong>
              <p>{result.dosage}</p>
            </div>
            <div className="result-item warning">
              <strong>⚠️ 주의사항</strong>
              <p>{result.warning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;