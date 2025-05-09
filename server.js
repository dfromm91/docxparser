const express = require('express');
const fs      = require('fs');
const path    = require('path');
const parseDocx = require('./parse-docx-table');

const app = express();

// This stays the same—accept raw binary bodies
app.post('/api/parse-docx', express.raw({ type: 'application/octet-stream', limit: '15mb' }), async (req, res) => {
  try {
    console.log('[API] Received bytes:', req.body.length);
    const tmp = path.join(__dirname, 'temp.docx');
    fs.writeFileSync(tmp, req.body);
    const result = await parseDocx(tmp);
    fs.unlinkSync(tmp);
    res.json(result);
  } catch (e) {
    console.error('[API] Error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT||3000, () => console.log('API listening'));
