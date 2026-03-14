import { getCategoriesFromServer } from '../../../lib/api';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const rawSlug = resolvedParams.slug || '';

    const categoryTranslations = {
        'novels': 'উপন্যাস',
        'poetry': 'কবিতা',
        'children': 'শিশু-কিশোর',
        'self-help': 'আত্মউন্নয়ন',
        'religious': 'ধর্মীয় বই',
        'history': 'ইতিহাস',
        'science': 'বিজ্ঞান',
        'biography': 'জীবনী',
    };

    let categoryName = '';
    try {
        const decoded = decodeURIComponent(rawSlug).toLowerCase();
        categoryName = categoryTranslations[decoded];

        if (!categoryName) {
            const catRes = await getCategoriesFromServer();
            if (catRes?.success && Array.isArray(catRes.data)) {
                const normalize = (val) => val ? String(val).toLowerCase().trim().replace(/\s+/g, '-') : '';
                const slugLower = String(rawSlug).toLowerCase();

                const found = catRes.data.find((c) =>
                    String(c.category_id) === String(rawSlug) ||
                    String(c.id) === String(rawSlug) ||
                    normalize(c.name) === slugLower
                );
                if (found) {
                    categoryName = found.name;
                }
            }
        }

        if (!categoryName) {
            categoryName = decoded.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
    } catch (e) {
        categoryName = 'Category';
    }

    const title = `${categoryName} - Tarunno Shop`;

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

export default function CategoryLayout({ children }) {
    return <>{children}</>;
}
