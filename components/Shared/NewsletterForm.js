"use client";

export default function NewsletterForm() {
    return (
        <form className="flex flex-col sm:flex-row gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
            <input
                type="email"
                placeholder="আপনার ইমেইল দিন"
                className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-green min-w-full md:min-w-[300px]"
            />
            <button className="px-8 py-3.5 bg-brand-green text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-brand-green transition-all shadow-xl whitespace-nowrap">
                সাবস্ক্রাইব
            </button>
        </form>
    );
}
