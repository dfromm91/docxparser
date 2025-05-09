const fs = require("fs");
const mammoth = require("mammoth");
const cheerio = require("cheerio");

async function parseDocxTable(filePath) {
  const { value: html } = await mammoth.convertToHtml({ path: filePath });
  const $ = cheerio.load(html);

  const tables = $("table");
  if (tables.length === 0) throw new Error("No table found in document.");

  const table = tables.first();
  const rows = table.find("tr");

  const headers = [];
  const data = [];

  rows.each((i, row) => {
    const cells = $(row).find("td");
    if (i === 0) {
      cells.each((_, cell) => headers.push($(cell).text().trim()));
    } else {
      const rowData = {};
      cells.each((j, cell) => {
        rowData[headers[j] || `Column${j + 1}`] = $(cell).text().trim();
      });
      if (Object.values(rowData).some((v) => v)) {
        data.push(rowData);
      }
    }
  });

  return data;
}

module.exports = parseDocxTable;
