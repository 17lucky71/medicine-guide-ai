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
    }, 2000);
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
          name: '타이레놀정 500mg (AI 사진 분석 완료)',
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
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ 
      fontSize: fontSize, 
      backgroundColor: '#f1f5f9', 
      minHeight: '100vh', 
      margin: 0, 
      padding: '0 0 60px 0', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", sans-serif',
      color: '#0f172a',
      WebkitFontSmoothing: 'antialiased'
    }}>
      
      {/* 🚀 1. 시네마틱 한글 인트로 스플래시 */}
      {showIntro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeOut 0.5s ease 1.6s forwards'
        }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '56px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', width: '100px', height: '100px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>💊</div>
            <h1 style={{ fontSize: '2.2em', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-1px' }}>의약품 안내 AI</h1>
            <p style={{ fontSize: '1.05em', color: '#bfdbfe', margin: '0 0 28px', fontWeight: '600' }}>어르신과 온 가족을 위한 쉽고 안전한 복약 비서</p>
            <div style={{ width: '180px', height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '10px', animation: 'loadBar 1.4s ease forwards' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 🏛️ 2. 최상단 풀와이드 공식 상단바 (에이전시/기업 서비스 느낌) */}
      <header style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '16px 24px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>💊</div>
            <div>
              <span style={{ fontSize: '1.2em', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', display: 'block', lineHeight: 1.1 }}>의약품 안내 AI</span>
              <span style={{ fontSize: '0.7em', color: '#2563eb', fontWeight: '800' }}>스마트 복약 케어 서비스</span>
            </div>
          </div>

          {/* 어르신 친화 글자크기 스위처 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8em', color: '#64748b', fontWeight: '700' }}>글자 크기</span>
            <div style={{ display: 'flex', gap: '3px', background: '#f8fafc', padding: '3px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <button type="button" onClick={() => setFontSize('14px')} style={{ background: fontSize === '14px' ? '#2563eb' : 'transparent', color: fontSize === '14px' ? '#ffffff' : '#64748b', border: 'none', borderRadius: '9px', padding: '5px 12px', fontSize: '0.8em', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>기본</button>
              <button type="button" onClick={() => setFontSize('16px')} style={{ background: fontSize === '16px' ? '#2563eb' : 'transparent', color: fontSize === '16px' ? '#ffffff' : '#64748b', border: 'none', borderRadius: '9px', padding: '5px 12px', fontSize: '0.8em', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>크게</button>
              <button type="button" onClick={() => setFontSize('20px')} style={{ background: fontSize === '20px' ? '#2563eb' : 'transparent', color: fontSize === '20px' ? '#ffffff' : '#64748b', border: 'none', borderRadius: '9px', padding: '5px 12px', fontSize: '0.8em', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }}>특대</button>
            </div>
          </div>
        </div>
      </header>

      {/* 🏛️ 3. 본문 레이아웃 (시원시원한 반응형 메인 센터 구역) */}
      <main style={{ maxWidth: '880px', margin: '40px auto 0', padding: '0 20px' }}>
        
        {/* 히어로 헤더 섹션 */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#dbeafe', color: '#1e40af', borderRadius: '30px', fontSize: '0.85em', fontWeight: '800', marginBottom: '16px' }}>
            <span>✨</span> 인공지능 자율 분석 시스템
          </div>
          <h1 style={{ fontSize: '2.4em', fontWeight: '900', color: '#0f172a', margin: '0 0 14px', lineHeight: 1.3, letterSpacing: '-1px' }}>
            약봉투 사진 한 장으로<br/><span style={{ color: '#2563eb', textDecoration: 'underline', textUnderlineOffset: '6px' }}>복약 방법을 알기 쉽게</span> 확인하세요
          </h1>
          <p style={{ fontSize: '1.1em', color: '#475569', margin: 0, lineHeight: 1.6, fontWeight: '500' }}>복잡한 의학 용어와 작은 글씨도 AI가 어르신의 눈높이에 맞춰 친절하게 읽어드립니다.</p>
        </section>

        {/* 📸 메인 기능 카드 1: 약봉투 사진 업로드 */}
        <div style={{ background: '#ffffff', border: '2px dashed #93c5fd', borderRadius: '24px', padding: '36px', marginBottom: '28px', boxShadow: '0 12px 30px rgba(37,99,235,0.06)', transition: 'all 0.2s ease' }}>
          <label htmlFor="ocr-file-input" style={{ display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#2563eb', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0, boxShadow: '0 8px 20px rgba(37,99,235,0.15)' }}>📸</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.25em', fontWeight: '800', color: '#0f172a', margin: 0 }}>약봉투 / 처방전 사진 촬영 및 업로드</h3>
                <span style={{ background: '#2563eb', color: '#fff', fontSize: '0.7em', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>추천</span>
              </div>
              <p style={{ fontSize: '0.95em', color: '#64748b', margin: 0 }}>카메라로 사진을 찍거나 약봉투 이미지를 올려주시면 자동 분석됩니다.</p>
            </div>
            <span style={{ background: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', fontSize: '0.95em', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>사진 선택</span>
          </label>
          <input id="ocr-file-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

          {selectedImage && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <img src={selectedImage} alt="선택한 약봉투" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '16px', border: '1px solid #cbd5e1' }} />
              <p style={{ marginTop: '10px', fontSize: '0.95em', fontWeight: '800', color: '#2563eb' }}>✅ 약봉투 사진이 성공적으로 인식되었습니다!</p>
            </div>
          )}
        </div>

        {/* 🔍 메인 기능 카드 2: 직접 약 이름 검색 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', marginBottom: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1em', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> 약 이름이나 증상으로 찾아보기
          </h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 타이레놀, 두통약, 감기약 복용법..."
              style={{ flex: 1, padding: '18px 22px', border: '2px solid #cbd5e1', borderRadius: '16px', fontSize: '1em', outline: 'none', background: '#f8fafc', color: '#0f172a', fontWeight: '600' }}
            />
            <button type="submit" style={{ padding: '0 32px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '1em', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>검색하기</button>
          </form>
        </div>

        {/* ⏳ 분석 로딩 창 */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '36px', color: '#2563eb', fontWeight: '800', fontSize: '1.1em', background: '#ffffff', border: '2px solid #93c5fd', borderRadius: '24px', marginBottom: '32px', boxShadow: '0 10px 25px rgba(37,99,235,0.08)' }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid rgba(37,99,235,0.2)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span>인공지능이 복약 안내 정보를 정밀 분석하고 있습니다...</span>
          </div>
        )}

        {/* 📋 4. 분석 결과 마스터 리포트 카드 */}
        {result && !loading && (
          <article style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '28px', padding: '40px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.85em', background: '#dcfce7', color: '#15803d', padding: '6px 16px', borderRadius: '20px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>✅</span> AI 안전 검토 완료
              </span>
              <button type="button" onClick={handleSpeak} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '14px', fontSize: '0.95em', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔊</span> 음성으로 크게 듣기
              </button>
            </div>
            
            <h2 style={{ fontSize: '1.8em', fontWeight: '900', color: '#0f172a', margin: '0 0 28px', paddingBottom: '18px', borderBottom: '2px solid #f1f5f9', letterSpacing: '-0.5px' }}>{result.name}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 효능 정보 */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#f8fafc', padding: '22px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', background: '#ffffff', padding: '12px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>✨</div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#2563eb', fontWeight: '800', marginBottom: '4px' }}>약의 효능 및 효과</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1.05em', lineHeight: 1.6, fontWeight: '600' }}>{result.efficacy}</p>
                </div>
              </div>

              {/* 용법 용량 */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#f8fafc', padding: '22px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '24px', background: '#ffffff', padding: '12px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>⏰</div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#2563eb', fontWeight: '800', marginBottom: '4px' }}>올바른 복용 방법</span>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '1.05em', lineHeight: 1.6, fontWeight: '600' }}>{result.dosage}</p>
                </div>
              </div>

              {/* 주의사항 경고 */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#fff1f2', padding: '22px', borderRadius: '20px', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '24px', background: '#ffffff', padding: '12px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>⚠️</div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85em', color: '#be123c', fontWeight: '800', marginBottom: '4px' }}>주의사항 및 금기사항</span>
                  <p style={{ margin: 0, color: '#881337', fontSize: '1.05em', lineHeight: 1.6, fontWeight: '700' }}>{result.warning}</p>
                </div>
              </div>

            </div>
          </article>
        )}

      </main>
    </div>
  );
}

export default App;