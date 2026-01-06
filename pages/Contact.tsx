
import React, { useEffect } from 'react';

const Contact: React.FC = () => {
  useEffect(() => {
    document.title = "Contact Us | imageto.org Support";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <header className="mb-16">
        <h1 className="text-5xl font-black mb-6 dark:text-white tracking-tighter">Contact Support</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Direct Support for Global Creators</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-black mb-6 dark:text-white uppercase tracking-wider">Email Us</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-6">For general inquiries, business partnerships, or technical support, please reach out via email:</p>
            <a href="mailto:support@imageto.org" className="text-2xl font-black text-blue-600 hover:underline">support@imageto.org</a>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl">
            <h2 className="text-xl font-black mb-6 uppercase tracking-wider">Response Time</h2>
            <p className="text-sm opacity-80 font-bold leading-loose">We strive to respond to all technical queries within 24-48 business hours. For emergency bug reports regarding the browser engine, please use the subject line "[CRITICAL] Browser Error".</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-black mb-10 dark:text-white uppercase tracking-wider">Help Desk</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</label>
              <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
              <input type="email" className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
              <textarea rows={4} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500"></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
