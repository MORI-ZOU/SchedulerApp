import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { toast } from 'react-toastify';
import axios from 'axios';
import DatabaseAPI from '../api/DatabaseAPI';

type serverResponce = {
  message: string
  database_id: string
  databse_name: string
}

export const useAuth = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setDatabaseInfo, databaseInfo } = useLogin();

  const login = useCallback(
    async (id: string) => {

      setLoading(true);

      ////データ取得
      await DatabaseAPI.post("/load/", { database_id: id }).then((res) => {
        if (res.status != 200) {
          throw new Error(res.statusText)
        }

        setDatabaseInfo({ id: res.data.database_id, name: res.data.databse_name })
        toast.success("サーバーにログインしました")
        navigation('/Home')
      })
        .catch(() => toast.error("ログインに失敗しました"))
        .finally(() => setLoading(false));
    }, [navigation, setDatabaseInfo]);

  return { login, loading };
};
