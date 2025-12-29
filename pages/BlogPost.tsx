
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import AdPlaceholder from '../components/AdPlaceholder';

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
      "description": post.metaDescription
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

             <div className="space-y-8 text-slate-600 dark:text-slate-300 font-semibold text-xl leading-relaxed">
               <p className="text-3xl font-black text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                 Understanding the intersection of pixel-perfect rendering and end-to-end user privacy.
               </p>
               
               <p>
                 When we talk about image conversion in 2025, we are no longer just talking about changing a file extension. We are talking about data integrity, mobile bandwidth optimization, and the ethical responsibility of tools to protect user data.
               </p>

               {/* MID-ARTICLE AD: Box between paragraphs */}
               <div className="my-12 flex justify-center">
                 <AdPlaceholder type="box" label="Sponsor Content" />
               </div>

               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">The Technical Frontier</h2>
               <p>
                 Traditional "cloud" converters are expensive to maintain and risky for the user. Every time you upload a photo to a remote server, you create a permanent digital footprint. At imageto.org, we solve this using <strong>WebAssembly</strong> and <strong>Canvas GPU rendering</strong>.
               </p>
               
               <p>
                 By shifting the heavy lifting from our servers to your browser's V8 engine, we achieve sub-millisecond conversion speeds that remain completely isolated from the open web.
               </p>

               <div className="bg-blue-600 rounded-[2.5rem] p-12 text-white not-prose my-16 shadow-2xl shadow-blue-500/20">
                 <h3 className="text-3xl font-black mb-6 tracking-tight">Ready to optimize?</h3>
                 <p className="mb-10 text-xl font-bold opacity-80 leading-relaxed">Join the privacy-first revolution. Process your assets locally with our high-performance edge converters.</p>
                 <Link to="/" className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all inline-block shadow-lg">
                   Open Pipeline
                 </Link>
               </div>

               <p>
                 In conclusion, the future of media tools is local. Whether you are optimizing for SEO, reducing mobile data costs, or stripping sensitive EXIF data, doing it locally is the only way to ensure absolute security.
               </p>
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
