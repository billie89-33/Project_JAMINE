import React from 'react';
import { useNewsCategories } from './hooks/useNewsCategories';
import CategoryForm from './components/CategoryForm';
import CategoryList from './components/CategoryList';
import { Tag, Sparkles } from 'lucide-react';

/**
 * 🚀 NewsCategoriesContainer
 * หน้าหลักสำหรับจัดการหมวดหมู่ข่าวสารในฝั่ง Admin
 */
const NewsCategoriesContainer = () => {
    const {
        categories,
        isLoading,
        isActionLoading,
        formData,
        editingId,
        handleInputChange,
        handleSubmit,
        handleDelete,
        startEdit,
        resetForm
    } = useNewsCategories();

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-purple-500 fill-purple-500" />
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">News System</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                        <Tag size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">
                            News Categories
                        </h1>
                        <p className="text-slate-400 mt-1 font-medium">จัดการหมวดหมู่ข่าวสารเพื่อให้โครงสร้างเนื้อหาเป็นระเบียบ</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5">
                    <CategoryForm 
                        formData={formData}
                        editingId={editingId}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onReset={resetForm}
                        isActionLoading={isActionLoading}
                    />
                </div>
                <div className="lg:col-span-7">
                    <CategoryList 
                        categories={categories}
                        isLoading={isLoading}
                        onEdit={startEdit}
                        onDelete={handleDelete}
                        editingId={editingId}
                    />
                </div>
            </div>

            {/* Footer space */}
            <div className="h-10"></div>
        </div>
    );
};

export default NewsCategoriesContainer;
