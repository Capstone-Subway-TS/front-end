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
        let dayType;
        
        if (day === 0) {
            dayType = '일요일';
        } else if (day === 6) {
            dayType = '토요일';
        } else {
            dayType = '평일';
        }
        
        setWeekday(dayType);
    };
    
    const getDayType = (date) => {
        const day = date.getDay();
        if (day === 0) {
            return '일요일';
        } else if (day === 6) {
            return '토요일';
        } else {
            return '평일';
        }
    };
    
    const navigateToNavPage = () => {
        // 시간, 분, 날짜가 선택되지 않은 경우 현재 시스템 시간 사용
        const navHour = hour !== '' ? hour : new Date().getHours();
        const navMinute = minute !== '' ? minute : new Date().getMinutes();
        const navDate = selectedDate ? selectedDate : new Date();
        const dayType = getDayType(navDate);
    
        setHour(navHour);
        setMinute(navMinute);
        setSelectedDate(navDate);
        setWeekday(dayType);
    
        navigate('/nav', { state: { startStation, endStation, hour: navHour, minute: navMinute, weekday: dayType } });
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
                    <select id="hour" value={hour} onChange={(e) => setHour(e.target.value)} style={{ textAlign: 'center', width: '60px' }}>
                        <option value="">선택</option>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i < 10 ? `0${i}` : `${i}`}>{i < 10 ? `0${i}` : `${i}`}</option>
                        ))}
                    </select>
                </div>
                <div className="time-row">
                    <label htmlFor="minute">분:</label>
                    <select id="minute" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ textAlign: 'center', width: '60px' }}>
                        <option value="">선택</option>
                        {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i < 10 ? `0${i}` : `${i}`}>{i < 10 ? `0${i}` : `${i}`}</option>
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
