import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiBell } from 'react-icons/fi';

const upcomingBooks = [
    {
        id: 301,
        title: "নতুন পৃথিবীর গল্প",
        author: "হুমায়ূন আহমেদ",
        price: "৳ 480",
        releaseDate: "মার্চ ২০২৬",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
        preOrderDiscount: "১৫% ছাড়"
    },
    {
        id: 302,
        title: "ইতিহাসের অজানা অধ্যায়",
        author: "মুনীর চৌধুরী",
        price: "৳ 550",
        releaseDate: "এপ্রিল ২০২৬",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
        preOrderDiscount: "১০% ছাড়"
    },
    {
        id: 303,
        title: "ছোটদের বিজ্ঞান যাত্রা",
        author: "মুহম্মদ জাফর ইকবাল",
        price: "৳ 320",
        releaseDate: "মার্চ ২০২৬",
        imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400",
        preOrderDiscount: "২০% ছাড়"
    },
    {
        id: 304,
        title: "আলোর পথে যাত্রা",
        author: "সেলিনা হোসেন",
        price: "৳ 420",
        releaseDate: "এপ্রিল ২০২৬",
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400",
        preOrderDiscount: "১৫% ছাড়"
    },
];

export default function PreOrderBooks() {
    return (
        <section className="bg-gradient-to-b from-white to-brand-cream/30 py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-10">
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-brand-green-light text-brand-green text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-2">
                            <FiBell size={12} /> শীঘ্রই আসছে
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            প্রি-অর্ডার বই
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">আগেই অর্ডার করুন, বিশেষ ছাড় পান</p>
                    </div>
                    <Link href="#" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    {upcomingBooks.map((book) => (
                        <Link
                            href="#"
                            key={book.id}
                            className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-brand-green/20 transition-all duration-300 flex flex-col"
                        >
                            {/* Book Cover */}
                            <div className="relative aspect-[3/4] bg-brand-cream overflow-hidden">
                                <Image
                                    src={book.imageUrl}
                                    alt={book.title}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Pre-order Badge */}
                                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                                    <span className="bg-brand-green text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                        প্রি-অর্ডার
                                    </span>
                                    <span className="bg-brand-gold text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                        {book.preOrderDiscount}
                                    </span>
                                </div>
                                {/* Release Date */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <div className="flex items-center gap-1 text-white/90 text-[9px] md:text-[10px] font-medium">
                                        <FiClock size={10} /> প্রকাশ: {book.releaseDate}
                                    </div>
                                </div>
                            </div>

                            {/* Book Info */}
                            <div className="p-3 md:p-4 flex flex-col flex-1">
                                <span className="text-[10px] md:text-[11px] font-semibold text-brand-green mb-1 truncate">{book.author}</span>
                                <h3 className="text-[12px] md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-brand-green transition-colors">
                                    {book.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-auto">
                                    <span className="text-brand-green-dark font-extrabold text-sm md:text-base">{book.price}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
