"use client";

import { useShareSelection } from "../../context/ShareSelectionContext";
import { Share2, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ShareBar() {
    const { selectedIds, clearSelection } = useShareSelection();
    const [isCopied, setIsCopied] = useState(false);

    if (selectedIds.length === 0) return null;

    const generateLink = () => {
        const baseUrl = window.location.origin;
        const shareLink = `${baseUrl}/share/${selectedIds.join(',')}`;
        
        navigator.clipboard.writeText(shareLink).then(() => {
            setIsCopied(true);
            toast.success("লিংকটি কপি করা হয়েছে!");
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            toast.error("লিংকটি কপি করা সম্ভব হয়নি।");
        });
    };

    return (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-lg">
            <div className="bg-brand-green text-white rounded-2xl shadow-2xl shadow-brand-green/30 p-4 md:p-5 flex items-center justify-between gap-4 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[12px] md:text-sm font-bold leading-tight">বই শেয়ার করুন</p>
                        <p className="text-[10px] md:text-[11px] opacity-80">{selectedIds.length}টি বই সিলেক্ট করা হয়েছে</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={clearSelection}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
                        title="ক্লিয়ার করুন"
                    >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    
                    <button 
                        onClick={generateLink}
                        className="bg-white text-brand-green px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[12px] md:text-sm font-black flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-4 h-4" /> কপি হয়েছে
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" /> লিংক কপি করুন
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
