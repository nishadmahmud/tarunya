import Image from "next/image";
import Link from "next/link";
import { getAuthorsList } from "../../../lib/api";
import { User, BookOpen, GraduationCap, ArrowLeft, Heart, Share2 } from "lucide-react";

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const authorId = resolvedParams.id;
        
        const response = await getAuthorsList();
        let author = null;
        if (Array.isArray(response)) {
            author = response.find(a => String(a.id) === String(authorId));
        } else if (response?.success && Array.isArray(response?.data)) {
            author = response.data.find(a => String(a.id) === String(authorId));
        }
        
        if (!author) {
            return { title: 'Author Not Found - Tarunno Prokashon' }
        }
        return {
            title: `${author.name} - Tarunno Prokashon`,
            description: author.description || `${author.name} is an author at Tarunno Prokashon.`,
        };
    } catch (e) {
        return { title: 'Author - Tarunno Prokashon' };
    }
}

export default async function AuthorProfilePage({ params }) {
    const resolvedParams = await params;
    const authorId = resolvedParams.id;
    
    let author = null;
    let loadingError = false;

    try {
        const res = await getAuthorsList();
        if (Array.isArray(res)) {
            author = res.find(a => String(a.id) === String(authorId));
        } else if (res?.success && Array.isArray(res?.data)) {
            author = res.data.find(a => String(a.id) === String(authorId));
        } else {
            loadingError = true;
        }
    } catch (e) {
        console.error("Error fetching authors:", e);
        loadingError = true;
    }

    if (loadingError || !author) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-red-50 flex items-center justify-center border-4 border-white shadow-xl">
                    <User className="w-10 h-10 text-red-300" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">লেখক খুঁজে পাওয়া যায়নি</h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    দুঃখিত, আপনি যে লেখকের প্রোফাইল খুঁজছেন তা সার্ভারে পাওয়া যায়নি।
                </p>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green-dark transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    হোমপেজে ফিরে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header / Cover Area */}
            <div className="relative h-48 md:h-72 bg-gradient-to-r from-brand-green/90 to-emerald-900 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
                
                {/* Back button */}
                <div className="absolute top-6 left-6 z-10">
                    <Link
                        href="/"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-brand-green transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Column: Author Image & Quick Info (Pulled up into header) */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start relative -mt-24 lg:-mt-32 z-10">
                        {/* Avatar */}
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-[#FDFBF7] bg-white shadow-2xl overflow-hidden relative mb-6">
                                {author.image ? (
                                    <Image
                                        src={author.image}
                                        alt={author.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        sizes="(max-width: 768px) 160px, 224px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <User className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                        </div>

                        {/* Title (Mobile only, hidden on LG) */}
                        <div className="text-center w-full lg:hidden mb-8">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">{author.name}</h1>
                            {author.education && (
                                <p className="text-brand-green font-bold flex items-center justify-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    {author.education}
                                </p>
                            )}
                        </div>

                        {/* Quick Stats / Actions Box */}
                        <div className="w-full bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                <div className="text-center flex-1">
                                    <p className="text-2xl font-black text-gray-900 mb-1">
                                        {author.active === 1 ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                    </p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">স্ট্যাটাস</p>
                                </div>
                                <div className="w-px h-10 bg-gray-100"></div>
                                <div className="text-center flex-1">
                                    <p className="text-2xl font-black text-gray-900 mb-1">
                                        <BookOpen className="w-6 h-6 mx-auto text-brand-green" />
                                    </p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">বইসমূহ</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-green text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
                                    <Heart className="w-4 h-4" />
                                    অনুসরণ করুন
                                </button>
                                <button className="w-12 flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-brand-green transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Content */}
                    <div className="lg:col-span-8 pt-8 lg:pt-10">
                        {/* Title (LG only) */}
                        <div className="hidden lg:block mb-10 pb-8 border-b border-gray-200">
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                                {author.name}
                            </h1>
                            {author.education && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-brand-green font-bold text-sm">
                                    <GraduationCap className="w-4 h-4" />
                                    {author.education}
                                </div>
                            )}
                        </div>

                        {/* Biography / Description */}
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                    <User className="w-4 h-4" />
                                </div>
                                লেখক পরিচিতি
                            </h2>
                            <div className="prose prose-lg prose-green max-w-none prose-p:leading-relaxed prose-p:text-gray-600">
                                {author.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: author.description }} />
                                ) : (
                                    <p className="italic text-gray-400">এই লেখকের কোনো বিস্তারিত পরিচিতি এখনো যোগ করা হয়নি।</p>
                                )}
                            </div>
                        </div>

                        {/* Books Section Placeholder */}
                        <div className="mt-16 pt-12 border-t border-gray-200">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center justify-between">
                                <span>{author.name}-এর বইসমূহ</span>
                                <Link href="#" className="text-sm font-bold text-brand-green hover:underline">
                                    সব দেখুন
                                </Link>
                            </h2>
                            
                            {/* Empty State for Books (since we don't have the API array directly connected yet) */}
                            <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 text-center">
                                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">লেখকের বইগুলো খুব শীঘ্রই এখানে আপডেট করা হবে।</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
