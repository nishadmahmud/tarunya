"use client";

import { useState } from 'react';

export default function ProductTabs({ product }) {
    const [activeTab, setActiveTab] = useState('summary');

    const tabs = [
        { id: 'summary', label: 'সারসংক্ষেপ' },
        { id: 'specification', label: 'বইয়ের তথ্য' },
        { id: 'author', label: 'লেখক' },
    ];

    const specRows = [
        { label: 'বইয়ের নাম', value: product.name },
        { label: 'লেখক', value: product.author, isLink: true },
        { label: 'প্রকাশক', value: product.publisher, isLink: true },
        { label: 'আইএসবিএন', value: product.isbn },
        { label: 'সংস্করণ', value: product.edition },
        { label: 'পৃষ্ঠা সংখ্যা', value: product.pages },
        { label: 'দেশ', value: product.country },
        { label: 'ভাষা', value: product.language, isPill: true },
    ];

    return (
        <div className="mt-12 md:mt-24 w-full">
            {/* Tabs Header */}
            <div className="flex items-center border-b border-gray-200 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`cursor-pointer px-6 md:px-8 pb-4 text-[15px] md:text-[16px] font-medium transition-all relative ${
                            activeTab === tab.id
                                ? 'text-brand-green'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-brand-green rounded-t-lg shadow-[0_-2px_8px_rgba(22,163,74,0.3)]"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[200px]">
                {activeTab === 'summary' && (
                    <div className="prose prose-sm md:prose-base max-w-full text-gray-600 leading-relaxed md:leading-loose break-words overflow-x-hidden">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                )}

                {activeTab === 'specification' && (
                    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {specRows.map((row, index) => (
                                    <tr 
                                        key={index} 
                                        className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} border-b border-gray-100 last:border-0`}
                                    >
                                        <td className="py-4 px-6 text-sm md:text-base font-semibold text-gray-700 w-1/3 md:w-1/4">
                                            {row.label}
                                        </td>
                                        <td className="py-4 px-6 text-sm md:text-base text-gray-600">
                                            {row.isLink ? (
                                                <span className="text-brand-green hover:underline cursor-pointer transition-all">
                                                    {row.value}
                                                </span>
                                            ) : row.isPill ? (
                                                <span className="bg-brand-green text-white px-3 py-1 rounded-md text-xs md:text-sm font-medium shadow-sm">
                                                    {row.value}
                                                </span>
                                            ) : (
                                                row.value
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'author' && (
                    <div className="prose prose-sm md:prose-base max-w-full text-gray-600">
                        {product.authorDetails ? (
                            <>
                                <p className="font-semibold text-gray-800 text-lg mb-4">{product.authorDetails.name}</p>
                                <div 
                                    className="leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.authorDetails.description || product.authorDetails.bio || ' লেখকের জীবনী পাওয়া যায়নি।' }} 
                                />
                            </>
                        ) : (
                            <div className="py-6">
                                <p className="font-semibold text-gray-800 text-lg mb-2">{product.author}</p>
                                <p className="text-gray-500 italic">দুঃখিত, এই লেখকের বিস্তারিত তথ্য এই মুহূর্তে পাওয়া যায়নি।</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
