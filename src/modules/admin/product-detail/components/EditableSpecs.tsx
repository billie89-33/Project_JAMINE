import SpecFields from '@/modules/admin/addproduct/components/SpecFields';

/**
 * 🛠️ EditableSpecs
 * ส่วนจัดการคุณสมบัติสินค้าแบบ Dynamic ตามหมวดหมู่
 */
export const EditableSpecs = ({ category, specifications, onSpecChange, onAddRow, onRemoveSpec }: any) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-purple-100/50 border border-purple-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">🛠️</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">Specifications</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">คุณสมบัติเฉพาะทางเทคนิค</p>
        </div>
      </div>

      <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
        <SpecFields 
          category={category} 
          specifications={Array.isArray(specifications) ? specifications : []} 
          onSpecChange={onSpecChange} 
          onAddRow={onAddRow}
          onRemoveSpec={onRemoveSpec}
        />
      </div>

      <div className="mt-6 flex items-start gap-3 px-4 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
        <span className="text-lg">ℹ️</span>
        <p className="text-[10px] text-indigo-600 font-bold leading-relaxed">
          หมายเหตุ: คุณสมบัติเหล่านี้จะถูกใช้ในการ "เปรียบเทียบสินค้า" และ "การค้นหาขั้นสูง" กรุณาระบุข้อมูลให้ครบถ้วนเพื่อช่วยให้ลูกค้าตัดสินใจได้ง่ายขึ้น
        </p>
      </div>
    </div>
  );
};

export default EditableSpecs;
