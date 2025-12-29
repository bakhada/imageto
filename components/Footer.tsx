import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60 pt-32 pb-16 transition-colors relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="col-span-1 md:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-10 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">i</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase tracking-widest leading-none">
                imageto<span className="text-blue-600">.org</span>
              </span>
            </Link>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xs">
              The gold standard for private, high-performance edge image processing. Built for the privacy-first web.
            </p>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-2.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest leading-none">
                System Isolation: Verified
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-black text-slate-900 dark:text-white text-[10px] mb-10 uppercase tracking-[0.25em]">Codecs</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
              {TOOLS.slice(0, 3).map(tool => (
                <li key={tool.id}>
                  <Link to={`/${tool.slug}`} className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-black text-slate-900 dark:text-white text-[10px] mb-10 uppercase tracking-[0.25em]">Pipelines</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
              {TOOLS.slice(3).map(tool => (
                <li key={tool.id}>
                  <Link to={`/${tool.slug}`} className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-black text-slate-900 dark:text-white text-[10px] mb-10 uppercase tracking-[0.25em]">Resources</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/about" className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">Docs</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">Legal</Link></li>
              <li><Link to="/blog" className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">Feed</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-black text-slate-900 dark:text-white text-[10px] mb-10 uppercase tracking-[0.25em]">Sync</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-widest text-slate-400">
              <li className="opacity-40">Build 92.1</li>
              <li className="opacity-40">Local-Only</li>
              <li className="opacity-40">SSL Locked</li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600">
          <p>© {new Date().getFullYear()} imageto.org — All Nodes Processing Locally</p>
          <div className="mt-8 md:mt-0 flex space-x-10">
            <span className="cursor-default hover:text-blue-600 transition-colors">Privacy First</span>
            <span className="cursor-default hover:text-blue-600 transition-colors">No Cookies</span>
            <span className="cursor-default hover:text-blue-600 transition-colors">Wasm Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;