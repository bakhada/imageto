
import React, { useEffect } from 'react';

const Privacy: React.FC = () => {
  useEffect(() => {
    document.title = "Privacy Policy | imageto.org Digital Sovereignty";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-16">
        <h1 className="text-5xl font-black mb-6 dark:text-white tracking-tighter">Privacy Engine & Policy</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Revised: February 2025 • AdSense Policy Verified</p>
      </header>
      
      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-8 max-w-none">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-10 border-l-8 border-blue-600 rounded-r-[3rem] shadow-sm">
          <h2 className="text-blue-600 font-black text-xl uppercase mb-4 tracking-widest">Our Promise</h2>
          <p className="text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-200">
            Privacy isn't a setting here; it's our core architecture. <strong>imageto.org</strong> is built so that we physically cannot see your images. They never leave your local device.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">1. Local Processing Architecture</h2>
          <p>
            When you use our tools, files are loaded into your browser's local RAM. The conversion logic is executed by your local CPU/GPU via <strong>WebAssembly</strong> and the HTML5 Canvas API. No image data is ever uploaded to a network server or cloud storage. This ensures 100% security for sensitive documents and personal photography.
          </p>
        </section>

        <section className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase text-sm tracking-widest text-blue-600">2. Advertising & Third-Party Cookies</h2>
          <p>
            To keep our tools free, we utilize Google AdSense to serve advertisements. 
          </p>
          <ul className="list-disc pl-6 space-y-4 font-semibold text-sm leading-relaxed">
            <li><strong>Google AdSense:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site.</li>
            <li><strong>DART Cookie:</strong> Google's use of the DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet.</li>
            <li>Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy at the following URL: <a href="https://policies.google.com/technologies/ads" className="text-blue-600 underline" target="_blank">Google Ads Policies</a>.</li>
            <li>We may also use other third-party vendors who use cookies to serve ads based on a user's prior visits.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">3. CCPA & GDPR Compliance</h2>
          <p>
            For users in the European Economic Area (EEA) and California: We comply with GDPR and CCPA requirements. Because we do not collect personal data, email addresses (unless provided via contact form), or image content, your rights to data deletion and portability are naturally protected by our "Local-First" architecture. 
          </p>
        </section>

        <div className="pt-16 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            System Integrity Verified • No Cloud Metadata Leakage • Privacy First
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
