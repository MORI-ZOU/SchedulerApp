import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { OptimizedSchedule } from '../../../types/OptimizedSchedule';
import { Manhour } from '../../../types/Manhour';

interface GanttChartProps {
  schedules: OptimizedSchedule[];
  manhours: Manhour[];
}

interface GanttChartData {
  taskId: string;
  taskName: string;
  resource: string;
  start: Date;
  end: Date;
  duration: number;
  percentComplete: number;
  dependencies: string | null;
}

const GanttChart: React.FC<GanttChartProps> = ({ schedules, manhours }) => {
  const chartData = useMemo(() => {
    const data: any[][] = [
      [
        { type: 'string', label: 'Employee' },
        { type: 'string', label: 'Label' },
        { type: 'string', role: 'style' },
        { type: 'date', label: 'Start' },
        { type: 'date', label: 'End' }
      ]
    ];

    // 従業員ごとにグループ化してソート
    const employeeSchedules = new Map<string, OptimizedSchedule[]>();
    schedules.forEach(schedule => {
      const employeeName = schedule.employee.employee_detail.name;
      if (!employeeSchedules.has(employeeName)) {
        employeeSchedules.set(employeeName, []);
      }
      employeeSchedules.get(employeeName)!.push(schedule);
    });

    // 従業員名でソート
    const sortedEmployees = Array.from(employeeSchedules.keys()).sort();

    // 各従業員のスケジュールをタイムライン用に変換
    sortedEmployees.forEach(employeeName => {
      const employeeScheduleList = employeeSchedules.get(employeeName)!;

      const filteredSchedules = employeeScheduleList
        .filter(schedule => schedule.shift) // シフトがあるもののみ
        .sort((a, b) => new Date(a.date.toString()).getTime() - new Date(b.date.toString()).getTime());

      filteredSchedules.forEach((schedule) => {
        const scheduleDate = new Date(schedule.date.toString());
        const startTimeStr = schedule.shift!.startTime.toString();
        const endTimeStr = schedule.shift!.endTime.toString();
        const [startHour, startMinute] = startTimeStr.split(':').map(Number);
        const [endHour, endMinute] = endTimeStr.split(':').map(Number);

        const shiftStartDate = new Date(scheduleDate);
        shiftStartDate.setHours(startHour, startMinute, 0, 0);

        const shiftEndDate = new Date(scheduleDate);
        shiftEndDate.setHours(endHour, endMinute, 0, 0);

        // 翌日にまたがる場合
        if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
          shiftEndDate.setDate(shiftEndDate.getDate() + 1);
        }

        // 日付と曜日のラベルを作成
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const month = shiftStartDate.getMonth() + 1;
        const day = shiftStartDate.getDate();
        const weekday = weekdays[shiftStartDate.getDay()];

        // 基本勤務時間と残業時間を取得
        const baseWorkHours = schedule.defaultWorktimeHour;
        const overtimeHours = schedule.overtimeHours;
        // const baseWorkHours = schedule.defaultWorktimeHour || 8;
        // const overtimeHours = schedule.overtimeHours || 0;  

        // シフトの色を取得
        const shiftColor = schedule.shift!.color.toString();

        // スキルタイムがある場合はタスクごとに分割
        if (schedule.skill_times && schedule.skill_times.length > 0) {
          let currentTime = new Date(shiftStartDate);

          schedule.skill_times.forEach((skillTime, index) => {
            const taskHours = skillTime.allocated_hours;
            const taskEndTime = new Date(currentTime);
            taskEndTime.setHours(taskEndTime.getHours() + taskHours);

            const taskLabel = `${skillTime.skill_name} (${taskHours}h)`;

            data.push([
              employeeName,
              taskLabel,
              shiftColor,  // シフトの色を追加
              currentTime,
              taskEndTime
            ]);

            currentTime = new Date(taskEndTime);
          });
        } else {
          // スキルタイムがない場合は従来通り
          let shiftLabel = `${schedule.shift!.name} (${baseWorkHours}h`;
          if (overtimeHours > 0) {
            shiftLabel += `+残業${overtimeHours}h`;
          }
          shiftLabel += `)`;

          data.push([
            employeeName,
            shiftLabel,
            shiftColor,  // シフトの色を追加
            shiftStartDate,
            shiftEndDate
          ]);
        }
      });
    });

    return data;
  }, [schedules]);

  // シフトの凡例データを作成
  const shiftLegend = useMemo(() => {
    const uniqueShifts = new Map<string, { name: string; color: string }>();

    schedules.forEach(schedule => {
      if (schedule.shift) {
        const shiftId = schedule.shift.id;
        if (!uniqueShifts.has(shiftId)) {
          uniqueShifts.set(shiftId, {
            name: schedule.shift.name,
            color: schedule.shift.color.toString()
          });
        }
      }
    });

    return Array.from(uniqueShifts.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [schedules]);

  // 従業員数を取得
  const employeeCount = new Set(schedules.map(s => s.employee.employee_detail.name)).size;

  // スケジュールの期間を計算してチャート幅を決定
  const { chartWidth, daySpan } = useMemo(() => {
    if (schedules.length === 0) return { chartWidth: 1800, daySpan: 1 };

    const dates = schedules.map(s => new Date(s.date.toString()).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const daySpan = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

    // 1日あたり800pxで計算（最小1800px）
    const calculatedWidth = Math.max(1800, daySpan * 800);

    return { chartWidth: calculatedWidth, daySpan };
  }, [schedules]);

  const chartHeight = Math.max(400, employeeCount * 50 + 100);

  const options = {
    height: chartHeight,
    timeline: {
      showRowLabels: true,
      showBarLabels: true,
      barLabelStyle: {
        fontName: 'Arial',
        fontSize: 9,
        color: '#ffffff',
        bold: true
      },
      forceIFrame: false,
      rowLabelStyle: {
        fontName: 'Arial',
        fontSize: 13,
        color: '#1f2937',
        fontWeight: 'bold'
      },
      colorByRowLabel: true,
      groupByRowLabel: true,
      avoidOverlappingGridLines: false
    },
    hAxis: {
      format: 'M/d(E) HH:mm',
      title: '日時',
      titleTextStyle: {
        color: '#374151',
        fontSize: 14,
        bold: true
      },
      textStyle: {
        color: '#374151',
        fontSize: 12
      },
      gridlines: {
        color: '#e5e7eb',
        count: -1
      },
      minorGridlines: {
        color: '#f3f4f6',
        count: 2
      }
    },
    backgroundColor: '#ffffff'
  };

  if (chartData.length <= 1) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">スケジュールデータがありません</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">ガントチャート</h3>
        <p className="text-sm text-gray-600">シフトスケジュールの時系列表示</p>

        {/* シフト凡例と期間情報 */}
        {shiftLegend.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium text-gray-700">シフト凡例</h4>
              <span className="text-xs text-gray-500">期間: {daySpan}日間 (幅: {chartWidth}px)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {shiftLegend.map((shift, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: shift.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{shift.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div
          className="border border-gray-200 rounded"
          style={{
            maxHeight: '600px',
            overflowY: chartHeight > 600 ? 'auto' : 'hidden',
            overflowX: 'auto'
          }}
        >
          <div style={{ minWidth: `${chartWidth}px` }}>
            <Chart
              chartType="Timeline"
              width={`${chartWidth}px`}
              height={`${Math.min(chartHeight, 600)}px`}
              data={chartData}
              options={{
                ...options,
                height: Math.min(chartHeight, 600)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;