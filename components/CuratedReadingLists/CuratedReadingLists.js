import Link from 'next/link';
import Image from 'next/image';

const recommendations = [
    {
        id: 1,
        listTitle: "গ্রীষ্মের পড়ার তালিকা",
        emoji: "☀️",
        description: "গরমের ছুটিতে পড়ার জন্য সেরা বই",
        bookCount: "১২ টি বই",
        color: "from-amber-50 to-orange-50",
        borderColor: "border-amber-200/50",
        books: [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200",
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=200",
        ]
    },
    {
        id: 2,
        listTitle: "নতুন পাঠকদের জন্য",
        emoji: "🌱",
        description: "বই পড়া শুরু করতে চান? এগুলো দিয়ে শুরু করুন",
        bookCount: "৮ টি বই",
        color: "from-green-50 to-emerald-50",
        borderColor: "border-green-200/50",
        books: [
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200",
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=200",
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200",
        ]
    },
    {
        id: 3,
        listTitle: "রহস্য-রোমাঞ্চ",
        emoji: "🔍",
        description: "থ্রিলার ও রহস্য গল্পের দারুণ সংকলন",
        bookCount: "১০ টি বই",
        color: "from-slate-50 to-gray-100",
        borderColor: "border-slate-200/50",
        books: [
            "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=200",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200",
        ]
    },
    {
        id: 4,
        listTitle: "উপহার দিতে যেসব বই",
        emoji: "🎁",
        description: "প্রিয়জনকে উপহার দিন একটি সুন্দর বই",
        bookCount: "১৫ টি বই",
        color: "from-rose-50 to-pink-50",
        borderColor: "border-rose-200/50",
        books: [
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200",
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=200",
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200",
        ]
    },
];

export default function CuratedReadingLists() {
    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-10">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            পড়ার তালিকা
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">আমাদের বিশেষজ্ঞদের দ্বারা বাছাই করা বইয়ের তালিকা</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {recommendations.map((list) => (
                        <Link
                            href={`/reading-list/${list.id}`}
                            key={list.id}
                            className={`group flex flex-col p-4 md:p-5 rounded-2xl bg-gradient-to-br ${list.color} border ${list.borderColor} hover:shadow-lg transition-all duration-300`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-2xl md:text-3xl">{list.emoji}</span>
                                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 bg-white/70 px-2 py-0.5 rounded-full">{list.bookCount}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 leading-tight group-hover:text-brand-green transition-colors">
                                {list.listTitle}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed mb-4 flex-1">
                                {list.description}
                            </p>

                            {/* Book Cover Stack */}
                            <div className="flex items-center">
                                <div className="flex -space-x-4">
                                    {list.books.map((bookImg, idx) => (
                                        <div key={idx} className="w-10 h-14 md:w-12 md:h-16 rounded-md overflow-hidden border-2 border-white shadow-sm relative">
                                            <Image src={bookImg} alt="বই" fill unoptimized className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <span className="ml-3 text-[10px] md:text-xs font-bold text-brand-green group-hover:text-brand-green-dark transition-colors">
                                    দেখুন →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
