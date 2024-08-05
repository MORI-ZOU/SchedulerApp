import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { Overtime } from '../../types/Overtime';


const gridStyle = { minHeight: 550 };

const columns = [
  { name: 'id', header: 'ID', defaultFlex: 1 },
  { name: 'color', header: '背景色', defaultFlex: 1 },
  { name: 'overtime_hours', header: '残業時間', defaultFlex: 1 },
];

const dataSource: Array<Overtime> = [
  {
    id: '1',
    color: '#FF5733',
    overtime_hours:1
  },
  {
    id: '2',
    color: '#33FF57',
    overtime_hours:2
  },
  {
    id: '3',
    color: '#3357FF',
    overtime_hours:4
  },
];

export const OvertimeSetting: React.FC = () => {
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
