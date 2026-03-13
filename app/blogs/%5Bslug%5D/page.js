"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogs } from "../../../lib/api";
import { ChevronLeft, Calendar, User, Clock, Share2 } from "lucide-react";

export default function BlogDetailPage() {
    const params = useParams();
    const slugWithId = params.slug; // Format: slug-text-id
    const blogId = slugWithId.split('-').pop();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await getBlogs();
                if (res?.success && Array.isArray(res?.data)) {
                    const allPosts = res.data;
                    const foundPost = allPosts.find(b => String(b.id) === String(blogId));
                    
                    if (foundPost) {
                        setPost({
                            ...foundPost,
                            date: new Date(foundPost.created_at || Date.now()).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
                        });
                        
                        // Set some related posts (excluding current)
                        setRelatedPosts(allPosts.filter(b => String(b.id) !== String(blogId)).slice(0, 3));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
            } finally {
                setLoading(false);
            }
        }
        if (blogId) fetchPost();
    }, [blogId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">দুঃখিত, ব্লগটি পাওয়া যায়নি</h1>
                <Link href="/blogs" className="text-brand-green hover:underline">ব্লগ লিস্টে ফিরে যান</Link>
            </div>
        );
    }

    return (
        <article className="bg-white min-h-screen pb-20">
            {/* Navigation & Breadcrumb */}
            <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
                <Link href="/blogs" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-green transition-colors mb-6 group">
                    <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    সব ব্লগে ফিরে যান
                </Link>
            </div>

            {/* Header Content */}
            <header className="max-w-4xl mx-auto px-4 text-center mb-10">
                <div className="flex justify-center mb-4">
                    <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                        {post.category_id || "টিপস ও ব্লগ"}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-brand-green" />
                        {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-brand-green" />
                        ৫ মিনিট পড়া
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            <div className="max-w-6xl mx-auto px-4 mb-12">
                <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                    <Image 
                        src={post.image || "/images/blog-fallback.jpg"} 
                        alt={post.title} 
                        fill 
                        unoptimized 
                        priority
                        className="object-cover" 
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-12">
                {/* Main Text */}
                <div className="flex-grow">
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    {/* Tags/Footer of Article */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                            <span className="text-brand-green">শেয়ার করুন:</span>
                            <div className="flex gap-4">
                                <Link href="#" className="hover:text-brand-green">FB</Link>
                                <Link href="#" className="hover:text-brand-green">TW</Link>
                                <Link href="#" className="hover:text-brand-green">WA</Link>
                            </div>
                        </div>
                        <button className="inline-flex items-center gap-2 text-sm font-bold bg-gray-50 px-6 py-2.5 rounded-xl hover:bg-brand-green hover:text-white transition-all">
                            <Share2 size={16} />
                            লিঙ্ক কপি করুন
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-gray-50 py-20 mt-20">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <h2 className="text-2xl md:text-3xl font-black text-center mb-12">
                            অন্যান্য <span className="text-brand-green">প্রবন্ধ</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((related) => {
                                const relSlug = related.title ? related.title.toLowerCase().replace(/\s+/g, '-') : String(related.id);
                                return (
                                    <Link href={`/blogs/${relSlug}-${related.id}`} key={related.id} className="group bg-white rounded-2xl overflow-hidden border border-transparent hover:border-brand-green/20 hover:shadow-xl transition-all duration-300">
                                        <div className="relative aspect-video">
                                            <Image src={related.image} alt={related.title} fill unoptimized className="object-cover" />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-900 group-hover:text-brand-green transition-colors line-clamp-2 mb-2">
                                                {related.title}
                                            </h3>
                                            <span className="text-xs text-brand-green font-bold">আরও পড়ুন →</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}
