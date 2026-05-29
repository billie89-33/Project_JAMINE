import { useState, useCallback } from 'react';
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

  const execute = useCallback(async (...args) => {
    // 🛡️ ดึงค่าจาก options มาใช้ (ทำในฟังก์ชันเพื่อให้สดใหม่เสมอ)
    const {
      onSuccess,
      onError,
      onFinally,
      showToast = false,
      successMessage,
      errorMessage,
      transform = (res) => res?.data ?? res
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const res = await apiFunc(...args);
      const transformedData = transform(res);
      
      setData(transformedData);

      // ✅ Handle Success
      if (onSuccess) onSuccess(transformedData, res);
      if (showToast && successMessage) toast.success(successMessage);
      
      return res;
    } catch (err) {
      // ❌ Handle Error
      const msg = errorMessage || err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(msg);
      
      if (onError) onError(msg, err);
      if (showToast) toast.error(msg);
      
      throw err;
    } finally {
      setLoading(false);
      if (onFinally) onFinally();
    }
  }, [apiFunc, options]); // Note: options ควรเป็นเมมโมไรซ์ หรือส่งค่าที่จำเป็นเข้ามา

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError
  };
};
