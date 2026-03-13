export const metadata = {
    title: 'যোগাযোগ | তারুণ্য প্রকাশন',
    description: 'তারুণ্য প্রকাশনের সাথে যোগাযোগ করুন। আপনার যেকোনো বই বা অর্ডার সংক্রান্ত তথ্যের জন্য আমরা সবসময় প্রস্তুত।',
};

import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-green/10 via-brand-green-light to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">যোগাযোগ <span className="text-brand-green">করুন</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        আপনার কোনো প্রশ্ন বা পরামর্শ আছে? আমাদেরকে জানান, আমরা দ্রুততম সময়ে আপনার সাথে যোগাযোগ করব ইনশাআল্লাহ।
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">আমাদের ঠিকানা ও তথ্য</h2>
                            <div className="space-y-5">
                                {[
                                    { label: 'ঠিকানা', value: 'Shop No: 13, 1st Floor, Islami Tower, 11/1, Banglabazar, Dhaka-1100.', icon: <MapPin className="w-6 h-6" /> },
                                    { label: 'ফোন', value: '01979-456721', icon: <Phone className="w-6 h-6" /> },
                                    { label: 'ইমেইল', value: 'tarunyaprokashon@gmail.com', icon: <Mail className="w-6 h-6" /> },
                                    { label: 'অফিসের সময়সূচী', value: 'শনি - বৃহস্পতি: সকাল ১০টা - রাত ৮টা', icon: <Clock className="w-6 h-6" /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-brand-green bg-brand-green-light p-2.5 rounded-lg border border-brand-green/20 flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                                            <p className="font-semibold text-gray-800">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">আমাদেরকে মেসেজ দিন</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">আপনার নাম</label>
                                <input type="text" placeholder="পুরো নাম" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ইমেইল ঠিকানা</label>
                                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">মোবাইল নম্বর</label>
                                <input type="tel" placeholder="+৮৮০ ১..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">আপনার বক্তব্য</label>
                                <textarea rows={4} placeholder="কীভাবে আমরা আপনাকে সাহায্য করতে পারি?" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green resize-none" />
                            </div>
                            <button type="button" className="w-full bg-brand-green text-white font-bold py-3 text-lg rounded-xl hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20">
                                মেসেজ পাঠান
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
