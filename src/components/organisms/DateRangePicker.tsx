import { FC, useState, useEffect } from "react"
import { DatePicker } from "../atoms/datepicker/DatePicker"
import { DateOnly } from "../../types/DateOnly";
import { toast } from "react-toastify";

type Props = {
    startDate: DateOnly;
    endDate: DateOnly;
    onRangeChange: (startDate: DateOnly, endDate: DateOnly) => void;
    // onStartDateChange: (date: DateOnly) => void;
    // onEndDateChange: (date: DateOnly) => void;
}

export const DateRangePicker: FC<Props> = (props) => {
    const { startDate, endDate, onRangeChange } = props
    const [localStartDate, setLocalStartDate] = useState<DateOnly>(startDate)
    const [localEndDate, setLocalEndDate] = useState<DateOnly>(endDate)

    console.log(`start${startDate}`)
    console.log(`end${endDate}`)
    console.log(`localstart${localStartDate}`)
    console.log(`localend${localEndDate}`)

    // startDate や endDate が変わった場合に local の値を更新
    useEffect(() => {
        setLocalStartDate(startDate);
    }, [startDate]);

    useEffect(() => {
        setLocalEndDate(endDate);
    }, [endDate]);

    const handleStartDateChange = (newStartDate: DateOnly) => {
        setLocalStartDate(newStartDate);
    };

    const handleEndDateChange = (newEndDate: DateOnly) => {
        setLocalEndDate(newEndDate);
    };

    const onClickDateChange = () => {
        try {
            if (!localStartDate || !localEndDate) {
                throw new Error('開始日と終了日を選択してください');
            }

            if (localStartDate.compareTo(localEndDate) > 0) {
                throw new Error('開始日は終了日より前の日付である必要があります');
            }

            onRangeChange(localStartDate, localEndDate)
        } catch (error) {
            toast.error(`日付情報の更新に失敗しました:${error}`)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <DatePicker initialDate={localStartDate} onDateChange={handleStartDateChange} />
            <div>～</div>
            <DatePicker initialDate={localEndDate} onDateChange={handleEndDateChange} />
            <button
                onClick={onClickDateChange}
                className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
            >
                更新
            </button>
        </div>
    )
}

// import React from 'react';
// import { DateOnly } from '../../types/DateOnly';


// interface DateRangePickerProps {
//     startDate: DateOnly;
//     endDate: DateOnly;
//     onRangeChange: (startDate: DateOnly, endDate: DateOnly) => void;
// }

// export const DateRangePicker: React.FC<DateRangePickerProps> = ({
//     startDate,
//     endDate,
//     onRangeChange,
// }) => {
//     const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newStartDate = DateOnly.fromString(e.target.value);
//         onRangeChange(newStartDate, endDate);
//     };

//     const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newEndDate = DateOnly.fromString(e.target.value);
//         onRangeChange(startDate, newEndDate);
//     };

//     return (
//         <div className="flex items-center gap-4 mb-4">
//             <div>
//                 <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
//                     開始日
//                 </label>
//                 <input
//                     type="date"
//                     id="startDate"
//                     value={startDate.toString()}
//                     onChange={handleStartDateChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//             </div>
//             <div>
//                 <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
//                     終了日
//                 </label>
//                 <input
//                     type="date"
//                     id="endDate"
//                     value={endDate.toString()}
//                     onChange={handleEndDateChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//             </div>
//         </div>
//     );
// };