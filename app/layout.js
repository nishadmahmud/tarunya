import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import MobileBottomNav from "../components/MobileBottomNav/MobileBottomNav";
import Providers from "../components/Providers";
import FloatingChat from "../components/FloatingChat/FloatingChat";
import { getCategoriesFromServer } from "../lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoBangla = Noto_Sans_Bengali({
  variable: "--font-noto-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "তারুণ্য প্রকাশন | বই ও প্রকাশনা",
  description: "তারুণ্য প্রকাশন — বাংলাদেশের অন্যতম বিশ্বস্ত বই বিক্রয় প্রতিষ্ঠান। সেরা মানের বই, দ্রুত ডেলিভারি এবং সাশ্রয়ী মূল্যে আপনার পছন্দের বই কিনুন।",
  openGraph: {
    title: "তারুণ্য প্রকাশন | বই ও প্রকাশনা",
    description: "তারুণ্য প্রকাশন — বাংলাদেশের অন্যতম বিশ্বস্ত বই বিক্রয় প্রতিষ্ঠান।",
    url: "https://tarunnyoprokashon.com",
    siteName: "তারুণ্য প্রকাশন",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "তারুণ্য প্রকাশন | বই ও প্রকাশনা",
    description: "তারুণ্য প্রকাশন — বাংলাদেশের অন্যতম বিশ্বস্ত বই বিক্রয় প্রতিষ্ঠান।",
  },
};

const isApiConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_API && process.env.NEXT_PUBLIC_USER_ID);
};

export default async function RootLayout({ children }) {
  let categories = [];

  if (isApiConfigured()) {
    try {
      const res = await getCategoriesFromServer();
      if (res?.success && res?.data) {
        categories = res.data;
      }
    } catch (error) {
      console.error("Failed to fetch categories for layout:", error);
    }
  }

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KXF3VNWW');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoBangla.variable} antialiased bg-white text-gray-800 pb-16 md:pb-0`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KXF3VNWW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <Header categories={categories} />
          <main className="min-h-screen flex flex-col bg-white">
            {children}
          </main>
          <MobileBottomNav />
          <Footer categories={categories} />
          <FloatingChat />
        </Providers>
      </body>
    </html>
  );
}
