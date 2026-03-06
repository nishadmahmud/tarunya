import { getSpecialOffers } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiGift, FiTag, FiInfo } from "react-icons/fi";

export const metadata = {
    title: "Special Offers | Exclusive Deals & Combo Offers",
    description: "Discover the best deals, limited-time promotions, and exclusive combo offers at our store.",
};

export default async function SpecialOffersPage() {
    let offers = [];

    try {
        const res = await getSpecialOffers();
        if (res?.success && Array.isArray(res?.data)) {
            offers = res.data;
        }
    } catch (error) {
        console.error("Failed to fetch special offers:", error);
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero / Header Section */}
            <div className="bg-gray-50 py-10 md:py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                            <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
                            <FiChevronRight size={12} />
                            <span className="text-brand-purple font-bold">Special Offers</span>
                        </nav>

                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-[#ff2a3b]/10 text-[#ff2a3b] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#ff2a3b]/20">
                                HOT Deals
                            </span>
                            <span className="bg-brand-purple/10 text-brand-purple text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-brand-purple/20">
                                Limited Time
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                            Unbeatable <span className="text-brand-purple">Offers</span> & Combos
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-xl">
                            Save big on your favorite tech with our exclusive promotions. Find everything you need at a fraction of the cost.
                        </p>
                    </div>

                    {/* Concise Premium Graphic */}
                    <div className="hidden md:flex relative w-32 h-32 flex-shrink-0 items-center justify-center">
                        <div className="absolute inset-0 bg-brand-purple rounded-full animate-pulse opacity-10"></div>
                        <div className="relative w-20 h-20 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-500 hover:border-brand-purple/30">
                            <FiGift className="text-brand-purple w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {offers.map((offer) => (
                            <div
                                key={offer.id}
                                className="group relative bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row"
                            >
                                {/* Visual Side */}
                                <div className="md:w-2/5 relative min-h-[250px] overflow-hidden bg-gray-50 border-r border-gray-100">
                                    <Image
                                        src={offer.image}
                                        alt={offer.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border border-gray-100">
                                            <FiTag className="text-[#ff2a3b] w-3 h-3" />
                                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Active Offer</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-tight group-hover:text-brand-purple transition-colors">
                                        {offer.title}
                                    </h2>
                                    <div className="h-1 w-12 bg-gradient-to-r from-brand-purple to-[#ff2a3b] rounded-full mb-4"></div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {offer.description}
                                    </p>

                                    <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                        <button className="flex-1 py-3 bg-brand-purple text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-purple/20 hover:bg-[#ff2a3b] hover:shadow-[#ff2a3b]/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                                            Claim Offer <FiGift size={16} />
                                        </button>
                                        <button className="flex-1 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-purple/30">
                                            Details <FiInfo size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[60px] border-2 border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <FiTag size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">No active offers right now</h2>
                        <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
                            We're currently preparing some amazing deals for you. Check back soon or subscribe to our newsletter for instant updates!
                        </p>
                        <Link href="/" className="mt-10 inline-flex items-center gap-3 bg-brand-purple text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">
                            Return Home <FiChevronRight />
                        </Link>
                    </div>
                )}
            </div>

            {/* Newsletter / CTA */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="bg-brand-purple rounded-[60px] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Don't miss the next big thing.</h2>
                        <p className="text-white/70 text-lg md:text-xl max-w-xl">
                            Be the first to know about our upcoming sales, exclusive drops, and limited edition combo offers.
                        </p>
                    </div>
                    <div className="w-full md:w-auto relative z-10">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[300px]"
                            />
                            <button className="px-8 py-4 bg-white text-brand-purple rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
