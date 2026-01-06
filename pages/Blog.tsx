
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdPlaceholder from '../components/AdPlaceholder';
import { BLOG_POSTS } from '../constants';

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  useEffect(() => {
    document.title = "Image Optimization & Digital Privacy Knowledge Base | imageto.org";
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', ...new Set(BLOG_POSTS.map(post => post.category))];
  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const featuredPost = BLOG_POSTS[0];
  const otherPosts = filteredPosts.filter(p => p.slug !== featuredPost.slug || activeCategory !== 'All');

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-20 text-center animate-entrance">
        <div className="inline-flex items-center mb-6 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-indigo-100 dark:border-indigo-800">
          The Knowledge Archive
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-6 dark:text-white tracking-tighter leading-none">
          Intelligence <span className="text-indigo-600">Feed.</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-semibold leading-relaxed">
          Deep dives into browser-side performance, privacy-first media architecture, and technical SEO for 2025.
        </p>
      </header>

      {/* Featured Post - Large Horizontal Layout */}
      {activeCategory === 'All' && featuredPost && (
        <section className="mb-20 group animate-entrance">
          <Link to={`/blog/${featuredPost.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="lg:col-span-5 p-10 md:p-14 flex flex-col justify-center">
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="text-indigo-600 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 rounded-full">{featuredPost.category}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500">{featuredPost.date}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 dark:text-white leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mb-8">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center space-x-4">
                 <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-800" />
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{featuredPost.author.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{featuredPost.readTime}</span>
                 </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Ad Placement: Leaderboard after Featured */}
      <div className="mb-20">
        <AdPlaceholder type="leaderboard" label="Research Sponsor" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
              activeCategory === cat 
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-600/10' 
              : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {otherPosts.map((post, idx) => (
          <article key={post.slug} className="group animate-entrance" style={{ animationDelay: `${idx * 100}ms` }}>
            <Link to={`/blog/${post.slug}`} className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="text-indigo-600">{post.category}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500">{post.date}</span>
                </div>
                <h2 className="text-xl font-black mb-4 group-hover:text-indigo-600 transition-colors dark:text-white leading-tight tracking-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mb-8 flex-grow">
                  {post.excerpt}
                </p>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{post.author.name}</span>
                   </div>
                   <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{post.readTime}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-24">
        <AdPlaceholder type="multiplex" label="Discovery Feed" />
      </div>
    </div>
  );
};

export default Blog;
