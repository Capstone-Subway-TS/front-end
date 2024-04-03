import React from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../components/section/Main';

const Nav = () => {
    const location = useLocation();
    const { startStation = '미선택', endStation = '미선택' } = location.state || {};

    return (
        <Main title="실시간 길찾기" description="실시간 길찾기 페이지">
            <div className="resultsContainer">
                <h1 className="resultsHeader">길찾기 결과</h1>
                <p className="resultItem">출발지: {startStation}</p>
                <p className="resultItem">도착지: {endStation}</p>
            </div>
        </Main>
    )
}

export default Nav;