import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { useMessage } from './useMessage';

export const useAuth = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useMessage();
  const { setDatabaseInfo } = useLogin();

  const login = useCallback(
    (id: string) => {
      setLoading(true);

      ////DB処理を後で記述

      showToast('success', 'login success');
    },
    [navigation, showToast, setDatabaseInfo]
  );
  return { login, loading };
};
