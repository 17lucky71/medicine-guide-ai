// Vercel 서버리스 함수: 사진/텍스트를 Gemini(멀티모달) 모델에 전달해 약 정보를 구조화해 돌려준다.
// 필요 환경변수: GEMINI_API_KEY (Vercel 프로젝트 Settings > Environment Variables), 선택: GEMINI_MODEL
const SYSTEM = `당신은 어르신을 돕는 복약 안내 도우미입니다. 반드시 JSON만 출력합니다.
형식: {"title": string, "comparison": string, "medicines": [{"name": string, "efficacy": string, "dosage": string, "warning": string}]}
규칙:
- 사진에 실제로 보이는 약 이름만 적습니다. 읽을 수 없거나 약이 없으면 medicines를 빈 배열로 둡니다. 절대 추측해서 만들지 않습니다.
- 사진에 복용법(1회 투약량/횟수/일수)이 있으면 그대로 dosage에 옮기고, 없으면 "사진에서 확인되지 않음, 약사에게 확인하세요"라고 적습니다.
- efficacy와 warning은 일반적으로 알려진 내용을 어르신이 이해하기 쉬운 짧은 문장으로 씁니다. 확실하지 않으면 "약사에게 확인하세요"라고 적습니다.
- 환자 이름, 주민등록번호, 전화번호 등 개인정보는 출력하지 않습니다.
- 사용자가 저장해 둔 복용 중인 약 목록이 주어지면, 이번 약과 함께 먹을 때 성분 중복·상호작용 등 주의할 점을 comparison에 쉬운 말로 씁니다. 근거가 불확실하면 "함께 먹어도 되는지 약사에게 확인하세요"라고 적습니다. 저장된 약이 없으면 comparison은 빈 문자열입니다.
- title은 "복약 안내" 같은 짧은 제목으로 씁니다.`;

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // 점검용: 키 값은 절대 노출하지 않고, 변수 존재 여부와 길이만 알려준다.
    if (req.query && req.query.models && process.env.GEMINI_API_KEY) {
      try {
        const mr = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100', { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } });
        const mj = await mr.json();
        return res.status(200).json({ status: mr.status, models: (mj.models || []).filter((m) => (m.supportedGenerationMethods || []).includes('generateContent')).map((m) => m.name), error: mj.error ? mj.error.message : undefined });
      } catch (e) { return res.status(200).json({ error: 'models 조회 실패' }); }
    }
    const names = Object.keys(process.env).filter((n) => n.toUpperCase().includes('GEMINI'));
    return res.status(200).json({ hasKey: !!process.env.GEMINI_API_KEY, keyLength: (process.env.GEMINI_API_KEY || '').length, geminiLikeNames: names.map((n) => JSON.stringify(n)), vercelEnv: process.env.VERCEL_ENV || null });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 지원합니다.' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: '서버에 AI 키가 설정되지 않았습니다. 관리자에게 문의하세요.' });

  const { type, image, query, savedMeds } = req.body || {};
  const saved = Array.isArray(savedMeds) ? savedMeds.filter((x) => typeof x === 'string').slice(0, 30).map((x) => x.slice(0, 60)) : [];
  const savedText = saved.length ? `\n저장된 복용 중인 약: ${saved.join(', ')}` : '\n저장된 복용 중인 약: 없음';
  let parts;
  if (type === 'image' && typeof image === 'string' && image.startsWith('data:image/')) {
    const m = image.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!m) return res.status(400).json({ error: '이미지 형식이 올바르지 않습니다.' });
    parts = [
      { text: '이 약봉투/처방전 사진에서 약 정보를 정리해 주세요.' + savedText },
      { inline_data: { mime_type: m[1], data: m[2] } }
    ];
  } else if (type === 'text' && typeof query === 'string' && query.trim()) {
    parts = [{ text: `다음 약 이름 또는 증상에 대해 정리해 주세요: ${query.trim().slice(0, 100)}${savedText}` }];
  } else {
    return res.status(400).json({ error: '요청 형식이 올바르지 않습니다.' });
  }

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    });
    if (!r.ok) {
      let detail = '';
      try { const ej = await r.json(); detail = (ej.error && ej.error.message) || ''; } catch (e) { /* 무시 */ }
      return res.status(502).json({ error: `AI 서비스 호출에 실패했습니다. (모델 ${model}, 상태 ${r.status}${detail ? ': ' + detail.slice(0, 160) : ''})` });
    }
    const j = await r.json();
    const parsed = JSON.parse(j.candidates[0].content.parts[0].text);
    const medicines = Array.isArray(parsed.medicines) ? parsed.medicines : [];
    if (medicines.length === 0) {
      return res.status(422).json({ error: '사진에서 약 이름을 읽지 못했습니다. 글자가 선명하게 보이도록 다시 찍어 주세요.' });
    }
    return res.status(200).json({ title: parsed.title || '복약 안내', comparison: typeof parsed.comparison === 'string' ? parsed.comparison : '', medicines });
  } catch (e) {
    return res.status(500).json({ error: '분석 중 오류가 발생했습니다. 다시 시도해 주세요.' });
  }
};
