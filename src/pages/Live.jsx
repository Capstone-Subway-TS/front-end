import React from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../components/section/Main';

const Live = () => {
    const location = useLocation();
    const stationName = location.state && location.state.stationName;

    return (
        <Main
            title="상행하행"
            description="테스트 페이지"
        >
            {/* stationName이 존재하는 경우에만 아래 내용을 표시 */}
            {stationName && (
                <div>
                    <h2>실시간 도착 정보: {stationName}</h2>
                    {/* 실시간 도착 정보를 표시하는 컴포넌트나 로직을 추가할 수 있습니다. */}
                </div>
            )}
            {/* stationName이 존재하지 않는 경우에만 아래 내용을 표시 */}
            {!stationName && (
                <div>
                    <h1>실시간 도착정보가 없습니다.</h1>
                    <h4>지도에서 실시간 도착정보를 클릭해주세요.</h4>
                </div>
            )}
        </Main>
    );
};

export default Live;
