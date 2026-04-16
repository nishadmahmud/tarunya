"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategoryWiseProducts, getProductById, getProductReviews } from "../../lib/api";

function slugify(value) {
    return value
        ? String(value).toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, "-").replace(/^-|-$/g, "")
        : "";
}

function uniqueById(items = []) {
    const seen = new Set();
    const output = [];
    for (const item of items) {
        if (!item?.id) continue;
        const key = String(item.id);
        if (seen.has(key)) continue;
        seen.add(key);
        output.push(item);
    }
    return output;
}

export default function HomepagePrefetchManager({ productCandidates = [], categoryCandidates = [] }) {
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        let idleId = null;
        let timeoutId = null;

        const runPrefetch = async () => {
            if (cancelled) return;

            const productList = uniqueById(productCandidates).slice(0, 10);
            const categoryList = uniqueById(categoryCandidates).slice(0, 3);

            const tasks = [];

            for (const product of productList) {
                const productSlug = slugify(product.name) || "product";
                router.prefetch(`/product/${productSlug}-${product.id}`);

                const numericId = Number(product.id);
                if (!Number.isNaN(numericId) && numericId > 0) {
                    tasks.push(getProductById(numericId));
                    tasks.push(getProductReviews(numericId));
                }
            }

            for (const category of categoryList) {
                const categorySlug = slugify(category.name) || "category";
                router.prefetch(`/category/${categorySlug}-${category.id}`);
                tasks.push(getCategoryWiseProducts(category.id, 1));
            }

            if (tasks.length > 0) {
                await Promise.allSettled(tasks);
            }
        };

        const schedule = () => {
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                idleId = window.requestIdleCallback(() => {
                    runPrefetch().catch(() => { /* no-op */ });
                }, { timeout: 2000 });
            } else {
                timeoutId = window.setTimeout(() => {
                    runPrefetch().catch(() => { /* no-op */ });
                }, 1200);
            }
        };

        schedule();

        return () => {
            cancelled = true;
            if (idleId !== null && typeof window !== "undefined" && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [router, productCandidates, categoryCandidates]);

    return null;
}

