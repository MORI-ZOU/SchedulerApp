import { FC, useEffect, useRef } from "react";
import { Manhour } from "../../../types/Manhour";
import { DateOnly } from "../../../types/DateOnly";
import 'tabulator-tables/dist/css/tabulator.min.css';
import { TabulatorFull as Tabulator, RangeComponent, RowComponent, Editor, ColumnDefinition, CellComponent, ColumnComponent } from "tabulator-tables";


type TransformedRow = {
    id: string;
    skill: string;
    shift: string;
    [date: string]: any; // 動的な日付フィールド
};

type Props = {
    manhours: Manhour[];
    dates: DateOnly[];
    handleSetLocalManhours: (manhours: Manhour[]) => void;
}

export const ManhourTable: FC<Props> = (props) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const { manhours, dates, handleSetLocalManhours } = props;

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
                dateData.forEach(({ date, hours }) => {
                    manhours.forEach(manhour => {
                        if (manhour.shift.name == shift && manhour.skill.name == skill &&
                            manhour.date == date) {
                            manhour.required_hours = hours;
                            console.log(`updateManhour:${JSON.stringify(manhour, null, 2)}`);
                        }
                        return manhour;
                    });
                });

                handleSetLocalManhours(manhours);
            });
        });

        // セルの編集イベント
        table.on("cellEdited", function (cell) {
            const updatedData = cell.getData();
            const dateField = cell.getColumn().getField();
            const newValue = cell.getValue();

            // Update the state
            const date = DateOnly.fromString(dateField);
            const skillName = updatedData.skill;
            const shiftName = updatedData.shift;

            console.log("date", date);
            console.log("ShiftName", shiftName);
            console.log("skillname", skillName);
            console.log("Value", newValue);

            const updatedLocalManhours = manhours.map((item) => {
                if (item.date == date && item.shift.name == shiftName && item.skill.name == skillName) {
                    console.log("Updated!!")
                    item.required_hours = newValue;
                }
                return item;
            });

            console.log("updatedLocalManhour", updatedLocalManhours);
            handleSetLocalManhours(updatedLocalManhours);
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
    };


    return (
        <div ref={tableRef} className="w-full" />
    )
}