import React, { useCallback, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { useSkills } from '../hooks/useSkills';
import { TypeEditInfo } from '@inovua/reactdatagrid-community/types';
import { toast } from 'react-toastify';


const gridStyle = { minHeight: 550 };

const columns = [
  { name: 'id', header: 'ID', defaultFlex: 1, type: "string" },
  { name: 'name', header: '名前', defaultFlex: 1, type: "string" },
  { name: 'color', header: '背景色', defaultFlex: 1, type: "string" },
];

export const SkillSetting: React.FC = () => {
  const { getSkills, setSkills, loading, skills } = useSkills();
  const [data, setData] = useState(skills);

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
    setSkills(data)
    toast.success("スキルを更新しました")

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
