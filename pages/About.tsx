
import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-black mb-8 dark:text-white tracking-tighter leading-[0.9]">
          Expertise in <br /><span className="text-indigo-600">Local Media.</span>
        </h1>
        <p className="text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Built for the Digital Sovereignty Movement</p>
      </header>
      
      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-12 max-w-none">
        <section className="bg-indigo-600 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h2 className="text-3xl font-black mb-6 tracking-tight text-white">Our Local-First Mission</h2>
          <p className="text-lg opacity-90 leading-relaxed font-semibold">
            In an era where "free" web services often act as data harvesting funnels, imageto.org provides a high-performance, expert-grade alternative. We believe that professional image manipulation shouldn't require surrendering your data sovereignty. Our platform is a technical proof-of-concept for a more secure, decentralized web.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">The Professional Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm">
              <h3 className="text-lg font-black text-indigo-600 mb-4 uppercase tracking-widest">WebAssembly (Wasm)</h3>
              <p className="text-sm font-bold leading-relaxed">We compile native C++ and Rust media codecs into WebAssembly modules. This allows us to provide desktop-class performance for heavy 4K photography and complex HEIC decoding without ever leaving the browser's secure sandbox.</p>
            </div>
            <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-sm">
              <h3 className="text-lg font-black text-indigo-600 mb-4 uppercase tracking-widest">Zero-Trust Ethics</h3>
              <p className="text-sm font-bold leading-relaxed">Our architecture is built on the principle of minimal data exposure. We don't just "promise" not to see your images; we have engineered the system so that it is technically impossible for us to access your local file buffers.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase text-xs tracking-[0.3em] text-indigo-600">Monetization & Transparency</h2>
          <p className="font-bold">
            imageto.org is a free-to-use utility supported by high-quality advertising via Google AdSense. This model allows us to fund the continuous research and development of local-first media codecs while keeping the tool accessible to everyone. We strictly adhere to the Google Publisher Policies to ensure our users receive only safe, relevant, and professional advertising content.
          </p>
        </section>

        <div className="pt-20 border-t border-slate-200 dark:border-slate-800 text-center">
          <h3 className="text-2xl font-black dark:text-white mb-8 leading-none">Connect with the Team</h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
              Direct Support
            </Link>
            <Link to="/blog" className="px-10 py-5 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
              Technical Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
