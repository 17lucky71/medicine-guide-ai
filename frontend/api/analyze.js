// Vercel serverless function: sends prescription/medicine-bag images to an AI provider.
// GEMINI_API_KEY is primary; INSTITUTION_OPENAI_API_KEY is the OpenAI-compatible fallback.
const SYSTEM = `당신은 어르신을 돕는 복약 안내 도우미입니다. 반드시 JSON만 출력합니다.
형식: {"title": string, "comparison": string, "prescription": {"hospitalName": string, "manufactureDate": string, "days": number|null}, "medicines": [{"name": string, "efficacy": string, "dosage": string, "warning": string}]}
규칙:
- 약뿐 아니라 영양제 제품명과 성분표도 읽습니다. 제품명·성분·함량이 확인되지 않으면 추측하지 않습니다. 텍스트 검색은 입력된 제품 이름만 확인하며, 증상에 맞는 약을 추천하거나 가상의 제품을 만들지 않습니다. 제품을 특정할 수 없으면 medicines는 빈 배열로 둡니다.
- 성분이나 함량이 확인되지 않은 제품의 중복·상호작용은 확정하지 않고 comparison에 "중복 확인 불가: 제품 성분·함량을 확인하고 약사에게 문의하세요"라고 명시합니다. 중복 성분이 확인되면 어떤 제품과 성분이 겹치는지 설명하며, 중복이 없다고 함께 복용해도 안전하다고 판단하지 않습니다.
- 사진에 약봉투가 있으면 병원명, 제조일(또는 조제일), 총 복용 일수를 사진에서 읽어 prescription에 넣습니다. 제조일은 YYYY-MM-DD 형식으로 씁니다. 약마다 복용 기간이 다르거나 전체 일수를 알 수 없으면 days는 null로 둡니다.
- 병원명이나 제조일이 보이지 않으면 빈 문자열, 총 복용 일수를 확인할 수 없으면 null로 둡니다. 추측하거나 임의 날짜를 만들지 않습니다.
- 텍스트 검색 요청은 prescription을 {"hospitalName":"","manufactureDate":"","days":null}로 둡니다.
- 사진에 실제로 보이는 약 이름만 적습니다. 읽을 수 없거나 약이 없으면 medicines를 빈 배열로 둡니다. 절대 추측해서 만들지 않습니다.
- 사진에 복용법(1회 투약량/횟수/일수)이 있으면 그대로 dosage에 옮기고, 없으면 "사진에서 확인되지 않음, 약사에게 확인하세요"라고 적습니다.
- efficacy와 warning은 일반적으로 알려진 내용을 어르신이 이해하기 쉬운 짧은 문장으로 씁니다. 확실하지 않으면 "약사에게 확인하세요"라고 적습니다.
- 줄이 그어졌거나 손으로 지워진 약, 글자가 흐려 확실히 읽을 수 없는 약은 medicines에 넣지 않습니다. 이름은 사진에 인쇄된 글자를 그대로 옮기고, 비슷한 다른 약 이름으로 바꾸지 않습니다. 끝의 제형(정, 캡슐)과 용량(mg)도 보이는 대로 씁니다.
- 환자 이름, 주민등록번호, 전화번호 등 개인정보는 출력하지 않습니다.
- 사용자가 저장해 둔 복용 중인 약 목록이 주어지면, 이번 약과 함께 먹을 때 성분 중복·상호작용 등 주의할 점을 comparison에 쉬운 말로 씁니다. 근거가 불확실하면 "함께 먹어도 되는지 약사에게 확인하세요"라고 적습니다. 저장된 약이 없으면 comparison은 빈 문자열입니다.
- title은 "복약 안내" 같은 짧은 제목으로 씁니다.`;

const parseJsonContent = (content) => {
  const text = Array.isArray(content)
    ? content.map((part) => (part && typeof part.text === 'string' ? part.text : '')).join('')
    : content;
  if (typeof text !== 'string') throw new Error('AI 응답 형식이 올바르지 않습니다.');
  const jsonText = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(jsonText);
};

