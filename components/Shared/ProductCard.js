"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useShareSelection } from '../../context/ShareSelectionContext';
import { Plus, Check } from 'lucide-react';

export default function ProductCard({ product }) {
    const { toggleSelection, isSelected } = useShareSelection();
    const selected = isSelected(product.id);

    const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : 'product';
    const slug = product.id ? `${nameSlug}-${product.id}` : nameSlug;

    const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSelection(product.id * 1 || product.id); // Ensure it matches the type
    };

    return (
        <div className="relative group">
            <Link href={`/product/${slug}`} className="bg-white rounded-xl flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden relative block border border-gray-100 hover:border-brand-green/20">

                {/* Discount Badge */}
                {product.discount && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="bg-brand-gold text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                            {product.discount}
                        </span>
                    </div>
                )}

                {/* Book Cover — Portrait Ratio (3:4) */}
                <div className="w-full aspect-[3/4] relative bg-brand-cream rounded-t-xl overflow-hidden">
                    <Image
                        src={product.imageUrl || "/no-image.svg"}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Subtle book shadow overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                {/* Book Info */}
                <div className="flex flex-col text-left px-3 py-3 flex-1">
                    {/* Author/Brand if available */}
                    {product.brand && (
                        <span className="text-[10px] md:text-[11px] font-semibold text-brand-green mb-1 truncate">
                            {product.brand}
                        </span>
                    )}
                    <h3 className="text-gray-800 font-bold text-[12px] md:text-[14px] leading-snug line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-auto">
                        <span className="text-brand-green-dark font-extrabold text-[14px] md:text-[16px]">
                            {product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-gray-400 text-[10px] md:text-[11px] font-medium line-through">
                                {product.oldPrice}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Book Selection Button (For Sharing) */}
            <button
                onClick={handleSelect}
                className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
                    selected 
                        ? 'bg-brand-green text-white rotate-0' 
                        : 'bg-white/90 text-gray-400 hover:text-brand-green hover:bg-white md:opacity-0 md:group-hover:opacity-100'
                }`}
                title={selected ? "সিলেকশন থেকে বাদ দিন" : "শেয়ার করার জন্য সিলেক্ট করুন"}
            >
                {selected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
        </div>
    );
}
