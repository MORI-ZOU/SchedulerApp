import { useEffect, useState } from "react";
import { useManhours } from "../hooks/useManhours";
import { Manhour } from "../../types/Manhour";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { MyDatepicker } from "../atoms/datepicker/MyDatePicker";

interface RowType {
    condition: string;
    shift: string; // 追加します
    skill: string; // 追加します
    [key: string]: any; // 各日付に対応するデータを柔軟に取り扱うため
}

export const ManhourSetting = () => {
    const { getManhours, manhours, loading } = useManhours();
    const [localManhours, setLocalManhours] = useState<Array<Manhour>>([]);
    const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({});
    const [selectedCells, setSelectedCells] = useState<string[]>([]);

    console.log("read!!")

    useEffect(() => {
        getManhours();
    }, [getManhours]);

    useEffect(() => {
        if (manhours) {
            setLocalManhours(manhours);
        }
    }, [manhours]);

    // ユニークな日付リストを取得
    const dates = Array.from(new Set(localManhours.map(s => s.date.toString())));

    // カラム設定
    const columns = [
        {
            name: 'condition',
            header: '条件',
            defaultFlex: 1,
            render: ({ data }: { data: RowType }) => data.condition // 条件カラムを適切にレンダリング
        },
        ...dates.map(date => ({
            name: date,
            header: date,
            defaultFlex: 2,
            render: ({ value }: { value: number }) => value !== undefined ? value : ''
        }))
    ];

    // データ変換
    const rows: RowType[] = [];
    const rowIdentifiers = Array.from(new Set(localManhours.map(item => `${item.shift.name}-${item.skill.name}`)));

    rowIdentifiers.forEach(identifier => {
        const [shift, skill] = identifier.split('-');
        const row: RowType = {
            condition: `${shift}-${skill}`,
            shift, // 追加します
            skill  // 追加します
        };

        dates.forEach(date => {
            const manhour = localManhours.find(item => item.date.toString() === date && item.shift.name === shift && item.skill.name === skill);
            row[date] = manhour ? manhour.required_hours : '';
        });

        rows.push(row);
    });

    const handleCellSelectionChange = (selection: { [key: string]: boolean }) => {
        setCellSelection(selection);
        setSelectedCells(Object.keys(selection).filter(key => selection[key]));
    };

    return (
        <div>
            <div className='px-20 py-2'>
                <MyDatepicker />
                <span className='m-1'>
                    {selectedCells.length === 0
                        ? 'セル未選択'
                        : `選択されたセル: ${selectedCells.length}`}
                </span>
            </div>
            <div className="px-20 py-2">
                <ReactDataGrid
                    idProperty="condition"
                    columns={columns}
                    dataSource={rows}
                    cellSelection={cellSelection}
                    onCellSelectionChange={handleCellSelectionChange}
                    style={{ minHeight: 800, width: '100%' }}
                    columnMinWidth={120}
                />
            </div>
        </div>
    );
};