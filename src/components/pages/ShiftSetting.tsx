import React, { ChangeEventHandler, FC, FocusEventHandler, InputHTMLAttributes, ReactNode, useCallback, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import NumericEditor from '@inovua/reactdatagrid-community/Time'
import SelectEditor from '@inovua/reactdatagrid-community/SelectEditor'

import { useShifts } from '../hooks/useShifts';
import { Time } from '../../types/Time';
import { ShiftType } from '../../types/ShiftType';
import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';

const gridStyle = { minHeight: 550 };

type EditorProps = {
  value: any;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onComplete?: FocusEventHandler<HTMLInputElement>;
}

// Editor for general text inputs
const TextEditor: FC<EditorProps> = (props): ReactNode => {
  const { value, onChange, onComplete } = props

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange ?? (e.target.value)}
      onBlur={onComplete}
      className="inovua-reactdatagrid-editor"
    />
  )
};

// Editor for time inputs
const TimeEditor: FC<EditorProps> = (props): ReactNode => {
  const { value, onChange, onComplete } = props
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Time.fromString(e.target.value);
    onChange ?? (newTime);
  };
  return (
    <input
      type="time"
      value={value.toString().substring(0, 5)}
      onChange={handleInputChange}
      onBlur={onComplete}
      className="inovua-reactdatagrid-editor"
    />)
};

const columns: TypeColumn[] = [
  { name: 'id', header: 'ID', defaultFlex: 1, type: "string", editor: TextEditor },
  { name: 'name', header: '名前', defaultFlex: 1, type: "string", editor: TextEditor },
  { name: 'color', header: '背景色', defaultFlex: 1, type: "string", editor: TextEditor },
  {
    name: 'startTime',
    header: '開始時間',
    defaultFlex: 1,
    render: ({ value }: { value: Time }) => value.toString(),
    editor: TimeEditor
  },
  {
    name: 'endTime',
    header: '終了時間',
    defaultFlex: 1,
    render: ({ value }: { value: Time }) => value.toString(),
    editor: TimeEditor
  },
];


export const ShiftSetting: React.FC = () => {
  const { getShifts, loading, shifts } = useShifts();
  const [data, setData] = useState<ShiftType[]>(shifts);

  useEffect(() => getShifts(), [getShifts]);
  useEffect(() => setData(shifts), [shifts])

  const handleCellEdit = useCallback((editInfo: TypeEditInfo) => {
    const { value, rowId, columnId } = editInfo;

    const updatedData = [...data];
    data[rowId] = Object.assign({}, data[rowId], { [columnId]: value })

    setData(updatedData);
  }, [data]);

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
    </div>
  );
};