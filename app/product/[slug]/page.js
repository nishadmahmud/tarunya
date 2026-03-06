"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductGallery from '../../../components/Product/ProductGallery';
import ProductInfo from '../../../components/Product/ProductInfo';
import ProductTabs from '../../../components/Product/ProductTabs';
import ProductCard from '../../../components/Shared/ProductCard';
import { getProductById, getRelatedProduct } from '../../../lib/api';

export default function ProductDetailsPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

    // Parse product ID from slug (supports "product-name-12345" or just "12345")
    const productId = useMemo(() => {
        if (!slug) return null;
        const decoded = decodeURIComponent(slug).trim();

        // Case 1: slug is just the numeric ID
        if (/^\d+$/.test(decoded)) {
            const directId = Number(decoded);
            return Number.isFinite(directId) && directId > 0 ? directId : null;
        }

        // Case 2: slug is "name-<id>"
        const parts = decoded.split('-');
        const maybeId = parts[parts.length - 1];
        const idNum = Number(maybeId);
        return Number.isFinite(idNum) && idNum > 0 ? idNum : null;
    }, [slug]);

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [variantImages, setVariantImages] = useState(null);
    const [fromCategory, setFromCategory] = useState(null); // { name, slug }

    useEffect(() => {
        // Check if we came from a category page
        if (typeof document !== 'undefined' && document.referrer) {
            const referrer = document.referrer;
            if (referrer.includes('/category/')) {
                // Try to extract category slug from referrer if needed, 
                // but we'll get the real name from product data
                setFromCategory(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            setError('Invalid product.');
            return;
        }

        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await getProductById(productId);
                const payload = res?.data || res;
                if (!payload || !payload.id) {
                    throw new Error('Product not found');
                }

                const p = payload;

                const originalPrice = Number(p.retails_price || 0);
                const discountValue = Number(p.discount || 0);
                const discountType = String(p.discount_type || '').toLowerCase();
                const hasDiscount = discountValue > 0 && discountType !== '0';

                const price = hasDiscount
                    ? discountType === 'percentage'
                        ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
                        : Math.max(0, originalPrice - discountValue)
                    : originalPrice;

                const discountLabel = hasDiscount
                    ? discountType === 'percentage'
                        ? `-${discountValue}%`
                        : `৳ ${discountValue.toLocaleString('en-IN')}`
                    : null;

                const images =
                    (Array.isArray(p.images) && p.images.length > 0 && p.images) ||
                    (Array.isArray(p.imei_image) && p.imei_image.filter(Boolean)) ||
                    (p.image_path ? [p.image_path] : []) ||
                    ['/no-image.svg'];

                // Pass the raw imeis array for dynamic variant logic
                const rawImeis = Array.isArray(p.imeis) ? p.imeis.filter(i => i.in_stock === 1) : [];

                const specs = `
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Brand:</strong> ${p.brand_name || p.brands?.name || 'N/A'}</li>
                        <li><strong>Base price:</strong> ৳ ${originalPrice.toLocaleString('en-IN')}</li>
                        <li><strong>Status:</strong> ${p.status || 'N/A'}</li>
                        <li><strong>Current stock:</strong> ${p.current_stock ?? 'N/A'}</li>
                    </ul>
                `;

                const mappedProduct = {
                    id: p.id,
                    name: p.name,
                    price: `৳ ${price.toLocaleString('en-IN')}`,
                    rawPrice: price,
                    originalPrice,
                    oldPrice: hasDiscount
                        ? `৳ ${originalPrice.toLocaleString('en-IN')}`
                        : null,
                    discount: discountLabel,
                    discountValue,
                    discountType,
                    hasDiscount,
                    images,
                    rawImeis,
                    description: p.description || '',
                    specifications: specs,
                    category: {
                        id: p.category_id || p.category?.id,
                        name: p.category_name || p.category?.name,
                        slug: p.category_slug || p.category?.slug || (p.category_name || p.category?.name)?.toLowerCase().replace(/\s+/g, '-')
                    }
                };

                if (!cancelled) {
                    setProductData(mappedProduct);
                    setVariantImages(null); // reset on new product load
                }

                // Load related products
                try {
                    const relatedRes = await getRelatedProduct(p.id);
                    const relatedPayload = relatedRes?.data || relatedRes;
                    const relatedItems = Array.isArray(relatedPayload?.data)
                        ? relatedPayload.data
                        : Array.isArray(relatedPayload)
                            ? relatedPayload
                            : [];

                    if (!cancelled) {
                        const mappedRelated = relatedItems.map((rp) => {
                            const rpPrice = Number(rp.retails_price || 0);
                            return {
                                id: rp.id,
                                name: rp.name,
                                price: `৳ ${rpPrice.toLocaleString('en-IN')}`,
                                oldPrice: null,
                                discount: null,
                                imageUrl: rp.image_path || rp.image_path1 || rp.image_path2 || '/no-image.svg',
                            };
                        });
                        setRelatedProducts(mappedRelated.slice(0, 8));
                    }
                } catch {
                    // ignore related errors
                }
            } catch (err) {
                console.error('Failed to load product details', err);
                if (!cancelled) {
                    setError('Failed to load product details.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [productId]);

    const productName =
        productData?.name ||
        (slug
            ? decodeURIComponent(slug)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (ch) => ch.toUpperCase())
            : 'Product');

    // Determine which images to show in gallery
    const galleryImages = variantImages && variantImages.length > 0
        ? variantImages
        : productData?.images;

    return (
        <div className="bg-white min-h-screen pb-12">
            <div className="border-b border-brand-purple/10 bg-gradient-to-r from-brand-purple/5 to-transparent py-4 md:py-6 mb-6 md:mb-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-[11px] md:text-sm text-gray-500 flex items-center gap-2 font-medium">
                        <Link href="/" className="hover:text-brand-purple cursor-pointer transition-colors">Home</Link>
                        <span>/</span>
                        {fromCategory && productData?.category?.name && (
                            <>
                                <Link
                                    href={`/category/${productData.category.slug}`}
                                    className="hover:text-brand-purple cursor-pointer transition-colors capitalize"
                                >
                                    {productData.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-brand-purple font-bold capitalize truncate">{productName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mb-4"></div>
                        <p className="text-sm text-gray-500">Loading product details…</p>
                    </div>
                ) : error || !productData ? (
                    <div className="py-20 text-center">
                        <p className="text-sm text-red-500">{error || 'Product not found.'}</p>
                    </div>
                ) : (
                    <>
                        {/* 2-Column Top Layout */}
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                            {/* Col 1: Gallery */}
                            <div className="w-full md:w-1/2 lg:w-[40%] shrink-0">
                                <ProductGallery images={galleryImages} />
                            </div>

                            {/* Col 2: Info */}
                            <div className="w-full md:w-1/2 lg:w-[60%]">
                                <ProductInfo
                                    product={productData}
                                    onVariantImageChange={setVariantImages}
                                />
                            </div>
                        </div>

                        {/* Bottom: Tabs */}
                        <ProductTabs
                            description={productData.description}
                            specifications={productData.specifications}
                        />

                        {/* Related Products Section */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-16 md:mt-24 pt-12 border-t border-gray-200">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center md:text-left">
                                    Related Products
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                                    {relatedProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
