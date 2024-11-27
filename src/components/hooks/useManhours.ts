import { useCallback, useState } from "react"
import { Manhour } from "../../types/Manhour";
import { useLogin } from "./useLogin";
import DatabaseAPI from "../api/DatabaseAPI";
import { toast } from "react-toastify";
import { HexColor } from "../../types/HexColor";
import { Time } from "../../types/Time";

export const useManhours = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [manhours, setManhours] = useState<Array<Manhour>>([]);
    const { databaseInfo } = useLogin();

    const getManhours = useCallback(() => {
        setLoading(true);

        ////データ取得
        DatabaseAPI.post("/get-manhours/", { database_id: databaseInfo?.id }).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            const values: Array<Manhour> = res.data.map((val: any) => ({
                date: val.date,
                skill: {
                    id: val.skill.id,
                    name: val.skill.name,
                    color: new HexColor(val.skill.color)
                },
                shift: {
                    id: val.shift.id,
                    name: val.shift.name,
                    color: new HexColor(val.shift.color),
                    startTime: Time.fromString(val.shift.start_time),
                    endTime: Time.fromString(val.shift.end_time)
                },
                required_hours: val.required_hours,
            }));


            ////loading
            setManhours(values)

            ////DB処理を後で記述
            toast.success("必要工数データを取得しました")
        })
            .catch(() => toast.error("必要工数データ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const saveManhours = useCallback((manhours: Manhour[]) => {
        const data = {
            database_id: databaseInfo?.id,
            manhours: manhours.map(manhour => ({
                date: manhour.date.toString(),
                skill: {
                    id: manhour.skill.id,
                    name: manhour.skill.name,
                    color: manhour.skill.color.toString()
                },
                shift: {
                    id: manhour.shift.id,
                    name: manhour.shift.name,
                    color: manhour.shift.color.toString(),
                    start_time: manhour.shift.startTime.toString(),
                    end_time: manhour.shift.endTime.toString()
                },
                required_hours: manhour.required_hours
            }))
        };

        console.log(data)

        DatabaseAPI.post("/set-manhours/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getManhours();
            toast.success("必要工数をデータベースに保存しました");
        })
            .catch((e) => toast.error("必要工数の保存に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    return { getManhours, saveManhours, loading, manhours };


}