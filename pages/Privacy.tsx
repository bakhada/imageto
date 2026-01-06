
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
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Revised: March 2025 • AdSense & GDPR Compliance Verified</p>
      </header>
      
      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-8 max-w-none">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-10 border-l-8 border-blue-600 rounded-r-[3rem] shadow-sm">
          <h2 className="text-blue-600 font-black text-xl uppercase mb-4 tracking-widest">Our Data Promise</h2>
          <p className="text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-200">
            Privacy isn't a secondary feature at <strong>imageto.org</strong>; it is our primary engineering constraint. We utilize a "Zero-Knowledge" architecture where your media never touches a remote server.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">1. Local Execution Architecture</h2>
          <p>
            When you interact with our conversion suite, files are loaded into your browser's local sandbox. The transformation logic is executed by your local hardware via <strong>WebAssembly (Wasm)</strong>. No image data is ever transmitted to a network server.
          </p>
        </section>

        <section className="space-y-6 bg-slate-50 dark:bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase text-sm tracking-widest text-blue-600">2. Advertising & Google AdSense Policy</h2>
          <p>
            To keep our professional tools free of charge, we partner with Google AdSense to serve advertisements. 
          </p>
          <ul className="list-disc pl-6 space-y-4 font-semibold text-sm leading-relaxed">
            <li><strong>Third-Party Vendors:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site based on a user's prior visits to this website or other websites.</li>
            <li><strong>Personalized Advertising:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
            <li><strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 underline" target="_blank" rel="noopener">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-blue-600 underline" target="_blank" rel="noopener">www.aboutads.info</a>.</li>
            <li><strong>Data Usage:</strong> For more information on how Google uses data when you use our site, please visit: <a href="https://policies.google.com/technologies/partner-sites" className="text-blue-600 underline" target="_blank" rel="noopener">How Google uses information from sites or apps that use our services</a>.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">3. CCPA & GDPR Compliance</h2>
          <p>
            For users in the European Economic Area (EEA) and California: We strictly adhere to GDPR and CCPA. Because our core tools do not collect, store, or transmit personal identifiers or user-uploaded media, your "Right to be Forgotten" is technically enforced by our site's local-first design.
          </p>
        </section>

        <div className="pt-16 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            System Integrity Verified • No Cloud Metadata Leakage • AdSense Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
