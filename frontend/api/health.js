module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ status: 'error', error: 'Method Not Allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'medicine-guide-ai',
    timestamp: new Date().toISOString()
  });
};
