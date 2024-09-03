import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ShiftType } from '../../types/ShiftType';
import { Time } from '../../types/Time';
import { HexColor } from '../../types/HexColor';
import axios from 'axios';
import DatabaseAPI from '../api/DatabaseAPI';
import { useLogin } from './useLogin';

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
    const { databaseInfo } = useLogin();

    const getShifts = useCallback(() => {
        ////データ取得
        DatabaseAPI.post("/get-shifts/", { database_id: databaseInfo?.id }).then((res) => {
            setLoading(true);

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("getShift", res)

            const values: Array<ShiftType> = res.data.map((val: any) => ({
                id: val.id,
                name: val.name,
                color: new HexColor(val.color),
                startTime: Time.fromString(val.start_time),
                endTime: Time.fromString(val.end_time)
            }));

            ////loading
            setShifts(values)

            ////DB処理を後で記述
            toast.success("シフト種類データを取得しました")
        })
            .catch(() => toast.error("シフト種類データ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const saveShifts = useCallback((shifts: ShiftType[]) => {
        const data = {
            database_id: databaseInfo?.id,
            shifts: shifts.map(shift => ({
                id: shift.id,
                name: shift.name,
                color: shift.color.toString(),
                start_time: shift.startTime.toString(),
                end_time: shift.endTime.toString(),
            }))
        };

        console.log(data)

        DatabaseAPI.post("/set-shifts/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getShifts();
            toast.success("シフトをデータベースに保存しました");
        })
            .catch((e) => toast.error("シフトの保存に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    const deleteShifts = useCallback((shift_ids: string[]) => {
        const data = {
            database_id: databaseInfo?.id,
            shift_ids: shift_ids
        };

        console.log(data)

        DatabaseAPI.post("/delete-shifts/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getShifts();
            toast.success("シフトをデータベースから削除しました");
        })
            .catch((e) => toast.error("シフトの削除に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    return { getShifts, saveShifts, deleteShifts, loading, shifts };
};
