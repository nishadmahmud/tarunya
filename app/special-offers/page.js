import { getCampaigns, isApiConfigured } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiGift, FiTag } from "react-icons/fi";
import ProductCard from "../../components/Shared/ProductCard";
import NewsletterForm from "../../components/Shared/NewsletterForm";

export const metadata = {
    title: "বিশেষ অফার ও ক্যাম্পেইন | তারুণ্য প্রকাশন",
    description: "তারুণ্য প্রকাশনের বিশেষ অফার ও ক্যাম্পেইনগুলো দেখুন এবং সাশ্রয়ী মূল্যে আপনার প্রিয় বইগুলো সংগ্রহ করুন।",
};

export default async function SpecialOffersPage() {
    let campaigns = [];

    const toMoney = (v) => `৳ ${Number(v || 0).toLocaleString("en-IN")}`;
    const normalizeDiscount = (discount, type) => {
        const d = Number(discount || 0);
        if (!d || d <= 0) return null;
        return String(type).toLowerCase() === "percentage"
            ? `-${d}%`
            : `৳ ${d.toLocaleString("en-IN")}`;
    };

    if (isApiConfigured()) {
        try {
            const res = await getCampaigns();
            if (res?.success && res?.campaigns?.data) {
                campaigns = res.campaigns.data.filter(c => c.status === "active");
            }
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
        }
    }

    return (
        <div className="bg-[#fcf8f3] min-h-screen pb-20">
            {/* Minimal Header */}
            <div className="bg-white border-b border-gray-100 py-6 md:py-8 mb-8 md:mb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <nav className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 mb-3 font-medium uppercase tracking-widest">
                        <Link href="/" className="hover:text-brand-green transition-colors">হোম</Link>
                        <FiChevronRight size={10} />
                        <span className="text-brand-green font-bold">বিশেষ অফার</span>
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                বিশেষ <span className="text-brand-green">অফার ও ক্যাম্পেইন</span>
                            </h1>
                            <p className="text-gray-500 text-xs md:text-sm mt-1">
                                সাশ্রয়ী মূল্যে সেরা বইয়ের কালেকশনগুলো দেখুন
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/20">
                                <FiGift className="text-brand-gold" size={16} />
                                <span className="text-xs font-bold text-brand-gold">ধামাকা ডিসকাউন্ট</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {campaigns.length > 0 ? (
                    <div className="space-y-16 md:space-y-24">
                        {campaigns.map((campaign) => {
                            // Extract campaign-level discount info
                            const campaignDiscountValue = Number(campaign.discount || 0);
                            const campaignDiscountType = campaign.discount_type;

                            return (
                                <section key={campaign.id} className="relative">
                                    {/* Campaign Card — Side-by-side layout */}
                                    <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden mb-8 md:mb-12 shadow-lg border border-gray-100 flex flex-col md:flex-row group">
                                        {/* Left: Campaign Info */}
                                        <div className="flex-1 p-6 md:p-10 lg:p-12 flex flex-col justify-center order-2 md:order-1">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] md:text-xs font-black rounded-full mb-4 w-fit uppercase tracking-widest">
                                                <FiTag size={12} />
                                                সচল ক্যাম্পেইন
                                            </div>
                                            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
                                                {campaign.name}
                                            </h2>
                                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                                                {campaign.description}
                                            </p>
                                            {campaignDiscountValue > 0 && (
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-black border border-red-100">
                                                        <FiGift size={14} />
                                                        {String(campaignDiscountType).toLowerCase() === 'percentage'
                                                            ? `${campaignDiscountValue}% ছাড়`
                                                            : `৳${campaignDiscountValue} ছাড়`
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Right: Full Image */}
                                        <div className="w-full md:w-[45%] lg:w-[40%] aspect-[16/9] md:aspect-auto relative shrink-0 order-1 md:order-2">
                                            <Image
                                                src={campaign.bg_image || "/placeholder-banner.jpg"}
                                                alt={campaign.name}
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>

                                    {/* Products Grid */}
                                    {campaign.products && campaign.products.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-4 mb-8">
                                                <h3 className="text-lg md:text-2xl font-black text-gray-900">ক্যাম্পেইন স্পেশাল বইসমূহ</h3>
                                                <div className="flex-1 h-px bg-gray-200"></div>
                                            </div>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                                {campaign.products.map((p) => {
                                                    // Mapping logic consistent with home page and including campaign discount
                                                    // Pivot info if available (contains campaign-specific discount for this product)
                                                    const pivotDiscount = Number(p.pivot?.discount || 0);
                                                    const pivotType = p.pivot?.discount_type;

                                                    // Product's own discount
                                                    const prodDiscount = Number(p.discount || 0);
                                                    const prodType = p.discount_type;

                                                    // Use pivot discount if valid, otherwise fallback to general campaign discount, 
                                                    // but only if product doesn't have its own stronger discount
                                                    const hasProdDiscount = prodDiscount > 0 && String(prodType) !== '0';
                                                    
                                                    const finalDiscountValue = hasProdDiscount ? prodDiscount : (pivotDiscount > 0 ? pivotDiscount : campaignDiscountValue);
                                                    const finalDiscountType = hasProdDiscount ? prodType : (pivotDiscount > 0 ? pivotType : campaignDiscountType);
                                                    
                                                    const hasDiscount = finalDiscountValue > 0 && String(finalDiscountType) !== '0';
                                                    
                                                    const originalPrice = Number(p.retails_price || 0);
                                                    const discountedPrice = hasDiscount
                                                        ? (String(finalDiscountType).toLowerCase() === 'percentage'
                                                            ? Math.max(0, Math.round(originalPrice * (1 - finalDiscountValue / 100)))
                                                            : Math.max(0, originalPrice - finalDiscountValue))
                                                        : originalPrice;

                                                    const mappedProduct = {
                                                        id: p.id,
                                                        name: p.name,
                                                        brand: p.brands?.name || "অন্যান্য",
                                                        price: toMoney(discountedPrice),
                                                        oldPrice: hasDiscount ? toMoney(originalPrice) : null,
                                                        discount: hasDiscount ? normalizeDiscount(finalDiscountValue, finalDiscountType) : null,
                                                        imageUrl: p.image_path || (Array.isArray(p.image_paths) && p.image_paths[0]) || "/no-image.svg",
                                                        pages: p.total_pages || p.pages || null
                                                    };

                                                    return <ProductCard key={p.id} product={mappedProduct} />;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiTag size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">বর্তমানে কোনো সক্রিয় অফার নেই</h2>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
                            খুব শীঘ্রই নতুন ক্যাম্পেইন শুরু হবে। নতুন আপডেট পেতে আমাদের সাথে থাকুন।
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-green-dark transition-all shadow-lg active:scale-95">
                            হোমে ফিরুন <FiChevronRight />
                        </Link>
                    </div>
                )}
            </div>

            {/* Newsletter section remains same but updated to match new style if needed, 
                keeping it for conversion but refining it. */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-32">
                <div className="bg-brand-green-dark rounded-[32px] md:rounded-[48px] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-4">অফার মিস করতে চান না?</h2>
                        <p className="text-brand-cream/70 text-sm md:text-base max-w-md">
                            আপনার ইমেইল দিয়ে সাবস্ক্রাইব করে রাখুন। প্রতিটি নতুন ক্যাম্পেইন শুরু হওয়ার সাথে সাথেই আপনাকে জানিয়ে দেওয়া হবে।
                        </p>
                    </div>
                    <div className="w-full md:w-auto relative z-10">
                        <NewsletterForm />
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20"></div>
                </div>
            </div>
        </div>
    );
}
