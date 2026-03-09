export const metadata = {
    title: 'শর্তাবলী | তারুণ্য প্রকাশন',
    description: 'তারুণ্য প্রকাশনের ব্যবহারের নিয়মাবলী, শর্তাবলী এবং গোপনীয়তা নীতি সম্পর্কে বিস্তারিত জানুন।',
};

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gradient-to-br from-brand-green/10 via-brand-green-light to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">শর্তাবলী <span className="text-brand-green">(Terms & Conditions)</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        আমাদের সেবা গ্রহণ করার পূর্বে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">১. সাধারণ শর্তাবলী</h2>
                    <p className="text-gray-600 leading-relaxed">
                        তারুণ্য প্রকাশন এর ওয়েবসাইট ব্যবহার এবং অর্ডার করার মাধ্যমে আপনি এই শর্তাবলীর সাথে সম্মত হচ্ছেন বলে ধরে নেওয়া হবে। এই শর্তাবলী আমাদের ওয়েবসাইট এবং আমাদের সাথে আপনার যোগাযোগ সহ সকল ক্ষেত্রে প্রযোজ্য।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">২. বই বা প্রোডাক্ট ও মূল্য</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>সকল পণ্যের মূল্য বাংলাদেশী টাকায় (BDT) উল্লেখ করা হয়েছে এবং প্রযোজ্য কর অন্তর্ভুক্ত।</li>
                        <li>বইয়ের মূল্য এবং অফার পূর্ব ঘোষণা ছাড়াই পরিবর্তন করার অধিকার আমরা সংরক্ষণ করি।</li>
                        <li>বইয়ের প্রচ্ছদ বা ছবি শুধুমাত্র নির্দেশনার জন্য; প্রকাশনী পরিবর্তিত প্রচ্ছদ বা সংস্করণ প্রদান করতে পারে।</li>
                        <li>আমরা যেকোনো অর্ডারের পরিমাণ সীমিত করার অধিকার রাখি।</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৩. অর্ডার ও পেমেন্ট</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>সকল অর্ডার বইয়ের স্টক থাকা সাপেক্ষে গ্রহণ করা হবে।</li>
                        <li>আমরা ক্যাশ অন ডেলিভারি (COD) এবং মোবাইল ব্যাংকিং এর মাধ্যমে পেমেন্ট গ্রহণ করি।</li>
                        <li>যেকোনো যুক্তিসঙ্গত কারণে আমরা কোনো অর্ডার বাতিল বা গ্রহণ না করার অধিকার সংরক্ষণ করি।</li>
                        <li>অর্ডার কনফার্মেশন মানেই শতভাগ নিশ্চয়তা নয় যে বইটি স্টকে পাওয়া যাবে।</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৪. ডেলিভারি</h2>
                    <p className="text-gray-600 leading-relaxed">
                        আমরা বাংলাদেশের সব স্থানে ডেলিভারি করে থাকি। আপনার অবস্থান এবং কুরিয়ারের উপর ভিত্তি করে ডেলিভারির সময় পরিবর্তিত হতে পারে। চেকআউট করার সময় আনুমানিক ডেলিভারির সময় জানানো হবে। কুরিয়ার সার্ভিসের কোনো বিলম্বের জন্য তারুণ্য প্রকাশন দায়ী থাকবে না।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৫. গোপনীয়তা নীতি</h2>
                    <p className="text-gray-600 leading-relaxed">
                        আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। অর্ডার করার প্রক্রিয়ায় সংগৃহীত আপনার ব্যক্তিগত তথ্য শুধুমাত্র অর্ডার পূর্ণ করার জন্য এবং গ্রাহক সেবার জন্য ব্যবহার করা হয়। ডেলিভারি এবং পেমেন্ট প্রক্রিয়াকরণের প্রয়োজন ব্যতীত আমরা আপনার কোনো তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৬. মেধা সম্পদ</h2>
                    <p className="text-gray-600 leading-relaxed">
                        এই ওয়েবসাইটের সকল কন্টেন্ট, পাঠ্য বিষয়, ছবি, লোগো এবং ডিজাইন তারুণ্য প্রকাশন এর নিজস্ব সম্পদ এবং এটি মেধা সম্পদ আইন দ্বারা সুরক্ষিত। পূর্বানুমতি ব্যতিত এর ব্যবহার আইনত দণ্ডনীয়।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৭. দায়বদ্ধতার সীমাবদ্ধতা</h2>
                    <p className="text-gray-600 leading-relaxed">
                        আমাদের ওয়েবসাইট বা পণ্য ব্যবহারের কারণে উদ্ভূত কোনো পরোক্ষ বা বিশেষ ক্ষতির জন্য তারুণ্য প্রকাশন দায়ী থাকবে না।
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৮. যোগাযোগ</h2>
                    <p className="text-gray-600 leading-relaxed">
                        আমাদের শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে, অনুগ্রহ করে info@tarunno.com এ ইমেইল করুন অথবা আমাদের 'যোগাযোগ করুন' পেইজে ভিজিট করুন।
                    </p>
                </section>
            </div>
        </div>
    );
}
