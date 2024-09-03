import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Overtime } from '../../types/Overtime';
import { HexColor } from '../../types/HexColor';
import { useLogin } from './useLogin';
import DatabaseAPI from '../api/DatabaseAPI';
import { AxiosResponse } from 'axios';

const dataSource: Array<Overtime> = [
    {
        id: '1',
        color: new HexColor('#FF5733'),
        overtime_hours: 1
    },
    {
        id: '2',
        color: new HexColor('#33FF57'),
        overtime_hours: 2
    },
    {
        id: '3',
        color: new HexColor('#3357FF'),
        overtime_hours: 4
    },
];

export const useOvertimes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [overtimes, setOvertimes] = useState<Array<Overtime>>([]);
    const { databaseInfo } = useLogin();

    const getOvertimes = useCallback(() => {
        setLoading(true);

        ////データ取得
        DatabaseAPI.post("/get-overtimes/", { database_id: databaseInfo?.id }).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            const values: Array<Overtime> = res.data.map((val: any) => ({
                id: val.id,
                color: new HexColor(val.color),
                overtime_hours: val.overtime_hours
            }));

            ////loading
            setOvertimes(values)

            ////DB処理を後で記述
            toast.success("残業種類データを取得しました")
        })
            .catch(() => toast.error("残業種類データ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    return { getOvertimes, setOvertimes, loading, overtimes };
};
