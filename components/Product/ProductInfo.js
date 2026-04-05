"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShare2, FiMinus, FiPlus, FiPlayCircle, FiBookOpen, FiX, FiExternalLink, FiUser } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

export default function ProductInfo({ product, onVariantImageChange, reviewSummary }) {
    const { addToCart, closeCart } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isLookInsideOpen, setIsLookInsideOpen] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

    const imeis = product.rawImeis || [];
    const hasVariants = imeis.length > 0;

    // Extract unique color options with their hex codes
    const allColors = useMemo(() => {
        const colorMap = new Map();
        imeis.forEach(i => {
            if (i.color && !colorMap.has(i.color)) {
                colorMap.set(i.color, { name: i.color, hex: i.color_code || '#e5e7eb' });
            }
        });
        return Array.from(colorMap.values());
    }, [imeis]);

    // Extract unique storage options
    const allStorages = useMemo(() => {
        return [...new Set(imeis.map(i => i.storage).filter(Boolean))];
    }, [imeis]);

    // Extract unique region options
    const allRegions = useMemo(() => {
        return [...new Set(imeis.map(i => i.region).filter(Boolean))];
    }, [imeis]);

    // Selection state
    const [selectedColor, setSelectedColor] = useState(allColors[0]?.name || null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    // When color is selected, auto-select the first available storage and region for that color
    useEffect(() => {
        if (!hasVariants) return;

        const matchingImeis = imeis.filter(i => !selectedColor || i.color === selectedColor);

        const availableStorages = [...new Set(matchingImeis.map(i => i.storage).filter(Boolean))];
        if (availableStorages.length > 0) {
            if (!selectedStorage || !availableStorages.includes(selectedStorage)) {
                setSelectedStorage(availableStorages[0]);
            }
        } else {
            setSelectedStorage(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    // When color+storage changes, auto-select region
    useEffect(() => {
        if (!hasVariants) return;

        const matchingImeis = imeis.filter(i => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });

        const availableRegions = [...new Set(matchingImeis.map(i => i.region).filter(Boolean))];
        if (availableRegions.length > 0) {
            if (!selectedRegion || !availableRegions.includes(selectedRegion)) {
                setSelectedRegion(availableRegions[0]);
            }
        } else {
            setSelectedRegion(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor, selectedStorage]);

    // Compute available options based on current selection state
    const availableStorages = useMemo(() => {
        const matchingImeis = imeis.filter(i => !selectedColor || i.color === selectedColor);
        return [...new Set(matchingImeis.map(i => i.storage).filter(Boolean))];
    }, [imeis, selectedColor]);

    const availableRegions = useMemo(() => {
        const matchingImeis = imeis.filter(i => {
            let match = true;
            if (selectedColor && i.color) match = match && i.color === selectedColor;
            if (selectedStorage && i.storage) match = match && i.storage === selectedStorage;
            return match;
        });
        return [...new Set(matchingImeis.map(i => i.region).filter(Boolean))];
    }, [imeis, selectedColor, selectedStorage]);

    // Get the best matching IMEI for the current selection to determine price
    const matchedImei = useMemo(() => {
        if (!hasVariants) return null;

        // Try exact match first
        let match = imeis.find(i =>
            (!selectedColor || i.color === selectedColor) &&
            (!selectedStorage || i.storage === selectedStorage) &&
            (!selectedRegion || i.region === selectedRegion)
        );

        // Fallback: color + storage
        if (!match) {
            match = imeis.find(i =>
                (!selectedColor || i.color === selectedColor) &&
                (!selectedStorage || i.storage === selectedStorage)
            );
        }

        // Fallback: color only
        if (!match) {
            match = imeis.find(i => !selectedColor || i.color === selectedColor);
        }

        return match;
    }, [imeis, selectedColor, selectedStorage, selectedRegion, hasVariants]);

    // Dynamic price based on matched IMEI
    const displayPrice = useMemo(() => {
        if (matchedImei && matchedImei.sale_price) {
            return `৳ ${Number(matchedImei.sale_price).toLocaleString('en-IN')}`;
        }
        return product.price;
    }, [matchedImei, product.price]);

    // Old price for strikethrough — show the base product price if variant price differs
    const displayOldPrice = useMemo(() => {
        if (matchedImei && matchedImei.sale_price) {
            const variantPrice = Number(matchedImei.sale_price);
            if (product.hasDiscount && product.originalPrice > variantPrice) {
                return `৳ ${product.originalPrice.toLocaleString('en-IN')}`;
            }
        }
        return product.oldPrice;
    }, [matchedImei, product]);

    // When color changes, update the gallery images
    useEffect(() => {
        if (!onVariantImageChange || !hasVariants) return;

        if (selectedColor) {
            // Find all unique images from imeis of that color
            const colorImeis = imeis.filter(i => i.color === selectedColor && i.image_path);
            const uniqueImages = [...new Set(colorImeis.map(i => i.image_path))];

            if (uniqueImages.length > 0) {
                onVariantImageChange(uniqueImages);
            } else {
                // No IMEI images for this color — fall back to default product images
                onVariantImageChange(null);
            }
        } else {
            onVariantImageChange(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColor]);

    // Detect mobile device
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                ('ontouchstart' in window) ||
                (window.innerWidth <= 768)
            );
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Lock body scroll when PDF modal is open (iOS-compatible position:fixed trick)
    useEffect(() => {
        if (isLookInsideOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        };
    }, [isLookInsideOpen]);

    const handleLookInside = () => {
        setIsLookInsideOpen(true);
    };

    const handleVideoReview = () => {
        if (product.youtubeLink) {
            window.open(product.youtubeLink, '_blank', 'noopener,noreferrer');
        } else {
            toast.error('দুঃখিত, এই বইটির জন্য কোনো ভিডিও রিভিউ পাওয়া যায়নি।');
        }
    };

    const handleShare = () => {
        // Build a short shareable URL using only the product ID (avoids long encoded Bengali slugs)
        const shortUrl = `${window.location.origin}/product/${product.id}`;
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                toast.success('লিংক কপি করা হয়েছে!');
            })
            .catch(() => {
                toast.error('লিংক কপি করা যায়নি।');
            });
    };

    const getSelectedVariants = () => {
        const variants = {};
        if (selectedStorage) variants.storage = selectedStorage;
        if (selectedColor) variants.colors = { name: selectedColor };
        if (selectedRegion) variants.region = selectedRegion;
        return Object.keys(variants).length > 0 ? variants : null;
    };

    const handleAddToCart = () => {
        addToCart(product, quantity, getSelectedVariants());
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, getSelectedVariants());
        closeCart();
        router.push('/checkout');
    };

    return (
        <div className="flex flex-col relative w-full h-full">
            {/* Header: Title, Reviews, Share */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="bg-brand-green/10 text-brand-green text-xs font-bold px-2.5 py-1 rounded-md inline-block mb-3">
                        স্টকে আছে
                    </div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
                        {product.name}
                        {product.cover && product.cover !== 'N/A' && (
                            <span className="text-gray-400 font-medium ml-2 text-lg md:text-xl">
                                ({product.cover})
                            </span>
                        )}
                    </h1>
                    
                    {product.shortDescription && (
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed max-w-full overflow-hidden text-wrap break-words">
                            {product.shortDescription}
                        </p>
                    )}

                    {/* Rating Summary */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex text-brand-gold">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    size={14}
                                    className={reviewSummary && i < Math.round(reviewSummary.average_rating) ? 'fill-brand-gold' : 'text-gray-300'}
                                />
                            ))}
                        </div>
                        {reviewSummary && reviewSummary.total_reviews > 0 ? (
                            <>
                                <span className="text-sm font-bold text-gray-700">{reviewSummary.average_rating_display}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm text-gray-500 font-medium">{reviewSummary.total_reviews} টি রিভিউ</span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-400 font-medium">(০ টি রিভিউ)</span>
                        )}
                    </div>

                    {/* Book Meta Details */}
                    <div className="flex flex-col gap-2.5 text-sm text-gray-600 mb-6">
                        {product.author && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 w-24">লেখক:</span>
                                {product.authorDetails?.id ? (
                                    <Link
                                        href={`/author/${product.authorDetails.id}`}
                                        className="font-bold text-brand-green hover:underline cursor-pointer"
                                    >
                                        {product.author}
                                    </Link>
                                ) : (
                                    <span className="font-bold text-brand-green">{product.author}</span>
                                )}
                            </div>
                        )}
                        {product.publisher && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 w-24">প্রকাশনী:</span>
                                <span className="font-semibold text-gray-800">{product.publisher}</span>
                            </div>
                        )}
                        {product.pages && product.pages !== 'N/A' && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 w-24">পৃষ্ঠা সংখ্যা:</span>
                                <span className="font-semibold text-gray-800">{product.pages} টি</span>
                            </div>
                        )}
                        {product.edition && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 w-24">সংস্করণ:</span>
                                <span className="font-semibold text-gray-800">{product.edition}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/10 rounded-full transition-colors shrink-0"
                    title="Share link"
                >
                    <FiShare2 size={20} />
                </button>
            </div>

            {/* Price section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl md:text-3xl font-extrabold text-gray-800">
                        {displayPrice}
                    </span>
                    {displayOldPrice && (
                        <span className="text-lg text-gray-400 line-through font-medium">
                            {displayOldPrice}
                        </span>
                    )}
                    {product.discount && (
                        <span className="text-lg md:text-xl font-bold text-[#ef4444] ml-1">
                            ({product.discount} ছাড়ে)
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1"></p>
            </div>

            {/* Variants */}
            {hasVariants && (
                <div className="space-y-6 mb-8">

                    {/* Colors — use actual color swatches */}
                    {allColors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">
                                বাঁধাই: <span className="font-medium text-brand-green">{selectedColor || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allColors.map(color => {
                                    const isSelected = selectedColor === color.name;
                                    const isWhite = color.hex?.toLowerCase() === '#ffffff' || color.hex?.toLowerCase() === '#fff';
                                    return (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                ? 'border-brand-green bg-brand-green/5 shadow-md shadow-brand-green/10'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                }`}
                                            title={color.name}
                                        >
                                            <span
                                                className={`w-5 h-5 rounded-full shadow-inner ${isWhite ? 'border border-gray-300' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className={`text-sm font-medium ${isSelected ? 'text-brand-green' : 'text-gray-600'}`}>
                                                {color.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Storage / Size */}
                    {allStorages.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">
                                সংস্করণ: <span className="font-medium text-brand-green">{selectedStorage || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allStorages.map(size => {
                                    const isAvailable = availableStorages.includes(size);
                                    const isSelected = selectedStorage === size;
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => isAvailable && setSelectedStorage(size)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${isSelected
                                                ? 'border-brand-green bg-brand-green text-white shadow-md shadow-brand-green/20'
                                                : isAvailable
                                                    ? 'border-gray-200 text-gray-600 hover:border-brand-green/50 hover:shadow-sm'
                                                    : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Region */}
                    {allRegions.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">
                                প্রকাশনী / অন্যান্য: <span className="font-medium text-brand-green">{selectedRegion || ''}</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allRegions.map(region => {
                                    const isAvailable = availableRegions.includes(region);
                                    const isSelected = selectedRegion === region;
                                    return (
                                        <button
                                            key={region}
                                            onClick={() => isAvailable && setSelectedRegion(region)}
                                            disabled={!isAvailable}
                                            className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${isSelected
                                                ? 'border-brand-green text-brand-green bg-brand-green/5 shadow-md shadow-brand-green/10'
                                                : isAvailable
                                                    ? 'border-gray-200 text-gray-600 hover:border-brand-green/50 hover:shadow-sm'
                                                    : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through'
                                                }`}
                                        >
                                            {region}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mb-8 flex flex-col gap-3">
                <p className="text-sm text-gray-600 font-medium">
                    আনুমানিক ডেলিভারি:{' '}
                    <button
                        type="button"
                        onClick={() => setIsDeliveryModalOpen(true)}
                        className="text-gray-900 font-bold underline decoration-brand-green cursor-pointer hover:text-brand-green transition-colors"
                    >
                        ১-২ দিন
                    </button>
                </p>

                {/* Action Links: Look Inside / Video */}
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleLookInside}
                        className="flex items-center gap-1.5 text-brand-green hover:text-brand-green-dark font-bold text-sm transition-colors group"
                    >
                        <FiBookOpen className="group-hover:scale-110 transition-transform" size={18} />
                        <span>একটু পড়ে দেখুন</span>
                    </button>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <button
                        onClick={handleVideoReview}
                        className="flex items-center gap-1.5 text-brand-gold hover:text-yellow-600 font-bold text-sm transition-colors group"
                    >
                        <FiPlayCircle className="group-hover:scale-110 transition-transform" size={18} />
                        <span>ভিডিও রিভিউ</span>
                    </button>
                </div>
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="flex flex-row items-stretch gap-2 mt-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border-2 border-gray-200 rounded-lg py-1 px-1 w-[100px] shrink-0 bg-white">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <FiMinus size={14} />
                    </button>
                    <span className="font-bold text-gray-900 w-6 text-center text-sm">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <FiPlus size={14} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col sm:flex-row gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="cursor-pointer flex-1 bg-white border-2 border-brand-green text-brand-green font-bold py-3 px-2 rounded-lg hover:bg-brand-green hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap text-center"
                    >
                        কার্টে যোগ করুন
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="cursor-pointer flex-[1.5] bg-brand-green text-white font-bold py-3 px-2 rounded-lg hover:bg-brand-green-dark shadow-lg shadow-brand-green/30 transition-all text-xs sm:text-sm whitespace-nowrap text-center"
                    >
                        এখুনি কিনুন
                    </button>
                </div>
            </div>


            {/* Look Inside Modal (PDF / Pages Preview) */}
            {isLookInsideOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm"
                    style={{ overscrollBehavior: 'contain', touchAction: 'none' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setIsLookInsideOpen(false); }}
                    onTouchMove={(e) => {
                        // Only allow touch move inside the PDF iframe
                        if (!e.target.closest('.pdf-content-area')) {
                            e.preventDefault();
                        }
                    }}
                >
                    <div
                        className="bg-white rounded-2xl md:rounded-3xl w-full max-w-3xl h-[85vh] shadow-2xl relative flex flex-col"
                        style={{ overscrollBehavior: 'contain' }}
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-brand-cream/50 shrink-0">
                            <h3 className="text-lg font-bold text-brand-green-dark mx-2 flex items-center gap-2">
                                <FiBookOpen />
                                একটু পড়ে দেখুন
                            </h3>
                            <div className="flex items-center gap-2">
                                {product.pdfFile && (
                                    <a
                                        href={product.pdfFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-green border border-brand-green/20 rounded-lg hover:bg-brand-green hover:text-white transition-all mr-2"
                                        title="Open in new tab"
                                    >
                                        <FiExternalLink size={16} />
                                        <span className="hidden sm:inline">নতুন ট্যাবে খুলুন</span>
                                    </a>
                                )}
                                <button
                                    onClick={() => setIsLookInsideOpen(false)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                        </div>

                        <div
                            className="pdf-content-area flex-1 relative"
                            style={{
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                overscrollBehavior: 'contain',
                                touchAction: 'pan-y',
                            }}
                        >
                            {product.pdfFile ? (
                                isMobile ? (
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(product.pdfFile)}&embedded=true`}
                                        className="w-full border-none"
                                        style={{ height: '100%', minHeight: '100%', touchAction: 'auto' }}
                                        title="Product PDF Preview"
                                        allow="autoplay"
                                    />
                                ) : (
                                    <object
                                        data={product.pdfFile}
                                        type="application/pdf"
                                        className="w-full h-full"
                                    >
                                        <iframe
                                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(product.pdfFile)}&embedded=true`}
                                            className="w-full h-full border-none"
                                            title="Product PDF Preview Fallback"
                                        />
                                    </object>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <FiBookOpen size={48} className="text-gray-300 mb-4" />
                                    <p className="text-gray-500">দুঃখিত, এই বইটির প্রিভিউ পিডিফ পাওয়া যায়নি।</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isDeliveryModalOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsDeliveryModalOpen(false); }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="text-base font-extrabold text-gray-900">ডেলিভারি সময়</h3>
                            <button
                                type="button"
                                onClick={() => setIsDeliveryModalOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                aria-label="Close delivery modal"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="px-5 py-4 space-y-2 text-sm text-gray-700">
                            <p><span className="font-bold text-gray-900">সারা বাংলাদেশে:</span> ১-২ দিন</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
