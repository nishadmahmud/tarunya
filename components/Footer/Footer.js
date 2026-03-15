"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer({ categories = [] }) {
    const defaultCategories = [
        { name: "উপন্যাস", slug: "novels" },
        { name: "কবিতা", slug: "poetry" },
        { name: "শিশু-কিশোর", slug: "children" },
        { name: "আত্মউন্নয়ন", slug: "self-help" },
        { name: "ধর্মীয় বই", slug: "religious" },
    ];

    const displayCategories = categories && categories.length > 0 ? categories.slice(0, 5) : defaultCategories;

    return (
        <footer className="bg-brand-green-dark text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 md:py-16">

                    {/* Brand & Mission */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <Link href="/" className="inline-block mb-6 group">
                            <Image
                                src="/Tarunno Logo Board.png"
                                alt="তারুণ্য প্রকাশন"
                                width={180}
                                height={60}
                                className="h-12 w-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                                unoptimized
                            />
                        </Link>
                        <p className="text-gray-100 text-sm md:text-base leading-relaxed max-w-sm mb-8">
                            বাংলাদেশের অন্যতম নির্ভরযোগ্য প্রকাশনা প্রতিষ্ঠান। আমরা বিশ্বাস করি মানসম্মত বই-ই পারে উন্নত সমাজ গড়তে। সেরা মানের বই, আকর্ষণীয় প্রচ্ছদ ও পাঠযোগ্য ফন্টে প্রকাশ করাই আমাদের অঙ্গীকার।
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:scale-110 transition-all duration-300 group">
                                <FiFacebook size={18} className="group-hover:rotate-6" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:scale-110 transition-all duration-300 group">
                                <FiInstagram size={18} className="group-hover:-rotate-6" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-gold hover:scale-110 transition-all duration-300 group">
                                <FiYoutube size={18} className="group-hover:rotate-6" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Quick Links */}
                        <div>
                            <h4 className="text-brand-gold font-bold text-lg mb-6 relative inline-block">
                                দ্রুত লিংক
                                <span className="absolute -bottom-1 left-0 w-8 h-1 bg-brand-gold rounded-full"></span>
                            </h4>
                            <ul className="space-y-3.5">
                                {[
                                    { label: "হোম", href: "/" },
                                    { label: "আমাদের সম্পর্কে", href: "/about" },
                                    { label: "যোগাযোগ", href: "/contact" },
                                    { label: "অর্ডার ট্র্যাক", href: "/track-order" },
                                    { label: "বিশেষ অফার", href: "/special-offers" },
                                ].map(item => (
                                    <li key={item.href}>
                                        <Link href={item.href} className="text-gray-100 text-sm md:text-base hover:text-brand-gold hover:translate-x-1 inline-block transition-all duration-300">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Top Categories */}
                        <div>
                            <h4 className="text-brand-gold font-bold text-lg mb-6 relative inline-block">
                                বই বিভাগ
                                <span className="absolute -bottom-1 left-0 w-8 h-1 bg-brand-gold rounded-full"></span>
                            </h4>
                            <ul className="space-y-3.5">
                                {displayCategories.map((cat, idx) => (
                                    <li key={cat.id || idx}>
                                        <Link href="#" className="text-gray-100 text-sm md:text-base hover:text-brand-gold hover:translate-x-1 inline-block transition-all duration-300">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info (Visible on desktop) */}
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-brand-gold font-bold text-lg mb-6 relative inline-block">
                                যোগাযোগ
                                <span className="absolute -bottom-1 left-0 w-8 h-1 bg-brand-gold rounded-full"></span>
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-100 text-sm md:text-base">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <FiPhone size={14} className="text-brand-gold" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-brand-gold/70 font-medium">ফোন করুন</span>
                                        <a href="tel:01979-456721" className="hover:text-brand-gold transition-colors">01979-456721</a>
                                        <a href="tel:01979-456722" className="hover:text-brand-gold transition-colors">01979-456722</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-100 text-sm md:text-base">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <FiMail size={14} className="text-brand-gold" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-brand-gold/70 font-medium">ইমেইল</span>
                                        <a href="mailto:tarunyaprokashon@gmail.com" className="hover:text-brand-gold transition-colors break-all">tarunyaprokashon@gmail.com</a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-100 text-sm md:text-base">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <FiMapPin size={14} className="text-brand-gold" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-brand-gold/70 font-medium">ঠিকানা</span>
                                        <span className="text-xs md:text-sm">Shop No: 13, 1st Floor, Islami Tower, 11/1, Banglabazar, Dhaka-1100.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="py-10 border-y border-white/10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">আমাদের নিউজলেটারে সাবস্ক্রাইব করুন</h3>
                        <p className="text-gray-200 text-sm mb-8">নতুন বইয়ের আপডেট ও বিশেষ অফার পেতে আমাদের সাথে যুক্ত থাকুন।</p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                                className="flex-1 bg-white px-5 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all shadow-inner"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-brand-gold hover:bg-brand-gold/90 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                            >
                                সাবস্ক্রাইব করুন
                            </button>
                        </form>
                    </div>
                </div>

                {/* Payment Gateway Row */}
                <div className="pt-8 pb-4 border-b border-white/5 flex flex-col items-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 text-center">Secure Payment via</p>
                    <div className="bg-white/95 p-2 md:p-4 rounded-xl shadow-xl w-full max-w-5xl">
                        <Image
                            src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
                            alt="SSLCommerz Payment Gateway"
                            width={1200}
                            height={120}
                            className="w-full h-auto object-contain mx-auto"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                        <p className="text-gray-300 text-xs md:text-sm">
                            &copy; {new Date().getFullYear()} <span className="text-brand-gold font-semibold">তারুণ্য প্রকাশন</span>। সর্বস্বত্ব সংরক্ষিত।
                        </p>
                        <p className="text-gray-400 text-[10px] md:text-xs">
                            ট্রেড লাইসেন্স নং : TRAD/DSCC/002901/2021
                        </p>
                        <p className="text-gray-400 text-[10px] md:text-xs">
                            Developed by <a href="https://squadinnovators.com/" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Squad Innovetors</a>
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
                        <Link href="/privacy" className="text-gray-400 text-xs hover:text-white transition-colors">গোপনীয়তা নীতি</Link>
                        <span className="text-gray-600 text-[10px]">•</span>
                        <Link href="/terms" className="text-gray-400 text-xs hover:text-white transition-colors">শর্তাবলী</Link>
                        <span className="text-gray-600 text-[10px]">•</span>
                        <Link href="/warranty" className="text-gray-400 text-xs hover:text-white transition-colors">রিটার্ন ও রিফান্ড</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
