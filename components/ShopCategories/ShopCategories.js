"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiBook, FiBookOpen, FiFeather, FiStar, FiHeart, FiGlobe, FiSun, FiCoffee, FiBox, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';

export default function ShopCategories({ categories = [], flashSaleProducts = [] }) {

    const displayCategories = categories && categories.length > 0
        ? categories.map(cat => ({
            ...cat,
            imageUrl: cat.image_path || cat.image || cat.image_url || null,
            icon: cat.image_path || cat.image || cat.image_url ? null : <FiBox />
        }))
        : [];

    const displayCurated = flashSaleProducts && flashSaleProducts.length > 0 ? flashSaleProducts : [];

    // Separate featured book and rest
    const featuredBook = displayCurated[0];
    const otherBooks = displayCurated.slice(1, 4);

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">

                {/* Categories Grid */}
                <div className="mb-12 md:mb-20">
                    <div className="mb-8 md:mb-10 text-center">
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
                            বিভাগ অনুযায়ী বই
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400">আপনার পছন্দের বিভাগ থেকে বই বেছে নিন</p>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                        {displayCategories.map((cat, idx) => (
                            <Link key={idx} href={`/category/${cat.slug || cat.category_id || cat.id || cat.name}`} className="group flex flex-col items-center p-2 md:p-4 rounded-2xl bg-gray-50 hover:bg-brand-green/5 transition-all duration-300 hover:scale-105">
                                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-white text-brand-green text-xl md:text-3xl shadow-sm group-hover:shadow-md transition-all overflow-hidden relative">
                                    {cat.imageUrl ? (
                                        <Image
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            fill
                                            unoptimized
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        cat.icon
                                    )}
                                </div>
                                <span className="mt-2 md:mt-3 text-[10px] md:text-sm font-bold text-gray-700 group-hover:text-brand-green transition-colors text-center line-clamp-1">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Editor's Pick / Curated Collection Section */}
                <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                        {/* Featured Book Spotlight */}
                        <div className="md:w-[45%] bg-white p-6 md:p-12 flex flex-col md:flex-row gap-6 md:gap-10 items-center border-b md:border-b-0 md:border-r border-gray-100">
                            {featuredBook && (
                                <>
                                    <Link href="#" className="w-[60%] md:w-[45%] flex-shrink-0 relative group">
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow relative bg-white">
                                            <Image
                                                src={featuredBook.imageUrl || "/no-image.svg"}
                                                alt={featuredBook.name}
                                                fill
                                                unoptimized
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {featuredBook.discount && (
                                                <div className="absolute top-2 left-2 bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">{featuredBook.discount}</div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-wider mb-1.5">এই সপ্তাহের বই</span>
                                        <h4 className="text-sm md:text-xl font-black text-gray-900 leading-tight mb-1 md:mb-2 line-clamp-2">
                                            {featuredBook.name}
                                        </h4>
                                        {featuredBook.brand && (
                                            <p className="text-[11px] md:text-sm text-brand-green font-semibold mb-2 md:mb-3">{featuredBook.brand}</p>
                                        )}
                                        <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed mb-3 md:mb-4 hidden sm:block">
                                            হুমায়ূন আহমেদের সেরা উপন্যাসগুলোর এক অসাধারণ সংকলন। পাঠকদের মধ্যে সর্বাধিক জনপ্রিয়।
                                        </p>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-lg md:text-2xl font-black text-brand-green">{featuredBook.price}</span>
                                            {featuredBook.oldPrice && <span className="text-xs text-gray-300 line-through">{featuredBook.oldPrice}</span>}
                                        </div>
                                        <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors w-fit">
                                            বিস্তারিত দেখুন <FiArrowRight size={14} />
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Other Recommended Books — Side Grid */}
                        <div className="md:w-[55%] p-5 md:p-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 h-full">
                                {otherBooks.map((book) => (
                                    <ProductCard key={book.id} product={book} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
