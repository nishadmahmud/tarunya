import Link from 'next/link';
import Image from 'next/image';

const publishers = [
    { id: 1, name: "অন্যপ্রকাশ", books: "৫০০+ বই", slug: "onno-prokash", color: "from-emerald-50 to-green-50" },
    { id: 2, name: "প্রথমা", books: "৪০০+ বই", slug: "prothoma", color: "from-amber-50 to-yellow-50" },
    { id: 3, name: "কাকলী", books: "৩৫০+ বই", slug: "kakoli", color: "from-blue-50 to-sky-50" },
    { id: 4, name: "আদর্শ", books: "৬০০+ বই", slug: "adarsha", color: "from-rose-50 to-pink-50" },
    { id: 5, name: "মাওলা ব্রাদার্স", books: "৮০০+ বই", slug: "mawla-brothers", color: "from-violet-50 to-purple-50" },
    { id: 6, name: "তামরিশ", books: "২০০+ বই", slug: "tamrish", color: "from-teal-50 to-cyan-50" },
];

export default function TopPublishers({ brands = [] }) {
    if (!brands || brands.length === 0) return null;

    const fallbackColors = [
        "from-emerald-50 to-green-50",
        "from-amber-50 to-yellow-50",
        "from-blue-50 to-sky-50",
        "from-rose-50 to-pink-50",
        "from-violet-50 to-purple-50",
        "from-teal-50 to-cyan-50"
    ];

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-10">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            জনপ্রিয় প্রকাশনী
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">বাংলাদেশের সেরা প্রকাশনা সংস্থা থেকে বই সংগ্রহ করুন</p>
                    </div>
                    <Link href="#" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 mt-8">
                    {brands.map((brand, idx) => (
                        <Link
                            href={`/publisher/${brand.name ? brand.name.toLowerCase().replace(/\s+/g, '-') : brand.id}`}
                            key={brand.id}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Publisher Logo Card */}
                            <div className="w-24 h-24 md:w-36 md:h-36 rounded-2xl bg-white border-4 border-brand-green/10 flex items-center justify-center mb-4 group-hover:border-brand-green/40 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative shadow-md">
                                {brand.image_path ? (
                                    <Image 
                                        src={brand.image_path} 
                                        alt={brand.name} 
                                        fill 
                                        unoptimized 
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <span className="text-2xl md:text-3xl font-black text-brand-green/40">{brand.name?.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-tight group-hover:text-brand-green transition-colors mb-0.5 line-clamp-1 w-full px-1">
                                {brand.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
