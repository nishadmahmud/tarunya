"use client";

export function Skeleton({ className = "" }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full w-full">
            <Skeleton className="w-full aspect-[3/4]" />
            <div className="p-3 flex flex-col gap-2">
                <Skeleton className="h-3 w-1/3 mb-1" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-auto flex items-center gap-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        </div>
    );
}

export function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
            <Skeleton className="h-3 w-16" />
        </div>
    );
}

export function SectionHeaderSkeleton() {
    return (
        <div className="flex items-end justify-between mb-8">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="hidden md:flex gap-2">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="w-9 h-9 rounded-full" />
            </div>
        </div>
    );
}

export function BlogPostSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="w-full aspect-video rounded-2xl" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

export function ProductRowSkeleton({ title = true, count = 5 }) {
    return (
        <section className="py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {title && <SectionHeaderSkeleton />}
                <div className="flex gap-4 md:gap-6 overflow-hidden">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="w-[42%] sm:w-[30%] md:w-[22%] lg:w-[18%] shrink-0">
                            <ProductCardSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
