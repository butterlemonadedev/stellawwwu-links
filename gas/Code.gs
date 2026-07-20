/**
 * Stella Wu mailing list — Google Apps Script backend
 *
 * Receives POSTs from the link-in-bio page and appends signups to a
 * Google Sheet. Deduplicates by email (case-insensitive).
 *
 * Sheet columns: Timestamp | Email | Source
 */

const SHEET_NAME = "Signups";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const email = String(data.email || "").trim().toLowerCase();

    // basic server-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: "invalid email" });
    }

    const sheet = getSheet_();

    // dedupe: skip if email already present
    const emails = sheet
      .getRange(1, 2, Math.max(sheet.getLastRow(), 1), 1)
      .getValues()
      .flat()
      .map(v => String(v).trim().toLowerCase());
    if (emails.includes(email)) {
      return json_({ ok: true, deduped: true });
    }

    sheet.appendRow([new Date(), email, String(data.source || "unknown")]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Email", "Source"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
