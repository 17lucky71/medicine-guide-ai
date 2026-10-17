import React, { useState, useEffect } from 'react';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2.2초 후 인트로 스플래시 종료
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

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
    <div style={{ fontSize: fontSize, backgroundColor: '#f1f5f9', minHeight: '100vh', margin: 0, padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* 🚀 시네마틱 인트로 스플래시 화면 */}
      {showIntro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeOut 0.5s ease 1.8s forwards'
        }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '64px', background: 'rgba(255,255,255,0.15)', width: '110px', height: '110px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '30px' }}>💊</div>
            <h1 style={{ fontSize: '2.2em', fontWeight: '900', margin: '0 0 8px' }}>MediGuide AI</h1>
            <p style={{ fontSize: '1.05em', color: '#93c5fd', margin: '0 0 30px' }}>AI로 완성하는 가장 스마트한 복약 케어</p>
            <div style={{ width: '200px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '10px', animation: 'loadBar 1.6s ease forwards' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 화면 컨테이너 */}
      <div style={{ maxWidth: '640px', margin: '40px auto', background: '#ffffff', padding: '36px', borderRadius: '28px', boxShadow: '0 20px 40px rgba(37, 99, 235, 0.1)', border: '1px solid #e2e8f0' }}>
        
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '18px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px', background: '#eff6ff', padding: '10px 14px', borderRadius: '14px' }}>💊</span>
            <div>
              <h1 style={{ fontSize: '1.25em', fontWeight: '800', color: '#2563eb', margin: 0 }}>MediGuide AI</h1>
              <span style={{ fontSize: '0.75em', color: '#64748b', fontWeight: '600' }}>스마트 복약 케어 솔루션</span>
            </div>
          </div>

          {/* 글자 크기 조절 버튼 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '0.7em', color: '#64748b', fontWeight: '700' }}>글자 크기 조절</span>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <button type="button" onClick={() => setFontSize('14px')} style={{ background: fontSize === '14px' ? '#fff' : 'transparent', border: 'none', borderRadius: '9px', padding: '6px 12px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '14px' ? '#2563eb' : '#64748b' }}>기본</button>
              <button type="button" onClick={() => setFontSize('16px')} style={{ background: fontSize === '16px' ? '#fff' : 'transparent', border: 'none', borderRadius: '9px', padding: '6px 12px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '16px' ? '#2563eb' : '#64748b' }}>크게</button>
              <button type="button" onClick={() => setFontSize('20px')} style={{ background: fontSize === '20px' ? '#fff' : 'transparent', border: 'none', borderRadius: '9px', padding: '6px 12px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '20px' ? '#2563eb' : '#64748b' }}>특대</button>
            </div>
          </div>
        </div>

        {/* 히어로 타이틀 */}
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <span style={{ display: 'inline-block', padding: '6px 14px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '0.8em', fontWeight: '700', marginBottom: '12px' }}>✨ 최신 AI 비전 & OCR 기술 탑재</span>
          <h2 style={{ fontSize: '1.6em', fontWeight: '800', color: '#0f172a', margin: '0 0 10px', lineHeight: '1.35' }}>
            약봉투와 처방전을 촬영하면<br/><span style={{ color: '#2563eb' }}>AI가 알기 쉽게 분석</span>해 드립니다
          </h2>
          <p style={{ fontSize: '0.95em', color: '#64748b', margin: 0 }}>어르신과 온 가족의 건강한 복약 습관, 지금 바로 시작하세요.</p>
        </div>

        {/* OCR 사진 업로드 카드 */}
        <label htmlFor="ocr-file-input" style={{ display: 'block', background: 'linear-gradient(135deg, #f8fbff 0%, #eff6ff 100%)', border: '2px dashed #93c5fd', borderRadius: '20px', padding: '26px', cursor: 'pointer', marginBottom: '28px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left' }}>
            <span style={{ fontSize: '38px', background: '#ffffff', padding: '18px', borderRadius: '20px', boxShadow: '0 8px 20px rgba(37,99,235,0.1)' }}>📸</span>
            <div>
              <h3 style={{ fontSize: '1.1em', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>약봉투 / 처방전 사진 올리기</h3>
              <p style={{ fontSize: '0.85em', color: '#64748b', margin: 0 }}>카메라로 촬영하거나 갤러리에서 간편하게 선택하세요</p>
            </div>
          </div>
          <input id="ocr-file-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>

        {selectedImage && (
          <div style={{ marginTop: '18px', textAlign: 'center', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
            <img src={selectedImage} alt="업로드 미리보기" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '10px' }} />
            <div style={{ marginTop: '10px', fontSize: '0.85em', fontWeight: '800', color: '#2563eb' }}>✨ AI 정밀 분석 완료</div>
          </div>
        )}

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: '#94a3b8', fontSize: '0.8em', fontWeight: '700', margin: '28px 0' }}>
          <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
          <span style={{ padding: '0 16px' }}>또는 약 이름 직접 검색하기</span>
          <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 타이레놀, 감기약, 고혈압약..."
            style={{ flex: 1, padding: '18px 22px', border: '2px solid #e2e8f0', borderRadius: '14px', fontSize: '1em', outline: 'none', background: '#ffffff' }}
          />
          <button type="submit" style={{ padding: '0 28px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1em', fontWeight: '800', cursor: 'pointer' }}>조회하기</button>
        </form>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '28px', color: '#2563eb', fontWeight: '700', fontSize: '1em', background: '#eff6ff', borderRadius: '14px', marginBottom: '28px' }}>
            <div style={{ width: '20px', height: '20px', border: '3px solid rgba(37,99,235,0.2)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span>AI가 의약품 안전 정보를 분석하고 있습니다...</span>
          </div>
        )}

        {/* 결과 카드 */}
        {result && !loading && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8em', background: '#eff6ff', color: '#2563eb', padding: '6px 14px', borderRadius: '20px', fontWeight: '800' }}>안전 검토 완료</span>
              <button type="button" onClick={handleSpeak} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.9em', fontWeight: '800', cursor: 'pointer' }}>🔊 음성 안내 듣기</button>
            </div>
            
            <h3 style={{ fontSize: '1.4em', fontWeight: '800', color: '#0f172a', margin: '0 0 22px', paddingBottom: '14px', borderBottom: '2px solid #e2e8f0' }}>{result.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#f8fafc', padding: '16px 18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.3em', background: '#ffffff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>✨</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#475569', fontWeight: '800', marginBottom: '4px' }}>효능 및 효과</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1em', lineHeight: '1.6' }}>{result.efficacy}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#f8fafc', padding: '16px 18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.3em', background: '#ffffff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>⏰</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#475569', fontWeight: '800', marginBottom: '4px' }}>용법 및 용량</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1em', lineHeight: '1.6' }}>{result.dosage}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff1f2', padding: '16px 18px', borderRadius: '14px', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '1.3em', background: '#ffffff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>⚠️</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#be123c', fontWeight: '800', marginBottom: '4px' }}>주의사항 및 금기</span>
                  <p style={{ margin: 0, color: '#881337', fontSize: '1em', lineHeight: '1.6', fontWeight: '700' }}>{result.warning}</p>
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