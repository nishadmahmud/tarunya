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
        <footer className="bg-brand-green-dark text-white/80">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Main Footer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 py-10 md:py-14 border-b border-white/10">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="#" className="inline-block mb-4">
                            <Image
                                src="/Tarunno Logo Board.png"
                                alt="তারুণ্য প্রকাশন"
                                width={160}
                                height={50}
                                className="h-10 w-auto drop-shadow-md"
                                unoptimized
                            />
                        </Link>
                        <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-[260px] mb-4">
                            বাংলাদেশের বিশ্বস্ত বই বিক্রয় প্রতিষ্ঠান। সেরা মানের বই, সাশ্রয়ী মূল্যে।
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"><FiFacebook size={14} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"><FiInstagram size={14} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"><FiYoutube size={14} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide">দ্রুত লিংক</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "হোম", href: "/" },
                                { label: "আমাদের সম্পর্কে", href: "/about" },
                                { label: "যোগাযোগ", href: "/contact" },
                                { label: "অর্ডার ট্র্যাক", href: "/track-order" },
                                { label: "বিশেষ অফার", href: "/special-offers" },
                            ].map(item => (
                                <li key={item.href}>
                                    <Link href="#" className="text-white/50 text-xs md:text-sm hover:text-brand-gold transition-colors">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide">বই বিভাগ</h4>
                        <ul className="space-y-2.5">
                            {displayCategories.map((cat, idx) => (
                                <li key={cat.id || idx}>
                                    <Link href="#" className="text-white/50 text-xs md:text-sm hover:text-brand-gold transition-colors">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 tracking-wide">যোগাযোগ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-white/50 text-xs md:text-sm">
                                <FiPhone size={14} className="mt-0.5 text-brand-gold flex-shrink-0" />
                                <a href="#" className="hover:text-brand-gold transition-colors">০১৯৭৯৪৫৬৭২১</a>
                            </li>
                            <li className="flex items-start gap-2.5 text-white/50 text-xs md:text-sm">
                                <FiMail size={14} className="mt-0.5 text-brand-gold flex-shrink-0" />
                                <a href="#" className="hover:text-brand-gold transition-colors">info@tarunnyoprokashon.com</a>
                            </li>
                            <li className="flex items-start gap-2.5 text-white/50 text-xs md:text-sm">
                                <FiMapPin size={14} className="mt-0.5 text-brand-gold flex-shrink-0" />
                                <span>ঢাকা, বাংলাদেশ</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-4 md:py-5 flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-white/30 text-[10px] md:text-xs">&copy; {new Date().getFullYear()} তারুণ্য প্রকাশন। সর্বস্বত্ব সংরক্ষিত।</p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-white/30 text-[10px] md:text-xs hover:text-white/60 transition-colors">গোপনীয়তা নীতি</Link>
                        <Link href="#" className="text-white/30 text-[10px] md:text-xs hover:text-white/60 transition-colors">শর্তাবলী</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
