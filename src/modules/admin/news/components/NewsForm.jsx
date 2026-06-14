import React from 'react';
import { 
    Save, 
    X, 
    Upload, 
    Image as ImageIcon, 
    Loader2, 
    ChevronLeft,
    Type,
    Eye,
    EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-purple-600 mb-3" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Article Data...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link 
                    to="/admin/news" 
                    className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest transition-colors group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>
                <div className="flex items-center gap-3">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isEditMode ? 'Update Article' : 'Publish Article'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Editor */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
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

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Content (Markdown/HTML supported) *</label>
                            <div className="border border-slate-200 rounded-3xl overflow-hidden focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:border-purple-500 transition-all">
                                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                                        <button type="button" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><Type size={14}/></button>
                                        <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                        <button type="button" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors font-bold">B</button>
                                        <button type="button" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors italic text-xs">I</button>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter italic">Rich Text Editor Ready</span>
                                </div>
                                <textarea 
                                    name="content"
                                    value={formData.content}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    placeholder="Tell your story..."
                                    rows="15"
                                    className="w-full px-6 py-6 bg-white outline-none text-slate-600 font-medium leading-relaxed resize-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Settings */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Cover Image */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Cover Image *</label>
                        <div className="relative group">
                            <div className={`aspect-[16/10] rounded-3xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${
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
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Cover File</span>
                                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" required={!isEditMode} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Metadata Settings */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Category *</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm font-bold text-slate-700"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Publish Status</label>
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
