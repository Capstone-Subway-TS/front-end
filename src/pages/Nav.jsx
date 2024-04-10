
import React from 'react';
import Main from '../components/section/Main';
import { useSelector } from 'react-redux'; // useSelector 추가

const Nav = () => {

    // useSelector를 통해 Redux store에서 startStation과 endStation 가져오기
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);
    
    const yellowSegmentWidth = 30; // 노란색 세그먼트의 너비
    const greenSegmentWidth = 60; // 초록색 세그먼트의 너비
    const totalWidth = yellowSegmentWidth + greenSegmentWidth; // 전체 너비

    const startPoint = { x: 0, y: 10 }; // 출발지 위치
    const endPoint = { x: totalWidth, y: 10 }; // 도착지 위치

    return (
        <Main title="실시간 길찾기" description="실시간 길찾기 페이지">
            <div className="resultsContainer">
                <h1 className="resultsHeader">길찾기 결과</h1>
                <p className="resultItem">출발지: {startStation}</p>
                <p className="resultItem">도착지: {endStation}</p>
            </div>
            <div className="resultsMap">
                <h1 className="resultsHeader">추천 경로</h1>
                <h3 className="">예상 시간</h3>
                <svg width={totalWidth} height="20">
                {/* 노란색 세그먼트 */}
                <rect x="0" y="0" width={yellowSegmentWidth} height="20" fill="yellow" />
                {/* 초록색 세그먼트 */}
                <rect x={yellowSegmentWidth} y="0" width={greenSegmentWidth} height="20" fill="green" />
                {/* 출발지 점 */}
                <circle cx={startPoint.x} cy={startPoint.y} r="5" fill="blue" />
                {/* 도착지 점 */}
                <circle cx={endPoint.x} cy={endPoint.y} r="5" fill="red" />
                </svg>

            </div>
        </Main>
    )
}

export default Nav;
