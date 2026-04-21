import { 
  getSlidersFromServer, 
  getNewArrivalsFromServer, 
  getBestDealsFromServer, 
  getBestSellersFromServer, 
  getBookFairBestSellersFromServer, 
  getBlogs, 
  getAuthorsList, 
  getTopBrands, 
  getUpcomingProductsFromServer, 
  getEbooksFromServer,
  getCategoriesFromServer
} from "../lib/api";
import Hero from "../components/Hero/Hero";
import FlashSaleSpotlight from "../components/FlashSaleSpotlight/FlashSaleSpotlight";
import NewArrivals from "../components/NewArrivals/NewArrivals";
import EbooksSection from "../components/EbooksSection/EbooksSection";
import ShopCategories from "../components/ShopCategories/ShopCategories";
import PopularAuthors from "../components/PopularAuthors/PopularAuthors";
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts";
import UpcomingBooks from "../components/UpcomingBooks/UpcomingBooks";
import TopPublishers from "../components/TopPublishers/TopPublishers";
import BookFairBestSellers from "../components/BookFairBestSellers/BookFairBestSellers";
import BestDeals from "../components/BestDeals/BestDeals";
import BlogTips from "../components/BlogTips/BlogTips";

// Helpers
const toMoney = (v) => `৳ ${Number(v || 0).toLocaleString("en-IN")}`;
const normalizeDiscount = (discount, type) => {
  const d = Number(discount || 0);
  if (!d || d <= 0) return null;
  return String(type).toLowerCase() === "percentage" ? `-${d}%` : `৳ ${d.toLocaleString("en-IN")}`;
};

export async function HeroContainer() {
  const res = await getSlidersFromServer();
  let heroSlides = [];
  if (res?.success && Array.isArray(res?.sliders)) {
    heroSlides = res.sliders.flatMap((s, sIdx) => {
      let images = Array.isArray(s.image_path) ? s.image_path : (s.image_path ? [s.image_path] : []);
      if (images.length === 0) images = ["/images/hero-fallback.jpg"];
      return images.map((img, imgIdx) => ({
        id: `${s.id || sIdx}-${imgIdx}`,
        title: s.title || "",
        subtitle: s.subtitle || "",
        badge: s.badge || "নতুন সংযোজন",
        buttonText: s.button_text || "সংগ্রহ দেখুন",
        buttonLink: s.link || "/category/all",
        image: img,
      }));
    });
  }
  return <Hero slides={heroSlides} />;
}

export async function FlashSaleContainer() {
  const res = await getBestDealsFromServer();
  let flashSaleProducts = [];
  if (res?.success && Array.isArray(res?.data)) {
    flashSaleProducts = res.data.filter(p => p.image_path || p.image_url).slice(0, 10).map((p) => {
      const originalPrice = Number(p.retails_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
        : originalPrice;
      const nameSlug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/^-|-$/g, '') : "product";
      return {
        id: p.id,
        name: p.name,
        brand: p.brands?.name || "N/A",
        description: p.description ? p.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
        price: toMoney(discountedPrice),
        oldPrice: hasDiscount ? toMoney(originalPrice) : null,
        discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
        imageUrl: p.image_path || p.image_url || "/no-image.svg",
        slug: p.id ? `${nameSlug}-${p.id}` : nameSlug,
      };
    });
  }
  return flashSaleProducts.length > 0 ? <FlashSaleSpotlight products={flashSaleProducts} /> : null;
}

