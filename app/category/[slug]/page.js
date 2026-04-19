"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoriesFromServer, getCategoryWiseProducts } from '../../../lib/api';
import CategorySidebar from '../../../components/Category/CategorySidebar';
import ProductGrid from '../../../components/Category/ProductGrid';
import { trackViewItemList } from '../../../lib/gtm';

function mapProduct(p) {
    const originalPrice = Number(p.retails_price || 0);
    const discountValue = Number(p.discount || 0);
    const discountType = p.discount_type;
    const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

    const discountedPrice = hasDiscount
        ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
        : originalPrice;

    const discount = hasDiscount
        ? (String(discountType).toLowerCase() === 'percentage' ? `-${discountValue}%` : `৳ ${discountValue}`)
        : null;

    return {
        id: p.id,
        name: p.name,
        price: `৳ ${discountedPrice.toLocaleString('en-IN')}`,
        oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
        discount,
        imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || '/no-image.svg',
        brand: p.brand_name || '',
        stock: p.current_stock || 0,
        rawPrice: discountedPrice,
        rawImeis: p.imeis || []
    };
}

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug || '';

    // Read the requested page exclusively from URL parameters.
    const urlPage = Math.max(1, parseInt(searchParams?.get('page') || '1', 10));

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [categoryId, setCategoryId] = useState(rawSlug);
    const [categoryName, setCategoryName] = useState(() => {
        const decoded = decodeURIComponent(rawSlug).trim();
        if (decoded.includes('-')) {
            const parts = decoded.split('-');
            // If the last part is a number (the ID), remove it from the display name
            if (!isNaN(parts[parts.length - 1])) {
                parts.pop();
            }
            return parts.join(' ').replace(/\b\w/g, c => c.toUpperCase());
        }
        return decoded.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    });
    // Store a name-based slug for use in pagination URLs (derived once category is resolved)
    const [categorySlug, setCategorySlug] = useState(rawSlug);

    // Instead of holding 1 page, we hold ALL products for this category.
    const [allProducts, setAllProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Updated to a book-themed banner image
    const [bannerImage, setBannerImage] = useState("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop");

    // Filter State
    const [selectedBrands, setSelectedBrands] = useState(['All']);
    const [selectedPrice, setSelectedPrice] = useState({ min: '', max: '' });
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState('All');

    useEffect(() => {
        let isMounted = true;

        const fetchCategoryData = async () => {
            setIsLoading(true);
            let resolvedCatId = rawSlug;
            
            // Extract ID from name-id format (e.g., "name-48" -> "48")
            const decoded = decodeURIComponent(rawSlug).trim();
            if (decoded.includes('-')) {
                const parts = decoded.split('-');
                const possibleId = parts[parts.length - 1];
                if (!isNaN(possibleId)) {
                    resolvedCatId = possibleId;
                }
            }

            try {
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
                        resolvedCatId = found.category_id ?? found.id ?? resolvedCatId;
                        if (isMounted) {
                            setCategoryId(resolvedCatId);
                            if (found.name) {
                                setCategoryName(found.name);
                                const nameSlug = found.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') || 'category';
                                setCategorySlug(`${nameSlug}-${resolvedCatId}`);
                            }

                            // Use banner from API with fallbacks
                            const apiBanner = found.banner || found.banner_image || found.image_path || found.image_url;
                            if (apiBanner) {
                                setBannerImage(apiBanner);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to resolve category:', err);
            }

            try {
                // Fetch the FIRST page to get initial data and pagination limits fast
                const firstPageData = await getCategoryWiseProducts(resolvedCatId, 1);

                    if (isMounted && firstPageData?.success && Array.isArray(firstPageData.data) && firstPageData.data.length > 0) {
                    // Start rendering first page immediately
                    let globalProductsArray = [...firstPageData.data];
                    const mappedProducts = globalProductsArray.map(mapProduct).sort((a, b) => b.stock - a.stock);
                    setAllProducts(mappedProducts);

                    // GA4: track view_item_list for this category
                    trackViewItemList(mappedProducts, categoryName, String(resolvedCatId));

                    if (firstPageData.filter_options) setFilterOptions(firstPageData.filter_options);
                    setIsLoading(false); // First render ready!

                    // Now, fetch all remaining pages in the background
                    const totalPages = firstPageData.pagination?.last_page || 1;
                    if (totalPages > 1) {
                        const remainingPagesToFetch = [];
                        for (let p = 2; p <= totalPages; p++) {
                            remainingPagesToFetch.push(p);
                        }

                        // We fetch them in chunks of 5 pages directly.
                        for (let i = 0; i < remainingPagesToFetch.length; i += 5) {
                            if (!isMounted) break; // abort if unmounted
                            const chunk = remainingPagesToFetch.slice(i, i + 5);

                            const chunkResults = await Promise.allSettled(
                                chunk.map(page => getCategoryWiseProducts(resolvedCatId, page))
                            );

                            chunkResults.forEach((res) => {
                                if (res.status === 'fulfilled' && res.value?.success && Array.isArray(res.value.data)) {
                                    globalProductsArray.push(...res.value.data);
                                }
                            });

                            // Aggressively append the background-fetched products into state 
                            // so that user doesn't even notice it buffering behind the scenes.
                            if (isMounted) {
                                setAllProducts([...globalProductsArray].map(mapProduct).sort((a, b) => b.stock - a.stock));
                            }
                        }
                    }
                } else if (isMounted) {
                    setAllProducts([]);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch category products:', err);
                if (isMounted) {
                    setAllProducts([]);
                    setIsLoading(false);
                }
            }
        };

        if (rawSlug) fetchCategoryData();

        return () => { isMounted = false; };
    }, [rawSlug]); // Notice 'currentPage/urlPage' is not here: it only fetches on component mount/category change

    // Compute dynamic filter lists using ALL background-fetched products + Server rules.
    const derivedFilters = useMemo(() => {
        const brandsList = ['All'];
        if (filterOptions?.brands) {
            brandsList.push(...Object.values(filterOptions.brands));
        } else {
            brandsList.push(...new Set(allProducts.map(p => p.brand).filter(Boolean)));
        }

        // Region List (Publisher)
        let regionList = [];
        if (filterOptions?.regions) {
            regionList = Object.values(filterOptions.regions);
        } else {
            const allImeis = allProducts.flatMap(p => p.rawImeis || []);
            regionList = [...new Set(allImeis.map(i => i.region).filter(Boolean))].sort();
        }

        // Price Boundary Calculation
        let minPrice = Infinity;
        let maxPrice = 0;

        allProducts.forEach(p => {
            if (p.rawPrice > 0 && p.rawPrice < minPrice) minPrice = p.rawPrice;
            if (p.rawPrice > maxPrice) maxPrice = p.rawPrice;

            if (p.rawImeis && p.rawImeis.length > 0) {
                p.rawImeis.forEach(imei => {
                    const imeiPrice = Number(imei.discount_price || imei.price || 0);
                    if (imeiPrice > 0) {
                        if (imeiPrice < minPrice) minPrice = imeiPrice;
                        if (imeiPrice > maxPrice) maxPrice = imeiPrice;
                    }
                });
            }
        });

        if (minPrice === Infinity) minPrice = 0;

        const roundDown = val => Math.floor(val / 100) * 100;
        const roundUp = val => Math.ceil(val / 100) * 100;

        const globalMinPrice = roundDown(minPrice);
        const globalMaxPrice = roundUp(maxPrice);

        return {
            brandsList: [...new Set(brandsList)],
            regionList,
            globalMinPrice,
            globalMaxPrice
        };
    }, [allProducts, filterOptions]);

    // Apply Filters front-end across the ENTIRE product dataset
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            if (selectedBrands.length > 0 && selectedBrands[0] !== 'All') {
                if (!selectedBrands.includes(p.brand)) return false;
            }
            if (selectedPrice.min !== '' && p.rawPrice < Number(selectedPrice.min)) return false;
            if (selectedPrice.max !== '' && p.rawPrice > Number(selectedPrice.max)) return false;
            if (selectedAvailability === 'In Stock' && p.stock <= 0) return false;

            const hasImeiFilters = selectedRegion.length > 0;
            if (hasImeiFilters) {
                const hasMatchingImei = (p.rawImeis || []).some(i => {
                    let match = true;
                    if (selectedRegion.length > 0 && !selectedRegion.includes(i.region)) match = false;
                    return match;
                });
                if (!hasMatchingImei) return false;
            }

            return true;
        });
    }, [allProducts, selectedBrands, selectedPrice, selectedRegion, selectedAvailability]);

    // Frontend pagination limits
    const itemsPerPage = 20;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const validCurrentPage = Math.min(urlPage, totalPages); // Protect against invalid out-of-bounds ?page= variables.

    // Splice ONLY what is needed onto the screen instantly!
    const paginatedProductsForScreen = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, validCurrentPage, itemsPerPage]);

    return (
        <div className="bg-gray-50 min-h-screen pt-2 pb-6 sm:pt-3 sm:pb-8 md:pt-4 md:pb-10">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Top banner: full width of max-w-7xl column + roomier title block */}
                <div className="relative -mx-4 w-[calc(100%+2rem)] overflow-hidden rounded-xl md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-2xl mb-3 md:mb-4">
                    <Image
                        src={bannerImage}
                        alt={`${categoryName} Banner`}
                        fill
                        unoptimized
                        className="object-cover object-center z-0"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-gray-900/75 via-gray-900/40 to-transparent"
                        aria-hidden
                    />
                    <div className="relative z-20 px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight capitalize leading-tight text-white">
                            {categoryName}
                        </h1>
                        <p className="mt-1.5 text-sm sm:text-base md:text-lg font-medium leading-snug text-white/90">
                            নতুন সংগ্রহ : এক নজরে দেখে নিন
                        </p>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="text-[12px] md:text-sm text-gray-500 mb-4 md:mb-6 flex items-center gap-2 font-medium">
                    <Link href="/" className="hover:text-brand-green transition-colors">হোম</Link>
                    <span>/</span>
                    <span className="hover:text-brand-green transition-colors cursor-pointer">বিভাগ</span>
                    <span>/</span>
                    <span className="text-brand-green font-bold capitalize">{categoryName}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 pt-2 lg:pt-0">

                    {/* Sidebar (Filters) - Left Side on Desktop */}
                    <aside className="lg:w-1/4 order-1">
                        <CategorySidebar
                            isOpen={isMobileFilterOpen}
                            onClose={() => setIsMobileFilterOpen(false)}
                            derivedFilters={derivedFilters}
                            globalMinPrice={derivedFilters.globalMinPrice}
                            globalMaxPrice={derivedFilters.globalMaxPrice}
                            selectedPrice={selectedPrice}
                            setSelectedPrice={setSelectedPrice}
                            selectedRegion={selectedRegion}
                            setSelectedRegion={setSelectedRegion}
                            selectedAvailability={selectedAvailability}
                            setSelectedAvailability={setSelectedAvailability}
                        />
                    </aside>

                    {/* Main Content (Product Grid) - Right Side on Desktop */}
                    <main className="lg:w-3/4 order-2">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                                <div className="w-8 h-8 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 font-medium">বই লোড হচ্ছে...</p>
                            </div>
                        ) : paginatedProductsForScreen.length > 0 ? (
                            <ProductGrid
                                products={paginatedProductsForScreen}
                                onOpenFilter={() => setIsMobileFilterOpen(true)}
                                categoryName={categoryName}
                                brandsList={derivedFilters.brandsList}
                                activeBrand={selectedBrands[0] || 'All'}
                                onSelectBrand={(b) => setSelectedBrands([b])}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                                <p className="text-gray-400 font-medium">আপনার ফিল্টার অনুযায়ী কোনো বই পাওয়া যায়নি।</p>
                            </div>
                        )}

                        {/* Pagination Overlay logic is now entirely Client-side aware */}
                        {!isLoading && totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                                {Array.from({ length: totalPages }, (_, i) => {
                                    let pageNum = i + 1;

                                    // Basic slicing window to prevent hundred page spans wrapping.
                                    if (totalPages > 6) {
                                        if (pageNum < validCurrentPage - 2 && pageNum !== 1) return null;
                                        if (pageNum > validCurrentPage + 2 && pageNum !== totalPages) return null;
                                        if (pageNum === validCurrentPage - 2 && pageNum > 2) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                        if (pageNum === validCurrentPage + 2 && pageNum < totalPages - 1) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                    }

                                    return (
                                        <Link
                                            key={pageNum}
                                            href={`/category/${categorySlug}?page=${pageNum}`}
                                            scroll={true}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${pageNum === validCurrentPage
                                                ? 'bg-brand-green text-white shadow-md'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
