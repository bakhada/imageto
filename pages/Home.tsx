
import React, { useEffect } from 'react';
import Converter from '../components/Converter';
import SEOSection from '../components/SEOSection';
import AdPlaceholder from '../components/AdPlaceholder';
import { GENERAL_FAQ, TOOLS } from '../constants';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  useEffect(() => {
    document.title = "imageto.org | Private Online Image Converter, Compressor & Resizer";
    window.scrollTo(0, 0);
    
    // Structured Data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json-home';
    script.innerHTML = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "imageto.org",
        "operatingSystem": "All",
        "applicationCategory": "DesignApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Privacy-focused online image converter that processes all files locally in the browser. Supports JPG, PNG, and WebP."
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": GENERAL_FAQ.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]);
    document.head.appendChild(script);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'The world\'s most private image converter. Convert JPG, PNG, and WebP instantly. Zero server uploads. Secure, fast, and free online tool optimized for SEO and performance.');
    }

    return () => {
      const el = document.getElementById('ld-json-home');
      if (el) document.head.removeChild(el);
    };
  }, []);

  return (
    <div className="space-y-24 md:space-y-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="text-center pt-24 md:pt-32 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="inline-flex items-center mb-10 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] rounded-full border border-indigo-200/50 dark:border-indigo-800 shadow-sm">
          Professional Image Optimization — Zero Cloud Latency
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black tracking-tighter mb-10 text-slate-950 dark:text-white leading-[0.85] max-w-[90rem] mx-auto uppercase">
          Private Image <br />
          <span className="gradient-brand">Converter.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-20 font-semibold leading-relaxed tracking-tight">
          Redefining safety in media tools. High-performance batch conversion for JPG, PNG, WebP, and HEIC handled exclusively on your local hardware.
        </p>
        
        <div className="relative z-10">
          <Converter />
        </div>
      </section>

      {/* TOP PLACEMENT: Leaderboard after Hero */}
      <div className="flex justify-center">
        <AdPlaceholder type="leaderboard" className="mt-8" />
      </div>

      {/* Trust & SEO Stats Bar */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 py-16 border-y border-slate-200/50 dark:border-slate-800/40">
        {[
          { label: "Privacy Core", value: "Offline", sub: "100% Client-Side" },
          { label: "Capacity", value: "∞", sub: "No Daily Limits" },
          { label: "Engine", value: "Wasm", sub: "Desktop Speed" },
          { label: "Security", value: "Locked", sub: "No Server Uploads" }
        ].map((stat, i) => (
          <div key={i} className="text-center md:text-left group">
            <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4 group-hover:text-indigo-600 transition-colors">{stat.label}</h2>
            <p className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter mb-2">{stat.value}</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* Keyword-Rich Tool Library */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4 uppercase text-xs tracking-[0.3em] text-indigo-600">Tool Ecosystem</h2>
          <p className="text-slate-600 dark:text-slate-400 font-bold text-3xl max-w-2xl leading-tight">Advanced media pipelines for creators who value privacy over cloud convenience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map(tool => (
            <Link 
              key={tool.id} 
              to={`/${tool.slug}`}
              className="group p-10 card-pro rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-500 flex flex-col items-start"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-950 dark:text-white mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-4 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-[0.2em] leading-none">{tool.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-10">{tool.description}</p>
              <div className="mt-auto flex items-center text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all tracking-widest translate-x-[-10px] group-hover:translate-x-0">
                Launch Module <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Comparison Table Section — High Value for Snippets */}
      <section className="max-w-6xl mx-auto px-6 py-20 bg-white/50 dark:bg-slate-900/40 rounded-[4rem] border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight mb-4">Choose Your Output Pipeline</h2>
           <p className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Format Selection Framework</p>
        </div>
        <div className="overflow-x-auto px-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Format</th>
                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Best For</th>
                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Compression</th>
                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Alpha Support</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-700 dark:text-slate-300">
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-6 px-4 text-indigo-600 dark:text-indigo-400 font-black">JPEG / JPG</td>
                <td className="py-6 px-4">Photography & Web Images</td>
                <td className="py-6 px-4">Lossy (High)</td>
                <td className="py-6 px-4 text-slate-400 dark:text-slate-600">No</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-6 px-4 text-indigo-600 dark:text-indigo-400 font-black">PNG</td>
                <td className="py-6 px-4">Logos, Graphics, UI Elements</td>
                <td className="py-6 px-4">Lossless</td>
                <td className="py-6 px-4 text-emerald-600 dark:text-emerald-500">Full</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <td className="py-6 px-4 text-indigo-600 dark:text-indigo-400 font-black">WebP</td>
                <td className="py-6 px-4">SEO & Core Web Vitals</td>
                <td className="py-6 px-4">Mixed (Superior)</td>
                <td className="py-6 px-4 text-emerald-600 dark:text-emerald-500">Full</td>
              </tr>
              <tr>
                <td className="py-6 px-4 text-indigo-600 dark:text-indigo-400 font-black">PDF</td>
                <td className="py-6 px-4">Documents & Printing</td>
                <td className="py-6 px-4">Container</td>
                <td className="py-6 px-4 text-slate-400 dark:text-slate-600">Variable</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* In-depth SEO Text Pillars */}
      <div className="max-w-6xl mx-auto px-6">
        <SEOSection 
          title="The Most Secure Online Image Converter"
          description="At imageto.org, we believe that your digital privacy should never be a trade-off for productivity. While other 'free online converters' harvest your photos and store them on remote servers, we've engineered a zero-trust architecture. By using your browser's native File and Canvas APIs, we perform complex image manipulations directly on your device. This means you can convert sensitive documents, private photos, and confidential graphics with 100% certainty that no one else will ever see them. Our tools are optimized for photographers, legal professionals, and web developers who need professional output without the cloud security risk."
          steps={[
            "Select your assets (JPG, PNG, WebP, HEIC) from your local drive.",
            "Configure output parameters: target format, compression quality, and pixel dimensions.",
            "Our local WebAssembly engine processes the batch instantly in your system RAM.",
            "Save your sanitized, optimized images directly to your local storage."
          ]}
          faqs={GENERAL_FAQ}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 text-center">
        <AdPlaceholder type="leaderboard" label="Infrastructure Sponsor" />
      </div>
    </div>
  );
};

export default Home;
