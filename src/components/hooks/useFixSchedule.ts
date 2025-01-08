import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import DatabaseAPI from '../api/DatabaseAPI';
import { useLogin } from './useLogin';
import { FixedShift } from '../../types/FixedShift';
import { FixedOvertime } from '../../types/FixedOvertime';
import { DateOnly } from '../../types/DateOnly';


export const useFixSchedule = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fixedShifts, setFixedShifts] = useState<Array<FixedShift>>([]);
    const [fixedOvertimes, setFixedOvertimes] = useState<Array<FixedOvertime>>([]);
    const { databaseInfo } = useLogin();

    const getFixedShifts = useCallback(() => {
        ////データ取得
        DatabaseAPI.post("/get-fixedshifts/", { database_id: databaseInfo?.id }).then((res) => {
            setLoading(true);

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("getFixedShift", res)

            const values: Array<FixedShift> = res.data.map((val: any) => ({
                date: DateOnly.fromString(val.date),
                employee_id: val.employee_id,
                skill_id: val.skill_id,
                shift_id: val.shift_id,
            }));

            ////loading
            setFixedShifts(values)

            ////DB処理を後で記述
            toast.success("固定シフトデータを取得しました")
        })
            .catch(() => toast.error("固定シフトデータ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const saveFixedShifts = useCallback((fixedShifts: FixedShift[]) => {
        const data = {
            database_id: databaseInfo?.id,
            fixedshift: fixedShifts.map(val => ({
                date: val.date.toString(),
                employee_id: val.employee_id,
                skill_id: val.skill_id,
                shift_id: val.shift_id,
            }))
        };

        console.log("saveFixedShifts", data);

        DatabaseAPI.post("/set-fixedshifts/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getFixedShifts();
            toast.success("固定シフトをデータベースに保存しました");
        })
            .catch((e) => toast.error("固定シフトの保存に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    const deleteFixedShifts = useCallback((fixedShifts: FixedShift[]) => {
        const data = {
            database_id: databaseInfo?.id,
            fixedshift: fixedShifts.map(val => ({
                date: val.date.toString(),
                employee_id: val.employee_id,
                skill_id: val.skill_id,
                shift_id: val.shift_id,
            }))
        };

        console.log("deleteFixedShifts", data);

        DatabaseAPI.post("/delete-fixedshifts/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getFixedShifts();
            toast.success("固定シフトをデータベースから削除しました");
        })
            .catch((e) => toast.error("固定シフトの削除に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    const getFixedOvertimes = useCallback(() => {
        ////データ取得
        DatabaseAPI.post("/get-fixedovertimes/", { database_id: databaseInfo?.id }).then((res) => {
            setLoading(true);

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("getFixedOvertimes", res);

            const values: Array<FixedOvertime> = res.data.map((val: any) => ({
                date: DateOnly.fromString(val.date),
                employee_id: val.employee_id,
                overtime_id: val.overtime_id
            }));

            ////loading
            setFixedOvertimes(values)

            ////DB処理を後で記述
            toast.success("固定残業データを取得しました")
        })
            .catch(() => toast.error("固定残業データ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const saveFixedOvertimes = useCallback((fixedOvertimes: FixedOvertime[]) => {
        const data = {
            database_id: databaseInfo?.id,
            fixedovertime: fixedOvertimes.map(val => ({
                date: val.date.toString(),
                employee_id: val.employee_id,
                overtime_id: val.overtime_id
            }))
        };

        console.log("saveFixedOvertimes", data);

        DatabaseAPI.post("/set-fixedovertimes/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getFixedOvertimes();
            toast.success("固定残業をデータベースに保存しました");
        })
            .catch((e) => toast.error("固定残業の保存に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    const deleteFixedOvertimes = useCallback((fixedOvertimes: FixedOvertime[]) => {
        const data = {
            database_id: databaseInfo?.id,
            fixedovertime: fixedOvertimes.map(val => ({
                date: val.date.toString(),
                employee_id: val.employee_id,
                overtime_id: val.overtime_id
            }))
        };

        console.log("deleteFixedOvertimes", data);

        DatabaseAPI.post("/delete-fixedovertimes/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getFixedOvertimes();
            toast.success("固定残業をデータベースから削除しました");
        })
            .catch((e) => toast.error("固定残業の削除に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    return { getFixedShifts, saveFixedShifts, deleteFixedShifts, getFixedOvertimes, saveFixedOvertimes, deleteFixedOvertimes, loading, fixedShifts, fixedOvertimes };
};
