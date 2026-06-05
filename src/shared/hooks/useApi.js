import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

/**
 * 🛠️ useApi - Advanced Global Hook (Standard Edition)
 * ออกแบบมาให้ยืดหยุ่นสูง เพื่อใช้ในโปรเจกต์นี้และนำไปใช้ต่อในโปรเจกต์อื่นได้ง่าย
 * 
 * @param {Function} apiFunc - ฟังก์ชัน API (เช่น axios.get, authApi.login)
 * @param {Object} options - ตัวเลือกเพิ่มเติม (Optional)
 *   - initialData: ข้อมูลเริ่มต้น
 *   - showToast: เปิด/ปิด การโชว์ Toast อัตโนมัติ (Default: false)
 *   - successMessage: ข้อความเมื่อสำเร็จ (ถ้าไม่ใส่จะไม่มี Toast เขียว)
 *   - errorMessage: ข้อความเมื่อพลาด (ถ้าไม่ใส่จะใช้ Message จาก Backend)
 *   - onSuccess: Callback เมื่อสำเร็จ (data, response) => {}
 *   - onError: Callback เมื่อพลาด (message, error) => {}
 *   - onFinally: Callback เมื่อจบการทำงาน
 */
export const useApi = (apiFunc, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🛡️ ป้องกัน Infinite Loop: เก็บค่า options และ apiFunc ไว้ใน Ref เพื่อให้ execute เป็นฟังก์ชันที่มี Reference คงที่เสมอ
  const optionsRef = useRef(options);
  const apiFuncRef = useRef(apiFunc);

  useEffect(() => {
    optionsRef.current = options;
    apiFuncRef.current = apiFunc;
  });

  const execute = useCallback(async (...args) => {
    // 🛡️ ดึงค่าจาก Ref มาใช้ เพื่อให้ได้ค่าล่าสุดเสมอโดยไม่ต้องเอา options ไปใส่ใน Dependency Array
    const {
      onSuccess,
      onError,
      onFinally,
      showToast = false,
      successMessage,
      errorMessage,
      transform = (res) => res?.data ?? res
    } = optionsRef.current;

    try {
      setLoading(true);
      setError(null);
      
      const res = await apiFuncRef.current(...args);
      const transformedData = transform(res);
      
      setData(transformedData);

      // ✅ Handle Success
      if (onSuccess) onSuccess(transformedData, res);
      if (showToast && successMessage) toast.success(successMessage);
      
      return res;
    } catch (err) {
      // ❌ Handle Error: พยายามดึง Message จากหลายๆ Format ที่ Backend อาจส่งมา
      const responseData = err.response?.data;
      const msg = errorMessage || 
                 responseData?.message || 
                 responseData?.error || 
                 (typeof responseData === 'string' ? responseData : null) ||
                 err.message || 
                 'An unexpected error occurred';
      
      setError(msg);
      
      if (onError) onError(msg, err);
      if (showToast) toast.error(msg);
      
      throw err;
    } finally {
      setLoading(false);
      if (onFinally) onFinally();
    }
  }, []); // ⚡ Dependency ว่างเปล่า = execute จะไม่มีวันเปลี่ยน Reference!

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError
  };
};
