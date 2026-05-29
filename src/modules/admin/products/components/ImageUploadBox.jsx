

const ImageUploadBox = ({ imagePreview, onFileSelect }) => {
    
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) onFileSelect(files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0]) onFileSelect(files[0]);
    };

    return (
        <div className="w-full">
            <span className="block text-center text-gray-800 text-sm font-medium mb-1">
                เพิ่มรูปภาพ
            </span>
            
            {/* เปลี่ยนกล่องด้านนอกให้เป็นแท็ก <label> แทน <div> */}
            <label 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full min-h-[160px] bg-white border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
                {/* ซ่อนอินพุตตัวจริงไว้เหมือนเดิม ไม่ต้องมี ref แล้ว */}
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                />
                
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-36 object-contain rounded" />
                ) : (
                    <p className="text-gray-400 text-sm font-light text-center">
                        ลากและวางไฟล์หรือเลือกเพิ่มรูปภาพ
                    </p>
                )}
            </label>
        </div>
    );
};

export default ImageUploadBox;