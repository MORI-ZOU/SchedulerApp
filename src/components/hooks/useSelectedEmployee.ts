import { useCallback, useState } from 'react';
import { Employee } from '../../types/Employee';
import { toast } from 'react-toastify';
import { DateOnly } from '../../types/DateOnly';

const defaultEmployee: Employee = {
    employee_detail: {
        id: '',
        name: '',
        max_overtime_hours_per_day: 0,
        max_overtime_hours_per_month: 0,
        work_days_per_cycle: 0,
        cycle_start_date: new DateOnly(2024, 9, 1),
        enable_prohibited_shift_transitions: true
    },
    valid_shift: [],
    valid_skill: []
};

type Props = {
    id: string;
    users: Array<Employee>;
    onOpen: () => void;
};

//選択したユーザー情報を特定し、モーダル表示するカスタムhook
export const useSelectEmployee = () => {
    const [selectedEmployee, setSelectedUser] = useState<Employee>(defaultEmployee);

    const onSelectEmployee = useCallback((props: Props) => {
        const { id, users, onOpen } = props;
        const targetUser = users.find((user) => user.employee_detail.id === id);

        if (!targetUser) {
            toast.error("ユーザーが見つかりません");
            return;
        }

        setSelectedUser(targetUser);
        onOpen();
    }, []);

    return { onSelectEmployee, selectedEmployee };
};
