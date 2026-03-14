import { ImageResponse } from 'next/og';
import { getCategoriesFromServer } from '../../../lib/api';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Category';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

    const resolvedParams = await params;
    const rawSlug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug : resolvedParams.slug?.[0] || '';
    const slugDecoded = decodeURIComponent(rawSlug).trim();
    let categoryName = slugDecoded.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    try {
        const catRes = await getCategoriesFromServer();
        if (catRes?.success && Array.isArray(catRes.data)) {
            const normalize = (val) => val ? String(val).toLowerCase().trim().replace(/\s+/g, '-') : '';
            const found = catRes.data.find((c) =>
                String(c.category_id) === String(rawSlug) || String(c.id) === String(rawSlug) || normalize(c.name) === slugDecoded.toLowerCase()
            );
            if (found?.name) categoryName = found.name;
        }
    } catch (e) { /* fallback to slug */ }

    return new ImageResponse(
        (
            <div lang="bn-BD" dir="ltr" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: 'HindSiliguri', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ display: 'flex', padding: '50px 60px 0' }}>
                    {logoUrl && <img src={logoUrl} width={220} height={55} style={{ objectFit: 'contain' }} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '0 80px', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(197,152,73,0.2)', padding: '8px 24px', borderRadius: '30px', fontSize: '20px', fontWeight: 700, color: '#c59849', display: 'flex' }}>CATEGORY</div>
                    <div style={{ fontSize: '100px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, display: 'flex' }}>{categoryName}</div>
                    <div style={{ fontSize: '36px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>Browse our collection</div>
                </div>
                <div style={{ display: 'flex', padding: '0 80px 50px', fontSize: '20px', color: 'rgba(255,255,255,0.4)' }}>tarunnyoprokashon.com</div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { ...size, fonts }
    );
}
