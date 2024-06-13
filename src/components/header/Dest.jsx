/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTime } from '../../data/TimeContext';

const Dest = () => {
    const navigate = useNavigate();
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);
    const { hour, setHour, minute, setMinute, weekday, setWeekday } = useTime(); // useTime에서 weekday와 setWeekday 가져오기
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const day = date.getDay();
        setWeekday(day === 0 || day === 6 ? '주말' : '평일');
    };

    const navigateToNavPage = () => {
        navigate('/nav', { state: { startStation, endStation, hour, minute, weekday } });
    };

    return (
        <div className="dest-container">
            <div className="dest-details">
                {startStation ? (
                    <h2 className="dest-heading">출발지: <span className="dest-label">{startStation}</span></h2>
                ) : (
                    <h2 className="dest-heading">출발지 정보가 없습니다.</h2>
                )}
                {endStation ? (
                    <h2 className="dest-heading">도착지: <span className="dest-label">{endStation}</span></h2>
                ) : (
                    <h2 className="dest-heading">도착지 정보가 없습니다.</h2>
                )}
            </div>
            <div className="time-selection">
                <div className="time-row">
                    <label htmlFor="hour">시간:</label>
                    <select id="hour" value={hour} onChange={(e) => setHour(e.target.value)}>
                        <option value="" disabled>시간 선택</option>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>{i < 10 ? `0${i}` : i}</option>
                        ))}
                    </select>
                </div>
                <div className="time-row">
                    <label htmlFor="minute">분:</label>
                    <select id="minute" value={minute} onChange={(e) => setMinute(e.target.value)}>
                        <option value="" disabled>분 선택</option>
                        {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>{i < 10 ? `0${i}` : i}</option>
                        ))}
                    </select>
                </div>
                <div className="time-row">
                    <label htmlFor="weekday">날짜:</label>
                    <DatePicker 
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="날짜 선택"
                        className="custom-datepicker"
                    />
                </div>
            </div>
            <button className="dest-button" onClick={navigateToNavPage}>실시간 길찾기</button>
        </div>
    );
};

export default Dest;
*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTime } from '../../data/TimeContext';

const Dest = () => {
    const navigate = useNavigate();
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);
    const { hour, setHour, minute, setMinute, weekday, setWeekday, selectedDate, setSelectedDate } = useTime();

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const day = date.getDay();
        setWeekday(day === 0 || day === 6 ? '주말' : '평일');
    };

    const navigateToNavPage = () => {
        navigate('/nav', { state: { startStation, endStation, hour, minute, weekday } });
    };

    return (
        <div className="dest-container">
            <div className="dest-details">
                {startStation ? (
                    <h2 className="dest-heading">출발지: <span className="dest-label">{startStation}</span></h2>
                ) : (
                    <h2 className="dest-heading">출발지 정보가 없습니다.</h2>
                )}
                {endStation ? (
                    <h2 className="dest-heading">도착지: <span className="dest-label">{endStation}</span></h2>
                ) : (
                    <h2 className="dest-heading">도착지 정보가 없습니다.</h2>
                )}
            </div>
            <div className="time-selection">
                <div className="time-row">
                    <label htmlFor="hour">시간:</label>
                    <select id="hour" value={hour} onChange={(e) => setHour(e.target.value)} style={{ textAlign: 'center',width: '30px' }}>
                        <option value="" disabled>시간 선택</option>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>{i < 10 ? `0${i}` : i}</option>
                        ))}
                    </select>
                </div>
                <div className="time-row">
                    <label htmlFor="minute">분:</label>
                    <select id="minute" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ textAlign: 'center',width: '30px' }}>
                        <option value="" disabled>분 선택</option>
                        {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>{i < 10 ? `0${i}` : i}</option>
                        ))}
                    </select>
                </div>
                <div className="time-row" >
                    <label htmlFor="weekday">날짜:</label>
                    <DatePicker 
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="날짜 선택"
                        className="custom-datepicker"
                        style="width: 80px"

                    />
                </div>
            </div>
            <button className="dest-button" onClick={navigateToNavPage}>실시간 길찾기</button>
        </div>
    );
};

export default Dest;
