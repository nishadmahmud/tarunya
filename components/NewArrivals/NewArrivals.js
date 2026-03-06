"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';

export default function NewArrivals({ products = [] }) {
    const [activeBrand, setActiveBrand] = useState("সকল");
    const sliderRef = useRef(null);

    const defaultProducts = [
        { id: 1, name: "আত্মবিশ্বাসী হওয়ার গল্প", brand: "আত্মউন্নয়ন", price: "৳ 350", oldPrice: "৳ 420", discount: "-17%", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
        { id: 2, name: "বাংলা ব্যাকরণ সমগ্র", brand: "শিক্ষা", price: "৳ 480", oldPrice: "৳ 550", discount: "-13%", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
        { id: 3, name: "রবীন্দ্রনাথের শ্রেষ্ঠ গল্প", brand: "সাহিত্য", price: "৳ 420", oldPrice: null, discount: null, imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400" },
        { id: 4, name: "বিজ্ঞানের সহজ পাঠ", brand: "বিজ্ঞান", price: "৳ 300", oldPrice: "৳ 380", discount: "-21%", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" },
        { id: 5, name: "ছোটদের মজার গল্প", brand: "শিশু-কিশোর", price: "৳ 250", oldPrice: null, discount: null, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
        { id: 6, name: "ইতিহাসের পাতা থেকে", brand: "ইতিহাস", price: "৳ 500", oldPrice: "৳ 600", discount: "-17%", imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400" },
    ];

    const sourceProducts = products && products.length > 0 ? products : defaultProducts;
    const brands = ["সকল", ...new Set(sourceProducts.map(p => p.brand).filter(Boolean))];
    const filteredProducts = activeBrand === "সকল" ? sourceProducts : sourceProducts.filter(p => p.brand === activeBrand);

    const handleBrandChange = (brand) => {
        setActiveBrand(brand);
        if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    };

    const scrollLeft = () => { if (sliderRef.current) sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' }); };
    const scrollRight = () => { if (sliderRef.current) sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' }); };

    return (
        <section className="bg-brand-cream/50 py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                <div className="flex items-end justify-between mb-6 md:mb-8">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            সদ্য প্রকাশিত
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">আমাদের সর্বশেষ সংযোজিত বই</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={scrollLeft} className="w-9 h-9 rounded-full flex items-center justify-center bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-sm">
                            <FiChevronLeft size={18} />
                        </button>
                        <button onClick={scrollRight} className="w-9 h-9 rounded-full flex items-center justify-center bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-sm">
                            <FiChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {brands.map((brand, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleBrandChange(brand)}
                            className={`px-4 py-1.5 rounded-full text-[11px] md:text-xs font-bold whitespace-nowrap transition-all ${activeBrand === brand
                                ? 'bg-brand-green text-white shadow-sm'
                                : 'bg-white text-gray-500 hover:text-brand-green border border-gray-200 hover:border-brand-green/30'
                                }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>

                {/* Book Slider */}
                <div className="overflow-hidden relative">
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                            <div key={product.id || idx} className="w-[42%] sm:w-[30%] md:w-[22%] lg:w-[17%] shrink-0 snap-start">
                                <ProductCard product={product} />
                            </div>
                        )) : (
                            <div className="w-full text-center py-10 text-gray-500 text-sm">এই বিভাগে কোনো বই পাওয়া যায়নি।</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
