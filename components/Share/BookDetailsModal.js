"use client";

import { X, BookOpen, Info, User as UserIcon, Globe, Languages, Calendar, Hash, Building2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function BookDetailsModal({ product, onClose }) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!product) return null;

    const specRows = [
        { label: 'বইয়ের নাম', value: product.name, icon: <BookOpen className="w-4 h-4" /> },
        { label: 'লেখক', value: product.author || "জানা নেই", icon: <UserIcon className="w-4 h-4" /> },
        { label: 'প্রকাশক', value: product.publisher || "জানা নেই", icon: <Building2 className="w-4 h-4" /> },
        { label: 'আইএসবিএন', value: product.isbn || "N/A", icon: <Hash className="w-4 h-4" /> },
        { label: 'সংস্করণ', value: product.edition || "N/A", icon: <Calendar className="w-4 h-4" /> },
        { label: 'পৃষ্ঠা সংখ্যা', value: product.pages || "N/A", icon: <Hash className="w-4 h-4" /> },
        { label: 'দেশ', value: product.country || "বাংলাদেশ", icon: <Globe className="w-4 h-4" /> },
        { label: 'ভাষা', value: product.language || "বাংলা", icon: <Languages className="w-4 h-4" />, isPill: true },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
            <div 
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[110] p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-brand-green shadow-md transition-all active:scale-95"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image Section */}
                <div className="md:w-2/5 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
                    <div className="relative w-full aspect-[3/4] shadow-2xl rounded-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                        <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Right: Info Section */}
                <div className="md:w-3/5 overflow-y-auto overflow-x-hidden min-w-0 p-6 md:p-10 space-y-8 scrollbar-hide">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                            {product.name}
                        </h2>
                        <p className="text-2xl font-black text-brand-green">
                            ৳{Number(product.numericPrice).toLocaleString('en-US')}
                        </p>
                    </div>

                    {/* Tabs / Content Sections */}
                    <div className="space-y-8">
                        {/* Specifications Card */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-brand-green" /> বইয়ের তথ্য
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {specRows.map((row, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm shrink-0">
                                            {row.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{row.label}</p>
                                            <p className={`text-sm font-bold text-gray-800 truncate ${row.isPill ? 'text-brand-green' : ''}`}>
                                                {row.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Summary Section */}
                        {product.description && (
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-brand-green" /> সারসংক্ষেপ
                                </h3>
                                <div 
                                    className="text-gray-600 text-sm md:text-base leading-relaxed prose prose-sm max-w-full break-words overflow-x-hidden"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
