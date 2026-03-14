import { ImageResponse } from 'next/og';
import { getProductById } from '../../../lib/api';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Shared Book Collection';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

    const rawIds = Array.isArray(params.ids) ? params.ids[0] : params.ids;
    const decodedIds = decodeURIComponent(rawIds || '');
    const ids = decodedIds.split(',').map(id => id.trim()).filter(Boolean);

    const products = [];
    for (const id of ids.slice(0, 6)) {
        try {
            const res = await getProductById(id);
            const p = res?.data || res;
            if (p && p.id) {
                const images = (Array.isArray(p.images) && p.images.length > 0 && p.images) ||
                    (Array.isArray(p.imei_image) && p.imei_image.filter(Boolean)) ||
                    (p.image_path ? [p.image_path] : []);
                products.push({ name: p.name, image: images[0] || '' });
            }
        } catch (e) { /* skip */ }
    }

    const totalBooks = ids.length;

    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: 'HindSiliguri', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />

                {/* Left - Text */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '460px', padding: '50px', gap: '16px', flexShrink: 0 }}>
                    {logoUrl && <img src={logoUrl} width={220} height={55} style={{ objectFit: 'contain', objectPosition: 'left', marginBottom: '12px' }} />}
                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, display: 'flex' }}>Book Collection</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                        <div style={{ background: '#c59849', padding: '8px 24px', borderRadius: '30px', fontSize: '22px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                            {totalBooks} Books
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginTop: 'auto', display: 'flex' }}>tarunnyoprokashon.com</div>
                </div>

                {/* Right - Book covers */}
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '30px', gap: '12px', flexWrap: 'wrap' }}>
                    {products.map((p, i) => (
                        p.image ? (
                            <img key={i} src={p.image} width={130} height={185} style={{ objectFit: 'cover', borderRadius: '12px', border: '3px solid rgba(255,255,255,0.15)', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }} />
                        ) : (
                            <div key={i} style={{ width: '130px', height: '185px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'rgba(255,255,255,0.3)' }}>📖</div>
                        )
                    ))}
                </div>

                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { ...size, fonts }
    );
}
