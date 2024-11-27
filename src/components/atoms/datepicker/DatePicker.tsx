import React, { useEffect, useRef } from 'react';
import { Datepicker } from 'flowbite-datepicker';
import { DateOnly } from '../../../types/DateOnly';

interface DatepickerProps {
    initialDate?: DateOnly;
    onDateChange: (date: DateOnly) => void;
}

const options = {
    autohide: true,
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    buttons: true,
};

export const DatePicker: React.FC<DatepickerProps> = ({ initialDate, onDateChange }) => {
    const datepickerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let datepickerInstance: Datepicker | null = null;

        if (datepickerRef.current) {
            datepickerInstance = new Datepicker(datepickerRef.current, options);

            console.log("initialdate", initialDate)

            if (initialDate) {
                datepickerInstance.setDate(initialDate.toString());
            }

            // Add event listener to the datepicker instance
            datepickerRef.current.addEventListener('changeDate', (event: Event) => {
                const inputElement = event.target as HTMLInputElement;
                const val = inputElement.value;
                onDateChange(DateOnly.fromString(val));
            });
        }

        return () => {
            if (datepickerRef.current) {
                datepickerRef.current.removeEventListener('changeDate', () => { });
            }
        };
    }, [initialDate, onDateChange]);

    return (
        <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
            </div>
            <input
                ref={datepickerRef}
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full pl-10 p-2.5"
                placeholder="Select date"
            />
        </div>
    );
};