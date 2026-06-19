import { useNewsForm } from './hooks/useNewsForm';
import NewsForm from './components/NewsForm';
import { Sparkles, Newspaper } from 'lucide-react';

const NewsFormContainer = () => {
    const {
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
    } = useNewsForm();

    return (
        <div className="max-w-[1400px] mx-auto animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-purple-500 fill-purple-500" />
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Editor Studio</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
                        <Newspaper size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">
                            {isEditMode ? 'Edit Article' : 'Create New Article'}
                        </h1>
                        <p className="text-slate-400 mt-1 font-medium">เขียนเนื้อหาที่มีคุณภาพเพื่อสร้างประสบการณ์ที่ดีให้กับลูกค้าของคุณ</p>
                    </div>
                </div>
            </div>

            <NewsForm 
                formData={formData}
                categories={categories}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                imagePreview={imagePreview}
                handleChange={handleChange}
                handleContentChange={handleContentChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                isEditMode={isEditMode}
            />
        </div>
    );
};

export default NewsFormContainer;
