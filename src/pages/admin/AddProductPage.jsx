import { ProductForm } from '@/modules/admin/products/components';

const AddProductPage = () => {
    return (
        // min-h-screen: บังคับให้พื้นหลังสูงเต็มหน้าจอ
        // bg-[#E5E5E5]: ใช้สีพื้นหลังเทาอ่อนสไตล์หน้าแอดมิน เพื่อให้ตัวฟอร์มสีเข้มดูเด่นขึ้นมา
        <div className="min-h-screen bg-[#F3F4F6] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* ส่วนหัวข้อของหน้า (Page Header) */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create New Product
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        ระบบจัดการคลังสินค้าหลังบ้านสำหรับผู้ดูแลระบบ (Admin Only)
                    </p>
                </div>

                {/* แสดงผลตัวฟอร์มที่เราแยก Component ไว้ */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-2">
                    <ProductForm />
                </div>
                
            </div>
        </div>
    );
};

export default AddProductPage;