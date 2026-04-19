import Image from "next/image";
import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";
import { getAuthorsList } from "../../lib/api";

export const metadata = {
    title: "সকল লেখক - Tarunya Prokashon",
    description: "জনপ্রিয় ও সকল লেখকদের তালিকা — প্রোফাইল ও বই দেখুন।",
};

async function loadActiveAuthors() {
    try {
        const res = await getAuthorsList();
        let list = [];
        if (Array.isArray(res)) {
            list = res;
        } else if (res?.success && Array.isArray(res?.data)) {
            list = res.data;
        }
        return list.filter((a) => a.active === 1);
    } catch (e) {
        console.error("Failed to load authors:", e);
        return [];
    }
}

export default async function AllAuthorsPage() {
    const authors = await loadActiveAuthors();

    return (
        <div className="min-h-screen bg-white">
            <div className="border-b border-gray-100 bg-brand-cream/40">
                <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors mb-4 md:mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        হোম
                    </Link>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight mb-1 md:mb-2">
                        সকল লেখক
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 max-w-2xl">
                        জনপ্রিয় লেখকদের পাশাপাশি সকল সক্রিয় লেখকের প্রোফাইল ও বইসমূহ একই ঠিকানায়।
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 md:px-6 py-8 md:py-14">
                {authors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 md:py-28 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                            <User className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-600 font-bold mb-1">কোনো লেখকের তালিকা পাওয়া যায়নি</p>
                        <p className="text-sm text-gray-400 max-w-md">
                            API কনফিগার করা নেই অথবা সার্ভার থেকে তথ্য আসেনি। পরে আবার চেষ্টা করুন।
                        </p>
                        <Link
                            href="/"
                            className="mt-6 px-5 py-2.5 rounded-xl bg-brand-green text-white text-sm font-bold hover:bg-brand-green-dark transition-colors"
                        >
                            হোমে ফিরুন
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                        {authors.map((author) => (
                            <Link
                                href={`/author/${author.id}`}
                                key={author.id}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-brand-green-light to-brand-cream border-4 border-brand-green/20 flex items-center justify-center mb-3 md:mb-4 group-hover:border-brand-green/50 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative shadow-md">
                                    {author.image ? (
                                        <Image
                                            src={author.image}
                                            alt={author.name || "লেখক"}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 112px"
                                        />
                                    ) : (
                                        <User className="w-9 h-9 sm:w-10 sm:h-10 text-brand-green/40" />
                                    )}
                                </div>
                                <h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-900 leading-tight group-hover:text-brand-green transition-colors mb-0.5 line-clamp-2 w-full px-0.5">
                                    {author.name}
                                </h2>
                                <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium line-clamp-1 w-full px-1">
                                    {author.education || "লেখক"}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
