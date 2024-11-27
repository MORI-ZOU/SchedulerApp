import React, { useEffect, useState, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { useShifts } from '../hooks/useShifts';
import { ShiftType } from '../../types/ShiftType';
import { Time } from '../../types/Time';
import { HexColor } from '../../types/HexColor';
import { toast } from 'react-toastify';
import { Icon } from "@iconify/react"
import { ColorEditor } from '../organisms/Editor/ColorEditor';
import { TimeEditor } from '../organisms/Editor/TimeEditor';

const defaultShift: ShiftType = {
  id: "NewShift",
  name: "新しいシフト",
  startTime: new Time(0, 0, 0),
  endTime: new Time(12, 0, 0),
  color: new HexColor("0000ff")
};

export const ShiftSetting: React.FC = () => {
  const { getShifts, saveShifts, deleteShifts, loading, shifts } = useShifts();
  const [data, setData] = useState<ShiftType[]>(shifts);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstance = useRef<Tabulator | null>(null);

  useEffect(() => {
    console.log("Fetching shifts");
    getShifts();
  }, [getShifts]);

  useEffect(() => {
    console.log("Updating data state", shifts);
    setData(shifts);
  }, [shifts]);

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
            title: '名前',
            field: 'name',
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
            title: '開始時間',
            field: 'startTime',
            editor: TimeEditor,
            formatter: (cell) => cell.getValue()?.toString().substring(0, 5) || '',
            sorter: (a, b) => {
              const aTime = a?.toString() || '00:00';
              const bTime = b?.toString() || '00:00';
              return aTime.localeCompare(bTime);
            },
          },
          {
            title: '終了時間',
            field: 'endTime',
            editor: TimeEditor,
            formatter: (cell) => cell.getValue()?.toString().substring(0, 5) || '',
            sorter: (a, b) => {
              const aTime = a?.toString() || '00:00';
              const bTime = b?.toString() || '00:00';
              return aTime.localeCompare(bTime);
            },
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
                toast.success(`シフト(id: ${id})を削除しました。`);
                deleteShifts([id]);
                row.delete();
              }
            },
            headerSort: false,
            width: 100,
          },
        ],
      });
      return () => {
        if (tableInstance.current) {
          tableInstance.current.destroy();
        }
      };
    }
  }, [data]);





  const onClickAdd = () => {
    setData(prev => [...prev, { ...defaultShift, id: crypto.randomUUID() }]);
    toast.success("シフトを追加しました。内容を編集して「保存」ボタンで保存してください。");
  };

  const onClickSave = () => {
    saveShifts(data);
    toast.success("シフト情報を保存しました。");
  };

  // const onClickDelete = () => {
  //   if (selectedRows.length === 0) {
  //     toast.warning("削除する項目を選択してください。");
  //     return;
  //   }
  //   deleteShifts(selectedRows);
  //   setData(prev => prev.filter(shift => !selectedRows.includes(shift.id)));
  //   setSelectedRows([]);
  //   toast.success(`シフト(id: ${selectedRows.join(", ")})を削除しました。`);
  // };

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

// import React, { useEffect, useState, useRef } from 'react';
// import { useShifts } from '../hooks/useShifts';
// import { Time } from '../../types/Time';
// import { ShiftType } from '../../types/ShiftType';
// import { toast } from 'react-toastify';
// import 'tabulator-tables/dist/css/tabulator.min.css';
// import { TabulatorFull as Tabulator, Editor, ColumnDefinition, CellComponent } from 'tabulator-tables';
// import { HexColor } from '../../types/HexColor';
// import { timeEditor } from '../organisms/Editor/TimeEditor';
// import { ColorEditor } from '../organisms/Editor/ColorEditor';

// const defaultShift: ShiftType = {
//   id: "NewShift",
//   name: "新しいシフト",
//   startTime: new Time(0, 0, 0),
//   endTime: new Time(12, 0, 0),
//   color: new HexColor("0000ff")
// };

// export const ShiftSetting: React.FC = () => {
//   const { getShifts, saveShifts, deleteShifts, loading, shifts } = useShifts();
//   const [data, setData] = useState<ShiftType[]>(shifts);
//   const [selectedRows, setSelectedRows] = useState<string[]>([]);
//   const tableRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     console.log("Fetching shifts");
//     getShifts();
//   }, [getShifts]);

//   useEffect(() => {
//     console.log("Updating data state", shifts);
//     setData(shifts);
//   }, [shifts]);

//   const columns: ColumnDefinition[] = [
//     { title: 'ID', field: 'id', editor: 'input' as Editor },
//     { title: '名前', field: 'name', editor: 'input' as Editor },
//     {
//       title: '背景色',
//       field: 'color',
//       editor: ColorEditor,
//     },
//     {
//       title: '開始時間',
//       field: 'startTime',
//       editor: timeEditor,
//     },
//     {
//       title: '終了時間',
//       field: 'endTime',
//       editor: timeEditor,
//     }
//   ];

//   useEffect(() => {
//     if (tableRef.current) {
//       console.log("Initializing Tabulator with data", data);

//       const table = new Tabulator(tableRef.current, {
//         data: data,
//         columns: columns,
//         layout: "fitColumns",
//         pagination: true,
//         paginationSize: 10,
//         movableColumns: true,
//         reactiveData: true,
//         height: 550,
//         selectableRows: 1,
//       });

//       table.on("cellEdited", (cell: CellComponent) => {
//         console.log("Cell edited:", cell);
//         const updatedData = cell.getData();
//         const columnId = cell.getField();
//         const newValue = cell.getValue();
//         const rowIndex = cell.getRow().getPosition();

//         console.log(`Updating row ${rowIndex}, column ${columnId} with value ${newValue}`);
//         setData(prevData => {
//           const updatedShift = { ...prevData[rowIndex], [columnId]: newValue };
//           return prevData.map((shift, index) => (index === rowIndex ? updatedShift : shift));
//         });
//       });

//       table.on("rowSelectionChanged", (data: any, rows: any) => {
//         console.log("Selected rows:", rows.map((row: any) => row.getData().id));
//         setSelectedRows(rows.map((row: any) => row.getData().id));
//       });

//       // クリーンアップ：テーブルを破棄
//       return () => {
//         table.destroy();
//       };
//     }
//   }, [columns, data]); // 依存配列の見直し

//   const onClickAdd = () => {
//     setData((prev) => [...prev, defaultShift]);
//     toast.success("シフトを追加しました。内容を編集して「保存」ボタンで保存してください。");
//   };

//   const onClickSave = () => {
//     saveShifts(data);
//     toast.success("シフト情報を保存しました。");
//   };

//   const onClickDelete = () => {
//     deleteShifts(selectedRows);
//     setData((prev) => prev.filter((val) => !selectedRows.includes(val.id)));
//     setSelectedRows([]);
//     toast.success(`シフト(id: ${selectedRows.join(", ")})を削除しました。`);
//   };

//   return (
//     <div className='px-10'>
//       <div className="scrollable-table" ref={tableRef}></div>
//       <div className="flex justify-end w-full px-4 py-4 gap-1">
//         <button
//           onClick={onClickAdd}
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

