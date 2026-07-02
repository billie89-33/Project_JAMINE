import { useNews } from './hooks/useNews';
import NewsTable from './components/NewsTable';
import { Newspaper, Plus, Search, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsContainer = () => {
    const {
        isLoading,
        newsList,
        categories,
        categoryId, setCategoryId,
        isPublished, setIsPublished,
        keyword, setKeyword,
        setPage,
        togglePublished,
        handleDeleteNews
    } = useNews();

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                        <Newspaper size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-purple-500 fill-purple-500" />
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Publishing System</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800">
                            News Articles
                        </h1>
                    </div>
                </div>

                <Link 
                    to="/admin/news/create"
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xl hover:bg-slate-800 transition-all"
                >
                    <Plus size={16} />
                    Create New Article
                </Link>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search news by title..." 
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-300 transition-all text-sm font-bold"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                        <Filter size={16} className="text-slate-400" />
                        <select 
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setPage(1);
                            }}
                            className="text-xs font-black text-slate-600 outline-none cursor-pointer bg-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                        <select 
                            value={isPublished}
                            onChange={(e) => {
                                setIsPublished(e.target.value);
                                setPage(1);
                            }}
                            className="text-xs font-black text-slate-600 outline-none cursor-pointer bg-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="true">Published</option>
                            <option value="false">Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <NewsTable 
                newsList={newsList}
                isLoading={isLoading}
                onToggleStatus={togglePublished}
                onDelete={handleDeleteNews}
            />

            <div className="h-10"></div>
        </div>
    );
};

export default NewsContainer;
