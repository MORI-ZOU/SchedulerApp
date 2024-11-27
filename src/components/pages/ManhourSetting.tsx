import React, { useCallback, useEffect, useState, useRef } from "react";
import { useManhours } from "../hooks/useManhours";
import { Manhour } from "../../types/Manhour";
import { DateRangePicker } from "../organisms/DateRangePicker";
import { DateOnly } from "../../types/DateOnly";
import { useDate } from "../hooks/useDates";
import { toast } from "react-toastify";
import 'tabulator-tables/dist/css/tabulator.min.css';
import { TabulatorFull as Tabulator, RangeComponent, RowComponent, Editor, ColumnDefinition, CellComponent, ColumnComponent } from "tabulator-tables";

type TransformedRow = {
    id: string;
    skill: string;
    shift: string;
    [date: string]: any; // 動的な日付フィールド
};

type ManhourData = {
    skill: string;
    shift: string;
    [key: string]: string; // その他のフィールド、日付などを追加可能
};

export const ManhourSetting: React.FC = () => {
    const { getManhours, manhours, saveManhours, loading: manhourLoading } = useManhours();
    const { getDates, dates, saveDates, deleteDates, loading: datesLoading } = useDate();
    const [localManhours, setLocalManhours] = useState<Array<Manhour>>([]);
    const [startDate, setStartDate] = useState<DateOnly>(dates[0]);
    const [endDate, setEndDate] = useState<DateOnly>(dates[dates.length - 1]);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getDates();
    }, [getDates]);

    useEffect(() => {
        getManhours();
    }, [getManhours, dates]);

    useEffect(() => {
        if (manhours) {
            setLocalManhours(manhours);
        }
    }, [manhours]);

    useEffect(() => {
        if (dates.length > 0) {
            setStartDate(dates[0]);
            setEndDate(dates[dates.length - 1]);
        }
    }, [dates]);

    useEffect(() => {
        if (!tableRef.current) return;
        const rowData = transformData(manhours);
        const columns = [
            {
                title: "スキル",
                field: "skill",
                frozen: true,
                clipboard: false,
                headerSort: false,
                rangeSelection: false
            },
            {
                title: "シフト",
                field: "shift",
                frozen: true,
                clipboard: false,
                headerSort: false,
                rangeSelection: false
            },
            ...dates.map(date => ({
                title: date.toString(),
                field: date.toString(),
                frozen: true,
                clipboard: true,
                headerSort: false,
                rangeSelection: true,
            }))
        ];

        const table = new Tabulator(tableRef.current, {
            data: rowData,
            columns,
            layout: "fitDataFill",

            //clipboard
            clipboard: true,
            clipboardCopyStyled: false,
            clipboardCopyConfig: {
                rowHeaders: false,
                columnHeaders: false,
            },
            clipboardCopyRowRange: "range",
            // clipboardPasteParser: "range",

            //Excelから張り付けると空行ができてしまうのでParserを自作
            clipboardPasteParser: function (clipboard: string): any[] {
                console.log(`pasted: ${clipboard}`);
                const ranges = table.getRanges();

                // 範囲が選択されていない場合
                if (ranges.length === 0) return [];

                const startColumn = ranges[0].getColumns()[0];
                const allColumns = table.getColumns();

                // 開始カラムのインデックスを取得
                const startIndex = allColumns.findIndex(col => col.getField() === startColumn.getField());

                var rows = clipboard.split("\n").map(function (row) {
                    var cells = row.split("\t");

                    // 空行を除去
                    if (cells.length > 1 && cells.some(cell => cell.trim() !== "")) {
                        const rowData: { [key: string]: any } = {}; //

                        // 開始カラムから順にデータをセット
                        for (let i = 0; i < cells.length; i++) {
                            const columnIndex = startIndex + i;
                            if (columnIndex < allColumns.length) {
                                const cellValue = cells[i].trim();
                                const parsedValue = parseFloat(cellValue);

                                // 数値に変換可能かどうかをチェック
                                if (!isNaN(parsedValue) && isFinite(parsedValue)) {
                                    const columnName = allColumns[columnIndex].getField();
                                    rowData[columnName] = parsedValue; // 数値として設定
                                }
                            }
                        }

                        console.log(`finalRowData${JSON.stringify(rowData, null, 2)}}`)
                        return rowData;
                    }
                }).filter(Boolean);

                // 有効なデータが無かった場合
                return rows.length ? rows : [];
            },


            clipboardPasteAction: "range",
            movableColumns: true,
            reactiveData: true,
            editTriggerEvent: "dblclick",
            height: "70vh",
            columnDefaults: {
                editor: "input",
                resizable: true,
                headerTooltip: true,
            },
            selectableRange: true,
            // selectableRangeMode: "drag",
            selectableRollingSelection: false,
            // rowSelection: false,
        });

        ////clipboardにデータが張り付けられたときのlocalmanhour更新
        table.on("clipboardPasted", function (clipboard: string, rowdata: any[], rowComponents: RowComponent[]) {
            console.log(`pasted: ${clipboard}`);
            console.table(`rowData:`, rowdata);

            rowComponents.forEach(row => {
                const data = row.getData();
                const { skill, shift } = data;

                console.log(`skill: ${skill} - shift: ${shift}`);

                //skillとshift以外の日付データを収集
                const dateData: { date: DateOnly; hours: number }[] = Object.entries(data)
                    .filter(([key, value]) => key !== "skill" && key !== "shift" && key !== "id")
                    .map(([date, hours]) => ({
                        date: DateOnly.fromString(date),
                        hours: Number(hours) // hoursを数値に変換
                    }));

                console.log(`updateDates:${JSON.stringify(dateData, null, 2)}`)

                // LocalManhoursを更新
                setLocalManhours(prevManhours => {
                    dateData.forEach(({ date, hours }) => {
                        prevManhours.forEach(manhour => {
                            if (manhour.shift.name == shift && manhour.skill.name == skill &&
                                manhour.date == date) {
                                manhour.required_hours = hours;
                                console.log(`updateManhour:${JSON.stringify(manhour, null, 2)}`);
                            }
                            return manhour;
                        });
                    });

                    return prevManhours; // 必要であれば変更された配列を返す
                });
            });
        });

        // セルの編集イベント
        table.on("cellEdited", function (cell) {
            const updatedData = cell.getData();
            const dateField = cell.getColumn().getField();
            const newValue = cell.getValue();

            // Update the state
            setLocalManhours(prevData => {
                const date = DateOnly.fromString(dateField);
                const skillName = updatedData.skill;
                const shiftName = updatedData.shift;

                console.log("date", date);
                console.log("ShiftName", shiftName);
                console.log("skillname", skillName);
                console.log("Value", newValue);

                const updatedLocalManhours = prevData.map((item) => {
                    if (item.date == date && item.shift.name == shiftName && item.skill.name == skillName) {
                        console.log("Updated!!")
                        item.required_hours = newValue;
                    }
                    return item;
                });

                console.log("updatedLocalManhour", updatedLocalManhours);
                return updatedLocalManhours;
            });
        });

        return () => {
            table.destroy();
        };
    }, [manhours, dates]);

    function transformData(manhours: Manhour[]): TransformedRow[] {
        const rowMap = new Map<string, TransformedRow>();

        manhours.forEach(mh => {
            const key = `${mh.skill.id}-${mh.shift.id}`;
            if (!rowMap.has(key)) {
                rowMap.set(key, {
                    id: key,
                    skill: mh.skill.name,
                    shift: mh.shift.name,
                });
            }
        });

        manhours.forEach(mh => {
            const key = `${mh.skill.id}-${mh.shift.id}`;
            const row = rowMap.get(key);
            if (row) {
                row[mh.date.toString()] = mh.required_hours;
            }
        });

        return Array.from(rowMap.values());
    }

    const onClickSave = () => {
        console.log(`localManhoursUpdate!:${localManhours.map((val) => {
            return val.required_hours
        })}`)

        saveManhours(localManhours);
    };

    const handleRangeChange = (newStartDate: DateOnly, newEndDate: DateOnly) => {

        ////新しいDate
        const newDates: DateOnly[] = [];
        let currentDate = newStartDate;
        while (currentDate.compareTo(newEndDate) <= 0) {
            newDates.push(currentDate);
            currentDate = currentDate.addDays(1);
        }

        ////必要なくなったDateを消す
        const datesToDelete = dates.filter(date =>
            !newDates.some(newDate => newDate.equals(date))
        );

        deleteDates(datesToDelete);
        saveDates(newDates)
        console.log(`新しい期間: ${newDates}`);
    };

    return (
        <div>
            <div className='px-20 py-5'>
                <div>計算区間設定</div>
                <div className="flex items-center gap-2">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onRangeChange={handleRangeChange}
                    />
                </div>
            </div>
            <div className="px-4 py-2">
                <div ref={tableRef} className="w-full"></div>
            </div>
            <div className="flex justify-end w-full px-4 py-4 gap-1">
                <button
                    onClick={onClickSave}
                    className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
                >
                    保存
                </button>
            </div>
        </div>
    );
};

