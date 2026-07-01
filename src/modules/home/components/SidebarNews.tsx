
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPublicNewsApi } from '@/modules/admin/services';
import { News } from '@/types';

const SidebarNews: React.FC = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getPublicNewsApi({ limit: 4, isPublished: true });
        if (res.success) {
          setNewsList(res.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="p-5 rounded-xl flex flex-col gap-5 w-full bg-white/50 border border-slate-100 shadow-sm animate-pulse">
        {/* Social Buttons Skeleton */}
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 bg-slate-200 rounded-lg"></div>
          <div className="h-8 bg-slate-200 rounded-lg"></div>
          <div className="h-8 bg-slate-200 rounded-lg"></div>
          <div className="h-8 bg-slate-200 rounded-lg"></div>
        </div>
        
        {/* Header Skeleton */}
        <div className="h-5 bg-slate-200 rounded-md w-28"></div>

        {/* Main News Card Skeleton */}
        <div className="h-48 bg-slate-200 rounded-2xl w-full"></div>

        {/* Mini News List Skeleton */}
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center border-b border-slate-50 pb-4 last:border-none last:pb-0">
              <div className="w-16 h-16 rounded-xl bg-slate-200 flex-shrink-0"></div>
              <div className="flex-grow space-y-2">
                <div className="h-2 bg-purple-200 rounded-full w-12"></div>
                <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                <div className="h-2 bg-slate-100 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const mainNews = newsList[0];
  const miniNews = newsList.slice(1);

  return (
    <div className="p-5 rounded-xl flex flex-col gap-5 w-full animate-in fade-in duration-700">
      
      {/* กลุ่มปุ่ม Social Media */}
      <div className="grid grid-cols-2 gap-2">
        <a href="#" className="bg-[#1877F2] text-white text-[10px] px-3 py-2 rounded-lg flex items-center justify-between font-black uppercase tracking-wider hover:opacity-90 transition-opacity">Facebook <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-black text-white text-[10px] px-3 py-2 rounded-lg flex items-center justify-between font-black uppercase tracking-wider hover:bg-zinc-900 transition-colors">X <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-[#E60023] text-white text-[10px] px-3 py-2 rounded-lg flex items-center justify-between font-black uppercase tracking-wider hover:opacity-90 transition-opacity">Pinterest <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-[#FF0000] text-white text-[10px] px-3 py-2 rounded-lg flex items-center justify-between font-black uppercase tracking-wider hover:opacity-90 transition-opacity">YouTube <ArrowUpRight size={14}/></a>
      </div>

      {/* หัวข้อข่าวสาร */}
      <div>
        <h3 className="text-base font-black text-slate-800 border-l-4 border-purple-600 pl-2 uppercase tracking-tight">More News</h3>
      </div>
      
      {newsList.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 rounded-xl">No news found</div>
      ) : (
        <>
          {/* ข่าวเด่นหลักตัวบนสุด */}
          {mainNews && (
            <div 
              onClick={() => navigate(`/news/${mainNews._id}`)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md border border-slate-100"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10"></div>
              <img 
                src={mainNews.image?.url} 
                alt={mainNews.title} 
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f3f4f6/a1a1aa?text=No+Image'; }}
              />
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <span className="bg-purple-600 text-white font-black text-[8px] px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg">
                  {mainNews.category?.name || 'General'}
                </span>
                <p className="text-white font-black text-sm mt-2 leading-tight line-clamp-2 group-hover:text-purple-200 transition-colors">
                  {mainNews.title}
                </p>
                <p className="text-slate-300 text-[9px] mt-2 font-bold flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(mainNews.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* รายการข่าวสารย่อยด้านล่าง */}
          <div className="flex flex-col gap-4">
            {miniNews.map((news) => (
              <div 
                key={news._id} 
                onClick={() => navigate(`/news/${news._id}`)}
                className="flex gap-3 items-center border-b border-slate-50 pb-4 cursor-pointer group last:border-none last:pb-0"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 shadow-sm">
                  <img 
                    src={news.image?.url} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f3f4f6/a1a1aa?text=Img'; }}
                  />
                </div>
                <div className="flex-grow">
                  <span className="text-purple-600 font-black text-[8px] uppercase tracking-widest block mb-1">
                    {news.category?.name || 'General'}
                  </span>
                  <h4 className="text-xs font-black text-slate-700 leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-slate-400 text-[9px] mt-1 font-bold">
                    {new Date(news.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default SidebarNews;