import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { DateOnly } from '../../types/DateOnly';
import { useLogin } from './useLogin';
import DatabaseAPI from '../api/DatabaseAPI';

const dataSource: Array<DateOnly> = [
    new DateOnly(2024, 4, 1),
    new DateOnly(2024, 4, 2),
    new DateOnly(2024, 4, 3),
];

export const useDate = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [dates, setDates] = useState<Array<DateOnly>>([]);
    const { databaseInfo } = useLogin()

    const getDates = useCallback(() => {
        setLoading(true);

        ////データ取得
        DatabaseAPI.post("/get-dates/", { database_id: databaseInfo?.id }).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            const values: Array<DateOnly> = res.data.map((val: any) => {
                return DateOnly.fromString(val.date);
            });

            console.log("dates", values)

            ////loading
            setDates(values)

            ////DB処理を後で記述
            toast.success("日付情報を取得しました")
        })
            .catch((e) => toast.error("日付情報の取得に失敗しました" + e))
            .finally(() => setLoading(false))
    }, []);

    const saveDates = useCallback((dates: DateOnly[]) => {
        const data = {
            database_id: databaseInfo?.id,
            dates: dates.map(date => {
                return date.toString()
            })
        };

        console.log(data)

        DatabaseAPI.post("/set-dates/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getDates();
            toast.success("日付情報をデータベースに保存しました");
        })
            .catch((e) => toast.error("日付情報の保存に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    const deleteDates = useCallback((dates: DateOnly[]) => {
        const data = {
            database_id: databaseInfo?.id,
            dates: dates.map((date) => {
                return date.toString()
            })
        };

        console.log(data)

        DatabaseAPI.post("/delete-dates/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getDates();
            toast.success("日付情報をデータベースから削除しました");
        })
            .catch((e) => toast.error("日付情報の削除に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    return { getDates, saveDates, deleteDates, loading, dates };
};
