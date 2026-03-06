import Link from 'next/link';

export const metadata = {
    title: 'About Us | Pochondo Shop',
    description: 'Learn about Pochondo Shop — Bangladesh\'s premier destination for genuine tech gear, smart gadgets, and digital lifestyle accessories.',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-purple/10 via-purple-50 to-white py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">About <span className="text-brand-purple">Pochondo Shop</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Bangladesh's premier destination for genuine tech gear, smart gadgets, and digital lifestyle accessories.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Pochondo Shop is a leading electronics and gadget retailer in Bangladesh. We are passionate about bringing the latest technology to your doorstep at the most competitive prices. From smartphones and laptops to accessories and smart home devices, we curate only the best products from top global brands.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our mission is to make premium technology accessible to everyone in Bangladesh. We believe that everyone deserves access to genuine, high-quality tech products with reliable after-sales support and warranty coverage.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: '100% Genuine Products', desc: 'Every product we sell is sourced directly from authorized distributors and manufacturers.' },
                            { title: 'Best Prices Guaranteed', desc: 'We offer competitive pricing with regular discounts, deals, and special promotions.' },
                            { title: 'Fast Delivery', desc: 'We deliver across Bangladesh with express shipping options available for urgent orders.' },
                            { title: 'After-Sales Support', desc: 'Our dedicated support team is always ready to help you with any queries or issues.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-gray-100">
                    <p className="text-gray-500 mb-4">Have questions? We'd love to hear from you.</p>
                    <Link href="/contact" className="inline-block bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
