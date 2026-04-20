"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProductById, saveSalesOrder, getPaymentTypes, initiateSslPayment, getProductReviews } from "../../../lib/api";
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
    CheckCircle2,
    Info,
    FileText,
    BookOpen,
    ExternalLink,
    X
} from "lucide-react";
import toast from "react-hot-toast";
import AddressSelect from "../../../components/Checkout/AddressSelect";
import BookDetailsModal from "../../../components/Share/BookDetailsModal";

const courierOptions = [
    { id: "steadfast", name: "Steadfast", color: "text-[#009b4d]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://cdn.brandfetch.io/idVIARrbJa/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1767913017056", scale: 1 },
    { id: "pathao", name: "Pathao", color: "text-[#ed1c24]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://cdn.brandfetch.io/id7IYUlTKr/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1771516344575", scale: 1 },
    { id: "redx", name: "RedX", color: "text-[#eb2227]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://redx.com.bd/images/new-redx-logo.svg", scale: 1 },
    { id: "gogobangla", name: "Gogo Bangla", color: "text-[#f37021]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://play-lh.googleusercontent.com/zZQ1U5hhpFE69BBlOwztaMjbMze-t0FTWmpwpgFAXQYdQpIFK5_znB7kqEBOUnzFExs", scale: 2.9 },
    { id: "sundarban", name: "সুন্দরবন কুরিয়ার", color: "text-[#f8981d]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", scale: 1 },
    { id: "saparibahan", name: "S.A পরিবহন", color: "text-[#004f9f]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://www.satv.tv/wp-content/uploads/2021/09/SA-Paribahan-1.jpg", scale: 1.6 },
    { id: "postoffice", name: "সরকারি পোস্ট অফিস", color: "text-[#c8102e]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://ecdn.dhakatribune.net/contents/cache/images/1200x630x1xxxxx1/uploads/dten/2020/04/bangladesh-post-office-1587482379713.gif", scale: 1.5 },
    { id: "dhl", name: "DHL (দেশের বাহিরে)", color: "text-[#d40511]", bg: "bg-white", border: "hover:border-brand-green", selectedBorder: "border-brand-green ring-2 ring-brand-green/20", logo: "https://cdn.brandfetch.io/idv0ZbfQqf/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667569261953", scale: 1 },
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
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [isPaymentLoading, setIsPaymentLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [selectedCourier, setSelectedCourier] = useState("steadfast");
    const [isAgreed, setIsAgreed] = useState(false);
    const [reviewSummary, setReviewSummary] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [isLandingLoading, setIsLandingLoading] = useState(false);
    const [activeLandingTab, setActiveLandingTab] = useState('description');
    const [isLookInsideOpen, setIsLookInsideOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isLookInsideOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLookInsideOpen]);

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
                        // Price logic (Matches app/product/[slug]/page.js)
                        const basePrice = Number(p.retails_price || 0);
                        let discountVal = Number(p.discount || 0);
                        let discType = String(p.discount_type || '').toLowerCase();
                        let hasDisc = discountVal > 0 && discType !== '0';

                        // Check for campaigns if no direct discount
                        if (!hasDisc && Array.isArray(p.campaigns)) {
                            const activeCampaign = p.campaigns.find(c => c.status === 'active');
                            if (activeCampaign) {
                                discountVal = Number(activeCampaign.discount || 0);
                                discType = String(activeCampaign.discount_type || '').toLowerCase();
                                hasDisc = discountVal > 0 && discType !== '0';
                            }
                        }

                        const finalPrice = hasDisc
                            ? discType === 'percentage'
                                ? Math.max(0, Math.round(basePrice * (1 - discountVal / 100)))
                                : Math.max(0, basePrice - discountVal)
                            : basePrice;

                        const imageCandidates = [
                            Array.isArray(p.images) ? p.images : [],
                            Array.isArray(p.image_paths) ? p.image_paths : [],
                            Array.isArray(p.imei_image) ? p.imei_image.filter(Boolean) : []
                        ];
                        const bestImages = imageCandidates.reduce((best, curr) => curr.length > best.length ? curr : best, []);
                        const displayImage = (bestImages.length > 0) ? bestImages[0] : (p.image_path || "/no-image.svg");

                        const getSpec = (name) => {
                            const spec = p.specifications?.find(s => s.name.toLowerCase() === name.toLowerCase());
                            return spec ? spec.description : null;
                        };

                        fetchedProducts.push({
                            id: p.id,
                            name: p.name,
                            numericPrice: finalPrice,
                            originalPrice: basePrice,
                            hasDiscount: hasDisc,
                            discountLabel: hasDisc ? (discType === 'percentage' ? `-${discountVal}%` : `৳${discountVal}`) : null,
                            image: displayImage,
                            images: bestImages.length > 0 ? bestImages : (p.image_path ? [p.image_path] : ["/no-image.svg"]),
                            description: p.description,
                            author: getSpec('Author') || p.author?.name || p.author_name || p.brand_name || 'অজানা লেখক',
                            author_image: p.author?.image_path || p.author?.image || null,
                            author_bio: p.author?.description || p.author?.bio || null,
                            author_education: p.author?.education || p.author?.experience || 'লেখক',
                            publisher: getSpec('Publisher') || p.publisher_name || 'তারুণ্য প্রকাশন',
                            isbn: getSpec('ISBN') || p.barcode || p.sku || 'N/A',
                            edition: getSpec('Edition') || 'N/A',
                            pages: getSpec('Number of Pages') || getSpec('Pages') || 'N/A',
                            country: getSpec('Country') || p.country || 'বাংলাদেশ',
                            language: getSpec('Language') || p.language || 'বাংলা',
                            pdfFile: p.pdf_file || null,
                            specifications: p.specifications || []
                        });
                    }
                }
                setProducts(fetchedProducts);

                // If only one product, fetch more details like reviews
                if (fetchedProducts.length === 1) {
                    const pId = fetchedProducts[0].id;
                    try {
                        const reviewRes = await getProductReviews(pId);
                        if (reviewRes?.summary) setReviewSummary(reviewRes.summary);
                        if (reviewRes?.data) {
                            const list = Array.isArray(reviewRes.data?.data) 
                                ? reviewRes.data.data 
                                : (Array.isArray(reviewRes.data) ? reviewRes.data : []);
                            setReviewsData(list);
                        }
                    } catch (err) {
                        console.error("Failed to fetch product reviews", err);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch collection products", err);
                toast.error("বইগুলোর তথ্য লোড করতে সমস্যা হয়েছে।");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCollection();
    }, [params.ids]);

    // Fetch dynamic payment types
    useEffect(() => {
        const fetchPayments = async () => {
            const userId = process.env.NEXT_PUBLIC_USER_ID;
            if (!userId) {
                setIsPaymentLoading(false);
                return;
            }
            try {
                const res = await getPaymentTypes(userId);
                if (res?.data?.data && Array.isArray(res.data.data)) {
                    setPaymentTypes(res.data.data);
                    // Select Cash by default if available
                    const cashMethod = res.data.data.find(p => p.type_name === "Cash");
                    if (cashMethod) setPaymentMethod(cashMethod.id);
                    else if (res.data.data.length > 0) setPaymentMethod(res.data.data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch payment types:", error);
            } finally {
                setIsPaymentLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // 2. Delivery fee calculation
    const calculateDelivery = useCallback(() => {
        if (!selectedDistrict && !selectedCity) {
            setDeliveryFee(0);
            return;
        }
        let fee = 100;
        const district = (selectedDistrict || "").toLowerCase().trim();
        const city = (selectedCity || "").toLowerCase().trim();

        const isSubDhaka = 
            district === "gazipur" || 
            district === "narayanganj" || 
            city.includes("savar") || 
            city.includes("keraniganj") ||
            city.includes("gazipur") ||
            city.includes("narayanganj");

        if (isSubDhaka) {
            fee = 80;
        } else if (district === "dhaka") {
            fee = 60;
        } else {
            fee = 100;
        }
        setDeliveryFee(fee);
    }, [selectedDistrict, selectedCity]);

    useEffect(() => { calculateDelivery(); }, [calculateDelivery]);

    const subTotal = products.reduce((acc, p) => acc + p.numericPrice, 0);
    const grandTotal = subTotal + deliveryFee;

    const deliveryEtaLabel = "সারা বাংলাদেশে: ১-২ দিন";
    const scrollToOrderForm = () => {
        document.getElementById("share-checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const scrollToBooksList = () => {
        document.getElementById("share-books-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const scrollToSingleBook = () => {
        document.getElementById("share-single-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

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

        const selectedPaymentObj = paymentTypes.find(p => p.id === paymentMethod);
        if (!selectedPaymentObj) {
            toast.error("অনুগ্রহ করে একটি পেমেন্ট মেথড সিলেক্ট করুন।");
            setIsSubmitting(false);
            return;
        }

        const payMode = selectedPaymentObj.type_name === "SSL" ? "Online" : "Cash";
        const paymentTypeCategoryId = selectedPaymentObj.payment_type_category?.[0]?.id;

        const orderPayload = {
            pay_mode: payMode,
            paid_amount: payMode === "Online" ? grandTotal : 0,
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
            payment_method: [
                {
                    payment_type_id: selectedPaymentObj.id,
                    payment_type_category_id: paymentTypeCategoryId,
                    payment_amount: grandTotal
                }
            ]
        };

        try {
            const response = await saveSalesOrder(orderPayload);
            if (response.success) {
                const invoiceId = response.data?.invoice_id || response.invoice_id || response.data?.data?.invoice_id || "INV-" + Date.now();

                // If SSL, Initiate SSL Payment
                if (payMode === "Online") {
                    toast.success("অর্ডার সেভ হয়েছে! পেমেন্ট গেটওয়েতে রিডাইরেক্ট করা হচ্ছে...");
                    try {
                        const sslPayload = {
                            user_id: process.env.NEXT_PUBLIC_USER_ID,
                            amount: grandTotal,
                            customer_name: formData.firstName,
                            customer_email: formData.email || "customer@tarunnyoprokashon.com",
                            customer_phone: formData.phone,
                            customer_address: `${formData.address}, ${selectedCity}, ${selectedDistrict}`,
                            customer_city: selectedDistrict || "Dhaka",
                            customer_country: "Bangladesh",
                            product_name: "Books from Tarunya Prokashon",
                            invoice_id: invoiceId,
                            product_category: "Books",
                            payment_method: [
                                {
                                    payment_type_id: selectedPaymentObj.id,
                                    payment_type_category_id: paymentTypeCategoryId,
                                    payment_amount: grandTotal
                                }
                            ]
                        };
                        const sslRes = await initiateSslPayment(sslPayload);
                        if (sslRes?.url) {
                            window.location.href = sslRes.url;
                            return; // Wait for redirect
                        } else {
                            console.error("SSL Response failed:", sslRes);
                            toast.error("পেমেন্ট গেটওয়েতে সমস্যা হয়েছে। অর্ডারটি পেন্ডিং হিসেবে সেভ হয়েছে।");
                        }
                    } catch (sslErr) {
                        console.error("SSL Initiation Error:", sslErr);
                        toast.error("পেমেন্ট গেটওয়েতে সমস্যা হয়েছে। অর্ডারটি পেন্ডিং হিসেবে সেভ হয়েছে।");
                    }
                } else {
                    toast.success("অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!");
                }

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

    const renderMultiProductLayout = () => (
        <>
            {/* Premium Header */}
            <div className="bg-white border-b border-gray-100 pt-10 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="bg-red-50 text-red-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">⚡ আজকের অফার</span>
                                <span className="bg-brand-green/10 text-brand-green text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">🚚 ১-২ দিনে ডেলিভারি</span>
                                <span className="bg-blue-50 text-blue-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">💳 COD Available</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-brand-green/10 text-brand-green text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Shared Collection</span>
                                <div className="h-px w-8 bg-gray-200"></div>
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{products.length} Items</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight max-w-4xl">
                                সেরা দামে <span className="text-brand-green">বিশেষ বই সংগ্রহ</span> এখন একসাথে অর্ডার করুন
                            </h1>
                            <p className="mt-4 text-gray-500 max-w-3xl font-medium leading-relaxed">
                                আপনার জন্য বাছাইকৃত বইগুলো দ্রুত অর্ডার করতে নিচে তালিকা দেখুন, ফর্ম পূরণ করুন, এবং খুব সহজে কনফার্ম করুন।
                            </p>
                            <p className="mt-3 text-xs md:text-sm text-gray-600 font-bold">
                                ৫,০০০+ পাঠকের পছন্দের বইয়ের সংগ্রহ থেকে নির্বাচিত
                            </p>
                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] md:text-xs text-gray-500 font-bold">
                                <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-brand-green" /> ক্যাশ অন ডেলিভারি</span>
                                <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-brand-green" /> নিরাপদ অর্ডার প্রসেস</span>
                                <span className="inline-flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-brand-green" /> দ্রুত শিপিং</span>
                            </div>
                        </div>
                        <div className="md:pb-1 flex flex-col sm:flex-row md:flex-col gap-3">
                            <button
                                type="button"
                                onClick={scrollToBooksList}
                                className="bg-white text-brand-green border border-brand-green/25 text-sm font-black px-5 py-3 rounded-xl hover:bg-brand-green/5 transition-colors shadow-sm"
                            >
                                বইগুলো দেখুন
                            </button>
                            <button
                                type="button"
                                onClick={scrollToOrderForm}
                                className="bg-brand-green text-white text-sm font-black px-5 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20"
                            >
                                এখনই অর্ডার করুন
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
                <div className="flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr] gap-10">

                    {/* Left Column */}
                    <div className="space-y-10 pb-32">
                        {/* 1. Items Grid/List */}
                        <section id="share-books-list" className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-xl shadow-gray-200/40">
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
                        {renderCheckoutForm()}
                    </div>

                    {/* Right Column: Summary Card */}
                    <div className="lg:sticky lg:top-24 self-start">
                        {renderOrderSummary()}
                    </div>

                </div>
            </div>
        </>
    );

    const renderSingleProductLayout = () => {
        const p = products[0];

        const specRows = [
            { label: 'বইয়ের নাম', value: p.name },
            { label: 'লেখক', value: p.author },
            { label: 'প্রকাশক', value: p.publisher },
            { label: 'আইএসবিএন', value: p.isbn },
            { label: 'সংস্করণ', value: p.edition },
            { label: 'পৃষ্ঠা সংখ্যা', value: p.pages },
            { label: 'বাঁধাই', value: p.cover },
            { label: 'দেশ', value: p.country },
            { label: 'ভাষা', value: p.language },
        ].filter(r => r.value && r.value !== 'N/A' && r.value !== 'null');

        return (
            <div className="pb-24">
                {/* Landing-style top header for single product */}
                <div className="bg-white border-b border-gray-100 pt-6 pb-7 mb-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-brand-green/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-gold/5 rounded-full blur-3xl -ml-24 -mb-24"></div>
                    <div className="max-w-5xl mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="bg-red-50 text-red-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">⚡ আজকের অফার</span>
                                    <span className="bg-brand-green/10 text-brand-green text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">🚚 ১-২ দিনে ডেলিভারি</span>
                                    <span className="bg-blue-50 text-blue-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">💳 COD Available</span>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                                    জনপ্রিয় বইটি এখন <span className="text-brand-green">স্পেশাল অফারে</span>
                                </h1>
                                <p className="mt-2.5 text-gray-500 font-medium text-sm md:text-base">
                                    বইটি দেখে নিন, তারপর অর্ডার ফর্ম পূরণ করে সহজে কনফার্ম করুন।
                                </p>
                                <p className="mt-2 text-xs md:text-sm text-gray-600 font-bold">
                                    ৫,০০০+ পাঠকের পছন্দের সংগ্রহ থেকে নির্বাচিত
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5">
                                <button
                                    type="button"
                                    onClick={scrollToSingleBook}
                                    className="bg-white text-brand-green border border-brand-green/25 text-sm font-black px-4 py-2.5 rounded-xl hover:bg-brand-green/5 transition-colors shadow-sm"
                                >
                                    বইটি দেখুন
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollToOrderForm}
                                    className="bg-brand-green text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20"
                                >
                                    অর্ডার ফর্মে যান
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-2 md:px-4 space-y-5 md:space-y-10">
                    {/* Hero Section */}
                    <section id="share-single-hero" className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-lg md:shadow-xl shadow-gray-200/30 overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            {/* Gallery Area */}
                            <div className="md:w-5/12 bg-gray-50/50 p-3 md:p-8 flex items-center justify-center relative">
                                <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10 flex flex-col gap-1.5 md:gap-2">
                                    <span className="bg-brand-green text-white text-[9px] md:text-[10px] font-black px-2.5 md:px-3 py-0.5 md:py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-brand-green/20">In Stock</span>
                                    {p.numericPrice < 500 && <span className="bg-brand-gold text-white text-[9px] md:text-[10px] font-black px-2.5 md:px-3 py-0.5 md:py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-brand-gold/20">Best Seller</span>}
                                </div>
                                <div className="w-full aspect-[3/4] relative rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-700">
                                    <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                                </div>
                            </div>
                            
                            {/* Product Info Area */}
                            <div className="md:w-7/12 p-3 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2.5 md:mb-4">
                                    <span className="text-xs font-black text-brand-green uppercase tracking-widest">{p.author}</span>
                                    <div className="h-px w-8 bg-gray-100"></div>
                                    <div className="flex text-brand-gold">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${reviewSummary && i < Math.round(reviewSummary.average_rating) ? 'fill-brand-gold' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4 md:mb-6">
                                    {p.name}
                                </h1>

                                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8 flex-wrap">
                                    <span className="text-[42px] leading-none md:text-4xl font-black text-gray-900">{formatPrice(p.numericPrice)}</span>
                                    {p.hasDiscount && (
                                        <>
                                            <span className="text-3xl leading-none md:text-xl text-gray-400 line-through font-bold">{formatPrice(p.originalPrice)}</span>
                                            <span className="text-red-500 text-[24px] leading-none md:text-xl font-black">
                                                ({p.discountLabel} ছাড়ে)
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pb-6 md:mb-10 md:pb-10 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Publisher</p>
                                            <p className="text-xs font-bold text-gray-700">{p.publisher}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Language</p>
                                            <p className="text-xs font-bold text-gray-700">{p.language}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Pages</p>
                                            <p className="text-xs font-bold text-gray-700">{p.pages}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <BadgeCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Edition</p>
                                            <p className="text-xs font-bold text-gray-700">{p.edition}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2.5 md:gap-3">
                                    <button 
                                        onClick={() => document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' })}
                                        className="flex-1 bg-brand-green text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        অর্ডার করুন
                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                    </button>
                                    {p.pdfFile && (
                                        <button 
                                            onClick={() => setIsLookInsideOpen(true)}
                                            className="flex-1 bg-white text-gray-700 border-2 border-gray-100 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            <FileText className="w-4 h-4 text-brand-green" />
                                            একটু পড়ে দেখুন
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Modern Tabs Section */}
                    <section className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-lg md:shadow-xl shadow-gray-200/20 overflow-hidden">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-gray-100 bg-gray-50/30 p-1.5 md:p-2 gap-1.5 md:gap-2">
                            {[
                                { id: 'description', label: 'সারসংক্ষেপ', icon: Eye },
                                { id: 'specification', label: 'বইয়ের তথ্য', icon: Info },
                                { id: 'author', label: 'লেখক', icon: User }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveLandingTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-3.5 px-2.5 md:px-4 rounded-xl text-xs md:text-sm font-black transition-all ${
                                        activeLandingTab === tab.id
                                            ? 'bg-white text-brand-green shadow-sm ring-1 ring-gray-100'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                                    }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeLandingTab === tab.id ? 'text-brand-green' : 'text-gray-300'}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-3 md:p-12 min-h-[250px] md:min-h-[300px] animate-in fade-in duration-500">
                            {activeLandingTab === 'description' && (
                                <div className="space-y-4 md:space-y-6">
                                    <h2 className="text-[32px] leading-none md:text-2xl font-black text-gray-900 border-l-4 border-brand-green pl-3 md:pl-4">বইয়ের বিবরণ</h2>
                                    <div 
                                        className="prose prose-brand max-w-none text-gray-600 font-medium leading-[1.8] text-sm md:text-base break-words overflow-hidden" 
                                        dangerouslySetInnerHTML={{ __html: p.description }} 
                                    />
                                </div>
                            )}

                            {activeLandingTab === 'specification' && (
                                <div className="space-y-5 md:space-y-8">
                                    <h2 className="text-[32px] leading-none md:text-2xl font-black text-gray-900 border-l-4 border-brand-green pl-3 md:pl-4">পূর্ণাঙ্গ তথ্যনির্দেশিকা</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                        {specRows.map((row, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-3.5 border-b border-gray-50 group hover:border-brand-green/20 transition-colors">
                                                <span className="text-[13px] font-black text-gray-400 uppercase tracking-tighter">{row.label}</span>
                                                <span className="text-sm font-bold text-gray-900">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeLandingTab === 'author' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-2xl bg-brand-green/5 border border-brand-green/10 flex items-center justify-center text-brand-green shrink-0 overflow-hidden">
                                            {p.author_image ? (
                                                <Image src={p.author_image} alt={p.author} width={96} height={96} className="object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 opacity-30" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 mb-1">{p.author}</h2>
                                            <p className="text-brand-green font-bold text-xs uppercase tracking-widest">{p.author_education}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <div 
                                            className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ 
                                                __html: p.author_bio || "এই লেখকের বিস্তারিত জীবনবৃত্তান্ত এই মুহূর্তে উপলব্ধ নেই। তবে তার প্রতিটি লেখনী পাঠকের হৃদয়ে এক বিশেষ স্থান দখল করে আছে।" 
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Reviews Section */}
                    {reviewsData.length > 0 && (
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-xl shadow-gray-200/20">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    পাঠক রিভিউ ({reviewsData.length})
                                </h2>
                                {reviewSummary && (
                                    <div className="flex items-center gap-2 bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20">
                                        <span className="text-brand-gold font-black">{reviewSummary.average_rating_display}</span>
                                        <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {reviewsData.slice(0, 3).map((r, idx) => (
                                    <div key={r.id || idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 italic relative">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green text-[10px] font-black">
                                                {r.customer_name?.[0] || 'A'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{r.customer_name || 'Anonymous'}</p>
                                                <div className="flex text-brand-gold mt-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-2 h-2 ${i < r.rating ? 'fill-brand-gold' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">"{r.comments}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Form & Summary Combined for Single Product */}
                    <div id="checkout-section" className="pt-4 md:pt-8">
                        <h2 className="text-[34px] leading-none md:text-3xl font-black text-gray-900 mb-6 md:mb-10 text-center">ডেলিভারি ও অর্ডার সম্পন্ন করুন</h2>
                        <div className="space-y-6 md:space-y-10">
                            {renderCheckoutForm()}
                            {renderOrderSummary()}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCheckoutForm = () => (
        <section className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-10 shadow-lg md:shadow-xl shadow-gray-200/40">
            <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-xl md:rounded-2xl bg-brand-gold/10 text-brand-gold">
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

            <form id="share-checkout-form" onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                    <div className="space-y-2.5 md:space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">আপনার নাম</label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-brand-green transition-colors" />
                            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-gray-50 border border-transparent rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-11 md:pl-12 pr-4 md:pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 outline-none transition-all" placeholder="যেমন: মো. রহিম উদ্দিন" />
                        </div>
                    </div>
                    <div className="space-y-2.5 md:space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ফোন নম্বর</label>
                        <div className="relative group/input">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-brand-green transition-colors" />
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-transparent rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-11 md:pl-12 pr-4 md:pr-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 outline-none transition-all" placeholder="১১ ডিজিটের নম্বর" />
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

                <div className="space-y-2.5 md:space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">বিস্তারিত ঠিকানা</label>
                    <textarea required name="address" rows={3} value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-transparent rounded-xl md:rounded-2xl py-3.5 md:py-4 px-4 md:px-6 text-sm font-bold text-gray-900 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 outline-none transition-all resize-none" placeholder="বাসা নং, রোড নং, এলাকা এবং পরিচিত কোনো জায়গা..." />
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-5 md:mt-10">
                <section className="bg-gray-50/50 rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-8 flex flex-col">
                    <h3 className="text-[32px] leading-none md:text-lg font-black text-gray-900 mb-4 md:mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Truck className="w-4 h-4" />
                        </div>
                        কুরিয়ার সার্ভিস
                    </h3>
                    <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3 flex-1">
                        {courierOptions.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedCourier(c.id)}
                                className={`relative flex flex-col items-center justify-center cursor-pointer rounded-xl md:rounded-2xl border-2 p-1.5 md:p-3 transition-all h-[62px] md:h-[75px] overflow-hidden ${selectedCourier === c.id
                                        ? c.selectedBorder + " " + c.bg
                                        : 'border-gray-50 bg-gray-100/50 text-gray-400 hover:border-brand-green/20'
                                    }`}
                            >
                                {c.logo ? (
                                    <div className="relative w-full h-full flex items-center justify-center p-0.5 md:p-1">
                                        <Image
                                            src={c.logo}
                                            alt={c.name}
                                            width={100}
                                            height={35}
                                            style={{ transform: `scale(${c.scale || 1})` }}
                                            className="max-h-full max-w-full object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <span className={`font-black text-[8px] md:text-[11px] ${selectedCourier === c.id ? 'text-brand-green' : 'text-gray-400'} tracking-tight leading-tight`}>
                                        {c.name}
                                    </span>
                                )}
                                {selectedCourier === c.id && (
                                    <div className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-green shadow-sm z-10">
                                        <div className="h-1 w-1 rounded-full bg-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="bg-gray-50/50 rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-8">
                    <h3 className="text-[32px] leading-none md:text-lg font-black text-gray-900 mb-4 md:mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        পেমেন্ট মেথড
                    </h3>
                    <div className="space-y-3">
                        {isPaymentLoading ? (
                            <div className="py-4 flex justify-center items-center">
                                <svg className="animate-spin h-6 w-6 text-brand-green" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                        ) : paymentTypes.length > 0 ? (
                            paymentTypes.map((pt) => {
                                const isCash = pt.type_name === "Cash";
                                return (
                                    <div
                                        key={pt.id}
                                        onClick={() => setPaymentMethod(pt.id)}
                                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${paymentMethod === pt.id ? 'border-brand-green bg-white shadow-lg shadow-brand-green/10 ring-4 ring-brand-green/5' : 'border-gray-100 bg-white/50 hover:border-brand-green/30'
                                            }`}
                                    >
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${paymentMethod === pt.id ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    {isCash ? <Truck className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">
                                                        {isCash ? "ক্যাশ অন ডেলিভারি" : "অনলাইন পেমেন্ট (SSL)"}
                                                    </p>
                                                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isCash ? 'text-brand-green' : 'text-gray-400'}`}>
                                                        {isCash ? "Pay on Receipt" : "Secure Payment"}
                                                    </p>
                                                </div>
                                            </div>
                                            {paymentMethod === pt.id && <CheckCircle2 className="w-5 h-5 text-brand-green" />}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-xs text-gray-500 py-4 text-center">
                                No payment methods available.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </section>
    );

    const renderOrderSummary = () => (
        <section className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-3 md:p-10 shadow-lg md:shadow-2xl shadow-gray-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

            <h2 className="text-[32px] leading-none md:text-2xl font-black text-gray-900 mb-5 md:mb-8 relative z-10">অর্ডার সামারি</h2>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10">
                {/* Left: item + pricing details */}
                <div>
                    {/* Products List (condensed for single product, or regular for multi) */}
                    <div className={`mb-8 space-y-4 ${products.length > 1 ? 'max-h-[300px] overflow-y-auto pr-2' : ''}`}>
                        {products.map((p) => (
                            <div key={p.id} className="flex gap-4 items-center p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                                <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 shadow-sm">
                                    <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xs font-black text-gray-900 leading-tight line-clamp-1">{p.name}</h3>
                                    <p className="text-brand-green font-black text-sm mt-1">{formatPrice(p.numericPrice)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pb-6 lg:pb-0 lg:pt-1">
                        <div className="flex justify-between items-center text-gray-500 font-bold">
                            <span className="text-sm">বইয়ের মোট দাম</span>
                            <span className="text-gray-900 font-black">{formatPrice(subTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500 font-bold">
                            <span className="text-sm">ডেলিভারি চার্জ ({
                                selectedDistrict ? (() => {
                                    const d = selectedDistrict.toLowerCase().trim();
                                    const c = (selectedCity || "").toLowerCase().trim();
                                    if (d === "gazipur" || d === "narayanganj" || c.includes("savar") || c.includes("keraniganj") || c.includes("gazipur") || c.includes("narayanganj")) {
                                        return "সাব-ঢাকা";
                                    }
                                    return d === "dhaka" ? "ঢাকা সিটি" : "ঢাকার বাইরে";
                                })() : "এলাকা নির্বাচন করুন"
                            })</span>
                            {deliveryFee > 0 ? (
                                <span className="text-gray-900 font-black">{formatPrice(deliveryFee)}</span>
                            ) : (
                                <span className="text-brand-gold text-[10px] font-black bg-brand-gold/10 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-brand-gold/20 animate-pulse">জেলা নির্বাচন করুন</span>
                            )}
                        </div>
                        <p className="text-[11px] md:text-xs font-bold text-brand-green bg-brand-green/5 border border-brand-green/15 rounded-lg px-3 py-2">
                            {deliveryEtaLabel}
                        </p>
                    </div>
                </div>

                {/* Right: CTA + agreement */}
                <div className="lg:border-l lg:border-gray-100 lg:pl-8">
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bill</span>
                            <span className="text-3xl md:text-[2rem] font-black text-brand-green tracking-tight">{formatPrice(grandTotal)}</span>
                        </div>
                        <div className="bg-brand-green/10 w-14 h-14 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-7 h-7 text-brand-green" />
                        </div>
                    </div>

                    {/* Agreement Acceptance */}
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-200/50">
                        <input
                            type="checkbox"
                            id="agreement"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="mt-1 h-5 w-5 rounded-md border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer shadow-sm"
                        />
                        <label htmlFor="agreement" className="text-[11px] leading-relaxed text-gray-500 font-medium cursor-pointer select-none">
                            আমি তারুণ্য প্রকাশন-এর {' '}
                            <Link href="/privacy" className="font-bold text-brand-green hover:underline">গোপনীয়তা নীতি</Link>, {' '}
                            <Link href="/terms" className="font-bold text-brand-green hover:underline">শর্তাবলী</Link> {' '}
                            এবং {' '}
                            <Link href="/warranty" className="font-bold text-brand-green hover:underline">রিটার্ণ ও রিফান্ড পলিসি</Link>
                            -তে সম্মতি দিচ্ছি।
                        </label>
                    </div>

                    <button
                        type="submit"
                        form="share-checkout-form"
                        disabled={isSubmitting || !isAgreed}
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-4 rounded-xl shadow-2xl shadow-brand-green/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="text-base md:text-lg">{isSubmitting ? "অর্ডার প্রসেসিং হচ্ছে..." : "অর্ডার কনফার্ম করুন"}</span>
                        {!isSubmitting && <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />}
                    </button>
                    <p className="mt-3 text-[11px] text-gray-500 font-semibold text-center">
                        ক্যাশ অন ডেলিভারি, দ্রুত কনফার্মেশন এবং সাপোর্ট টিম সহায়তা
                    </p>

                </div>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 font-noto-bangla">
            {/* Modals Container */}
            <div className="relative z-[9999]">
                {/* 1. Global Product Details Modal */}
                {selectedProduct && (
                    <BookDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
                )}

                {/* 2. Reading Preview Modal (Look Inside) */}
                {isLookInsideOpen && products.length === 1 && products[0].pdfFile && (
                    <div
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsLookInsideOpen(false); }}
                    >
                        <div
                            className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
                                <h3 className="text-lg font-bold text-gray-800 mx-2 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-brand-green" />
                                    একটু পড়ে দেখুন - {products[0].name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={products[0].pdfFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-green border border-brand-green/20 rounded-lg hover:bg-brand-green hover:text-white transition-all mr-2"
                                    >
                                        <ExternalLink size={16} />
                                        <span className="hidden sm:inline">নতুন ট্যাবে খুলুন</span>
                                    </a>
                                    <button
                                        onClick={() => setIsLookInsideOpen(false)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative bg-gray-100 overflow-hidden">
                                {isMobile ? (
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(products[0].pdfFile)}&embedded=true`}
                                        className="w-full h-full border-none"
                                        title="Product PDF Preview"
                                        style={{ overflow: 'hidden' }}
                                    />
                                ) : (
                                    <iframe
                                        src={`${products[0].pdfFile}#toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-full border-none"
                                        title="Product PDF Preview"
                                        style={{ overflow: 'hidden' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {products.length === 1 ? renderSingleProductLayout() : renderMultiProductLayout()}

            {/* Sticky desktop quick nav CTA (scroll to form only) */}
            {products.length > 0 && (
                <div className="fixed right-6 bottom-6 z-70 hidden lg:block">
                    <button
                        type="button"
                        onClick={scrollToOrderForm}
                        className="bg-brand-green text-white font-black text-sm px-5 py-3.5 rounded-xl shadow-2xl shadow-brand-green/30 hover:bg-brand-green-dark transition-colors"
                    >
                        অর্ডার ফর্মে যান
                    </button>
                </div>
            )}

            {/* Sticky mobile total + CTA */}
            {products.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-80 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                    <div className="max-w-7xl mx-auto flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">মোট মূল্য</p>
                            <p className="text-xl font-black text-brand-green leading-tight">{formatPrice(grandTotal)}</p>
                        </div>
                        <button
                            type="button"
                            onClick={scrollToOrderForm}
                            className="shrink-0 bg-brand-green hover:bg-brand-green-dark text-white font-black text-sm px-5 py-3 rounded-xl transition-colors"
                        >
                            অর্ডার ফর্মে যান
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
