"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [] }) {
    const imageArray = images && images.length > 0 ? images : ['/no-image.svg'];
    const [mainImage, setMainImage] = useState(imageArray[0]);

    // When images prop changes (e.g., variant color selected), reset to first image
    useEffect(() => {
        if (imageArray.length > 0) {
            setMainImage(imageArray[0]);
        }
    }, [images]);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Container */}
            <div className="w-full aspect-square relative bg-[#f5f5f5] rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
                <Image
                    src={mainImage}
                    alt="Product Image"
                    fill
                    unoptimized
                    className="object-contain"
                />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imageArray.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`relative w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden bg-[#f5f5f5] transition-all ${mainImage === img ? 'border-brand-purple' : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-contain p-2"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
