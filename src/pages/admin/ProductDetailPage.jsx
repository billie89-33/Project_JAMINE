import { 
  EditableMainInfo, 
  EditableSpecs, 
  useEditProduct 
} from '@/modules/admin/product-detail';
import { ArrowLeft, Save, X, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🚀 ProductDetailPage (Admin - Edit Mode)
 * หน้าจัดการรายละเอียดและแก้ไขสินค้าแบบ Surgical Edit
 */
const ProductDetailPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    imagePreview,
    isLoading,
    isSubmitting,
    handleFileSelect,
    handleSpecChange,
    handleSubmit
  } = useEditProduct();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm animate-pulse">
          กำลังเตรียมข้อมูลสินค้า...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Sticky Action Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-50 px-4 md:px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all hover:shadow-lg active:scale-90"
              title="กลับหน้ารายการสินค้า"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
                  <Box size={14} strokeWidth={3} />
                </span>
                <h1 className="text-xl font-black text-slate-800">
                  Edit Product
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-1">
                Product ID: <span className="text-purple-400">#{formData.modelName.toLowerCase().replace(/\s+/g, '-')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/products')}
              className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              <X size={16} strokeWidth={3} />
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                isSubmitting 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-200 hover:-translate-y-0.5'
              }`}
            >
              <Save size={16} strokeWidth={3} />
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* Basic Info Section */}
        <section className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-purple-100/50 border border-purple-50">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Basic Information</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">ข้อมูลหลักและรูปภาพสินค้า</p>
            </div>
          </div>
          
          <EditableMainInfo 
            formData={formData}
            setFormData={setFormData}
            imagePreview={imagePreview}
            onFileSelect={handleFileSelect}
          />
        </section>

        {/* Specifications Section */}
        <EditableSpecs 
          category={formData.category}
          specifications={formData.specifications}
          onSpecChange={handleSpecChange}
        />

        {/* Delete Warning (Optional UI Element) */}
        <div className="p-8 bg-rose-50 rounded-[40px] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest">Zone อันตราย</h4>
              <p className="text-xs text-rose-600 font-medium mt-1">การลบสินค้าจะทำให้ข้อมูลหายไปจากระบบถาวร ไม่สามารถกู้คืนได้</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-100">
            Delete Product
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
