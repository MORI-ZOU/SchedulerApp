import React from 'react';
import { ShiftType } from '../../../types/ShiftType';
import { valid_shift } from '../../../types/valid_shift';

type Props = {
    availableShifts: ShiftType[];
    selectedShifts: valid_shift[];
    employeeId: string;
    onChange: (shifts: valid_shift[]) => void;
};

export const ShiftSelector: React.FC<Props> = ({
    availableShifts,
    selectedShifts,
    employeeId,
    onChange,
}) => {
    const handleShiftChange = (shiftId: string, checked: boolean) => {
        console.log(`shiftID:${shiftId}, checked:${checked}`)
        if (checked) {
            onChange([...selectedShifts, { employee_id: employeeId, shift_id: shiftId }]);
        } else {
            onChange(selectedShifts.filter(shift => shift.shift_id !== shiftId));
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                登録可能シフト
            </label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                    {availableShifts.map((shift) => (
                        <div key={shift.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`shift-${shift.id}`}
                                checked={selectedShifts.some(s => s.shift_id == shift.id)}
                                onChange={(e) => handleShiftChange(shift.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label
                                htmlFor={`shift-${shift.id}`}
                                className="ml-2 text-sm text-gray-700"
                                style={{ color: shift.color.toString() }}
                            >
                                {shift.name} ({shift.startTime.toString()} - {shift.endTime.toString()})
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};