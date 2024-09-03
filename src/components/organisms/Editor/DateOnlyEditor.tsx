import { FC, ReactNode } from "react";
import { DateOnly } from "../../../types/DateOnly";

type EditorProps = {
    value: any;
    onChange?: (value: any) => void;
    onComplete?: () => void;
}

export const DateOnlyEditor: FC<EditorProps> = (props): ReactNode => {
    const { value, onChange, onComplete } = props
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = DateOnly.fromString(e.target.value);
        onChange && onChange(newTime);
    };
    return (
        <input
            type="DateOnly"
            value={value.toString()}
            onChange={handleInputChange}
            onBlur={onComplete}
            className="inovua-reactdatagrid-editor"
        />)
}