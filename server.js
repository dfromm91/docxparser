const express = require('express');
const fs = require('fs');
const path = require('path');
const parseDocx = require('./parse-docx-table');

const app = express();

// Handle raw binary file uploads from ServiceNow
app.post('/api/parse-docx', express.raw({ type: 'application/octet-stream', limit: '10mb' }), async (req, res) => {
    try {
        console.log('[API] Received request body, length:', req.body.length);

        const tempPath = path.join(__dirname, 'temp.docx');
        fs.writeFileSync(tempPath, req.body);
        console.log('[API] File saved to:', tempPath);

        const result = await parseDocx(tempPath);
        console.log('[API] Parsed result:', result);

        fs.unlinkSync(tempPath); // cleanup
        return res.json(result);
    } catch (err) {
        console.error('[API] Error:', err);
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[API] Server running on port ${PORT}`));
