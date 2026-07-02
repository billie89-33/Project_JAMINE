import { 
    Save, 
    Upload, 
    Loader2, 
    ChevronLeft,
    Eye,
    EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import { NewsCategory } from '@/modules/admin/services';

interface NewsFormProps {
    formData: {
        title: string;
        category: string;
        content: string;
        isPublished: boolean;
    };
    categories: NewsCategory[];
    isLoading: boolean;
    isSubmitting: boolean;
    imagePreview: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: boolean | string; type?: string; checked?: boolean } }) => void;
    handleContentChange: (value: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isEditMode: boolean;
}

/**
 * 📰 NewsForm Component (v2.1 - Critical Fix)
 * หน้าจอเขียนข่าวสารพร้อม Rich Text Editor ที่ติดตั้งสมบูรณ์
 */
const NewsForm = ({ 
    formData, 
    categories, 
    isLoading, 
    isSubmitting, 
    imagePreview, 
    handleChange, 
    handleContentChange, 
    handleFileChange, 
    handleSubmit,
    isEditMode 
}: NewsFormProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-purple-600 mb-3" size={40} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Article Data...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* 1. Header Actions */}
            <div className="flex items-center justify-between">
                <Link 
                    to="/admin/news" 
                    className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest transition-colors group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isEditMode ? 'Update Article' : 'Publish Article'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 2. Left Column: Main Editor */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Article Title *</label>
                            <input 
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter a catchy title..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-xl font-black text-slate-800 placeholder:text-slate-300"
                                required
                            />
                        </div>

                        {/* Rich Text Editor Area */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Content (Rich Text Editor) *</label>
                            <div className="border border-slate-200 rounded-3xl overflow-hidden focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:border-purple-500 transition-all shadow-inner bg-white">
                                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-4">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        Interactive Studio Mode
                                    </span>
                                </div>
                                {/* 🚀 ใส่ Component ตรงนี้แน่นอน */}
                                <RichTextEditor 
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your amazing story here..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Right Column: Settings */}
                <div className="lg:col-span-4 space-y-6 text-left">
                    
                    {/* Cover Image Upload */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Cover Image *</label>
                        <div className="relative group aspect-[16/10]">
                            <div className={`w-full h-full rounded-3xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${
                                imagePreview ? 'border-purple-200 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                            }`}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <label className="cursor-pointer px-4 py-2 bg-white text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                Change Image
                                                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full justify-center">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:text-purple-500 transition-colors">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Cover</span>
                                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" required={!isEditMode} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Status */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Category *</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all text-sm font-bold text-slate-700"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Status</label>
                            <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                                <button 
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'isPublished', value: true, type: 'checkbox', checked: true } })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        formData.isPublished ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <Eye size={14} />
                                    Published
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'isPublished', value: false, type: 'checkbox', checked: false } })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        !formData.isPublished ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <EyeOff size={14} />
                                    Draft
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
};

export default NewsForm;
