
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
                  {i === 3 && (
                    <div className="my-16 flex justify-center">
                      <AdPlaceholder type="leaderboard" label="Analysis Partner" />
                    </div>
                  )}
                  {i === 7 && (
                    <div className="my-16 flex justify-center">
                      <AdPlaceholder type="multiplex" label="Contextual Exploration" />
                    </div>
                  )}
                </React.Fragment>
              ))}
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