// import React, { useCallback, useEffect, useState, useRef } from "react";
// import { useManhours } from "../hooks/useManhours";
// import { Manhour } from "../../types/Manhour";
// import { DateRangePicker } from "../organisms/DateRangePicker";
// import { DateOnly } from "../../types/DateOnly";
// import { useDate } from "../hooks/useDates";
// import { toast } from "react-toastify";
// import 'tabulator-tables/dist/css/tabulator.min.css';
// import { TabulatorFull as Tabulator, Formatter, Editor, ColumnDefinition, CellComponent } from "tabulator-tables";

// interface RowType {
//     condition: string;
//     shift: string;
//     skill: string;
//     [key: string]: any;
// }

// export const ManhourSetting: React.FC = () => {
//     const { getManhours, manhours, saveManhours, loading: manhourLoading } = useManhours();
//     const { getDates, dates, saveDates, deleteDates, loading: datesLoading } = useDate();
//     const [localManhours, setLocalManhours] = useState<Array<Manhour>>([]);
//     const [startDate, setStartDate] = useState<DateOnly>(dates[0]);
//     const [endDate, setEndDate] = useState<DateOnly>(dates[dates.length - 1]);
//     const tableRef = useRef<HTMLDivElement>(null);
//     const tableInstance = useRef<Tabulator | null>(null);


