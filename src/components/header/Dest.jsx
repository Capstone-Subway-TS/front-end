import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // useSelector 추가

const Dest = () => {
    const navigate = useNavigate();
    // useSelector를 통해 Redux store에서 startStation과 endStation 가져오기
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);


    const navigateToNavPage = () => {
        navigate('/nav', { state: { startStation, endStation } });
    };

    return (

            <div>
                <h2>출발지: {startStation}</h2>
                <h2>도착지: {endStation}</h2>
                <button onClick={navigateToNavPage}>실시간 길찾기</button>
            </div>
    );
};

export default Dest;
