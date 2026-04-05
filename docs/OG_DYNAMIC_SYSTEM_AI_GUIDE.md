# Dynamic Open Graph (OG) System Guide (AI-Friendly)

This document explains how to copy the current dynamic OG image system into another Next.js App Router project.

Target stack:
- Next.js App Router (`app/`)
- `next/og` + `ImageResponse`
- Node runtime for filesystem font loading

---

## 1) What This System Does

The system generates OG images dynamically per route using special App Router files:
- `app/opengraph-image.js` (site-wide default OG image)
- `app/<route>/opengraph-image.js` (route-specific OG image)
- `app/<route>/[slug]/opengraph-image.js` (dynamic OG image per item)

It also uses shared helpers for:
- font loading + caching
- logo loading + caching
- fixed image dimensions (`1200x630`)
- static OG layout factory for simple pages

---

## 2) Core Architecture

### Shared helper file
Use one helper module like:
- `lib/og-helpers.js`

It should export:
- `OG_WIDTH`, `OG_HEIGHT`
- `getOgFonts()`
- `getLogoDataUrl()`
- optional: `createStaticOgImage(title, subtitle)`

### Route-level OG generators
Each route OG file should export:
- `runtime = 'nodejs'`
- `alt`
- `size = { width, height }`
- `contentType = 'image/png'`
- default `async function Image({ params }) { ... }`

---

## 3) Base Helper Template (Copy-Paste)

```js
// lib/og-helpers.js
import { readFile } from 'fs/promises';
import { join } from 'path';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

let boldFontCache = null;
let regularFontCache = null;
let logoCache = null;

async function getFont(path) {
  return readFile(join(process.cwd(), path));
}

export async function getOgFonts() {
  if (!boldFontCache) {
    boldFontCache = await getFont('public/fonts/HindSiliguri-Bold.ttf');
  }
  if (!regularFontCache) {
    regularFontCache = await getFont('public/fonts/HindSiliguri-Regular.ttf');
  }
  return [
    { name: 'HindSiliguri', data: boldFontCache, style: 'normal', weight: 700 },
    { name: 'HindSiliguri', data: regularFontCache, style: 'normal', weight: 400 },
  ];
}

export async function getLogoDataUrl() {
  if (logoCache) return logoCache;
  try {
    const buffer = await readFile(join(process.cwd(), 'public', 'Tarunya Logo Board.png'));
    logoCache = `data:image/png;base64,${buffer.toString('base64')}`;
    return logoCache;
  } catch {
    return null;
  }
}
```

---

## 4) Static Route OG Template

Use this for pages like `/about`, `/contact`, `/terms` where you only need title/subtitle.

```js
// app/about/opengraph-image.js
import { ImageResponse } from 'next/og';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../lib/og-helpers';

export const runtime = 'nodejs';
export const alt = 'About';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image() {
  const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg,#1b5e20,#2e7d32)', fontFamily: 'HindSiliguri' }}>
        {logoUrl ? <img src={logoUrl} width={260} height={70} /> : null}
        <div style={{ display: 'flex', fontSize: 52, color: '#fff' }}>About Us</div>
      </div>
    ),
    { ...size, fonts }
  );
}
```

---

## 5) Dynamic Product OG Template

Use this for `/product/[slug]` style routes.

