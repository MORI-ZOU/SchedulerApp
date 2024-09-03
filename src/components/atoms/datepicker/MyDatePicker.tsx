import React, { useEffect } from 'react';
import 'flowbite';

export const MyDatepicker: React.FC = () => {
    useEffect(() => {
        const datepickerTrigger = document.getElementById('datepicker-trigger');
        const datepicker = document.getElementById('datepicker');

        if (datepickerTrigger !== null && datepicker !== null) {
            // FlowbiteのDatepickerコンポーネントの初期化を行います。
            new (window as any).Datepicker(datepicker, {
                format: 'yyyy-mm-dd',
            });
        }
    }, []);

    return (
        <div className="relative">
            <input readOnly id="datepicker-trigger" data-datepicker-toggle="datepicker" type="text" className="form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300" placeholder="Select date" />
            <div className="datepicker hidden" id="datepicker"></div>
        </div>
    );
};

export default MyDatepicker;