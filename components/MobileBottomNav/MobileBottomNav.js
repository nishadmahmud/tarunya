"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiPercent, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount, openCart } = useCart();
    const { user, openAuthModal } = useAuth();

    const isActive = (path) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-brand-green-dark border-t border-white/10 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            <div className="flex justify-around items-center py-1.5 px-2">
                {/* Home */}
                <Link href="/" className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors ${isActive('/') ? 'text-brand-gold' : 'text-white/50 hover:text-white/80'}`}>
                    <FiHome size={19} />
                    <span className="text-[9px] font-bold">হোম</span>
                </Link>

                {/* Offers */}
                <Link href="/special-offers" className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors relative ${isActive('/special-offers') ? 'text-brand-gold' : 'text-white/50 hover:text-white/80'}`}>
                    <div className="relative">
                        <FiPercent size={19} />
                        {!isActive('/special-offers') && (
                            <span className="absolute -top-2 -right-3 flex h-4 w-auto min-w-[12px]">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 px-1 bg-red-600 text-[6px] text-white font-black items-center justify-center uppercase tracking-tighter shadow-sm">
                                    HOT
                                </span>
                            </span>
                        )}
                    </div>
                    <span className="text-[9px] font-bold">অফার</span>
                </Link>

                {/* Cart */}
                <button onClick={openCart} className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl text-white/50 hover:text-white/80 transition-colors relative">
                    <FiShoppingCart size={19} />
                    {cartCount > 0 && (
                        <span className="absolute top-0.5 right-1.5 bg-brand-gold text-white text-[7px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-brand-green-dark">
                            {cartCount}
                        </span>
                    )}
                    <span className="text-[9px] font-bold">কার্ট</span>
                </button>

                {/* Profile / Login */}
                <button 
                    onClick={() => user ? router.push('/profile') : openAuthModal('login')} 
                    className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors ${isActive('/profile') ? 'text-brand-gold' : 'text-white/50 hover:text-white/80'}`}
                >
                    <FiUser size={19} />
                    <span className="text-[9px] font-bold">{user ? 'প্রোফাইল' : 'লগইন'}</span>
                </button>
            </div>
        </nav>
    );
}
