'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CalendarHeatmapProps {
  checkedInDates: string[];
  month: string;
}

interface DayData {
  date: string;
  count: number;
  isCheckedIn: boolean;
  dayOfWeek: number;
  weekNumber: number;
}

export default function CalendarHeatmap({
  checkedInDates,
  month,
}: CalendarHeatmapProps) {
  const [days, setDays] = useState<DayData[]>([]);
  const [weeks, setWeeks] = useState<DayData[][]>([]);

  const generateCalendarData = useCallback(() => {
    const [year, monthNum] = month.split('-').map(Number);
    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendarDays: DayData[] = [];

    // Add empty days for the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push({
        date: '',
        count: 0,
        isCheckedIn: false,
        dayOfWeek: i,
        weekNumber: 0,
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day);
      const dateString = date.toISOString().split('T')[0];
      const isCheckedIn = checkedInDates.includes(dateString);

      calendarDays.push({
        date: dateString,
        count: isCheckedIn ? 1 : 0,
        isCheckedIn,
        dayOfWeek: date.getDay(),
        weekNumber: Math.floor((day + startDayOfWeek - 1) / 7),
      });
    }

    setDays(calendarDays);

    // Group days into weeks
    const weeksData: DayData[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeksData.push(calendarDays.slice(i, i + 7));
    }
    setWeeks(weeksData);
  }, [checkedInDates, month]);

  useEffect(() => {
    generateCalendarData();
  }, [generateCalendarData]);

  const getIntensity = (day: DayData) => {
    if (!day.isCheckedIn) return 0;
    return 1; // For now, all check-ins have the same intensity
  };

  const getColorClass = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-800';
    if (intensity === 1) return 'bg-atelier-darkYellow';
    return 'bg-atelier-darkRed';
  };

  const getTooltipText = (day: DayData) => {
    if (!day.date) return '';
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return day.isCheckedIn
      ? `Checked in on ${formattedDate}`
      : `No check-in on ${formattedDate}`;
  };

  return (
    <div className="w-full">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div
            key={day}
            className="text-center text-gray-400 text-xs font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <motion.div
              key={`${weekIndex}-${dayIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
              className={`
                aspect-square rounded-lg border border-white/10 cursor-pointer
                ${getColorClass(getIntensity(day))}
                ${day.isCheckedIn ? 'ring-2 ring-atelier-darkYellow/50' : ''}
                hover:scale-110 transition-all duration-200
                ${!day.date ? 'invisible' : ''}
              `}
              title={getTooltipText(day)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {day.date && (
                <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                  {day.isCheckedIn && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-black rounded-full"
                    />
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 mt-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-800 rounded"></div>
          <span className="text-gray-400">No check-in</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-atelier-darkYellow rounded"></div>
          <span className="text-gray-400">Checked in</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          {checkedInDates.length} check-ins this month
        </p>
      </div>
    </div>
  );
}
