"use client";

import { FaStar } from 'react-icons/fa';

export default function Testimonials() {
    const reviews = [
        { id: 1, name: "রহিম আহমেদ", role: "নিয়মিত পাঠক", rating: 5, text: "তারুণ্য প্রকাশন থেকে প্রতিবার বই কিনে সন্তুষ্ট। প্যাকেজিং দারুণ এবং ডেলিভারি খুব দ্রুত।", avatar: "র" },
        { id: 2, name: "তাসনিয়া ফারিন", role: "সাহিত্যপ্রেমী", rating: 5, text: "বইয়ের কোয়ালিটি অসাধারণ! এত কম দামে এত ভালো মানের বই আর কোথাও পাইনি।", avatar: "ত" },
        { id: 3, name: "ইমরান খান", role: "শিক্ষার্থী", rating: 4, text: "পরীক্ষার প্রস্তুতির জন্য যে বইগুলো দরকার ছিল সব পেয়ে গেছি। কাস্টমার সার্ভিসও ভালো।", avatar: "ই" },
        { id: 4, name: "নুসরাত জাহান", role: "অভিভাবক", rating: 5, text: "আমার বাচ্চাদের জন্য দারুণ সব বই পেলাম। শিশুদের বইয়ের সংগ্রহ সত্যিই চমৎকার!", avatar: "ন" },
        { id: 5, name: "সাকিব হাসান", role: "বই সংগ্রাহক", rating: 5, text: "রেয়ার বইও এখানে পাওয়া যায়। সংগ্রহ বাড়ানোর জন্য তারুণ্য প্রকাশনের জুড়ি নেই।", avatar: "স" },
        { id: 6, name: "মালিহা রহমান", role: "শিক্ষিকা", rating: 4, text: "ক্লাসের জন্য বই অর্ডার করেছিলাম, ২ দিনেই পেয়ে গেছি। সেবায় খুবই সন্তুষ্ট।", avatar: "ম" },
    ];

    return (
        <section className="bg-brand-cream/40 py-14 md:py-20 text-gray-900 border-b border-gray-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-3 text-gray-900">
                        পাঠকদের মতামত
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 mb-5 max-w-xl mx-auto">
                        আমাদের সেবা ও বইয়ের মান সম্পর্কে পাঠকরা যা বলছেন
                    </p>
                    <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                        <span className="text-lg md:text-xl font-black text-gray-900">৪.৯</span>
                        <div className="flex gap-0.5 text-brand-gold text-sm">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-gray-400">২,৫০০+ রিভিউ</span>
                    </div>
                </div>

                {/* Marquee */}
                <div className="relative overflow-hidden py-2">
                    <div className="animate-marquee flex gap-4 md:gap-6">
                        {[...reviews, ...reviews].map((review, idx) => (
                            <div key={`${review.id}-${idx}`} className="w-[280px] md:w-[360px] shrink-0">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ review }) {
    return (
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-green/20 transition-all duration-300 flex flex-col items-start text-left h-full">
            <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-[11px] md:text-[13px] ${i < review.rating ? 'text-brand-gold' : 'text-gray-200'}`} />
                ))}
            </div>
            <p className="text-gray-700 text-[13px] md:text-sm leading-relaxed mb-6 font-medium">
                &quot;{review.text}&quot;
            </p>
            <div className="flex items-center gap-3 mt-auto w-full pt-4 border-t border-gray-50">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green font-bold text-sm border border-brand-green/15 shrink-0">
                    {review.avatar}
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">{review.name}</h4>
                    <p className="text-[10px] font-semibold text-gray-400 leading-none truncate">{review.role}</p>
                </div>
            </div>
        </div>
    );
}
