"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { saveSalesOrder, getCouponList, applyCoupon, getPaymentTypes, initiateSslPayment } from "../../lib/api";
import { trackBeginCheckout, trackAddPaymentInfo, trackAddShippingInfo } from "../../lib/gtm";
import {
    MapPin,
    CreditCard,
    ShoppingBag,
    Shield,
    Truck,
    User,
    Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import AddressSelect from "../../components/Checkout/AddressSelect";

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

export default function CheckoutPage() {
    const { cartItems, getSubtotal, deliveryFee, updateDeliveryFee, clearCart } =
        useCart();

    const router = useRouter();
    const subTotal = getSubtotal();

    // Format price helper function
    const formatPrice = (amount) => {
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    // District & City state
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [isAgreed, setIsAgreed] = useState(false);

    const formRef = useRef(null);

    // Load saved details on mount
    useEffect(() => {
        const savedDetails = localStorage.getItem("Tarunya ProkashonCheckoutDetails");
        if (savedDetails) {
            try {
                const parsed = JSON.parse(savedDetails);
                setFormData(prev => ({
                    ...prev,
                    firstName: parsed.firstName || prev.firstName,
                    phone: parsed.phone || prev.phone,
                    email: parsed.email || prev.email,
                    address: parsed.address || prev.address,
                }));
                if (parsed.district) setSelectedDistrict(parsed.district);
                if (parsed.city) setSelectedCity(parsed.city);
            } catch (e) {
                console.error("Failed to parse saved checkout details", e);
            }
        }
    }, []);

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

    // GA4: track begin_checkout when page loads with items
    useEffect(() => {
        if (cartItems.length > 0) {
            trackBeginCheckout(cartItems, subTotal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update delivery fee based on selection
    const updateDeliveryFeeCallback = useCallback(() => {
        if (!selectedDistrict && !selectedCity) {
            updateDeliveryFee(0);
            return;
        }

        let fee = 100; // Default: Outside Dhaka
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
        updateDeliveryFee(fee);
    }, [selectedDistrict, selectedCity, updateDeliveryFee]);

    useEffect(() => {
        updateDeliveryFeeCallback();
    }, [updateDeliveryFeeCallback]);

    // GA4: track add_shipping_info when courier changes
    useEffect(() => {
        if (selectedCourier && cartItems.length > 0) {
            const courierName = courierOptions.find(c => c.id === selectedCourier)?.name || selectedCourier;
            trackAddShippingInfo(cartItems, subTotal, courierName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourier]);

    // GA4: track add_payment_info when payment method changes
    useEffect(() => {
        if (paymentMethod && cartItems.length > 0) {
            const selectedPaymentObj = paymentTypes.find(p => p.id === paymentMethod);
            const paymentName = selectedPaymentObj?.type_name || 'Unknown';
            trackAddPaymentInfo(cartItems, subTotal, paymentName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod]);

    const grandTotal = subTotal + deliveryFee - couponDiscount;

    // Coupon handling
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const response = await getCouponList();

            if (response.success && response.data) {
                const matchingCoupon = response.data.find(
                    coupon => coupon.coupon_code.toUpperCase() === couponCode.trim().toUpperCase()
                );

                if (matchingCoupon) {
                    const now = new Date();
                    const expireDate = new Date(matchingCoupon.expire_date);

                    if (expireDate < now) {
                        setCouponError("This coupon has expired");
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const minOrderAmount = parseFloat(matchingCoupon.minimum_order_amount) || 0;
                    if (minOrderAmount > 0 && subTotal < minOrderAmount) {
                        setCouponError(`Minimum order amount is ${formatPrice(minOrderAmount)}`);
                        setCouponDiscount(0);
                        setAppliedCoupon(null);
                        return;
                    }

                    const couponAmount = parseFloat(matchingCoupon.amount) || 0;
                    const amountLimit = parseFloat(matchingCoupon.amount_limit) || 0;
                    let discount = 0;

                    if (matchingCoupon.coupon_amount_type === "percentage") {
                        discount = Math.round(subTotal * (couponAmount / 100));
                    } else {
                        discount = couponAmount;
                    }

                    if (amountLimit > 0 && discount > amountLimit) {
                        discount = amountLimit;
                    }

                    discount = Math.min(discount, subTotal);

                    setCouponDiscount(discount);
                    setAppliedCoupon(matchingCoupon);
                    toast.success(`Coupon applied! You saved ${formatPrice(discount)}`);
                } else {
                    setCouponError("Invalid coupon code");
                    setCouponDiscount(0);
                    setAppliedCoupon(null);
                }
            } else {
                setCouponError("Unable to validate coupon");
                setCouponDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError("Failed to apply coupon");
            setCouponDiscount(0);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDistrict || !selectedCity) {
            toast.error("Please select both District and Area");
            return;
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 11-digit Bangladeshi phone number");
            return;
        }

        setIsSubmitting(true);

        // Save details to localStorage
        try {
            const detailsToSave = {
                firstName: formData.firstName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                district: selectedDistrict,
                city: selectedCity
            };
            localStorage.setItem("Tarunya ProkashonCheckoutDetails", JSON.stringify(detailsToSave));
        } catch (error) {
            console.error("Failed to save checkout details to local storage", error);
        }

        const selectedPaymentObj = paymentTypes.find(p => p.id === paymentMethod);
        if (!selectedPaymentObj) {
            toast.error("Please select a valid payment method");
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
            discount: couponDiscount,
            product: cartItems.map((item) => ({
                product_id: item.id,
                qty: item.quantity,
                price: item.numericPrice,
                mode: 1,
                size: item.variants?.storage || "Free Size",
                sales_id: process.env.NEXT_PUBLIC_USER_ID,
            })),
            delivery_method_id: 1,
            delivery_info_id: 1,
            delivery_customer_name: formData.firstName,
            delivery_customer_address: `${formData.address}, ${selectedCity}, ${selectedDistrict} [কুরিয়ার: ${courierOptions.find(c => c.id === selectedCourier)?.name}]`,
            delivery_customer_phone: formData.phone,
            delivery_fee: deliveryFee,
            variants: [],
            imeis: [null],
            created_at: new Date().toISOString(),
            customer_name: formData.firstName,
            customer_phone: formData.phone,
            sales_id: process.env.NEXT_PUBLIC_USER_ID,
            wholeseller_id: 1,
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
            if (appliedCoupon && couponCode) {
                try {
                    await applyCoupon(couponCode);
                } catch (couponError) {
                    console.warn("Error tracking coupon usage:", couponError);
                }
            }

            const response = await saveSalesOrder(orderPayload);

            if (response.success) {
                clearCart();
                const invoiceId = response.data?.invoice_id || response.invoice_id || response.data?.data?.invoice_id || "INV-" + Date.now();

                // If SSL, Initiate SSL Payment
                if (payMode === "Online") {
                    toast.success("Order saved! Redirecting to payment gateway...");
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
                            toast.error("Failed to initiate gateway. Your order is saved as pending.");
                        }
                    } catch (sslErr) {
                        console.error("SSL Initiation Error:", sslErr);
                        toast.error("Payment gateway error. Your order is saved as pending.");
                    }
                } else {
                    toast.success("Order placed successfully!");
                }
                // GA4: fire purchase event with customer data before navigating
                const itemsForTracking = cartItems.map(i => ({
                    id: i.id,
                    name: i.name,
                    numericPrice: i.numericPrice,
                    quantity: i.quantity,
                    categoryName: i.category?.name || i.categoryName || '',
                    brand: i.brand || i.publisher || 'তারুণ্য প্রকাশন',
                    variantKey: i.variantKey || '',
                    variants: i.variants || null
                }));

                router.push(`/order-success?invoice=${invoiceId}&total=${grandTotal}&shipping=${deliveryFee}&discount=${couponDiscount}&coupon=${couponCode || ''}&cname=${encodeURIComponent(formData.firstName)}&cphone=${encodeURIComponent(formData.phone)}&cemail=${encodeURIComponent(formData.email || '')}&caddress=${encodeURIComponent(formData.address)}&cdistrict=${encodeURIComponent(selectedDistrict || '')}&ccity=${encodeURIComponent(selectedCity || '')}&items=${encodeURIComponent(JSON.stringify(itemsForTracking))}`);
            } else {
                toast.error("Failed to place order. Please try again.");
                console.error("Order failed:", response);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50">
                <div className="text-center px-4">
                    <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-12 w-12 text-brand-green/40" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                        আপনার কার্টটি খালি
                    </h2>
                    <p className="mt-2 text-gray-500 max-w-xs mx-auto">
                        চেকআউট করার আগে কার্টে কিছু বই যোগ করুন।
                    </p>
                    <Link
                        href="/" className="mt-6 inline-block rounded-xl bg-brand-green px-8 py-3.5 text-white font-bold hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20"
                    >
                        কেনাকাটা চালিয়ে যান
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-0 lg:pt-8 pb-[120px] md:pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="mb-6 md:mb-8 pt-6 md:pt-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">চেকআউট</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            ডেলিভারি এবং পেমেন্ট সংক্রান্ত তথ্য দিয়ে আপনার অর্ডারটি সম্পন্ন করুন।
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 lg:gap-8 lg:grid lg:grid-cols-[1.5fr_1fr]">

                        {/* ═══ Left Column: Forms ═══ */}
                        <div className="space-y-6">

                            {/* ── Delivery Information ── */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            ডেলিভারি ঠিকানা
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            আপনার অর্ডারটি কোথায় পাঠাবো?
                                        </p>
                                    </div>
                                </div>

                                <form
                                    id="checkout-form"
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                পুরো নাম
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    required
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                                                    placeholder="আপনার পুরো নাম"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                ফোন নম্বর <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                                                    placeholder="01XXXXXXXXX"
                                                />
                                            </div>
                                            {formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone) && (
                                                <p className="text-xs text-red-500">
                                                    Invalid phone number format.
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Format: 01XXXXXXXXX (11 digits)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email (Optional) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            ইমেইল <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Select (District -> Area) */}
                                    <div className="space-y-2">
                                        <AddressSelect
                                            selectedDistrict={selectedDistrict}
                                            setSelectedDistrict={setSelectedDistrict}
                                            selectedCity={selectedCity}
                                            setSelectedCity={setSelectedCity}
                                        />
                                    </div>

                                    {/* Detailed Address */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            বিস্তারিত ঠিকানা
                                        </label>
                                        <textarea
                                            required
                                            name="address"
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green resize-none"
                                            placeholder="রাস্তার নাম, বাড়ির নম্বর, নিকটস্থ ল্যান্ডমার্ক..."
                                        />
                                    </div>
                                </form>
                            </section>

                            {/* ── Payment Method ── */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            পেমেন্ট পদ্ধতি
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            আপনি কীভাবে পেমেন্ট করতে চান তা নির্বাচন করুন
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {isPaymentLoading ? (
                                        <div className="col-span-1 sm:col-span-2 py-4 flex justify-center items-center">
                                            <svg className="animate-spin h-6 w-6 text-brand-green" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        </div>
                                    ) : paymentTypes.length > 0 ? (
                                        paymentTypes.map((pt) => {
                                            const isCash = pt.type_name === "Cash";
                                            return (
                                                <label
                                                    key={pt.id}
                                                    className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-brand-green ${paymentMethod === pt.id
                                                        ? "border-brand-green bg-brand-green/5 ring-1 ring-brand-green"
                                                        : "border-gray-200"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={pt.id}
                                                        className="sr-only"
                                                        checked={paymentMethod === pt.id}
                                                        onChange={() => setPaymentMethod(pt.id)}
                                                    />
                                                    <div className="flex flex-1 flex-col">
                                                        <span className="flex items-center gap-2 font-bold text-gray-900">
                                                            {isCash ? (
                                                                <Truck className="h-4 w-4 text-brand-green" />
                                                            ) : (
                                                                <CreditCard className="h-4 w-4 text-brand-green" />
                                                            )}
                                                            {isCash ? "ক্যাশ অন ডেলিভারি" : "অনলাইন পেমেন্ট (SSL)"}
                                                        </span>
                                                        <span className="mt-1 text-xs text-gray-500">
                                                            {isCash ? "বই হাতে পেয়ে মূল্য পরিশোধ করুন" : "নিরাপদ অনলাইন পেমেন্ট"}
                                                        </span>
                                                    </div>
                                                    {paymentMethod === pt.id && (
                                                        <div className="absolute right-4 top-4">
                                                            <div className="h-3 w-3 rounded-full bg-brand-green" />
                                                        </div>
                                                    )}
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-1 sm:col-span-2 text-sm text-gray-500 py-4 text-center">
                                            No payment methods available right now.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* ── Courier Service ── */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            কুরিয়ার সার্ভিস
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            আপনার পছন্দের কুরিয়ার নির্বাচন করুন
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {courierOptions.map((courier) => (
                                        <label
                                            key={courier.id}
                                            className={`relative flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 p-3 transition-all h-[80px] sm:h-[90px] overflow-hidden ${selectedCourier === courier.id
                                                ? courier.selectedBorder + " " + courier.bg
                                                : "border-gray-100 bg-white hover:border-brand-green/30"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="courier"
                                                value={courier.id}
                                                checked={selectedCourier === courier.id}
                                                onChange={(e) => setSelectedCourier(e.target.value)}
                                                className="sr-only"
                                            />
                                            {courier.logo ? (
                                                <div className="relative w-full h-full flex items-center justify-center p-1">
                                                    <Image
                                                        src={courier.logo}
                                                        alt={courier.name}
                                                        width={120}
                                                        height={40}
                                                        style={{ transform: `scale(${courier.scale || 1})` }}
                                                        className="max-h-full max-w-full object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-1 items-center justify-center text-center">
                                                    <span className={`font-black text-xs sm:text-sm ${courier.color} tracking-tight leading-tight`}>
                                                        {courier.name}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedCourier === courier.id && (
                                                <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green shadow-sm z-10">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* ═══ Right Column: Order Summary ═══ */}
                        <div className="h-fit space-y-6 lg:sticky lg:top-24">
                            <section className="rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
                                <h2 className="mb-5 font-extrabold text-gray-900 text-lg">
                                    অর্ডার সামারি
                                </h2>

                                {/* Cart Items */}
                                <div className="mb-5 max-h-[300px] space-y-4 overflow-y-auto pr-1">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item.id}-${item.variantKey}-${index}`} className="flex gap-3">
                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                                <Image
                                                    src={item.images?.[0] || item.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400"}
                                                    alt={item.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div className="flex justify-between">
                                                    <h3 className="line-clamp-1 text-sm font-bold text-gray-900 pr-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm font-extrabold text-brand-green whitespace-nowrap">
                                                        {formatPrice(item.numericPrice * item.quantity)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span>পরিমাণ: {item.quantity}</span>
                                                    {item.variants?.storage && (
                                                        <>
                                                            <span>·</span>
                                                            <span>{item.variants.storage}</span>
                                                        </>
                                                    )}
                                                    {item.variants?.colors?.name && (
                                                        <>
                                                            <span>·</span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.variants.colors.hex }}></span>
                                                                {item.variants.colors.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-5 space-y-3 border-t border-gray-100 pt-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>সাবটোটাল</span>
                                        <span className="font-medium">{formatPrice(subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>ডেলিভারি চার্জ ({
                                            selectedDistrict ? (() => {
                                                const d = selectedDistrict.toLowerCase().trim();
                                                const c = (selectedCity || "").toLowerCase().trim();
                                                if (d === "gazipur" || d === "narayanganj" || c.includes("savar") || c.includes("keraniganj") || c.includes("gazipur") || c.includes("narayanganj")) {
                                                    return "সাব-ঢাকা";
                                                }
                                                return d === "dhaka" ? "ঢাকা সিটি" : "ঢাকার বাইরে";
                                            })() : "এলাকা নির্বাচন করুন"
                                        })</span>
                                        <span className="font-medium">{deliveryFee > 0 ? formatPrice(deliveryFee) : "—"}</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>কুপন ডিসকাউন্ট</span>
                                            <span>-{formatPrice(couponDiscount)}</span>
                                        </div>
                                    )}

                                    {/* Coupon Input */}
                                    <div className="pt-2">
                                        {appliedCoupon ? (
                                            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-green-700">
                                                        🎉 {couponCode} প্রয়োগ করা হয়েছে
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-xs text-brand-green hover:underline font-medium"
                                                >
                                                    বাতিল করুন
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="কুপন কোড"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponError("");
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !couponLoading && couponCode.trim()) {
                                                            e.preventDefault();
                                                            handleApplyCoupon();
                                                        }
                                                    }}
                                                    className={`flex-1 rounded-xl border px-4 py-2.5 text-base focus:outline-none ${couponError
                                                        ? "border-red-300 bg-red-50 focus:border-red-500"
                                                        : "border-gray-200 bg-gray-50 focus:border-brand-green"
                                                        }`}
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading}
                                                    className="rounded-xl bg-brand-green px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-green-dark disabled:opacity-50"
                                                >
                                                    {couponLoading ? "..." : "অ্যাপ্লাই"}
                                                </button>
                                            </div>
                                        )}
                                        {couponError && (
                                            <p className="mt-1.5 text-xs text-red-500">{couponError}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-5">
                                    <span className="text-base font-extrabold text-gray-900">
                                        সর্বমোট
                                    </span>
                                    <span className="text-xl font-extrabold text-brand-green">
                                        {formatPrice(grandTotal)}
                                    </span>
                                </div>

                                {/* Agreement Acceptance */}
                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        id="agreement"
                                        checked={isAgreed}
                                        onChange={(e) => setIsAgreed(e.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer shadow-sm"
                                    />
                                    <label htmlFor="agreement" className="text-xs leading-relaxed text-gray-600 cursor-pointer select-none">
                                        আমি তারুণ্য প্রকাশন-এর {' '}
                                        <Link href="/privacy" className="font-bold text-brand-green hover:underline">গোপনীয়তা নীতি</Link>, {' '}
                                        <Link href="/terms" className="font-bold text-brand-green hover:underline">শর্তাবলী</Link> {' '}
                                        এবং {' '}
                                        <Link href="/warranty" className="font-bold text-brand-green hover:underline">রিটার্ণ ও রিফান্ড পলিসি</Link>
                                        -তে সম্মতি দিচ্ছি।
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isSubmitting || !isAgreed}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green-dark hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            প্রসেসিং হচ্ছে...
                                        </>
                                    ) : (
                                        <>
                                            অর্ডার কনফার্ম করুন
                                            <Truck className="h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                    <Shield className="h-3 w-3" />
                                    নিরাপদ চেকআউট · SSL এনক্রিপ্টেড
                                </div>
                            </section>

                            <div className="text-center text-xs text-gray-400 pb-4">
                                <Link href="/" className="hover:underline">Terms</Link> · <Link href="/" className="hover:underline">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
