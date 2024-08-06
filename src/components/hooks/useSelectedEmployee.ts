import { useCallback, useState } from 'react';
import { Employee } from '../../types/Employee';


type Props = {
    id: string;
    users: Array<Employee>;
    onOpen: () => void;
};

//選択したユーザー情報を特定し、モーダル表示するカスタムhook
export const useSelectEmployee = () => {
    const [selectedEmployee, setSelectedUser] = useState<Employee | null>(null);

    const onSelectEmployee = useCallback((props: Props) => {
        const { id, users, onOpen } = props;
        const targetUser = users.find((user) => user.employee_detail.id === id);
        setSelectedUser(targetUser ?? null);
        onOpen();
    }, []);

    return { onSelectEmployee, selectedEmployee };
};
