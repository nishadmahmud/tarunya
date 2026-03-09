import Link from 'next/link';

export const metadata = {
    title: 'আমাদের সম্পর্কে | তারুণ্য প্রকাশন',
    description: 'তারুণ্য প্রকাশন সম্পর্কে জানুন — খাঁটি ইসলামী বই, কুরআন ও সুন্নাহ ভিত্তিক প্রকাশনার বিশ্বস্ত প্রতিষ্ঠান।',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-green/10 via-brand-green-light to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">আমাদের <span className="text-brand-green">সম্পর্কে</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        তারুণ্য প্রকাশন — কুরআন ও সুন্নাহর আলোকে বিশুদ্ধ ইসলামী জ্ঞান ছড়িয়ে দেওয়ার প্রত্যয়ে অঙ্গীকারবদ্ধ একটি প্রতিষ্ঠান।
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">আমরা কারা?</h2>
                    <p className="text-gray-600 leading-relaxed">
                        তারুণ্য প্রকাশন বাংলাদেশের একটি জনপ্রিয় ও উদীয়মান ইসলামী প্রকাশনা সংস্থা। আমরা বিশ্বাস করি, তরুণ সমাজ ও পরবর্তী প্রজন্মের মাঝে বিশুদ্ধ দ্বীনি জ্ঞান ছড়িয়ে দেওয়াই পরিবর্তনের মূল চাবিকাঠি। তাই আমরা প্রতিনিয়ত কুরআন, সুন্নাহ, সীরাত, ইতিহাস এবং ইসলামী জীবন ব্যবস্থার উপর মানসম্মত বই প্রকাশ করে আসছি। আমাদের প্রতিটি বই অভিজ্ঞ আলিম ও গবেষকদের দ্বারা পর্যালোচিত।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">আমাদের লক্ষ্য</h2>
                    <p className="text-gray-600 leading-relaxed">
                        আমাদের মূল লক্ষ্য হলো ইসলামকে সঠিকভাবে, সহজ সাবলীল ভাষায় মানুষের দোরগোড়ায় পৌঁছে দেওয়া। ভ্রান্ত মতবাদ ও অপসংস্কৃতির এই যুগে, তরুণদের মাঝে ইসলামী মূল্যবোধ, নৈতিকতা এবং আল্লাহর প্রতি ভালোবাসা জাগ্রত করাই তারুণ্য প্রকাশনের প্রধান উদ্দেশ্য।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">কেন আমাদের বেছে নিবেন?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'বিশুদ্ধ কন্টেন্ট', desc: 'কুরআন ও সহীহ সুন্নাহর আলোকে প্রমাণিত তথ্য ও প্রবন্ধ।' },
                            { title: 'সাশ্রয়ী মূল্য', desc: 'জ্ঞান সবার জন্য উন্মুক্ত রাখতে আমরা বইয়ের মূল্য সবসময় নাগালের মাঝে রাখি।' },
                            { title: 'সারাদেশে হোম ডেলিভারি', desc: 'দেশের যেকোনো প্রান্তে দ্রুততম সময়ে আপনার কাঙ্ক্ষিত বই পৌঁছে দেওয়া হয়।' },
                            { title: 'পছন্দনীয় উপহার', desc: 'ইসলামী বই হতে পারে প্রিয়জনকে দেওয়ার মত সেরা উপহার বস্তু।' },
                        ].map((item, i) => (
                            <div key={i} className="bg-brand-green-light/30 rounded-xl p-6 border border-brand-green/10">
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-gray-100">
                    <p className="text-gray-500 mb-4">কোনো প্রশ্ন আছে? আমরা আপনার কথা শুনতে আগ্রহী।</p>
                    <Link href="/contact" className="inline-block bg-brand-green text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20">
                        যোগাযোগ করুন
                    </Link>
                </div>
            </div>
        </div>
    );
}
