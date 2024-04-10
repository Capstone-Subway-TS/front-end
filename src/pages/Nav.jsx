import React from 'react';
import Main from '../components/section/Main';
import { useSelector } from 'react-redux';

const Nav = () => {
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);

    const yellowSegmentWidth = 30;
    const greenSegmentWidth = 60;
    const totalWidth = yellowSegmentWidth + greenSegmentWidth;

    const startPoint = { x: 0, y: 10 };
    const endPoint = { x: totalWidth, y: 10 };

    return (
        <Main title="실시간 길찾기" description="실시간 길찾기 페이지">
            <div className="resultsContainer">
                <h1 className="resultsHeader">길찾기 결과</h1>
                {/* 데이터가 존재하는 경우에만 출발지와 도착지 정보 표시 */}
                {startStation && (
                    <p className="resultItem">출발지: {startStation}</p>
                )}
                {endStation && (
                    <p className="resultItem">도착지: {endStation}</p>
                )}
                {/* 데이터가 없는 경우에 대체 내용 표시 */}
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
        </Main>
    )
}

export default Nav;
