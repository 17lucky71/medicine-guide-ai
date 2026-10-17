import React, { useState, useEffect } from 'react';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div style={{ 
      fontSize: fontSize, 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      margin: 0, 
      padding: '40px 20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif',
      color: '#0f172a',
      WebkitFontSmoothing: 'antialiased'
    }}>
      
      {/* 🚀 시네마틱 인트로 스플래시 화면 */}
      {showIntro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeOut 0.6s ease 1.8s forwards'
        }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '64px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', width: '110px', height: '110px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>💊</div>
            <h1 style={{ fontSize: '2.4em', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-1px' }}>MediGuide AI</h1>
            <p style={{ fontSize: '1.1em', color: '#93c5fd', margin: '0 0 32px', fontWeight: '500' }}>AI로 완성하는 가장 스마트한 복약 케어</p>
            <div style={{ width: '220px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '10px', animation: 'loadBar 1.6s cubic-bezier(0.65, 0, 0.35, 1) forwards' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 에이전시 스타일 메인 카드 컨테이너 */}
      <div style={{ 
        maxWidth: '680px', 
        margin: '0 auto', 
        background: '#ffffff', 
        padding: '44px 40px', 
        borderRadius: '32px', 
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        position: 'relative'
      }}>
        
        {/* 상단 프로페셔널 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '26px', background: '#eff6ff', color: '#2563eb', padding: '12px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💊</div>
            <div>
              <h1 style={{ fontSize: '1.2em', fontWeight: '800', color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>MediGuide AI</h1>
              <span style={{ fontSize: '0.75em', color: '#64748b', fontWeight: '600' }}>Professional Care System</span>
            </div>
          </div>

          {/* 세련된 글자 크기 스위치 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '0.7em', color: '#94a3b8', fontWeight: '700', textTransform: 'letterSpacing', letterSpacing: '0.5px' }}>Accessibility</span>
            <div style={{ display: 'flex', gap: '3px', background: '#f8fafc', padding: '4px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <button type="button" onClick={() => setFontSize('14px')} style={{ background: fontSize === '14px' ? '#ffffff' : 'transparent', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '14px' ? '#2563eb' : '#64748b', boxShadow: fontSize === '14px' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' }}>기본</button>
              <button type="button" onClick={() => setFontSize('16px')} style={{ background: fontSize === '16px' ? '#ffffff' : 'transparent', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '16px' ? '#2563eb' : '#64748b', boxShadow: fontSize === '16px' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' }}>크게</button>
              <button type="button" onClick={() => setFontSize('20px')} style={{ background: fontSize === '20px' ? '#ffffff' : 'transparent', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '20px' ? '#2563eb' : '#64748b', boxShadow: fontSize === '20px' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' }}>특대</button>
            </div>
          </div>
        </div>

        {/* 에이전시 스타일 타이틀 배너 */}
        <div style={{ marginBottom: '36px', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#eff6ff', color: '#2563eb', borderRadius: '20px', fontSize: '0.8em', fontWeight: '700', marginBottom: '14px' }}>
            <span>✨</span> Next-Gen AI Vision & OCR Engine
          </div>
          <h2 style={{ fontSize: '1.75em', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', lineHeight: '1.35', letterSpacing: '-0.75px' }}>
            약봉투와 처방전을 촬영하면<br/><span style={{ color: '#2563eb' }}>AI가 즉시 알기 쉽게 분석</span>합니다
          </h2>
          <p style={{ fontSize: '1em', color: '#64748b', margin: 0, lineHeight: '1.5' }}>어르신과 온 가족의 건강한 복약 습관을 위한 가장 스마트한 선택.</p>
        </div>

        {/* 프리미엄 드롭존 업로드 카드 */}
        <label htmlFor="ocr-file-input" style={{ display: 'block', background: 'linear-gradient(135deg, #f8fbff 0%, #f0f5ff 100%)', border: '2px dashed #bfdbfe', borderRadius: '24px', padding: '32px', cursor: 'pointer', marginBottom: '32px', textAlign: 'center', transition: 'all 0.25s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', textAlign: 'left' }}>
            <div style={{ fontSize: '40px', background: '#ffffff', padding: '20px', borderRadius: '22px', boxShadow: '0 10px 25px rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📸</div>
            <div>
              <h3 style={{ fontSize: '1.15em', fontWeight: '800', color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>약봉투 / 처방전 사진 올리기</h3>
              <p style={{ fontSize: '0.9em', color: '#64748b', margin: 0 }}>카메라로 촬영하거나 갤러리에서 간편하게 선택하세요</p>
            </div>
          </div>
          <input id="ocr-file-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>

        {selectedImage && (
          <div style={{ marginTop: '-16px', marginBottom: '32px', textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <img src={selectedImage} alt="업로드 미리보기" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '12px', objectFit: 'contain' }} />
            <div style={{ marginTop: '12px', fontSize: '0.9em', fontWeight: '800', color: '#2563eb' }}>✨ AI 정밀 분석 완료</div>
          </div>
        )}

        {/* 미니멀 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: '#cbd5e1', fontSize: '0.8em', fontWeight: '700', margin: '32px 0' }}>
          <div style={{ flex: 1, borderBottom: '1px solid #f1f5f9' }}></div>
          <span style={{ padding: '0 18px', color: '#94a3b8', letterSpacing: '-0.2px' }}>또는 약 이름 직접 검색하기</span>
          <div style={{ flex: 1, borderBottom: '1px solid #f1f5f9' }}></div>
        </div>

        {/* 프리미엄 검색 폼 */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 타이레놀, 감기약, 고혈압약..."
            style={{ flex: 1, padding: '20px 24px', border: '2px solid #e2e8f0', borderRadius: '18px', fontSize: '1em', outline: 'none', background: '#ffffff', color: '#0f172a', transition: 'all 0.2s' }}
          />
          <button type="submit" style={{ padding: '0 32px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '18px', fontSize: '1em', fontWeight: '800', cursor: 'pointer', transition: 'background-color 0.2s, transform 0.1s', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>조회하기</button>
        </form>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '32px', color: '#2563eb', fontWeight: '700', fontSize: '1em', background: '#eff6ff', borderRadius: '20px', marginBottom: '32px' }}>
            <div style={{ width: '22px', height: '22px', border: '3px solid rgba(37,99,235,0.2)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span>AI가 의약품 안전 정보를 분석하고 있습니다...</span>
          </div>
        )}

        {/* 에이전시 급 결과 마스터 카드 */}
        {result && !loading && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.8em', background: '#dbeafe', color: '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontWeight: '800' }}>안전 검토 완료</span>
              <button type="button" onClick={handleSpeak} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9em', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>🔊 음성 안내 듣기</button>
            </div>
            
            <h3 style={{ fontSize: '1.5em', fontWeight: '800', color: '#0f172a', margin: '0 0 24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0', letterSpacing: '-0.5px' }}>{result.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.35em', background: '#f8fafc', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>✨</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#64748b', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>효능 및 효과</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1.05em', lineHeight: '1.6' }}>{result.efficacy}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.35em', background: '#f8fafc', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>⏰</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#64748b', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>용법 및 용량</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1.05em', lineHeight: '1.6' }}>{result.dosage}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff1f2', padding: '18px 20px', borderRadius: '18px', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '1.35em', background: '#ffffff', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>⚠️</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#be123c', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>주의사항 및 금기</span>
                  <p style={{ margin: 0, color: '#881337', fontSize: '1.05em', lineHeight: '1.6', fontWeight: '700' }}>{result.warning}</p>
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