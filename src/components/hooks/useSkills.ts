import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Skill } from '../../types/Skill';
import { HexColor } from '../../types/HexColor';

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
