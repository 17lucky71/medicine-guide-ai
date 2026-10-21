import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  const [agreed, setAgreed] = useState(false);
  const [savedMeds, setSavedMeds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myMeds') || '[]'); } catch (e) { return []; }
  });
  const persistMeds = (list) => {
    setSavedMeds(list);
    try { localStorage.setItem('myMeds', JSON.stringify(list)); } catch (e) { /* 저장 불가 환경 */ }
  };
  const updateMed = (index, field, value) => {
    setResult((r) => ({ ...r, medicines: r.medicines.map((m, i) => (i === index ? { ...m, [field]: value } : m)) }));
    setSavedNotice('');
  };
  const removeMed = (index) => {
    setResult((r) => ({ ...r, medicines: r.medicines.filter((_, i) => i !== index) }));
    setSavedNotice('');
  };
  const [savedNotice, setSavedNotice] = useState('');
  const handleSaveMeds = () => {
    if (!result) return;
    const names = result.medicines.map((m) => (m.name || '').trim()).filter(Boolean);
    if (names.length === 0) { setSavedNotice('저장할 약이 없습니다.'); return; }
    setSavedNotice(`${names.length}개 약을 저장했습니다. 위의 "내가 복용 중인 약"에서 확인하세요.`);
    persistMeds(Array.from(new Set([...savedMeds, ...names])));
  };
  const handleRemoveMed = (name) => persistMeds(savedMeds.filter((n) => n !== name));
  const [error, setError] = useState('');

  const resizeImage = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1400;
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다. 다른 사진을 선택해 주세요.'));
    img.src = url;
  });

  const callApi = async (payload) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    return data;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setOcrStatus('AI가 약 정보를 정리하고 있습니다...');
    try {
      const data = await callApi({ type: 'text', query: query.trim(), savedMeds });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!agreed) {
      setError('사진 분석 전에 아래 동의 항목을 먼저 체크해 주세요.');
      return;
    }
    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);
    setError('');
    setResult(null);
    setOcrStatus('📷 사진을 AI가 읽고 있습니다. 잠시만 기다려 주세요...');
    try {
      const image = await resizeImage(file);
      const data = await callApi({ type: 'image', image, savedMeds });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    setQuery('');
    setResult(null);
    setSelectedImage(null);
    setLoading(false);
    setOcrStatus('');
    setError('');
    window.scrollTo(0, 0);
  };
    const handleSpeak = () => {
    window.speechSynthesis.cancel();

    let textToSpeak = `${result.title}. `;
    result.medicines.forEach((med, idx) => {
      textToSpeak += `약품 ${idx + 1}, ${med.name}. 효능, ${med.efficacy}. 복용법, ${med.dosage}. 주의사항, ${med.warning}. `;
    });

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
      
      {/* 인트로 스플래시 */}
      {showIntro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeOut 0.5s ease 1.6s forwards'
        }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <div style={{ fontSize: '56px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', width: '100px', height: '100px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>💊</div>
            <h1 style={{ fontSize: '2.2em', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-1px' }}>의약품 안내 AI</h1>
            <p style={{ fontSize: '1.05em', color: '#bfdbfe', margin: '0 0 28px', fontWeight: '600' }}>어르신과 온 가족을 위한 쉽고 안전한 복약 비서</p>
          </div>
        </div>
      )}

      {/* 상단바 */}
      <header style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '16px 24px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
      }}>
        <div className="hdr-inner" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>💊</div>
            <div>
              <span style={{ fontSize: '1.2em', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', display: 'block', lineHeight: 1.1 }}>의약품 안내 AI</span>
              <span style={{ fontSize: '0.7em', color: '#2563eb', fontWeight: '800' }}>스마트 복약 케어 서비스</span>
            </div>
          </div>

          <div className="hdr-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button 
            type="button" 
            onClick={handleGoHome}
            style={{ 
              background: '#2563eb', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '12px', 
              padding: '8px 16px', 
              fontSize: '0.85em', 
              fontWeight: '800', 
              cursor: 'pointer'
            }}
          >
            🏠 처음으로
          </button>
            <span style={{ fontSize: '0.8em', color: '#64748b', fontWeight: '700' }}>글자 크기</span>
            <div style={{ display: 'flex', gap: '3px', background: '#f8fafc', padding: '3px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <button type="button" onClick={() => setFontSize('14px')} style={{ background: fontSize === '14px' ? '#2563eb' : 'transparent', color: fontSize === '14px' ? '#ffffff' : '#64748b', border: 'none', borderRadius: '9px', padding: '5px 12px', fontSize: '0.8em', fontWeight: '800', cursor: 'pointer' }}>기본</button>
              <button type="button" onClick={() => setFontSize('16px')} style={{ background: fontSize === '16px' ? '#2563eb' : 'transparent', color: fontSize === '16px' ? '#ffffff' : '#64748b', border: 'none', borderRadius: '9px', padding: '5px 12px', fontSize: '0.8em', fontWeight: '800', cursor: 'pointer' }}>크게</button>
              <button type="button" onClick={() => setFontSize('20px')} style={{ background: fontSize === '20px' ? '#2563eb' : 'transparent', color: fontSize === '20px' ? '#ffffff' : '#64748b', border: 'none', borderRadius: '9px', padding: '5px 12px', fontSize: '0.8em', fontWeight: '800', cursor: 'pointer' }}>특대</button>
            </div>
          </div>
        </div>
      </header>

      {/* 주의 문구 */}
      <div className="notice-bar" style={{ background: '#fef3c7', borderBottom: '1px solid #fcd34d', color: '#78350f', padding: '10px 20px', fontSize: '0.85em', fontWeight: '700', textAlign: 'center', lineHeight: 1.5 }}>
        ⚠️ 이 서비스의 안내는 AI가 생성한 참고용 정보이며 틀릴 수 있습니다. 복용 전 반드시 의사·약사와 상담하세요. 의사·약사의 상담을 대체하지 않습니다.
      </div>

      {/* 메인 레이아웃 */}
      <main className="main-pad" style={{ maxWidth: '880px', margin: '40px auto 0', padding: '0 20px' }}>
        
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: '#dbeafe', color: '#1e40af', borderRadius: '30px', fontSize: '0.85em', fontWeight: '800', marginBottom: '16px' }}>
            <span>✨</span> 처방전·약봉투 사진 AI 분석
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.4em', fontWeight: '900', color: '#0f172a', margin: '0 0 14px', lineHeight: 1.3, letterSpacing: '-1px' }}>
            처방전 사진 한 장으로<br/><span style={{ color: '#2563eb', textDecoration: 'underline', textUnderlineOffset: '6px' }}>복약 방법을 알기 쉽게</span> 확인하세요
          </h1>
          <p style={{ fontSize: '1.1em', color: '#475569', margin: 0, lineHeight: 1.6, fontWeight: '500' }}>처방전의 글자를 AI가 읽어 쉽게 정리해 드립니다. 결과가 틀릴 수 있으니 꼭 확인하세요.</p>
        </section>

        {/* 사진 업로드 영역 */}
        <label className="consent-box" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '16px 18px', marginBottom: '16px', fontSize: '0.9em', lineHeight: 1.6, color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: '22px', height: '22px', marginTop: '2px', flexShrink: 0 }} />
          <span>[동의] 올린 사진은 약 정보 분석을 위해 외부 AI 서비스로 전송됩니다. 사진은 서버에 저장하지 않습니다. 가능하면 이름·주민등록번호·전화번호 등 개인정보가 보이지 않게 가리고 올려 주세요.</span>
        </label>
        <div className="card-pad" style={{ background: '#ffffff', border: '2px dashed #93c5fd', borderRadius: '24px', padding: '36px', marginBottom: '28px', boxShadow: '0 12px 30px rgba(37,99,235,0.06)' }}>
          <label className="upload-label" htmlFor="ocr-file-input" style={{ display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#2563eb', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0, boxShadow: '0 8px 20px rgba(37,99,235,0.15)' }}>📸</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.25em', fontWeight: '800', color: '#0f172a', margin: 0 }}>처방전 / 약봉투 사진 촬영 및 업로드</h3>
                <span style={{ background: '#2563eb', color: '#fff', fontSize: '0.7em', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>AI 분석</span>
              </div>
              <p style={{ fontSize: '0.95em', color: '#64748b', margin: 0 }}>사진을 올리면 AI가 약 이름과 복용법을 정리해 드립니다.</p>
            </div>
            <span style={{ background: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', fontSize: '0.95em', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>사진 선택</span>
          </label>
          <input id="ocr-file-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

          {selectedImage && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <img src={selectedImage} alt="업로드된 처방전" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '16px', border: '1px solid #cbd5e1' }} />
              {result && !loading && <p style={{ marginTop: '10px', fontSize: '0.95em', fontWeight: '800', color: '#2563eb' }}>✅ AI 분석이 끝났습니다. 아래 결과를 꼭 확인해 주세요.</p>}
            </div>
          )}
        </div>

        {/* 직접 검색 */}
        <div className="card-pad" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', marginBottom: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1em', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> 약 이름이나 증상으로 직접 찾기
          </h3>
          <form className="search-form" onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 타이레놀, 혈압약, 감기약..."
              style={{ flex: 1, padding: '18px 22px', border: '2px solid #cbd5e1', borderRadius: '16px', fontSize: '1em', outline: 'none', background: '#f8fafc', color: '#0f172a', fontWeight: '600' }}
            />
            <button type="submit" style={{ padding: '0 32px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '1em', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>검색하기</button>
          </form>
        </div>

        {/* 내 복용 약 (저장된 약 = 다음 방문에도 유지) */}
        <div className="card-pad" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.1em', fontWeight: '800', margin: '0 0 12px' }}>💊 내가 복용 중인 약 (이 기기에 저장됨)</h3>
          {savedMeds.length === 0 ? (
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95em' }}>아직 저장한 약이 없습니다. 분석 결과에서 [복용 중인 약으로 저장]을 누르면 다음에 새 약을 올릴 때 함께 비교해 드립니다.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {savedMeds.map((n) => (
                <span key={n} style={{ background: '#dbeafe', color: '#1e40af', borderRadius: '20px', padding: '6px 12px', fontWeight: '700', fontSize: '0.9em' }}>
                  {n} <button type="button" aria-label={n + ' 삭제'} onClick={() => handleRemoveMed(n)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '900', color: '#1e40af' }}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div role="alert" style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#9f1239', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', fontWeight: '700', lineHeight: 1.5 }}>
            ⚠️ {error}
          </div>
        )}

        {/* 로딩 바 및 상태 표시 */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '36px', color: '#2563eb', fontWeight: '800', fontSize: '1.1em', background: '#ffffff', border: '2px solid #93c5fd', borderRadius: '24px', marginBottom: '32px', boxShadow: '0 10px 25px rgba(37,99,235,0.08)' }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid rgba(37,99,235,0.2)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span>{ocrStatus}</span>
          </div>
        )}

        {/* 분석 결과 마스터 카드 */}
        {result && !loading && (
          <article className="result-card" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '28px', padding: '40px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.85em', background: '#dcfce7', color: '#15803d', padding: '6px 16px', borderRadius: '20px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>🤖</span> AI 분석 결과 (참고용)
              </span>
              <button type="button" onClick={handleSpeak} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '14px', fontSize: '0.95em', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔊</span> 전체 음성으로 크게 듣기
              </button>
            </div>
            
            {result.comparison && (
              <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', color: '#7c2d12', fontWeight: '700', lineHeight: 1.6 }}>
                🔁 저장된 약과 비교: {result.comparison}
              </div>
            )}
            <h2 style={{ fontSize: '1.6em', fontWeight: '900', color: '#0f172a', margin: '0 0 28px', paddingBottom: '18px', borderBottom: '2px solid #f1f5f9', letterSpacing: '-0.5px' }}>{result.title}</h2>

            <p style={{ margin: '0 0 16px', padding: '12px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', color: '#1e3a8a', fontWeight: 700, lineHeight: 1.6, fontSize: '0.92em' }}>
              ✏️ 약 이름이 사진과 같은지 확인해 주세요. 틀렸으면 이름을 눌러 고치고, 잘못 들어온 약은 [이 약 삭제]를 눌러요. 확인한 뒤 아래 [저장]을 누르세요.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {result.medicines.map((med, index) => (
                <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2em', fontWeight: '900', color: '#2563eb', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💊</span>
                    <input aria-label="약 이름" value={med.name} onChange={(e) => updateMed(index, 'name', e.target.value)} style={{ flex: 1, minWidth: 0, font: 'inherit', fontWeight: 900, color: '#2563eb', border: '2px solid #bfdbfe', borderRadius: '10px', padding: '6px 10px', background: '#ffffff' }} />
                    <button type="button" onClick={() => removeMed(index)} style={{ border: '1px solid #fecdd3', background: '#fff1f2', color: '#be123c', borderRadius: '10px', padding: '6px 10px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>이 약 삭제</button>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#ffffff', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                      <span>✨</span>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75em', color: '#64748b', fontWeight: '800', marginBottom: '2px' }}>효능 및 효과</span>
                        <p style={{ margin: 0, color: '#0f172a', fontSize: '0.95em', lineHeight: 1.5, fontWeight: '600' }}>{med.efficacy}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#ffffff', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                      <span>⏰</span>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75em', color: '#64748b', fontWeight: '800', marginBottom: '2px' }}>용법 및 용량</span>
                        <p style={{ margin: 0, color: '#0f172a', fontSize: '0.95em', lineHeight: 1.5, fontWeight: '600' }}>{med.dosage}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#fff1f2', padding: '14px 16px', borderRadius: '14px', border: '1px solid #fecdd3' }}>
                      <span>⚠️</span>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75em', color: '#be123c', fontWeight: '800', marginBottom: '2px' }}>주의사항</span>
                        <p style={{ margin: 0, color: '#881337', fontSize: '0.95em', lineHeight: 1.5, fontWeight: '700' }}>{med.warning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleSaveMeds} style={{ marginTop: '24px', width: '100%', padding: '16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1em', fontWeight: '800', cursor: 'pointer' }}>확인한 약을 복용 중인 약으로 저장</button>
            {savedNotice && <p role="status" style={{ margin: '12px 0 0', color: '#15803d', fontWeight: 800 }}>✅ {savedNotice}</p>}
            <p style={{ margin: '16px 0 0', padding: '14px 16px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '14px', color: '#78350f', fontSize: '0.9em', fontWeight: '700', lineHeight: 1.6 }}>
              ⚠️ 위 내용은 AI가 생성한 참고용 정보이며 사진 인식 결과가 틀릴 수 있습니다. 약 이름과 용법을 처방전·약봉투와 꼭 다시 확인하고, 복용 전 의사·약사와 상담하세요.
            </p>
          </article>
        )}

      </main>

      <footer style={{ maxWidth: '880px', margin: '32px auto 0', padding: '0 20px', textAlign: 'center', color: '#64748b', fontSize: '0.8em', lineHeight: 1.6 }}>
        이 서비스는 AI가 생성한 참고용 정보를 제공하며 의사·약사의 상담을 대체하지 않습니다.
      </footer>
    </div>
  );
}

export default App;