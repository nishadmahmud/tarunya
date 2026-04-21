"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useShareSelection } from '../../context/ShareSelectionContext';
import { useProductRegistry } from '../../context/ProductRegistryContext';
import { Plus, Check } from 'lucide-react';
import { getProductById, getProductReviews } from '../../lib/api';
import { trackSelectItem } from '../../lib/gtm';
import { useEffect } from 'react';

export default function ProductCard({ product, compact = false, onCardClick = null }) {
    const router = useRouter();
    const hasPrefetchedRef = useRef(false);
    const { toggleSelection, isSelected } = useShareSelection();
    const { registerProduct } = useProductRegistry();

    // Register product in the global registry whenever it renders
    useEffect(() => {
        if (product && product.id) {
            registerProduct(product);
        }
    }, [product, registerProduct]);

    const selected = isSelected(product.id);
    const parsedStock = Number(product.current_stock);
    const statusText = String(product.status || "").toLowerCase();
    const isStockOut =
        (!Number.isNaN(parsedStock) && parsedStock <= 0) ||
        statusText.includes("stock out") ||
        statusText.includes("out of stock");

    const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : 'product';
    const slug = product.id ? `${nameSlug}-${product.id}` : nameSlug;
    const detailRoute = product.isEbook ? `/ebook/${slug}` : `/product/${slug}`;

    const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSelection(product.id * 1 || product.id); // Ensure it matches the type
    };

    const handleCardClick = () => {
        trackSelectItem(product);
        if (onCardClick) onCardClick();
    };

    const prefetchProductDetails = () => {
        if (hasPrefetchedRef.current) return;
        hasPrefetchedRef.current = true;

        router.prefetch(detailRoute);

        const numericId = Number(product.id);
        if (!Number.isNaN(numericId) && numericId > 0) {
            Promise.allSettled([
                getProductById(numericId),
                getProductReviews(numericId),
            ]).catch(() => { /* no-op */ });
        }
    };

    return (
        <div className="relative group">
            <Link
                href={detailRoute}
                onClick={handleCardClick}
                onMouseEnter={prefetchProductDetails}
                onTouchStart={prefetchProductDetails}
                onFocus={prefetchProductDetails}
                className={`bg-white flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden relative block border border-gray-100 hover:border-brand-green/20 ${compact ? 'rounded-lg max-w-[170px] w-full mx-auto' : 'rounded-xl'}`}
            >

                {isStockOut && (
                    <div className="absolute top-0 right-0 z-10">
                        <div className="bg-gray-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-bl-xl shadow-md">
                            স্টক আউট
                        </div>
                    </div>
                )}
                {/* Book Cover — Portrait Ratio (3:4) */}
                <div className={`w-full aspect-[3/4] relative bg-brand-cream overflow-hidden ${compact ? 'rounded-t-lg' : 'rounded-t-xl'}`}>
                    <Image
                        src={product.imageUrl || "/no-image.svg"}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes={compact ? "(max-width: 768px) 45vw, 170px" : "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 280px"}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Subtle book shadow overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    {/* Discount: bottom of cover — avoids covering titles usually printed high on the cover */}
                    {product.discount && (
                        <div className={`absolute z-10 ${compact ? 'bottom-1.5 left-1.5' : 'bottom-2 left-2'}`}>
                            <div className={`bg-red-500 text-white font-black shadow-md flex items-center gap-0.5 ${compact ? 'text-[9px] px-1.5 py-0.5 rounded-md' : 'text-[11px] px-2 py-1 rounded-lg'}`}>
                                <span>{product.discount}</span>
                                <span className={`opacity-90 uppercase ${compact ? 'text-[8px]' : 'text-[9px]'}`}>ছাড়</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Book Info */}
                <div className={`flex flex-col text-left flex-1 ${compact ? 'px-2 py-2' : 'px-3 py-3'}`}>
                    {/* Author/Brand if available */}
                    {product.brand && (
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`${compact ? 'text-[9px] md:text-[10px]' : 'text-[10px] md:text-[11px]'} font-semibold text-brand-green truncate`}>
                                {product.brand}
                            </span>
                            {product.pages && product.pages !== 'N/A' && (
                                <span className={`${compact ? 'text-[8px] md:text-[9px]' : 'text-[9px] md:text-[10px]'} text-gray-400 shrink-0`}>
                                    {product.pages} পৃষ্ঠা
                                </span>
                            )}
                        </div>
                    )}

                    <h3 className={`text-gray-800 font-bold leading-snug line-clamp-2 ${compact ? 'text-[10px] md:text-[12px] mb-1.5' : 'text-[11px] md:text-[13px] mb-2'}`}>
                        {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-auto">
                        <span className={`text-brand-green-dark font-extrabold ${compact ? 'text-[12px] md:text-[13px]' : 'text-[13px] md:text-[15px]'}`}>
                            {product.price}
                        </span>
                        {product.oldPrice && (
                            <>
                                <span className={`${compact ? 'text-[8px] md:text-[9px]' : 'text-[9px] md:text-[10px]'} text-gray-400 font-medium line-through`}>
                                    {product.oldPrice}
                                </span>
                                <span className={`${compact ? 'text-[9px] md:text-[10px]' : 'text-[10px] md:text-[11px]'} text-red-500 font-bold`}>
                                    ({product.discount} ছাড়ে)
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {/* Book Selection Button (For Sharing) */}
            <button
                onClick={handleSelect}
                className={`absolute z-20 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${compact ? 'top-2 right-2 w-7 h-7' : 'top-2.5 right-2.5 w-8 h-8'} ${
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
