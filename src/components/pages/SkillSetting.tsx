import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { Skill } from '../../types/Skill';


const gridStyle = { minHeight: 550 };

const columns = [
  { name: 'id', header: 'ID', defaultFlex: 1 },
  { name: 'name', header: '名前', defaultFlex: 1 },
  { name: 'color', header: '背景色', defaultFlex: 1 },
];

const dataSource: Array<Skill> = [
  {
    id: '1',
    name: 'ランニング',
    color: '#FF5733',
  },
  {
    id: '2',
    name: '段取りA',
    color: '#33FF57',
  },
  {
    id: '3',
    name: '段取りB',
    color: '#3357FF',
  },
];

export const SkillSetting: React.FC = () => {
  return (
    <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <ReactDataGrid
        idProperty="id"
        columns={columns}
        dataSource={dataSource}
        style={gridStyle}
      />
    </div>
  );
};