export async function NewArrivalsContainer() {
  const res = await getNewArrivalsFromServer();
  let newArrivals = [];
  const items = res?.success ? res?.data?.data : null;
  if (Array.isArray(items)) {
    newArrivals = items.slice(0, 10).map((p) => {
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const originalPrice = Number(p.retails_price || 0);
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
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
  return newArrivals.length > 0 ? <NewArrivals products={newArrivals} /> : null;
}

export async function EbooksContainer() {
  const res = await getEbooksFromServer();
  let ebookProducts = [];
  const items = res?.success ? (res.data?.data || res.data) : null;
  if (Array.isArray(items)) {
    ebookProducts = items.map((p) => {
      const originalPrice = Number(p.retails_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
        : originalPrice;
      return {
        id: p.id,
        name: p.name,
        brand: p.brands?.name || p.brand_name || "অন্যান্য",
        price: toMoney(discountedPrice),
        oldPrice: hasDiscount ? toMoney(originalPrice) : null,
        discount: hasDiscount ? normalizeDiscount(discountValue, discountType) : null,
        imageUrl: p.image_path || p.image_path1 || p.image_path2 || p.image_url || "/no-image.svg",
        isEbook: true,
      };
    });
  }
  return <EbooksSection products={ebookProducts} />;
}

export async function CategoriesContainer() {
  let categories = [];
  try {
    const res = await getCategoriesFromServer();
    if (res?.success && res?.data) categories = res.data;
  } catch {}
  return categories.length > 0 ? <ShopCategories categories={categories} /> : null;
}

export async function AuthorsContainer() {
  const res = await getAuthorsList();
  let authors = [];
  if (Array.isArray(res)) authors = res.filter(a => a.active === 1).slice(0, 12);
  else if (res?.success && Array.isArray(res?.data)) authors = res.data.filter(a => a.active === 1).slice(0, 12);
  return authors.length > 0 ? <PopularAuthors authors={authors} /> : null;
}

export async function FeaturedContainer() {
  const res = await getBestSellersFromServer();
  let featuredProducts = [];
  const items = res?.success ? (res.data?.data || res.data) : null;
  if (Array.isArray(items)) {
    featuredProducts = items.map((p) => {
      const originalPrice = Number(p.retails_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
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
  return featuredProducts.length > 0 ? <FeaturedProducts products={featuredProducts} /> : null;
}

export async function UpcomingContainer() {
  const res = await getUpcomingProductsFromServer();
  let upcomingProducts = [];
  const items = res?.success ? (res.data?.data || res.data) : null;
  if (Array.isArray(items)) {
    upcomingProducts = items.map((p) => {
      const originalPrice = Number(p.retails_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
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
  return <UpcomingBooks products={upcomingProducts} />;
}

export async function PublishersContainer() {
  const res = await getTopBrands();
  let brands = [];
  if (res?.success && Array.isArray(res?.data)) brands = res.data.slice(0, 12);
  return brands.length > 0 ? <TopPublishers brands={brands} /> : null;
}

export async function BookFairBestSellersContainer() {
  const res = await getBookFairBestSellersFromServer();
  let bookFairBestSellers = [];
  const items = res?.success ? (res.data?.data || res.data) : null;
  if (Array.isArray(items)) {
    bookFairBestSellers = items.map((p) => {
      const originalPrice = Number(p.retails_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
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
  return bookFairBestSellers.length > 0 ? <BookFairBestSellers products={bookFairBestSellers} /> : null;
}

export async function BestDealsContainer() {
  const res = await getBestDealsFromServer();
  let bestDealsCards = [];
  if (res?.success && Array.isArray(res?.data)) {
    bestDealsCards = res.data.slice(0, 2).map((pp, idx) => {
      const p = pp;
      const originalPrice = Number(p.retails_price || 0);
      const discountValue = Number(p.discount || 0);
      const discountType = p.discount_type;
      const hasDiscount = discountValue > 0 && String(discountType || '').toLowerCase() !== '0';
      const discountedPrice = hasDiscount 
        ? (String(discountType).toLowerCase() === 'percentage' ? Math.round(originalPrice * (1 - discountValue / 100)) : originalPrice - discountValue)
        : originalPrice;
      const savingsValue = Math.max(0, originalPrice - discountedPrice);
      const badge = hasDiscount ? (String(discountType).toLowerCase() === 'percentage' ? `-${discountValue}%` : `৳${discountValue} ছাড়`) : (idx === 0 ? "সেরা অফার" : "জনপ্রিয়");
      const descParts = [p.brands?.name, p.status, savingsValue > 0 ? `৳ ${savingsValue.toLocaleString("en-IN")} সাশ্রয়` : null].filter(Boolean);
      const slugName = pp.name ? pp.name.toLowerCase().replace(/\s+/g, "-") : "product";
      return {
        id: pp.id,
        title: pp.name,
        description: descParts.join(" • ") || "সীমিত সময়ের অফার।",
        price: toMoney(discountedPrice),
        oldPrice: hasDiscount ? toMoney(originalPrice) : null,
        savings: savingsValue > 0 ? `৳ ${savingsValue.toLocaleString("en-IN")} সাশ্রয়` : null,
        imageUrl: p.image_path || p.image_url || "/no-image.svg",
        badge,
        link: `/product/${pp.id ? `${slugName}-${pp.id}` : slugName}`,
      };
    });
  }
  return bestDealsCards.length > 0 ? <BestDeals deals={bestDealsCards} /> : null;
}

export async function BlogContainer() {
  const res = await getBlogs();
  let blogPosts = [];
  if (res?.success && Array.isArray(res?.data)) {
    blogPosts = res.data.slice(0, 3).map(b => ({
      id: b.id,
      title: b.title,
      excerpt: b.content ? b.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : 'আমাদের সর্বশেষ পোস্ট পড়ুন...',
      date: new Date(b.created_at || Date.now()).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' }),
      category: b.category_id || 'সাধারণ',
      readTime: '৫ মিনিট',
      image: b.image || "/images/blog-fallback.jpg",
      slug: b.title ? b.title.toLowerCase().replace(/\s+/g, '-') : String(b.id),
    }));
  }
  return blogPosts.length > 0 ? <BlogTips posts={blogPosts} /> : null;
}
