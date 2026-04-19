"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getCategoriesFromServer, getCategoryWiseProducts } from '../../../lib/api';
import CategorySidebar from '../../../components/Category/CategorySidebar';
import ProductGrid from '../../../components/Category/ProductGrid';
import { trackViewItemList } from '../../../lib/gtm';

function mapProduct(p, catId) {
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
        categoryId: catId,
        price: `৳ ${discountedPrice.toLocaleString('en-IN')}`,
        oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
        discount,
        imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || '/no-image.svg',
        brand: p.brands?.name || p.brand_name || 'অন্যান্য',
        stock: p.current_stock || 0,
        rawPrice: discountedPrice,
        rawImeis: p.imeis || []
    };
}

export default function AllCategoriesPage() {
    const searchParams = useSearchParams();
    const urlPage = Math.max(1, parseInt(searchParams?.get('page') || '1', 10));
    
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Filter State
    const [selectedBrands, setSelectedBrands] = useState(['All']);
    const [selectedPrice, setSelectedPrice] = useState({ min: '', max: '' });
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState('All');
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        let isMounted = true;
        let globalProducts = [];

        const fetchAllCategoriesData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch all categories
                const catRes = await getCategoriesFromServer();
                if (catRes?.success && Array.isArray(catRes.data)) {
                    if (isMounted) setCategories(catRes.data);
                    
                    // 2. Fetch products for each category progressively
                    const fetchPromises = catRes.data.map(async (cat) => {
                        try {
                            const catId = cat.category_id || cat.id;
                            const res = await getCategoryWiseProducts(catId, 1);
                            
                            if (res?.success && Array.isArray(res.data) && isMounted) {
                                const mapped = res.data.map(p => mapProduct(p, catId));
                                globalProducts = [...globalProducts, ...mapped];
                                
                                setAllProducts(prev => {
                                    const next = [...prev, ...mapped];
                                    const unique = Array.from(new Map(next.map(item => [item.id, item])).values());
                                    return unique;
                                });
                            }
                        } catch (err) {
                            console.error(`Failed to fetch products for category ${cat.name}:`, err);
                        }
                    });

                    await Promise.allSettled(fetchPromises);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchAllCategoriesData();

        return () => { isMounted = false; };
    }, []);

    // Compute dynamic filter lists
    const derivedFilters = useMemo(() => {
        const brandsList = ['All'];
        brandsList.push(...new Set(allProducts.map(p => p.brand).filter(Boolean)));

        const allImeis = allProducts.flatMap(p => p.rawImeis || []);
        const regionList = [...new Set(allImeis.map(i => i.region).filter(Boolean))].sort();

        let minPrice = Infinity;
        let maxPrice = 0;

        allProducts.forEach(p => {
            if (p.rawPrice > 0 && p.rawPrice < minPrice) minPrice = p.rawPrice;
            if (p.rawPrice > maxPrice) maxPrice = p.rawPrice;
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
    }, [allProducts]);

    // Apply filters
    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            if (selectedBrands.length > 0 && selectedBrands[0] !== 'All') {
                if (!selectedBrands.includes(p.brand)) return false;
            }
            if (selectedPrice.min !== '' && p.rawPrice < Number(selectedPrice.min)) return false;
            if (selectedPrice.max !== '' && p.rawPrice > Number(selectedPrice.max)) return false;
            if (selectedAvailability === 'In Stock' && p.stock <= 0) return false;

            if (selectedRegion.length > 0) {
                const hasMatchingRegion = (p.rawImeis || []).some(i => selectedRegion.includes(i.region));
                if (!hasMatchingRegion) return false;
            }

            if (selectedCategories.length > 0) {
                if (!selectedCategories.includes(p.categoryId)) return false;
            }

            return true;
        });
    }, [allProducts, selectedBrands, selectedPrice, selectedRegion, selectedAvailability, selectedCategories]);

    // Pagination Logic
    const itemsPerPage = 20;
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const validCurrentPage = Math.min(urlPage, totalPages);

    const paginatedProducts = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, validCurrentPage]);

    return (
        <div className="bg-gray-50 min-h-screen py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Breadcrumbs */}
                <div className="text-[12px] md:text-sm text-gray-500 mb-6 md:mb-10 flex items-center gap-2 font-medium">
                    <Link href="/" className="hover:text-brand-green transition-colors">হোম</Link>
                    <span>/</span>
                    <span className="text-brand-green font-bold">সকল বিভাগ</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 pt-2 lg:pt-0">

                    {/* Sidebar (Filters) */}
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
                            categoryList={categories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-3/4 order-2">
                        {isLoading && allProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 font-medium">বিভাগগুলো লোড হচ্ছে...</p>
                            </div>
                        ) : paginatedProducts.length > 0 ? (
                            <>
                                <ProductGrid
                                    products={paginatedProducts}
                                    onOpenFilter={() => setIsMobileFilterOpen(true)}
                                    categoryName="সকল বিভাগ"
                                    brandsList={derivedFilters.brandsList}
                                    activeBrand={selectedBrands[0] || 'All'}
                                    onSelectBrand={(b) => setSelectedBrands([b])}
                                />

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                                        {Array.from({ length: totalPages }, (_, i) => {
                                            let pageNum = i + 1;
                                            // Basic window logic for many pages
                                            if (totalPages > 6) {
                                                if (pageNum < validCurrentPage - 2 && pageNum !== 1) return null;
                                                if (pageNum > validCurrentPage + 2 && pageNum !== totalPages) return null;
                                                if (pageNum === validCurrentPage - 2 && pageNum > 2) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                                if (pageNum === validCurrentPage + 2 && pageNum < totalPages - 1) return <span key={`ellipsis-${pageNum}`} className="px-2 text-gray-400">...</span>;
                                            }

                                            return (
                                                <Link
                                                    key={pageNum}
                                                    href={`/category/all?page=${pageNum}`}
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
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 font-medium">কোনো বই পাওয়া যায়নি।</p>
                            </div>
                        )}
                        
                        {isLoading && allProducts.length > 0 && (
                            <div className="mt-8 flex justify-center items-center gap-3 py-4 bg-brand-green/5 border border-brand-green/10 rounded-xl">
                                <div className="w-5 h-5 border-3 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
                                <p className="text-brand-green font-bold text-sm">আরো বই লোড হচ্ছে...</p>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
