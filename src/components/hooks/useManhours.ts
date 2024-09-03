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

    return { getManhours, loading, manhours };


}