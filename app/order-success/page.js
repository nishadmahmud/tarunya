"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, ReceiptText, ArrowRight } from "lucide-react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const [invoiceId, setInvoiceId] = useState("");
    const [transactionId, setTransactionId] = useState("");

    useEffect(() => {
        const inv = searchParams.get("invoice");
        const tran = searchParams.get("tran_id") || searchParams.get("val_id");
        
        if (inv) setInvoiceId(inv);
        if (tran) setTransactionId(tran);

        // GA4: track purchase event
        try {
            const total = parseFloat(searchParams.get("total")) || 0;
            const shipping = parseFloat(searchParams.get("shipping")) || 0;
            const discount = parseFloat(searchParams.get("discount")) || 0;
            const coupon = searchParams.get("coupon") || "";
            let cartItems = [];
            try {
                const itemsParam = searchParams.get("items");
                if (itemsParam) cartItems = JSON.parse(decodeURIComponent(itemsParam));
            } catch (e) { /* ignore parse error */ }

            if (inv && total > 0) {
                const { trackPurchase } = require("../../lib/gtm");
                trackPurchase({
                    transactionId: inv,
                    cartItems,
                    cartTotal: total,
                    shipping,
                    discount,
                    coupon,
                });
            }
        } catch (e) {
            console.error("GA4 purchase tracking error:", e);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="text-center relative z-10">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-brand-green" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">অর্ডার সফল হয়েছে!</h2>
                    <p className="text-gray-500 text-sm mb-8">
                        ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                    </p>

                    <div className="bg-gray-50 rounded-[24px] p-6 text-left border border-gray-100 mb-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-green border border-gray-100 flex-shrink-0">
                                <ReceiptText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">ইনভয়েস নম্বর</p>
                                <p className="text-gray-900 font-bold font-mono">{invoiceId || "প্রক্রিয়াধীন"}</p>
                            </div>
                        </div>

                        {transactionId && (
                            <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-green border border-gray-100 flex-shrink-0">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">ট্রানজেকশন আইডি</p>
                                    <p className="text-gray-900 font-bold font-mono text-sm break-all">{transactionId}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Link 
                            href={`/track-order${invoiceId ? `?invoice=${invoiceId}` : ''}`}
                            className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all"
                        >
                            <Truck className="w-5 h-5" />
                            অর্ডার ট্র্যাক করুন
                            <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                        </Link>
                        
                        <Link 
                            href="/"
                            className="w-full flex justify-center items-center gap-2 py-4 px-6 border-2 border-gray-200 rounded-xl shadow-sm text-base font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all font-bengali"
                        >
                            হোমপেজে ফিরে যান
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
