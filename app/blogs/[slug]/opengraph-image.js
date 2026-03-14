import { ImageResponse } from 'next/og';
import { getBlogs } from '../../../lib/api';
import { getBengaliFont, OG_WIDTH, OG_HEIGHT } from '../../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'Blog Post';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image({ params }) {
    const bengaliFont = await getBengaliFont();

    const slugWithId = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';
    const blogId = slugWithId ? slugWithId.split('-').pop() : null;

    let post = null;
    if (blogId) {
        try {
            const res = await getBlogs();
            if (res?.success && Array.isArray(res?.data)) {
                post = res.data.find(b => String(b.id) === String(blogId));
            }
        } catch (e) {
            // fallback
        }
    }

    const title = post?.title || 'ব্লগ পোস্ট';
    const blogImage = post?.image || '';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: '"Noto Sans Bengali"',
                }}
            >
                {/* Background image or gradient */}
                {blogImage ? (
                    <img
                        src={blogImage}
                        width={OG_WIDTH}
                        height={OG_HEIGHT}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : null}

                {/* Dark overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: blogImage
                            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(27,94,32,0.6) 100%)'
                            : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)',
                        display: 'flex',
                    }}
                />

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', position: 'relative', padding: '50px 60px' }}>
                    {/* Top */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'flex' }}>তারুণ্য প্রকাশন</div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#fff', display: 'flex' }}>
                            ব্লগ
                        </div>
                    </div>

                    {/* Bottom - Title */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, display: 'flex', maxWidth: '900px' }}>
                            {title.length > 80 ? title.substring(0, 77) + '...' : title}
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                            tarunnyoprokashon.com
                        </div>
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
