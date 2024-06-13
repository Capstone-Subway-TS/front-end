// TimeContext.js
import React, { createContext, useState, useContext } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');

    return (
        <TimeContext.Provider value={{ hour, setHour, minute, setMinute }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = () => useContext(TimeContext);
