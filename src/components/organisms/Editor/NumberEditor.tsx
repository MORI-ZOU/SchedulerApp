import { ChangeEvent, FC, ReactNode } from "react";

type EditorProps = {
    value: any;
    onChange?: (value: any) => void;
    onComplete?: () => void;
}

// Editor for general text inputs
export const NumberEditor: FC<EditorProps> = (props): ReactNode => {
    const { value, onChange, onComplete } = props

    return (
        <input
            type="Number"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
            onBlur={onComplete}
            className="inovua-reactdatagrid-editor"
        />
    )
};