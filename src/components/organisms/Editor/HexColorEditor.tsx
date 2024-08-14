import React, { FC, ChangeEvent } from 'react';
import { HexColor } from '../../../types/HexColor';


export type HexColorEditorProps = {
    value: HexColor;
    onChange?: (value: HexColor) => void;
    onComplete?: () => void;
}

export const HexColorEditor: FC<HexColorEditorProps> = ({ value, onChange, onComplete }) => {

    return (
        <input
            type="color"
            value={value.toString()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(new HexColor(e.target.value))}
            onBlur={onComplete}
            className="inovua-reactdatagrid-editor"
        />
    )
};

