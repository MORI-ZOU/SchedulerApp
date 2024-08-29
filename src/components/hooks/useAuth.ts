import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { toast } from 'react-toastify';
import axios from 'axios';

type serverResponce = {
  message: string
  database_id: string
  databse_name: string
}

export const useAuth = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setDatabaseInfo } = useLogin();
  const [code, setCode] = useState(0);

  const login = useCallback(
    (id: string) => {
      try {
        setLoading(true);

        const sendData = {
          database_id: id
        }

        console.log("send", sendData)

        axios.post<serverResponce>("http://localhost:58000/load/", sendData).then((res) => {
          setCode(res.status)

          if (res.status != 200) {
            throw new Error("")
          }
          setDatabaseInfo({ id: res.data.database_id, name: res.data.databse_name })
        })

        console.log(code)

        ////DB処理を後で記述
        toast.success("サーバーにログインしました")
        navigation('/Home')
      } catch (e) {
        toast.error("ログインに失敗しました");
      }
      finally {
        setLoading(false)
      }
    },
    [navigation, setDatabaseInfo]
  );
  return { login, loading };
};
