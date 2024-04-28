import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Right = ({ isVisible, toggleRightVisibility, stationName }) => {
    const handleClose = () => {
        toggleRightVisibility();
    };

    return (
        <div id='right' className={isVisible ? '' : 'hidden'}>
            <h1>{stationName}</h1>
            <h4>실시간 도착 정보 관련 정보들 넣을 페이지</h4>
            <button onClick={handleClose}>닫기</button>
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
        </div>
    );
};
export default Right;
