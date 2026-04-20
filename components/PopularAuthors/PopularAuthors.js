import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function PopularAuthors({ authors = [] }) {
    if (!authors || authors.length === 0) return null;

    return (
        <section className="bg-white py-7 md:py-12 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-4 md:mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            জনপ্রিয় লেখক
                        </h2>
                        <p className="text-xs md:text-sm text-gray-500 hidden sm:block">সর্বাধিক পঠিত ও প্রিয় লেখকদের বই সংগ্রহ</p>
                    </div>
                    <Link href="/authors" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>
                <div
                    className="flex overflow-x-auto gap-2.5 md:gap-4 pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {authors.map((author) => (
                        <Link
                            href={`/author/${author.id}`}
                            key={author.id}
                            className="flex flex-col items-center text-center group shrink-0 w-[112px] md:w-[140px] snap-start rounded-xl px-2 py-2 hover:bg-brand-cream/35 transition-colors"
                        >
                            <div className="w-16 h-16 md:w-[86px] md:h-[86px] rounded-full bg-linear-to-br from-brand-green-light to-brand-cream border-2 border-brand-green/20 flex items-center justify-center mb-2 group-hover:border-brand-green/50 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative shadow-sm">
                                {author.image ? (
                                    <Image
                                        src={author.image}
                                        alt={author.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        sizes="(max-width: 768px) 64px, 86px"
                                    />
                                ) : (
                                    <User className="w-8 h-8 md:w-9 md:h-9 text-brand-green/45" />
                                )}
                            </div>
                            <h3 className="text-[11px] md:text-[13px] font-bold text-gray-900 leading-tight group-hover:text-brand-green transition-colors w-full px-1 whitespace-normal break-words min-h-[2.5em]">
                                {author.name}
                            </h3>
                            <span className="hidden md:block text-[10px] text-gray-500 font-medium w-full px-2 mt-0.5 whitespace-normal break-words min-h-[2.4em]">
                                {author.education || "লেখক"}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
