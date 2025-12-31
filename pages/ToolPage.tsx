
import React, { useEffect } from 'react';
import { ToolMetadata } from '../types';
import Converter from '../components/Converter';
import SEOSection from '../components/SEOSection';
import AdPlaceholder from '../components/AdPlaceholder';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';

interface ToolPageProps {
  tool: ToolMetadata;
}

const ToolPage: React.FC<ToolPageProps> = ({ tool }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = tool.metaTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', tool.metaDescription);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `ld-json-${tool.id}`;
    script.innerHTML = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://imageto.org/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": tool.title,
            "item": `https://imageto.org/#/${tool.slug}`
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use the ${tool.title} converter`,
        "description": `Step-by-step guide to using our secure browser-side ${tool.title} tool.`,
        "step": [
          {
            "@type": "HowToStep",
            "text": "Upload your images to the local staging area."
          },
          {
            "@type": "HowToStep",
            "text": "Select conversion quality and format."
          },
          {
            "@type": "HowToStep",
            "text": "Download the processed files instantly."
          }
        ]
      }
    ]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(`ld-json-${tool.id}`);
      if (el) document.head.removeChild(el);
    };
  }, [tool]);

  const otherTools = TOOLS.filter(t => t.id !== tool.id).slice(0, 4);

  return (
    <div className="relative">
      {/* SIDEBAR AD: Sticky Skyscraper on desktop */}
      <div className="absolute top-96 -left-48 hidden 2xl:block">
        <AdPlaceholder type="skyscraper" />
      </div>
      <div className="absolute top-96 -right-48 hidden 2xl:block">
        <AdPlaceholder type="skyscraper" />
      </div>

      <div className="space-y-16 py-12 md:py-20 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
          <ol className="inline-flex items-center px-5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
            <li className="inline-flex items-center">
              <Link to="/" className="text-slate-400 hover:text-blue-600 transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-3 text-slate-300 dark:text-slate-700">/</span>
              <span className="text-blue-600 dark:text-blue-400" aria-current="page">{tool.title}</span>
            </li>
          </ol>
        </nav>

        {/* TOP AD: High prominence but separated from title */}
        <AdPlaceholder type="leaderboard" />

        {/* Main Tool Header */}
        <section className="text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 dark:text-white tracking-tighter leading-[0.95] max-w-5xl mx-auto">
            {tool.h1}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-20 font-semibold leading-relaxed">
            The fastest and most secure way to manage your {tool.title.toLowerCase()} workflow. No servers. No limits. Just performance.
          </p>

          <Converter 
            defaultFormat={tool.defaultFormat} 
            initialOptions={tool.initialOptions} 
          />
        </section>

        {/* MID-SECTION AD: Large box between tool and SEO content */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <AdPlaceholder type="box" />
          <AdPlaceholder type="box" />
        </div>

        {/* Contextual SEO Content */}
        <article className="px-6">
          <SEOSection 
            title={`Why use our ${tool.title} converter?`}
            description={`Traditional cloud-based ${tool.title.toLowerCase()} tools often sell your data or store your images in unencrypted buckets. Our ${tool.title} module is engineered for high-fidelity rendering without the security risks. By bypassing network overhead, we provide a streamlined optimization pipeline that works at the speed of your local hardware.`}
            steps={[
              "Drop your images into the browser-side buffer.",
              `Ensure the output codec is set to ${tool.defaultFormat.split('/')[1]}.`,
              "Optimize dimensions or quality as needed.",
              "Download your sanitized output directly to your device."
            ]}
            faqs={[
              {
                question: `Is the ${tool.title} conversion process lossless?`,
                answer: "You can achieve lossless results by setting the quality slider to 100%. Our engine uses high-precision resampling algorithms for the best possible fidelity."
              },
              {
                question: "Can I batch convert multiple files at once?",
                answer: "Yes, our tool supports unlimited batch processing. Simply drag multiple files at once, and they will be processed sequentially in your local memory."
              }
            ]}
          />
        </article>

        {/* BOTTOM AD: Multiplex for engagement */}
        <AdPlaceholder type="multiplex" label="You Might Also Need" />

        {/* Related Semantic Links */}
        <section className="px-6 pt-12">
          <div className="mb-14">
            <h2 className="text-4xl font-black dark:text-white tracking-tight">Explore More Modules</h2>
            <p className="text-slate-500 font-bold mt-2">Additional tools to complete your image optimization pipeline.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherTools.map(t => (
              <Link 
                key={t.id} 
                to={`/${t.slug}`}
                className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-sm group"
              >
                <h3 className="font-black dark:text-white mb-4 uppercase text-[10px] tracking-[0.2em] leading-none text-slate-400 group-hover:text-blue-600 transition-colors">{t.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">Secure edge-conversion module.</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ToolPage;
