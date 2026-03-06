import Link from 'next/link';
import ProductCard from '../Shared/ProductCard';

export default function FeaturedProducts({ products = [] }) {
    const defaultProducts = [
        { id: 1, name: "পথের পাঁচালী", brand: "বিভূতিভূষণ বন্দ্যোপাধ্যায়", price: "৳ 380", oldPrice: "৳ 450", discount: "-16%", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
        { id: 2, name: "দেয়াল", brand: "হুমায়ূন আহমেদ", price: "৳ 550", oldPrice: "৳ 650", discount: "-15%", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
        { id: 3, name: "মুক্তিযুদ্ধের ইতিহাস", brand: "বিভিন্ন লেখক", price: "৳ 620", oldPrice: null, discount: null, imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400" },
        { id: 4, name: "রান্নার রেসিপি সমগ্র", brand: "সংকলিত", price: "৳ 280", oldPrice: null, discount: null, imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" },
        { id: 5, name: "অসমাপ্ত আত্মজীবনী", brand: "শেখ মুজিবুর রহমান", price: "৳ 850", oldPrice: "৳ 1,000", discount: "-15%", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400" },
        { id: 6, name: "প্রোগ্রামিং শেখার গাইড", brand: "তামিম শাহরিয়ার", price: "৳ 450", oldPrice: "৳ 520", discount: "-13%", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
        { id: 7, name: "ছোটদের বিজ্ঞান কাহিনী", brand: "মুহম্মদ জাফর ইকবাল", price: "৳ 200", oldPrice: "৳ 250", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=400" },
        { id: 8, name: "গণিতের মজার জগৎ", brand: "ড. মুহম্মদ ইউনূস", price: "৳ 320", oldPrice: "৳ 400", discount: "-20%", imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400" },
    ];

    const displayProducts = products && products.length > 0 ? products : defaultProducts;

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-10 gap-4">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">
                            পাঠকদের পছন্দ
                        </h2>
                        <p className="text-gray-400 text-xs md:text-sm hidden sm:block">সর্বাধিক বিক্রিত ও পাঠকপ্রিয় বই</p>
                    </div>
                    <Link href="#" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {displayProducts.map((product, idx) => (
                        <ProductCard key={product.id || idx} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
