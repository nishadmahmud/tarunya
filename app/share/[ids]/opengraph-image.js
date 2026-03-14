import { ImageResponse } from 'next/og';
import { getProductById } from '../../../lib/api';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Shared Book Collection';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

    const resolvedParams = await params;
    const rawIds = Array.isArray(resolvedParams.ids) ? resolvedParams.ids[0] : resolvedParams.ids;
    const decodedIds = decodeURIComponent(rawIds || '');
    const ids = decodedIds.split(',').map(id => id.trim()).filter(Boolean);

    let totalPrice = 0;
    const products = [];
    for (const id of ids.slice(0, 4)) {
        try {
            const res = await getProductById(id);
            const p = res?.data || res;
            if (p && p.id) {
                const images = (Array.isArray(p.images) && p.images.length > 0 && p.images) ||
                    (Array.isArray(p.imei_image) && p.imei_image.filter(Boolean)) ||
                    (p.image_path ? [p.image_path] : []);
                
                const originalPrice = Number(p.retails_price || 0);
                const discountValue = Number(p.discount || 0);
                const discountType = String(p.discount_type || '').toLowerCase();
                const hasDiscount = discountValue > 0 && discountType !== '0';
                const finalPrice = hasDiscount
                    ? discountType === 'percentage'
                        ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                        : Math.max(0, originalPrice - discountValue)
                    : originalPrice;

                totalPrice += finalPrice;
                products.push({ name: p.name, image: images[0] || '', price: finalPrice });
            }
        } catch (e) { /* skip */ }
    }

    const totalBooks = ids.length;
    
    // Abstract the items to render
    const itemsToRender = products.map(p => ({ type: 'book', ...p }));
    if (totalBooks > 4) {
        itemsToRender.push({ type: 'more', count: totalBooks - 4 });
    }
    const displayCount = itemsToRender.length;
    
    // Dynamic sizing and explicit row mapping to prevent flexWrap overflow
    let imgWidth = 220;
    let imgHeight = 310;
    let rows = [];

    if (displayCount === 1) {
        imgWidth = 340; imgHeight = 460;
        rows = [itemsToRender];
    } else if (displayCount === 2) {
        imgWidth = 280; imgHeight = 380;
        rows = [itemsToRender];
    } else if (displayCount === 3) {
        imgWidth = 200; imgHeight = 280;
        rows = [itemsToRender];
    } else if (displayCount === 4) {
        imgWidth = 160; imgHeight = 230;
        rows = [itemsToRender.slice(0, 2), itemsToRender.slice(2, 4)];
    } else {
        imgWidth = 140; imgHeight = 200;
        rows = [itemsToRender.slice(0, 3), itemsToRender.slice(3, 5)];
    }

    return new ImageResponse(
        (
            <div lang="bn-BD" dir="ltr" style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: 'HindSiliguri', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />

                {/* Left - Text */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '480px', padding: '60px', gap: '20px', flexShrink: 0, alignItems: 'flex-start' }}>
                    {logoUrl && <img src={logoUrl} width={260} height={65} style={{ objectFit: 'contain', objectPosition: 'left', marginBottom: '16px' }} />}
                    <div style={{ fontSize: '56px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, display: 'flex' }}>Book Collection</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 24px', borderRadius: '30px', fontSize: '24px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                            {totalBooks} {totalBooks === 1 ? 'Book' : 'Books'}
                        </div>
                        {totalPrice > 0 && (
                            <div style={{ background: '#c59849', padding: '10px 24px', borderRadius: '30px', fontSize: '28px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                                Total: ৳{totalPrice.toLocaleString('en-US')}
                            </div>
                        )}
                    </div>
                    <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)', marginTop: 'auto', display: 'flex' }}>tarunnyoprokashon.com</div>
                </div>

                {/* Right - Explicitly managed rows of books */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '24px' }}>
                    {rows.map((row, rIndex) => (
                        <div key={rIndex} style={{ display: 'flex', flexDirection: 'row', gap: '24px', justifyContent: 'center' }}>
                            {row.map((item, iIndex) => {
                                if (item.type === 'book') {
                                    return (
                                        <div key={iIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            {item.image ? (
                                                <img src={item.image} width={imgWidth} height={imgHeight} style={{ objectFit: 'cover', borderRadius: '12px', border: '4px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} />
                                            ) : (
                                                <div style={{ width: `${imgWidth}px`, height: `${imgHeight}px`, borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', color: 'rgba(255,255,255,0.3)' }}>📖</div>
                                            )}
                                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px 16px', borderRadius: '20px', fontSize: '20px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                                                ৳{item.price.toLocaleString('en-US')}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={iIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: `${imgWidth}px`, height: `${imgHeight}px`, borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', border: '4px dashed rgba(255,255,255,0.2)' }}>
                                                +{item.count} More
                                            </div>
                                            <div style={{ padding: '6px 16px', opacity: 0 }}>_</div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    ))}
                </div>

                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { ...size, fonts }
    );
}
