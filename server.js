const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const axios   = require('axios');
const parseDocx = require('./parse-docx-table');
const cors = require('cors');

const app = express();

// 🔐 Apply CORS BEFORE routes
app.use(cors({
  origin: '*', // Replace with specific origin in prod
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
}));

// (Optional) Catch preflight manually — some hosts (like Render) need it
app.options('*', cors());

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('docx'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const parsedFields = await parseDocx(filePath);
    fs.unlinkSync(filePath);

const jsonToSend = {
  producer_name: req.body.producer_name || 'Generated via Upload',
  fields: parsedFields
};


    const snRes = await axios.post(
      'https://dev189486.service-now.com/api/1617036/docxproducerapi/produce',
      jsonToSend,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    res.json(snRes.data);
  } catch (err) {
    console.error('[SERVER] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[SERVER] Listening on http://localhost:${PORT}`));
