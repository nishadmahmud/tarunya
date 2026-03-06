import { getBlogs, isApiConfigured } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiClock, FiCalendar } from "react-icons/fi";

const fallbackBlogs = [
    {
        id: 1,
        title: "বই পড়ার উপকারিতা: কেন প্রতিদিন পড়া উচিত?",
        excerpt: "বই পড়া কেবল জ্ঞান অর্জনের মাধ্যম নয়, এটি মানসিক প্রশান্তি এবং সৃজনশীলতা বৃদ্ধিতেও সহায়ক। জানুন বই পড়ার কিছু অনন্য উপকারিতা...",
        date: "১৫ মার্চ, ২০২৬",
        category: "পড়ার টিপস",
        readTime: "৪ মিনিট",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800",
        slug: "benefits-of-reading-books"
    },
    {
        id: 2,
        title: "সেরা রহস্য ও রোমাঞ্চকর বইয়ের তালিকা",
        excerpt: "আপনি কি রহস্য গল্প পছন্দ করেন? এবারের বইমেলায় জনপ্রিয় হওয়া সেরা কিছু থ্রিলার এবং রহস্য বইয়ের তালিকা এখানে দেখুন...",
        date: "১২ মার্চ, ২০২৬",
        category: "বইয়ের তালিকা",
        readTime: "৬ মিনিট",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
        slug: "best-mystery-books-list"
    },
    {
        id: 3,
        title: "শিশুদের বই পড়ার অভ্যাস গড়ে তোলার উপায়",
        excerpt: "বর্তমানে ডিজিটাল ডিভাইসের যুগে শিশুদের বইমুখী করা অনেক বড় চ্যালেঞ্জ। ছোটবেলা থেকেই কিভাবে তাদের মধ্যে পাঠাভ্যাস গড়ে তোলা যায় তা নিয়ে কিছু টিপস...",
        date: "১০ মার্চ, ২০২৬",
        category: "অভিভাবকদের জন্য",
        readTime: "৫ মিনিট",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800",
        slug: "developing-reading-habits-in-children"
    }
];

export const metadata = {
    title: "ব্লগ ও টিপস | তারুণ্য প্রকাশন",
    description: "বই পরিচিতি, পড়ার টিপস এবং নতুন বইয়ের আপডেট জানুন আমাদের ব্লগে।",
};

export default async function BlogPage() {
    let blogPosts = [];

    if (isApiConfigured()) {
        try {
            const res = await getBlogs();
            if (res?.success && Array.isArray(res?.data)) {
                blogPosts = res.data.map(b => ({
                    id: b.id,
                    title: b.title,
                    excerpt: b.content ? b.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...' : 'আমাদের ব্লগের নতুন নিবন্ধটি পড়ুন...',
                    date: new Date(b.created_at || Date.now()).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
                    category: b.category_id || 'বই পরিচিতি',
                    readTime: '৫ মিনিট পড়ার সময়',
                    image: b.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800",
                    slug: b.title ? b.title.toLowerCase().replace(/\s+/g, '-') : String(b.id)
                }));
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        }
    }

    // Use fallback if no results from API or API not configured
    if (blogPosts.length === 0) {
        blogPosts = fallbackBlogs;
    }

    return (
        <div className="bg-brand-cream/30 min-h-screen">
            {/* Header / Breadcrumbs */}
            <div className="bg-white py-8 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                        <Link href="/" className="hover:text-brand-green transition-colors">হোম</Link>
                        <FiChevronRight size={14} />
                        <span className="text-brand-green font-bold">ব্লগ</span>
                    </nav>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                        আমাদের <span className="text-brand-green">ব্লগ ও টিপস</span>
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-2xl text-base md:text-lg">
                        নতুন বইয়ের খবর, লেখক পরিচিতি এবং পড়ার অভ্যাস গড়ে তোলার দারুণ সব টিপস জানুন আমাদের ব্লগে।
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                {blogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {blogPosts.map((post) => (
                            <Link
                                href={`/blog/${post.slug || post.id}`}
                                key={post.id}
                                className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-green/20 transition-all duration-500"
                            >
                                <div className="w-full aspect-[16/10] relative overflow-hidden bg-gray-100">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-brand-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><FiCalendar className="text-brand-green" /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><FiClock className="text-brand-green" /> {post.readTime}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-4 leading-snug group-hover:text-brand-green transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center gap-2 text-brand-green font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                        বিস্তারিত পড়ুন <FiChevronRight />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCalendar size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">কোন ব্লগ পাওয়া যায়নি</h2>
                        <p className="text-gray-500">আমরা নতুন নিবন্ধ লিখছি। দয়া করে পরে আবার চেষ্টা করুন!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
