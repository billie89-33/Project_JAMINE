import { Plus, X } from 'lucide-react';

/**
 * 🛠️ SpecFields Component (Dynamic Builder)
 * ระบบเพิ่ม/ลดคุณสมบัติสินค้าแบบ Key-Value อย่างอิสระ
 */
const SpecFields = ({ category, specifications, onAddRow, onSpecChange, onRemoveSpec }) => {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                        Specifications <span className="text-purple-600 ml-2">{category ? `(${category})` : ''}</span>
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">เพิ่มหรือลดคุณสมบัติได้ตามต้องการ</p>
                </div>
                <button 
                    type="button"
                    onClick={onAddRow}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <Plus size={14} strokeWidth={3} /> เพิ่มคุณสมบัติ
                </button>
            </div>
            
            <div className="space-y-4">
                {specifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                        ยังไม่มีคุณสมบัติสำหรับสินค้านี้<br/>คลิก "เพิ่มคุณสมบัติ" เพื่อเริ่มต้น
                    </div>
                ) : (
                    specifications.map((spec) => (
                        <div key={spec.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-all hover:border-purple-200">
                            <div className="flex-1 w-full relative">
                                <label className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-black text-purple-600 uppercase tracking-widest rounded">Key (หัวข้อ)</label>
                                <input 
                                    type="text" 
                                    value={spec.key}
                                    onChange={(e) => onSpecChange(spec.id, 'key', e.target.value)}
                                    placeholder="เช่น Switch, Color" 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="hidden sm:block text-slate-300 font-bold">:</div>
                            <div className="flex-[2] w-full flex items-center gap-2 relative">
                                <label className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-black text-emerald-600 uppercase tracking-widest rounded">Value (รายละเอียด)</label>
                                <input 
                                    type="text" 
                                    value={spec.value} 
                                    onChange={(e) => onSpecChange(spec.id, 'value', e.target.value)}
                                    placeholder="เช่น Cherry MX Red, Black" 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                />
                                <button 
                                    type="button"
                                    onClick={() => onRemoveSpec(spec.id)}
                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                    title="ลบคุณสมบัตินี้"
                                >
                                    <X size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SpecFields;