import { getSpecialOffers, isApiConfigured } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiGift, FiTag, FiInfo } from "react-icons/fi";


export const metadata = {
    title: "বিশেষ অফার ও প্যাকেজ | তারুণ্য প্রকাশন",
    description: "সাশ্রয়ী মূল্যে সেরা বইয়ের কালেকশন এবং আকর্ষণীয় কম্বো অফারগুলো দেখুন এখানে।",
};

export default async function SpecialOffersPage() {
    let offers = [];

    if (isApiConfigured()) {
        try {
            const res = await getSpecialOffers();
            if (res?.success && Array.isArray(res?.data)) {
                offers = res.data;
            }
        } catch (error) {
            console.error("Failed to fetch special offers:", error);
        }
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero / Header Section */}
            <div className="bg-brand-cream/30 py-10 md:py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <nav className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                            <Link href="/" className="hover:text-brand-green transition-colors">হোম</Link>
                            <FiChevronRight size={12} />
                            <span className="text-brand-green font-bold">বিশেষ অফার</span>
                        </nav>

                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-brand-gold/20">
                                ধামাকা অফার
                            </span>
                            <span className="bg-brand-green-light text-brand-green text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-brand-green/20">
                                সীমিত সময়ের জন্য
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                            আপনার পছন্দের বই <br className="hidden md:block" />
                            কিনুন <span className="text-brand-green">বিশেষ অফারে</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
                            সেরা সব বইয়ের কালেকশন এখন পাচ্ছেন আপনার বাজেটের মধ্যেই। আমাদের বিশেষ কম্বো প্যাক এবং ডিসকাউন্ট অফারগুলো দেখুন।
                        </p>
                    </div>

                    {/* Concise Premium Graphic */}
                    <div className="hidden md:flex relative w-40 h-40 flex-shrink-0 items-center justify-center">
                        <div className="absolute inset-0 bg-brand-green rounded-full animate-pulse opacity-5"></div>
                        <div className="relative w-28 h-28 bg-white border border-gray-100 shadow-xl rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-500 hover:border-brand-green/30">
                            <FiGift className="text-brand-green w-12 h-12" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        {offers.map((offer) => (
                            <div
                                key={offer.id}
                                className="group relative bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row"
                            >
                                {/* Visual Side */}
                                <div className="md:w-5/12 relative min-h-[250px] overflow-hidden bg-gray-50 border-r border-gray-100">
                                    <Image
                                        src={offer.image}
                                        alt={offer.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border border-gray-100">
                                            <FiTag className="text-brand-gold w-3 h-3" />
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">চলমান অফার</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center">
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-brand-green transition-colors">
                                        {offer.title}
                                    </h2>
                                    <div className="h-1.5 w-12 bg-gradient-to-r from-brand-green to-brand-gold rounded-full mb-6"></div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {offer.description}
                                    </p>

                                    <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                        <Link href={offer.link || '#'} className="flex-1 py-3.5 bg-brand-green text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark hover:shadow-brand-green/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                                            অফারটি নিন <FiGift size={16} />
                                        </Link>
                                        <button className="flex-1 py-3.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-green/30">
                                            বিস্তারিত <FiInfo size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 md:py-32 bg-gray-50 rounded-[40px] md:rounded-[60px] border-2 border-dashed border-gray-200 mx-4">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <FiTag size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">বর্তমানে কোনো অফার নেই</h2>
                        <p className="text-gray-500 max-w-md mx-auto text-base md:text-lg px-4">
                            আমরা খুব শীঘ্রই নতুন এবং আকর্ষণীয় সব অফার নিয়ে আসছি। আমাদের সাথেই থাকুন!
                        </p>
                        <Link href="/" className="mt-10 inline-flex items-center gap-3 bg-brand-green text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg overflow-hidden relative group">
                            <span className="relative z-10 flex items-center gap-2">হোমে ফিরুন <FiChevronRight /></span>
                            <div className="absolute inset-0 bg-brand-green-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                    </div>
                )}
            </div>

            {/* Newsletter / CTA */}
            <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-32">
                <div className="bg-brand-green rounded-[40px] md:rounded-[60px] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10 shadow-3xl">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">নতুন অফারের আপডেট <br /> পেতে চান?</h2>
                        <p className="text-white/70 text-base md:text-lg max-w-xl">
                            আমাদের নিউজলেটারে সাবস্ক্রাইব করুন এবং বইমেলা, বিশেষ উৎসব ও নতুন বইয়ের অফার সবার আগে জানুন।
                        </p>
                    </div>
                    <div className="w-full md:w-auto relative z-10">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="আপনার ইমেইল দিন"
                                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 min-w-full md:min-w-[350px] backdrop-blur-sm"
                            />
                            <button className="px-8 py-4 bg-brand-gold text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-brand-green transition-all shadow-lg active:scale-95 whitespace-nowrap">
                                সাবস্ক্রাইব
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
