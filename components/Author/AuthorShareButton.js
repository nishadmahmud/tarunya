"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AuthorShareButton() {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            toast.success("প্রোফাইল লিংকটি কপি করা হয়েছে!");
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
            toast.error("লিংকটি কপি করা সম্ভব হয়নি।");
        }
    };

    return (
        <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-green text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm active:scale-95"
        >
            {isCopied ? (
                <>
                    <Check className="w-4 h-4" />
                    লিংক কপি হয়েছে
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    প্রোফাইল শেয়ার করুন
                </>
            )}
        </button>
    );
}
