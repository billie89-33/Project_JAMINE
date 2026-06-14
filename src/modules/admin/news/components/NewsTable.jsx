import React from 'react';
import { 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff, 
    Calendar, 
    Tag, 
    Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsTable = ({ newsList, isLoading, onToggleStatus, onDelete }) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black">
                            <th className="px-6 py-4">Article</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Stats</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="animate-spin text-purple-600" size={32} />
                                        <span className="text-sm font-bold text-slate-400">Loading articles...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : newsList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-medium">
                                    No articles found.
                                </td>
                            </tr>
                        ) : (
                            newsList.map((news) => (
                                <tr key={news._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img src={news.image?.url} alt={news.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="max-w-xs">
                                                <div className="text-sm font-black text-slate-700 line-clamp-1">{news.title}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">By {news.author || 'Admin'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                                            {news.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                            <Calendar size={12} className="text-slate-300" />
                                            {new Date(news.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-600">
                                            <Eye size={14} className="text-slate-400" />
                                            {news.views?.toLocaleString() || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => onToggleStatus(news._id, news.isPublished)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                                                news.isPublished 
                                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                            }`}
                                        >
                                            {news.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {news.isPublished ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                to={`/admin/news/edit/${news._id}`}
                                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                                title="Edit Article"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => onDelete(news._id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete Article"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsTable;
