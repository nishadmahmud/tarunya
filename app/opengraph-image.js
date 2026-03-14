import { ImageResponse } from 'next/og';
import { getBengaliFont, OG_WIDTH, OG_HEIGHT } from '../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'তারুণ্য প্রকাশন | বই ও প্রকাশনা';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image() {
    const bengaliFont = await getBengaliFont();

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
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex' }} />
                <div style={{ position: 'absolute', top: '200px', right: '200px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(197,152,73,0.08)', display: 'flex' }} />

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '60px', gap: '24px' }}>
                    {/* Logo */}
                    <img
                        src="https://tarunnyoprokashon.com/og.jpeg"
                        width={140}
                        height={140}
                        style={{ borderRadius: '28px', border: '4px solid rgba(255,255,255,0.2)' }}
                    />

                    {/* Title */}
                    <div style={{ fontSize: '64px', fontWeight: 800, color: '#ffffff', textAlign: 'center', lineHeight: 1.2, display: 'flex' }}>
                        তারুণ্য প্রকাশন
                    </div>

                    {/* Subtitle */}
                    <div style={{ fontSize: '26px', fontWeight: 400, color: 'rgba(255,255,255,0.75)', textAlign: 'center', maxWidth: '800px', lineHeight: 1.5, display: 'flex' }}>
                        বাংলাদেশের অন্যতম বিশ্বস্ত বই বিক্রয় প্রতিষ্ঠান
                    </div>

                    {/* Tagline pills */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 24px', borderRadius: '40px', fontSize: '16px', color: 'rgba(255,255,255,0.8)', display: 'flex' }}>
                            📚 সেরা মানের বই
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 24px', borderRadius: '40px', fontSize: '16px', color: 'rgba(255,255,255,0.8)', display: 'flex' }}>
                            🚚 দ্রুত ডেলিভারি
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 24px', borderRadius: '40px', fontSize: '16px', color: 'rgba(255,255,255,0.8)', display: 'flex' }}>
                            💰 সাশ্রয়ী মূল্য
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0 60px 30px', fontSize: '16px', color: 'rgba(255,255,255,0.4)' }}>
                    tarunnyoprokashon.com
                </div>

                {/* Bottom accent bar */}
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
