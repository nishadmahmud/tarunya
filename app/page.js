import Hero from "../components/Hero/Hero";
// import TrustStats from "../components/TrustStats/TrustStats";
import ShopCategories from "../components/ShopCategories/ShopCategories";
import NewArrivals from "../components/NewArrivals/NewArrivals";
// import PromoBanners from "../components/PromoBanners/PromoBanners";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import BestDeals from "../components/BestDeals/BestDeals";
import BlogTips from "../components/BlogTips/BlogTips";
// import CTABanner from "../components/CTABanner/CTABanner";
import FAQ from "../components/FAQ/FAQ";
import BookFairBestSellers from "../components/BookFairBestSellers/BookFairBestSellers";
// import SeriesBooks from "../components/SeriesBooks/SeriesBooks";
// import PopularAuthors from "../components/PopularAuthors/PopularAuthors";
// import PreOrderBooks from "../components/PreOrderBooks/PreOrderBooks";
// import CuratedReadingLists from "../components/CuratedReadingLists/CuratedReadingLists";
// import TopPublishers from "../components/TopPublishers/TopPublishers";
// import AppDownloadBanner from "../components/AppDownloadBanner/AppDownloadBanner";
// import Testimonials from "../components/Testimonials/Testimonials";
// import FAQ from "../components/FAQ/FAQ";

import {
  getSlidersFromServer,
  getCategoriesFromServer,
  getNewArrivalsFromServer,
  getProducts,
  getBlogs,
  getBannerFromServer,
  getBestDealsFromServer,
  getBestSellersFromServer,
  getBookFairBestSellersFromServer
} from "../lib/api";

const isApiConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_API && process.env.NEXT_PUBLIC_USER_ID);
};

