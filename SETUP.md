# stellawwwu-links — setup

Link-in-bio page for @stellawwwu with a mailing-list signup form.
Page is hosted on GitHub Pages; signups are stored in a Google Sheet
via Google Apps Script (same pattern as the baby-shower-invite project).

## One-time: deploy the Apps Script (~5 minutes)

1. Go to [sheets.new](https://sheets.new) and create a spreadsheet.
   Name it e.g. **"Stella — Mailing List"**.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of `gas/Code.gs`.
4. **Deploy → New deployment → Web app**:
   - Description: `mailing list`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorise when prompted, and copy the
   **Web app URL** (ends in `/exec`).
6. Paste that URL to Claude (or replace `__SCRIPT_URL__` in
   `index.html` yourself) and push.

## Exporting the list later

The sheet **is** the list: Timestamp | Email | Source, deduplicated.
When you move to Mailchimp/Buttondown/etc., export the Email column
as CSV and import it.

## Hosting

GitHub Pages serves `index.html` from the `main` branch of
`butterlemonadedev/stellawwwu-links`. Any push to `main` redeploys
automatically within a minute or two.
