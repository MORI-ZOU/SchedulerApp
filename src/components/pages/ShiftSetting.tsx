import React, { ChangeEvent, ChangeEventHandler, FC, FocusEventHandler, InputHTMLAttributes, ReactNode, useCallback, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { useShifts } from '../hooks/useShifts';
import { Time } from '../../types/Time';
import { ShiftType } from '../../types/ShiftType';
import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import { toast } from 'react-toastify';
import { TimeEditor } from '../organisms/Editor/TimeEditor';
import { TextEditor } from '../organisms/Editor/TextEditor';
import { HexColor } from '../../types/HexColor';
import { HexColorEditor } from '../organisms/Editor/HexColorEditor';

const gridStyle = { minHeight: 550 };

const columns: TypeColumn[] = [
  { name: 'id', header: 'ID', defaultFlex: 1, editable: true, renderEditor: TextEditor, type: "string" },
  { name: 'name', header: '名前', defaultFlex: 1, editable: true, renderEditor: TextEditor, type: "string" },
  {
    name: 'color',
    header: '背景色',
    defaultFlex: 1,
    type: "HexColor",
    render: ({ value }: { value: HexColor }) => <div style={{ color: value.toString() }}>{value.toString()}</div>,
    renderEditor: HexColorEditor,
  },
  {
    name: 'startTime',
    header: '開始時間',
    defaultFlex: 1,
    render: ({ value }: { value: Time }) => value.toString(),
    renderEditor: TimeEditor,
    type: "Time"
  },
  {
    name: 'endTime',
    header: '終了時間',
    defaultFlex: 1,
    render: ({ value }: { value: Time }) => value.toString(),
    renderEditor: TimeEditor,
    type: "Time"
  },
];


export const ShiftSetting: React.FC = () => {
  const { getShifts, setShifts, loading, shifts } = useShifts();
  const [data, setData] = useState<ShiftType[]>(shifts);

  useEffect(() => getShifts(), [getShifts]);
  useEffect(() => setData(shifts), [shifts]);

  const handleCellEdit = useCallback((editInfo: TypeEditInfo) => {
    const { value, columnId, rowIndex } = editInfo;

    setData(prevData => {
      // Debugging output
      console.log("Before Update:", JSON.stringify(prevData, null, 2));

      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };

      // Debugging output
      console.log("After Update:", JSON.stringify(updatedData, null, 2));

      return updatedData;
    });
  }, []);

  const onClickSave = () => {
    setShifts(data)
    toast.success("シフトを更新しました")

    console.log("Data saved:", data);
  };

  return (
    <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <ReactDataGrid
        idProperty="id"
        columns={columns}
        dataSource={data}
        style={gridStyle}
        loading={loading}
        editable={true}
        onEditComplete={handleCellEdit}
      />
      <div className="flex justify-end w-full px-12 py-4">
        <button
          onClick={onClickSave}
          className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
        >
          保存
        </button>
      </div>
    </div>
  );
};