//     useEffect(() => {
//         getDates();
//     }, [getDates]);

//     useEffect(() => {
//         getManhours();
//     }, [getManhours, dates]);

//     useEffect(() => {
//         if (manhours) {
//             setLocalManhours(manhours);
//         }
//     }, [manhours]);

//     useEffect(() => {
//         if (dates.length > 0) {
//             setStartDate(dates[0]);
//             setEndDate(dates[dates.length - 1]);
//         }
//     }, [dates]);

//     const uniqueDates = Array.from(new Set(localManhours.map(s => s.date.toString())));

//     const columns: ColumnDefinition[] = [
//         { title: '条件', field: 'condition', editor: 'number' as Editor },
//         ...uniqueDates.map(date => ({
//             title: date,
//             field: date,
//             editor: 'number' as Editor,
//             formatter: 'plaintext' as Formatter,
//             variableHeight: true,
//             widthGrow: 2
//         }))
//     ];

//     const rows: RowType[] = [];
//     const rowIdentifiers = Array.from(new Set(localManhours.map(item => `${item.shift.name}-${item.skill.name}`)));

//     rowIdentifiers.forEach(identifier => {
//         const [shift, skill] = identifier.split('-');
//         const row: RowType = {
//             condition: `${shift}-${skill}`,
//             shift,
//             skill
//         };

