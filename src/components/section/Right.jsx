import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";


const Right = ({ isVisible, toggleRightVisibility, stationName }) => {
    const handleClose = () => {
        toggleRightVisibility();
    };

    const [stationId, setStationId] = useState(null);
    const [congestionData, setCongestionData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchStationId = async () => {
            try {
                // 모든 지하철역 정보 가져오기
                const response = await fetch('https://apis.openapi.sk.com/puzzle/subway/meta/stations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const stations = await response.json();

                // 선택한 역 이름과 맞는 stationId 찾기
                const selectedStation = stations.find(station => station.name === stationName);
                if (selectedStation) {
                    setStationId(selectedStation.id);

                    // stationId를 이용하여 혼잡도 정보 가져오기
                    const congestionResponse = await fetch(`https://apis.openapi.sk.com/puzzle/subway/congestion/stat/car/stations/${selectedStation.id}?dow=TUE&hh=08`, {
                        method: 'GET',
                        headers: {
                            'appkey': 'PEKSyFHvkl5imbyfUyw8D2gFUcgqSnxu4d3c8keS'
                        }
                    });
                    if (!congestionResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const congestionData = await congestionResponse.json();
                    setCongestionData(congestionData);
                }
            } catch (error) {
                console.error('There was a problem with your fetch operation:', error);
            }
        };

        fetchStationId();
    }, [stationName]);

    return (
        <div id='right' className={isVisible ? '' : 'hidden'}>
            <div className="close-button-container">
                <button className="close-button" onClick={handleClose}><IoCloseOutline/></button>
            </div>
            <h1>{stationName}</h1>
            <h4>실시간 도착 정보 관련 정보들 넣을 페이지</h4>
            {stationName && (
                <div>
                    <h2>실시간 도착 정보: {stationName}</h2>
                </div>
            )}
            {!stationName && (
                <div>
                    <h1>실시간 도착정보가 없습니다.</h1>
                    <h4>지도에서 실시간 도착정보를 클릭해주세요.</h4>
                </div>
            )}
    
            {/* stationId가 존재하는 경우에만 아래 내용을 표시 */}
            {congestionData && (
                <div>
                    <h2>{congestionData.stationName}의 혼잡도 정보</h2>
                    <p>혼잡도: {congestionData.congestion}</p>
                    {/* 혼잡도 정보에 따라 추가적인 표시를 할 수 있음 */}
                </div>
            )}
        </div>
    );
    
};
export default Right;
