import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('medium');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setLoading(true);

      setTimeout(() => {
        setQuery('타이레놀정 500mg');
        setResult({
          name: '타이레놀정 500mg (처방전/약봉투 인식)',
          efficacy: '발열 및 통증, 두통, 신경통, 근육통 완화',
          dosage: '1일 3~4회, 필요시 공복을 피하여 복용',
          warning: '매일 한 잔 이상 술을 마시는 사람이 이 약을 복용할 경우 간 손상이 유발될 수 있습니다.',
        });
        setLoading(false);
      }, 1000);
    }
  };

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
    <div className={`app-wrapper font-${fontSize}`}>
      <div className="mobile-container">
        
        {/* 상단 앱바 영역 */}
        <header className="app-header">
          <div className="brand-area">
            <span className="app-logo-icon">💊</span>
            <span className="app-title">아이약 AI</span>
          </div>
          <div className="font-resizer">
            <span className="resizer-label">글자 크기</span>
            <button 
              type="button"
              className={fontSize === 'small' ? 'active' : ''} 
              onClick={() => setFontSize('small')}
            >기본</button>
            <button 
              type="button"
              className={fontSize === 'medium' ? 'active' : ''} 
              onClick={() => setFontSize('medium')}
            >크게</button>
            <button 
              type="button"
              className={fontSize === 'large' ? 'active' : ''} 
              onClick={() => setFontSize('large')}
            >아주 크게</button>
          </div>
        </header>

        {/* 메인 타이틀 배너 */}
        <div className="hero-banner">
          <h2>처방전·약봉투 찍고<br/><span>쉽고 편하게 관리하세요</span></h2>
          <p>어르신과 아이 약 복용, AI가 친절하게 알려드립니다.</p>
        </div>

        {/* OCR 사진 업로드 카드 */}
        <div className="upload-card">
          <label htmlFor="ocr-file-input" className="upload-label">
            <div className="upload-icon-wrapper">📸</div>
            <div className="upload-text-group">
              <strong>약봉투 / 처방전 사진 촬영하기</strong>
              <span>갤러리에서 선택하거나 카메라로 찍어보세요</span>
            </div>
          </label>
          <input 
            id="ocr-file-input" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage} alt="업로드 미리보기" />
              <p>✨ 사진 분석이 완료되었습니다!</p>
            </div>
          )}
        </div>

        <div className="divider-line"><span>또는 약 이름 직접 검색</span></div>

        {/* 검색 입력창 */}
        <form onSubmit={handleSearch} className="search-box-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 타이레놀, 감기약, 진통제..."
            className="modern-search-input"
          />
          <button type="submit" className="modern-search-btn">검색</button>
        </form>

        {loading && <div className="loading-spinner">⏳ AI가 약 정보를 분석하고 있어요...</div>}

        {/* 결과 카드 영역 */}
        {result && !loading && (
          <div className="result-result-card">
            <div className="result-card-top">
              <div className="result-badge">AI 분석 완료</div>
              <button type="button" onClick={handleSpeak} className="tts-action-btn">
                🔊 음성으로 듣기
              </button>
            </div>
            
            <h3 className="medicine-title">{result.name}</h3>

            <div className="info-section">
              <div className="info-row">
                <span className="info-icon">✨</span>
                <div>
                  <strong>효능 및 효과</strong>
                  <p>{result.efficacy}</p>
                </div>
              </div>

              <div className="info-row">
                <span className="info-icon">⏰</span>
                <div>
                  <strong>용법 및 용량</strong>
                  <p>{result.dosage}</p>
                </div>
              </div>

              <div className="info-row warning-box">
                <span className="info-icon">⚠️</span>
                <div>
                  <strong>주의사항</strong>
                  <p>{result.warning}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;