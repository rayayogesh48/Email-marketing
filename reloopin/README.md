# Reloopin Emails

A working frontend prototype built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style Radix UI components, the official shadcnblocks registry theme, Lucide icons, CodeMirror, and Sonner. The UI uses locally bundled Inter for both sans and mono font roles, including the HTML editor.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The parent workspace also provides `npm run dev`.

## Working paths

- Eight event templates, search, event filters, custom templates, duplication, restore with backup, deletion, and editable names.
- Shared text and HTML editor, caret-aware variables, syntax highlighting, find, undo/redo, validation, safe mode conversion, desktop/mobile/plain-text previews and sample-customer edge cases.
- Two-column campaigns with live preview, a dedicated campaign email editor page, audience conditions, exclusion estimates, template replacement and recoverable history, drafts, test simulation, send simulation, scheduling, duplication and schedule cancellation.
- Two-column automations with live preview, a dedicated automation email editor page, all eight triggers, event timing controls, audience conditions, activation, published/draft separation, pause, resume through review, archive and duplication. Review integration is explicitly gated.
- Shared branding, logo upload, color contrast validation, sender identity, example SMTP connection testing, failure recovery, disconnect impact, and return to a preserved campaign/automation draft.
- Searchable demo exclusion records, CSV export and a customer-facing preference page.
- Per-store browser persistence, unsaved navigation confirmation, keyboard-accessible Radix menus/dialogs, light/dark theme, desktop/tablet/mobile layouts.

## Important prototype boundaries

No real email is sent, no SMTP connection is made, and no task runs at the scheduled time. Sending, address verification, sender readiness, and recipient counts are clearly labeled simulations. Data is stored in localStorage per store; SMTP passwords stay in component memory and are never stored or transmitted. Use example values only.

The wider dashboard navigation supplies scope explanations: the requested Emails workspace is implemented, not the unrelated loyalty, billing or team products.

## Design system

The official theme from `https://www.shadcnblocks.com/r/theme/shadcnblocks` is retained in `docs/shadcnblocks-theme.json`. The registry is configured in `components.json`; `src/app/tokens.json` retains the supplied Reloopin color tokens, and `tokens.css` applies their exact light/dark values with shadcn-compatible semantic aliases. Dashboard accents, navigation, controls, statuses and overlays use these tokens; merchant email previews retain their separate branding. No paid shadcnblocks blocks are represented as licensed or installed. Reusable controls use the shadcn component pattern with Radix primitives.

## Verification

```bash
npm run lint
npm run build
npx playwright install chromium
npm test
```

Playwright starts the local development server if necessary. Tests cover template editing and persistence, store isolation, campaigns, scheduling, automation activation/pause, safe HTML mode conversion, unsaved navigation, sender failure recovery and responsive overflow. Browser screenshots are generated in `artifacts/`.

To reset demo data, remove the `reloopin:v1:northstar`, `reloopin:v1:willow` and `reloopin:store` localStorage entries.

See [handoff notes](docs/HANDOFF.md) for production dependencies and proposed product decisions.
