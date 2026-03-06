"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiBook, FiBookOpen, FiFeather, FiStar, FiHeart, FiGlobe, FiSun, FiCoffee, FiBox, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../Shared/ProductCard';

export default function ShopCategories({ categories = [], flashSaleProducts = [] }) {

    const defaultCategories = [
        { name: "উপন্যাস", icon: <FiBook /> },
        { name: "কবিতা", icon: <FiFeather /> },
        { name: "শিশু-কিশোর", icon: <FiStar /> },
        { name: "আত্মউন্নয়ন", icon: <FiSun /> },
        { name: "ধর্মীয় বই", icon: <FiHeart /> },
        { name: "ইতিহাস", icon: <FiGlobe /> },
        { name: "বিজ্ঞান", icon: <FiBookOpen /> },
        { name: "জীবনী", icon: <FiCoffee /> },
    ];

    const displayCategories = categories && categories.length > 0
        ? categories.map(cat => ({ ...cat, icon: <FiBox /> }))
        : defaultCategories;

    const defaultCuratedBooks = [
        { id: 101, name: "হুমায়ূন আহমেদ সংকলন — ১০ খণ্ড", brand: "হুমায়ূন আহমেদ", price: "৳ 2,500", oldPrice: "৳ 3,500", discount: "-29%", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
        { id: 102, name: "শরৎচন্দ্র রচনাসমগ্র", brand: "শরৎচন্দ্র", price: "৳ 1,800", oldPrice: "৳ 2,400", discount: "-25%", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
        { id: 103, name: "বাংলা থ্রিলার সেট", brand: "বিভিন্ন লেখক", price: "৳ 950", oldPrice: "৳ 1,200", discount: "-21%", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400" },
        { id: 104, name: "রবীন্দ্র রচনাবলী", brand: "রবীন্দ্রনাথ ঠাকুর", price: "৳ 3,200", oldPrice: "৳ 4,000", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" },
    ];

    const displayCurated = flashSaleProducts && flashSaleProducts.length > 0 ? flashSaleProducts : defaultCuratedBooks;

    // Separate featured book and rest
    const featuredBook = displayCurated[0];
    const otherBooks = displayCurated.slice(1, 4);

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">

                {/* Section Header */}
                <div className="mb-8 md:mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            বিভাগ অনুযায়ী বই
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400">আপনার পছন্দের বিভাগ থেকে বই বেছে নিন</p>
                    </div>
                    <Link href="/category" className="text-xs md:text-sm font-bold text-brand-green hover:underline">সব দেখুন →</Link>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-14 md:mb-20">
                    {displayCategories.map((cat, idx) => (
                        <Link
                            href={`/category/${cat.slug || encodeURIComponent(cat.name.toLowerCase().replace(/\s+/g, '-'))}`}
                            key={cat.id || idx}
                            className="flex flex-col items-center gap-2.5 md:gap-3 p-3 md:p-4 rounded-xl bg-brand-green-light/40 hover:bg-brand-green-light border border-brand-green/5 hover:border-brand-green/20 transition-all group text-center"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-xl md:text-2xl text-brand-green group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                {cat.image || cat.image_path || cat.image_url ? (
                                    <Image src={cat.image || cat.image_path || cat.image_url} alt={cat.name} width={32} height={32} unoptimized className="object-contain rounded-full" />
                                ) : (
                                    cat.icon
                                )}
                            </div>
                            <span className="text-[10px] md:text-xs font-semibold text-gray-700 leading-tight group-hover:text-brand-green-dark transition-colors">{cat.name}</span>
                        </Link>
                    ))}
                </div>

                {/* ─── সম্পাদকের পছন্দ — Editor's Pick (replaces flash sale) ─── */}
                <div className="rounded-2xl overflow-hidden bg-brand-cream border border-brand-gold/10">
                    {/* Section Title Bar */}
                    <div className="px-5 md:px-8 py-4 md:py-5 flex items-center justify-between border-b border-brand-gold/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-gold/10 rounded-full flex items-center justify-center">
                                <span className="text-lg md:text-xl">✦</span>
                            </div>
                            <div>
                                <h3 className="text-base md:text-xl font-black text-gray-900">সম্পাদকের পছন্দ</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 font-medium">আমাদের বিশেষভাবে বাছাই করা বই</p>
                            </div>
                        </div>
                        <Link href="/special-offers" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors hidden sm:block">
                            সব দেখুন →
                        </Link>
                    </div>

                    {/* Content: Featured Book + Side Books */}
                    <div className="flex flex-col md:flex-row">

                        {/* Featured Book — Large Spotlight */}
                        {featuredBook && (
                            <div className="md:w-[45%] p-5 md:p-8 flex flex-row md:flex-row gap-5 md:gap-6 items-center border-b md:border-b-0 md:border-r border-brand-gold/10 bg-gradient-to-br from-brand-cream to-white">
                                <Link href={`/product/${featuredBook.name?.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')}-${featuredBook.id}`} className="w-[40%] md:w-[45%] flex-shrink-0 relative group">
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
                                    <Link href={`/product/${featuredBook.name?.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')}-${featuredBook.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors w-fit">
                                        বিস্তারিত দেখুন <FiArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Other Recommended Books — Side Grid */}
                        <div className="md:w-[55%] p-5 md:p-8">
                            <div className="grid grid-cols-3 gap-3 md:gap-4 h-full">
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
