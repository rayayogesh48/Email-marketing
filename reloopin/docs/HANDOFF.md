# Frontend handoff

The attached document is treated as a product concept, while the user’s direct request establishes the deliverable: a working frontend-only Next.js prototype. Design-file and server implementation instructions from the concept are not claims of delivered backend functionality.

## Design source and demo data

- Official shadcnblocks theme source: https://www.shadcnblocks.com/r/theme/shadcnblocks. Retrieved September 16, 2026. Original registry payload is included alongside this file.
- Installation reference: https://www.shadcnblocks.com/docs/blocks/getting-started.
- Reloopin Semantic Light/Dark color tokens were supplied by the user and are retained in `src/app/tokens.json`. `tokens.css` applies the exact values; component aliases map back to them. Theme state is applied on the document so Radix portaled menus and dialogs inherit it. Merchant email designs keep their own light canvas and configured brand color.
- All people, store addresses, domains, dates, recipient counts and event records are demo data. Example domains are used for store actions. Sample action links do not mutate customer state.
- The date picker explicitly uses Asia/Kathmandu (UTC+05:45), a fixed-offset zone, so browser-local timezone is not used to interpret the scheduled value.

## State and version policy

Templates are reusable content, not sending rules. Campaigns/automations own separate copies. A template restore preserves a custom backup. Replaced flow email content is accessible through Draft history.

Branding applies to managed templates and draft previews. Scheduled and sent campaigns retain saved branding and sender snapshots. Arbitrary HTML has custom branding and is not silently rewritten by a global change.

Editing an active automation retains its published version while saving changes as a draft. Publishing replaces the demo published rule. Pause and disconnect are explicit actions. Reconnection does not automatically resume or dispatch anything. The prototype has no actual enrollment or message queue.

## Production dependencies and intentionally unimplemented operations

These need a backend; they are not represented as functioning operations:

- Actual email rendering/delivery, SMTP testing, sender ownership verification, DNS checks and durable scheduling.
- Real customer segmentation, consent ingestion, deduplication, suppression updates and immutable per-recipient dispatch logs.
- Trigger event ingestion, enrollment evaluation, queue snapshots, dispatch races, safe retries and provider-outcome reconciliation.
- Server-enforced permissions, team roles, real audit history, concurrency conflict detection, session expiry and permission revocation.
- Secure credential storage, transport-level unsubscribe headers and signed recipient-specific preference tokens.
- Inbox rendering compatibility and delivery analytics. Plain-text mode is a preview; a production renderer must construct the MIME alternative.
- A read-only permission mode and injected server/network errors are not full simulated state machines. Local storage failures preserve current inputs; SMTP failures can be exercised by including `fail` in the example host.
- Customer preference page demonstrates confirmation and success only. Signed/expired token checks, one-click transport behavior and persistence must be server implemented.
- Uploaded images use data URLs locally with a 2 MB prototype limit; production image storage and documented limits remain open.
- CodeMirror provides syntax highlighting, line numbers, search and undo/redo. Validation covers required content, supported tokens, dangerous active HTML and unsubscribe links, not a complete HTML/CSS compatibility linter. Server sanitization is required in production. HTML previews use DOMPurify, an empty iframe sandbox and a restrictive CSP.
- Recipient estimates are deterministic demo calculations, not claims about a connected audience. Detailed exclusions are separate sample records, not a complete list of the estimated audience.

## Confirm before implementation

1. Campaign taxonomy and supported subject, HTML, image and attachment limits.
2. Signup source, review submitted versus approved semantics, and coupon redemption meaning.
3. Whether manual positive points adjustments trigger points-earned automations.
4. Missing dynamic fields: event award, coupon details, expiry date/amount, and event-specific tier snapshot.
5. Birthday source, Feb 29 fallback (prototype: Feb 28), date offsets and store timezone policy.
6. Inactivity definition (prototype: no completed order), no-order customers and historical/backfill behavior.
7. Delay limits, late-message skipping, frequency caps, event deduplication and expiry consolidation.
8. HTML branding hooks, structured field schema, sanitizer allowlists, and reversible conversion.
9. Branding/sender snapshot policy for scheduled campaigns and queued automations.
10. Queue cancellation and version publishing semantics; prototype follows the proposed policy without a dispatch service.
11. Authentication methods, sender ownership, provider constraints, and exact readiness gates.
12. Bounce/complaint telemetry and suppression integrations; unavailable data must stay unavailable rather than zero.
13. Message classification, marketing consent, unsubscribe scope and footer policy.
14. Capability names/defaults, retention, draft persistence/history, audit log and deleted-customer handling.
15. Dispatch pause/resume support for campaigns. Campaign pause controls are intentionally omitted until dispatch support is known.

## Accessibility and QA

Radix manages modal focus trapping, Escape dismissal and focus return. Inputs have visible labels; keyboard focus is visible. Status badges include text. Reduced-motion preference is honored. Email action buttons have a minimum height of 44px. The editor and tables adapt at tablet widths without shrinking every column. The managed CTA color is checked against white text before branding can be saved.

Browser tests exercise desktop, 800px tablet and 390px mobile layouts. A full WCAG conformance audit and cross-email-client verification remain separate production work.
