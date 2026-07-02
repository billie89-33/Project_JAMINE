import { Plus, Save, RotateCcw, Loader2 } from 'lucide-react';

interface CategoryFormProps {
    formData: { name: string; description: string };
    editingId: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e?: React.FormEvent) => void;
    onReset: () => void;
    isActionLoading: boolean;
}

const CategoryForm = ({ formData, editingId, onChange, onSubmit, onReset, isActionLoading }: CategoryFormProps) => {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                    <Plus size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                    {editingId ? 'Edit Category' : 'Create New Category'}
                </h3>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category Name *</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="e.g. Promotion, Health"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-bold"
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description (Optional)</label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Short description about this category..."
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-bold resize-none"
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <button 
                        type="submit"
                        disabled={isActionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                        {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {editingId ? 'Update Category' : 'Save Category'}
                    </button>
                    {editingId && (
                        <button 
                            type="button"
                            onClick={onReset}
                            className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all"
                            title="Cancel Edit"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
