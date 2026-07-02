import React from 'react';

interface ImageUploadBoxProps {
    imagePreview: string | null;
    onFileSelect: (file: File) => void;
    aspectRatio?: string;
}

const ImageUploadBox = ({ imagePreview, onFileSelect, aspectRatio = '1/1' }: ImageUploadBoxProps) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) onFileSelect(files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0]) onFileSelect(files[0]);
    };

    return (
        <div className="w-full">
            <span className="block text-center text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">
                {imagePreview ? 'Change Image' : 'Select Image'}
            </span>
            
            {/* 🖼️ Box Container: บังคับสัดส่วนตามที่ส่งมา */}
            <label 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{ aspectRatio: aspectRatio.replace('/', ' / ') }}
                className="w-full bg-white border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-300 shadow-inner group"
            >
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                />
                
                {imagePreview ? (
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3 p-8">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                        <p className="text-slate-400 text-[11px] font-bold text-center leading-relaxed">
                            ลากและวางไฟล์ หรือคลิกเพื่อเลือก<br/>
                            <span className="text-purple-400">สัดส่วนแนะนำ: {aspectRatio}</span>
                        </p>
                    </div>
                )}
            </label>
        </div>
    );
};

export default ImageUploadBox;