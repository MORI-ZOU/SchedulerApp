import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { format } from 'date-fns';
import '@inovua/reactdatagrid-community/index.css';
import { ShiftType } from '../../types/ShiftType';

const gridStyle = { minHeight: 550 };

const columns = [
  { name: 'id', header: 'ID', defaultFlex: 1 },
  { name: 'name', header: '名前', defaultFlex: 1 },
  { name: 'color', header: '背景色', defaultFlex: 1 },
  {
    name: 'startTime',
    header: '開始時間',
    defaultFlex: 1,
    render: ({ value }: { value: Date }) =>
      format(value, 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    name: 'endTime',
    header: '終了時間',
    defaultFlex: 1,
    render: ({ value }: { value: Date }) =>
      format(value, 'yyyy-MM-dd HH:mm:ss'),
  },
];

const dataSource: Array<ShiftType> = [
  {
    id: '1',
    name: '日勤',
    color: '#FF5733',
    startTime: new Date(2023, 9, 10, 8, 0),
    endTime: new Date(2023, 9, 10, 16, 0),
  },
  {
    id: '2',
    name: '夜勤',
    color: '#33FF57',
    startTime: new Date(2023, 9, 10, 14, 0),
    endTime: new Date(2023, 9, 10, 22, 0),
  },
  {
    id: '3',
    name: '時差',
    color: '#3357FF',
    startTime: new Date(2023, 9, 10, 22, 0),
    endTime: new Date(2023, 9, 11, 6, 0),
  },
];

export const ShiftSetting: React.FC = () => {
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
