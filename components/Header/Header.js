"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronRight, FiGrid } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { searchProducts } from '../../lib/api';

export default function Header({ categories = [] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [activeSearchCategory, setActiveSearchCategory] = useState('all');

  const { cartCount, openCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const defaultCategories = [];
  const displayCategories = categories && categories.length > 0 ? categories : [];

  const handleUserClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      openAuthModal('login');
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const runSearch = async (q) => {
    if (!q) {
      setIsSearchOpen(false);
      setSearchResults([]);
      setSearchCategories([]);
      setSearchError('');
      return;
    }

    setIsSearchOpen(true);
    setIsSearching(true);
    setSearchError('');

    try {
      const res = await searchProducts(q);
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      const mapped = items.map((p) => {
        const basePrice = Number(p.retails_price || p.discounted_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = String(p.discount_type || '').toLowerCase();
        const hasDiscount = discountValue > 0 && discountType !== '0';

        const price = hasDiscount
          ? discountType === 'percentage'
            ? Math.max(0, Math.round(basePrice * (1 - discountValue / 100)))
            : Math.max(0, basePrice - discountValue)
          : basePrice;

        const discountLabel = hasDiscount
          ? discountType === 'percentage'
            ? `-${discountValue}%`
            : `৳ ${discountValue.toLocaleString('en-IN')}`
          : null;

        const imageUrl =
          p.image_path ||
          p.image_path1 ||
          p.image_path2 ||
          (Array.isArray(p.image_paths) && p.image_paths[0]) ||
          '/no-image.svg';

        return {
          id: p.id,
          name: p.name,
          price: `৳ ${price.toLocaleString('en-IN')}`,
          oldPrice: hasDiscount ? `৳ ${basePrice.toLocaleString('en-IN')}` : null,
          discount: discountLabel,
          imageUrl,
          brand: p.brands?.name || '',
          categoryName: p.category?.name || 'অন্যান্য',
        };
      });

      setSearchResults(mapped);

      const categorySet = new Set(mapped.map((m) => m.categoryName));
      const cats = Array.from(categorySet).sort();
      setSearchCategories(cats);
      setActiveSearchCategory('all');
    } catch (err) {
      console.error('Search failed', err);
      setSearchError('অনুসন্ধানে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setSearchResults([]);
      setSearchCategories([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    runSearch(q);
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setIsSearchOpen(false);
      setSearchResults([]);
      setSearchCategories([]);
      setSearchError('');
      return;
    }
    const timeout = setTimeout(() => { runSearch(q); }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const closeSearchModal = () => { setIsSearchOpen(false); };

  const filteredSearchResults = useMemo(() => {
    if (activeSearchCategory === 'all') return searchResults;
    return searchResults.filter((p) => p.categoryName === activeSearchCategory);
  }, [searchResults, activeSearchCategory]);

  return (
    <>
      <header className="w-full sticky top-0 z-50">

        {/* ─── Main Nav Bar — GREEN BACKGROUND ─── */}
        <div className="bg-brand-green shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-3 md:px-6 py-2.5 md:py-3 gap-2 md:gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 z-10" aria-label="হোম">
              <Image
                src="/Tarunno Logo Board.png"
                alt="তারুণ্য প্রকাশন"
                width={180}
                height={45}
                className="h-7 sm:h-9 md:h-11 w-auto object-contain drop-shadow-md"
                unoptimized
                priority
              />
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center bg-white/95 rounded-lg px-3 md:px-4 py-1.5 md:py-2 mx-1 md:mx-6 relative shadow-inner max-w-2xl">
              <FiSearch className="text-brand-green mr-2 flex-shrink-0 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বই, লেখক বা বিষয় খুঁজুন..."
                className="flex-grow bg-transparent border-none outline-none text-base md:text-sm text-gray-800 min-w-0 w-full placeholder-gray-400"
              />
              <button type="submit" className="bg-brand-green-dark text-white text-[10px] md:text-xs font-bold px-3 md:px-5 py-1 md:py-1.5 rounded-md hover:bg-brand-green transition-colors flex-shrink-0 ml-2 whitespace-nowrap">
                খুঁজুন
              </button>
            </form>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-2 items-center">
              <button onClick={handleUserClick} className="text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 flex items-center gap-2" aria-label="অ্যাকাউন্ট">
                {user?.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/50">
                    <Image src={user.image} alt="প্রোফাইল" width={32} height={32} className="w-full h-full object-cover" unoptimized />
                  </div>
                ) : user ? (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/30">
                    {(user.first_name || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <>
                    <FiUser size={20} />
                    <span className="text-sm font-medium">লগইন</span>
                  </>
                )}
              </button>
              <button onClick={openCart} className="text-white/90 hover:text-white transition-colors relative p-2 rounded-lg hover:bg-white/10 flex items-center gap-2" aria-label="কার্ট">
                <FiShoppingCart size={20} />
                <span className="text-sm font-medium">কার্ট</span>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 left-5 bg-brand-gold text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow border border-brand-green">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: Hamburger Only */}
            <div className="flex md:hidden items-center">
              <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-white/80 p-1.5" aria-label="মেনু">
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Category Strip (Desktop Only) ─── */}
        <div className="hidden md:block bg-brand-green-dark/95 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto flex items-center px-6 py-2">
            <Link href="#" className="text-white/70 text-[13px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all flex-shrink-0 mr-2 border-r border-white/10 pr-5">
              <FiGrid size={14} /> সকল বিভাগ
            </Link>

            {/* Scrollable Categories Container */}
            <div className="flex-1 overflow-x-auto flex items-center gap-1 no-scrollbar min-w-0 scroll-smooth">
              <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              {displayCategories.map((cat, idx) => (
                <Link
                  key={cat.id || idx}
                  href={`/category/${cat.slug || cat.category_id || cat.id}`}
                  className="text-white/80 text-[13px] font-medium hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all flex-shrink-0"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Fixed Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0 pl-4 border-l border-white/10 ml-2">
              <Link href="/track-order" className="text-white/80 text-[12px] font-bold hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></span> অর্ডার ট্র্যাক
              </Link>
              <Link href="/special-offers" className="bg-brand-gold text-white text-[11px] font-black px-4 py-1.5 rounded-full hover:bg-yellow-600 transition-colors shadow-sm whitespace-nowrap">
                🔥 বিশেষ অফার
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Search Results Dropdown ─── */}
        {isSearchOpen && (
          <div className="absolute top-[100%] left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50 max-h-[70vh] flex flex-col pt-3 pb-0 border-t">
            {isSearching ? (
              <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
              </div>
            ) : searchError ? (
              <div className="p-8 text-center text-red-500">{searchError}</div>
            ) : searchResults.length === 0 ? (
              <div className="p-12 text-center text-gray-500">&quot;{searchQuery}&quot; এর জন্য কোনো বই পাওয়া যায়নি</div>
            ) : (
              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                <div className="w-full md:w-56 bg-gray-50 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">বিভাগ</h3>
                    <ul className="space-y-1">
                      <li>
                        <button onClick={() => setActiveSearchCategory('all')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSearchCategory === 'all' ? 'bg-brand-green text-white font-semibold' : 'text-gray-600 hover:bg-brand-green-light hover:text-brand-green'}`}>
                          সকল ({searchResults.length})
                        </button>
                      </li>
                      {searchCategories.map(cat => {
                        const count = searchResults.filter(p => p.categoryName === cat).length;
                        return (
                          <li key={cat}>
                            <button onClick={() => setActiveSearchCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${activeSearchCategory === cat ? 'bg-brand-green text-white font-semibold' : 'text-gray-600 hover:bg-brand-green-light hover:text-brand-green'}`}>
                              <span className="truncate pr-2">{cat}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSearchCategory === cat ? 'bg-white/20' : 'bg-gray-200'}`}>{count}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-white" style={{ maxHeight: '60vh' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">{activeSearchCategory === 'all' ? 'সকল বই' : activeSearchCategory}</h3>
                    <button onClick={closeSearchModal} className="text-xs text-brand-green hover:underline">বন্ধ করুন</button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSearchResults.map(product => {
                      const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : 'product';
                      const slug = product.id ? `${nameSlug}-${product.id}` : nameSlug;

                      return (
                        <Link key={product.id} href={`/product/${slug}`} onClick={closeSearchModal} className="group flex flex-col border border-gray-100 rounded-xl hover:shadow-md transition-shadow p-3 hover:border-brand-green/30">
                          <div className="aspect-[3/4] relative bg-gray-50 rounded-lg mb-3 overflow-hidden">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                            {product.discount && (
                              <div className="absolute top-2 left-2 bg-brand-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">{product.discount}</div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className="text-[10px] font-semibold text-brand-green mb-1">{product.brand}</span>
                            <h4 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-brand-green transition-colors">{product.name}</h4>
                            <div className="mt-auto flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-bold text-brand-green-dark">{product.price}</span>
                              {product.oldPrice && (<span className="text-[10px] text-gray-400 line-through">{product.oldPrice}</span>)}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ─── Mobile Sidebar ─── */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] md:hidden" onClick={closeSidebar} />}
      <div className={`fixed inset-y-0 left-0 w-[280px] bg-white z-[70] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-brand-green p-4 flex justify-between items-center">
          <Link href="/" onClick={closeSidebar} aria-label="হোম">
            <Image src="/Tarunno Logo Board.png" alt="তারুণ্য প্রকাশন" width={140} height={36} className="h-8 w-auto object-contain drop-shadow-md" unoptimized />
          </Link>
          <button onClick={closeSidebar} className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"><FiX size={22} /></button>
        </div>
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button onClick={() => { closeSidebar(); handleUserClick(); }} className="w-full py-4 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-brand-green hover:bg-brand-green-light/50 transition-colors">
            {user ? (
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-sm font-bold text-brand-green ring-2 ring-brand-green/30">{(user.first_name || user.name || 'U').charAt(0).toUpperCase()}</div>
            ) : (<FiUser size={22} className="text-gray-400" />)}
            <span className="text-[11px] font-bold uppercase tracking-wider">{user ? 'প্রোফাইল' : 'লগইন'}</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Categories at Top */}
          <div className="px-5 py-3 bg-gray-50 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2"><FiGrid size={12} /> বই বিভাগ</div>
          {displayCategories.map((cat, idx) => (
            <Link key={cat.id || idx} href={`/category/${cat.slug || cat.category_id || cat.id}`} onClick={closeSidebar} className="flex items-center justify-between px-5 py-3 text-sm text-gray-600 font-medium border-b border-gray-50 hover:text-brand-green hover:bg-brand-green-light/30 transition-all">
              <span>{cat.name}</span><FiChevronRight size={14} className="text-gray-300" />
            </Link>
          ))}

          {/* Regular Menu */}
          <div className="px-5 py-3 bg-gray-50 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mt-2">মেনু</div>
          {[
            { label: "হোম", href: "/" },
            { label: "আমাদের সম্পর্কে", href: "/about" },
            { label: "যোগাযোগ", href: "/contact" },
            { label: "অর্ডার ট্র্যাক", href: "/track-order", highlight: true },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={closeSidebar} className={`flex items-center justify-between px-5 py-3.5 font-semibold border-b border-gray-50 transition-colors ${item.highlight ? 'text-brand-green bg-brand-green-light/50 hover:bg-brand-green-light' : 'text-gray-700 hover:text-brand-green hover:bg-brand-green-light/30'}`}>
              <span>{item.label}</span><FiChevronRight size={16} className={item.highlight ? "text-brand-green" : "text-gray-300"} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
