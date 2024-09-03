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
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';

const gridStyle = { minHeight: 550 };

const defaultShift: ShiftType = {
  id: "NewShift",
  name: "新しいシフト",
  startTime: new Time(0, 0, 0),
  endTime: new Time(12, 0, 0),
  color: new HexColor("0000ff")
}

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
  const { getShifts, saveShifts, deleteShifts, loading, shifts } = useShifts();
  const [data, setData] = useState<ShiftType[]>(shifts);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

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

  const onClickAdd = () => {
    setData((prev) => {
      const newData = [...prev];
      newData.push(defaultShift);
      console.log("addShift", newData)

      return newData;
    });

    toast.success("シフトを追加しました。内容を編集して「保存」ボタンで保存してください。")
    console.log("data", data)
  }

  const onClickSave = () => {
    saveShifts(data)
    console.log("Data saved:", data);
  };

  const onClickDelete = () => {
    const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
    const shift = shifts.filter((val) => val.id == selectedIds[0])

    if (shift.length > 0) {
      deleteShifts(selectedIds)
    }
    else {
      setData((prev) => {
        return prev.filter((val) => val.id != selectedIds[0])
      })
      toast.success(`シフト(id:${selectedIds[0]})を削除しました`);
    }

    console.log("Deleted Shifts:", selectedIds);
  };

  const handleSelectionChange = useCallback((arg: TypeOnSelectionChangeArg) => {
    const selected: Record<string, boolean> = arg.selected as Record<string, boolean>;
    console.log("selected", selected)
    setSelectedRows(selected || {});
  }, []);

  return (
    <div className='px-10'>
      <ReactDataGrid
        idProperty="id"
        columns={columns}
        dataSource={data}
        style={gridStyle}
        loading={loading}
        editable={true}
        onEditComplete={handleCellEdit}
        selected={selectedRows}
        onSelectionChange={handleSelectionChange}
      />
      <div className="flex justify-end w-full px-4 py-4 gap-1">
        <button
          onClick={() => onClickAdd()}
          className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
        >
          追加
        </button>
        <button
          onClick={onClickDelete}
          className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2"
        >
          選択項目を削除
        </button>
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