// import { FC, ReactNode } from "react";
// import { Time } from "../../../types/Time";


// type EditorProps = {
//     value: any;
//     onChange?: (value: any) => void;
//     onComplete?: () => void;
// }

// // Editor for time inputs
// export const TimeEditor: FC<EditorProps> = (props): ReactNode => {
//     const { value, onChange, onComplete } = props
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newTime = Time.fromString(e.target.value);
//         onChange && onChange(newTime);
//     };
//     return (
//         <input
//             type="Time"
//             value={value.toString().substring(0, 5)}
//             onChange={handleInputChange}
//             onBlur={onComplete}
//             className="inovua-reactdatagrid-editor"
//         />)
// };

// 時間エディタの設定
import { CellComponent, EmptyCallback, ValueBooleanCallback, ValueVoidCallback } from 'tabulator-tables';
import { Time } from "../../../types/Time";

export const TimeEditor = (cell: any, onRendered: any, success: any, cancel: any) => {
    const input = document.createElement('input');
    input.type = 'time';
    input.className = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

    const value = cell.getValue();
    input.value = value ? value.toString().substring(0, 5) : '00:00';

    const updateTime = () => {
        try {
            const time = Time.fromString(input.value);
            success(time);
        } catch (error) {
            cancel();
        }
    };

    input.addEventListener('blur', updateTime);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateTime();
        }
        if (e.key === 'Escape') {
            cancel();
        }
    });

    return input;
};