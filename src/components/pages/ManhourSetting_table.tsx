import React, { useState, useEffect } from 'react';
import { useManhours } from "../hooks/useManhours";
import { DateRangePicker } from "../organisms/DateRangePicker";
import { DateOnly } from "../../types/DateOnly";
import { useDate } from "../hooks/useDates";
import { Skill } from '../../types/Skill';
import { ShiftType } from '../../types/ShiftType';
import { Manhour } from '../../types/Manhour';

export const ManhourSetting: React.FC = () => {
    const { getManhours, manhours, saveManhours } = useManhours();
    const { getDates, dates, saveDates, deleteDates } = useDate();
    const [localManhours, setLocalManhours] = useState<Array<Manhour>>([]);
    const [startDate, setStartDate] = useState<DateOnly | null>(dates[0]);
    const [endDate, setEndDate] = useState<DateOnly | null>(dates[dates.length - 1]);

    useEffect(() => {
        getDates();
    }, [getDates]);

    useEffect(() => {
        getManhours();
    }, [getManhours, dates]);

    useEffect(() => {
        if (manhours) {
            const uniqueEntries = aggregateManhours(manhours);
            setLocalManhours(uniqueEntries);
        }
    }, [manhours]);

    useEffect(() => {
        if (dates.length > 0) {
            setStartDate(dates[0]);
            setEndDate(dates[dates.length - 1]);
        }
    }, [dates]);

    // ユニークなスキルとシフトの組み合わせを集約する関数
    const aggregateManhours = (data: Manhour[]): Manhour[] => {
        const map = new Map<string, Manhour>();

        data.forEach(mh => {
            const key = `${mh.skill.name}-${mh.shift.name}`;
            if (!map.has(key)) {
                map.set(key, mh);
            }
        });

        return Array.from(map.values());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, date: DateOnly) => {
        const newValue = e.target.value;
        setLocalManhours(prevData => {
            return prevData.map((manhour, i) => {
                if (i === rowIndex && manhour.date.equals(date)) {
                    return {
                        ...manhour,
                        required_hours: parseFloat(newValue),
                    };
                }
                return manhour;
            });
        });
    };

    const renderTable = () => {
        return (
            <table className="table-fixed w-full">
                <thead>
                    <tr>
                        <th className="w-1/4">Skill</th>
                        <th className="w-1/4">Shift</th>
                        {dates.map((date) => (
                            <th key={date.toString()} className="w-1/4">
                                {date.toString()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {localManhours.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{row.skill.name}</td>
                            <td>{row.shift.name}</td>
                            {dates.map((date) => (
                                <td key={date.toString()}>
                                    <input
                                        type="text"
                                        value={date.equals(row.date) ? row.required_hours.toString() : ''}
                                        onChange={(e) => handleInputChange(e, rowIndex, date)}
                                        className="w-full border px-2"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const onClickSave = () => {
        saveManhours(localManhours);
    };

    const handleRangeChange = (newStartDate: DateOnly, newEndDate: DateOnly) => {
        // Implement this based on your requirements
    };

    return (
        <div>
            <div className='px-20 py-5'>
                <div>計算区間設定</div>
                <div className="flex items-center gap-2">
                    <DateRangePicker
                        startDate={startDate as DateOnly}
                        endDate={endDate as DateOnly}
                        onRangeChange={handleRangeChange}
                    />
                </div>
            </div>
            <div className="px-4 py-2">
                {renderTable()}
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