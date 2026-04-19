"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero({ slides = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

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
            <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-5">
                <div className="w-full">
                    <div className="w-full relative overflow-hidden rounded-xl h-[185px] sm:h-[235px] md:h-[290px] shadow-md group">
                        {displaySlides.map((slide, idx) => (
                            <div
                                key={slide.id || idx}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <Link href={slide.buttonLink || "#"}>
                                    <Image
                                        src={slide.image || slide.image_path || "/images/hero-fallback.jpg"}
                                        alt={slide.title || "স্লাইডার"}
                                        fill
                                        unoptimized
                                        className="object-cover object-bottom z-0"
                                        priority={idx === 0}
                                    />
                                </Link>
                            </div>
                        ))}

                        {/* Slider Dots */}
                        <div className="absolute bottom-3 left-5 md:left-10 z-30 flex gap-2">
                            {displaySlides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-brand-gold w-7' : 'bg-white/40 hover:bg-white/60 w-2'}`}
                                    aria-label={`স্লাইড ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
