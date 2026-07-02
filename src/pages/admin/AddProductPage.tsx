import { ProductForm } from '@/modules/admin/addproduct';

const AddProductPage = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* ส่วนหัวข้อของหน้า (Page Header) - สไตล์เดียวกับหน้า Admin Products */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <span className="bg-purple-600 text-white p-2.5 rounded-2xl shadow-lg shadow-purple-200">✨</span>
                            Create New Product
                        </h1>
                        <p className="text-slate-400 mt-1 font-medium ml-1">
                            เพิ่มสินค้าใหม่เข้าสู่ระบบจัดการคลังสินค้าหลังบ้าน
                        </p>
                    </div>
                </div>

                {/* แสดงผลตัวฟอร์มที่เราแยก Component ไว้ */}
                <ProductForm />
                
            </div>
        </div>
    );
};

export default AddProductPage;