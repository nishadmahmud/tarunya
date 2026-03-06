"use client";

import { useState, useMemo, useEffect } from 'react';
import { FiShare2, FiMinus, FiPlus } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

export default function ProductInfo({ product, onVariantImageChange }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

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
        <div className="flex flex-col">
            {/* Header: Title, Reviews, Share */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="bg-brand-purple/10 text-brand-purple text-xs font-bold px-2.5 py-1 rounded-md inline-block mb-3">
                        In Stock
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>


                </div>

                <button className="p-2 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-full transition-colors">
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
                <p className="text-xs text-gray-500 mt-1">Price includes VAT</p>
            </div>

            {/* Variants */}
            {hasVariants && (
                <div className="space-y-6 mb-8">

                    {/* Colors — use actual color swatches */}
                    {allColors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">
                                Color: <span className="font-medium text-brand-purple">{selectedColor || ''}</span>
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
                                                ? 'border-brand-purple bg-brand-purple/5 shadow-md shadow-brand-purple/10'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                }`}
                                            title={color.name}
                                        >
                                            <span
                                                className={`w-5 h-5 rounded-full shadow-inner ${isWhite ? 'border border-gray-300' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className={`text-sm font-medium ${isSelected ? 'text-brand-purple' : 'text-gray-600'}`}>
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
                                Storage: <span className="font-medium text-brand-purple">{selectedStorage || ''}</span>
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
                                                ? 'border-brand-purple bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                                                : isAvailable
                                                    ? 'border-gray-200 text-gray-600 hover:border-brand-purple/50 hover:shadow-sm'
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
                                Region: <span className="font-medium text-brand-purple">{selectedRegion || ''}</span>
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
                                                ? 'border-brand-purple text-brand-purple bg-brand-purple/5 shadow-md shadow-brand-purple/10'
                                                : isAvailable
                                                    ? 'border-gray-200 text-gray-600 hover:border-brand-purple/50 hover:shadow-sm'
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

            {/* Delivery Est */}
            <div className="mb-8">
                <p className="text-sm text-gray-600 font-medium">Estimated delivery: <span className="text-gray-900 font-bold underline decoration-brand-purple cursor-pointer">0-3 days</span></p>
            </div>

            {/* Add to Cart / Buy Now */}
            <div className="flex flex-row items-stretch gap-2 mt-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border-2 border-gray-200 rounded-lg py-1 px-1 w-[100px] shrink-0 bg-white">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-purple hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <FiMinus size={14} />
                    </button>
                    <span className="font-bold text-gray-900 w-6 text-center text-sm">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-purple hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <FiPlus size={14} />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="cursor-pointer flex-1 bg-white border-2 border-brand-purple text-brand-purple font-bold py-3 px-2 rounded-lg hover:bg-brand-purple hover:text-white transition-colors text-sm whitespace-nowrap"
                >
                    Add to Cart
                </button>

                <button
                    onClick={handleAddToCart}
                    className="cursor-pointer flex-[1.5] bg-brand-purple text-white font-bold py-3 px-2 rounded-lg hover:opacity-90 shadow-lg shadow-brand-purple/30 transition-all text-sm whitespace-nowrap"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}
