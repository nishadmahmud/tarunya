import { ImageResponse } from 'next/og';
import { getProductById } from '../../../lib/api';
import { getBengaliFont, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Book Details';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const bengaliFont = await getBengaliFont();

    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';
    let productId = null;
    if (slug) {
        const decoded = decodeURIComponent(slug).trim();
        if (/^\d+$/.test(decoded)) {
            productId = Number(decoded);
        } else {
            const parts = decoded.split('-');
            productId = Number(parts[parts.length - 1]);
        }
    }

    let product = null;
    if (productId && Number.isFinite(productId) && productId > 0) {
        try {
            const res = await getProductById(productId);
            product = res?.data || res;
        } catch (e) {
            console.error('OG: Failed to fetch product', e);
        }
    }

    // Fallback
    if (!product || !product.id) {
        return new ImageResponse(
            (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', fontFamily: '"Noto Sans Bengali"' }}>
                    <div style={{ fontSize: '48px', color: '#fff', fontWeight: 800, display: 'flex' }}>তারুণ্য প্রকাশন</div>
                </div>
            ),
            { ...size, fonts: [{ name: 'Noto Sans Bengali', data: bengaliFont, style: 'normal', weight: 700 }] }
        );
    }

    // Extract data
    const name = product.name || 'Unknown Book';
    const getSpec = (specName) => {
        const spec = product.specifications?.find(s => s.name.toLowerCase() === specName.toLowerCase());
        return spec ? spec.description : null;
    };
    const author = getSpec('Author') || product.author_name || product.brand_name || product.brand?.name || '';
    const pages = getSpec('Number of Pages') || getSpec('Pages') || '';

    const originalPrice = Number(product.retails_price || 0);
    const discountValue = Number(product.discount || 0);
    const discountType = String(product.discount_type || '').toLowerCase();
    const hasDiscount = discountValue > 0 && discountType !== '0';
    const finalPrice = hasDiscount
        ? discountType === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue)
        : originalPrice;

    const images = (Array.isArray(product.images) && product.images.length > 0 && product.images) ||
        (Array.isArray(product.imei_image) && product.imei_image.filter(Boolean)) ||
        (product.image_path ? [product.image_path] : []) ||
        [];
    const bookImage = images[0] || '';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)',
                    fontFamily: '"Noto Sans Bengali"',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex' }} />

                {/* Left - Book Cover */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '420px', padding: '60px', flexShrink: 0 }}>
                    {bookImage ? (
                        <img
                            src={bookImage}
                            width={280}
                            height={400}
                            style={{
                                objectFit: 'cover',
                                borderRadius: '16px',
                                border: '4px solid rgba(255,255,255,0.15)',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                            }}
                        />
                    ) : (
                        <div style={{ width: '280px', height: '400px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
                            📖
                        </div>
                    )}
                </div>

                {/* Right - Details */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '60px 60px 60px 0', gap: '16px' }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex' }}>
                            তারুণ্য প্রকাশন
                        </div>
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: '40px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, display: 'flex', maxWidth: '600px' }}>
                        {name.length > 60 ? name.substring(0, 57) + '...' : name}
                    </div>

                    {/* Author */}
                    {author && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>
                                ✍️ {author}
                            </div>
                        </div>
                    )}

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                        {pages && (
                            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 20px', borderRadius: '30px', fontSize: '16px', color: 'rgba(255,255,255,0.8)', display: 'flex' }}>
                                📄 {pages} পৃষ্ঠা
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                        <div style={{ fontSize: '42px', fontWeight: 800, color: '#ffffff', display: 'flex' }}>
                            ৳{finalPrice.toLocaleString('en-US')}
                        </div>
                        {hasDiscount && (
                            <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', display: 'flex' }}>
                                ৳{originalPrice.toLocaleString('en-US')}
                            </div>
                        )}
                        {hasDiscount && (
                            <div style={{ background: '#c59849', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 800, color: '#fff', display: 'flex' }}>
                                {discountType === 'percentage' ? `-${discountValue}%` : `৳${discountValue} ছাড়`}
                            </div>
                        )}
                    </div>
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
