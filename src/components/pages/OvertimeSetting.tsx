import React, { useEffect } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { Overtime } from '../../types/Overtime';
import { useOvertimes } from '../hooks/useOvertimes';


const gridStyle = { minHeight: 550 };

const columns = [
  { name: 'id', header: 'ID', defaultFlex: 1 },
  { name: 'color', header: '背景色', defaultFlex: 1 },
  { name: 'overtime_hours', header: '残業時間', defaultFlex: 1 },
];

export const OvertimeSetting: React.FC = () => {
  const { getOvertimes, loading, overtimes } = useOvertimes();

  useEffect(() => getOvertimes(), []);

  return (
    <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
      <ReactDataGrid
        idProperty="id"
        columns={columns}
        dataSource={overtimes}
        style={gridStyle}
        loading={loading}
      />
    </div>
  );
};
