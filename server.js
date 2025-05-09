const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');
const axios   = require('axios');
const parseDocx = require('./parse-docx-table'); // your existing function

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Serves index.html

app.post('/upload', upload.single('docx'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const parsedFields = await parseDocx(filePath); // returns your fields array
    fs.unlinkSync(filePath); // cleanup

    const jsonToSend = {
      producer_name: 'Form via Web Upload',
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
