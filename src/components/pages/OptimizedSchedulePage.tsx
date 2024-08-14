
import { useEffect } from "react";
import { OptimizedSchedule } from "../../types/OptimizedSchedule";
import { useOptimizeSchedule } from "../hooks/useOptimizeSchedule";
import { ScheduleTable } from "../organisms/SheduleTable";

type Props = {
    schedule: Array<OptimizedSchedule>;
}


export const OptimizedSchedulePage = () => {
    const { getSchedules, schedules, loading } = useOptimizeSchedule();

    useEffect(() => getSchedules())

    return (
        <div>
            <ScheduleTable optimizedSchedules={schedules} />
        </div>
    )
};
