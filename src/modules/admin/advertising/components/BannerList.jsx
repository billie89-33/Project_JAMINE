import { Edit3, Trash2, ExternalLink, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';

/**
 * 📋 BannerList Component
 * แสดงรายการแบนเนอร์ทั้งหมดในรูปแบบตารางพรีเมียม
 */
export const BannerList = ({ banners, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-[40px] shadow-2xl shadow-purple-100/50 border border-purple-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preview</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Banner Details</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Placement</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {banners.map((banner) => (
              <tr key={banner._id || banner.id} className="group hover:bg-purple-50/30 transition-colors">
                {/* 1. Preview Image */}
                <td className="px-8 py-6">
                  <div className="relative w-40 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group-hover:border-purple-200 transition-all flex items-center justify-center">
                    {banner?.image?.url ? (
                      <img 
                        src={banner.image.url} 
                        alt={banner.title || 'Banner'} 
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${banner?.image?.url ? 'hidden' : 'flex'} items-center gap-2 text-slate-300`}>
                      <ImageIcon size={16} />
                      <span className="text-[8px] font-black uppercase">No Image</span>
                    </div>
                  </div>
                </td>

                {/* 2. Title & Link */}
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                      {banner?.title || 'Untitled Banner'}
                    </h4>
                    {banner?.linkUrl && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <ExternalLink size={10} />
                        <span className="text-[10px] font-bold truncate max-w-[150px]">{banner.linkUrl}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* 3. Placement */}
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">
                    {(banner?.placement || 'unknown').replace('_', ' ')}
                  </span>
                </td>

                {/* 4. Status */}
                <td className="px-8 py-6">
                  {banner.isActive ? (
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <CheckCircle2 size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <XCircle size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Draft</span>
                    </div>
                  )}
                </td>

                {/* 5. Actions */}
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(banner)}
                      className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-purple-600 hover:border-purple-200 hover:shadow-lg transition-all active:scale-90"
                      title="แก้ไขแบนเนอร์"
                    >
                      <Edit3 size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => onDelete(banner._id)}
                      className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-600 hover:border-rose-200 hover:shadow-lg transition-all active:scale-90"
                      title="ลบแบนเนอร์"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
