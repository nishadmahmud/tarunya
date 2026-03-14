"use client";

import Link from "next/link";
import { XCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrderCancelPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="text-center relative z-10">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">অর্ডার বাতিল হয়েছে</h2>
                    <p className="text-gray-500 text-sm mb-8">
                        দুঃখিত, আপনার পেমেন্ট বা অর্ডার প্রক্রিয়াটি বাতিল করা হয়েছে অথবা ব্যর্থ হয়েছে। আপনার অ্যাকাউন্ট থেকে কোনো টাকা কাটা হয়নি।
                    </p>

                    <div className="space-y-4">
                        <Link 
                            href="/checkout"
                            className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            চেকআউটে ফিরে যান এবং আবার চেষ্টা করুন
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
