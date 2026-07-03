import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface UseApiOptions<TData = unknown, TResponse = unknown> {
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
 * 🛠️ useApi - Advanced Global Hook (Standard Edition)
 * ออกแบบมาให้ยืดหยุ่นสูง เพื่อใช้ในโปรเจกต์นี้และนำไปใช้ต่อในโปรเจกต์อื่นได้ง่าย
 */
export const useApi = <TData = unknown, TArgs extends unknown[] = unknown[], TResponse = unknown>(
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
      transform = (res: TResponse) => (res as { data?: TData }).data ?? (res as unknown as TData)
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
    } catch (err) {
      // ❌ Handle Error
      const errObj = err as Error & { response?: { data?: { message?: string, error?: string } } };
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
