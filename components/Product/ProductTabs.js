import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiStar, FiUser, FiCamera, FiCheck, FiInfo } from 'react-icons/fi';
import { getProductReviews, saveProductReview, uploadReviewMedia } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ProductTabs({ product, initialReviews = [], onReviewSubmitted }) {
    const { user, token, openAuthModal } = useAuth();
    const [activeTab, setActiveTab] = useState('summary');
    const [reviews, setReviews] = useState(initialReviews);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialReviews && initialReviews.length > 0) {
            setReviews(initialReviews);
        }
    }, [initialReviews]);
    
    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const tabs = [
        { id: 'summary', label: 'সারসংক্ষেপ' },
        { id: 'specification', label: 'বইয়ের তথ্য' },
        { id: 'author', label: 'লেখক' },
        { id: 'reviews', label: 'রিভিউ' },
    ];

    useEffect(() => {
        if (activeTab === 'reviews' && product.id) {
            fetchReviews();
        }
    }, [activeTab, product.id]);

    const fetchReviews = async () => {
        setIsReviewsLoading(true);
        try {
            const res = await getProductReviews(product.id);
            if (res.success || res.data) {
                const reviewList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
                setReviews(reviewList);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsReviewsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            toast.error('সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে।');
            return;
        }

        setSelectedFiles(files);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!token) {
            openAuthModal();
            return;
        }

        if (!comment.trim()) {
            toast.error('অনুগ্রহ করে একটি মন্তব্য লিখুন।');
            return;
        }

        setIsSubmitting(true);
        try {
            let mediaPaths = [];
            
            // 1. Upload media if selected
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach(file => {
                    formData.append('files[]', file);
                });
                formData.append('user_id', user.id);

                const uploadRes = await uploadReviewMedia(formData, token);
                if (uploadRes.success && uploadRes.data) {
                    mediaPaths = Array.isArray(uploadRes.data) ? uploadRes.data : [uploadRes.data];
                }
            }

            // 2. Save review
            const reviewPayload = {
                product_id: product.id,
                customer_id: user.id,
                rating: rating,
                comments: comment,
                media: mediaPaths.join(',')
            };

            const saveRes = await saveProductReview(reviewPayload, token);
            if (saveRes.success) {
                toast.success('রিভিউ সফলভাবে জমা দেওয়া হয়েছে!');
                if (onReviewSubmitted) onReviewSubmitted();
                setComment('');
                setRating(5);
                setSelectedFiles([]);
                setPreviewUrls([]);
                fetchReviews(); // Refresh list
            } else {
                toast.error(saveRes.message || 'রিভিউ জমা দেওয়া যায়নি।');
            }
        } catch (error) {
            console.error('Review submission error:', error);
            toast.error('একটি ভুল হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setIsSubmitting(false);
        }
    };

    const specRows = [
        { label: 'বইয়ের নাম', value: product.name },
        { label: 'লেখক', value: product.author, isLink: true },
        { label: 'প্রকাশক', value: product.publisher, isLink: true },
        { label: 'আইএসবিএন', value: product.isbn },
        { label: 'সংস্করণ', value: product.edition },
        { label: 'পৃষ্ঠা সংখ্যা', value: product.pages },
        { label: 'বাঁধাই', value: product.cover },
        { label: 'দেশ', value: product.country },
        { label: 'ভাষা', value: product.language, isPill: true },
    ];

    const hasDisplayValue = (value) => {
        if (value === null || value === undefined) return false;
        const text = String(value).trim();
        if (!text) return false;
        const normalized = text.toLowerCase();
        return normalized !== 'n/a' && normalized !== 'na' && normalized !== 'null' && normalized !== 'undefined';
    };

    const visibleSpecRows = specRows.filter((row) => hasDisplayValue(row.value));

    return (
        <div className="mt-12 md:mt-24 w-full">
            {/* Tabs Header */}
            <div className="border-b border-gray-200 mb-8 overflow-x-auto overflow-y-hidden scrollbar-hide">
                <div className="flex items-center min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer px-4 md:px-8 pb-4 text-[14px] md:text-[16px] font-medium transition-all relative whitespace-nowrap outline-none ${
                                activeTab === tab.id
                                    ? 'text-brand-green'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-brand-green rounded-t-lg shadow-[0_-2px_8px_rgba(22,163,74,0.3)]"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[200px]">
                {activeTab === 'summary' && (
                    <div className="prose prose-sm md:prose-base max-w-full text-gray-600 leading-relaxed md:leading-loose break-words overflow-x-hidden">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                )}

                {activeTab === 'specification' && (
                    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {visibleSpecRows.map((row, index) => (
                                    <tr 
                                        key={index} 
                                        className={`${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} border-b border-gray-100 last:border-0`}
                                    >
                                        <td className="py-4 px-6 text-sm md:text-base font-semibold text-gray-700 w-1/3 md:w-1/4">
                                            {row.label}
                                        </td>
                                        <td className="py-4 px-6 text-sm md:text-base text-gray-600">
                                            {row.isLink ? (
                                                <span className="text-brand-green hover:underline cursor-pointer transition-all">
                                                    {row.value}
                                                </span>
                                            ) : row.isPill ? (
                                                <span className="bg-brand-green text-white px-3 py-1 rounded-md text-xs md:text-sm font-medium shadow-sm">
                                                    {row.value}
                                                </span>
                                            ) : (
                                                row.value
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'author' && (
                    <div className="bg-white">
                        {product.authorDetails ? (
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Author Avatar */}
                                <Link 
                                    href={`/author/${product.authorDetails.id}`}
                                    className="shrink-0 group"
                                >
                                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-brand-green-light to-brand-cream border-4 border-brand-green/10 flex items-center justify-center group-hover:border-brand-green/30 transition-all duration-300 overflow-hidden relative shadow-lg">
                                        {product.authorDetails.image ? (
                                            <img
                                                src={product.authorDetails.image}
                                                alt={product.authorDetails.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <FiUser className="w-16 h-16 text-brand-green/30" />
                                        )}
                                    </div>
                                </Link>

                                <div className="flex-1">
                                    <Link 
                                        href={`/author/${product.authorDetails.id}`}
                                        className="inline-block"
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 hover:text-brand-green transition-colors mb-2">
                                            {product.authorDetails.name}
                                        </h3>
                                    </Link>
                                    <p className="text-brand-green font-bold text-sm mb-4">
                                        {product.authorDetails.education || "লেখক"}
                                    </p>
                                    <div 
                                        className="prose prose-sm md:prose-base max-w-full text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ 
                                            __html: product.authorDetails.description || product.authorDetails.bio || ' লেখকের জীবনী পাওয়া যায়নি।' 
                                        }} 
                                    />
                                    <div className="mt-6">
                                        <Link 
                                            href={`/author/${product.authorDetails.id}`}
                                            className="inline-flex items-center gap-2 text-brand-green font-bold text-sm hover:underline"
                                        >
                                            লেখকের সব বই দেখুন →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.author}</h3>
                                <p className="text-gray-500 italic">দুঃখিত, এই লেখকের বিস্তারিত তথ্য এই মুহূর্তে পাওয়া যায়নি।</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-12">
                        {/* Review Submission Form */}
                        <div className="bg-gray-50/50 rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiStar className="text-brand-gold fill-brand-gold" />
                                একটি রিভিউ দিন
                            </h4>
                            
                            {!token ? (
                                <div className="text-center py-6">
                                    <p className="text-gray-600 mb-4">রিভিউ দিতে আপনাকে লগ-ইন করতে হবে।</p>
                                    <button 
                                        onClick={() => openAuthModal()}
                                        className="bg-brand-green text-white px-8 py-2.5 rounded-full font-bold hover:bg-brand-green-dark transition-all"
                                    >
                                        লগ-ইন করুন
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">আপনার রেটিং</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <FiStar 
                                                        size={28} 
                                                        className={`${star <= rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-300'}`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">আপনার মন্তব্য</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all outline-none resize-none"
                                            placeholder="বইটি সম্পর্কে আপনার মতামত এখানে লিখুন..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">ছবি যুক্ত করুন (ঐচ্ছিক, সর্বোচ্চ ৫টি)</label>
                                        <div className="flex flex-wrap gap-3">
                                            <label className="w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-green hover:bg-brand-green/5 transition-all group">
                                                <FiCamera size={24} className="text-gray-400 group-hover:text-brand-green" />
                                                <span className="text-[10px] md:text-xs text-gray-400 mt-1 font-medium group-hover:text-brand-green">যোগ করুন</span>
                                                <input 
                                                    type="file" 
                                                    multiple 
                                                    accept="image/*" 
                                                    onChange={handleFileChange} 
                                                    className="hidden" 
                                                />
                                            </label>
                                            
                                            {previewUrls.map((url, i) => (
                                                <div key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative">
                                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto bg-brand-green text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FiCheck />
                                                রিভিউ জমা দিন
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-8">
                            <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                ইউজার রিভিউসমূহ
                                <span className="text-sm font-normal text-gray-400 ml-1">({reviews.length})</span>
                            </h4>

                            {isReviewsLoading ? (
                                <div className="flex flex-col items-center py-12">
                                    <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500">রিভিউ লোড হচ্ছে...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                    <FiInfo size={40} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">এই বইটির জন্য এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reviews.map((review, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                                                        <FiUser size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{review.customer_name || 'পাঠক'}</p>
                                                        <div className="flex text-brand-gold text-xs mt-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FiStar key={i} className={i < review.rating ? 'fill-brand-gold' : 'text-gray-300'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {review.created_at ? new Date(review.created_at).toLocaleDateString('bn-BD') : ''}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed mb-4">{review.comments || review.message}</p>
                                            
                                            {/* Review Media */}
                                            {review.media && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {review.media.split(',').map((img, i) => (
                                                        <img 
                                                            key={i} 
                                                            src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img}`} 
                                                            alt="Review attachment" 
                                                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gray-100"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
