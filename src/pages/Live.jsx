import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../components/section/Main';

const Live = () => {
    const location = useLocation();
    const stationId = location.state && location.state.stationId;
    const [congestionData, setCongestionData] = useState(null);

    console.log(stationId);

    useEffect(() => {
        if (stationId) {
            
            fetch(`https://apis.openapi.sk.com/puzzle/subway/congestion/stat/car/stations/${stationId}?dow=TUE&hh=08`, {
                method: 'GET',
                headers: {
                    'appkey': '{5W2bkDqBrC4kWrij4ZizS5yuhe5U5mdI7bT3ZaGJ}'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setCongestionData(data))
            .catch(error => console.error('There was a problem with your fetch operation:', error));
        }
    }, [stationId]);

    return (
        <Main
            title="상행하행"
            description="테스트 페이지"
        >
            {/* stationId가 존재하는 경우에만 아래 내용을 표시 */}
            {congestionData && (
                <div>
                    <h2>{congestionData.stationName}의 혼잡도 정보</h2>
                    <p>혼잡도: {congestionData.congestion}</p>
                    {/* 혼잡도 정보에 따라 추가적인 표시를 할 수 있음 */}
                </div>
            )}
            {/* stationId가 존재하지 않는 경우에만 아래 내용을 표시 */}
            
                <div>
                    <h1>실시간 도착정보가 없습니다.</h1>
                    <h4>지도에서 실시간 도착정보를 클릭해주세요.</h4>
                </div>
            
        </Main>
    );
};

export default Live;
