import { ImageResponse } from 'next/og';
import { getBlogs } from '../../../lib/api';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Blog Post';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

    const resolvedParams = await params;
    const slugWithId = typeof resolvedParams.slug === 'string' ? resolvedParams.slug : resolvedParams.slug?.[0] || '';
    const blogId = slugWithId ? slugWithId.split('-').pop() : null;
    let post = null;

    if (blogId) {
        try {
            const res = await getBlogs();
            if (res?.success && Array.isArray(res?.data)) {
                post = res.data.find(b => String(b.id) === String(blogId));
            }
        } catch (e) { /* fallback */ }
    }

    const title = post?.title || 'Blog Post';
    const blogImage = post?.image || '';

    return new ImageResponse(
        (
            <div lang="bn-BD" dir="ltr" style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', fontFamily: 'HindSiliguri' }}>
                {blogImage && <img src={blogImage} width={OG_WIDTH} height={OG_HEIGHT} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: blogImage ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(27,94,32,0.6) 100%)' : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', display: 'flex' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', position: 'relative', padding: '50px 60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {logoUrl && <img src={logoUrl} width={180} height={45} style={{ objectFit: 'contain' }} />}
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex' }}>BLOG</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ fontSize: '44px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, display: 'flex', maxWidth: '900px' }}>
                            {title.length > 80 ? title.substring(0, 77) + '...' : title}
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>tarunnyoprokashon.com</div>
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { ...size, fonts }
    );
}
