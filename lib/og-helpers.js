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

// Fetch Bengali font for ImageResponse
let fontCache = null;
export async function getBengaliFont() {
    if (fontCache) return fontCache;

    // Use a browser User-Agent so Google Fonts returns woff2 format
    const res = await fetch(
        'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@700&display=swap',
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        }
    );
    const css = await res.text();

    // Try woff2 first, then woff, then ttf
    const woff2Match = css.match(/url\(([^)]+\.woff2)\)/);
    const woffMatch = css.match(/url\(([^)]+\.woff)\)/);
    const ttfMatch = css.match(/url\(([^)]+\.ttf)\)/);
    const anyUrlMatch = css.match(/url\((https:\/\/[^)]+)\)/);

    const fontUrl = woff2Match?.[1] || woffMatch?.[1] || ttfMatch?.[1] || anyUrlMatch?.[1];

    if (!fontUrl) {
        // Ultimate fallback: fetch directly from Google Fonts static URL
        const fallbackRes = await fetch(
            'https://fonts.gstatic.com/s/notosansbengali/v20/rCSSi6AOMB8AxRe_LZS1S_hOyLBn0x1HpaRGMg.woff2'
        );
        fontCache = await fallbackRes.arrayBuffer();
        return fontCache;
    }

    const fontRes = await fetch(fontUrl);
    fontCache = await fontRes.arrayBuffer();
    return fontCache;
}

// Get the logo as base64 data URL for embedding in OG images
let logoCache = null;
export async function getLogoDataUrl() {
    if (logoCache) return logoCache;
    try {
        const logoPath = join(process.cwd(), 'public', 'og.jpeg');
        const buffer = await readFile(logoPath);
        logoCache = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        return logoCache;
    } catch {
        return null;
    }
}

// Reusable OG image wrapper JSX
export function OgLayout({ children, showLogo = true, logoUrl = null }) {
    return {
        type: 'div',
        props: {
            style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 100%)',
                fontFamily: '"Noto Sans Bengali", sans-serif',
                position: 'relative',
                overflow: 'hidden',
            },
            children: [
                // Decorative circles
                {
                    type: 'div',
                    props: {
                        style: {
                            position: 'absolute',
                            top: '-60px',
                            right: '-60px',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)',
                        },
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            position: 'absolute',
                            bottom: '-80px',
                            left: '-80px',
                            width: '350px',
                            height: '350px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.03)',
                        },
                    },
                },
                // Content
                children,
                // Bottom bar
                {
                    type: 'div',
                    props: {
                        style: {
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            height: '4px',
                            background: `linear-gradient(90deg, ${brandColors.gold}, ${brandColors.greenLight}, ${brandColors.gold})`,
                        },
                    },
                },
            ],
        },
    };
}

// Create a simple static OG image for pages that just need title + subtitle
export function staticOgContent(title, subtitle) {
    return [
        // Logo area
        {
            type: 'div',
            props: {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '50px 60px 0',
                    gap: '16px',
                },
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                fontSize: '24px',
                                fontWeight: 800,
                                color: 'rgba(255,255,255,0.9)',
                                letterSpacing: '-0.5px',
                            },
                            children: 'তারুণ্য প্রকাশন',
                        },
                    },
                ],
            },
        },
        // Main content
        {
            type: 'div',
            props: {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                    padding: '0 60px',
                    gap: '16px',
                },
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                fontSize: '56px',
                                fontWeight: 800,
                                color: '#ffffff',
                                lineHeight: 1.2,
                            },
                            children: title,
                        },
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                fontSize: '24px',
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: 1.4,
                            },
                            children: subtitle,
                        },
                    },
                ],
            },
        },
        // Footer
        {
            type: 'div',
            props: {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 60px 40px',
                },
                children: [
                    {
                        type: 'div',
                        props: {
                            style: {
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.5)',
                            },
                            children: 'tarunnyoprokashon.com',
                        },
                    },
                ],
            },
        },
    ];
}
