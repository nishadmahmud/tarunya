import Link from 'next/link';
import { FiDownload } from 'react-icons/fi';

export default function AppDownloadBanner() {
    return (
        <section className="bg-brand-green-dark py-10 md:py-14 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">

                    {/* Left: Content */}
                    <div className="text-center md:text-left md:max-w-lg">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-sm border border-white/10">
                            📱 মোবাইল অ্যাপ
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3">
                            এখন বই কিনুন <br className="hidden md:block" />
                            <span className="text-brand-gold">আপনার হাতের মুঠোয়</span>
                        </h2>
                        <p className="text-white/60 text-xs md:text-sm mb-6 max-w-md leading-relaxed">
                            আমাদের অ্যাপ ডাউনলোড করুন এবং হাজারো বই ব্রাউজ করুন, অর্ডার ট্র্যাক করুন এবং বিশেষ অফার পান। প্রথম অর্ডারে ১০% ছাড়!
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-xs md:text-sm px-5 py-2.5 md:py-3 rounded-xl hover:bg-brand-gold hover:text-white transition-all shadow-lg">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.043a.5.5 0 0 0-.076-.012C16.48 1.932 14.521 3.503 13.479 5.066c-.956 1.442-1.793 3.674-.653 5.056a.5.5 0 0 0 .067.072c.293.252 1.063.664 2.21.066 1.47-.77 2.835-3.073 2.835-3.073s.05-.096.08-.148c.757-1.356.354-3.7-.495-4.996zM20.027 8.72c-1.204.656-2.293 1.748-2.293 3.593 0 2.323 1.72 3.297 2.338 3.593.082.04.14.07.14.07s-.346 1.06-1.167 2.143c-.703.93-1.482 1.87-2.668 1.87-.56 0-.94-.178-1.35-.37-.445-.207-.923-.43-1.74-.43-.864 0-1.378.232-1.86.45-.39.177-.757.343-1.289.37h-.058c-1.115 0-1.95-.999-2.668-1.93C5.948 16.24 4.827 13.383 4.827 10.667c0-3.828 2.475-5.867 4.91-5.903.644-.01 1.256.247 1.793.47.422.176.81.338 1.12.338.264 0 .628-.155 1.054-.336.612-.26 1.36-.577 2.156-.497a4.528 4.528 0 0 1 2.556 1.032c.397.307.745.68 1.037 1.107.158.232.264.445.355.62a5.507 5.507 0 0 0 .22.423z" /></svg>
                                App Store
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-xs md:text-sm px-5 py-2.5 md:py-3 rounded-xl hover:bg-brand-gold hover:text-white transition-all shadow-lg">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.414l2.346 1.322a1 1 0 0 1 0 1.77l-2.346 1.322-2.554-2.554 2.554-2.86zM5.864 3.455L16.8 9.788l-2.302 2.302-8.635-8.635z" /></svg>
                                Google Play
                            </a>
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-row md:flex-col gap-4 md:gap-6">
                        {[
                            { value: "১০০০+", label: "বই সংগ্রহ" },
                            { value: "৫০০+", label: "দৈনিক অর্ডার" },
                            { value: "৪.৮★", label: "অ্যাপ রেটিং" },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center md:text-right bg-white/5 px-5 py-3 md:px-8 md:py-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="text-xl md:text-3xl font-black text-brand-gold mb-0.5">{stat.value}</div>
                                <div className="text-[10px] md:text-xs text-white/50 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
