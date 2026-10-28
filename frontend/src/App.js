import React, { useState } from 'react';
import './App.css';
import { loadSavedMeds, storeSavedMeds } from './medicationStorage';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [activeView, setActiveView] = useState('analysis');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');



  const [agreed, setAgreed] = useState(false);
  const [savedMeds, setSavedMeds] = useState(loadSavedMeds);
  const persistMeds = (list) => {
    setSavedMeds(list);
    storeSavedMeds(list);
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
    setSavedNotice(`${names.length}개 약을 저장했습니다. 내 복용약 메뉴에서 확인하세요.`);
    persistMeds(Array.from(new Set([...savedMeds, ...names])));
  };
  const handleRemoveMed = (name) => persistMeds(savedMeds.filter((n) => n !== name));
  const [error, setError] = useState('');
  const navItems = [
    { id: 'analysis', label: '처방전 분석', icon: '▤' },
    { id: 'meds', label: '내 복용약', icon: '✚' },
    { id: 'guidance', label: '복약안내', icon: '☷' },
    { id: 'usage', label: '사용안내', icon: 'ⓘ' },
  ];
  const renderNav = (className) => (
    <nav className={className} aria-label="주요 메뉴">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-button ${activeView === item.id ? 'active' : ''}`}
          aria-current={activeView === item.id ? 'page' : undefined}
          onClick={() => setActiveView(item.id)}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );

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
    setActiveView('analysis');
    setSelectedImage(null);
    setSavedNotice('');
    setLoading(true);
    setError('');
    setResult(null);
    setOcrStatus('AI가 약 정보를 정리하고 있습니다...');
    try {
      const data = await callApi({ type: 'text', query: query.trim(), savedMeds });
      setResult(data);
      setActiveView('guidance');
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
    setActiveView('analysis');
    setLoading(true);
    setError('');
    setResult(null);
    setOcrStatus('📷 사진을 AI가 읽고 있습니다. 잠시만 기다려 주세요...');
    try {
      const image = await resizeImage(file);
      const data = await callApi({ type: 'image', image, savedMeds });
      setResult(data);
      setActiveView('guidance');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    setActiveView('analysis');
    setSavedNotice('');
    setQuery('');
    setResult(null);
    setSelectedImage(null);
    setLoading(false);
    setOcrStatus('');
    setError('');
    window.scrollTo(0, 0);
  };
  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
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
    <div className="app" data-testid="app-shell" style={{ fontSize }}>
      <header className="topbar">
        <div className="top-inner">
          <button className="brand" type="button" onClick={handleGoHome} aria-label="의약품 안내 AI 홈">
            <span className="brandmark" aria-hidden="true">✚</span>
            <span>의약품 안내 <strong>AI</strong><small>나와 가족을 위한 복약 안내</small></span>
          </button>
          <div className="top-actions">
            <div className="font-picker">
              <div className="segmented" role="group" aria-label="글자 크기">
                {[['16px', '기본'], ['18px', '크게'], ['20px', '특대']].map(([size, label]) => (
                  <button key={size} type="button" aria-pressed={fontSize === size} onClick={() => setFontSize(size)}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="app-layout">
        <aside className="side-nav">
          <span className="nav-caption">메뉴</span>
          {renderNav('nav-list')}
        </aside>

        <main className="container">
          {activeView === 'analysis' && (
            <section className="screen screen-analysis" aria-labelledby="analysis-title">
              <div className="page-heading compact-heading">
                <h1 id="analysis-title">약봉투 분석</h1>
                <p>글자가 선명하게 보이는 사진을 준비해 주세요.</p>
              </div>
              <div className="workspace">
                <div className="left-column">
                  <section className="panel upload-panel" aria-label="약봉투 사진 분석">
                    <div className="dropzone">
                      <svg className="paper-icon" viewBox="0 0 56 56" fill="none" aria-hidden="true"><rect x="12" y="6" width="32" height="44" rx="5" stroke="currentColor" strokeWidth="2"/><path d="M20 18h16M20 24h10M28 40V30m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <h3>사진 한 장으로 시작하세요</h3>
                      <p>처방전 또는 약봉투 사진을 선택해 주세요.</p>
                      <label className="consent">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <span><strong>사진의 외부 AI 전송에 동의합니다.</strong><span>약 정보 분석을 위해 사진을 외부 AI 서비스로 전송하며 서버에 저장하지 않습니다. 이름·주민등록번호·전화번호는 가리고 올려 주세요.</span></span>
                      </label>
                      <label className={`button primary file-label ${!agreed || loading ? 'disabled' : ''}`}>
                        사진 선택하기 <span aria-hidden="true">↗</span>
                        <input type="file" accept="image/*" aria-label="처방전 또는 약봉투 사진 선택" disabled={!agreed || loading} onChange={handleImageChange} />
                      </label>
                      <small>{agreed ? '사진을 선택하면 분석이 시작됩니다.' : '사진 전송 동의 후 선택할 수 있어요.'}</small>
                      {selectedImage && (
                        <div className="image-preview visible" aria-live="polite">
                          <img src={selectedImage} alt="선택한 처방전 또는 약봉투" />
                          {loading ? (
                            <div className="image-analysis-status" role="status">
                              <span className="spinner" aria-hidden="true" />
                              <div><strong>사진을 분석하고 있어요</strong><p>{ocrStatus}</p></div>
                            </div>
                          ) : result && <p>분석을 마쳤어요. 복약안내에서 결과를 확인해 주세요.</p>}
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="panel search-panel" aria-labelledby="search-title">
                    <h2 className="panel-title" id="search-title">약 이름으로 직접 찾기</h2>
                    <p className="desc">사진이 없어도 약 이름이나 증상으로 검색할 수 있어요.</p>
                    <form className="search-form" onSubmit={handleSearch}>
                      <label className="sr-only" htmlFor="medicine-query">약 이름이나 증상</label>
                      <input id="medicine-query" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 타이레놀, 혈압약, 감기약" disabled={loading} />
                      <button className="button primary" type="submit" disabled={loading || !query.trim()}>검색하기</button>
                    </form>
                  </section>
                </div>
              </div>
              {error && <div className="notice error-notice" role="alert"><span className="notice-mark" aria-hidden="true">!</span><p>{error}</p></div>}
              {loading && !selectedImage && <div className="panel loading-panel" role="status"><span className="spinner" aria-hidden="true"/><div><strong>약 정보를 확인하고 있어요</strong><p>{ocrStatus}</p></div></div>}
            </section>
          )}

          {activeView === 'meds' && (
            <section className="screen screen-meds" aria-labelledby="meds-title">
              <div className="page-heading"><span className="eyebrow">MY MEDICINE</span><h1 id="meds-title">내 복용약</h1><p>이 기기에 저장된 약을 확인하고 관리할 수 있어요.</p></div>
              <aside className="panel saved-panel" aria-labelledby="saved-title">
                <div className="title-row"><h2 id="saved-title">내가 복용 중인 약</h2><span className="count">{savedMeds.length}</span></div>
                <p className="device-note">이 기기에 저장된 약 목록</p>
                {savedMeds.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon" aria-hidden="true">＋</span><h3>아직 저장한 약이 없어요</h3><p>복약안내를 확인하고<br />복용 중인 약으로 저장해 보세요.</p><button className="button secondary" type="button" onClick={() => setActiveView('analysis')}>처방전 분석하기</button></div>
                ) : (
                  <ul className="saved-list">{savedMeds.map((name) => <li key={name}><span>{name}</span><button className="remove-saved" type="button" aria-label={`${name} 삭제`} onClick={() => handleRemoveMed(name)}>×</button></li>)}</ul>
                )}
                <div className="helper"><strong>새 약을 확인할 때 함께 비교해요</strong><p>저장된 약이 있으면 다음 분석에서 함께 복용할 때의 주의사항을 안내합니다.</p></div>
                <p className="device-note storage-note">같은 기기와 브라우저에서 다시 볼 수 있어요.</p>
              </aside>
            </section>
          )}

          {activeView === 'guidance' && (
            <section className="screen screen-guidance" aria-labelledby="guidance-title">
              <div className="page-heading"><span className="eyebrow">MEDICATION GUIDE</span><h1 id="guidance-title">복약안내</h1><p>분석한 약의 효능, 복용법, 주의사항을 확인하세요.</p></div>
              {result && !loading ? (
                <article className="panel result-panel" aria-labelledby="result-title">
                  <div className="result-top">
                    <div><span className="eyebrow">AI 분석 결과 · 참고용</span><h2 id="result-title">{result.title}</h2></div>
                    <div className="result-top-actions"><button className="button secondary" type="button" onClick={handleSpeak}>음성으로 듣기</button><button className="button secondary" type="button" onClick={handleStopSpeak}>정지</button></div>
                  </div>
                  {result.comparison && <div className="notice comparison"><span className="notice-mark" aria-hidden="true">↔</span><p><strong>저장된 약과 비교</strong>{result.comparison}</p></div>}
                  <div className="review"><strong>저장하기 전에 약 이름을 확인해 주세요.</strong><p>사진과 다르면 이름을 수정하고, 잘못 들어온 약은 삭제해 주세요.</p></div>
                  <div className="medicine-list">
                    {result.medicines.map((med, index) => (
                      <section className="medicine-card" key={index} aria-label={`약품 ${index + 1}`}>
                        <div className="medicine-heading"><span className="medicine-number">{String(index + 1).padStart(2, '0')}</span><input aria-label="약 이름" value={med.name} onChange={(e) => updateMed(index, 'name', e.target.value)} /><button className="delete-med" type="button" onClick={() => removeMed(index)}>이 약 삭제</button></div>
                        <dl className="details"><div className="detail"><dt>효능 및 효과</dt><dd>{med.efficacy}</dd></div><div className="detail"><dt>용법 및 용량</dt><dd>{med.dosage}</dd></div><div className="detail warning"><dt>주의사항</dt><dd>{med.warning}</dd></div></dl>
                      </section>
                    ))}
                  </div>
                  <button className="button primary save-button" type="button" onClick={handleSaveMeds}>확인한 약을 복용 중인 약으로 저장</button>
                  {savedNotice && <p className="save-status" role="status">{savedNotice}</p>}
                  <div className="notice result-caution"><span className="notice-mark" aria-hidden="true">!</span><p>위 내용은 AI가 생성한 참고용 정보이며 사진 인식 결과가 틀릴 수 있습니다. 약 이름과 용법을 처방전·약봉투와 다시 확인하고, 복용 전 의사·약사와 상담하세요.</p></div>
                </article>
              ) : (
                <div className="guidance-empty"><span className="empty-icon" aria-hidden="true">☷</span><h2>아직 안내 결과가 없어요</h2><p>처방전이나 약봉투를 분석하면 이곳에서 약 정보를 볼 수 있습니다.</p><button className="button primary" type="button" onClick={() => setActiveView('analysis')}>처방전 분석하러 가기</button></div>
              )}
            </section>
          )}

          {activeView === 'usage' && (
            <section className="screen screen-usage" aria-labelledby="usage-title">
              <section className="hero">
                <span className="eyebrow">쉽게 읽는 우리 가족 약 정보</span>
                <h1 id="usage-title">복잡한 복약 안내,<br /><span>이제 알기 쉽게.</span></h1>
                <p>처방전이나 약봉투 사진을 올려 주세요.<br />약 이름부터 복용법, 주의사항까지 정리해 드립니다.</p>
                <ol className="steps" aria-label="이용 순서"><li><span className="step-num">1</span> 사진 올리기</li><li><span className="step-num">2</span> 약 정보 확인</li><li><span className="step-num">3</span> 복용 약 저장</li></ol>
              </section>
              <section className="panel usage-panel">
                <span className="eyebrow">HOW TO USE</span><h2>쉽게 따라 하는 이용 순서</h2>
                <ol className="usage-list">
                  <li><span>01</span><div><strong>처방전·약봉투 사진 올리기</strong><p>개인정보가 보이지 않도록 가린 뒤 사진 전송에 동의하고 선택해 주세요.</p></div></li>
                  <li><span>02</span><div><strong>약 이름과 복용 정보를 확인하기</strong><p>AI가 정리한 약 이름, 효능, 복용법, 주의사항을 처방전과 비교해 주세요.</p></div></li>
                  <li><span>03</span><div><strong>복용 중인 약으로 저장하기</strong><p>확인한 약을 저장하면 다음 분석에서 새 약과 함께 볼 수 있습니다.</p></div></li>
                </ol>
                <div className="notice usage-notice"><span className="notice-mark" aria-hidden="true">!</span><p><strong>복용 전 의사·약사에게 확인하세요.</strong> AI 안내는 참고용이며 의료 전문가의 상담을 대신하지 않습니다.</p></div>
                <button className="button primary usage-cta" type="button" onClick={() => setActiveView('analysis')}>처방전 분석 시작하기</button>
              </section>
            </section>
          )}
          <footer className="site-footer">
            <strong>의약품 안내 AI</strong>
            <p>이 서비스는 AI가 생성한 참고용 정보를 제공하며 의사·약사의 상담을 대체하지 않습니다.</p>
            <div className="footer-feedback">
              <span>서비스를 더 편하게 사용할 수 있도록 의견을 들려주세요.</span>
              <a className="feedback-link" href="https://docs.google.com/forms/d/e/1FAIpQLSfKYaRVm-Vt9YyEmv0wa2b-cw4jOZ37WSD4UymspIwK0cq0xA/viewform" target="_blank" rel="noopener noreferrer">
                피드백 보내기 <span aria-hidden="true">↗</span>
              </a>
            </div>
          </footer>
        </main>
      </div>
      <div className="bottom-nav">{renderNav('bottom-nav-list')}</div>
    </div>
  );
}

export default App;
