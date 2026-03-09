import Link from 'next/link';

export const metadata = {
    title: 'রিটার্ন ও রিফান্ড পলিসি | তারুণ্য প্রকাশন',
    description: 'তারুণ্য প্রকাশন থেকে কেনা বইয়ের রিটার্ন এবং রিফান্ড পলিসি সম্পর্কে বিস্তারিত জানুন।',
};

export default function WarrantyPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-gradient-to-br from-brand-green/10 via-brand-green-light to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">রিটার্ন ও রিফান্ড <span className="text-brand-green">পলিসি</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        বই সংক্রান্ত যেকোনো অনাকাঙ্ক্ষিত সমস্যার ক্ষেত্রে আমাদের রিটার্ন এবং রিফান্ড পলিসি নিচে দেওয়া হলো।
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">রিটার্ন পলিসি</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">গ্রাহক সন্তুষ্টি আমাদের প্রধান লক্ষ্য। তবে যদি কোনো কারণে আপনি ত্রুটিপূর্ণ বই বা ভুল বই পেয়ে থাকেন, তবে আমরা তা পরিবর্তন করে দেওয়ার ব্যবস্থা গ্রহণ করি।</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>**ভুল বই:** আপনি যে বইগুলোর অর্ডার করেছেন তার পরিবর্তে অন্য কোনো বই ডেলিভারি করা হলে।</li>
                        <li>**ত্রুটিপূর্ণ বই:** বইয়ের পৃষ্ঠা ছেঁড়া, উল্টোপাল্টা ছাপা, অথবা অপরিষ্কার কালির কারণে পড়া কষ্টকর হলে।</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">রিটার্ন করার শর্তাবলি</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>পণ্য হাতে পাওয়ার ৪৮ ঘণ্টার (২ দিন) মধ্যে অভিযোগ জানাতে হবে।</li>
                        <li>বইয়ের অবস্থা অবিকৃত থাকতে হবে (কোনো কাটাকাটি, দাগ বা ব্যবহার করা বই গ্রহণযোগ্য নয়)।</li>
                        <li>প্যাকেজ খোলার সময় অবশ্যই একটি ভিডিও ধারণ করে প্রমাণস্বরূপ আমাদের পাঠাতে হবে।</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">রিফান্ড পলিসি ও পদ্ধতি</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>যদি স্টক শেষ থাকার কারণে ত্রুটিপূর্ণ বা ভুল বই পরিবর্তন করে দেওয়া সম্ভব না হয়, তবে পুরো টাকা রিফান্ড করা হবে।</li>
                        <li>রিটার্ন প্রক্রিয়া সম্পন্ন হওয়ার পর, এবং বইটি আমাদের গুদামে পৌঁছানোর পর ৩-৭ কার্যদিবসের মধ্যে আপনার বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে টাকা রিফান্ড করা হবে।</li>
                        <li>পেমেন্ট সংক্রান্ত কোনো কারিগরি ত্রুটির কারণে অতিরিক্ত চার্জ কাটা হলে তা রিফান্ডযোগ্য।</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">যেভাবে ক্লেম করবেন</h2>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                        <li>বই পাওয়ার ৪৮ ঘণ্টার মধ্যে আমাদের হেল্পলাইনে কল করুন অথবা ইমেইলে যোগাযোগ করুন।</li>
                        <li>অর্ডার নম্বর উল্লেখ করুন এবং সাথে ত্রুটিযুক্ত অংশের ছবি বা আনবক্সিং ভিডিও পাঠান।</li>
                        <li>আমাদের কাস্টমার কেয়ার প্রতিনিধি আপনার সাথে কথা বলে পরবর্তী ধাপ জানিয়ে দেবেন।</li>
                        <li>বিকল্প বই পাঠানো বা রিফান্ড করার জন্য প্রয়োজনীয় পদক্ষেপ নেওয়া হবে।</li>
                    </ol>
                </section>

                <div className="text-center pt-8 border-t border-gray-100">
                    <p className="text-gray-500 mb-4">যেকোনো সহযোগিতার প্রয়োজন?</p>
                    <Link href="/contact" className="inline-block bg-brand-green text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20">
                        যোগাযোগ করুন
                    </Link>
                </div>
            </div>
        </div>
    );
}
