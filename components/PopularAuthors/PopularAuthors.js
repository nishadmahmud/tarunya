import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function PopularAuthors({ authors = [] }) {
    if (!authors || authors.length === 0) return null;

    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-10">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            জনপ্রিয় লেখক
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">সর্বাধিক পঠিত ও প্রিয় লেখকদের বই সংগ্রহ</p>
                    </div>
                    <Link href="/authors" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 mt-8">
                    {authors.map((author) => (
                        <Link
                            href={`/author/${author.id}`}
                            key={author.id}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Author Avatar */}
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-brand-green-light to-brand-cream border-4 border-brand-green/20 flex items-center justify-center mb-4 group-hover:border-brand-green/50 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative shadow-md">
                                {author.image ? (
                                    <Image
                                        src={author.image}
                                        alt={author.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        sizes="(max-width: 768px) 80px, 112px"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-brand-green/40" />
                                )}
                            </div>
                            <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-tight group-hover:text-brand-green transition-colors mb-1 line-clamp-1 w-full px-1">
                                {author.name}
                            </h3>
                            <span className="text-[10px] md:text-xs text-gray-500 font-medium line-clamp-1 w-full px-2">
                                {author.education || "লেখক"}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
