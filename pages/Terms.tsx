
import React, { useEffect } from 'react';

const Terms: React.FC = () => {
  useEffect(() => {
    document.title = "Terms of Service | imageto.org";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-16">
        <h1 className="text-5xl font-black mb-6 dark:text-white tracking-tighter">Terms of Service</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Last Updated: February 2025</p>
      </header>

      <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 space-y-12 max-w-none font-medium">
        <section>
          <h2 className="text-2xl font-black dark:text-white uppercase text-sm tracking-widest text-blue-600 mb-6">1. Acceptance of Terms</h2>
          <p>By accessing and using imageto.org, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black dark:text-white uppercase text-sm tracking-widest text-blue-600 mb-6">2. Use License</h2>
          <p>The tools provided on imageto.org are for personal and commercial use. You may use our converters to process any number of images for any legal purpose. However, you may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
            <li>Use the site for any automated bulk scraping beyond the intended browser-side batch features.</li>
            <li>Use the service to process materials that violate copyright laws.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black dark:text-white uppercase text-sm tracking-widest text-blue-600 mb-6">3. Disclaimer of Warranties</h2>
          <p>The materials on imageto.org are provided on an 'as is' basis. Imageto.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black dark:text-white uppercase text-sm tracking-widest text-blue-600 mb-6">4. Limitation of Liability</h2>
          <p>In no event shall imageto.org or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if imageto.org or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        </section>

        <section className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-black dark:text-white uppercase text-sm tracking-widest text-blue-600 mb-6">5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the website operator resides, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
