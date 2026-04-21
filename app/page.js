import { Suspense } from "react";
import FAQ from "../components/FAQ/FAQ";
import HomepagePrefetchManager from "../components/Performance/HomepagePrefetchManager";
import { 
  ProductRowSkeleton, 
  CategorySkeleton, 
  Skeleton 
} from "../components/Shared/Skeleton";

import {
  HeroContainer,
  FlashSaleContainer,
  NewArrivalsContainer,
  EbooksContainer,
  CategoriesContainer,
  AuthorsContainer,
  FeaturedContainer,
  UpcomingContainer,
  PublishersContainer,
  BookFairBestSellersContainer,
  BestDealsContainer,
  BlogContainer
} from "./HomeContainers";

const isApiConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_API && process.env.NEXT_PUBLIC_USER_ID);
};

// Loading components for granular sections
function HeroPlaceholder() {
  return <Skeleton className="w-full h-[300px] md:h-[500px]" />;
}

function CategoriesPlaceholder() {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex gap-4 md:gap-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shrink-0">
             <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  if (!isApiConfigured()) {
    // Fallback for unconfigured environment
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">এপিআই কনফিগার করা নেই</h1>
        <p className="text-gray-500">দয়া করে এপিআই এবং ইউজার আইডি সেট আপ করুন।</p>
      </div>
    );
  }

  return (
    <>
      {/* Priority 1: Hero Slider */}
      <Suspense fallback={<HeroPlaceholder />}>
        <HeroContainer />
      </Suspense>

      {/* Priority 2: High conversion sections */}
      <Suspense fallback={<ProductRowSkeleton title={false} count={4} />}>
        <FlashSaleContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <NewArrivalsContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <EbooksContainer />
      </Suspense>

      <Suspense fallback={<CategoriesPlaceholder />}>
        <CategoriesContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <AuthorsContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <FeaturedContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <UpcomingContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <PublishersContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <BookFairBestSellersContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton count={2} />}>
        <BestDealsContainer />
      </Suspense>

      <Suspense fallback={<ProductRowSkeleton />}>
        <BlogContainer />
      </Suspense>

      <FAQ />

      {/* Prefetcher moved to bottom with empty candidates for now 
          (It will catch up later or we can refine its data source) */}
      <HomepagePrefetchManager 
        productCandidates={[]} 
        categoryCandidates={[]} 
      />
    </>
  );
}
