import React, { useCallback, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { useSkills } from '../hooks/useSkills';
import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import { toast } from 'react-toastify';
import { HexColorEditor } from '../organisms/Editor/HexColorEditor';
import { HexColor } from '../../types/HexColor';
import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
import { Skill } from '../../types/Skill';


const gridStyle = { minHeight: 550 };

const defaultSkill: Skill = {
  id: "NewShift",
  name: "新しいシフト",
  color: new HexColor("0000ff")
}

const columns: TypeColumn[] = [
  { name: 'id', header: 'ID', defaultFlex: 1, type: "string" },
  { name: 'name', header: '名前', defaultFlex: 1, type: "string" },
  {
    name: 'color',
    header: '背景色',
    defaultFlex: 1,
    type: "HexColor",
    render: ({ value }: { value: HexColor }) => <div style={{ color: value.toString() }}>{value.toString()}</div>,
    renderEditor: HexColorEditor
  },
];

export const SkillSetting: React.FC = () => {
  const { getSkills, saveSkills, deleteSkills, loading, skills } = useSkills();
  const [data, setData] = useState(skills);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  useEffect(() => getSkills(), [getSkills]);
  useEffect(() => setData(skills), [skills]);

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
    saveSkills(data)
    console.log("Data saved:", data);
  };

  const onClickAdd = () => {
    setData((prev) => {
      const newData = [...prev];
      newData.push(defaultSkill);
      console.log("addSkill", newData)

      return newData;
    });

    toast.success("スキルを追加しました。内容を編集して「保存」ボタンで保存してください。")
    console.log("data", data)
  }

  const onClickDelete = () => {
    const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
    deleteSkills(selectedIds)
    console.log("Deleted Shifts:", selectedIds);
  }

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
