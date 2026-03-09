"use client";

import { useState } from 'react';
import { FiGrid, FiList, FiFilter, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';
import CustomDropdown from '../Shared/CustomDropdown';

export default function ProductGrid({
    products,
    onOpenFilter,
    categoryName = "বইসমূহ",
    brandsList = ["All"],
    activeBrand = "All",
    onSelectBrand
}) {
    const [sortBy, setSortBy] = useState("ডিফল্ট");

    const sortOptions = [
        { label: "ডিফল্ট", value: "ডিফল্ট" },
        { label: "মূল্য: কম থেকে বেশি", value: "মূল্য: কম থেকে বেশি" },
        { label: "মূল্য: বেশি থেকে কম", value: "মূল্য: বেশি থেকে কম" },
        { label: "নতুন সংগ্রহ", value: "নতুন সংগ্রহ" },
    ];

    return (
        <div>
            {/* Brand/Author Filter Pills */}
            <div className="flex overflow-x-auto gap-2 md:gap-3 pb-4 mb-4 lg:-mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {brandsList.map(brand => (
                    <button
                        key={brand}
                        onClick={() => onSelectBrand && onSelectBrand(brand)}
                        className={`px-4 md:px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${activeBrand === brand
                            ? 'bg-brand-green text-white border-brand-green shadow-md shadow-brand-green/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-green hover:text-brand-green'
                            }`}
                    >
                        {brand === 'All' ? 'সকল' : brand}
                    </button>
                ))}
            </div>

            {/* Top Bar: Heading, Showing text, Sort, Filter (Mobile) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 capitalize">
                    {categoryName} এর বইসমূহ
                </h2>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">
                        সর্বমোট {products.length} টি বই দেখানো হচ্ছে
                    </span>

                    {/* Sort Dropdown */}
                    <div className="w-[150px] md:w-[170px]">
                        <CustomDropdown
                            options={sortOptions}
                            value={sortBy}
                            onChange={setSortBy}
                        />
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={onOpenFilter}
                        className="lg:hidden flex items-center justify-center gap-1.5 bg-brand-green text-white border-0 py-[9px] px-4 rounded-lg shadow-md shadow-brand-green/20 hover:bg-brand-green-dark shrink-0 text-xs md:text-sm font-bold transition-all"
                    >
                        <FiFilter size={15} />
                        <span>ফিল্টার</span>
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

        </div>
    );
}
