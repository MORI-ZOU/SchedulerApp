import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Skill } from '../../types/Skill';

const dataSource: Array<Skill> = [
    {
        id: "a",
        name: "TaskA",
        color: "#fff",
    },
    {
        id: "b",
        name: "TaskB",
        color: "#fff",
    },
    {
        id: "c",
        name: "TaskC",
        color: "#fff",
    },
];

export const useSkills = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<Array<Skill>>([]);

    const getSkills = useCallback(() => {
        try {
            setLoading(true);

            setSkills(dataSource)

            ////DB処理を後で記述
            toast.success("スキル種類データを取得しました")
        } catch (e) {
            toast.error("スキル種類データ取得に失敗しました");
        }
        finally {
            setLoading(false)
        }
    }, []);

    return { getSkills, setSkills, loading, skills };
};
