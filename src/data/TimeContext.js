// TimeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [weekday, setWeekday] = useState(''); // 요일 상태 추가
    const [selectedDate, setSelectedDate] = useState(null); // 날짜 상태 추가

    

    return (
        <TimeContext.Provider value={{ hour, setHour, minute, setMinute, weekday, setWeekday, selectedDate, setSelectedDate }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => useContext(TimeContext);
