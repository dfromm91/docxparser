const parseDocxTable = require("./parse-docx-table");

(async () => {
  try {
    const result = await parseDocxTable("./Recreated_ServiceNow_Form.docx");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Failed to parse document:", err);
  }
})();
