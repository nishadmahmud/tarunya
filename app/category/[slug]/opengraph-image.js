import { ImageResponse } from 'next/og';
import { getCategoriesFromServer } from '../../../lib/api';
import { getBengaliFont, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Category';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const bengaliFont = await getBengaliFont();

    const rawSlug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';
    const slugDecoded = decodeURIComponent(rawSlug).trim();

    let categoryName = slugDecoded.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Try to resolve real category name from API
    try {
        const catRes = await getCategoriesFromServer();
        if (catRes?.success && Array.isArray(catRes.data)) {
            const normalize = (val) => val ? String(val).toLowerCase().trim().replace(/\s+/g, '-') : '';
            const found = catRes.data.find((c) =>
                String(c.category_id) === String(rawSlug) ||
                String(c.id) === String(rawSlug) ||
                normalize(c.name) === slugDecoded.toLowerCase()
            );
            if (found?.name) categoryName = found.name;
        }
    } catch (e) {
        // fall back to slug
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)',
                    fontFamily: '"Noto Sans Bengali"',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex' }} />

                {/* Top bar */}
                <div style={{ display: 'flex', padding: '50px 60px 0', gap: '12px', alignItems: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'flex' }}>তারুণ্য প্রকাশন</div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex' }} />
                    <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>বইয়ের বিভাগ</div>
                </div>

                {/* Main */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '0 60px', gap: '20px' }}>
                    <div style={{ background: 'rgba(197,152,73,0.2)', padding: '6px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 700, color: '#c59849', display: 'flex', width: 'fit-content' }}>
                        CATEGORY
                    </div>
                    <div style={{ fontSize: '64px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, display: 'flex' }}>
                        {categoryName}
                    </div>
                    <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', display: 'flex' }}>
                        বইয়ের সংগ্রহ দেখুন
                    </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', padding: '0 60px 40px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                    tarunnyoprokashon.com
                </div>

                {/* Bottom accent */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Noto Sans Bengali',
                    data: bengaliFont,
                    style: 'normal',
                    weight: 700,
                },
            ],
        }
    );
}
