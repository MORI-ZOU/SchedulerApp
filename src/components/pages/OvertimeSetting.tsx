import React, { FC, ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { useOvertimes } from '../hooks/useOvertimes';
import { toast } from 'react-toastify';
import { HexColor } from '../../types/HexColor';
import { Overtime } from '../../types/Overtime';
import { ColorEditor } from '../organisms/Editor/ColorEditor';
import { Icon } from "@iconify/react"

const defaultOvertime: Overtime = {
  id: "NewOvertime",
  color: new HexColor("0000ff"),
  overtime_hours: 1
}

export const OvertimeSetting: React.FC = () => {
  const { getOvertimes, saveOvertimes, deleteOvertimes, loading, overtimes } = useOvertimes();
  const [data, setData] = useState<Overtime[]>(overtimes);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstance = useRef<Tabulator | null>(null);

  useEffect(() => {
    console.log("Fetching shifts");
    getOvertimes();
  }, [getOvertimes]);

  useEffect(() => {
    console.log("Updating data state", overtimes);
    setData(overtimes);
  }, [overtimes]);

  useEffect(() => {
    if (tableRef.current) {
      tableInstance.current = new Tabulator(tableRef.current, {
        data: data,
        reactiveData: true,
        layout: "fitColumns",
        columns: [
          {
            title: 'ID',
            field: 'id',
            editor: 'input',
            validator: ['required', 'string'],
            sorter: 'string',
          },
          {
            title: '背景色',
            field: 'color',
            editor: ColorEditor,
            formatter: (cell) => {
              const value = cell.getValue()?.toString() || '#000000';
              return `<div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full" style="background-color: ${value}"></div>
                <span>${value}</span>
              </div>`;
            },
            sorter: (a, b) => {
              const aStr = a?.toString() || '';
              const bStr = b?.toString() || '';
              return aStr.localeCompare(bStr);
            },
          },
          {
            title: '残業時間',
            field: 'overtime_hours',
            editor: 'input',
            sorter: 'number',
            validator: ['required', 'numeric', 'min:0'],
            editorParams: {
              type: 'number',
              min: 0,
              step: 0.5
            },
            mutator: (value) => {
              // 文字列の場合は数値に変換
              const numValue = parseFloat(value);
              return isNaN(numValue) ? 0 : numValue;
            }
          },
          {
            title: '削除',
            formatter: function (cell) {
              return '<button class="delete-btn text-red-600 hover:text-red-900"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
            },
            cellClick: function (e, cell) {
              if ((e.target as HTMLElement).closest('.delete-btn')) {
                const row = cell.getRow();
                const id = row.getData().id;
                // 削除処理を実行
                deleteOvertimes([id]);
              }
            },
            headerSort: false,
            width: 100,
          },
        ],
        cellEdited: function (cell) {
          // セルが編集された時にデータを更新し、型変換を行う
          const updatedData = tableInstance.current?.getData() || [];
          const processedData = updatedData.map((row: any) => ({
            ...row,
            overtime_hours: typeof row.overtime_hours === 'string'
              ? parseFloat(row.overtime_hours) || 0
              : row.overtime_hours,
            color: typeof row.color === 'string'
              ? new HexColor(row.color)
              : row.color
          }));
          setData(processedData);
        }
      });
      return () => {
        if (tableInstance.current) {
          tableInstance.current.destroy();
        }
      };
    }
  }, [data]);

  const onClickAdd = () => {
    setData(prev => [...prev, { ...defaultOvertime, id: crypto.randomUUID() }]);
    toast.success("シフトを追加しました。内容を編集して「保存」ボタンで保存してください。");
  };

  const onClickSave = () => {
    // データの型変換と検証を行ってから保存
    const validatedData = data.map(overtime => ({
      ...overtime,
      overtime_hours: typeof overtime.overtime_hours === 'string'
        ? parseFloat(overtime.overtime_hours)
        : overtime.overtime_hours
    })).filter(overtime => {
      // 必須フィールドの検証
      if (!overtime.id || overtime.id.trim() === '') {
        toast.error(`IDが空の残業データがあります`);
        return false;
      }
      if (isNaN(overtime.overtime_hours) || overtime.overtime_hours < 0) {
        toast.error(`残業時間が無効です: ${overtime.id}`);
        return false;
      }
      return true;
    });

    if (validatedData.length !== data.length) {
      toast.error("無効なデータがあるため、保存できません");
      return;
    }

    console.log("保存前のデータ検証:", validatedData);
    saveOvertimes(validatedData);
    toast.success("残業情報を保存しました。");
  };

  return (
    <div className="px-10">
      <div className="mb-4">
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
        <div ref={tableRef}></div>
      </div>
      <div className="flex justify-end w-full px-4 py-4 gap-1">
        <button
          onClick={onClickAdd}
          className="flex  items-center text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
        >
          <Icon icon="material-symbols:add" className='mr-2' />
          追加
        </button>
        {/* <button
          onClick={onClickDelete}
          className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2"
        >
          選択項目を削除
        </button> */}
        <button
          onClick={onClickSave}
          className="flex items-center text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
        >
          <Icon icon="material-symbols:save" className='mr-2' />
          保存
        </button>
      </div>
    </div>
  );
};

// import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
// import ReactDataGrid from '@inovua/reactdatagrid-community';
// import '@inovua/reactdatagrid-community/index.css';
// import { useOvertimes } from '../hooks/useOvertimes';
// import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';
// import { toast } from 'react-toastify';
// import { HexColor } from '../../types/HexColor';
// import { HexColorEditor } from '../organisms/Editor/HexColorEditor';
// import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
// import { Overtime } from '../../types/Overtime';

// const gridStyle = { minHeight: 550 };

// const defaultOvertime: Overtime = {
//   id: "NewOvertime",
//   color: new HexColor("0000ff"),
//   overtime_hours: 1
// }

// const columns: TypeColumn[] = [
//   { name: 'id', header: 'ID', defaultFlex: 1, type: "string" },
//   {
//     name: 'color',
//     header: '背景色',
//     defaultFlex: 1,
//     type: "HexColor",
//     render: ({ value }: { value: HexColor }) => <div style={{ color: value.toString() }}>{value.toString()}</div>,
//     renderEditor: HexColorEditor
//   },
//   { name: 'overtime_hours', header: '残業時間', defaultFlex: 1, type: "string" },
// ];

// export const OvertimeSetting: React.FC = () => {
//   const { getOvertimes, saveOvertimes, deleteOvertimes, loading, overtimes } = useOvertimes();
//   const [data, setData] = useState(overtimes);
//   const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     getOvertimes();
//   }, []);

//   useEffect(() => {
//     setData(overtimes);
//   }, [overtimes]);

//   const handleCellEdit = useCallback((editInfo: TypeEditInfo) => {
//     const { value, columnId, rowIndex } = editInfo;
//     setData(prevData => {
//       const updatedData = [...prevData];
//       updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };
//       return updatedData;
//     });
//   }, []);

//   const onClickAdd = () => {
//     setData((prev) => {
//       const newData = [...prev, defaultOvertime];
//       console.log("addShift", newData)

//       return newData;
//     });

//     toast.success("シフトを追加しました。内容を編集して「保存」ボタンで保存してください。")
//     console.log("data", data)
//   }

//   const onClickSave = () => {
//     saveOvertimes(data)
//     toast.success("スキルを更新しました")
//   };

//   const onClickDelete = () => {
//     const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
//     deleteOvertimes(selectedIds)
//     console.log("Deleted Shifts:", selectedIds);
//   };

//   const handleSelectionChange = useCallback((arg: TypeOnSelectionChangeArg) => {
//     const selected: Record<string, boolean> = arg.selected as Record<string, boolean>;
//     console.log("selected", selected)
//     setSelectedRows(selected || {});
//   }, []);


//   return (
//     <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
//       <ReactDataGrid
//         idProperty="id"
//         columns={columns}
//         dataSource={data}
//         style={gridStyle}
//         loading={loading}
//         editable={true}
//         onEditComplete={handleCellEdit}
//         selected={selectedRows}
//         onSelectionChange={handleSelectionChange}
//       />
//       <div className="flex justify-end w-full px-12 py-4 gap-1">
//         <button
//           onClick={() => onClickAdd()}
//           className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
//         >
//           追加
//         </button>
//         <button
//           onClick={onClickDelete}
//           className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2"
//         >
//           選択項目を削除
//         </button>
//         <button
//           onClick={onClickSave}
//           className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
//         >
//           保存
//         </button>
//       </div>
//     </div>
//   );
// };