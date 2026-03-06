import Image from 'next/image';
import Link from 'next/link';

export default function PromoBanners() {
    const banners = [
        {
            id: 1,
            imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
            link: "/special-offers",
            alt: "বিশেষ অফার"
        },
        {
            id: 2,
            imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop",
            link: "/special-offers",
            alt: "নতুন বই সংকলন"
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                        <Link href="#" key={banner.id} className="block group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full h-[350px] sm:h-[400px] md:h-[550px]">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.alt}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
