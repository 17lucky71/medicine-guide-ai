import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setResult({
      name: query,
      efficacy: '이 약은 통증 완화 및 소염 작용을 돕습니다.',
      dosage: '1일 3회, 식후 30분 복용',
      warning: '자몽주스와 함께 복용하지 마세요. 졸음이 올 수 있으니 운전 시 주의하세요.',
    });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>💊 의약품 안내 AI</h1>
        <p>궁금한 약 이름이나 증상을 입력하시면 AI가 친절하게 안내해 드립니다.</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 타이레놀, 감기약 복용법..."
          className="search-input"
        />
        <button type="submit" className="search-button">검색하기</button>
      </form>

      {result && (
        <div className="result-card">
          <h2>🔍 검색 결과: {result.name}</h2>
          <div className="result-item">
            <strong>효능/효과:</strong> <p>{result.efficacy}</p>
          </div>
          <div className="result-item">
            <strong>용법/용량:</strong> <p>{result.dosage}</p>
          </div>
          <div className="result-item warning">
            <strong>⚠️ 주의사항:</strong> <p>{result.warning}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;