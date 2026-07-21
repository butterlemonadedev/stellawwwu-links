# stellawu.com — link-in-bio + mailing list

Live at **https://stellawu.com** (stellawu.com.au and www redirect there).
Link page for @stellawwwu with a mailing-list signup form.

## Architecture (all live as of 21 Jul 2026)

```
stellawu.com  (GoDaddy DNS → GitHub Pages, HTTPS enforced)
  └─ index.html (this repo, branch main — any push redeploys in ~1 min)
       └─ "save my seat" form → POST → Google Apps Script web app
            └─ Google Sheet "Stella — Mailing List" → tab "Signups"
                 (Timestamp | Email | Source, deduped by email)
```

- **DNS (GoDaddy, stellawu.com)**: 4× A records `@` → 185.199.108/109/110/111.153,
  CNAME `www` → `butterlemonadedev.github.io`. Do not touch NS/SOA records.
  stellawu.com.au uses GoDaddy domain forwarding (301) → https://stellawu.com.
- **Hosting**: GitHub Pages on `butterlemonadedev/stellawwwu-links`, custom
  domain via `CNAME` file in repo root.
- **Backend**: Apps Script project **"Stella Mailing List"** (standalone script,
  in stellawucomedy@gmail.com's account at script.google.com). Deployed as web
  app: Execute as Me, access: Anyone. `gas/Code.gs` in this repo mirrors the
  deployed code (writes to the sheet by ID via `openById`).
- **Endpoint**: the `SCRIPT_URL` constant in `index.html`
  (`https://script.google.com/macros/s/AKfycbzI3JPB.../exec`).

## Changing the backend code

1. Edit the code at [script.google.com](https://script.google.com) (project
   "Stella Mailing List") — keep `gas/Code.gs` here in sync.
2. **Deploy → Manage deployments → ✏️ edit → Version: New version → Deploy.**
   The /exec URL stays the same; no site change needed.
   (A brand-new deployment would mint a new URL and require updating
   `SCRIPT_URL` in index.html.)

## The list itself

- Sheet: "Stella — Mailing List" in Google Drive, tab **Signups**.
- Source values: `link-in-bio` (site form), `promoter-optin-apr2026: <name>`
  (29 subscribers imported 21 Jul 2026 from the Ticketek promoter opt-in CSV —
  email-consented rows only; SMS-only opt-ins were deliberately excluded per
  the Spam Act).
- Export for Mailchimp/Buttondown etc.: download the Email column as CSV.
- Add subscribers programmatically:
  ```bash
  curl -L -d '{"email":"x@y.com","source":"wherever"}' "$SCRIPT_URL"
  # {"ok":true} = added, {"ok":true,"deduped":true} = already on the list
  # NOTE: use curl -L -d WITHOUT -X POST — Apps Script answers via a 302 to a
  # GET-only echo URL, and -X POST forces POST on the redirect and breaks it.
  ```

## Testing the form

Submit any address on the live site — it should flip to "you're in. tell your
friends, I need ticket sales." and a row appears in the sheet. Duplicate
submissions are silently absorbed (still shows success, no duplicate row).
