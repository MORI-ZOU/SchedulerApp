import React, { useEffect } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import { format } from 'date-fns';
import '@inovua/reactdatagrid-community/index.css';
import { ShiftType } from '../../types/ShiftType';
import { useShifts } from '../hooks/useShifts';

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

export const ShiftSetting: React.FC = () => {
  const { getShifts, loading, shifts } = useShifts();

  useEffect(() => getShifts(), []);

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
