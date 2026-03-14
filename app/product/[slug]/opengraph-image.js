import { ImageResponse } from 'next/og';
import { getProductById } from '../../../lib/api';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Book Details';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

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

    // Fallback for missing product
    if (!product || !product.id) {
        return new ImageResponse(
            (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', fontFamily: 'HindSiliguri', gap: '20px' }}>
                    {logoUrl && <img src={logoUrl} width={400} height={110} style={{ objectFit: 'contain' }} />}
                    <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>বই বিক্রয় প্রতিষ্ঠান</div>
                </div>
            ),
            { ...size, fonts }
        );
    }

    // Extract data
    const name = product.name || 'Unknown Book';
    const getSpec = (specName) => {
        if (!Array.isArray(product.specifications)) return null;
        const spec = product.specifications.find(s =>
            s.name && s.name.toLowerCase().includes(specName.toLowerCase())
        );
        return spec?.description || null;
    };
    const author = getSpec('author') || getSpec('লেখক') || product.author_name || product.brand_name || product.brand?.name || '';
    const pages = getSpec('page') || getSpec('পৃষ্ঠা') || '';

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
            <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: 'HindSiliguri', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />

                {/* Left - Book Cover */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '400px', padding: '50px', flexShrink: 0 }}>
                    {bookImage ? (
                        <img
                            src={bookImage}
                            width={280}
                            height={380}
                            style={{ objectFit: 'cover', borderRadius: '16px', border: '4px solid rgba(255,255,255,0.15)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                        />
                    ) : (
                        <div style={{ width: '280px', height: '380px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', color: 'rgba(255,255,255,0.3)' }}>
                            📖
                        </div>
                    )}
                </div>

                {/* Right - Details */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '50px 50px 50px 0', gap: '12px' }}>
                    {/* Logo */}
                    {logoUrl && (
                        <img src={logoUrl} width={200} height={50} style={{ objectFit: 'contain', objectPosition: 'left', marginBottom: '8px' }} />
                    )}

                    {/* Title */}
                    <div style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, display: 'flex', maxWidth: '600px' }}>
                        {name.length > 70 ? name.substring(0, 67) + '...' : name}
                    </div>

                    {/* Author */}
                    {author && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>
                                {author}
                            </div>
                        </div>
                    )}

                    {/* Pages badge */}
                    {pages && (
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '6px 18px', borderRadius: '30px', fontSize: '16px', color: 'rgba(255,255,255,0.8)', display: 'flex' }}>
                                {pages} pages
                            </div>
                        </div>
                    )}

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                        <div style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', display: 'flex' }}>
                            ৳{finalPrice.toLocaleString('en-US')}
                        </div>
                        {hasDiscount && (
                            <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', display: 'flex' }}>
                                ৳{originalPrice.toLocaleString('en-US')}
                            </div>
                        )}
                        {hasDiscount && (
                            <div style={{ background: '#c59849', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                                {discountType === 'percentage' ? `-${discountValue}%` : `Save ৳${discountValue}`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom accent */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { ...size, fonts }
    );
}
