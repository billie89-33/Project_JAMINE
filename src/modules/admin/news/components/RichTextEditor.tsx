import { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // สไตล์พื้นฐาน
import { uploadNewsImageApi } from '@/modules/admin/services';
import toast from 'react-hot-toast';

/**
 * ✍️ RichTextEditor (v1.0)
 * ตัวครอบ React Quill พร้อมระบบ Custom Image Upload ตรงสู่ Cloudinary
 */
const RichTextEditor = ({ value, onChange, placeholder }) => {
    const quillRef = useRef(null);

    // 🖼️ ระบบดักจับการกดปุ่ม "แทรกรูป"
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const toastId = toast.loading('กำลังอัปโหลดรูปภาพลงบทความ...');
            try {
                // 1. ส่งรูปขึ้น Cloudinary ผ่าน API ที่เราเพิ่งสร้าง
                const res: any = await uploadNewsImageApi(file);
                
                if (res.success) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    
                    // 2. แปะ URL ที่ได้ลงใน Editor แทนที่ Base64
                    quill.insertEmbed(range.index, 'image', res.url);
                    toast.success('อัปโหลดรูปภาพสำเร็จ', { id: toastId });
                }
            } catch (error) {
                toast.error('อัปโหลดรูปภาพล้มเหลว', { id: toastId });
                console.error(error);
            }
        };
    };

    // ⚙️ การตั้งค่า Toolbar (Modules)
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    return (
        <div className="rich-text-editor">
            <style>
                {`
                    .rich-text-editor .ql-container {
                        border-bottom-left-radius: 1.5rem;
                        border-bottom-right-radius: 1.5rem;
                        font-family: inherit;
                        font-size: 1rem;
                        min-height: 400px;
                    }
                    .rich-text-editor .ql-toolbar {
                        border-top-left-radius: 1.5rem;
                        border-top-right-radius: 1.5rem;
                        background: #f8fafc;
                        border-color: #e2e8f0;
                        padding: 12px;
                    }
                    .rich-text-editor .ql-snow {
                        border-color: #e2e8f0 !important;
                    }
                    .rich-text-editor .ql-editor.ql-blank::before {
                        color: #cbd5e1;
                        font-style: normal;
                        font-weight: 500;
                    }
                    .rich-text-editor .ql-editor {
                        padding: 1.5rem;
                        line-height: 1.6;
                    }
                `}
            </style>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder}
            />
        </div>
    );
};

export default RichTextEditor;
