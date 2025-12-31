
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants.tsx';
import AdPlaceholder from '../components/AdPlaceholder.tsx';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
      return;
    }
    window.scrollTo(0, 0);
    document.title = `${post.title} | imageto.org Blog`;

    // Dynamic SEO Rich Snippets
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `ld-article-${post.slug}`;
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": [post.image],
      "datePublished": "2025-02-24T08:00:00+08:00",
      "dateModified": "2025-02-24T09:20:00+08:00",
      "author": [{
          "@type": "Organization",
          "name": "imageto.org Editorial Team",
          "url": "https://imageto.org/#/about"
      }],
      "description": post.metaDescription,
      "keywords": (post as any).keywords?.join(', ') || ""
    });
    document.head.appendChild(script);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.metaDescription);

    return () => {
      const el = document.getElementById(`ld-article-${post.slug}`);
      if (el) document.head.removeChild(el);
    };
  }, [post, navigate, slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse internal links in content
  const renderParagraph = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return (
      <p className="mb-8 leading-relaxed">
        {parts.map((part, i) => {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <Link key={i} to={match[2]} className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-800 transition-colors">
                {match[1]}
              </Link>
            );
          }
          return part;
        })}
      </p>
    );
  };

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link to="/blog" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-12 hover:translate-x-[-4px] transition-transform">
        <svg className="w-4 h-4 mr-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        Feed Index
      </Link>

      <article className="animate-entrance">
        <header className="mb-12">
          <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            <span className="text-blue-600">{post.category}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-10 leading-[1.05] tracking-tighter">
            {post.title}
          </h1>
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <img src={post.image} alt={post.title} className="w-full h-[300px] md:h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </header>

        {/* IN-ARTICLE AD: Leaderboard below header */}
        <AdPlaceholder type="leaderboard" className="mb-12" />

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow prose prose-lg dark:prose-invert max-w-none">
             <div className="flex items-center justify-between py-6 border-y border-slate-100 dark:border-slate-800/60 mb-12">
               <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 text-[10px] font-black">IT</div>
                 <div className="flex flex-col">
                   <span className="text-xs font-black dark:text-white uppercase tracking-wider leading-none mb-1">imageto.org Editorial</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Privacy Engineering Group</span>
                 </div>
               </div>
               <div className="flex items-center space-x-3">
                 <button onClick={copyLink} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-blue-600 transition-all relative group">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                   {copied && <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-xl whitespace-nowrap">Link Copied!</span>}
                 </button>
               </div>
             </div>

             <div className="text-slate-600 dark:text-slate-300 font-semibold text-xl leading-relaxed">
               {/* Key Takeaway box for better SEO dwell time */}
               <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-blue-600 p-8 rounded-r-3xl mb-12 not-prose shadow-sm">
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Key Takeaway</span>
                 <p className="text-lg font-black dark:text-white leading-tight">
                    In 2025, data privacy and web performance are the two most critical factors for any digital professional. Process locally to secure your assets and optimize for search.
                 </p>
               </div>

               {/* Render real article content from constants */}
               {(post as any).content?.map((p: string, i: number) => (
                 <React.Fragment key={i}>
                   {renderParagraph(p)}
                   {i === 1 && (
                      <div className="my-12 flex justify-center">
                        <AdPlaceholder type="box" label="Sponsor Content" />
                      </div>
                   )}
                 </React.Fragment>
               ))}

               <div className="bg-blue-600 rounded-[2.5rem] p-12 text-white not-prose my-16 shadow-2xl shadow-blue-500/20">
                 <h3 className="text-3xl font-black mb-6 tracking-tight">Ready to optimize?</h3>
                 <p className="mb-10 text-xl font-bold opacity-80 leading-relaxed">Join the privacy-first revolution. Process your assets locally with our high-performance edge converters.</p>
                 <Link to="/" className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all inline-block shadow-lg">
                   Open Pipeline
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </article>

      {/* AFTER-ARTICLE AD: Multiplex for maximum post-read revenue */}
      <AdPlaceholder type="multiplex" label="Recommended Articles" />

      {/* Recommended Section */}
      <div className="mt-20 pt-20 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-3xl font-black mb-12 dark:text-white tracking-tight">Continued Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
              <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h4 className="font-black text-base leading-tight group-hover:text-blue-600 transition-colors dark:text-white tracking-tight">{p.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
