import Image from "next/image";
import Link from "next/link";
import { getTopBrands, getBrandwiseProducts } from "../../../lib/api";
import { BookOpen, ArrowLeft, Share2, Building2 } from "lucide-react";
import ProductCard from "../../../components/Shared/ProductCard";

const toSlug = (name) => name ? name.toLowerCase().replace(/\s+/g, '-') : '';

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const urlSlug = decodeURIComponent(resolvedParams.slug || '').toLowerCase();

        const response = await getTopBrands();
        let brand = null;
        if (response?.success && Array.isArray(response?.data)) {
            brand = response.data.find(b =>
                String(b.id) === urlSlug ||
                toSlug(b.name) === urlSlug
            );
        }

        if (!brand) {
            return { title: 'Publisher Not Found - Tarunya Prokashon' }
        }
        return {
            title: `${brand.name} - Tarunya Prokashon`,
            description: `Browse books published by ${brand.name} at Tarunya Prokashon.`,
        };
    } catch (e) {
        return { title: 'Publisher - Tarunya Prokashon' };
    }
}

export default async function PublisherPage({ params }) {
    const resolvedParams = await params;
    const urlSlug = decodeURIComponent(resolvedParams.slug || '').toLowerCase();

    let brand = null;
    let brandProducts = [];
    let loadingError = false;

    try {
        const res = await getTopBrands();
        if (res?.success && Array.isArray(res?.data)) {
            brand = res.data.find(b =>
                String(b.id) === urlSlug ||
                toSlug(b.name) === urlSlug
            );
        }

        if (brand) {
            const productsRes = await getBrandwiseProducts(brand.id);
            if (productsRes?.success && Array.isArray(productsRes?.data?.data)) {
                brandProducts = productsRes.data.data;
            } else if (Array.isArray(productsRes?.data)) {
                brandProducts = productsRes.data;
            }
        } else {
            loadingError = true;
        }
    } catch (e) {
        console.error("Error fetching brand details/products:", e);
        loadingError = true;
    }

    const toMoney = (v) => `৳ ${Number(v || 0).toLocaleString("en-IN")}`;
    const normalizeDiscount = (discount, type) => {
        const d = Number(discount || 0);
        if (!d || d <= 0) return null;
        return String(type).toLowerCase() === "percentage"
            ? `-${d}%`
            : `৳ ${d.toLocaleString("en-IN")}`;
    };

    const mappedProducts = brandProducts.map(p => {
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

        const discountedPrice = hasDiscount
            ? (String(discountType).toLowerCase() === 'percentage'
                ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                : Math.max(0, originalPrice - discountValue))
            : originalPrice;

        return {
            id: p.id,
            name: p.name,
            brand: brand.name,
            price: toMoney(discountedPrice),
            oldPrice: hasDiscount ? toMoney(originalPrice) : null,
            discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
            imageUrl: p.image_path || "/no-image.svg",
            pages: p.pages || 'N/A'
        };
    });

    if (loadingError || !brand) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-red-50 flex items-center justify-center border-4 border-white shadow-xl">
                    <Building2 className="w-10 h-10 text-red-300" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">প্রকাশনী খুঁজে পাওয়া যায়নি</h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    দুঃখিত, আপনি যে প্রকাশনীর পাতা খুঁজছেন তা সার্ভারে পাওয়া যায়নি।
                </p>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green-dark transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    হোমপেজে ফিরে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header / Cover Area */}
            <div className="relative h-40 md:h-60 bg-gradient-to-r from-brand-green/80 to-emerald-800 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>

                {/* Back button */}
                <div className="absolute top-6 left-6 z-10">
                    <Link
                        href="/"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-brand-green transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Brand Logo & Info */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start relative -mt-16 lg:-mt-24 z-10">
                        {/* Avatar / Logo */}
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl border-6 border-[#FDFBF7] bg-white shadow-2xl overflow-hidden relative mb-6">
                            {brand.image_path ? (
                                <Image
                                    src={brand.image_path}
                                    alt={brand.name}
                                    fill
                                    unoptimized
                                    className="object-contain p-4"
                                    sizes="(max-width: 768px) 128px, 192px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <Building2 className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Title Section */}
                        <div className="text-center lg:text-left w-full mb-8">
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">{brand.name}</h1>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-brand-green font-bold text-xs">
                                <Building2 className="w-3 h-3" />
                                প্রকাশনী
                            </div>
                        </div>

                        {/* Action Box */}
                        <div className="w-full bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-green text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
                                    অনুসরণ করুন
                                </button>
                                <button className="w-12 flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-brand-green transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Products List */}
                    <div className="lg:col-span-8 pt-8 lg:pt-10">
                        <div className="mb-10 pb-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl lg:text-2xl font-black text-gray-900">
                                {brand.name}-এর বইসমূহ
                            </h2>
                            <div className="text-sm font-bold text-gray-400">
                                {mappedProducts.length}টি বই পাওয়া গেছে
                            </div>
                        </div>

                        {mappedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {mappedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 text-center">
                                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">এই প্রকাশনীর কোনো বই পাওয়া যায়নি।</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
