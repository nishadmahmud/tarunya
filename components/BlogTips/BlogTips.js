"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function BlogTips({ posts = [] }) {
    const defaultPosts = [
        { id: 1, name: "বই পড়ার অভ্যাস কিভাবে গড়ে তুলবেন", excerpt: "প্রতিদিন অল্প সময় করে বই পড়ার অভ্যাস গড়ে তুলুন। এখানে কিছু সহজ টিপস দেওয়া হলো।", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600", category: "টিপস", readTime: "৫ মিনিট" },
        { id: 2, name: "শিশুদের জন্য সেরা ১০টি বই", excerpt: "আপনার সন্তানের জন্য বেছে নিন মজার ও শিক্ষামূলক বই যা তাদের মানসিক বিকাশে সাহায্য করবে।", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600", category: "সুপারিশ", readTime: "৩ মিনিট" },
        { id: 3, name: "বইমেলায় কোন বইগুলো কিনবেন?", excerpt: "এবারের বইমেলায় সেরা লেখকদের নতুন বই সম্পর্কে জেনে নিন এবং আগেই পরিকল্পনা করুন।", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600", category: "গাইড", readTime: "৪ মিনিট" },
    ];

    const displayPosts = posts && posts.length > 0 ? posts : defaultPosts;

    return (
        <section className="bg-white py-10 md:py-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 mb-1 md:mb-3 tracking-tight">
                            ব্লগ ও <span className="text-brand-green">পড়ার টিপস</span>
                        </h2>
                        <p className="text-gray-500 text-xs md:text-lg hidden sm:block">বই ও পড়ালেখা নিয়ে সর্বশেষ খবর ও পরামর্শ।</p>
                    </div>
                    <Link href="#" className="text-xs md:text-sm font-bold text-gray-500 hover:text-brand-green uppercase tracking-wider transition-colors inline-block pb-1 border-b-2 border-transparent hover:border-brand-green whitespace-nowrap">
                        সব দেখুন
                    </Link>
                </div>

                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 md:gap-8 pb-2 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {displayPosts.map((post) => (
                        <Link href="#" key={post.id} className="group flex flex-col bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 min-w-[220px] md:min-w-0 flex-shrink-0">
                            <div className="w-full aspect-[16/9] relative overflow-hidden bg-gray-100">
                                <Image src={post.image || post.imageUrl} alt={post.title || post.name} fill unoptimized className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                                    <span className="bg-brand-green text-white text-[8px] md:text-[10px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                                </div>
                            </div>
                            <div className="p-3 md:p-6 flex flex-col flex-grow">
                                <h3 className="font-bold text-gray-900 text-xs md:text-lg mb-1 md:mb-2 leading-tight group-hover:text-brand-green transition-colors line-clamp-2">{post.title || post.name}</h3>
                                <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed mb-2 md:mb-4 flex-grow line-clamp-2 hidden sm:block">{post.excerpt}</p>
                                <span className="text-[9px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider">{post.readTime || post.date}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

