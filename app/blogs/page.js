"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "../../lib/api";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const res = await getBlogs();
                if (res?.success && Array.isArray(res?.data)) {
                    const mappedBlogs = res.data.map(b => ({
                        id: b.id,
                        title: b.title,
                        excerpt: b.content ? b.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...' : 'আমাদের সর্বশেষ পোস্ট পড়ুন...',
                        date: new Date(b.created_at || Date.now()).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
                        category: b.category_id || 'সাধারণ',
                        readTime: '৫ মিনিট',
                        image: b.image || "/images/blog-fallback.jpg",
                        slug: b.title ? b.title.toLowerCase().replace(/\s+/g, '-') : String(b.id)
                    }));
                    setBlogs(mappedBlogs);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gray-50 py-12 md:py-20 border-b border-gray-100 mb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        আমাদের <span className="text-brand-green">ব্লগ</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        বই, সাহিত্য এবং পড়ার অভ্যাস নিয়ে আমাদের সর্বশেষ টিপস এবং প্রবন্ধগুলো পড়ুন।
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((post) => (
                            <Link href={`/blogs/${post.slug}-${post.id}`} key={post.id} className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-green/20 transition-all duration-300">
                                <div className="w-full aspect-[16/9] relative overflow-hidden bg-gray-100">
                                    <Image 
                                        src={post.image} 
                                        alt={post.title} 
                                        fill 
                                        unoptimized 
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-brand-green text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="font-bold text-gray-900 text-xl mb-3 leading-tight group-hover:text-brand-green transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-xs font-semibold text-gray-400">
                                            {post.date}
                                        </span>
                                        <span className="text-xs font-bold text-brand-green group-hover:underline">
                                            আরও পড়ুন →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500">বর্তমানে কোনো ব্লগ পোস্ট পাওয়া যায়নি।</p>
                    </div>
                )}
            </div>
        </div>
    );
}
