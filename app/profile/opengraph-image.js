import { ImageResponse } from 'next/og';
import { getBengaliFont, OG_WIDTH, OG_HEIGHT } from '../../lib/og-helpers.js';

export const runtime = 'nodejs';
export const alt = 'প্রোফাইল | তারুণ্য প্রকাশন';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';

export default async function Image() {
    const bengaliFont = await getBengaliFont();
    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: '"Noto Sans Bengali"', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ display: 'flex', padding: '50px 60px 0', fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>তারুণ্য প্রকাশন</div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '0 60px', gap: '16px' }}>
                    <div style={{ fontSize: '56px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, display: 'flex' }}>আমার প্রোফাইল</div>
                    <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>Account Dashboard</div>
                </div>
                <div style={{ display: 'flex', padding: '0 60px 40px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>tarunnyoprokashon.com</div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { ...size, fonts: [{ name: 'Noto Sans Bengali', data: bengaliFont, style: 'normal', weight: 700 }] }
    );
}
