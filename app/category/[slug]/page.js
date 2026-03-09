"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoriesFromServer, getCategoryWiseProducts } from '../../../lib/api';
import CategorySidebar from '../../../components/Category/CategorySidebar';
import ProductGrid from '../../../components/Category/ProductGrid';

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

    // English to Bangla Category Name Mapping
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

    const [categoryId, setCategoryId] = useState(rawSlug);
    const [categoryName, setCategoryName] = useState(() => {
        const decoded = decodeURIComponent(rawSlug).toLowerCase();
        return categoryTranslations[decoded] || decoded.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    });

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
                            if (found.name) setCategoryName(found.name);

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
                    setAllProducts(globalProductsArray.map(mapProduct).sort((a, b) => b.stock - a.stock));

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
                    // Fallback Dummy Data for Category Grid
                    const fallbackBooks = [
                        { id: 'f1', name: "খরাজ খাতা", brand_name: "আহমাদ মোস্তফা কামাল", retails_price: 350, discount: 50, discount_type: "amount", image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop", current_stock: 10 },
                        { id: 'f2', name: "জীবন যেখানে যেমন", brand_name: "আরিফ আজাদ", retails_price: 400, discount: 20, discount_type: "percentage", image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop", current_stock: 50 },
                        { id: 'f3', name: "প্রোডাক্টিভ মুসলিম", brand_name: "মোহাম্মদ ফারিস", retails_price: 600, discount: 0, discount_type: "0", image_url: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=400&auto=format&fit=crop", current_stock: 20 },
                        { id: 'f4', name: "নেপোলিয়ন হিল: থিঙ্ক অ্যান্ড গ্রো রিচ", brand_name: "নেপোলিয়ন হিল", retails_price: 450, discount: 15, discount_type: "percentage", image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop", current_stock: 5 },
                        { id: 'f5', name: "রিচ ড্যাড পুওর ড্যাড", brand_name: "রবার্ট কিয়োসাকি", retails_price: 500, discount: 100, discount_type: "amount", image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop", current_stock: 100 },
                        { id: 'f6', name: "দ্য সিক্রেট", brand_name: "রোন্ডা বাইর্ন", retails_price: 550, discount: 0, discount_type: "0", image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop", current_stock: 15 },
                    ];
                    setAllProducts(fallbackBooks.map(mapProduct));
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch category products:', err);
                if (isMounted) {
                    const fallbackBooks = [
                        { id: 'f1', name: "খরাজ খাতা", brand_name: "আহমাদ মোস্তফা কামাল", retails_price: 350, discount: 50, discount_type: "amount", image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop", current_stock: 10 },
                        { id: 'f2', name: "জীবন যেখানে যেমন", brand_name: "আরিফ আজাদ", retails_price: 400, discount: 20, discount_type: "percentage", image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop", current_stock: 50 },
                        { id: 'f3', name: "প্রোডাক্টিভ মুসলিম", brand_name: "মোহাম্মদ ফারিস", retails_price: 600, discount: 0, discount_type: "0", image_url: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=400&auto=format&fit=crop", current_stock: 20 },
                        { id: 'f4', name: "নেপোলিয়ন হিল: থিঙ্ক অ্যান্ড গ্রো রিচ", brand_name: "নেপোলিয়ন হিল", retails_price: 450, discount: 15, discount_type: "percentage", image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop", current_stock: 5 },
                    ];
                    setAllProducts(fallbackBooks.map(mapProduct));
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
        <div className="bg-gray-50 min-h-screen py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Top Banner Image */}
                <div className="w-full relative rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8" style={{ aspectRatio: '21/5' }}>
                    <Image
                        src={bannerImage}
                        alt={`${categoryName} Banner`}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent flex items-center p-8 md:p-16">
                        <div className="text-white">
                            <h1 className="text-3xl md:text-6xl font-black mb-2 tracking-tight capitalize">{categoryName}</h1>
                            <p className="text-lg md:text-2xl font-medium text-white/90">নতুন সংগ্রহ : এক নজরে দেখে নিন</p>
                        </div>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="text-[12px] md:text-sm text-gray-500 mb-6 md:mb-10 flex items-center gap-2 font-medium">
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
                                            href={`/category/${rawSlug}?page=${pageNum}`}
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
