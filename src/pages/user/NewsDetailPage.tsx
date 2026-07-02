import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsByIdApi } from '@/modules/admin/services';
import { Calendar, User, Eye, ChevronLeft, Loader2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsDetailPage = () => {
    const { id } = useParams();
    const [news, setNews] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            setIsLoading(true);
            try {
                const res = await getNewsByIdApi(id as string);
                if (res.success) {
                    setNews(res.data);
                }
            } catch (error) {
                toast.error('Failed to load news content');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNewsDetail();
        window.scrollTo(0, 0); // Scroll to top on load
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Loading Article...</p>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black text-slate-800 mb-4">Article Not Found</h2>
                <Link to="/" className="text-purple-600 font-bold underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen animate-in fade-in duration-1000">
            
            {/* Hero Image Section */}
            <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden bg-slate-900">
                <img 
                    src={news.image?.url} 
                    alt={news.title}
                    className="w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                
                <div className="absolute top-8 left-8">
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all border border-white/20"
                    >
                        <ChevronLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-20 pb-20">
                <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg shadow-purple-200">
                            {news.category?.name || 'General'}
                        </span>
                        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(news.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Eye size={14} /> {news.views?.toLocaleString()} Views</span>
                            <span className="flex items-center gap-1.5"><User size={14} /> {news.author || 'Admin'}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.2] mb-10">
                        {news.title}
                    </h1>

                    <div className="w-20 h-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-12"></div>

                    {/* Main Content Area */}
                    <article 
                        className="prose prose-slate prose-lg max-w-none 
                        prose-headings:font-black prose-headings:text-slate-800
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                        prose-img:rounded-[2rem] prose-img:shadow-xl
                        prose-strong:text-slate-900 prose-strong:font-black
                        prose-a:text-purple-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    {/* Footer Actions */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                        <Link 
                            to="/" 
                            className="text-slate-400 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft size={16} />
                            Read More Articles
                        </Link>
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            <Share2 size={16} />
                            Share Article
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Quick Navigation */}
            <div className="fixed bottom-10 right-10 z-50">
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="p-4 bg-white text-slate-800 rounded-full shadow-2xl border border-slate-50 hover:scale-110 active:scale-95 transition-all group"
                >
                    <ChevronLeft size={24} className="rotate-90 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default NewsDetailPage;
