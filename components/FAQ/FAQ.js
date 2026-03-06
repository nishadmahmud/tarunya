"use client";

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function FAQ() {
    const faqs = [
        { question: "ডেলিভারি কত দিনে পাব?", answer: "ঢাকার ভেতরে ১-২ দিনে এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি দেওয়া হয়।" },
        { question: "বই কি আসল ও নতুন?", answer: "হ্যাঁ, আমরা শুধুমাত্র ১০০% আসল ও নতুন বই বিক্রি করি। প্রতিটি বই সরাসরি প্রকাশকদের কাছ থেকে সংগ্রহ করা হয়।" },
        { question: "ক্যাশ অন ডেলিভারি আছে?", answer: "হ্যাঁ, ঢাকার ভেতরে ক্যাশ অন ডেলিভারি সুবিধা পাবেন। এছাড়া বিকাশ, নগদ ও কার্ডেও পেমেন্ট করতে পারবেন।" },
        { question: "বই ফেরত দেওয়া যায়?", answer: "ত্রুটিপূর্ণ বই পেলে ৩ দিনের মধ্যে ফেরত নিতে পারবেন। আমরা দ্রুত প্রতিস্থাপন করে দেব।" },
        { question: "অর্ডার কিভাবে ট্র্যাক করব?", answer: "অর্ডার করার পর আপনি ইনভয়েস নম্বর পাবেন। সেটি দিয়ে আমাদের 'অর্ডার ট্র্যাক' পেজ থেকে সহজেই ট্র্যাক করতে পারবেন।" },
        { question: "পাইকারি মূল্যে বই কেনা যায়?", answer: "হ্যাঁ, লাইব্রেরি বা প্রতিষ্ঠানের জন্য পাইকারি মূল্যে বই কেনার সুবিধা আছে। আমাদের সাথে যোগাযোগ করুন।" },
    ];

    return (
        <section className="bg-white py-16 md:py-24 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Left side: Header */}
                    <div className="lg:w-1/3">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                            প্রশ্ন <span className="text-brand-green">উত্তর</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 mb-8 font-medium">
                            আমাদের বই, ডেলিভারি এবং সেবা সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর। আরও প্রশ্ন থাকলে যোগাযোগ করুন।
                        </p>
                    </div>

                    {/* Right side: Grid of FAQs */}
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="flex flex-col">
                                <h4 className="text-[15px] md:text-lg font-bold text-gray-900 mb-2 md:mb-3 leading-snug">
                                    {faq.question}
                                </h4>
                                <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-sm">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
