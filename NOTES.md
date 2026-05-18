# NOTES.md

---

## Architecture & Rendering

`app/[slug]/page.tsx` is a dynamic route that fetches a Landing Page entry from Contentful by slug. Known slugs are pre-rendered at build time via `generateStaticParams`. Any slug published after the last build is handled by SSR on first request, so new pages go live without a redeploy.

Cache invalidation is handled via `next: { tags: ["landing-pages"] }` on the fetch. A Contentful publish webhook hits `/api/revalidation`, which calls `revalidateTag("landing-pages")` to bust the cache for affected pages only.

The block architecture is a discriminated union — Contentful returns `__typename` on each block, and `BlockRenderer` switches on it to render the right component. Adding a new block type is: define the schema in Contentful, add a GraphQL fragment and TypeScript type, add one `case` to `BlockRenderer`.

Content is fetched via Contentful's GraphQL Content API using inline fragments (`... on HeroBlock`, `... on ReviewsBlock`) so all block types resolve in a single request. All types, fragments, and fetch logic live in `lib/landing-page-api.ts`.

---

## Execution of Business Goals — Reviews Carousel

**Accessibility:**
- `aria-roledescription="carousel"` on the section, `aria-roledescription="slide"` on each article
- `aria-live="polite" aria-atomic="true"` on a visually hidden div announces slide position to screen readers on navigation
- Arrow button labels name the reviewer they navigate *to*, not just "next/previous"
- Star ratings use `role="img"` with a descriptive `aria-label`
- Touch swipe supported via `onTouchStart`/`onTouchEnd` with a 50px threshold

**SEO:** All reviews are rendered in the DOM — inactive slides use `display:none` via Tailwind's `hidden` class, which keeps the text indexable by Google while showing one slide at a time visually.

---

## Form Architecture & Data Flow

All fields live in a single `FormState` object. A generic `setField<K>` helper updates any key without a handler per field. Two derived booleans (`isFinance`, `wantsCarbFleet`) drive conditional field visibility and validation.

`computeRoutingPods` is a pure function isolated from the component — easy to unit test and reason about independently.

**Scaling to 15+ routing rules:** Extract rules into a declarative config array of `{ condition, pod }` objects. `computeRoutingPods` becomes a filter/map over that array with a `Set` to deduplicate. New rules become config entries, not code changes.

---

## Visibility & Measurement

**Engineering:** Vercel logs for runtime errors, Sentry for client-side error tracking, uptime monitoring via an external ping, a smoke test in CI that asserts a 200 on a known slug after every deploy.

**Marketing:** GA4 is wired in. I'd fire custom events on form submission and carousel interaction to build a conversion funnel. Set `form_submit` as a GA4 conversion goal so Marketing can tie campaign spend to leads directly.

---

## Production Readiness

- Server-side validation on the form endpoint — never trust the client
- Rate limiting by IP to prevent spam
- Honeypot field for bot detection
- Environment variable validation at startup so the app fails loudly, not silently
- React error boundary around `BlockRenderer` so a bad Contentful entry doesn't white-screen the page
- CSP and security headers via `next.config`

---

## AI Workflow

Used AI heavily for TypeScript types, GraphQL query structure, ARIA patterns, JS-to-TS conversion, and scaffolding `BlockRenderer` and `landing-page-api.ts`.

Had to course-correct in three places:
- **GraphQL inline fragments** — AI queried review fields directly on `Entry`. Contentful requires `... on Review { }` inline fragments for linked entries. The page was returning null silently until I caught the raw error in the response.
- **Config file formats** — AI converted PostCSS and Tailwind configs to `.ts`, which broke all styling. Next.js 14 doesn't support `.ts` config files for either tool. Reverted to `.js`.
- **Carousel approach** — AI defaulted to CSS `display:none` for all slides. Revised to render all slides in the DOM with CSS hiding for SEO, while keeping the active slide logic in `useState`.

---

## Future Explorations

**Form UX — Multi-step with social proof:**
Convert the lead form into a 3-step full-screen modal. Step 1 captures just an email (low friction entry point). Step 2 collects first name, last name. Step 3 collects company size, department, and product interest. The left panel of the modal displays rotating customer quotes with name and title — social proof at the exact moment of conversion decision.

**CRM-aware personalization:**
On form open, do a quick lookup against HubSpot or Salesforce by email domain or cookie. If the visitor is a known contact, show a "Welcome back" message pre-filled with their name and skip to step 2. If they're a net-new prospect with no CRM record, trigger a "$250 gift card on us" incentive modal after they complete step 1 — reward early commitment and increase step 2 completion rates.

Since the email is captured at step 1, anyone who drops off before completing the form is immediately enrolled in a drip campaign. The sequence re-engages them with the gift card offer, product education, and a direct link back to their partially completed form.

**Other explorations:**
- JSON-LD `Review` structured data to surface star ratings in Google search results
- A/B test hero headlines via a feature flag without a code deploy
- Field-level form abandonment tracking to identify which step people drop off at
- Contentful preview mode banner so editors know they're seeing draft content
