import Image from 'next/image';
import Link from 'next/link';

const authors = [
    {
        id: 1,
        name: "হুমায়ূন আহমেদ",
        books: "১২০+ বই",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300",
        slug: "humayun-ahmed",
        initial: "হু"
    },
    {
        id: 2,
        name: "রবীন্দ্রনাথ ঠাকুর",
        books: "৮০+ বই",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300",
        slug: "rabindranath-tagore",
        initial: "র"
    },
    {
        id: 3,
        name: "কাজী নজরুল ইসলাম",
        books: "৬০+ বই",
        imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=300",
        slug: "kazi-nazrul-islam",
        initial: "ক"
    },
    {
        id: 4,
        name: "শরৎচন্দ্র চট্টোপাধ্যায়",
        books: "৩৫+ বই",
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300",
        slug: "sarat-chandra",
        initial: "শ"
    },
    {
        id: 5,
        name: "মুহম্মদ জাফর ইকবাল",
        books: "৫০+ বই",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300",
        slug: "jafor-iqbal",
        initial: "মু"
    },
    {
        id: 6,
        name: "আনিসুল হক",
        books: "৪৫+ বই",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300",
        slug: "anisul-haque",
        initial: "আ"
    },
];

export default function PopularAuthors() {
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
                    <Link href="#" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5">
                    {authors.map((author) => (
                        <Link
                            href="#"
                            key={author.id}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Author Avatar */}
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-brand-green-light to-brand-cream border-[3px] border-brand-green/20 flex items-center justify-center mb-3 group-hover:border-brand-green/50 group-hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                                <span className="text-2xl md:text-3xl font-black text-brand-green/40">{author.initial}</span>
                            </div>
                            <h3 className="text-[11px] md:text-sm font-bold text-gray-800 leading-tight group-hover:text-brand-green transition-colors mb-0.5 line-clamp-1">
                                {author.name}
                            </h3>
                            <span className="text-[9px] md:text-[11px] text-gray-400 font-medium">
                                {author.books}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
