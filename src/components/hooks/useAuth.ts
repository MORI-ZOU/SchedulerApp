import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setDatabaseInfo } = useLogin();

  const login = useCallback(
    (id: string) => {
      try {
      setLoading(true);

      ////DB処理を後で記述
      toast.success("サーバーにログインしました")
      navigation('/Home')
    }catch(e){
     toast.error("ログインに失敗しました");
    }
    finally{
      setLoading(false)
    }
    },
    [navigation,  setDatabaseInfo]
  );
  return { login, loading };
};
