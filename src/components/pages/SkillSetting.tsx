import React, { useEffect } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { Skill } from '../../types/Skill';
import { useSkills } from '../hooks/useSkills';


const gridStyle = { minHeight: 550 };

const columns = [
  { name: 'id', header: 'ID', defaultFlex: 1 },
  { name: 'name', header: '名前', defaultFlex: 1 },
  { name: 'color', header: '背景色', defaultFlex: 1 },
];

export const SkillSetting: React.FC = () => {
  const { getSkills, loading, shifts } = useSkills();

  useEffect(() => getSkills(), []);

  return (
    <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <ReactDataGrid
        idProperty="id"
        columns={columns}
        dataSource={shifts}
        style={gridStyle}
        loading={loading}
      />
    </div>
  );
};
