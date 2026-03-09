"use client";

import { useState, useMemo, useEffect } from 'react';
import { FiShare2, FiMinus, FiPlus, FiPlayCircle, FiBookOpen, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

export default function ProductInfo({ product, onVariantImageChange }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isLookInsideOpen, setIsLookInsideOpen] = useState(false);

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

    const handleAddToCart = () => {
        const variants = {};
        if (selectedStorage) variants.storage = selectedStorage;
        if (selectedColor) variants.colors = { name: selectedColor };
        if (selectedRegion) variants.region = selectedRegion;

        addToCart(product, quantity, Object.keys(variants).length > 0 ? variants : null);
    };

    return (
        <div className="flex flex-col relative w-full h-full">
            {/* Header: Title, Reviews, Share */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="bg-brand-green/10 text-brand-green text-xs font-bold px-2.5 py-1 rounded-md inline-block mb-3">
                        স্টকে আছে
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                </div>

                <button className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/10 rounded-full transition-colors shrink-0">
                    <FiShare2 size={20} />
                </button>
            </div>

            {/* Price section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-extrabold text-gray-800">
                        {displayPrice}
                    </span>
                    {displayOldPrice && (
                        <span className="text-lg text-gray-400 line-through font-medium">
                            {displayOldPrice}
                        </span>
                    )}
                    {product.discount && (
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                            {product.discount}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">সকল মূল্যে ভ্যাট অন্তর্ভুক্ত</p>
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
                <p className="text-sm text-gray-600 font-medium">আনুমানিক ডেলিভারি: <span className="text-gray-900 font-bold underline decoration-brand-green cursor-pointer">১-৩ দিন</span></p>

                {/* Action Links: Look Inside / Video */}
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setIsLookInsideOpen(true)}
                        className="flex items-center gap-1.5 text-brand-green hover:text-brand-green-dark font-bold text-sm transition-colors group"
                    >
                        <FiBookOpen className="group-hover:scale-110 transition-transform" size={18} />
                        <span>একটু পড়ে দেখুন</span>
                    </button>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <button
                        onClick={() => setIsVideoModalOpen(true)}
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
                        onClick={handleAddToCart}
                        className="cursor-pointer flex-[1.5] bg-brand-green text-white font-bold py-3 px-2 rounded-lg hover:bg-brand-green-dark shadow-lg shadow-brand-green/30 transition-all text-xs sm:text-sm whitespace-nowrap text-center"
                    >
                        এখুনি কিনুন
                    </button>
                </div>
            </div>

            {/* Video Review Modal */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mx-2">বইয়ের ভিডিও রিভিউ</h3>
                            <button
                                onClick={() => setIsVideoModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="relative w-full aspect-video bg-black">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/wzXQ0FkXmGQ?autoplay=1" // Placeholder Islamic book review video / generic video
                                title="Book Review"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
                            এটি একটি ডেমো রিভিউ ভিডিও।
                        </div>
                    </div>
                </div>
            )}

            {/* Look Inside Modal (PDF / Pages Preview) */}
            {isLookInsideOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl md:rounded-3xl w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl relative flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-brand-cream/50">
                            <h3 className="text-lg font-bold text-brand-green-dark mx-2 flex items-center gap-2">
                                <FiBookOpen />
                                একটু পড়ে দেখুন
                            </h3>
                            <button
                                onClick={() => setIsLookInsideOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 flex flex-col items-center gap-6">
                            {/* Dummy Pages for Look Inside */}
                            {[1, 2, 3].map((pageNum) => (
                                <div key={pageNum} className="w-full max-w-xl aspect-[1/1.4] bg-white shadow-md border border-gray-200 p-8 md:p-12 flex flex-col">
                                    <div className="border-b-2 border-brand-gold/30 pb-4 mb-6">
                                        <h4 className="text-xl font-bold text-gray-800 text-center">অধ্যায় {pageNum}</h4>
                                    </div>
                                    <div className="flex-1 space-y-4 text-justify text-gray-700 leading-relaxed font-serif">
                                        <p>বিসমিল্লাহির রহমানির রহিম। এটি একটি ডেমো পৃষ্ঠার ডামি লেখা। এখানে বইটির প্রথম দিকের কিছু পাতার লেখা বা ছবি দেখানো হবে, যাতে পাঠক বইটি সম্পর্কে ধারণা পেতে পারেন।</p>
                                        <p>ইসলামী জীবনব্যবস্থা মানুষের জন্য একটি পরিপূর্ণ দিকনির্দেশনা। এখানে সেই দিকনির্দেশনার আলোকে জীবন গড়ার অনুপ্রেরণা দেওয়া হয়েছে। আল্লাহ তাআলা আমাদের সবাইকে সঠিক বুঝ দান করুন।</p>
                                        <div className="h-4 w-1/3 bg-gray-200 mt-6 mx-auto rounded"></div>
                                        <div className="h-4 w-2/3 bg-gray-200 mx-auto rounded"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 mx-auto rounded"></div>
                                    </div>
                                    <div className="pt-4 mt-auto border-t border-gray-100 text-center text-xs text-gray-400">
                                        পৃষ্ঠা - {pageNum + 5}
                                    </div>
                                </div>
                            ))}

                            <div className="text-center py-6">
                                <p className="text-gray-500 mb-4 font-medium">বইটি ভালো লাগলে পুরোটা পড়ার জন্য সংগ্রহ করুন</p>
                                <button
                                    onClick={() => {
                                        setIsLookInsideOpen(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-brand-green text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:bg-brand-green-dark transition-colors"
                                >
                                    কার্টে যোগ করুন
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
