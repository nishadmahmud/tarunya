import { FiTruck, FiAward, FiLock, FiBookOpen } from 'react-icons/fi';

export default function TrustStats() {
    const stats = [
        { label: "আসল বই", desc: "১০০% অথেনটিক", icon: <FiAward /> },
        { label: "বিশাল সংগ্রহ", desc: "১০০০+ বই", icon: <FiBookOpen /> },
        { label: "দ্রুত ডেলিভারি", desc: "সারাদেশে", icon: <FiTruck /> },
        { label: "নিরাপদ পেমেন্ট", desc: "সুরক্ষিত চেকআউট", icon: <FiLock /> },
    ];

    return (
        <section className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 md:px-5 py-2 md:py-3 rounded-xl bg-brand-green-light/30 border border-brand-green/5 group hover:bg-brand-green-light/60 transition-colors">
                            <div className="text-xl md:text-2xl text-brand-green group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                {stat.icon}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] md:text-[13px] font-bold text-gray-800 leading-tight truncate">{stat.label}</span>
                                <span className="text-[9px] md:text-[11px] font-medium text-gray-400 truncate">{stat.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}