//         uniqueDates.forEach(date => {
//             const manhour = localManhours.find(item => item.date.toString() === date && item.shift.name === shift && item.skill.name === skill);
//             row[date] = manhour ? manhour.required_hours : '';
//         });

//         rows.push(row);
//     });

//     useEffect(() => {
//         if (tableRef.current) {
//             tableInstance.current = new Tabulator(tableRef.current, {
//                 data: rows,
//                 columns: columns,
//                 layout: "fitDataFill",

//                 //range selection
//                 selectableRange: 1,
//                 selectableRangeColumns: true,
//                 selectableRangeRows: true,
//                 // selectableRangeClearCells: true,
//                 editTriggerEvent: "dblclick",

//                 //clipboard
//                 clipboard: true,
//                 clipboardCopyStyled: false,
//                 clipboardCopyConfig: {
//                     rowHeaders: false,
//                     columnHeaders: false,
//                 },
//                 clipboardCopyRowRange: "range",
//                 clipboardPasteParser: "range",
//                 clipboardPasteAction: "range", // ペーストしたデータを既存のデータで上書き

//                 movableColumns: true,
//                 reactiveData: true
//             });
//             tableInstance.current.scrollToColumn("date", "middle", true);

//             tableInstance.current.on("cellEdited", function (cell: CellComponent) {
//                 const updatedData = cell.getData();
//                 const dateField = cell.getColumn().getField();
//                 const newValue = cell.getValue();

//                 // Update the state
//                 setLocalManhours(prevData => {
//                     const date = DateOnly.fromString(dateField);
//                     const [shiftName, skillName] = updatedData.condition.split('-');

//                     console.log("date", date);
//                     console.log("ShiftName", shiftName);
//                     console.log("skillname", skillName);
//                     console.log("Value", newValue);

//                     const updatedLocalManhours = prevData.map((item) => {
//                         if (item.date == date && item.shift.name == shiftName && item.skill.name == skillName) {
//                             console.log("Updated!!")
//                             item.required_hours = newValue;
//                         }
//                         return item;
//                     });

//                     console.log("updatedLocalManhour", updatedLocalManhours);
//                     return updatedLocalManhours;
//                 });
//             });

//             tableInstance.current.on("clipboardPasteError", function (error) {
//                 console.error("Clipboard paste error:", error);
//                 toast.error("クリップボードペーストエラーが発生しました");
//             });
//             return () => {
//                 if (tableInstance.current) {
//                     tableInstance.current.destroy();
//                 }
//             };
//         }
//     }, [rows, columns]);

//     const onClickDateSave = () => {
//         try {
//             if (!startDate || !endDate) {
//                 throw new Error('開始日と終了日を選択してください');
//             }

//             if (startDate.compareTo(endDate) > 0) {
//                 throw new Error('開始日は終了日より前の日付である必要があります');
//             }

//             const newDates: DateOnly[] = [];
//             let currentDate = startDate;
//             while (currentDate.compareTo(endDate) <= 0) {
//                 newDates.push(currentDate);
//                 currentDate = currentDate.addDays(1);
//             }

//             const datesToDelete = dates.filter(date => !newDates.some(newDate => newDate.equals(date)));
//             deleteDates(datesToDelete)

//             console.log("deleteList", datesToDelete)
//             console.log("saveDateList", newDates)
//             saveDates(newDates);

//             toast.success("日付情報を更新しました")
//         } catch (error) {
//             toast.error("日付情報の更新に失敗しました")
//         }
//     }

//     const onClickSave = () => {
//         console.log("aaaa", localManhours)
//         saveManhours(localManhours);
//         console.log("manhour saved", localManhours);
//     }

