import { FC, ReactNode } from "react";
import { Time } from "../../../types/Time";

type EditorProps = {
    value: any;
    onChange?: (value: any) => void;
    onComplete?: () => void;
}

// Editor for time inputs
export const TimeEditor: FC<EditorProps> = (props): ReactNode => {
    const { value, onChange, onComplete } = props
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Time.fromString(e.target.value);
        onChange && onChange(newTime);
    };
    return (
        <input
            type="Time"
            value={value.toString().substring(0, 5)}
            onChange={handleInputChange}
            onBlur={onComplete}
            className="inovua-reactdatagrid-editor"
        />)
};