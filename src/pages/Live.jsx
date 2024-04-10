import React from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../components/section/Main';

const Live = () => {
    // useLocation 훅을 사용하여 location 객체 가져오기
    const location = useLocation();

    // location.state에서 전달받은 stationName 가져오기
    const stationName = location.state && location.state.stationName;

    return (
        <Main
            title="상행하행"
            description="테스트 페이지"
        >
            {/* stationName이 존재하는 경우에만 표시 */}
            {stationName && (
                <div>
                    <h2>실시간 도착 정보: {stationName}</h2>
                    {/* 여기에 실시간 도착 정보를 표시하는 컴포넌트나 로직을 추가할 수 있습니다. */}
                </div>
            )}
        </Main>
    );
};

export default Live;