//     return (
//         <div>
//             <div className='px-20 py-5'>
//                 <div>計算区間設定</div>
//                 <div className="flex items-center gap-2">
//                     <DateRangePicker
//                         startInitialDate={startDate!}
//                         endInitialDate={endDate!}
//                         onStartDateChange={(val) => setStartDate(val)}
//                         onEndDateChange={(val) => setEndDate(val)} />
//                     <button
//                         onClick={onClickDateSave}
//                         className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
//                     >
//                         更新
//                     </button>
//                 </div>
//             </div>
//             <div className="px-4 py-2">
//                 <div ref={tableRef}></div>
//             </div>
//             <div className="flex justify-end w-full px-4 py-4 gap-1">
//                 <button
//                     onClick={onClickSave}
//                     className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
//                 >
//                     保存
//                 </button>
//             </div>
//         </div>
//     );
// };

// import React, { useCallback, useEffect, useState } from "react";
// import { useManhours } from "../hooks/useManhours";
// import { Manhour } from "../../types/Manhour";
// import ReactDataGrid from "@inovua/reactdatagrid-community";
// import { DateRangePicker } from "../organisms/DateRangePicker";
// import { DateOnly } from "../../types/DateOnly";
// import { useDate } from "../hooks/useDates";
// import { toast } from "react-toastify";
// import { TypeEditInfo } from "@inovua/reactdatagrid-community/types";


// interface RowType {
//     condition: string;
//     shift: string; // 追加します
//     skill: string; // 追加します
//     [key: string]: any; // 各日付に対応するデータを柔軟に取り扱うため
// }

// export const ManhourSetting: React.FC = () => {
//     const { getManhours, manhours, loading: manhoursLoading } = useManhours();
//     const { getDates, dates, saveDates, deleteDates, loading: datesLoading } = useDate();
//     const [localManhours, setLocalManhours] = useState<Array<Manhour>>([]);
//     const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({});
//     const [selectedCells, setSelectedCells] = useState<string[]>([]);
//     const [startDate, setStartDate] = useState<DateOnly>(dates[0]);
//     const [endDate, setEndDate] = useState<DateOnly>(dates[dates.length - 1]);

//     useEffect(() => {
//         getDates();
//     }, [getDates])

//     useEffect(() => {
//         getManhours();
//     }, [getManhours, dates])

//     // useEffect(() => {
//     //     getManhours();
//     //     getDates();
//     // }, [getManhours, getDates, saveDates]);

//     useEffect(() => {
//         if (manhours) {
//             setLocalManhours(manhours);
//         }
//     }, [manhours]);

//     useEffect(() => {
//         if (dates.length > 0) {
//             setStartDate(dates[0]);
//             setEndDate(dates[dates.length - 1]);
//         }
//     }, [dates]);

//     // ユニークな日付リストを取得
//     const uniqueDates = Array.from(new Set(localManhours.map(s => s.date.toString())));

//     // カラム設定
//     const columns = [
//         {
//             name: 'condition',
//             header: '条件',
//             defaultFlex: 1,
//             editable: true,
//             render: ({ data }: { data: RowType }) => data.condition // 条件カラムを適切にレンダリング
//         },
//         ...uniqueDates.map(date => ({
//             name: date,
//             header: date,
//             defaultFlex: 2,
//             editable: true,
//             render: ({ value }: { value: number }) => value !== undefined ? value : '',
//         }))
//     ];

//     // データ変換
//     const rows: RowType[] = [];
//     const rowIdentifiers = Array.from(new Set(localManhours.map(item => `${item.shift.name}-${item.skill.name}`)));

//     rowIdentifiers.forEach(identifier => {
//         const [shift, skill] = identifier.split('-');
//         const row: RowType = {
//             condition: `${shift}-${skill}`,
//             shift, // 追加します
//             skill  // 追加します
//         };