export default async function Home() {
  let categories = [];
  let newArrivals = [];
  let heroSlides = [];
  let homeBanners = [];
  let bestDealsCards = [];
  let flashSaleProducts = [];
  let featuredProducts = [];
  let bookFairBestSellers = [];
  let blogPosts = [];

  // Skip all API calls if environment is not configured — fallback data in each component will be used
  if (!isApiConfigured()) {
    return (
      <>
        <Hero slides={[]} banners={[]} />
        <TrustStats />
        <ShopCategories categories={[]} flashSaleProducts={[]} />
        {/* <SeriesBooks /> */}
        <NewArrivals products={[]} />
        {/* <PopularAuthors /> */}
        <PromoBanners />
        <FeaturedProducts products={[]} />
        <BookFairBestSellers />
        {/* <PreOrderBooks /> */}
        <BestDeals deals={[]} />
        {/* <CuratedReadingLists /> */}
        {/* <TopPublishers /> */}
        <BlogTips posts={[]} />
        <CTABanner />
        {/* <AppDownloadBanner /> */}
        {/* <Testimonials /> */}
        {/* <FAQ /> */}
      </>
    );
  }

  const toMoney = (v) => `৳ ${Number(v || 0).toLocaleString("en-IN")}`;
  const normalizeDiscount = (discount, type) => {
    const d = Number(discount || 0);
    if (!d || d <= 0) return null;
    return String(type).toLowerCase() === "percentage"
      ? `-${d}%`
      : `৳ ${d.toLocaleString("en-IN")}`;
  };

  try {
    const res = await getCategoriesFromServer();
    if (res?.success && res?.data) categories = res.data;
  } catch (error) { console.error("Failed to fetch categories:", error); }

  try {
    const res = await getBannerFromServer();
    if (res?.success && Array.isArray(res?.banners)) {
      homeBanners = res.banners.map(b => ({
        id: b.id,
        image: b.image_path,
        link: b.button_url || "/"
      }));
    }
  } catch (error) { console.error("Failed to fetch banners:", error); }

  try {
    const res = await getSlidersFromServer();
    const sliderData = res?.success ? res?.sliders : null;
    let images = [];
    if (Array.isArray(sliderData) && sliderData.length > 0) {
      const s = sliderData[0];
      // Collect all possible image arrays
      const imageCandidates = [
        Array.isArray(s.image_path) ? s.image_path : [],
        Array.isArray(s.image_paths) ? s.image_paths : [],
        Array.isArray(s.images) ? s.images : []
      ];
      
      // Pick the best array
      let best = imageCandidates.reduce((a, b) => b.length > a.length ? b : a, []);
      
      // Fallback to singular image_path string if no arrays found
      if (best.length === 0 && s.image_path && typeof s.image_path === 'string') {
        images = [s.image_path];
      } else {
        images = best;
      }
    }

    heroSlides = images.map((img, idx) => ({
      id: idx,
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      image: img,
    }));
  } catch (error) { console.error("Failed to fetch sliders:", error); }

  try {
    const res = await getNewArrivalsFromServer();
    const items = res?.success ? res?.data?.data : null;
    if (Array.isArray(items)) {
      newArrivals = items.slice(0, 10).map((p) => {
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

        const originalPrice = Number(p.retails_price || 0);
        const discountedPrice = hasDiscount
          ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
          : originalPrice;

        return {
          id: p.id,
          name: p.name,
          brand: p.brands?.name || "অন্যান্য",
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
          imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
        };
      });
    }
  } catch (error) { console.error("Failed to fetch new arrivals:", error); }

  try {
    const res = await getBestDealsFromServer();
    const items = res?.success ? res?.data : null;
    if (Array.isArray(items)) {
      const sortedItems = [...items].sort((a, b) => {
        const priceA = Number(a.discounted_price || a.retails_price || 0);
        const priceB = Number(b.discounted_price || b.retails_price || 0);
        return priceB - priceA;
      });

      bestDealsCards = sortedItems.slice(0, 2).map((pp, idx) => {
        const p = pp;
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

        const discountedPrice = hasDiscount
          ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
          : originalPrice;

        const savingsValue = Math.max(0, originalPrice - discountedPrice);

        const badge = hasDiscount ? (String(discountType).toLowerCase() === 'percentage' ? `-${discountValue}%` : `৳${discountValue} ছাড়`) : (idx === 0 ? "সেরা অফার" : "জনপ্রিয়");
        const descParts = [];
        if (p.brands?.name) descParts.push(p.brands.name);
        if (p.status) descParts.push(p.status);
        if (savingsValue > 0) descParts.push(`৳ ${savingsValue.toLocaleString("en-IN")} সাশ্রয়`);

        const slugName = pp.name ? pp.name.toLowerCase().replace(/\s+/g, "-") : "product";
        const slugWithId = pp.id ? `${slugName}-${pp.id}` : slugName;

        return {
          id: pp.id,
          title: pp.name,
          description: descParts.join(" • ") || "সীমিত সময়ের অফার।",
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          savings: savingsValue > 0 ? `৳ ${savingsValue.toLocaleString("en-IN")} সাশ্রয়` : null,
          imageUrl: p.image_path || p.image_url || "/no-image.svg",
          badge,
          link: `/product/${slugWithId}`,
        };
      });

      flashSaleProducts = items.filter(p => p.image_path || p.image_url).slice(0, 10).map((p) => {
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

        const discountedPrice = hasDiscount
          ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
          : originalPrice;

        return {
          id: p.id,
          name: p.name,
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
          imageUrl: p.image_path || p.image_url || "/no-image.svg",
        };
      });
    }
  } catch (error) { console.error("Failed to fetch best deals:", error); }

  try {
    const res = await getBestSellersFromServer();
    const items = res?.success ? (res.data?.data || res.data) : null;
    if (Array.isArray(items)) {
      featuredProducts = items.map((p) => {
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

        const discountedPrice = hasDiscount
          ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
          : originalPrice;

        return {
          id: p.id,
          name: p.name,
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
          imageUrl: p.image_path || p.image_url || "/no-image.svg",
        };
      });
    }
  } catch (error) { console.error("Failed to fetch best sellers:", error); }

  try {
    const res = await getBookFairBestSellersFromServer();
    const items = res?.success ? (res.data?.data || res.data) : null;
    if (Array.isArray(items)) {
      bookFairBestSellers = items.map((p) => {
        const originalPrice = Number(p.retails_price || 0);
        const discountValue = Number(p.discount || 0);
        const discountType = p.discount_type;
        const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';

        const discountedPrice = hasDiscount
          ? (String(discountType).toLowerCase() === 'percentage'
            ? Math.max(0, Math.round(originalPrice * (1 - discountValue / 100)))
            : Math.max(0, originalPrice - discountValue))
          : originalPrice;

        return {
          id: p.id,
          name: p.name,
          brand: p.brands?.name || "অন্যান্য",
          price: toMoney(discountedPrice),
          oldPrice: hasDiscount ? toMoney(originalPrice) : null,
          discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
          imageUrl: p.image_path || p.image_url || "/no-image.svg",
        };
      });
    }
  } catch (error) { console.error("Failed to fetch book fair best sellers:", error); }

  try {
    const res = await getBlogs();
    if (res?.success && Array.isArray(res?.data)) {
      blogPosts = res.data.slice(0, 3).map(b => ({
        id: b.id,
        title: b.title,
        excerpt: b.content ? b.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : 'আমাদের সর্বশেষ পোস্ট পড়ুন...',
        date: new Date(b.created_at || Date.now()).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
        category: b.category_id || 'সাধারণ',
        readTime: '৫ মিনিট',
        image: b.image || "/images/blog-fallback.jpg",
        slug: b.title ? b.title.toLowerCase().replace(/\s+/g, '-') : String(b.id)
      }));
    }
  } catch (error) { console.error("Failed to fetch blogs:", error); }

  return (
    <>
      {(heroSlides.length > 0 || homeBanners.length > 0) && <Hero slides={heroSlides} banners={homeBanners} />}
      {/* <TrustStats /> */}

      {(categories.length > 0 || flashSaleProducts.length > 0) && <ShopCategories categories={categories} flashSaleProducts={flashSaleProducts} />}
      {/* <SeriesBooks /> */}
      {newArrivals.length > 0 && <NewArrivals products={newArrivals} />}
      {/* <PopularAuthors /> */}
      {/* <PromoBanners /> */}
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}
      {bookFairBestSellers.length > 0 && <BookFairBestSellers products={bookFairBestSellers} />}
      {/* <PreOrderBooks /> */}
      {bestDealsCards.length > 0 && <BestDeals deals={bestDealsCards} />}
      {/* <CuratedReadingLists /> */}
      {/* <TopPublishers /> */}
      {blogPosts.length > 0 && <BlogTips posts={blogPosts} />}
      {/* <CTABanner /> */}
      {/* <AppDownloadBanner /> */}
      {/* <Testimonials /> */}
      <FAQ />
    </>
  );
}
