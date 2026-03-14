import { ImageResponse } from 'next/og';
import { getOgFonts, getLogoDataUrl, OG_WIDTH, OG_HEIGHT } from '../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'তারুণ্য প্রকাশন | বই ও প্রকাশনা';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image() {
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: 'HindSiliguri', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex' }} />

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '60px', gap: '30px' }}>
                    {/* Official Logo */}
                    {logoUrl && (
                        <img src={logoUrl} width={500} height={140} style={{ objectFit: 'contain' }} />
                    )}

                    {/* Tagline */}
                    <div style={{ fontSize: '28px', fontWeight: 400, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: '800px', lineHeight: 1.5, display: 'flex' }}>
                        বাংলাদেশের অন্যতম বিশ্বস্ত বই বিক্রয় প্রতিষ্ঠান
                    </div>

                    {/* Feature pills */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 28px', borderRadius: '40px', fontSize: '18px', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
                            সেরা মানের বই
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 28px', borderRadius: '40px', fontSize: '18px', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
                            দ্রুত ডেলিভারি
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 28px', borderRadius: '40px', fontSize: '18px', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
                            সাশ্রয়ী মূল্য
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
        { ...size, fonts }
    );
}
