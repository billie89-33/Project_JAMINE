import { Tag, Edit2, Trash2, Loader2 } from 'lucide-react';
import { NewsCategory } from '@/modules/admin/services';

interface CategoryListProps {
    categories: NewsCategory[];
    isLoading: boolean;
    onEdit: (cat: NewsCategory) => void;
    onDelete: (id: string) => void;
    editingId: string | null;
}

const CategoryList = ({ categories, isLoading, onEdit, onDelete, editingId }: CategoryListProps) => {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Tag size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Available Categories</h3>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="py-10 flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-purple-600" size={32} />
                        <span className="text-xs font-bold text-slate-400">Loading categories...</span>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-50 rounded-2xl">
                        No categories found.
                    </div>
                ) : (
                    categories.map((cat) => (
                        <div 
                            key={cat._id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                                editingId === cat._id 
                                    ? 'bg-purple-50 border-purple-200' 
                                    : 'bg-slate-50 border-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/50'
                            }`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-slate-700">{cat.name}</span>
                                    <span className="text-[9px] px-2 py-0.5 bg-slate-200 text-slate-500 rounded-md font-bold uppercase tracking-tighter">
                                        /{cat.slug}
                                    </span>
                                </div>
                                {cat.description && (
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 line-clamp-1">{cat.description}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onEdit(cat)}
                                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => onDelete(cat._id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryList;
