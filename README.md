# SnackOverflow — Marketing Site

A landing page platform for SnackOverflow built with Next.js and Contentful. Marketers can build and publish new landing pages from the CMS without touching any code.

---

## What This Is

The site has three main pieces:

**Landing pages** — Marketing creates pages in Contentful by stacking blocks (a hero section, a reviews carousel, etc.). The site automatically picks them up and renders them at their own URL.

**Reviews carousel** — Customer quotes pulled from Contentful, displayed in a swipeable carousel. Fully accessible and readable by search engines.

**Lead capture form** — Embedded in the hero section. Collects contact info and product interest, then routes the lead to the right sales team automatically based on company size and what they're interested in.

---

## How to Run It Locally

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root with your Contentful credentials:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_REVALIDATE_SECRET=any_secret_string
CONTENTFUL_PREVIEW_SECRET=any_secret_string
```

3. Start the dev server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

---

## How the CMS Works

Content lives in Contentful. To create a new landing page:

1. Go to Contentful → Content → Add Entry → Landing Page
2. Give it a title and a slug (e.g. `spring-campaign`)
3. Add blocks — pick from Hero Block, Reviews Block, etc.
4. Publish it

The page will be live at `yoursite.com/spring-campaign` immediately. No code change, no redeploy needed.

To update an existing page, just edit it in Contentful and hit publish. The site updates within seconds.

---

## Deploying

The site deploys automatically to Vercel when you push to the `main` branch on GitHub.

Make sure these environment variables are set in your Vercel project settings — same values as your `.env.local` file:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN`
- `CONTENTFUL_REVALIDATE_SECRET`
- `CONTENTFUL_PREVIEW_SECRET`

---

## Tech Stack

- **Next.js 14** — the web framework
- **Contentful** — the CMS where marketing manages content
- **Tailwind CSS** — styling
- **TypeScript** — type safety throughout
- **Vercel** — hosting and deployment
- **Google Analytics (GA4)** — page and event tracking
