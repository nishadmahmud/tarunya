import Image from 'next/image';
import Link from 'next/link';

export default function BestDeals({ deals = [] }) {
    const defaultDeals = [
        {
            id: 1,
            title: "সেরা উপন্যাস সংকলন",
            description: "বাংলা সাহিত্যের সেরা উপন্যাসগুলো একসাথে। হুমায়ূন আহমেদ, শরৎচন্দ্র, বিভূতিভূষণের অমর রচনা।",
            price: "৳ 1,200",
            oldPrice: "৳ 1,800",
            savings: "৳ 600 সাশ্রয়",
            imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
            badge: "সেরা অফার",
        },
        {
            id: 2,
            title: "শিশুদের বই প্যাকেজ",
            description: "ছোটদের জন্য মজার গল্প, ছড়া, এবং শিক্ষামূলক বইয়ের সংকলন। উপহার হিসেবেও দারুণ!",
            price: "৳ 650",
            oldPrice: "৳ 900",
            savings: "৳ 250 সাশ্রয়",
            imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800",
            badge: "জনপ্রিয়",
        },
    ];

    const displayDeals = deals && deals.length > 0 ? deals : defaultDeals;

    return (
        <section className="bg-brand-cream/30 py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2 tracking-tight">
                        বিশেষ বই প্যাকেজ
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto">
                        একসাথে কিনলে বেশি সাশ্রয়! জনপ্রিয় বই বান্ডেল অফার।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {displayDeals.map((deal, idx) => (
                        <div key={deal.id || idx} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-row items-stretch border border-gray-100 hover:border-brand-green/20">
                            {/* Book Cover Image */}
                            <div className="w-[38%] md:w-[35%] relative flex-shrink-0 overflow-hidden bg-brand-cream">
                                <Image src={deal.imageUrl} alt={deal.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
                                    <span className="bg-brand-gold text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm">{deal.badge}</span>
                                </div>
                            </div>
                            {/* Deal Info */}
                            <div className="w-[62%] md:w-[65%] p-4 md:p-6 flex flex-col justify-center">
                                <h3 className="text-sm md:text-xl font-black text-gray-900 mb-1 md:mb-2 leading-tight group-hover:text-brand-green transition-colors line-clamp-2">{deal.title}</h3>
                                <p className="text-gray-400 text-[10px] md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">{deal.description}</p>
                                <div className="flex flex-wrap items-baseline gap-2 mb-3">
                                    <span className="text-base md:text-2xl font-black text-brand-green">{deal.price}</span>
                                    {deal.oldPrice && <span className="text-gray-300 text-[11px] md:text-base line-through">{deal.oldPrice}</span>}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {deal.savings && <span className="bg-brand-green-light text-brand-green-dark text-[9px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-brand-green/15">{deal.savings}</span>}
                                    <Link href={`/product/${deal.id || idx}`} className="text-[10px] md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors ml-auto whitespace-nowrap">
                                        এখনই কিনুন →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
