import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ShiftType } from '../../types/ShiftType';
import { Time } from '../../types/Time';

const dataSource: Array<ShiftType> = [
    {
        id: "a",
        name: "日勤",
        color: "#fff",
        startTime: new Time(8, 0, 0),
        endTime: new Time(17, 0, 0),
    },
    {
        id: "b",
        name: "夜勤",
        color: "#fff",
        startTime: new Time(21, 0, 0),
        endTime: new Time(6, 0, 0),
    },
];

export const useShifts = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [shifts, setShifts] = useState<Array<ShiftType>>([]);

    const getShifts = useCallback(() => {
        try {
            setLoading(true);

            setShifts(dataSource)

            ////DB処理を後で記述
            toast.success("シフト種類データを取得しました")
        } catch (e) {
            toast.error("シフト種類データ取得に失敗しました");
        }
        finally {
            setLoading(false)
        }
    }, []);

    return { getShifts, loading, shifts };
};
