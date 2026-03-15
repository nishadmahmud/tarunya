"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProductGallery from '../../../components/Product/ProductGallery';
import ProductInfo from '../../../components/Product/ProductInfo';
import ProductTabs from '../../../components/Product/ProductTabs';
import ProductCard from '../../../components/Shared/ProductCard';
import { getAuthorById, getProductById, getRelatedProduct, getProductReviews } from '../../../lib/api';

export default function ProductDetailsPage() {
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

    // Parse product ID from slug (supports "product-name-12345", "12345", or dummy IDs like "f1")
    const productId = useMemo(() => {
        if (!slug) return null;
        const decoded = decodeURIComponent(slug).trim();

        // If there's no hyphen, the whole slug is the ID
        if (!decoded.includes('-')) {
            return decoded;
        }

        // Otherwise, it's usually "name-<id>", so take the last part
        const parts = decoded.split('-');
        return parts[parts.length - 1];
    }, [slug]);

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [variantImages, setVariantImages] = useState(null);
    const [fromCategory, setFromCategory] = useState(null); // { name, slug }
    const [reviewSummary, setReviewSummary] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);

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
                let p;
                // If it's a numeric ID, try the API
                if (/^\d+$/.test(String(productId))) {
                    const res = await getProductById(productId);
                    const payload = res?.data || res;
                    if (!payload || !payload.id) {
                        throw new Error('Product not found');
                    }
                    p = payload;
                } else {
                    throw new Error('Dummy product');
                }

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

                const imageCandidates = [
                    Array.isArray(p.images) ? p.images : [],
                    Array.isArray(p.image_paths) ? p.image_paths : [],
                    Array.isArray(p.imei_image) ? p.imei_image.filter(Boolean) : []
                ];
                
                // Pick the one with the most images
                let bestImages = imageCandidates.reduce((best, curr) => curr.length > best.length ? curr : best, []);
                
                // If all arrays are empty, fallback to singular image_path or placeholder
                const images = (bestImages.length > 0) ? bestImages : (p.image_path ? [p.image_path] : ['/no-image.svg']);

                // Pass the raw imeis array for dynamic variant logic
                const rawImeis = Array.isArray(p.imeis) ? p.imeis.filter(i => i.in_stock === 1) : [];

                const getSpec = (name) => {
                    const spec = p.specifications?.find(s => s.name.toLowerCase() === name.toLowerCase());
                    return spec ? spec.description : null;
                };
                const authorData = p.author || null;
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
                    brand: p.brand_name || p.brands?.name || 'N/A',
                    publisher: getSpec('Publisher') || p.publisher || 'N/A',
                    isbn: getSpec('ISBN') || p.isbn || 'N/A',
                    edition: getSpec('Edition') || p.edition || 'N/A',
                    pages: getSpec('Number of Pages') || getSpec('Pages') || p.pages || p.total_pages || 'N/A',
                    country: getSpec('Country') || p.country || 'N/A',
                    language: getSpec('Language') || p.language || 'N/A',
                    cover: getSpec('Cover') || p.cover || 'N/A',
                    author: getSpec('Author') || authorData?.name || p.author_name || (p.authors ? p.authors.name : 'N/A'),
                    authorDetails: authorData,
                    category: {
                        id: p.category_id || p.category?.id,
                        name: p.category_name || p.category?.name,
                        slug: p.category_slug || p.category?.slug || (p.category_name || p.category?.name)?.toLowerCase().replace(/\s+/g, '-')
                    },
                    youtubeLink: p.youtube_link || p.video_link || null,
                    pdfFile: p.pdf_file || null
                };

                if (!cancelled) {
                    setProductData(mappedProduct);
                    setVariantImages(null); // reset on new product load
                }

                // Load reviews and summary
                try {
                    const reviewRes = await getProductReviews(p.id);
                    if (!cancelled) {
                        if (reviewRes?.summary) setReviewSummary(reviewRes.summary);
                        if (reviewRes?.data) {
                            const reviewList = Array.isArray(reviewRes.data?.data) ? reviewRes.data.data : (Array.isArray(reviewRes.data) ? reviewRes.data : []);
                            setReviewsData(reviewList);
                        }
                    }
                } catch (err) {
                    console.error('Failed to load review summary:', err);
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
                console.error('Failed to load product details from API, using fallback:', err);
                if (!cancelled) {
                    const decodedName = decodeURIComponent(slug).replace(/-[^-]+$/, '').replace(/-/g, ' ');

                    const dummyProduct = {
                        id: productId || 'dummy',
                        name: decodedName || "ইসলামিক বই",
                        price: "৳ ৩৫০",
                        rawPrice: 350,
                        originalPrice: 500,
                        oldPrice: "৳ ৫০০",
                        discount: "-৩০%",
                        discountValue: 30,
                        discountType: "percentage",
                        hasDiscount: true,
                        images: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800"],
                        rawImeis: [],
                        description: "<p>এটি একটি ডেমো বইয়ের বিবরণ। আসল ডাটাবেস বা এপিআই কানেক্ট না থাকায় এই ডেমো পেজটি দেখানো হচ্ছে। বইটি ইসলামিক জ্ঞান অন্বেষণের জন্য একটি চমৎকার উৎস হতে পারে।</p>",
                        brand: "তারুণ্য প্রকাশন (ডেমো)",
                        author: "উবাইদুল্লাহ আস সাহাল",
                        publisher: "তারুণ্য প্রকাশন",
                        isbn: "9789849697763",
                        edition: "১ম প্রকাশ, ২০২৩",
                        pages: "৭২",
                        country: "বাংলাদেশ",
                        language: "বাংলা এবং আরবি",
                        category: {
                            id: 1,
                            name: "ইসলামী বই",
                            slug: "islamic-books"
                        },
                        youtubeLink: "https://www.youtube.com/watch?v=wzXQ0FkXmGQ",
                        pdfFile: "https://www.outletexpense.xyz/uploads/3-Emdad/1773408731_69b411db20c98.pdf"
                    };

                    setProductData(dummyProduct);
                    setVariantImages(null);

                    setRelatedProducts([
                        { id: 'r1', name: "সীরাতুন নবী (সা.)", price: "৳ 450", oldPrice: "৳ 600", imageUrl: "https://images.unsplash.com/photo-1542871793-27e0283da70b?q=80&w=800" },
                        { id: 'r2', name: "কুরআনের আলো", price: "৳ 300", oldPrice: null, imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=800" },
                        { id: 'r3', name: "গল্পে গল্পে ইসলাম", price: "৳ 250", oldPrice: "৳ 350", imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800" },
                        { id: 'r4', name: "আদর্শ পরিবার", price: "৳ 320", oldPrice: null, imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800" },
                    ]);
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
            <div className="border-b border-brand-green/10 bg-gradient-to-r from-brand-green/5 to-transparent py-4 md:py-6 mb-6 md:mb-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-[11px] md:text-sm text-gray-500 flex items-center gap-2 font-medium">
                        <Link href="/" className="hover:text-brand-green cursor-pointer transition-colors">হোম</Link>
                        <span>/</span>
                        {fromCategory && productData?.category?.name && (
                            <>
                                <Link
                                    href={`/category/${productData.category.slug}`}
                                    className="hover:text-brand-green cursor-pointer transition-colors capitalize"
                                >
                                    {productData.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-brand-green font-bold capitalize truncate">{productName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                        <p className="text-sm text-gray-500">বইয়ের তথ্য লোড হচ্ছে…</p>
                    </div>
                ) : error || !productData ? (
                    <div className="py-20 text-center">
                        <p className="text-sm text-red-500">{error || 'বইটি পাওয়া যায়নি।'}</p>
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
                            <div className="w-full md:w-1/2 lg:w-[60%] min-w-0 overflow-hidden">
                                <ProductInfo
                                    product={productData}
                                    onVariantImageChange={setVariantImages}
                                    reviewSummary={reviewSummary}
                                />
                            </div>
                        </div>

                        {/* Bottom: Tabs */}
                        <ProductTabs
                            product={productData}
                            initialReviews={reviewsData}
                            onReviewSubmitted={async () => {
                                // Re-fetch reviews at page level after new submission
                                try {
                                    const reviewRes = await getProductReviews(productData.id);
                                    if (reviewRes?.summary) setReviewSummary(reviewRes.summary);
                                    if (reviewRes?.data) {
                                        const list = Array.isArray(reviewRes.data?.data) ? reviewRes.data.data : (Array.isArray(reviewRes.data) ? reviewRes.data : []);
                                        setReviewsData(list);
                                    }
                                } catch (err) {
                                    console.error('Failed to refresh reviews:', err);
                                }
                            }}
                        />

                        {/* Related Products Section */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-16 md:mt-24 pt-12 border-t border-gray-200">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center md:text-left">
                                    সম্পর্কিত বইসমূহ
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
