import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { useOvertimes } from '../hooks/useOvertimes';
import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import { toast } from 'react-toastify';
import { HexColor } from '../../types/HexColor';
import { HexColorEditor } from '../organisms/Editor/HexColorEditor';
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import { Overtime } from '../../types/Overtime';

const gridStyle = { minHeight: 550 };

const defaultOvertime: Overtime = {
  id: "NewOvertime",
  color: new HexColor("0000ff"),
  overtime_hours: 1
}

const columns: TypeColumn[] = [
  { name: 'id', header: 'ID', defaultFlex: 1, type: "string" },
  {
    name: 'color',
    header: '背景色',
    defaultFlex: 1,
    type: "HexColor",
    render: ({ value }: { value: HexColor }) => <div style={{ color: value.toString() }}>{value.toString()}</div>,
    renderEditor: HexColorEditor
  },
  { name: 'overtime_hours', header: '残業時間', defaultFlex: 1, type: "string" },
];

export const OvertimeSetting: React.FC = () => {
  const { getOvertimes, saveOvertimes, deleteOvertimes, loading, overtimes } = useOvertimes();
  const [data, setData] = useState(overtimes);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getOvertimes();
  }, []);

  useEffect(() => {
    setData(overtimes);
  }, [overtimes]);

  const handleCellEdit = useCallback((editInfo: TypeEditInfo) => {
    const { value, columnId, rowIndex } = editInfo;
    setData(prevData => {
      const updatedData = [...prevData];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
      return updatedData;
    });
  }, []);

  const onClickAdd = () => {
    setData((prev) => {
      const newData = [...prev, defaultOvertime];
      console.log("addShift", newData)

      return newData;
    });

    toast.success("シフトを追加しました。内容を編集して「保存」ボタンで保存してください。")
    console.log("data", data)
  }

  const onClickSave = () => {
    saveOvertimes(data)
    toast.success("スキルを更新しました")
  };

  const onClickDelete = () => {
    const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
    deleteOvertimes(selectedIds)
    console.log("Deleted Shifts:", selectedIds);
  };

  const handleSelectionChange = useCallback((arg: TypeOnSelectionChangeArg) => {
    const selected: Record<string, boolean> = arg.selected as Record<string, boolean>;
    console.log("selected", selected)
    setSelectedRows(selected || {});
  }, []);


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
        selected={selectedRows}
        onSelectionChange={handleSelectionChange}
      />
      <div className="flex justify-end w-full px-12 py-4 gap-1">
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