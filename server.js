const express = require('express');
const fs = require('fs');
const path = require('path');
const parseDocx = require('./parse-docx-table');

const app = express();

// Accept raw binary stream from ServiceNow
app.post('/api/parse-docx', express.raw({ type: 'application/octet-stream', limit: '10mb' }), async (req, res) => {
    try {
        const tempPath = path.join(__dirname, 'temp.docx');

        // Save incoming binary to file
        fs.writeFileSync(tempPath, req.body);

        // Parse it
        const result = await parseDocx(tempPath);

        // Clean up
        fs.unlinkSync(tempPath);

        res.json(result);
    } catch (err) {
        console.error('Parsing failed:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
