"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getEbooksFromServer } from '../../lib/api';
import ProductCard from '../../components/Shared/ProductCard';
import { FiBookOpen, FiHome } from 'react-icons/fi';

function EbooksContent() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchEbooks = async () => {
            setIsLoading(true);
            try {
                const res = await getEbooksFromServer();
                if (isMounted && res?.success && Array.isArray(res.data)) {
                    // Map the data to the format ProductCard expects
                    const mapped = res.data.map(p => {
                        const originalPrice = Number(p.retails_price || 0);
                        const discount = Number(p.discount || 0);
                        const discountType = String(p.discount_type || '').toLowerCase();
                        const hasDiscount = discount > 0 && discountType !== '0';
                        
                        const price = hasDiscount
                            ? (discountType === 'percentage' 
                                ? Math.max(0, Math.round(originalPrice * (1 - discount / 100))) 
                                : Math.max(0, originalPrice - discount))
                            : originalPrice;

                        return {
                            id: p.id,
                            name: p.name,
                            brand: p.brands?.name || p.brand_name || "অন্যান্য",
                            price: `৳ ${price.toLocaleString('en-IN')}`,
                            oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
                            discount: hasDiscount ? (discountType === 'percentage' ? `-${discount}%` : `৳ ${discount}`) : null,
                            imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
                            isEbook: true, // Crucial for ProductCard routing
                            pages: p.total_pages || p.pages || 'N/A'
                        };
                    });
                    setProducts(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch ebooks:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchEbooks();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Banner Section */}
            <div className="relative h-48 md:h-64 bg-brand-green overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000"
                    alt="Ebooks Banner"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
                    <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tight">আমাদের ই-বুক সংগ্রহ</h1>
                    <p className="text-sm md:text-lg opacity-90 max-w-2xl">স্মার্টফোনে বা ট্যাবলেটে পড়ুন আপনার প্রিয় বইগুলো, যেকোনো সময়, যেকোনো জায়গায়।</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
                {/* Breadcrumbs */}
                <div className="bg-white rounded-xl shadow-sm px-5 py-3 mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 border border-gray-100">
                    <Link href="/" className="hover:text-brand-green flex items-center gap-1 transition-colors">
                        <FiHome size={14} /> হোম
                    </Link>
                    <span>/</span>
                    <span className="text-brand-green font-bold">ই-বুক</span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">ই-বুক লোড হচ্ছে...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-brand-green/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiBookOpen size={40} className="text-brand-green/40" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">এই মুহূর্তে কোনো ই-বুক নেই</h2>
                        <p className="text-gray-400 max-w-md mx-auto">আমরা শীঘ্রই নতুন ডিজিটাল বই যুক্ত করছি। নিয়মিত আমাদের ওয়েবসাইট ভিজিট করুন!</p>
                        <Link 
                            href="/" 
                            className="mt-8 inline-block bg-brand-green text-white px-8 py-3 rounded-full font-bold hover:bg-brand-green-dark transition-all transform hover:-translate-y-1"
                        >
                            হোমে ফিরে যান
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EbooksPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
            </div>
        }>
            <EbooksContent />
        </Suspense>
    );
}
