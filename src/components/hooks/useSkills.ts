import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Skill } from '../../types/Skill';
import { HexColor } from '../../types/HexColor';
import DatabaseAPI from '../api/DatabaseAPI';
import { useLogin } from './useLogin';

const dataSource: Array<Skill> = [
    {
        id: "a",
        name: "TaskA",
        color: new HexColor("#ec1818"),
    },
    {
        id: "b",
        name: "TaskB",
        color: new HexColor("#2adf4e"),
    },
    {
        id: "c",
        name: "TaskC",
        color: new HexColor("#0a18e6"),
    },
];

export const useSkills = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<Array<Skill>>([]);
    const { databaseInfo } = useLogin();

    const getSkills = useCallback(() => {
        ////データ取得
        DatabaseAPI.post("/get-skills/", { database_id: databaseInfo?.id }).then((res) => {
            setLoading(true);

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            const values: Array<Skill> = res.data.map((val: any) => ({
                id: val.id,
                name: val.name,
                color: new HexColor(val.color)
            }));

            ////loading
            setSkills(values)

            ////DB処理を後で記述
            toast.success("スキル種類データを取得しました")
        })
            .catch(() => toast.error("スキル種類データ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const saveSkills = useCallback((skills: Skill[]) => {
        const data = {
            database_id: databaseInfo?.id,
            skills: skills.map(skill => ({
                id: skill.id,
                name: skill.name,
                color: skill.color.toString(),
            }))
        };

        console.log(data)

        DatabaseAPI.post("/set-skills/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getSkills();
            toast.success("スキルをデータベースに保存しました");
        })
            .catch((e) => toast.error("スキルの保存に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    const deleteSkills = useCallback((skill_ids: string[]) => {
        const data = {
            database_id: databaseInfo?.id,
            skill_ids: skill_ids
        };

        console.log(data)

        DatabaseAPI.post("/delete-skills/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getSkills();
            toast.success("スキルをデータベースから削除しました");
        })
            .catch((e) => toast.error("スキルの削除に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);


    return { getSkills, saveSkills, deleteSkills, loading, skills };
};
