import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ShiftType } from '../../types/ShiftType';
import { Time } from '../../types/Time';
import { HexColor } from '../../types/HexColor';
import axios from 'axios';

const dataSource: Array<ShiftType> = [
    {
        id: "a",
        name: "日勤",
        color: new HexColor("#ea3e3e"),
        startTime: new Time(8, 0, 0),
        endTime: new Time(17, 0, 0),
    },
    {
        id: "b",
        name: "夜勤",
        color: new HexColor("#18d115"),
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
            const shifts = axios.get()


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

    return { getShifts, setShifts, loading, shifts };
};
