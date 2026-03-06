"use client";

import { useState } from 'react';

export default function ProductTabs({ description, specifications }) {
    const [activeTab, setActiveTab] = useState('description');

    return (
        <div className="mt-12 md:mt-24 w-full">
            {/* Tabs Header */}
            <div className="flex items-center gap-6 md:gap-10 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('description')}
                    className={`cursor-pointer pb-4 text-[15px] md:text-[17px] font-bold transition-colors relative ${activeTab === 'description'
                        ? 'text-[#ff2a3b]'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    Description
                    {activeTab === 'description' && (
                        <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#ff2a3b] rounded-t-lg"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('specifications')}
                    className={`cursor-pointer pb-4 text-[15px] md:text-[17px] font-bold transition-colors relative ${activeTab === 'specifications'
                        ? 'text-[#ff2a3b]'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    Specifications
                    {activeTab === 'specifications' && (
                        <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#ff2a3b] rounded-t-lg"></span>
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed md:leading-loose">
                {activeTab === 'description' ? (
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: specifications }} />
                )}
            </div>
        </div>
    );
}
