// import React, { FC, ChangeEvent } from 'react';
// import { HexColor } from '../../../types/HexColor';


// export type HexColorEditorProps = {
//     value: HexColor;
//     onChange?: (value: HexColor) => void;
//     onComplete?: () => void;
// }

// export const HexColorEditor: FC<HexColorEditorProps> = ({ value, onChange, onComplete }) => {

//     return (
//         <input
//             type="color"
//             value={value.toString()}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(new HexColor(e.target.value))}
//             onBlur={onComplete}
//             className="inovua-reactdatagrid-editor"
//         />
//     )
// };

import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { CellComponent } from "tabulator-tables";
import ReactDOM from "react-dom/client";

export const HexColorEditor = function (
    cell: CellComponent,
    onRendered: Function,
    success: Function,
    cancel: Function,
    editorParams: any
) {
    const cellValue = cell.getValue() || "#ffffff"; // デフォルト色
    const [color, setColor] = useState(cellValue);

    // カスタムコンポーネントを使用するためのコンテナ要素を作成します。
    const editorDiv = document.createElement("div");
    editorDiv.style.display = "inline-block";
    editorDiv.style.position = "absolute";
    editorDiv.style.zIndex = "1000";

    onRendered(() => {
        document.body.appendChild(editorDiv);
        // DOMノード上にレンダーします。
        const root = ReactDOM.createRoot(editorDiv);
        root.render(<PickerContainer />);
    });

    // Reactでのコンテナコンポーネント
    const PickerContainer = () => {
        const handleColorChange = (newColor: any) => {
            setColor(newColor.hex);
        };

        const handleSave = () => {
            success(color);
            document.body.removeChild(editorDiv);
        };

        const handleCancel = () => {
            cancel();
            document.body.removeChild(editorDiv);
        };

        return (
            <div>
                <ChromePicker color={color} onChangeComplete={handleColorChange} />
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        );
    };

    return editorDiv;
};