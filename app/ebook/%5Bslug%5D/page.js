"use client";

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getProductById } from '../../../lib/api';
import { useProductRegistry } from '../../../context/ProductRegistryContext';
import { FiBookOpen, FiArrowLeft, FiClock, FiLayers, FiGlobe, FiInfo } from 'react-icons/fi';

const EbookReader = dynamic(
    () => import('../../../components/Ebooks/EbookReader'),
    { ssr: false }
);

/**
 * Maps partial product data from the registry to the structure expected by the ebook detail page.
 */
function mapRegistryToEbook(p) {
    if (!p) return null;
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        discount: p.discount,
        images: p.imageUrl ? [p.imageUrl] : ['/no-image.svg'],
        author: p.brand || 'N/A', // Author is often stored in 'brand' field for books in this system
        publisher: 'N/A',
        pages: p.pages || 'N/A',
        language: 'বাংলা',
        description: '',
        shortDescription: '',
        category: 'ই-বুক',
        pdfFile: null
    };
}

export default function EbookDetailsPage() {
    const params = useParams();
    const { getProduct } = useProductRegistry();
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

    const productId = useMemo(() => {
        if (!slug) return null;
        const decoded = decodeURIComponent(slug).trim();
        if (!decoded.includes('-')) return decoded;
        const parts = decoded.split('-');
        return parts[parts.length - 1];
    }, [slug]);

    // Initialize with registry data if available for instant render
    const initialData = useMemo(() => getProduct(productId), [productId, getProduct]);

    const [productData, setProductData] = useState(() => mapRegistryToEbook(initialData));
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState(null);
    const [isReaderOpen, setIsReaderOpen] = useState(false);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            setError('Invalid ebook.');
            return;
        }

        const load = async () => {
            // Only show the main loader if we don't have registry data
            if (!productData) {
                setIsLoading(true);
            }
            try {
                const res = await getProductById(productId);
                const p = res?.data || res;
                if (!p || !p.id) throw new Error('Ebook not found');

                const originalPrice = Number(p.retails_price || 0);
                const discount = Number(p.discount || 0);
                const discountType = String(p.discount_type || '').toLowerCase();
                const hasDiscount = discount > 0 && discountType !== '0';

                const price = hasDiscount
                    ? (discountType === 'percentage' 
                        ? Math.max(0, Math.round(originalPrice * (1 - discount / 100))) 
                        : Math.max(0, originalPrice - discount))
                    : originalPrice;

                setProductData({
                    id: p.id,
                    name: p.name,
                    price: `৳ ${price.toLocaleString('en-IN')}`,
                    oldPrice: hasDiscount ? `৳ ${originalPrice.toLocaleString('en-IN')}` : null,
                    discount: hasDiscount ? (discountType === 'percentage' ? `-${discount}%` : `৳ ${discount}`) : null,
                    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image_path ? [p.image_path] : ['/no-image.svg']),
                    description: p.description || '',
                    shortDescription: p.short_description || '',
                    author: p.author?.name || p.author_name || 'N/A',
                    publisher: p.publisher || 'N/A',
                    pages: p.total_pages || p.pages || 'N/A',
                    language: p.language || 'বাংলা',
                    category: p.category_name || p.category?.name || 'ই-বুক',
                    pdfFile: p.pdf_file || null
                });
            } catch (err) {
                console.error('Failed to load ebook details:', err);
                setError('বইটির তথ্য লোড করা সম্ভব হয়নি।');
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [productId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">বিস্তারিত তথ্য লোড হচ্ছে...</p>
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
                <p className="text-red-500 mb-6 text-lg">{error || 'বইটি পাওয়া যায়নি।'}</p>
                <Link href="/ebooks" className="bg-brand-green text-white px-8 py-3 rounded-full font-bold">
                    সব ই-বুক দেখুন
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Breadcrumbs & Simple Nav */}
            <div className="bg-gray-50 py-4 border-b border-gray-100 mb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                        <Link href="/" className="hover:text-brand-green transition-colors">হোম</Link>
                        <span>/</span>
                        <Link href="/ebooks" className="hover:text-brand-green transition-colors">ই-বুক</Link>
                        <span>/</span>
                        <span className="text-brand-green font-bold truncate max-w-[150px] md:max-w-xs">{productData.name}</span>
                    </div>
                    <Link href="/ebooks" className="text-brand-green hover:underline text-xs md:text-sm font-bold flex items-center gap-1">
                        <FiArrowLeft /> ফিরে যান
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Left: Book Cover */}
                    <div className="w-full md:w-[40%] xl:w-[35%] shrink-0">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-brand-green/10 border border-gray-100 group">
                            <Image
                                src={productData.images[0]}
                                alt={productData.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                            />
                            {/* Format Badge */}
                            <div className="absolute top-4 left-4 bg-brand-green text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm bg-brand-green/90">
                                <FiBookOpen size={14} />
                                ডিজিটাল বই (E-BOOK)
                            </div>
                        </div>
                    </div>

                    {/* Right: Book Details */}
                    <div className="flex-1 flex flex-col pt-2">
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">{productData.name}</h1>
                            <p className="text-brand-green font-bold text-lg md:text-xl mb-4">লেখক: {productData.author}</p>
                            
                            <div className="inline-flex items-center gap-3 bg-brand-green/5 px-4 py-2 rounded-xl mb-4">
                                <span className="text-2xl md:text-3xl font-black text-brand-green">{productData.price}</span>
                                {productData.oldPrice && (
                                    <span className="text-sm md:text-base text-gray-400 line-through font-medium">{productData.oldPrice}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 py-6 border-y border-gray-100 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-green">
                                    <FiClock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">প্রকাশনা</p>
                                    <p className="text-sm font-bold text-gray-800">{productData.publisher}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-green">
                                    <FiLayers size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">পৃষ্ঠা সংখ্যা</p>
                                    <p className="text-sm font-bold text-gray-800">{productData.pages} পৃষ্ঠা</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-green">
                                    <FiGlobe size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ভাষা</p>
                                    <p className="text-sm font-bold text-gray-800">{productData.language}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button 
                                onClick={() => setIsReaderOpen(true)}
                                disabled={!productData.pdfFile}
                                className="flex-1 bg-brand-green text-white h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                <FiBookOpen size={22} />
                                এখনই অনলাইনে পড়ুন
                            </button>
                            <button className="flex-1 bg-white text-gray-800 border-2 border-gray-200 h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:border-brand-green hover:text-brand-green transition-all transform hover:-translate-y-1 active:scale-95">
                                সংগ্রহ করুন
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FiInfo className="text-brand-green" /> বইয়ের বিবরণ
                                </h3>
                                <div 
                                    className="text-gray-600 leading-relaxed text-sm md:text-base prose prose-green max-w-none"
                                    dangerouslySetInnerHTML={{ __html: productData.description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ebook Reader Modal */}
            {isReaderOpen && productData.pdfFile && (
                <EbookReader 
                    fileUrl={productData.pdfFile} 
                    title={productData.name}
                    onClose={() => setIsReaderOpen(false)} 
                />
            )}
        </div>
    );
}
