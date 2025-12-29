import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-12 dark:text-white tracking-tighter leading-tight">
        Engineered for <br /><span className="text-blue-600">Absolute Privacy.</span>
      </h1>
      
      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-10 max-w-none">
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
          Imageto.org is a specialized utility designed to bridge the gap between high-performance media processing and user data security.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">The "Old" Way</h3>
            <p className="text-sm">Traditional converters upload your assets to a cloud server. Once uploaded, you lose control over your data. These servers can be breached, and your private photos can be indexed or stored indefinitely.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-blue-600 tracking-tight">The Imageto.org Way</h3>
            <p className="text-sm">We utilize <strong>WebAssembly (Wasm)</strong> and the <strong>Canvas API</strong> to run the conversion engine directly in your browser. Your computer does the work. We provide the logic. Your data never leaves your safe-zone.</p>
          </div>
        </div>

        <section className="bg-slate-50 dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Our Mission</h2>
          <p>
            We believe that the future of the internet is "Local-First." By moving heavy computational tasks from massive, energy-hungry data centers to the increasingly powerful processors in our pockets and on our desks, we can create a faster, greener, and significantly more private digital world.
          </p>
        </section>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-8 tracking-tight uppercase text-sm tracking-widest text-blue-600">Transparency & Funding</h2>
        <p>
          Imageto.org is a free-to-use utility. We maintain our infrastructure through non-intrusive, policy-compliant advertising. This allows us to keep our pro-grade tools accessible to everyone—from student designers to professional developers—without ever compromising on our core value: your privacy.
        </p>

        <div className="pt-16 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
          <h3 className="text-xl font-black dark:text-white mb-4 uppercase tracking-widest">Contact the Team</h3>
          <p className="text-sm font-bold mb-8">For support, partnerships, or business inquiries:</p>
          <a href="mailto:support@imageto.org" className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
            Email Infrastructure Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;