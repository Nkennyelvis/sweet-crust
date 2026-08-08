@AGENTS.md

# Sweet Crust — project notes

Read `README.md` first for what the site is and how to run it. The points below are the
ones that have already caused bugs here.

## Forms and Server Actions

**Keep every form field controlled** via `src/components/forms/useFormFields.ts`. React
resets a `<form action={…}>` once the action resolves, including on validation errors.
With uncontrolled inputs that silently wipes what the customer typed — and on checkout it
reverted the pickup/delivery choice to its default while the visible fields still showed
delivery, saving delivery orders as pickups with no address and no fee.

Native radio buttons are worse: React cannot restore a radio's `checked` after that reset,
so the checkout fulfilment control uses `role="radio"` buttons plus a hidden input driven
by state. An uncontrolled `<select>` has the same problem — `StatusSelect` works around it
with `key={current}`.

## Money

Prices are RWF-only `Int` columns. USD is derived from `RWF_PER_USD` in
`src/lib/currency.ts` and never stored. **Checkout must re-price every line from the
database** (`src/app/(site)/cart/actions.ts`) — the browser cart's prices are display
values only.

## Dates

`Order.requestedDate` is stored at **UTC midnight**, parsed from a date-only string. Build
every comparison boundary with `Date.UTC(...)` / `todayUtc()` from `src/lib/validation.ts`.
Local-midnight `Date` construction mis-buckets same-day orders whenever the server is not
in UTC.

## Colour tokens

Three groups, and picking the wrong one is the single most common bug here:

| Group | Flips in dark mode? | Use for |
| --- | --- | --- |
| `cream-*`, `ink-*`, `surface`, `blush-100/300` | **yes** | page backgrounds and body text |
| `accent`, `positive`, `negative`, `gold-600` | **yes** | brand/status **text**, borders, focus rings |
| `paper-*`, `wine-*`, `gold-300/400/500`, `blush-500` | no (pinned) | fills, and anything on always-dark chrome |

Rules that follow from that:

- **Brand text uses `accent`, never `wine-700/800`.** `wine-800` is a deep burgundy that
  measures **1.37:1** on the dark card surface — invisible. `accent` is that same burgundy
  in light mode and the brief's soft blush in dark mode (~8.5:1). `wine-*` is still correct
  for *fills* (`bg-wine-800`, the logo roundel).
- **Status text uses `positive`/`negative`**, not `emerald-700`/`red-700`, or checkout
  validation errors disappear in dark mode.
- **Always-dark chrome uses `paper-*`** (hero, footer, admin header, mobile menu, lightbox).
  `cream-*` there turns dark-on-dark.
- **But a page surface must use `cream-*`.** The sticky header was once pinned to
  `bg-paper-50/85`, leaving a near-white bar carrying dark-mode light text.

To re-check after a colour change, run the contrast auditor pattern: composite each
element's background stack onto the page with a 1×1 canvas, then compare luminance.
Do **not** regex-parse `getComputedStyle().color` — Tailwind emits `oklab()` for any colour
with an alpha modifier, and reading those three numbers as RGB reports confident nonsense.

## Admin routing

`/admin/login` is a **sibling** of the `(protected)` route group, not inside it. Guarding
all of `/admin/*` from one layout would include the login page and loop redirects forever.
Server Actions are reachable by direct POST, so each admin action calls `requireStaff()`
for itself — the layout guard only protects rendering.

## Product CRUD

`parseProductForm` in `src/app/admin/products/actions.ts` is shared by create **and**
update on purpose. Adding a field to only one path is how a column silently stops saving on
edit. After changing product fields, create *and* edit a product through the UI and confirm
every value round-trips — a clean type-check does not catch this.

## Verifying in the browser

Automated `computer` clicks silently no-op on this project. Drive the page with
`javascript_tool` instead (`element.click()`, `form.requestSubmit()`, and the native value
setter + `input` event for controlled fields). Note the admin layout has a sign-out
`<form>`, so `document.querySelector('form')` grabs the wrong one — select via a field,
e.g. `document.querySelector('#name').closest('form')`.

## Placeholder content

The logo, all 56 photos, contact details, testimonials and the whole 42-product catalogue
are invented stand-ins. See the "Client content checklist" in `README.md` before changing
any of it.