```js
// app/product/[slug]/opengraph-image.js
import { ImageResponse } from 'next/og';
import { getProductById } from '../../../lib/api';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers';

export const runtime = 'nodejs';
export const alt = 'Product';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

function parseIdFromSlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim();
  if (/^\d+$/.test(decoded)) return Number(decoded);
  const parts = decoded.split('-');
  const id = Number(parts[parts.length - 1]);
  return Number.isFinite(id) ? id : null;
}

export default async function Image({ params }) {
  const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);
  const resolvedParams = await params;
  const slug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug : resolvedParams.slug?.[0] || '';
  const productId = parseIdFromSlug(slug);

  let product = null;
  if (productId) {
    try {
      const res = await getProductById(productId);
      product = res?.data || res;
    } catch {}
  }

  // Safe fallback if API fails
  if (!product?.id) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg,#1b5e20,#2e7d32)', fontFamily: 'HindSiliguri' }}>
        {logoUrl ? <img src={logoUrl} width={320} height={90} /> : null}
        <div style={{ display: 'flex', color: '#fff', fontSize: 32 }}>Book Store</div>
      </div>,
      { ...size, fonts }
    );
  }

  const name = product.name || 'Unknown Product';
  const image = product.image_path || product.images?.[0] || null;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'HindSiliguri', background: 'linear-gradient(135deg,#1b5e20,#2e7d32)', color: '#fff' }}>
        <div style={{ width: 430, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {image ? <img src={image} width={320} height={440} style={{ borderRadius: 16, objectFit: 'cover' }} /> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, paddingRight: 40 }}>
          {logoUrl ? <img src={logoUrl} width={240} height={60} /> : null}
          <div style={{ display: 'flex', fontSize: 48, fontWeight: 700, lineHeight: 1.25 }}>
            {name.length > 70 ? `${name.slice(0, 67)}...` : name}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
```

---

## 6) Metadata Strategy

You should keep both:
1. `generateMetadata()` for title/description
2. `opengraph-image.js` for dynamic image rendering

Minimal route metadata example:

```js
export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  return {
    title: `Product ${slug}`,
    description: 'Product details page',
    openGraph: { title: `Product ${slug}`, type: 'website' },
    twitter: { card: 'summary_large_image', title: `Product ${slug}` },
  };
}
```

---

## 7) File Layout to Replicate

```txt
app/
  opengraph-image.js
  about/opengraph-image.js
  blogs/opengraph-image.js
  blogs/[slug]/opengraph-image.js
  category/opengraph-image.js
  category/[slug]/opengraph-image.js
  product/[slug]/opengraph-image.js
lib/
  og-helpers.js
public/
  fonts/HindSiliguri-Bold.ttf
  fonts/HindSiliguri-Regular.ttf
  Tarunya Logo Board.png
```

---

## 8) API Mapping Recommendations

For dynamic OG generators, normalize your API data first:
- `title`: product/blog/category name
- `image`: primary image URL
- `subtitle`: author/category tagline
- `price`: optional
- `discount`: optional

Always include a fallback branch if:
- `params` cannot be parsed
- API fails
- entity not found

Never return empty image response.

---

## 9) Performance + Reliability Rules

- Use font and logo cache variables (module scope).
- Fetch fonts/logo in `Promise.all`.
- Keep OG rendering tree simple (avoid complex CSS unsupported by Satori).
- Always set `runtime = 'nodejs'` if reading local files.
- Keep text truncation in OG to prevent overflow.

---

## 10) Migration Checklist (For Dev/AI Agent)

1. Copy `lib/og-helpers.js`.
2. Add Bengali (or target language) fonts in `public/fonts`.
3. Add brand logo in `public/`.
4. Create root `app/opengraph-image.js`.
5. Add route-level static OG files for important pages.
6. Add dynamic OG files for `[slug]` routes.
7. Ensure each dynamic file:
   - parses params safely
   - fetches data safely
   - has fallback image response
8. Keep `generateMetadata()` on dynamic route layouts/pages.
9. Test URLs directly:
   - `/opengraph-image`
   - `/product/<slug>/opengraph-image`
   - `/category/<slug>/opengraph-image`
10. Validate shares in Facebook Debugger + X Card Validator.

---

## 11) Common Pitfalls

- Using Edge runtime while reading local font files.
- Not caching fonts/logo (slow OG generation).
- Assuming slug always numeric.
- Missing fallback branch when API fails.
- Over-long title text breaking layout.

---

## 12) Optional Upgrade Ideas

- Add a generic `createDynamicOgImage({ title, image, subtitle, badge })` helper to reduce repetition.
- Add route-specific theme variants (product/blog/category colors).
- Add tiny in-memory API cache for OG fetches.

