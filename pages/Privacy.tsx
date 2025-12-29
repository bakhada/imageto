import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-12 dark:text-white tracking-tighter">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-8 max-w-none">
        <p className="text-xl font-bold bg-blue-50 dark:bg-blue-900/10 p-6 border-l-4 border-blue-600 rounded-r-2xl">
          At imageto.org, privacy isn't a feature—it's our foundation. We do not collect, store, or see your images because they never leave your device.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">1. Local Processing (Zero-Upload)</h2>
          <p>
            Unlike traditional online converters, <strong>imageto.org</strong> uses Client-Side Logic. When you "upload" a file, it is loaded into your browser's local RAM buffer. The conversion calculations are performed by your computer's CPU/GPU via WebAssembly and the Canvas API. No data packets containing your image assets are ever sent to our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">2. Advertising & Cookies (AdSense Disclosure)</h2>
          <p>
            We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google</strong>, as a third-party vendor, uses cookies to serve ads on your site.</li>
            <li>Google's use of the <strong>DoubleClick cookie</strong> enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting <a href="https://adssettings.google.com/" className="text-blue-600 font-bold underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">3. Log Files</h2>
          <p>
            Like many other Web sites, imageto.org makes use of log files. These files merely log visitors to the site - usually a standard procedure for hosting companies and a part of hosting service's analytics. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. This information is used to analyze trends, administer the site, track user's movement around the site, and gather demographic information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6 tracking-tight uppercase text-sm tracking-widest text-blue-600">4. CCPA & GDPR Compliance</h2>
          <p>
            Under the CCPA and GDPR, users have the right to request access to their data or request its deletion. Since we do not collect personal data or store your images, we are "Privacy by Design." We do not have a database of your personal information to share or sell.
          </p>
        </section>

        <div className="pt-12 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Last Updated: February 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;