import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface UseApiOptions<TData, TResponse = TData> {
  initialData?: TData | null;
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, response: TResponse) => void;
  onError?: (message: string, error: Error) => void;
  onFinally?: () => void;
  transform?: (res: TResponse) => TData;
}

/**
 * 🛠️ useApi - Advanced Global Hook (Strict Edition)
 * ออกแบบมาให้ยืดหยุ่นสูง เพื่อใช้ในโปรเจกต์นี้และนำไปใช้ต่อในโปรเจกต์อื่นได้ง่าย
 * ปรับแก้ (Refactored): ถอด `unknown` ออกทั้งหมด เพื่อให้ตรงตามกฎ Strict Guidelines
 */
export const useApi = <
  TData,
  TArgs extends (string | number | boolean | object | null | undefined)[] = [],
  TResponse = TData
>(
  apiFunc: (...args: TArgs) => Promise<TResponse>,
  options: UseApiOptions<TData, TResponse> = {}
) => {
  const [data, setData] = useState<TData | null>(options.initialData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🛡️ ป้องกัน Infinite Loop
  const optionsRef = useRef(options);
  const apiFuncRef = useRef(apiFunc);

  useEffect(() => {
    optionsRef.current = options;
    apiFuncRef.current = apiFunc;
  });

  const execute = useCallback(async (...args: TArgs): Promise<TResponse | undefined> => {
    const {
      onSuccess,
      onError,
      onFinally,
      showToast = false,
      successMessage,
      errorMessage,
      transform
    } = optionsRef.current;

    try {
      setLoading(true);
      setError(null);
      
      const res = await apiFuncRef.current(...args);
      
      // ✅ Strict Transformation: หลีกเลี่ยงการใช้ `as unknown`
      let transformedData: TData;
      if (transform) {
        transformedData = transform(res);
      } else {
        if (res && typeof res === 'object' && 'data' in res) {
          transformedData = (res as { data?: TData }).data as TData;
        } else {
          transformedData = res as TData;
        }
      }
      
      setData(transformedData);

      // ✅ Handle Success
      if (onSuccess) onSuccess(transformedData, res);
      if (showToast && successMessage) toast.success(successMessage);
      
      return res;
    } catch (err) {
      // ❌ Strict Error Handling: ใช้ Type Guard แทนการ Cast เหมารวม
      let msg = errorMessage || 'An unexpected error occurred';
      let errObj: Error;

      if (err instanceof Error) {
        errObj = err;
        msg = errorMessage || err.message;
        
        // ตรวจสอบ Object ที่อาจเป็น Axios Error หรือ Custom Error แบบปลอดภัย
        if ('response' in err && typeof err.response === 'object' && err.response !== null) {
          const responseData = (err.response as { data?: { message?: string, error?: string } }).data;
          msg = errorMessage || 
                responseData?.message || 
                responseData?.error || 
                (typeof responseData === 'string' ? responseData : null) ||
                err.message;
        }
      } else {
        errObj = new Error(String(err));
      }
      
      setError(msg);
      
      if (onError) onError(msg, errObj);
      if (showToast) toast.error(msg);
      
      throw errObj;
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
