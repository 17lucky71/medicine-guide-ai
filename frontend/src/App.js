import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large'

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setResult({
      name: query,
      efficacy: '통증 완화, 해열 및 소염 작용을 돕습니다.',
      dosage: '1일 3회, 식후 30분 복용 (증상에 따라 조절)',
      warning: '복용 중 음주는 피해주시고, 졸음이 올 수 있으니 운전 시 주의하세요.',
    });
  };

  // 음성 안내 (TTS) 기능
  const handleSpeak = () => {
    if (!result) return;

    // 진행 중인 음성이 있다면 중지
    window.speechSynthesis.cancel();

    const textToSpeak = `
      약 이름, ${result.name}. 
      효능 및 효과, ${result.efficacy}. 
      용법 및 용량, ${result.dosage}. 
      주의사항, ${result.warning}
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // 어르신들이 듣기 편하도록 살짝 천천히 읽기

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`container font-${fontSize}`}>
      <header className="header">
        <div className="top-controls">
          <div className="logo-badge">AI Health Guide</div>
          {/* 폰트 크기 조절 버튼 */}
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

        <h1>💊 의약품 안내 AI</h1>
        <p>궁금한 약 이름이나 증상을 입력하시면 AI가 친절하게 안내해 드립니다.</p>
      </header>

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

      {result && (
        <div className="result-card">
          <div className="result-header">
            <span className="badge">검색 결과</span>
            <div className="result-title-row">
              <h2>{result.name}</h2>
              {/* 음성 듣기 버튼 */}
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