const callInstitutionApi = async ({ key, type, image, query, savedText }) => {
  const baseUrl = (process.env.INSTITUTION_OPENAI_BASE_URL || 'https://copa.codyssey.kr/v1').replace(/\/+$/, '');
  const model = process.env.INSTITUTION_OPENAI_MODEL || 'gpt-5.4-mini';
  const userContent = type === 'image'
    ? [
        { type: 'text', text: '이 약봉투/처방전 또는 약·영양제 제품/성분표 사진에서 제품 정보와 확인 가능한 약봉투 정보를 읽어 주세요.' + savedText },
        { type: 'image_url', image_url: { url: image } }
      ]
    : `다음 약·영양제 제품 이름을 확인해 주세요: ${query.trim().slice(0, 100)}${savedText}`;
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userContent }
      ]
    })
  });
  if (!response.ok) {
    return { error: true, status: response.status };
  }
  const data = await response.json();
  return { parsed: parseJsonContent(data.choices?.[0]?.message?.content) };
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 지원합니다.' });

  const geminiKey = process.env.GEMINI_API_KEY;
  const institutionKey = process.env.INSTITUTION_OPENAI_API_KEY;
  if (!geminiKey && !institutionKey) {
    return res.status(500).json({ error: '서버에 AI 키가 설정되지 않았습니다. 관리자에게 문의하세요.' });
  }

  const { type, image, query, savedMeds } = req.body || {};
  const saved = Array.isArray(savedMeds) ? savedMeds.filter((x) => typeof x === 'string').slice(0, 30).map((x) => x.slice(0, 60)) : [];
  const savedText = saved.length ? `\n저장된 복용 중인 약: ${saved.join(', ')}` : '\n저장된 복용 중인 약: 없음';
  let parts;
  if (type === 'image' && typeof image === 'string' && image.startsWith('data:image/')) {
    const match = image.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: '이미지 형식이 올바르지 않습니다.' });
    parts = [
      { text: '이 약봉투/처방전 또는 약·영양제 제품/성분표 사진에서 제품 정보와 확인 가능한 약봉투 정보를 읽어 주세요.' + savedText },
      { inline_data: { mime_type: match[1], data: match[2] } }
    ];
  } else if (type === 'text' && typeof query === 'string' && query.trim()) {
    parts = [{ text: `다음 약·영양제 제품 이름을 확인해 주세요: ${query.trim().slice(0, 100)}${savedText}` }];
  } else {
    return res.status(400).json({ error: '요청 형식이 올바르지 않습니다.' });
  }

  try {
    let parsed;
    if (geminiKey) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
        })
      });

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        parsed = parseJsonContent(data.candidates?.[0]?.content?.parts?.[0]?.text);
      } else {
        let detail = '';
        try {
          const errorData = await geminiResponse.json();
          detail = (errorData.error && errorData.error.message) || '';
        } catch (error) {
          // Ignore a non-JSON provider error body.
        }
        const quotaExceeded = geminiResponse.status === 429
          || (geminiResponse.status === 403 && /(quota|rate.?limit|resource.?exhausted)/i.test(detail));
        if (!institutionKey || !quotaExceeded) {
          return res.status(502).json({ error: `AI 서비스 호출에 실패했습니다. (모델 ${model}, 상태 ${geminiResponse.status}${detail ? ': ' + detail.slice(0, 160) : ''})` });
        }
      }
    }

    if (!parsed && institutionKey) {
      const fallback = await callInstitutionApi({ key: institutionKey, type, image, query, savedText });
      if (fallback.error) {
        return res.status(502).json({ error: `기관 AI 서비스 호출에 실패했습니다. (상태 ${fallback.status})` });
      }
      parsed = fallback.parsed;
    }

    const medicines = Array.isArray(parsed.medicines) ? parsed.medicines : [];
    const rawPrescription = parsed.prescription && typeof parsed.prescription === 'object' ? parsed.prescription : {};
    const prescription = type === 'image'
      ? {
          hospitalName: typeof rawPrescription.hospitalName === 'string' ? rawPrescription.hospitalName.trim().slice(0, 100) : '',
          manufactureDate: typeof rawPrescription.manufactureDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawPrescription.manufactureDate.trim())
            ? rawPrescription.manufactureDate.trim()
            : '',
          days: Number.isInteger(rawPrescription.days) && rawPrescription.days > 0 && rawPrescription.days <= 365
            ? rawPrescription.days
            : null
        }
      : { hospitalName: '', manufactureDate: '', days: null };
    if (medicines.length === 0) {
      const error = type === 'image'
        ? '사진에서 약 이름을 읽지 못했습니다. 글자가 선명하게 보이도록 다시 찍어 주세요.'
        : '입력한 이름으로 약·영양제 정보를 찾지 못했습니다. 제품명을 확인해 다시 검색해 주세요.';
      return res.status(422).json({ error });
    }
    return res.status(200).json({ title: parsed.title || '복약 안내', comparison: typeof parsed.comparison === 'string' ? parsed.comparison : '', prescription, medicines });
  } catch (e) {
    return res.status(500).json({ error: '분석 중 오류가 발생했습니다. 다시 시도해 주세요.' });
  }
};
