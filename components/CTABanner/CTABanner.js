import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';

export default function CTABanner() {
    return (
        <section className="bg-white py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-dark shadow-xl flex flex-col md:flex-row min-h-[280px] md:min-h-[360px]">

                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>

                    {/* Left: Content */}
                    <div className="md:w-[55%] p-6 md:p-12 flex flex-col justify-center relative z-10">
                        <span className="text-brand-gold text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3">
                            📚 বই অনুসন্ধান সেবা
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 md:mb-4">
                            আপনার পছন্দের বই <br className="hidden md:block" />খুঁজে পাচ্ছেন না?
                        </h2>
                        <p className="text-white/70 text-xs md:text-sm mb-6 max-w-md leading-relaxed">
                            আমাদের জানান, আমরা আপনার জন্য যেকোনো বই সংগ্রহ করে দেব। দেশি-বিদেশি সব ধরনের বই পাওয়া যায়।
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="#" className="inline-flex items-center justify-center gap-2 bg-white text-brand-green-dark font-bold py-2.5 md:py-3 px-5 md:px-7 rounded-lg hover:bg-brand-gold hover:text-white transition-all text-sm shadow-lg">
                                যোগাযোগ করুন <FiArrowRight size={16} />
                            </Link>
                            <a href="#" className="inline-flex items-center justify-center gap-2 text-white font-bold py-2.5 md:py-3 px-5 md:px-7 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm">
                                <FiPhoneCall size={16} /> ০১৯৭৯৪৫৬৭২১
                            </a>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="md:w-[45%] relative min-h-[200px] md:min-h-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-green to-transparent z-10 md:bg-gradient-to-l"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop"
                            alt="বইয়ের সংগ্রহ"
                            fill
                            unoptimized
                            className="object-cover z-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
