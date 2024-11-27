import React, { useCallback, useEffect, useState, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { useSkills } from '../hooks/useSkills';
import { toast } from 'react-toastify';
import { HexColor } from '../../types/HexColor';
import { Skill } from '../../types/Skill';
import { ColorEditor } from '../organisms/Editor/ColorEditor';
import { Icon } from "@iconify/react"


const defaultSkill: Skill = {
  id: "NewSkill",
  name: "新しいスキル",
  color: new HexColor("0000ff")
}

export const SkillSetting: React.FC = () => {
  const { getSkills, saveSkills, deleteSkills, loading, skills } = useSkills();
  const [data, setData] = useState<Skill[]>(skills);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstance = useRef<Tabulator | null>(null);

  useEffect(() => {
    console.log("Fetching shifts");
    getSkills();
  }, [getSkills]);

  useEffect(() => {
    console.log("Updating data state", skills);
    setData(skills);
  }, [skills]);

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
            title: '削除',
            formatter: function (cell) {
              return '<button class="delete-btn text-red-600 hover:text-red-900"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
            },
            cellClick: function (e, cell) {
              if ((e.target as HTMLElement).closest('.delete-btn')) {
                const row = cell.getRow();
                const id = row.getData().id;
                toast.success(`スキル(id: ${id})を削除しました。`);
                deleteSkills([id]);
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
    setData(prev => [...prev, { ...defaultSkill, id: crypto.randomUUID() }]);
    toast.success("スキルを追加しました。内容を編集して「保存」ボタンで保存してください。");
  };

  const onClickSave = () => {
    saveSkills(data);
    toast.success("スキル情報を保存しました。");
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

// import React, { useCallback, useEffect, useState } from 'react';
// import ReactDataGrid from '@inovua/reactdatagrid-community';
// import '@inovua/reactdatagrid-community/index.css';
// import { useSkills } from '../hooks/useSkills';
// import { TypeColumn, TypeEditInfo } from '@inovua/reactdatagrid-community/types';
// import { toast } from 'react-toastify';
// import { HexColorEditor } from '../organisms/Editor/HexColorEditor';
// import { HexColor } from '../../types/HexColor';
// import { TypeOnSelectionChangeArg } from '@inovua/reactdatagrid-community/types/TypeDataGridProps';
// import { Skill } from '../../types/Skill';


// const gridStyle = { minHeight: 550 };

// const defaultSkill: Skill = {
//   id: "NewSkill",
//   name: "新しいスキル",
//   color: new HexColor("0000ff")
// }

// const columns: TypeColumn[] = [
//   { name: 'id', header: 'ID', defaultFlex: 1, type: "string" },
//   { name: 'name', header: '名前', defaultFlex: 1, type: "string" },
//   {
//     name: 'color',
//     header: '背景色',
//     defaultFlex: 1,
//     type: "HexColor",
//     render: ({ value }: { value: HexColor }) => <div style={{ color: value.toString() }}>{value.toString()}</div>,
//     renderEditor: HexColorEditor
//   },
// ];

// export const SkillSetting: React.FC = () => {
//   const { getSkills, saveSkills, deleteSkills, loading, skills } = useSkills();
//   const [data, setData] = useState(skills);
//   const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

//   useEffect(() => getSkills(), [getSkills]);
//   useEffect(() => setData(skills), [skills]);

//   const handleCellEdit = useCallback((editInfo: TypeEditInfo) => {
//     const { value, columnId, rowIndex } = editInfo;

//     setData(prevData => {
//       // Debugging output
//       console.log("Before Update:", JSON.stringify(prevData, null, 2));

//       const updatedData = [...prevData];
//       updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: value };

//       // Debugging output
//       console.log("After Update:", JSON.stringify(updatedData, null, 2));

//       return updatedData;
//     });
//   }, []);

//   const onClickSave = () => {
//     saveSkills(data)
//     console.log("Data saved:", data);
//   };

//   const onClickAdd = () => {
//     setData((prev) => {
//       const newData = [...prev];
//       newData.push(defaultSkill);
//       console.log("addSkill", newData)

//       return newData;
//     });

//     toast.success("スキルを追加しました。内容を編集して「保存」ボタンで保存してください。")
//     console.log("data", data)
//   }

//   const onClickDelete = () => {
//     const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
//     const delteSkill = skills.filter((val) => val.id == selectedIds[0])

//     if (delteSkill.length > 0) {
//       ////DBにIDがあれば削除
//       deleteSkills(selectedIds)
//     }
//     else {
//       ////DBにIDが無ければローカル情報を削除
//       setData((prev) => {
//         const updateValue = prev.filter((val) => val.id != selectedIds[0])
//         return updateValue;
//       })
//       toast.success(`スキル(id:${selectedIds[0]})を削除しました`)
//     }
//   }

//   const handleSelectionChange = useCallback((arg: TypeOnSelectionChangeArg) => {
//     const selected: Record<string, boolean> = arg.selected as Record<string, boolean>;
//     console.log("selected", selected)
//     setSelectedRows(selected || {});
//   }, []);

//   return (
//     <div className='px-10'>
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
//       <div className="flex justify-end w-full px-4 py-4 gap-1">
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
