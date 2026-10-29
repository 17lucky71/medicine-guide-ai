import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import MedicineEntryDialog from './MedicineEntryDialog';
import { loadSavedMeds, storeSavedMeds, loadSavedPrescriptions, storeSavedPrescriptions } from './medicationStorage';

const formatPrescriptionPeriod = (date, days) => {
  if (!date || !Number.isInteger(days) || days < 1) return '확인되지 않음';
  const start = new Date(`${date}T00:00:00`);
  if (Number.isNaN(start.getTime())) return '확인되지 않음';
  const end = new Date(start);
  end.setDate(start.getDate() + days - 1);
  const format = (value) => `${value.getFullYear()}.${String(value.getMonth() + 1).padStart(2, '0')}.${String(value.getDate()).padStart(2, '0')}`;
  return `${format(start)} ~ ${format(end)}`;
};

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState('16px');
  const [activeView, setActiveView] = useState('analysis');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [entryMethod, setEntryMethod] = useState(null);
  const [photoKind, setPhotoKind] = useState('bag');
  const [searchResults, setSearchResults] = useState(null);
  const [resultSource, setResultSource] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
  }, [selectedImage]);
  useEffect(() => () => requestRef.current?.abort(), []);

  const resetEntry = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setQuery('');
    setSearchResults(null);
    setSelectedImage(null);
    setAgreed(false);
    setPhotoKind('bag');
    setLoading(false);
    setOcrStatus('');
    setError('');
  };
  const openEntry = (method, kind = 'bag') => {
    resetEntry();
    setPhotoKind(kind);
    setEntryMethod(method);
  };
  const closeEntry = () => { resetEntry(); setEntryMethod(null); };
  const startRequest = () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError('');
    return controller;
  };
  const showResult = (data, source) => {
    setResult(data);
    setResultSource(source);
    setAcknowledged(false);
    setResultSaved(false);
    setSavedNotice('');
    closeEntry();
    setActiveView('guidance');
  };
  const [agreed, setAgreed] = useState(false);
  const [savedMeds, setSavedMeds] = useState(loadSavedMeds);
  const [savedPrescriptions, setSavedPrescriptions] = useState(loadSavedPrescriptions);
  const persistMeds = (list) => {
    setSavedMeds(list);
    storeSavedMeds(list);
  };
  const persistPrescriptions = (list) => {
    setSavedPrescriptions(list);
    storeSavedPrescriptions(list);
  };
  const updateMed = (index, field, value) => {
    setResult((r) => ({ ...r, comparison: '중복 확인 불가: 제품 이름이 변경되었습니다. 정확한 제품 이름이나 성분표로 다시 확인해 주세요.', medicines: r.medicines.map((m, i) => (i === index ? { ...m, [field]: value } : m)) }));
    setSavedNotice('');
    setAcknowledged(false);
    setResultSaved(false);
  };
  const removeMed = (index) => {
    setResult((r) => ({ ...r, medicines: r.medicines.filter((_, i) => i !== index) }));
    setSavedNotice('');
    setAcknowledged(false);
  };
  const [savedNotice, setSavedNotice] = useState('');
  const handleSaveMeds = () => {
    if (!result || !acknowledged || resultSaved) return;
    const names = result.medicines.map((m) => (m.name || '').trim()).filter(Boolean);
    if (names.length === 0) { setSavedNotice('저장할 약이 없습니다.'); return; }
    persistMeds(Array.from(new Set([...savedMeds, ...names])));
    if (resultSource === 'bag') {
      const prescription = result.prescription || {};
      persistPrescriptions([{
        id: `prescription-${Date.now()}`,
        hospitalName: prescription.hospitalName || '',
        manufactureDate: prescription.manufactureDate || '',
        days: Number.isInteger(prescription.days) ? prescription.days : null,
        medicines: names,
      }, ...savedPrescriptions]);
      setSavedNotice('약봉투별 복용약을 저장했습니다.');
      setResultSaved(true);
      setActiveView('meds');
      return;
    }
    setSavedNotice(`${names.length}개 약·영양제를 저장했습니다.`);
    setResultSaved(true);
    setActiveView('meds');
  };
  const handleRemoveMed = (name) => persistMeds(savedMeds.filter((n) => n !== name));
  const handleRemovePrescriptionMed = (prescriptionId, name) => {
    const nextPrescriptions = savedPrescriptions.map((prescription) => (
      prescription.id === prescriptionId
        ? { ...prescription, medicines: prescription.medicines.filter((medicine) => medicine !== name) }
        : prescription
    ));
    const stillGrouped = nextPrescriptions.some((prescription) => prescription.medicines.includes(name));
    if (!stillGrouped) persistMeds(savedMeds.filter((medicine) => medicine !== name));
    persistPrescriptions(nextPrescriptions);
  };
  const [error, setError] = useState('');
  const navItems = [
    { id: 'analysis', label: '약·영양제 추가', icon: '▤' },
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
      try {
        const max = 1400;
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.85));
      } catch {
        reject(new Error('사진을 준비하지 못했습니다. 다른 사진으로 다시 선택해 주세요.'));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 읽을 수 없습니다. 다른 사진을 선택해 주세요.'));
    };
    img.src = url;
  });

  const callApi = async (payload, signal) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    if (!Array.isArray(data.medicines)) throw new Error('분석 결과를 읽을 수 없습니다. 다시 시도해 주세요.');
    return { ...data, medicines: data.medicines.filter((medicine) => typeof medicine?.name === 'string' && medicine.name.trim()) };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    const controller = startRequest();
    setSearchResults(null);
    setOcrStatus('약·영양제 이름을 확인하고 있습니다.');
    try {
      const data = await callApi({ type: 'text', query: query.trim(), savedMeds }, controller.signal);
      if (controller.signal.aborted) return;
      setSearchResults(data.medicines);
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      if (requestRef.current === controller) setLoading(false);
    }
  };

  const handleProductSelect = async (medicine) => {
    if (loading) return;
    const controller = startRequest();
    setOcrStatus('선택한 제품을 저장된 약·영양제와 비교하고 있습니다.');
    try {
      const data = await callApi({ type: 'text', query: medicine.name, savedMeds }, controller.signal);
      if (controller.signal.aborted) return;
      if (!data.medicines.length) { setSearchResults([]); return; }
      showResult(data, 'individual');
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      if (requestRef.current === controller) setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || loading) return;
    if (!agreed) {
      setError('사진 분석 전에 아래 동의 항목을 먼저 체크해 주세요.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일을 선택해 주세요.');
      return;
    }
    const controller = startRequest();
    const source = photoKind === 'bag' ? 'bag' : 'individual';
    setSelectedImage(URL.createObjectURL(file));
    setOcrStatus('사진 속 약·영양제 정보를 읽고 있습니다.');
    try {
      const image = await resizeImage(file);
      if (controller.signal.aborted) return;
      const data = await callApi({ type: 'image', image, savedMeds }, controller.signal);
      if (controller.signal.aborted) return;
      if (!data.medicines.length) {
        setError('사진에서 제품 이름을 확인하지 못했습니다. 제품명과 성분표가 선명한 사진으로 다시 선택해 주세요.');
        return;
      }
      showResult(data, source);
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      if (requestRef.current === controller) setLoading(false);
    }
  };

  const handleGoHome = () => {
    closeEntry();
    setActiveView('analysis');
    setSavedNotice('');
    setResult(null);
    setResultSource(null);
    setResultSaved(false);
    setAcknowledged(false);
    window.speechSynthesis?.cancel();
    window.scrollTo(0, 0);
  };
  const handleStopSpeak = () => {
    window.speechSynthesis?.cancel();
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

  const groupedMedicationNames = new Set(savedPrescriptions.flatMap((prescription) => prescription.medicines || []));
  const ungroupedMeds = savedMeds.filter((name) => !groupedMedicationNames.has(name));

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
                <h1 id="analysis-title">약·영양제 추가하기</h1>
                <p>먹고 있는 약이나 영양제, 편한 방법으로 추가하세요.</p>
              </div>
              <div className="add-methods" aria-label="추가 방법">
                <button className="add-method" type="button" aria-haspopup="dialog" onClick={() => openEntry('photo')}>
                  <span className="method-icon" aria-hidden="true">▧</span><span><strong>사진으로 추가</strong><small>약봉투 · 제품 · 성분표 사진</small></span>
                </button>
                <button className="add-method" type="button" aria-haspopup="dialog" onClick={() => openEntry('name')}>
                  <span className="method-icon" aria-hidden="true">⌕</span><span><strong>이름으로 추가</strong><small>약·영양제 이름 검색</small></span>
                </button>
              </div>
            </section>
          )}

          {entryMethod && (
            <MedicineEntryDialog method={entryMethod} onClose={closeEntry}>
              {entryMethod === 'photo' ? (
                <section className="panel upload-panel" aria-label="약·영양제 사진 분석">
                  <div className="dropzone">
                    {loading && selectedImage ? (
                      <div className="image-preview visible" role="status">
                        <img src={selectedImage} alt="분석 중인 사진" />
                        <div className="image-analysis-status"><span className="spinner" aria-hidden="true" /><div><strong>사진을 분석하고 있어요</strong><p>{ocrStatus}</p></div></div>
                      </div>
                    ) : (
                      <>
                        <svg className="paper-icon" viewBox="0 0 56 56" fill="none" aria-hidden="true"><rect x="12" y="6" width="32" height="44" rx="5" stroke="currentColor" strokeWidth="2"/><path d="M20 18h16M20 24h10M28 40V30m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <h3>사진 한 장으로 시작하세요</h3>
                        <p>약봉투나 제품명·성분표가 선명한 사진을 선택해 주세요.</p>
                        <label className="consent">
                          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                          <span><strong>사진의 외부 AI 전송에 동의합니다.</strong><span>약 정보 분석을 위해 사진을 외부 AI 서비스로 전송하며 서버에 저장하지 않습니다. 이름·주민등록번호·전화번호는 가리고 올려 주세요.</span></span>
                        </label>
                        <label className={'button primary file-label ' + (!agreed ? 'disabled' : '')}>
                          사진 선택하기 <span aria-hidden="true">↗</span>
                          <input type="file" accept="image/*" aria-label="약봉투 또는 제품·성분표 사진 선택" disabled={!agreed || loading} onChange={handleImageChange} />
                        </label>
                        <small>{agreed ? '사진을 선택하면 분석이 시작됩니다.' : '사진 전송 동의 후 선택할 수 있어요.'}</small>
                      </>
                    )}
                  </div>
                </section>
              ) : (
                <section className="panel search-panel" aria-labelledby="search-title">
                  <h2 className="panel-title" id="search-title">약·영양제 이름 검색</h2>
                  <p className="desc">제품에 적힌 정확한 이름을 입력하고, 검색된 이름이 맞는지 확인해 주세요.</p>
                  <form className="search-form" onSubmit={handleSearch}>
                    <label className="sr-only" htmlFor="medicine-query">약·영양제 이름</label>
                    <input id="medicine-query" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSearchResults(null); }} placeholder="예: 타이레놀, 비타민 제품명" disabled={loading} />
                    <button className="button primary" type="submit" disabled={loading || !query.trim()}>검색하기</button>
                  </form>
                  {loading && <div className="loading-panel" role="status"><span className="spinner" aria-hidden="true"/><p>{ocrStatus}</p></div>}
                  {searchResults && !loading && (
                    <div className="product-results" aria-live="polite">
                      {searchResults.length ? <>
                        <p className="desc">AI가 찾은 이름입니다. 제품명·함량이 실제 제품과 다르면 사진으로 추가해 주세요.</p>
                        {searchResults.map((medicine, index) => (
                          <button className="product-choice" type="button" key={index} onClick={() => handleProductSelect(medicine)}><strong>{medicine.name}</strong><span className="tag">선택</span></button>
                        ))}
                      </> : <div className="empty-state"><h3>검색한 제품을 확인하지 못했어요</h3><p>제품명과 성분표가 보이는 사진을 추가해 주세요.<br/>성분이 확인되지 않으면 중복 확인이 불가능합니다.</p></div>}
                      <button className="button secondary" type="button" onClick={() => openEntry('photo', 'product')}>제품·성분표 사진으로 추가</button>
                    </div>
                  )}
                </section>
              )}
              {error && <div className="notice error-notice" role="alert"><span className="notice-mark" aria-hidden="true">!</span><p>{error}</p></div>}
            </MedicineEntryDialog>
          )}

          {activeView === 'meds' && (
            <section className="screen screen-meds" aria-labelledby="meds-title">
              <div className="page-heading"><h1 id="meds-title">내 복용약</h1><p>이 기기에 저장된 약을 확인하고 관리할 수 있어요.</p></div>
              {savedNotice && <div className="complete-banner" role="status"><h2>복용 목록에 저장했어요</h2><p>{savedNotice}</p><button className="button primary" type="button" onClick={handleGoHome}>다른 약·영양제 추가하기</button></div>}
              <aside className="panel saved-panel" aria-labelledby="saved-title">
                <div className="title-row">
                  <div className="saved-title-group">
                    <h2 id="saved-title">내가 복용 중인 약·영양제</h2>
                    <button className="add-icon" type="button" onClick={handleGoHome} aria-label="약·영양제 추가하기" title="약·영양제 추가하기"><span aria-hidden="true">+</span></button>
                  </div>
                  <span className="count">{savedMeds.length}</span>
                </div>
                {savedMeds.length === 0 && savedPrescriptions.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon" aria-hidden="true">＋</span><h3>아직 저장한 약이 없어요</h3><p>복약안내를 확인하고<br />복용 중인 약으로 저장해 보세요.</p></div>
                ) : (
                  <>
                    {savedPrescriptions.length > 0 && <h3 className="saved-section-title">약봉투별 복용약</h3>}
                    {savedPrescriptions.map((prescription, index) => (
                      <section className="saved-prescription" key={prescription.id} aria-label={`약봉투 ${index + 1}`}>
                        <div className="saved-prescription-heading">
                          <h3>{prescription.hospitalName || '병원명 확인 필요'}</h3>
                          <span className="bag-label">약봉투 {index + 1}</span>
                        </div>
                        <p className="prescription-period">
                          {formatPrescriptionPeriod(prescription.manufactureDate, prescription.days).replace(' ~ ', '~')}
                          {' ('}{Number.isInteger(prescription.days) ? `${prescription.days}일` : '복용 일수 확인 필요'}{')'}
                        </p>
                        <ul className="saved-list">{prescription.medicines.map((name) => <li key={name}><span>{name}</span><button className="remove-saved" type="button" aria-label={`${prescription.hospitalName || '약봉투'}의 ${name} 삭제`} onClick={() => handleRemovePrescriptionMed(prescription.id, name)}>×</button></li>)}</ul>
                      </section>
                    ))}
                    {ungroupedMeds.length > 0 && <section className="saved-prescription manual-saved"><h3>개별 추가한 약·영양제</h3><ul className="saved-list">{ungroupedMeds.map((name) => <li key={name}><span>{name}</span><button className="remove-saved" type="button" aria-label={`${name} 삭제`} onClick={() => handleRemoveMed(name)}>×</button></li>)}</ul></section>}
                  </>
                )}
                <div className="helper"><strong>새 약을 확인할 때 함께 비교해요</strong><p>저장된 약이 있으면 다음 분석에서 함께 복용할 때의 주의사항을 안내합니다.</p></div>
                <p className="device-note storage-note">같은 기기와 브라우저에서 다시 볼 수 있어요.</p>
              </aside>
            </section>
          )}

          {activeView === 'guidance' && (
            <section className="screen screen-guidance" aria-labelledby="guidance-title">
              <div className="page-heading"><h1 id="guidance-title">복약안내</h1><p>분석한 약의 효능, 복용법, 주의사항을 확인하세요.</p></div>
              {result && !loading ? (
                <article className="panel result-panel" aria-labelledby="result-title">
                  <div className="result-top">
                    <div><span className="eyebrow">AI 분석 결과 · 참고용</span><h2 id="result-title">{result.title}</h2></div>
                    <div className="result-top-actions"><button className="button secondary" type="button" onClick={handleSpeak}>음성으로 듣기</button><button className="button secondary" type="button" onClick={handleStopSpeak}>정지</button></div>
                  </div>
                  <div className="notice comparison"><span className="notice-mark" aria-hidden="true">↔</span><p><strong>약·영양제 중복 확인 · AI 참고 정보</strong>{result.comparison || (savedMeds.length ? '중복 확인 불가: 성분 비교 결과가 없습니다. 제품·성분표를 확인하거나 약사에게 문의하세요.' : '비교할 기존 약·영양제가 없습니다.')}<br/>제품 성분·함량이 확인되지 않은 항목은 중복 여부를 확정할 수 없습니다. 함께 복용해도 안전하다는 의미는 아닙니다.</p></div>
                  <div className="medicine-list">
                    {result.medicines.map((med, index) => (
                      <section className="medicine-card" key={index} aria-label={`약품 ${index + 1}`}>
                        <div className="medicine-heading"><span className="medicine-number">{String(index + 1).padStart(2, '0')}</span><input aria-label="약 이름" value={med.name} onChange={(e) => updateMed(index, 'name', e.target.value)} /><button className="delete-med" type="button" onClick={() => removeMed(index)}>이 약 삭제</button></div>
                        <dl className="details"><div className="detail"><dt>효능 및 효과</dt><dd>{med.efficacy}</dd></div><div className="detail"><dt>용법 및 용량</dt><dd>{med.dosage}</dd></div><div className="detail warning"><dt>주의사항</dt><dd>{med.warning}</dd></div></dl>
                      </section>
                    ))}
                  </div>
                  <label className="check-consent"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} /><span>중복 확인 결과와 확인이 필요한 항목을 읽었습니다. 주의가 필요한 경우 의사·약사에게 확인하겠습니다.</span></label>
                  <button className="button primary save-button" type="button" disabled={!acknowledged || resultSaved || !result.medicines.length} onClick={handleSaveMeds}>{resultSaved ? '저장 완료' : '확인한 약·영양제 저장하기'}</button>
                  <button className="button secondary result-add" type="button" onClick={handleGoHome}>다른 약·영양제 추가하기</button>
                  {savedNotice && <p className="save-status" role="status">{savedNotice}</p>}
                  <div className="notice result-caution"><span className="notice-mark" aria-hidden="true">!</span><p>위 내용은 AI가 생성한 참고용 정보이며 사진 인식 결과가 틀릴 수 있습니다. 약 이름과 용법을 처방전·약봉투와 다시 확인하고, 복용 전 의사·약사와 상담하세요.</p></div>
                </article>
              ) : (
                <div className="guidance-empty"><span className="empty-icon" aria-hidden="true">☷</span><h2>아직 안내 결과가 없어요</h2><p>처방전이나 약봉투를 분석하면 이곳에서 약 정보를 볼 수 있습니다.</p><button className="button primary" type="button" onClick={() => setActiveView('analysis')}>약·영양제 추가하러 가기</button></div>
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
              <button className="button primary usage-cta" type="button" onClick={() => setActiveView('analysis')}>약·영양제 추가 시작하기</button>
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
