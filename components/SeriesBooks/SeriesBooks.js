"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

export default function SeriesBooks({ seriesSets = [] }) {
    // State to track which series is currently expanded (folder open)
    const [expandedSeriesId, setExpandedSeriesId] = useState(null);

    const toggleSeries = (id) => {
        setExpandedSeriesId(expandedSeriesId === id ? null : id);
    };

    // Dummy fallback data if empty
    const displaySeries = seriesSets && seriesSets.length > 0 ? seriesSets : [
        {
            id: 201,
            title: "সীরাত ইবনে হিশাম (১ম পর্ব - ৫ম পর্ব)",
            author: "ইবনে হিশাম (রহ.)",
            price: "৳ ১,৮৫০",
            oldPrice: "৳ ২,৫০০",
            discount: "২৬% ছাড়",
            description: "নবী জীবনের সবচেয়ে নির্ভরযোগ্য ও প্রামাণ্য ইতিহাস। ৫ খণ্ডের এই অনবদ্য সিরিজটি প্রতিটি মুসলিমের সংগ্রহে রাখা প্রয়োজন।",
            coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600",
            volumes: [
                { id: "v1", title: "সীরাত ইবনে হিশাম - ১ম খণ্ড", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
                { id: "v2", title: "সীরাত ইবনে হিশাম - ২য় খণ্ড", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
                { id: "v3", title: "সীরাত ইবনে হিশাম - ৩য় খণ্ড", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" },
                { id: "v4", title: "সীরাত ইবনে হিশাম - ৪র্থ খণ্ড", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400" },
                { id: "v5", title: "সীরাত ইবনে হিশাম - ৫ম খণ্ড", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400" }
            ]
        },
        {
            id: 202,
            title: "তাফসীরে ইবনে কাসীর (১-৪ খণ্ড)",
            author: "ইবনে কাসীর (রহ.)",
            price: "৳ ২,২০০",
            oldPrice: "৳ ২,৮০০",
            discount: "২১% ছাড়",
            description: "কুরআনের শ্রেষ্ঠ তাফসীর। ৪ খণ্ডের এই সেটটি পবিত্র কুরআনের গভীর অর্থ ও তাৎপর্য বোঝার জন্য অপরিহার্য।",
            coverImage: "https://images.unsplash.com/photo-1604868102170-c75c88b0a9cd?q=80&w=600",
            volumes: [
                { id: "v1", title: "তাফসীরে ইবনে কাসীর - ১ম খণ্ড", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400" },
                { id: "v2", title: "তাফসীরে ইবনে কাসীর - ২য় খণ্ড", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" },
                { id: "v3", title: "তাফসীরে ইবনে কাসীর - ৩য় খণ্ড", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" },
                { id: "v4", title: "তাফসীরে ইবনে কাসীর - ৪র্থ খণ্ড", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400" }
            ]
        }
    ];

    return (
        <section className="bg-brand-cream/30 py-12 md:py-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        সিরিজ ও <span className="text-brand-green">রচনাবলী সেট</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
                        একসাথে কিনুন পুরো সিরিজ। যেকোনো সিরিজে ক্লিক করে ভেতরের সবগুলো খণ্ড এক নজরে দেখে নিন।
                    </p>
                </div>

                {/* Series List */}
                <div className="space-y-6 md:space-y-8">
                    {displaySeries.map((series) => {
                        const isExpanded = expandedSeriesId === series.id;

                        return (
                            <div
                                key={series.id}
                                className={`bg-white rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-brand-green shadow-lg ring-1 ring-brand-green/20' : 'border-gray-200 shadow-sm hover:border-brand-green/50 hover:shadow-md'
                                    }`}
                            >
                                {/* Main Series Card (Always visible) */}
                                <div
                                    className="flex flex-col md:flex-row cursor-pointer"
                                    onClick={() => toggleSeries(series.id)}
                                >
                                    {/* Cover Image */}
                                    <div className="w-full md:w-1/4 aspect-[2/1] md:aspect-square relative bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={series.coverImage}
                                            alt={series.title}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                        {series.discount && (
                                            <div className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                                                {series.discount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Contents */}
                                    <div className="p-5 md:p-8 flex flex-col justify-center flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-brand-green transition-colors">
                                                    {series.title}
                                                </h3>
                                                <p className="text-brand-green font-medium text-sm mb-3">
                                                    {series.author}
                                                </p>
                                            </div>

                                            {/* Expand Icon */}
                                            <div className={`p-2 rounded-full border flex-shrink-0 transition-colors ${isExpanded ? 'bg-brand-green text-white border-brand-green' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                                {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-6">
                                            {series.description}
                                        </p>

                                        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl md:text-3xl font-black text-brand-green">{series.price}</span>
                                                {series.oldPrice && <span className="text-sm text-gray-400 line-through">{series.oldPrice}</span>}
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <button
                                                    className="flex-grow sm:flex-grow-0 bg-brand-gold hover:bg-yellow-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-brand-gold/20"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent opening the folder when clicking buy
                                                        // Fallback logic for client presentation
                                                    }}
                                                >
                                                    <FiShoppingCart size={18} />
                                                    পুরো সেট কিনুন
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded "Folder" Content - Individual Volumes */}
                                <div
                                    className={`transition-all duration-500 ease-in-out overflow-hidden bg-gray-50/50 ${isExpanded ? 'max-h-[1000px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="p-5 md:p-8">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="h-px bg-gray-200 flex-grow"></div>
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">
                                                সিরিজের অন্তর্ভুক্ত খণ্ডসমূহ ({series.volumes.length}টি)
                                            </span>
                                            <div className="h-px bg-gray-200 flex-grow"></div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                                            {series.volumes.map((vol) => (
                                                <div key={vol.id} className="group cursor-pointer">
                                                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-3">
                                                        <Image
                                                            src={vol.image}
                                                            alt={vol.title}
                                                            fill
                                                            unoptimized
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <h4 className="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight line-clamp-2 group-hover:text-brand-green transition-colors">
                                                        {vol.title}
                                                    </h4>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 text-center bg-brand-green-light py-4 rounded-xl border border-brand-green/20">
                                            <p className="text-xs md:text-sm text-brand-green-dark font-medium flex items-center justify-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                                                এই সিরিজের খণ্ডগুলো আলাদাভাবে বিক্রি করা হয় না। একসাথে কেনার জন্য উপরের <strong>"পুরো সেট কিনুন"</strong> বাটনে ক্লিক করুন।
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
