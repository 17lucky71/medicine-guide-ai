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
      padding: '60px 20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", "Segoe UI", Roboto, sans-serif',
      color: '#0f172a',
      WebkitFontSmoothing: 'antialiased'
    }}>
      
      {/* 🚀 시네마틱 인트로 스플래시 화면 */}
      {showIntro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeOut 0.6s ease 1.8s forwards'
        }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '60px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', width: '100px', height: '100px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.15)' }}>💊</div>
            <h1 style={{ fontSize: '2.2em', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-1px' }}>MediGuide AI</h1>
            <p style={{ fontSize: '1em', color: '#94a3b8', margin: '0 0 32px', fontWeight: '500' }}>Professional Healthcare Intelligence</p>
            <div style={{ width: '180px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '10px', animation: 'loadBar 1.6s cubic-bezier(0.65, 0, 0.35, 1) forwards' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 하이엔드 에이전시 레이아웃 (박스 가둠 없이 넓고 쾌적한 구조) */}
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        {/* 네비게이션 바 */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '20px', background: '#2563eb', color: '#ffffff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>💊</div>
            <span style={{ fontSize: '1.1em', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>MediGuide.ai</span>
          </div>

          {/* 미니멀 접근성 컨트롤 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.75em', color: '#64748b', fontWeight: '600' }}>글자크기</span>
            <div style={{ display: 'flex', gap: '2px', background: '#ffffff', padding: '3px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <button type="button" onClick={() => setFontSize('14px')} style={{ background: fontSize === '14px' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '14px' ? '#2563eb' : '#64748b' }}>일반</button>
              <button type="button" onClick={() => setFontSize('16px')} style={{ background: fontSize === '16px' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '16px' ? '#2563eb' : '#64748b' }}>크게</button>
              <button type="button" onClick={() => setFontSize('20px')} style={{ background: fontSize === '20px' ? '#f1f5f9' : 'transparent', border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '0.75em', fontWeight: '700', cursor: 'pointer', color: fontSize === '20px' ? '#2563eb' : '#64748b' }}>특대</button>
            </div>
          </div>
        </nav>

        {/* 메인 히어로 섹션 (토스/애플 스타일 타이포그래피) */}
        <section style={{ marginBottom: '40px', textAlign: 'left' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '20px', fontSize: '0.75em', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.5px' }}>
            AI VISION OCR SYSTEM
          </div>
          <h1 style={{ fontSize: '2.2em', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', lineHeight: '1.25', letterSpacing: '-1px' }}>
            약봉투와 처방전을 올리면<br/><span style={{ color: '#2563eb' }}>가장 정확하게 분석</span>합니다.
          </h1>
          <p style={{ fontSize: '1.05em', color: '#475569', margin: 0, lineHeight: '1.6' }}>어르신과 가족을 위한 맞춤형 복약 안내, AI가 알기 쉽게 설명해 드립니다.</p>
        </section>

        {/* 프리미엄 파일 업로드 존 */}
        <label htmlFor="ocr-file-input" style={{ display: 'block', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px', cursor: 'pointer', marginBottom: '24px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)', transition: 'all 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ fontSize: '32px', background: '#f8fafc', color: '#2563eb', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>📁</div>
            <div>
              <h3 style={{ fontSize: '1.15em', fontWeight: '700', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>처방전 및 약봉투 사진 업로드</h3>
              <p style={{ fontSize: '0.9em', color: '#64748b', margin: 0 }}>파일을 드래그하거나 클릭하여 사진을 첨부하세요</p>
            </div>
          </div>
          <input id="ocr-file-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>

        {selectedImage && (
          <div style={{ marginBottom: '24px', background: '#ffffff', padding: '16px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
            <img src={selectedImage} alt="미리보기" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '12px', objectFit: 'contain' }} />
            <div style={{ marginTop: '12px', fontSize: '0.85em', fontWeight: '700', color: '#2563eb' }}>✨ 이미지 분석 준비 완료</div>
          </div>
        )}

        {/* 검색 폼 바 */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="궁금한 약 이름이나 증상을 입력하세요 (예: 타이레놀)"
            style={{ flex: 1, padding: '18px 24px', border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '1em', outline: 'none', background: '#ffffff', color: '#0f172a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'border-color 0.2s' }}
          />
          <button type="submit" style={{ padding: '0 28px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontSize: '0.95em', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)' }}>검색</button>
        </form>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', color: '#2563eb', fontWeight: '600', fontSize: '0.95em', background: '#eff6ff', borderRadius: '16px', marginBottom: '32px' }}>
            <div style={{ width: '18px', height: '18px', border: '2px solid rgba(37,99,235,0.2)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span>AI 비전 엔진이 약품 정보를 정밀 분석 중입니다...</span>
          </div>
        )}

        {/* 하이엔드 결과 카드 */}
        {result && !loading && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px', boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75em', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontWeight: '700' }}>분석 완료</span>
              <button type="button" onClick={handleSpeak} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85em', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>🔊 음성 안내 듣기</button>
            </div>
            
            <h3 style={{ fontSize: '1.5em', fontWeight: '800', color: '#0f172a', margin: '0 0 24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', letterSpacing: '-0.5px' }}>{result.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '1.2em' }}>✨</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75em', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>효능 및 효과</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1em', lineHeight: '1.6' }}>{result.efficacy}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#f8fafc', padding: '20px', borderRadius: '16px' }}>
                <span style={{ fontSize: '1.2em' }}>⏰</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75em', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>용법 및 용량</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1em', lineHeight: '1.6' }}>{result.dosage}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff1f2', padding: '20px', borderRadius: '16px', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '1.2em' }}>⚠️</span>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75em', color: '#be123c', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>주의사항 및 금기</span>
                  <p style={{ margin: 0, color: '#881337', fontSize: '1em', lineHeight: '1.6', fontWeight: '600' }}>{result.warning}</p>
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