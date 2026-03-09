import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
    const nameSlug = product.name ? product.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : 'product';
    const slug = product.id ? `${nameSlug}-${product.id}` : nameSlug;

    return (
        <Link href={`/product/${slug}`} className="bg-white rounded-xl flex flex-col hover:shadow-lg transition-all duration-300 group overflow-hidden relative block border border-gray-100 hover:border-brand-green/20">

            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="bg-brand-gold text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                        {product.discount}
                    </span>
                </div>
            )}

            {/* Book Cover — Portrait Ratio (3:4) */}
            <div className="w-full aspect-[3/4] relative bg-brand-cream rounded-t-xl overflow-hidden">
                <Image
                    src={product.imageUrl || "/no-image.svg"}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle book shadow overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Book Info */}
            <div className="flex flex-col text-left px-3 py-3 flex-1">
                {/* Author/Brand if available */}
                {product.brand && (
                    <span className="text-[10px] md:text-[11px] font-semibold text-brand-green mb-1 truncate">
                        {product.brand}
                    </span>
                )}
                <h3 className="text-gray-800 font-bold text-[12px] md:text-[14px] leading-snug line-clamp-2 mb-2">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-auto">
                    <span className="text-brand-green-dark font-extrabold text-[14px] md:text-[16px]">
                        {product.price}
                    </span>
                    {product.oldPrice && (
                        <span className="text-gray-400 text-[10px] md:text-[11px] font-medium line-through">
                            {product.oldPrice}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
