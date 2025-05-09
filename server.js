const express = require("express");
const multer = require("multer");
const parseDocxTable = require("./parse-docx-table");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/api/parse-docx", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await parseDocxTable(filePath);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.json(result);
  } catch (err) {
    console.error("Parsing failed:", err);
    res.status(500).json({ error: "Parsing failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ API listening at http://localhost:${PORT}`)
);
