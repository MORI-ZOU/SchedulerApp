import React, { useCallback, useEffect, useState, useRef } from "react";
import { useManhours } from "../hooks/useManhours";
import { Manhour } from "../../types/Manhour";
import { DateRangePicker } from "../organisms/DateRangePicker";
import { DateOnly } from "../../types/DateOnly";
import { useDate } from "../hooks/useDates";
import 'tabulator-tables/dist/css/tabulator.min.css';
import { TabulatorFull as Tabulator, RangeComponent, RowComponent, Editor, ColumnDefinition, CellComponent, ColumnComponent } from "tabulator-tables";

type TransformedRow = {
    id: string;
    skill: string;
    shift: string;
    [date: string]: any; // 動的な日付フィールド
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
                clipboard: true,
                headerSort: false,
                rangeSelection: true,
            }))
        ];

        const table = new Tabulator(tableRef.current, {
            data: rowData,
            columns,
            layout: "fitData",

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
