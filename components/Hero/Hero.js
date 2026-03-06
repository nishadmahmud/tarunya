"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

export default function Hero({ slides = [], banners = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const defaultBanners = [
        {
            id: 'b1',
            title: 'বইমেলা সংকলন',
            image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
            link: '/'
        },
        {
            id: 'b2',
            title: 'সেরা সংগ্রহ',
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
            link: '/'
        }
    ];

    const displayBanners = banners && banners.length >= 2 ? banners.slice(0, 2) : defaultBanners;

    const defaultSlides = [
        {
            id: 1,
            badge: "নতুন সংযোজন",
            title: "আপনার পরবর্তী প্রিয় বই এখানে",
            subtitle: "হাজারো বইয়ের সংগ্রহ থেকে বেছে নিন আপনার পছন্দের বই। সারাদেশে দ্রুত ডেলিভারি।",
            buttonText: "সংগ্রহ দেখুন",
            buttonLink: "/category/all",
            image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
        },
        {
            id: 2,
            badge: "বিশেষ ছাড়",
            title: "সেরা লেখকদের সেরা বই",
            subtitle: "বাংলা সাহিত্যের কালজয়ী রচনা থেকে আধুনিক উপন্যাস — সব এক জায়গায়।",
            buttonText: "এখনই কিনুন",
            buttonLink: "/special-offers",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
        },
    ];

    const displaySlides = slides && slides.length > 0 ? slides : defaultSlides;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displaySlides.length]);

    return (
        <section className="w-full bg-brand-cream">
            <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4">

                    {/* Main Slider */}
                    <div className="lg:w-[65%] w-full relative overflow-hidden rounded-2xl h-[220px] sm:h-[320px] md:h-[420px] shadow-md group">
                        {displaySlides.map((slide, idx) => (
                            <div
                                key={slide.id || idx}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <Image
                                    src={slide.image || slide.image_path || "/images/hero-fallback.jpg"}
                                    alt={slide.title || "স্লাইডার"}
                                    fill
                                    unoptimized
                                    className="object-cover z-0"
                                    priority={idx === 0}
                                />
                                {/* Dark overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>

                                {/* Text Content Overlay */}
                                {slide.title && (
                                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 max-w-lg">
                                        <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 md:mb-3">
                                            {slide.badge}
                                        </span>
                                        <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white leading-tight mb-2 md:mb-4">
                                            {slide.title}
                                        </h1>
                                        <p className="text-white/80 text-[11px] md:text-sm mb-4 md:mb-6 leading-relaxed hidden sm:block">
                                            {slide.subtitle}
                                        </p>
                                        <Link href={slide.buttonLink || "/category/all"} className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-[11px] md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all w-fit shadow-lg hover:shadow-xl">
                                            {slide.buttonText || "সংগ্রহ দেখুন"} <FiArrowRight size={16} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Slider Dots */}
                        <div className="absolute bottom-4 left-6 md:left-12 z-30 flex gap-2">
                            {displaySlides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-brand-gold w-8' : 'bg-white/40 hover:bg-white/60 w-2'}`}
                                    aria-label={`স্লাইড ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Side Banners */}
                    <div className="lg:w-[35%] w-full flex flex-row lg:flex-col gap-3">
                        {displayBanners.map((banner, idx) => (
                            <Link href={banner.link || banner.link_url || "/"} key={banner.id || idx} className="w-1/2 lg:w-full lg:flex-1 relative overflow-hidden rounded-xl bg-gray-100 group block shadow-sm hover:shadow-md transition-shadow">
                                <Image
                                    src={banner.image || banner.image_path || banner.image_url}
                                    alt={banner.title || `ব্যানার ${idx + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
