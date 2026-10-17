import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 예시 안내 데이터
    setResult({
      name: query,
      efficacy: '통증 완화, 해열 및 소염 작용을 돕습니다.',
      dosage: '1일 3회, 식후 30분 복용 (증상에 따라 조절)',
      warning: '복용 중 음주는 피해주시고, 졸음이 올 수 있으니 운전 시 주의하세요.',
    });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-badge">AI Health Guide</div>
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
            <h2>{result.name}</h2>
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