import { startOfWeek, endOfWeek, subDays, format } from 'date-fns';

export const getWeekRange = (date: Date = new Date()) => {
    return {
        start: startOfWeek(date, { weekStartsOn: 1 }), // Monday start
        end: endOfWeek(date, { weekStartsOn: 1 })
    };
};

export const getLast7DaysRange = (date: Date = new Date()) => {
    const end = date;
    const start = subDays(date, 7);
    return { start, end };
};
