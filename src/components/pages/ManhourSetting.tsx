import React, { useCallback, useEffect, useState, useRef } from "react";
import { useManhours } from "../hooks/useManhours";
import { Manhour } from "../../types/Manhour";
import { DateRangePicker } from "../organisms/DateRangePicker";
import { DateOnly } from "../../types/DateOnly";
import { useDate } from "../hooks/useDates";
import 'tabulator-tables/dist/css/tabulator.min.css';
import { TabulatorFull as Tabulator, RangeComponent, RowComponent, Editor, ColumnDefinition, CellComponent, ColumnComponent } from "tabulator-tables";
import { ManhourTable } from "../organisms/tables/ManhourTable";

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
                <ManhourTable
                    dates={dates}
                    manhours={localManhours}
                    handleSetLocalManhours={(val: Manhour[]) => {
                        setLocalManhours(val);
                    }} />
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
