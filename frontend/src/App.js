import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');



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
    if (!query.trim() || loading) return;
    setSelectedImage(null);
    setSavedNotice('');
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
    setSavedNotice('');
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
    <div className="app" style={{ fontSize }}>
      <header className="topbar">
        <div className="top-inner">
          <button className="brand" type="button" onClick={handleGoHome} aria-label="??? ?? AI ????">
            <span className="brandmark" aria-hidden="true">?</span>
            <span>??? ?? <strong>AI</strong><small>?? ??? ?? ?? ??</small></span>
          </button>
          <div className="top-actions">
            <button type="button" className="plain-button" onClick={handleGoHome}>????</button>
            <div className="font-picker">
              <span>?? ??</span>
              <div className="segmented" role="group" aria-label="?? ??">
                {[['16px', '??'], ['18px', '??'], ['20px', '??']].map(([size, label]) => (
                  <button key={size} type="button" aria-pressed={fontSize === size} onClick={() => setFontSize(size)}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">?? ?? ?? ?? ? ??</span>
          <h1>??? ?? ??,<br /><span>?? ?? ??.</span></h1>
          <p>????? ??? ??? ?? ???.<br />? ???? ???, ?????? ??? ????.</p>
          <ol className="steps" aria-label="?? ??">
            <li><span className="step-num">1</span> ?? ???</li>
            <li><span className="step-num">2</span> ? ?? ??</li>
            <li><span className="step-num">3</span> ?? ? ??</li>
          </ol>
        </section>

        <div className="notice safety-notice">
          <span className="notice-mark" aria-hidden="true">!</span>
          <p><strong>?? ?, ??????? ? ?????.</strong> ? ??? AI? ??? ??? ???? ?? ? ????. ?????? ??? ???? ????.</p>
        </div>

        <div className="workspace">
          <div className="left-column">
            <section className="panel upload-panel" aria-labelledby="upload-title">
              <div className="title-row"><div><span className="eyebrow">???? ????</span><h2 id="upload-title">??????? ??</h2></div><span className="tag">AI ??</span></div>
              <p className="desc">??? ???? ??? ??? ??? ???.</p>
              <div className="dropzone">
                <svg className="paper-icon" viewBox="0 0 56 56" fill="none" aria-hidden="true"><rect x="12" y="6" width="32" height="44" rx="5" stroke="currentColor" strokeWidth="2"/><path d="M20 18h16M20 24h10M28 40V30m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <h3>?? ? ??? ?????</h3>
                <p>??? ?? ??? ??? ??? ???.</p>
                <label className={`button primary file-label ${!agreed || loading ? 'disabled' : ''}`}>
                  ?? ???? <span aria-hidden="true">?</span>
                  <input type="file" accept="image/*" aria-label="??? ?? ??? ?? ??" disabled={!agreed || loading} onChange={handleImageChange} />
                </label>
                <small>{agreed ? '??? ???? ??? ?????.' : '?? ?? ?? ? ??? ? ???.'}</small>
              </div>
              <label className="consent">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span><strong>??? ?? AI ??? ?????.</strong><span>? ?? ??? ?? ??? ?? AI ???? ???? ??? ???? ????. ??????????????? ??? ?? ???.</span></span>
              </label>
              {selectedImage && <div className="image-preview"><img src={selectedImage} alt="??? ??? ?? ???" />{result && !loading && <p>?? ??? ?????. ?? ? ??? ??? ???.</p>}</div>}
            </section>

            <section className="panel search-panel" aria-labelledby="search-title">
              <h2 className="panel-title" id="search-title">? ???? ?? ??</h2>
              <p className="desc">??? ??? ? ???? ???? ??? ? ???.</p>
              <form className="search-form" onSubmit={handleSearch}>
                <label className="sr-only" htmlFor="medicine-query">? ???? ??</label>
                <input id="medicine-query" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="?: ????, ???, ???" disabled={loading} />
                <button className="button primary" type="submit" disabled={loading || !query.trim()}>????</button>
              </form>
            </section>
          </div>

          <aside className="panel saved-panel" aria-labelledby="saved-title">
            <div className="title-row"><h2 id="saved-title">?? ?? ?? ?</h2><span className="count">{savedMeds.length}</span></div>
            <p className="device-note">? ??? ??? ? ??</p>
            {savedMeds.length === 0 ? (
              <div className="empty-state"><span className="empty-icon" aria-hidden="true">?</span><h3>?? ??? ?? ???</h3><p>?? ??? ????<br />?? ?? ??? ??? ???.</p></div>
            ) : (
              <ul className="saved-list">{savedMeds.map((name) => <li key={name}><span>{name}</span><button className="remove-saved" type="button" aria-label={`${name} ??`} onClick={() => handleRemoveMed(name)}>?</button></li>)}</ul>
            )}
            <div className="helper"><strong>? ?? ??? ? ?? ????</strong><p>??? ?? ??? ?? ???? ?? ??? ?? ????? ?????.</p></div>
            <p className="device-note storage-note">?? ??? ?????? ?? ? ? ???.</p>
          </aside>
        </div>

        {error && <div className="notice error-notice" role="alert"><span className="notice-mark" aria-hidden="true">!</span><p>{error}</p></div>}
        {loading && <div className="panel loading-panel" role="status"><span className="spinner" aria-hidden="true"/><div><strong>? ??? ???? ???</strong><p>{ocrStatus}</p></div></div>}

        {result && !loading && (
          <article className="panel result-panel" aria-labelledby="result-title">
            <div className="result-top">
              <div><span className="eyebrow">AI ?? ?? ? ???</span><h2 id="result-title">{result.title}</h2></div>
              <button className="button secondary" type="button" onClick={handleSpeak}>???? ??</button>
            </div>
            {result.comparison && <div className="notice comparison"><span className="notice-mark" aria-hidden="true">?</span><p><strong>??? ?? ??</strong>{result.comparison}</p></div>}
            <div className="review"><strong>???? ?? ? ??? ??? ???.</strong><p>??? ??? ??? ????, ?? ??? ?? ??? ???.</p></div>
            <div className="medicine-list">
              {result.medicines.map((med, index) => (
                <section className="medicine-card" key={`${index}-${med.name}`} aria-label={`?? ${index + 1}`}>
                  <div className="medicine-heading">
                    <span className="medicine-number">{String(index + 1).padStart(2, '0')}</span>
                    <input aria-label="? ??" value={med.name} onChange={(e) => updateMed(index, 'name', e.target.value)} />
                    <button className="delete-med" type="button" onClick={() => removeMed(index)}>? ? ??</button>
                  </div>
                  <dl className="details">
                    <div className="detail"><dt>?? ? ??</dt><dd>{med.efficacy}</dd></div>
                    <div className="detail"><dt>?? ? ??</dt><dd>{med.dosage}</dd></div>
                    <div className="detail warning"><dt>????</dt><dd>{med.warning}</dd></div>
                  </dl>
                </section>
              ))}
            </div>
            <button className="button primary save-button" type="button" onClick={handleSaveMeds}>??? ?? ?? ?? ??? ??</button>
            {savedNotice && <p className="save-status" role="status">{savedNotice}</p>}
            <div className="notice result-caution"><span className="notice-mark" aria-hidden="true">!</span><p>? ??? AI? ??? ??? ???? ?? ?? ??? ?? ? ????. ? ??? ??? ???????? ?? ????, ?? ? ?????? ?????.</p></div>
          </article>
        )}
      </main>

      <footer className="site-footer"><strong>??? ?? AI</strong><p>? ???? AI? ??? ??? ??? ???? ?????? ??? ???? ????.</p></footer>
    </div>
  );
}

export default App;
