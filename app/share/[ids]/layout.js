export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const ids = resolvedParams.ids || '';
    
    const count = ids ? decodeURIComponent(ids).split(',').length : 0;
    const title = count > 1 ? `Shared Collection (${count} items) - Tarunno Shop` : 'Shared Product Collection - Tarunno Shop';

    return {
        title,
        openGraph: {
            title,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
        },
    };
}

export default function ShareLayout({ children }) {
    return <>{children}</>;
}