//         uniqueDates.forEach(date => {
//             const manhour = localManhours.find(item => item.date.toString() === date && item.shift.name === shift && item.skill.name === skill);
//             row[date] = manhour ? manhour.required_hours : '';
//         });

//         rows.push(row);
//     });

//     const handleCellSelectionChange = useCallback((selection: { [key: string]: boolean }) => {
//         setCellSelection(selection);
//         setSelectedCells(Object.keys(selection).filter(key => selection[key]));
//     }, []);

//     const onClickDateSave = () => {
//         try {
//             if (!startDate || !endDate) {
//                 throw new Error('開始日と終了日を選択してください');
//             }

//             if (startDate.compareTo(endDate) > 0) {
//                 throw new Error('開始日は終了日より前の日付である必要があります');
//             }

//             const newDates: DateOnly[] = [];
//             let currentDate = startDate;
//             while (currentDate.compareTo(endDate) <= 0) {
//                 newDates.push(currentDate);
//                 currentDate = currentDate.addDays(1);
//             }

//             // 新しい日付と現在の日付の差分を計算
//             const datesToDelete = dates.filter(date => !newDates.some(newDate => newDate.equals(date)));
//             deleteDates(datesToDelete)

//             console.log("deleteList", datesToDelete)
//             console.log("saveDateList", newDates)
//             saveDates(newDates);

//             toast.success("日付情報を更新しました")
//         } catch (error) {
//             toast.error("日付情報の更新に失敗しました")
//         }
//     }

//     const handleEditComplete = useCallback((editInfo: TypeEditInfo) => {
//         const { value, columnId, rowId, rowIndex, columnIndex } = editInfo;

//         setLocalManhours(prevData => {
//             console.log("Before Update", prevData);
//             console.log("columnID", columnId);
//             console.log("rowID", rowId);
//             console.log("columnIndex", columnIndex);
//             console.log("rowIndex", rowIndex);

//             const date = DateOnly.fromString(columnId)
//             const [shiftName, skillName] = rowId.split('-');

//             const updatedData = prevData.map((item) => {
//                 if (item.date == date && item.shift.name == shiftName && item.skill.name == skillName) {
//                     item.required_hours = value;
//                 }
//                 return item;
//             });

//             console.log("After Update:", updatedData)

//             return updatedData;
//         });

//     }, []);

//     const onCopySelectedCellsChange = useCallback((cells: any) => {
//         console.log(cells);
//     }, []);

//     const onPasteSelectedCellsChange = useCallback((cells: any) => {
//         console.log(cells);
//     }, []);

//     return (
//         <div>
//             <div className='px-20 py-5'>
//                 <div>計算区間設定</div>
//                 <div className="flex items-center gap-2">
//                     <DateRangePicker
//                         startInitialDate={startDate!}
//                         endInitialDate={endDate!}
//                         onStartDateChange={(val) => setStartDate(val)}
//                         onEndDateChange={(val) => setEndDate(val)} />
//                     <button
//                         onClick={onClickDateSave}
//                         className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
//                     >
//                         更新
//                     </button>
//                 </div>
//                 <span className='m-1'>
//                     {selectedCells.length === 0
//                         ? 'セル未選択'
//                         : `選択されたセル: ${selectedCells.length}`}
//                 </span>
//             </div>
//             <div className="px-20 py-2">
//                 <ReactDataGrid
//                     idProperty="condition"
//                     columns={columns}
//                     dataSource={rows}
//                     cellSelection={cellSelection}
//                     onCellSelectionChange={handleCellSelectionChange}
//                     onEditComplete={handleEditComplete}
//                     onCopySelectedCellsChange={onCopySelectedCellsChange}
//                     onPasteSelectedCellsChange={onPasteSelectedCellsChange}
//                     style={{ minHeight: 800, width: '100%' }}
//                     editable
//                     columnMinWidth={120}
//                     loading={manhoursLoading || datesLoading}
//                     enableClipboard
//                 />
//             </div>
//         </div>
//     );
// };