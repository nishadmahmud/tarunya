import { readFile } from 'fs/promises';
import { join } from 'path';

export const brandColors = {
    green: '#2e7d32',
    greenDark: '#1b5e20',
    greenLight: '#4caf50',
    gold: '#c59849',
    white: '#ffffff',
    gray: '#f5f5f5',
    textDark: '#1a1a1a',
    textLight: '#666666',
};

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export function formatPriceBn(amount) {
    return `৳${Number(amount).toLocaleString('en-US')}`;
}

// Load Bengali font from local filesystem (Satori requires TTF/OTF)
let boldFontCache = null;
export async function getBengaliFont() {
    if (boldFontCache) return boldFontCache;
    const fontPath = join(process.cwd(), 'public', 'fonts', 'HindSiliguri-Bold.ttf');
    boldFontCache = await readFile(fontPath);
    return boldFontCache;
}

let regularFontCache = null;
export async function getBengaliFontRegular() {
    if (regularFontCache) return regularFontCache;
    const fontPath = join(process.cwd(), 'public', 'fonts', 'HindSiliguri-Regular.ttf');
    regularFontCache = await readFile(fontPath);
    return regularFontCache;
}

// Get the official logo as base64 data URL
let logoCache = null;
export async function getLogoDataUrl() {
    if (logoCache) return logoCache;
    try {
        const logoPath = join(process.cwd(), 'public', 'Tarunya Logo Board.png');
        const buffer = await readFile(logoPath);
        logoCache = `data:image/png;base64,${buffer.toString('base64')}`;
        return logoCache;
    } catch {
        return null;
    }
}

// Standard font config for ImageResponse
export async function getOgFonts() {
    const [bold, regular] = await Promise.all([
        getBengaliFont(),
        getBengaliFontRegular(),
    ]);
    return [
        { name: 'HindSiliguri', data: bold, style: 'normal', weight: 700 },
        { name: 'HindSiliguri', data: regular, style: 'normal', weight: 400 },
    ];
}

// Reusable static OG image generator for simple pages
export async function createStaticOgImage(title, subtitle) {
    const { ImageResponse } = await import('next/og');
    const [fonts, logoUrl] = await Promise.all([getOgFonts(), getLogoDataUrl()]);

    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)', fontFamily: 'HindSiliguri', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
                <div style={{ display: 'flex', padding: '50px 60px 0' }}>
                    {logoUrl && <img src={logoUrl} width={250} height={65} style={{ objectFit: 'contain' }} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '0 60px', gap: '16px' }}>
                    <div style={{ fontSize: '52px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, display: 'flex' }}>{title}</div>
                    <div style={{ fontSize: '24px', fontWeight: 400, color: 'rgba(255,255,255,0.7)', display: 'flex' }}>{subtitle}</div>
                </div>
                <div style={{ display: 'flex', padding: '0 60px 40px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>tarunnyoprokashon.com</div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(90deg, #c59849, #4caf50, #c59849)', display: 'flex' }} />
            </div>
        ),
        { width: OG_WIDTH, height: OG_HEIGHT, fonts }
    );
}

