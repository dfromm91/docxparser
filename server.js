const express = require('express');
const fs = require('fs');
const path = require('path');
const parseDocx = require('./parse-docx-table'); // assumes this module exports a function

const app = express();

// Accept JSON with base64-encoded file
app.use(express.json({ limit: '15mb' }));

app.post('/api/parse-docx', async (req, res) => {
    try {
        const base64 = req.body?.file;
        if (!base64) {
            console.error('[API] No base64 file provided in request');
            return res.status(400).json({ error: 'Missing base64 file content' });
        }

        // Decode and save to disk
        const buffer = Buffer.from(base64, 'base64');
        const tempPath = path.join(__dirname, 'temp.docx');
        fs.writeFileSync(tempPath, buffer);
        console.log('[API] File written from base64 to:', tempPath);

        // Parse DOCX
        const result = await parseDocx(tempPath);
        console.log('[API] Parsed result:', result);

        // Clean up
        fs.unlinkSync(tempPath);
        return res.json(result);
    } catch (err) {
        console.error('[API] Error:', err);
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[API] Server running on port ${PORT}`);
});
