"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProductById, saveSalesOrder } from "../../../lib/api";
import {
    MapPin,
    CreditCard,
    ShoppingBag,
    Shield,
    Truck,
    User,
    Phone,
    ArrowLeft,
    Eye,
    ChevronRight,
    Star,
    BadgeCheck,
    CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import AddressSelect from "../../../components/Checkout/AddressSelect";
import BookDetailsModal from "../../../components/Share/BookDetailsModal";

const courierOptions = [
    { id: "steadfast", name: "Steadfast", color: "text-[#009b4d]", bg: "bg-[#009b4d]/10", border: "hover:border-[#009b4d]", selectedBorder: "border-[#009b4d]" },
    { id: "pathao", name: "Pathao", color: "text-[#ed1c24]", bg: "bg-[#ed1c24]/10", border: "hover:border-[#ed1c24]", selectedBorder: "border-[#ed1c24]" },
    { id: "redx", name: "RedX", color: "text-[#eb2227]", bg: "bg-[#eb2227]/10", border: "hover:border-[#eb2227]", selectedBorder: "border-[#eb2227]" },
    { id: "gogobangla", name: "Gogo Bangla", color: "text-[#f37021]", bg: "bg-[#f37021]/10", border: "hover:border-[#f37021]", selectedBorder: "border-[#f37021]" },
    { id: "sundarban", name: "সুন্দরবন কুরিয়ার", color: "text-[#f8981d]", bg: "bg-[#f8981d]/10", border: "hover:border-[#f8981d]", selectedBorder: "border-[#f8981d]" },
    { id: "saparibahan", name: "S.A পরিবহন", color: "text-[#004f9f]", bg: "bg-[#004f9f]/10", border: "hover:border-[#004f9f]", selectedBorder: "border-[#004f9f]" },
    { id: "postoffice", name: "সরকারি পোস্ট অফিস", color: "text-[#c8102e]", bg: "bg-[#c8102e]/10", border: "hover:border-[#c8102e]", selectedBorder: "border-[#c8102e]" },
];

export default function ShareCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Form States
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        phone: "",
        email: "",
        address: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [selectedCourier, setSelectedCourier] = useState("steadfast");

    const formatPrice = (amount) => `৳${Number(amount).toLocaleString('en-US')}`;

    // 1. Fetch products from IDs
    useEffect(() => {
        const fetchCollection = async () => {
            if (!params.ids) return;
            
            const rawIds = Array.isArray(params.ids) ? params.ids[0] : params.ids;
            const decodedIds = decodeURIComponent(rawIds);
            const ids = decodedIds.split(",");
            
            setIsLoading(true);
            
            try {
                const fetchedProducts = [];
                for (const id of ids) {
                    const trimmedId = id.trim();
                    if (!trimmedId) continue;
                    
                    const res = await getProductById(trimmedId);
                    const p = res?.data || res;
                    
                    if (p && p.id) {
                        // Price logic
                        const originalPrice = Number(p.retails_price || 0);
                        const discountValue = Number(p.discount || 0);
                        const discountType = String(p.discount_type || '').toLowerCase();
                        const hasDiscount = discountValue > 0 && discountType !== '0';
                        const price = hasDiscount
                            ? discountType === 'percentage'
                                ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                                : Math.max(0, originalPrice - discountValue)
                            : originalPrice;

                        fetchedProducts.push({
                            id: p.id,
                            name: p.name,
                            numericPrice: price,
                            image: p.image_path || (p.images && p.images[0]) || "/no-image.svg",
                            description: p.description,
                            author: p.author_name || p.brand_name || p.brand?.name,
                            publisher: p.publisher_name || p.category?.name,
                            isbn: p.barcode || p.sku,
                            edition: p.edition,
                            pages: p.pages,
                            country: p.country,
                            language: p.language
                        });
                    }
                }
                setProducts(fetchedProducts);
            } catch (err) {
                console.error("Failed to fetch collection products", err);
                toast.error("বইগুলোর তথ্য লোড করতে সমস্যা হয়েছে।");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCollection();
    }, [params.ids]);

    // 2. Delivery fee calculation
    const calculateDelivery = useCallback(() => {
        if (!selectedDistrict && !selectedCity) {
            setDeliveryFee(0);
            return;
        }
        let fee = 130;
        if (selectedCity === "Demra" || selectedCity?.includes("Savar") || selectedDistrict === "Gazipur" || selectedCity?.includes("Keraniganj")) {
            fee = 90;
        } else if (selectedDistrict === "Dhaka") {
            fee = 70;
        } else {
            fee = 130;
        }
        setDeliveryFee(fee);
    }, [selectedDistrict, selectedCity]);

    useEffect(() => { calculateDelivery(); }, [calculateDelivery]);

    const subTotal = products.reduce((acc, p) => acc + p.numericPrice, 0);
    const grandTotal = subTotal + deliveryFee;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 3. Submit Order
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDistrict || !selectedCity) {
            toast.error("অনুগ্রহ করে জেলা এবং এলাকা নির্বাচন করুন।");
            return;
        }
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("অনুগ্রহ করে সঠিক ১১ ডিজিটের ফোন নম্বর দিন।");
            return;
        }

        setIsSubmitting(true);
        const orderPayload = {
            pay_mode: paymentMethod,
            paid_amount: 0,
            user_id: process.env.NEXT_PUBLIC_USER_ID,
            sub_total: subTotal,
            vat: 0,
            tax: 0,
            discount: 0,
            product: products.map((p) => ({
                product_id: p.id,
                qty: 1,
                price: p.numericPrice,
                mode: 1,
                size: "Free Size",
                sales_id: process.env.NEXT_PUBLIC_USER_ID,
            })),
            delivery_method_id: 1,
            delivery_info_id: 1,
            delivery_customer_name: formData.firstName,
            delivery_customer_address: `${formData.address}, ${selectedCity}, ${selectedDistrict} [কুরিয়ার: ${courierOptions.find(c => c.id === selectedCourier)?.name}]`,
            delivery_customer_phone: formData.phone,
            delivery_fee: deliveryFee,
            customer_name: formData.firstName,
            customer_phone: formData.phone,
            sales_id: process.env.NEXT_PUBLIC_USER_ID,
            status: 1,
            delivery_city: selectedCity,
            delivery_district: selectedDistrict,
            detailed_address: formData.address,
        };

        try {
            const response = await saveSalesOrder(orderPayload);
            if (response.success) {
                toast.success("অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!");
                const invoiceId = response.data?.invoice_id || response.invoice_id || "INV-" + Date.now();
                router.push(`/order-success?invoice=${invoiceId}`);
            } else {
                toast.error("অর্ডারটি সম্পন্ন করা সম্ভব হয়নি।");
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-green/10 border-t-brand-green rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-500 font-bold animate-pulse">সংগ্রহ লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 font-noto-bangla">
            {/* Modal */}
            {selectedProduct && (
                <BookDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {/* Premium Header */}
            <div className="bg-white border-b border-gray-100 pt-10 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-green transition-all text-sm font-bold mb-8 group">
                        <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        হোম পেজ এ ফিরে যান
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-brand-green/10 text-brand-green text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Shared Collection</span>
                                <div className="h-px w-8 bg-gray-200"></div>
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{products.length} Items</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                                আপনার নতুন <span className="text-brand-green">বই সংগ্রহ</span>
                            </h1>
                            <p className="mt-4 text-gray-500 max-w-2xl font-medium leading-relaxed">
                                আপনার জন্য বিশেষভাবে নির্বাচিত এই বইগুলো নিচে দেয়া হলো। বইয়ের বিস্তারিত দেখতে ছবি বা নামের উপর ক্লিক করুন।
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
                <div className="flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr] gap-10">
                    
                    {/* Left Column */}
                    <div className="space-y-10">
                        {/* 1. Items Grid/List */}
                        <section className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-xl shadow-gray-200/40">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    বইয়ের তালিকা
                                </h2>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">{products.length}টি বই</span>
                            </div>

                            <div className="space-y-4">
                                {products.map((p) => (
                                    <div 
                                        key={p.id} 
                                        onClick={() => setSelectedProduct(p)}
                                        className="group flex gap-5 items-center p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                                    >
                                        <div className="w-20 md:w-24 aspect-[3/4] relative rounded-xl shadow-md overflow-hidden bg-gray-100 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
                                            <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-brand-green uppercase tracking-tighter opacity-70">{p.author}</span>
                                                <Star className="w-2.5 h-2.5 text-brand-gold fill-brand-gold" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-snug line-clamp-1 group-hover:text-brand-green transition-colors">{p.name}</h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <p className="text-brand-green font-black text-lg">{formatPrice(p.numericPrice)}</p>
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">
                                                    <Eye className="w-3 h-3" /> বিস্তারিত
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-brand-green/20 group-hover:text-brand-green transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Customer Form */}
                        <section className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-10 shadow-xl shadow-gray-200/40">
                            <div className="mb-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 flex items-center justify-center rounded-[20px] bg-brand-gold/10 text-brand-gold">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">ডেলিভারি ঠিকানা</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Shipping Details</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-2 text-brand-green bg-brand-green/5 px-4 py-2 rounded-full border border-brand-green/10">
                                    <BadgeCheck className="w-4 h-4" />
                                    <span className="text-xs font-black">নিরাপদ ডেলিভারি নিশ্চিত</span>
                                </div>
                            </div>
                            
                            <form id="share-checkout-form" onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">আপনার নাম</label>
                                        <div className="relative group/input">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-brand-green transition-colors" />
                                            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-gray-50 border border-transparent rounded-[20px] py-4 pl-12 pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 outline-none transition-all" placeholder="যেমন: মো. রহিম উদ্দিন" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ফোন নম্বর</label>
                                        <div className="relative group/input">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-brand-green transition-colors" />
                                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-transparent rounded-[20px] py-4 pl-12 pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 outline-none transition-all" placeholder="১১ ডিজিটের নম্বর" />
                                        </div>
                                    </div>
                                </div>
                                
                                <AddressSelect 
                                    selectedDistrict={selectedDistrict} 
                                    setSelectedDistrict={setSelectedDistrict} 
                                    selectedCity={selectedCity} 
                                    setSelectedCity={setSelectedCity} 
                                    variant="premium"
                                />

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">বিস্তারিত ঠিকানা</label>
                                    <textarea required name="address" rows={3} value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-transparent rounded-[20px] py-4 px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 outline-none transition-all resize-none" placeholder="বাসা নং, রোড নং, এলাকা এবং পরিচিত কোনো জায়গা..." />
                                </div>
                            </form>
                        </section>

                        {/* 3. Courier & Payment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-gray-200/40 flex flex-col">
                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    কুরিয়ার সার্ভিস
                                </h3>
                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    {courierOptions.map((c) => (
                                        <button 
                                            key={c.id} 
                                            onClick={() => setSelectedCourier(c.id)} 
                                            className={`px-3 py-3 rounded-2xl border-2 text-[11px] font-black transition-all flex items-center justify-center text-center leading-tight ${
                                                selectedCourier === c.id 
                                                    ? 'border-brand-green bg-brand-green/5 text-brand-green shadow-sm' 
                                                    : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </section>
                            
                            <section className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-gray-200/40">
                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    পেমেন্ট মেথড
                                </h3>
                                <div className="p-6 rounded-[24px] border-2 border-brand-green bg-brand-green/5 ring-4 ring-brand-green/5 relative overflow-hidden group">
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <p className="font-black text-gray-900 text-lg">ক্যাশ অন ডেলিভারি</p>
                                            <p className="text-[11px] font-bold text-brand-green uppercase tracking-widest mt-1">Pay on Receipt</p>
                                        </div>
                                        <CheckCircle2 className="w-8 h-8 text-brand-green" />
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-brand-green/20 transition-colors"></div>
                                </div>
                                <p className="mt-4 text-[10px] text-gray-400 font-bold text-center uppercase tracking-tighter">বই হাতে পেয়ে মূল্য পরিশোধ করুন</p>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Summary Card */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-2xl shadow-gray-200/60 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                            
                            <h2 className="text-2xl font-black text-gray-900 mb-8 relative z-10">অর্ডার সামারি</h2>
                            
                            <div className="space-y-5 pb-8 border-b border-gray-100 relative z-10">
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span className="text-sm">বইয়ের মোট দাম</span>
                                    <span className="text-gray-900">{formatPrice(subTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span className="text-sm">ডেলিভারি চার্জ</span>
                                    {deliveryFee > 0 ? (
                                        <span className="text-gray-900">{formatPrice(deliveryFee)}</span>
                                    ) : (
                                        <span className="text-brand-gold text-[10px] font-black bg-brand-gold/10 px-2 py-1 rounded-md uppercase">বাকি আছে</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8 mb-10 relative z-10">
                                <div>
                                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bill</span>
                                    <span className="text-3xl font-black text-brand-green">{formatPrice(grandTotal)}</span>
                                </div>
                                <div className="bg-brand-green/10 p-3 rounded-2xl">
                                    <ShoppingBag className="w-8 h-8 text-brand-green" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="share-checkout-form"
                                disabled={isSubmitting}
                                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-5 rounded-[24px] shadow-2xl shadow-brand-green/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="text-lg">{isSubmitting ? "প্রসেসিং হচ্ছে..." : "অর্ডার কনফার্ম করুন"}</span>
                                {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                            </button>

                            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <Shield className="w-5 h-5 text-brand-green opacity-50" />
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-center leading-tight">100% Secure<br/>Checkout</span>
                                </div>
                                <div className="w-px h-8 bg-gray-100"></div>
                                <div className="flex flex-col items-center gap-2">
                                    <Truck className="w-5 h-5 text-brand-green opacity-50" />
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-center leading-tight">Fastest<br/>Delivery</span>
                                </div>
                            </div>
                        </section>

                        {/* Help Section */}
                        <div className="mt-6 px-10 text-center">
                            <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                                কোনো সমস্যা হলে বা আরও জানতে আমাদের সাথে যোগাযোগ করতে পারেন। তারুণ্য প্রকাশন আপনার সেবায় সর্বদা নিয়োজিত।
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
