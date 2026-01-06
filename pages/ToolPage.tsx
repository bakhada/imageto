
import React, { useEffect } from 'react';
import { ToolMetadata } from '../types';
import Converter from '../components/Converter';
import SEOSection from '../components/SEOSection';
import AdPlaceholder from '../components/AdPlaceholder';
import AffiliateSection from '../components/AffiliateSection';
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

    // Dynamic JSON-LD for Search Engines
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `ld-json-${tool.id}`;
    script.innerHTML = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.title,
        "applicationCategory": "DesignApplication",
        "operatingSystem": "All",
        "description": tool.metaDescription,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use the ${tool.title} tool`,
        "step": (tool.howToSteps || []).map((step, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "text": step
        }))
      }
    ]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(`ld-json-${tool.id}`);
      if (el) document.head.removeChild(el);
    };
  }, [tool]);

  const otherTools = TOOLS.filter(t => t.id !== tool.id).slice(0, 4);

  // Contextual affiliate products based on tool category
  const getAffiliateProducts = () => [
    { id: '1', name: 'SanDisk 2TB Extreme Portable SSD - High Speed Storage', price: '$169.99', rating: 5, image: 'https://m.media-amazon.com/images/I/71Y7Z6-NidL._AC_SL1500_.jpg', url: '#' },
    { id: '2', name: 'Logitech MX Master 3S Wireless Performance Mouse', price: '$99.00', rating: 5, image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg', url: '#' },
    { id: '3', name: 'Adobe Creative Cloud 12-Month Subscription', price: '$599.88', rating: 4, image: 'https://m.media-amazon.com/images/I/61MvUa5u8OL._AC_SL1200_.jpg', url: '#' }
  ];

  const renderLongDescription = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-3xl font-black text-slate-900 dark:text-white mt-16 mb-8 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-10 mb-4 tracking-tight uppercase text-xs tracking-[0.3em]">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-4" />;
      return (
        <p key={i} className="text-slate-600 dark:text-slate-400 font-semibold leading-loose mb-6">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="relative">
      <div className="absolute top-96 -left-48 hidden 2xl:block">
        <AdPlaceholder type="skyscraper" />
      </div>
      <div className="absolute top-96 -right-48 hidden 2xl:block">
        <AdPlaceholder type="skyscraper" />
      </div>

      <div className="space-y-16 py-12 md:py-20 max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
          <ol className="inline-flex items-center px-5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
            <li><Link to="/" className="text-slate-400 hover:text-blue-600">Home</Link></li>
            <li><span className="mx-3 text-slate-300">/</span><span className="text-blue-600">{tool.title}</span></li>
          </ol>
        </nav>

        <AdPlaceholder type="leaderboard" label="Sponsored Pipeline" />

        <section className="text-center px-6">
          <h1 className="text-5xl md:text-8xl font-black mb-10 dark:text-white tracking-tighter leading-[0.95] max-w-5xl mx-auto uppercase">
            {tool.h1}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-20 font-semibold">
            {tool.description}
          </p>

          <Converter 
            defaultFormat={tool.defaultFormat} 
            initialOptions={tool.initialOptions} 
          />
        </section>

        {/* Feature Grid Section */}
        {tool.features && (
          <section className="px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tool.features.map((feat, i) => (
                <div key={i} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-center group hover:border-blue-500 transition-all shadow-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-4 group-hover:scale-150 transition-transform"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <AffiliateSection category="Professional Gear" products={getAffiliateProducts()} />

        <article className="px-6 space-y-20">
          <SEOSection 
            title={`Professional Guide: ${tool.title}`}
            description={tool.detailedContent}
            steps={tool.howToSteps}
            faqs={[
              { question: `Is ${tool.title} free for commercial use?`, answer: "Absolutely. Every tool on imageto.org is 100% free for both personal and commercial projects. We do not apply watermarks or restrict usage limits." },
              { question: "How safe are my confidential files?", answer: "Your files never leave your computer. We use local browser memory (RAM) to perform all pixel manipulations, ensuring zero data leakage to cloud servers. This is safer than any server-side converter on the market." }
            ]}
          />

          {/* New Long Form Content Pillar for Tool SEO */}
          {tool.longDescription && (
            <div className="prose prose-lg dark:prose-invert max-w-none border-t border-slate-100 dark:border-slate-800 pt-20">
               {renderLongDescription(tool.longDescription)}
            </div>
          )}
        </article>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <AdPlaceholder type="box" />
          <AdPlaceholder type="box" />
        </div>

        <section className="px-6 pt-12">
          <h2 className="text-4xl font-black dark:text-white tracking-tight mb-14 uppercase text-xs tracking-[0.3em] text-blue-600">Contextual Alternatives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherTools.map(t => (
              <Link 
                key={t.id} 
                to={`/${t.slug}`}
                className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-sm group"
              >
                <h3 className="font-black dark:text-white mb-4 uppercase text-[10px] tracking-[0.2em] text-slate-400 group-hover:text-blue-600">{t.title}</h3>
                <p className="text-xs text-slate-500 font-bold">Secure Local Pipeline</p>
              </Link>
            ))}
          </div>
        </section>

        <AdPlaceholder type="multiplex" label="Discovery Content" />
      </div>
    </div>
  );
};

export default ToolPage;
