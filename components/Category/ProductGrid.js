"use client";

import { useState } from 'react';
import { FiGrid, FiList, FiFilter, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';
import CustomDropdown from '../Shared/CustomDropdown';

export default function ProductGrid({
    products,
    onOpenFilter,
    categoryName = "Products",
    brandsList = ["All"],
    activeBrand = "All",
    onSelectBrand
}) {
    const [sortBy, setSortBy] = useState("Default");

    const sortOptions = [
        { label: "Default", value: "Default" },
        { label: "Price: Low to High", value: "Price: Low to High" },
        { label: "Price: High to Low", value: "Price: High to Low" },
        { label: "Newest Arrivals", value: "Newest Arrivals" },
    ];

    return (
        <div>
            {/* Brand Filter Pills */}
            <div className="flex overflow-x-auto gap-2 md:gap-3 pb-4 mb-4 lg:-mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {brandsList.map(brand => (
                    <button
                        key={brand}
                        onClick={() => onSelectBrand && onSelectBrand(brand)}
                        className={`px-4 md:px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${activeBrand === brand
                            ? 'bg-brand-purple text-white border-brand-purple shadow-md shadow-brand-purple/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-purple hover:text-brand-purple'
                            }`}
                    >
                        {brand}
                    </button>
                ))}
            </div>

            {/* Top Bar: Heading, Showing text, Sort, Filter (Mobile) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 capitalize">
                    Products of {categoryName}
                </h2>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="text-xs md:text-sm text-gray-500 font-medium">
                        Showing 1 to {products.length} from {products.length} Products
                    </span>

                    {/* Sort Dropdown */}
                    <div className="w-[140px] md:w-[160px]">
                        <CustomDropdown
                            options={sortOptions}
                            value={sortBy}
                            onChange={setSortBy}
                        />
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={onOpenFilter}
                        className="lg:hidden flex items-center justify-center gap-1.5 bg-brand-purple text-white border-0 py-[9px] px-4 rounded-lg shadow-md shadow-brand-purple/20 hover:bg-[#7b3ba8] shrink-0 text-xs md:text-sm font-bold transition-all"
                    >
                        <FiFilter size={15} />
                        <span>Filter</span>
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
