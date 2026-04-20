import { getProductById } from "../../../lib/api";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const ids = resolvedParams.ids || "";
    const idList = ids
        ? decodeURIComponent(ids)
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean)
        : [];

    let title = idList.length > 1
        ? `Shared Collection (${idList.length} items) - Tarunya Shop`
        : "Shared Product Collection - Tarunya Shop";

    if (idList.length > 0) {
        try {
            const productResults = await Promise.allSettled(
                idList.map((id) => getProductById(id))
            );

            const names = productResults
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value?.data || result.value)
                .filter((product) => product?.name)
                .map((product) => product.name.trim());

            if (names.length > 0) {
                if (names.length === 1) {
                    title = `${names[0]} - Tarunya Shop`;
                } else if (names.length === 2) {
                    title = `${names[0]}, ${names[1]} - Tarunya Shop`;
                } else {
                    title = `${names[0]}, ${names[1]} +${names.length - 2} more books - Tarunya Shop`;
                }
            }
        } catch (error) {
            // Keep fallback title if product fetch fails.
            console.error("Failed to build share metadata title:", error);
        }
    }

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
