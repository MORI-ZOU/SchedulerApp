import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  type: ToastType;
  message: string;
}

export const useMessage = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000); // 3秒後にトーストを非表示に
  }, []);

  return { toast, showToast };
};
