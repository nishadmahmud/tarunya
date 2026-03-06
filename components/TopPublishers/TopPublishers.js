import Link from 'next/link';
import Image from 'next/image';

const publishers = [
    { id: 1, name: "অন্যপ্রকাশ", books: "৫০০+ বই", slug: "onno-prokash", color: "from-emerald-50 to-green-50" },
    { id: 2, name: "প্রথমা", books: "৪০০+ বই", slug: "prothoma", color: "from-amber-50 to-yellow-50" },
    { id: 3, name: "কাকলী", books: "৩৫০+ বই", slug: "kakoli", color: "from-blue-50 to-sky-50" },
    { id: 4, name: "আদর্শ", books: "৬০০+ বই", slug: "adarsha", color: "from-rose-50 to-pink-50" },
    { id: 5, name: "মাওলা ব্রাদার্স", books: "৮০০+ বই", slug: "mawla-brothers", color: "from-violet-50 to-purple-50" },
    { id: 6, name: "তামরিশ", books: "২০০+ বই", slug: "tamrish", color: "from-teal-50 to-cyan-50" },
];

export default function TopPublishers() {
    return (
        <section className="bg-white py-10 md:py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 md:px-6">
                <div className="flex items-end justify-between mb-6 md:mb-10">
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight mb-1">
                            জনপ্রিয় প্রকাশনী
                        </h2>
                        <p className="text-xs md:text-sm text-gray-400 hidden sm:block">বাংলাদেশের সেরা প্রকাশনা সংস্থা থেকে বই সংগ্রহ করুন</p>
                    </div>
                    <Link href="#" className="text-xs md:text-sm font-bold text-brand-green hover:text-brand-green-dark transition-colors whitespace-nowrap">
                        সব দেখুন →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                    {publishers.map((pub) => (
                        <Link
                            href="#"
                            key={pub.id}
                            className={`group flex flex-col items-center justify-center text-center p-5 md:p-6 rounded-2xl bg-gradient-to-br ${pub.color} border border-gray-100 hover:border-brand-green/20 hover:shadow-md transition-all duration-300`}
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                                <span className="text-xl md:text-2xl font-black text-gray-700">{pub.name.charAt(0)}</span>
                            </div>
                            <h3 className="text-[12px] md:text-sm font-bold text-gray-800 group-hover:text-brand-green transition-colors mb-0.5 leading-tight">
                                {pub.name}
                            </h3>
                            <span className="text-[9px] md:text-[11px] text-gray-400 font-medium">
                                {pub.books}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
