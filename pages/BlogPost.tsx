import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants.tsx';
import AdPlaceholder from '../components/AdPlaceholder.tsx';
import ExternalAd from '../components/ExternalAd.tsx';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
      return;
    }
    window.scrollTo(0, 0);
    document.title = `${post.title} | Knowledge Base | imageto.org`;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);

    // Dynamic SEO Rich Snippets (Schema.org)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `ld-article-${post.slug}`;
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": [post.image],
      "datePublished": "2025-02-25T08:00:00+00:00",
      "author": [{
          "@type": "Person",
          "name": post.author.name,
          "jobTitle": post.author.role,
          "url": "https://imageto.org/#/about"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "imageto.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://imageto.org/logo.png"
        }
      },
      "description": post.metaDescription,
      "keywords": post.keywords.join(', ')
    });
    document.head.appendChild(script);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', post.metaDescription);

    return () => {
      const el = document.getElementById(`ld-article-${post.slug}`);
      if (el) document.head.removeChild(el);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [post, navigate, slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const getTableOfContents = () => {
    if (!post) return [];
    return post.content
      .filter(text => text.startsWith('## ') || text.startsWith('### '))
      .map(text => {
        const isH3 = text.startsWith('### ');
        const title = text.replace(isH3 ? '### ' : '## ', '').trim();
        return { title, isH3 };
      });
  };

  const renderContent = (text: string) => {
    if (text.startsWith('## ')) {
      const title = text.replace('## ', '').trim();
      const id = title.toLowerCase().replace(/\s+/g, '-');
      return (
        <h2 id={id} className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-20 mb-8 tracking-tighter leading-tight border-b border-slate-100 dark:border-slate-800 pb-4 scroll-mt-24">
          {title}
        </h2>
      );
    }
    
    if (text.startsWith('###')) {
      const title = text.replace('###', '').trim();
      const id = title.toLowerCase().replace(/\s+/g, '-');
      return (
        <h3 id={id} className="text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-12 mb-6 tracking-tight uppercase text-xs tracking-[0.3em] scroll-mt-24">
          {title}
        </h3>
      );
    }
    
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return (
      <p className="mb-8 leading-relaxed text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium">
        {parts.map((part, i) => {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <Link key={i} to={match[2]} className="text-indigo-600 dark:text-indigo-400 font-black border-b-2 border-indigo-600/20 hover:border-indigo-600 transition-all">
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

  const toc = getTableOfContents();

  return (
    <div className="relative">
      <div className="fixed top-20 left-0 w-full h-1 z-[60] pointer-events-none bg-slate-100 dark:bg-slate-900">
        <div 
          className="h-full bg-indigo-600 transition-all duration-75" 
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Sticky Social Sidebar (Desktop) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex-col space-y-4 hidden xl:flex z-50">
        <button onClick={() => openShare('twitter')} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-xl group">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
        </button>
        <button onClick={() => openShare('linkedin')} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-xl">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </button>
        <button onClick={() => openShare('facebook')} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-xl">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button onClick={copyLink} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-xl relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          {copied && <span className="absolute left-full ml-4 bg-indigo-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">Copied</span>}
        </button>
      </div>

      <div className="fixed bottom-10 right-10 z-[60] hidden md:block">
        <button 
          onClick={copyLink}
          className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all group relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          {copied && <span className="absolute bottom-full right-0 mb-4 bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl whitespace-nowrap shadow-xl">URL Copied!</span>}
        </button>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <article className="lg:w-2/3 animate-entrance">
            <header className="mb-16">
              <nav aria-label="Breadcrumb" className="mb-12">
                <ol className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <li><Link to="/blog" className="hover:text-indigo-600">Archive</Link></li>
                  <li><span className="text-slate-200 dark:text-slate-800">/</span></li>
                  <li><span className="text-indigo-600">{post.category}</span></li>
                </ol>
              </nav>

              <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-10 leading-[1.05] tracking-tighter">
                {post.title}
              </h1>

              <div className="flex items-center justify-between py-8 border-y border-slate-100 dark:border-slate-800 mb-10">
                <div className="flex items-center space-x-4">
                  <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full ring-2 ring-indigo-600/20" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black dark:text-white uppercase tracking-wider leading-none mb-1">{post.author.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{post.author.role}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{post.date}</span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{post.readTime}</span>
                </div>
              </div>

              {toc.length > 0 && (
                <div className="mb-12 p-8 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6">In this Guide</h4>
                  <ul className="space-y-4">
                    {toc.map((item, i) => (
                      <li key={i} className={item.isH3 ? 'pl-6' : ''}>
                        <a 
                          href={`#${item.title.toLowerCase().replace(/\s+/g, '-')}`} 
                          className={`text-sm font-bold transition-colors flex items-center group ${item.isH3 ? 'text-slate-500 hover:text-indigo-500' : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600'}`}
                        >
                          <span className={`w-6 h-px bg-slate-200 dark:bg-slate-800 mr-3 group-hover:bg-indigo-600 transition-colors ${item.isH3 ? 'w-4' : ''}`}></span>
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                <img src={post.image} alt={post.title} className="w-full h-[300px] md:h-[500px] object-cover" />
              </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.map((p, i) => (
                <React.Fragment key={i}>
                  {renderContent(p)}
                  {i === 2 && (
                    <div className="my-12">
                      <ExternalAd label="SPONSORED ANALYSIS" />
                    </div>
                  )}
                  {i === 5 && (
                    <div className="my-16 flex justify-center">
                      <AdPlaceholder type="leaderboard" label="Analysis Partner" />
                    </div>
                  )}
                  {i === 8 && (
                    <div className="my-16 flex justify-center">
                      <AdPlaceholder type="multiplex" label="Contextual Exploration" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* End of Article Share Card */}
            <div className="mt-20 p-10 md:p-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] text-center">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 block">Spread the Knowledge</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase">Share this Technical Article</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => openShare('twitter')} className="px-8 py-4 bg-slate-950 text-white rounded-2xl flex items-center space-x-3 hover:scale-105 transition-transform shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Share on X</span>
                </button>
                <button onClick={() => openShare('linkedin')} className="px-8 py-4 bg-[#0077b5] text-white rounded-2xl flex items-center space-x-3 hover:scale-105 transition-transform shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Post to LinkedIn</span>
                </button>
                <button onClick={() => openShare('whatsapp')} className="px-8 py-4 bg-[#25D366] text-white rounded-2xl flex items-center space-x-3 hover:scale-105 transition-transform shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 4.754a8.124 8.124 0 01-3.858-.969l-.277-.146-2.864.751.766-2.793-.161-.256a8.116 8.116 0 01-1.242-4.302c0-4.482 3.645-8.127 8.127-8.127 2.17 0 4.21.845 5.746 2.382 1.536 1.536 2.382 3.576 2.382 5.746 0 4.483-3.645 8.127-8.127 8.127m9.708-14.772A11.41 11.41 0 0012.652 1.25C6.31 1.25 1.154 6.406 1.154 12.748c0 2.025.53 4.003 1.535 5.744L1.25 22.75l4.353-1.142a11.378 11.378 0 005.654 1.516c6.34 0 11.498-5.157 11.498-11.499 0-3.072-1.197-5.96-3.374-8.138"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                </button>
              </div>
            </div>

            <footer className="mt-20 pt-16 border-t border-slate-100 dark:border-slate-800">
               <div className="bg-slate-50 dark:bg-slate-900/40 p-10 md:p-14 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                     <img src={post.author.avatar} alt={post.author.name} className="w-32 h-32 rounded-[2rem] shadow-xl" />
                     <div className="text-center md:text-left flex-grow">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Written by</span>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-none">{post.author.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                           {post.author.bio}
                        </p>
                     </div>
                  </div>
               </div>
            </footer>
          </article>

          <aside className="lg:w-1/3 space-y-16">
             <div className="sticky top-28 space-y-12">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Keywords</h4>
                   <div className="flex flex-wrap gap-2">
                      {post.keywords.map(kw => (
                        <span key={kw} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-xl">#{kw}</span>
                      ))}
                   </div>
                </div>

                <div className="flex justify-center">
                   <AdPlaceholder type="skyscraper" label="Sponsored Content" />
                </div>

                <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20">
                   <h4 className="text-2xl font-black mb-4 leading-tight">Privacy First.</h4>
                   <p className="text-xs font-bold opacity-80 mb-8 leading-relaxed">Ready to convert your assets without cloud risks? Use our edge-processing tool suite for 100% data isolation.</p>
                   <Link to="/" className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center block shadow-lg hover:scale-[1.02] transition-transform">Launch Engine</Link>
                </div>
             </div>
          </aside>
        </div>

        <section className="mt-24 pt-20 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-4xl font-black mb-14 dark:text-white tracking-tight uppercase text-xs tracking-[0.3em] text-indigo-600">Continued Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {relatedPosts.map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all group-hover:shadow-xl">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="font-black text-xl leading-tight group-hover:text-indigo-600 transition-colors dark:text-white tracking-tight">{p.title}</h4>
                <div className="flex items-center space-x-3 mt-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                   <span>{p.category}</span>
                   <span>•</span>
                   <span>{p.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPost;