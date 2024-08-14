import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { useOvertimes } from '../hooks/useOvertimes';
import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import { toast } from 'react-toastify';
import { HexColor } from '../../types/HexColor';
import { HexColorEditor } from '../organisms/Editor/HexColorEditor';

// 正しいパスを指定してください

const gridStyle = { minHeight: 550 };

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
  const { getOvertimes, setOvertimes, loading, overtimes } = useOvertimes();
  const [data, setData] = useState(overtimes);

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

  const onClickSave = () => {
    setOvertimes(data)
    toast.success("スキルを更新しました")
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