import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseApiOptions<TData = any, TResponse = any> {
  initialData?: TData | null;
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, response: TResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (message: string, error: any) => void;
  onFinally?: () => void;
  transform?: (res: TResponse) => TData;
}

/**
 * 🛠️ useApi - Advanced Global Hook (Standard Edition)
 * ออกแบบมาให้ยืดหยุ่นสูง เพื่อใช้ในโปรเจกต์นี้และนำไปใช้ต่อในโปรเจกต์อื่นได้ง่าย
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useApi = <TData = any, TArgs extends any[] = any[], TResponse = any>(
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform = (res: any) => res?.data ?? res
    } = optionsRef.current;

    try {
      setLoading(true);
      setError(null);
      
      const res = await apiFuncRef.current(...args);
      const transformedData = transform ? transform(res) : (res as unknown as TData);
      
      setData(transformedData);

      // ✅ Handle Success
      if (onSuccess) onSuccess(transformedData, res);
      if (showToast && successMessage) toast.success(successMessage);
      
      return res;
    } catch (err: unknown) {
      // ❌ Handle Error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errObj = err as any;
      const responseData = errObj.response?.data;
      const msg = errorMessage || 
                 responseData?.message || 
                 responseData?.error || 
                 (typeof responseData === 'string' ? responseData : null) ||
                 errObj.message || 
                 'An unexpected error occurred';
      
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
