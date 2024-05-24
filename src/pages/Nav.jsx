import React, { useEffect, useState } from 'react';
import Main from '../components/section/Main';
import { useSelector } from 'react-redux';
import { getCurrentTime, getDayType } from '../data/time';



const Nav = () => {
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);

    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [dayType, setDayType] = useState(getDayType());




    useEffect(() => {


        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);

        return () => clearInterval(timer);

        
    }, []);

    const yellowSegmentWidth = 30;
    const greenSegmentWidth = 60;
    const totalWidth = yellowSegmentWidth + greenSegmentWidth;

    const startPoint = { x: 0, y: 10 };
    const endPoint = { x: totalWidth, y: 10 };

    return (
        <Main title="실시간 길찾기" description="실시간 길찾기 페이지">
            <div className="resultsContainer">
                <h1 className="resultsHeader">길찾기 결과</h1>
                {startStation && (
                    <p className="resultItem">출발지: {startStation}</p>
                )}
                {endStation && (
                    <p className="resultItem">도착지: {endStation}</p>
                )}
                {!startStation && <p className="resultItem">출발지 정보가 없습니다.</p>}
                {!endStation && <p className="resultItem">도착지 정보가 없습니다.</p>}
            </div>
            <div className="resultsMap">
                <h1 className="resultsHeader">추천 경로</h1>
                <h3 className="">예상 시간</h3>
                <svg width={totalWidth} height="20">
                    <rect x="0" y="0" width={yellowSegmentWidth} height="20" fill="yellow" />
                    <rect x={yellowSegmentWidth} y="0" width={greenSegmentWidth} height="20" fill="green" />
                    <circle cx={startPoint.x} cy={startPoint.y} r="5" fill="blue" />
                    <circle cx={endPoint.x} cy={endPoint.y} r="5" fill="red" />
                </svg>
            </div>
            <div className="currentTimeContainer">
                <p className="currentTime">현재 시간: {currentTime}</p>
                <p className="dayType">오늘은 {dayType}입니다.</p>
            </div>
        </Main>
    )
}

export default Nav;