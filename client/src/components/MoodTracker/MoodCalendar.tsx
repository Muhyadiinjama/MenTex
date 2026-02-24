import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isToday,
    isAfter,
    startOfToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MoodCalendar.css';

interface MoodEntry {
    _id: string;
    emoji: string;
    moodScore: number;
    note: string;
    timestamp: string;
}

interface MoodCalendarProps {
    history: MoodEntry[];
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ history }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <div className="calendar-header">
                <button onClick={handlePrevMonth} className="calendar-nav-btn" title="Previous Month">
                    <ChevronLeft size={20} />
                </button>
                <div className="calendar-current-month">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button onClick={nextMonth} className="calendar-nav-btn" title="Next Month">
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="calendar-days-row">
                {days.map((day, i) => (
                    <div key={i} className="calendar-day-label">{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const calendarDays = eachDayOfInterval({
            start: startDate,
            end: endDate,
        });

        return (
            <div className="calendar-grid">
                {calendarDays.map((date, i) => {
                    const dayMoods = history.filter(h => isSameDay(new Date(h.timestamp), date));
                    const latestMood = dayMoods.length > 0 ? dayMoods[dayMoods.length - 1] : null;

                    return (
                        <div
                            key={i}
                            className={`calendar-cell 
                                ${!isSameMonth(date, monthStart) ? 'disabled' : ''} 
                                ${isToday(date) ? 'today' : ''} 
                                ${latestMood ? 'has-mood' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className="cell-number">{format(date, 'd')}</span>
                            {latestMood && (
                                <span className="cell-emoji">{latestMood.emoji}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (selectedDate) {
        const dayMoods = history.filter(h => isSameDay(new Date(h.timestamp), selectedDate))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
            <div className="day-details-container animate-slideIn">
                <div className="details-header-premium">
                    <button className="back-btn-premium" onClick={() => setSelectedDate(null)}>
                        <ChevronLeft size={20} />
                        <span>Back</span>
                    </button>
                    <div className="details-date-title">
                        <h3>{format(selectedDate, 'MMMM d, yyyy')}</h3>
                        <p>{dayMoods.length} {dayMoods.length === 1 ? 'check-in' : 'check-ins'}</p>
                    </div>
                </div>

                <div className="day-entries-scroll">
                    {dayMoods.length > 0 ? (
                        dayMoods.map((entry) => (
                            <div key={entry._id} className="premium-mood-entry">
                                <div className="entry-left">
                                    <span className="entry-emoji">{entry.emoji}</span>
                                    <div className="entry-info">
                                        <span className="entry-label">
                                            {entry.moodScore === 5 ? 'Great' : entry.moodScore === 4 ? 'Okay' : entry.moodScore === 3 ? 'Tired' : entry.moodScore === 2 ? 'Anxious' : 'Sad'}
                                        </span>
                                        <span className="entry-time">
                                            {format(new Date(entry.timestamp), 'h:mm a')}
                                        </span>
                                    </div>
                                </div>
                                {entry.note && (
                                    <div className="entry-note-box">
                                        <p>{entry.note}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-day-state">
                            {isAfter(selectedDate, startOfToday()) ? (
                                <p className="status-text-premium">Coming Soon</p>
                            ) : (
                                <p className="status-text-premium">No history</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mood-calendar-wrapper animate-fadeIn">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default MoodCalendar;
