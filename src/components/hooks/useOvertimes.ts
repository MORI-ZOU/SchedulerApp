import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Overtime } from '../../types/Overtime';

const dataSource: Array<Overtime> = [
    {
        id: '1',
        color: '#FF5733',
        overtime_hours: 1
    },
    {
        id: '2',
        color: '#33FF57',
        overtime_hours: 2
    },
    {
        id: '3',
        color: '#3357FF',
        overtime_hours: 4
    },
];

export const useOvertimes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [overtimes, setOvertimes] = useState<Array<Overtime>>([]);

    const getOvertimes = useCallback(() => {
        try {
            setLoading(true);

            ////loading
            setOvertimes(dataSource)

            ////DB処理を後で記述
            toast.success("残業種類データを取得しました")
        } catch (e) {
            toast.error("残業種類データ取得に失敗しました");
        }
        finally {
            setLoading(false)
        }
    }, []);

    return { getOvertimes, loading, overtimes };
};
