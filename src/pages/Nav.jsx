
import React from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../components/section/Main';

const Nav = () => {
    const location = useLocation();
    const { startStation = '미선택', endStation = '미선택' } = location.state || {};
    return (
        <Main 
            title = "추천 영상"
            description="오늘의 추천 유튜브 영상입니다.">
            
            
            <div>
                <h1>길찾기 결과</h1>
                <p>출발지: {startStation}</p>
                <p>도착지: {endStation}</p>
                {/* 여기에 길찾기 결과를 렌더링 */}
            </div>

                
        </Main>
    )
}

export default Nav