// // 時間エディタの設定
// import { CellComponent, EmptyCallback, ValueBooleanCallback, ValueVoidCallback } from 'tabulator-tables';
// import { HexColor } from "../../../types/HexColor";

// // カスタム時間エディタ関数の修正
// export const ColorEditor = (cell: CellComponent, onRendered: EmptyCallback, success: ValueBooleanCallback, cancel: ValueVoidCallback, editorParams: {}) => {
//     const color = cell.getValue() || "#000ff";
//     const editor = document.createElement('input');
//     editor.setAttribute('type', 'HexColor');
//     editor.style.width = '100%';
//     editor.value = color;

//     // onRenderedに関数を渡してフォーカス設定
//     onRendered(() => {
//         editor.focus();
//     });

//     const updateValue = () => {
//         const value = editor.value;
//         console.log("colorselected:", value);

//         if (HexColor.isValidHex(value)) { // 文字列が有効であることを確認
//             success(value); // 必要に応じてフォーマット
//         } else {
//             cancel(value); // 有効なhex形式でない場合は編集をキャンセルする
//         }
//     };

//     editor.addEventListener('change', updateValue);
//     editor.addEventListener('blur', updateValue);

//     return editor;
// };



import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChromePicker, ColorResult } from 'react-color';
import { CellComponent, EmptyCallback, ValueBooleanCallback, ValueVoidCallback } from 'tabulator-tables';
import { HexColor } from '../../../types/HexColor';

export const ColorEditor = (cell: any, onRendered: any, success: any, cancel: any) => {
    const container = document.createElement('div');
    container.className = 'flex items-center gap-2 p-2';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'w-10 h-10 p-1 rounded-md cursor-pointer';
    colorPicker.value = cell.getValue()?.toString() || '#000000';

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'px-3 py-2 border rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500';
    hexInput.value = cell.getValue()?.toString() || '#000000';

    const updateColor = (value: string) => {
        try {
            const color = new HexColor(value);
            success(color);
        } catch (error) {
            cancel();
        }
    };

    colorPicker.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        updateColor(target.value);
    });

    hexInput.addEventListener('blur', (e) => {
        const target = e.target as HTMLInputElement;
        updateColor(target.value);
    });

    hexInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateColor((e.target as HTMLInputElement).value);
        }
        if (e.key === 'Escape') {
            cancel();
        }
    });

    container.appendChild(colorPicker);
    container.appendChild(hexInput);

    return container;
};