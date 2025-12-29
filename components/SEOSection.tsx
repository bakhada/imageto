import React from 'react';
import { FAQItem } from '../types';

interface SEOSectionProps {
  title?: string;
  description?: string;
  steps?: string[];
  faqs?: FAQItem[];
}

const SEOSection: React.FC<SEOSectionProps> = ({ title, description, steps, faqs }) => {
  return (
    <div className="mt-20 space-y-16">
      {/* Content Section */}
      {(title || description) && (
        <section>
          <h2 className="text-3xl font-black mb-6 dark:text-white tracking-tight">{title || 'Why use imageto.org?'}</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              {description || "In a world where privacy is often compromised, imageto.org stands as a beacon for secure image processing. We believe that simple tasks like converting a file shouldn't involve uploading your personal data to remote servers. By utilizing the power of your own browser, we provide professional-grade conversion tools without the security risks."}
            </p>
          </div>
        </section>
      )}

      {/* Steps Section */}
      {steps && (
        <section>
          <h2 className="text-2xl font-black mb-10 dark:text-white tracking-tight">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold mb-6 shadow-lg shadow-blue-500/20">
                  {index + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-black mb-8 dark:text-white tracking-tight">Core Infrastructure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "No Uploads", desc: "100% Client-side sandbox." },
            { title: "Wasm Optimized", desc: "Instant local execution." },
            { title: "Pixel Perfect", desc: "High fidelity resampling." },
            { title: "Pure Access", desc: "No queues or daily limits." }
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:border-blue-500/50">
              <h4 className="font-black text-blue-600 mb-2 uppercase text-xs tracking-widest">{feat.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      {faqs && (
        <section>
          <h2 className="text-2xl font-black mb-8 dark:text-white tracking-tight">Frequent Queries</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all">
                <summary className="flex justify-between items-center font-bold p-6 cursor-pointer text-slate-900 dark:text-white select-none list-none hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  {faq.question}
                  <span className="transition-transform group-open:rotate-180 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-4 font-medium text-sm">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SEOSection;