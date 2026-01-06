
import React from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  url: string;
  rating: number;
}

interface AffiliateSectionProps {
  category: string;
  products: Product[];
}

const AffiliateSection: React.FC<AffiliateSectionProps> = ({ category, products }) => {
  return (
    <div className="my-20 p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-3 block">Pro Equipment</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Best {category} for Creators</h2>
        </div>
        <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[240px] leading-relaxed">
          * Disclosure: As an associate, we may earn a commission from qualifying purchases at no extra cost to you.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <a 
            key={product.id} 
            href={product.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500 transition-all"
          >
            <div className="aspect-square bg-white dark:bg-slate-900 flex items-center justify-center p-8 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-current' : 'fill-slate-200 dark:fill-slate-800'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">{product.name}</h3>
              <p className="text-[11px] font-black text-blue-600 mt-auto">{product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AffiliateSection;
