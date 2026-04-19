"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiBox, FiArrowRight } from 'react-icons/fi';
import { getCategoryWiseProducts } from '../../lib/api';

/**
 * Individual Category Card with a 2x2 grid of books
 * Fetches data only when visible in the viewport
 */
function CategoryGroupCard({ category }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasFetched) {
                    fetchCategoryProducts();
                    setHasFetched(true);
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [hasFetched]);

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true);
            const res = await getCategoryWiseProducts(category.category_id || category.id, 1);
            
            if (res?.success && res?.data) {
                // The API can return products in res.data (array) or res.data.data (paginated object)
                const items = Array.isArray(res.data) ? res.data : (res.data.data || []);
                
                if (items.length > 0) {
                    // Map API data to our UI format
                    const mapped = items.slice(0, 4).map(p => {
                        const discountValue = Number(p.discount || 0);
                        const discountType = p.discount_type;
                        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

                        const originalPrice = Number(p.retails_price || 0);
                        const discountedPrice = hasDiscount
                            ? (String(discountType).toLowerCase() === 'percentage'
                                ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                                : Math.max(0, originalPrice - discountValue))
                            : originalPrice;

                        const slugName = p.name ? p.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : "product";
                        const slugWithId = p.id ? `${slugName}-${p.id}` : slugName;

                        return {
                            id: p.id,
                            name: p.name,
                            price: `৳${discountedPrice.toLocaleString("en-IN")}`,
                            imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
                            slug: slugWithId
                        };
                    });
                    setProducts(mapped);
                }
            }
        } catch (error) {
            console.error(`Failed to fetch for category ${category.id}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const catSlug = category.name ? category.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : 'category';
    const categoryLink = `/category/${catSlug}-${category.category_id || category.id}`;

    return (
        <div 
            ref={cardRef} 
            className="w-[260px] md:w-[300px] bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all shrink-0 snap-start flex flex-col h-[450px] md:h-[470px]"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{category.name}</h3>
                <Link href={categoryLink} className="text-[10px] md:text-xs font-bold text-brand-green hover:underline shrink-0 ml-2">
                    সব দেখুন <FiArrowRight className="inline-block" />
                </Link>
            </div>

            <div className="flex-1">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
                                <div className="h-3 bg-gray-100 rounded-full w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                        {products.map(product => (
                            <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col gap-2 min-w-0">
                                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 relative border border-black/5 shadow-sm">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="text-[10px] md:text-[11px] font-bold text-gray-800 line-clamp-1 group-hover:text-brand-green transition-colors leading-tight">
                                    {product.name}
                                </h4>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                        <FiBox size={32} />
                        <span className="text-xs">কোনো বই পাওয়া যায়নি</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopCategories({ categories = [] }) {
    const sliderRef = useRef(null);

    const scrollLeft = () => { if (sliderRef.current) sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' }); };
    const scrollRight = () => { if (sliderRef.current) sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' }); };

    if (!categories || categories.length === 0) return null;

    return (
        <section className="bg-brand-cream/30 py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
                            বিভাগ অনুযায়ী বই
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400">আপনার পছন্দের বিভাগ থেকে বই বেছে নিন</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={scrollLeft} className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:border-brand-green hover:text-brand-green transition-all shadow-sm">
                            <FiChevronLeft size={20} />
                        </button>
                        <button onClick={scrollRight} className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:border-brand-green hover:text-brand-green transition-all shadow-sm">
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Categories Slider */}
                <div className="relative">
                    <div 
                        ref={sliderRef}
                        className="flex overflow-x-auto gap-4 md:gap-5 pb-6 scrollbar-hide snap-x snap-mandatory"
                    >
                        {categories.map((cat, idx) => (
                            <CategoryGroupCard key={cat.category_id || cat.id || idx} category={cat} />
                        ))}
                    </div>

                    {/* Mobile Arrows (Small and subtle) */}
                    <div className="md:hidden flex justify-center gap-4 mt-2">
                        <button onClick={scrollLeft} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><FiChevronLeft size={16}/></button>
                        <button onClick={scrollRight} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><FiChevronRight size={16}/></button>
                    </div>
                </div>

            </div>
        </section>
    );
}
