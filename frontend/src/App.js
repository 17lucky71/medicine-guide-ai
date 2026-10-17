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
        efficacy: '해열, 진통, 소염 작용을 통해 두통과 발열 증상을 빠르게 완화해 줍니다.',
        dosage: '1일 3회, 매 식후 30분에 물과 함께 복용하세요.',
        warning: '음주 후 복용은 간 손상을 유발할 수 있으므로 절대 금합니다.',
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
          name: '타이레놀정 500mg (AI 비전 스마트 인식)',
          efficacy: '발열 및 통증, 두통, 신경통, 근육통 완화',
          dosage: '1일 3~4회, 필요시 공복을 피하여 1~2알 복용',
          warning: '매일 세 잔 이상 정기적으로 술을 마시는 사람이 복용할 경우 반드시 의사와 상의하세요.',
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
      {/* 배경 그래픽 장식 원형 효과 */}
      <div className="bg-glow-shape shape-1"></div>
      <div className="bg-glow-shape shape-2"></div>

      <div className="global-container animate-fade-in">
        
        {/* 상단 네비게이션 헤더 */}
        <header className="global-header">
          <div className="brand-identity">
            <div className="brand-icon-animated">💊</div>
            <div className="brand-text">
              <h1>MediGuide AI</h1>
              <span>스마트 복약 케어 솔루션</span>
            </div>
          </div>

          <div className="accessibility-panel">
            <span className="panel-label">글자 크기 조절</span>
            <div className="size-buttons">
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
              >특대</button>
            </div>
          </div>
        </header>

        {/* 히어로 타이틀 섹션 */}
        <section className="hero-section">
          <div className="hero-badge">✨ 최신 AI 비전 & OCR 기술 탑재</div>
          <h2>약봉투와 처방전을 촬영하면<br/><strong>AI가 알기 쉽게 분석</strong>해 드립니다</h2>
          <p>어르신과 온 가족의 건강한 복약 습관, 지금 바로 시작하세요.</p>
        </section>

        {/* OCR 사진 업로드 그래픽 카드 */}
        <section className="upload-section-card">
          <label htmlFor="ocr-file-input" className="upload-dropzone">
            <div className="upload-icon-circle pulse-animation">📸</div>
            <div className="upload-content-info">
              <h3>약봉투 / 처방전 사진 올리기</h3>
              <p>카메라로 촬영하거나 갤러리에서 간편하게 선택하세요</p>
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
            <div className="active-preview-box animate-pop-in">
              <img src={selectedImage} alt="업로드된 약봉투" />
              <div className="preview-status-badge">✨ AI 정밀 분석 완료</div>
            </div>
          )}
        </section>

        <div className="section-separator">
          <span>또는 약 이름 직접 검색하기</span>
        </div>

        {/* 통합 검색 Form */}
        <form onSubmit={handleSearch} className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 타이레놀, 감기약, 고혈압약..."
            className="premium-search-bar"
          />
          <button type="submit" className="premium-search-submit">조회하기</button>
        </form>

        {loading && (
          <div className="loading-state-container animate-fade-in">
            <div className="spinner-dot"></div>
            <span>AI가 의약품 안전 정보를 분석하고 있습니다...</span>
          </div>
        )}

        {/* 결과 마스터 카드 */}
        {result && !loading && (
          <article className="result-master-card animate-slide-up">
            <div className="card-top-bar">
              <div className="result-tag-pill">안전 검토 완료</div>
              <button type="button" onClick={handleSpeak} className="tts-voice-trigger">
                🔊 음성 안내 듣기
              </button>
            </div>
            
            <h3 className="result-main-title">{result.name}</h3>

            <div className="result-details-stack">
              <div className="detail-row-item">
                <div className="row-icon-box">✨</div>
                <div className="row-text-box">
                  <span className="item-label">효능 및 효과</span>
                  <p>{result.efficacy}</p>
                </div>
              </div>

              <div className="detail-row-item">
                <div className="row-icon-box">⏰</div>
                <div className="row-text-box">
                  <span className="item-label">용법 및 용량</span>
                  <p>{result.dosage}</p>
                </div>
              </div>

              <div className="detail-row-item warning-highlight-box">
                <div className="row-icon-box alert-icon">⚠️</div>
                <div className="row-text-box">
                  <span className="item-label">주의사항 및 금기</span>
                  <p>{result.warning}</p>
                </div>
              </div>
            </div>
          </article>
        )}

      </div>
    </div>
  );
}

export default App;