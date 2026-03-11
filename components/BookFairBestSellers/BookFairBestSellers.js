import Link from 'next/link';
import ProductCard from '../Shared/ProductCard';

export default function BookFairBestSellers({ products = [] }) {
    const fallbackBooks = [
        { id: 201, name: "একাত্তরের দিনগুলি", brand: "জাহানারা ইমাম", price: "৳ 400", oldPrice: "৳ 500", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
        { id: 202, name: "আমার বন্ধু রাশেদ", brand: "মুহম্মদ জাফর ইকবাল", price: "৳ 250", oldPrice: "৳ 300", discount: "-17%", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
        { id: 203, name: "বঙ্গবন্ধুর আত্মজীবনী", brand: "শেখ মুজিবুর রহমান", price: "৳ 850", oldPrice: null, discount: null, imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400" },
        { id: 204, name: "মিসির আলি সমগ্র", brand: "হুমায়ূন আহমেদ", price: "৳ 1,200", oldPrice: "৳ 1,500", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" },
        { id: 205, name: "লালসালু", brand: "সৈয়দ ওয়ালীউল্লাহ", price: "৳ 280", oldPrice: "৳ 350", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400" },
        { id: 206, name: "কবি", brand: "তারাশঙ্কর বন্দ্যোপাধ্যায়", price: "৳ 320", oldPrice: null, discount: null, imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400" },
        { id: 207, name: "পদ্মা নদীর মাঝি", brand: "মানিক বন্দ্যোপাধ্যায়", price: "৳ 350", oldPrice: "৳ 400", discount: "-13%", imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=400" },
        { id: 208, name: "হাজার বছর ধরে", brand: "জহির রায়হান", price: "৳ 380", oldPrice: "৳ 450", discount: "-16%", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
    ];

    const displayBooks = products.length > 0 ? products : fallbackBooks;

    return (
        <section className="bg-brand-cream/30 py-10 md:py-16 border-b border-gray-100 relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-3 md:px-6 relative z-10">
                <div className="flex items-end justify-between mb-6 md:mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-2">
                            📚 বইমেলা ২০২৬
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            বইমেলা বেস্ট সেলার
                        </h2>
                        <p className="text-gray-400 text-xs md:text-sm hidden sm:block">এবারের বইমেলায় সর্বাধিক বিক্রিত বই সমূহ</p>
                    </div>
                    <Link href="/category/book-fair" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {displayBooks.slice(0, 10).map((book, idx) => (
                        <ProductCard key={book.id || idx} product={book} />
                    ))}
                </div>
            </div>
        </section>
    );
}
