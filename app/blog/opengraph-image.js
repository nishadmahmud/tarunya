import { createStaticOgImage, OG_WIDTH, OG_HEIGHT } from '../../lib/og-helpers.js';
export const runtime = 'nodejs';
export const alt = 'Blog | Tarunya Prokashon';
export const size = { width: OG_WIDTH, height: OG_HEIGHT };
export const contentType = 'image/png';
export default async function Image() {
    return createStaticOgImage('Blog', 'Tips, reviews and more');
}
