import health from '../api/health';

const createResponse = () => ({
  statusCode: null,
  headers: {},
  body: null,
  setHeader(name, value) {
    this.headers[name] = value;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test('GET 헬스체크는 상태와 시각을 반환한다', () => {
  const res = createResponse();

  health({ method: 'GET' }, res);

  expect(res.statusCode).toBe(200);
  expect(res.headers['Cache-Control']).toBe('no-store');
  expect(res.body.status).toBe('ok');
  expect(res.body.service).toBe('medicine-guide-ai');
  expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
});

test('GET 이외의 요청은 405와 허용 메서드를 반환한다', () => {
  const res = createResponse();

  health({ method: 'POST' }, res);

  expect(res.statusCode).toBe(405);
  expect(res.headers.Allow).toBe('GET');
  expect(res.body.status).toBe('error');
});
