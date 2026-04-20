"use client";

import { useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiBookOpen } from "react-icons/fi";
import ProductCard from "../Shared/ProductCard";

export default function EbooksSection({ products = [] }) {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };
    const scrollRight = () => {
        if (sliderRef.current) sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-8">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            ই-বুক
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">
                            যেকোনো ডিভাইসে পড়ুন আমাদের ডিজিটাল বই সংগ্রহ
                        </p>
                    </div>
                    {products.length > 0 && (
                        <div className="hidden md:flex gap-2">
                            <button onClick={scrollLeft} className="w-9 h-9 rounded-full flex items-center justify-center bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-sm">
                                <FiChevronLeft size={18} />
                            </button>
                            <button onClick={scrollRight} className="w-9 h-9 rounded-full flex items-center justify-center bg-brand-green text-white hover:bg-brand-green-dark transition-colors shadow-sm">
                                <FiChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden relative">
                    {products.length > 0 ? (
                        <div
                            ref={sliderRef}
                            className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {products.map((product, idx) => (
                                <div key={product.id || idx} className="w-[42%] sm:w-[30%] md:w-[22%] lg:w-[17%] shrink-0 snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-12 px-6 rounded-3xl bg-brand-cream/30 border-2 border-dashed border-brand-green/10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-brand-green/5 flex items-center justify-center mb-4">
                                <FiBookOpen className="text-brand-green/40" size={30} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-1">এখনো কোনো ই-বুক পাওয়া যায়নি</h3>
                            <p className="text-sm text-gray-400 max-w-xs">
                                খুব শীঘ্রই নতুন ই-বুক এখানে যুক্ত হবে। আমাদের সাথেই থাকুন!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
