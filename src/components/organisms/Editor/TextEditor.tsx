import { ChangeEvent, FC, ReactNode } from "react";

type EditorProps = {
    value: any;
    onChange?: (value: any) => void;
    onComplete?: () => void;
}

// Editor for general text inputs
export const TextEditor: FC<EditorProps> = (props): ReactNode => {
    const { value, onChange, onComplete } = props

    return (
        <input
            type="text"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
            onBlur={onComplete}
            className="inovua-reactdatagrid-editor"
        />
    )
};