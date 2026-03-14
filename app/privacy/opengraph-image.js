import { createStaticOgImage, OG_WIDTH, OG_HEIGHT } from '../../lib/og-helpers.js';
export const runtime = 'nodejs';
export const alt = 'Privacy Policy | Tarunno Prokashon';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';
export default async function Image() {
    return createStaticOgImage('Privacy Policy', 'Your privacy matters to us');
}
