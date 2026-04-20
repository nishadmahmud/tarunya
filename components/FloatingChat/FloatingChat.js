"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMessageCircle, FiX } from "react-icons/fi";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

export default function FloatingChat() {
    const pathname = usePathname();
    const isShareLanding = pathname?.startsWith('/share');
    if (isShareLanding) return null;

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Show button only after scrolling a bit or just always? User said "always".
    // But maybe hide until 100px so it's not in the way of initial view.
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    const whatsappLink = "https://wa.me/8801979456721";
    const messengerLink = "https://m.me/107452717556893"; 

    return (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-[9999] flex flex-col items-center gap-4">
            {/* Expanded Menu */}
            <div 
                className={`flex flex-col gap-3 transition-all duration-300 transform origin-bottom ${
                    isOpen 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-50 translate-y-10 pointer-events-none"
                }`}
            >
                {/* Messenger */}
                <a 
                    href={messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform group relative"
                    title="Messenger"
                >
                    <FaFacebookMessenger size={24} />
                    <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        মেসেঞ্জার
                    </span>
                </a>

                {/* WhatsApp */}
                <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform group relative"
                    title="WhatsApp"
                >
                    <FaWhatsapp size={28} />
                    <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        হোয়াটসঅ্যাপ
                    </span>
                </a>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform ${
                    isOpen ? "bg-red-500 rotate-90" : "bg-brand-green hover:bg-brand-green-dark"
                } text-white group`}
                aria-label="Contact Us"
            >
                {isOpen ? (
                    <FiX size={28} />
                ) : (
                    <div className="relative">
                        <FiMessageCircle size={30} />
                        {/* Notification Dot */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-brand-green rounded-full animate-pulse"></span>
                    </div>
                )}
                
                {/* Tooltip (only when closed) */}
                {!isOpen && (
                    <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
                        সহযোগিতার জন্য ক্লিক করুন
                    </span>
                )}
            </button>
        </div>
    );
}
