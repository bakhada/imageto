
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdPlaceholder from '../components/AdPlaceholder';
import { BLOG_POSTS } from '../constants';

const Blog: React.FC = () => {
  useEffect(() => {
    document.title = "Image Optimization & Digital Privacy Blog | imageto.org";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-20 text-center animate-entrance">
        <div className="inline-flex items-center mb-6 px-4 py-1.5 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-100 dark:border-blue-800">
          Knowledge Base
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 dark:text-white tracking-tighter">
          Intelligence Feed
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-semibold">
          Expert insights on privacy, web performance, and the future of media optimization.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {BLOG_POSTS.map((post, idx) => (
          <article key={post.slug} className={`group animate-entrance`} style={{ animationDelay: `${idx * 100}ms` }}>
            <Link to={`/blog/${post.slug}`} className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500">
              <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="text-blue-600">{post.category}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500">{post.date}</span>
                </div>
                <h2 className="text-xl font-black mb-4 group-hover:text-blue-600 transition-colors dark:text-white leading-tight tracking-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Learn More
                  <svg className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-20">
        <AdPlaceholder type="leaderboard" label="Sponsor Intelligence" />
      </div>
    </div>
  );
};

export default Blog;
