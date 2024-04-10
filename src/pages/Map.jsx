import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // useSelector 추가
import Main from '../components/section/Main';
import subwayData from '../data/seoulsubwaydata.json';
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { setStartStation, setEndStation } from '../data/actions'; // 액션 임포트 추가

import line1 from '../assets/img/subwaymapmarker/1호선마커.png';
import line2 from '../assets/img/subwaymapmarker/2호선마커.png';
import line3 from '../assets/img/subwaymapmarker/3호선마커.png';
import line4 from '../assets/img/subwaymapmarker/4호선마커.png';
import line5 from '../assets/img/subwaymapmarker/5호선마커.png';
import line6 from '../assets/img/subwaymapmarker/6호선마커.png';
import line7 from '../assets/img/subwaymapmarker/7호선마커.png';
import line8 from '../assets/img/subwaymapmarker/8호선마커.png';
import line9 from '../assets/img/subwaymapmarker/9호선마커.png';

const lineImages = {
    "1호선": line1,
    "2호선": line2,
    "3호선": line3,
    "4호선": line4,
    "5호선": line5,
    "6호선": line6,
    "7호선": line7,
    "8호선": line8,
    "9호선": line9,
    // 나머지 노선 이미지 URL 추가
};

const Map = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [map, setMap] = useState(null); // 지도 인스턴스 상태 관리
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useSelector를 통해 Redux store에서 startStation과 endStation 가져오기
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);



    const navigateToRouteResult = () => {
        navigate('/nav');
    };

    useEffect(() => {
        // setStation 함수 설정
        window.setStation = (stationName, type) => {
            if (type === 'start') {
                dispatch(setStartStation(stationName)); // Redux store에 출발지 설정 액션 디스패치
            } else if (type === 'end') {
                dispatch(setEndStation(stationName)); // Redux store에 도착지 설정 액션 디스패치
            }
        };

        // Kakao 지도 API 스크립트 로드
        const script = document.createElement('script');
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=a576239cea9ab4b2daf2a00e251e97e9&autoload=false";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(37.5503, 127.0731), // 세종대학교 위치
                    level: 5
                };

                const map = new window.kakao.maps.Map(mapContainer, mapOption);
                setMap(map); // 지도 인스턴스를 상태에 저장

                subwayData.forEach((station, index) => {
                    const markerPosition = new window.kakao.maps.LatLng(station.y, station.x);

                    // 노선에 맞는 이미지 URL 가져오기
                    const markerImageSrc = lineImages[station.line];
                    const markerImageSize = new window.kakao.maps.Size(24, 30);
                    const markerImageOption = { offset: new window.kakao.maps.Point(12, 35) };
                    const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);

                    // 마커 생성 및 지도에 표시
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        map: map,
                        image: markerImage
                    });

                    const content = `
                        <div class="wrap" id="overlay-${index}">
                            <div class="info">
                                <div class="title">
                                    ${station.name}
                                    <div class="close" onclick="document.getElementById('overlay-${index}').style.display='none'" title="닫기"></div>
                                </div>
                                <div class="body">
                                    <div class="desc">
                                        <div class="ellipsis">${station.line} ${station.name}</div>
                                        <div>
                                            <button onclick="setStation('${station.name}', 'start')">출발</button>
                                            <button onclick="setStation('${station.name}', 'end')">도착</button>
                                            <button onclick="window.goToLivePage('${station.name}')">실시간 도착정보</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    const overlay = new window.kakao.maps.CustomOverlay({
                        content: content,
                        position: marker.getPosition(),
                        yAnchor: 1
                    });

                    window.kakao.maps.event.addListener(marker, 'click', function () {
                        overlay.setMap(map);
                        document.querySelectorAll('.wrap').forEach(el => el.style.display = 'none');
                        document.getElementById(`overlay-${index}`).style.display = 'block';
                    });
                });

                window.goToLivePage = (stationName) => {
                    navigate('/live', { state: { stationName } });
                };
            });
        };

        return () => {
            document.head.removeChild(script);
            delete window.goToArrivalPage;
        };
    }, [dispatch, navigate]);

    const handleSearch = (e) => {
        e.preventDefault(); // 기본 동작 방지
        const station = subwayData.find(station => station.name.includes(searchTerm));
        if (station && map) {
            const moveLatLon = new window.kakao.maps.LatLng(station.y, station.x);
            map.setCenter(moveLatLon);
            map.setLevel(4);
        }
    };

    return (
        <Main title="지도" description="지도 페이지">
                <div className="search-container">
                    <div className="search-form">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="지하철역 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit"> <IoSearch size={20} /> </button>
                        </form>
                        <div className="route-box">
                            <div className="route-info">출발지: {startStation}</div>
                            <FaLongArrowAltRight />
                            <div className="route-info">도착지: {endStation}</div>
                            <button onClick={navigateToRouteResult}>실시간 길찾기</button>
                        </div>
                    </div>
                </div>
                <div id="map">지도 로딩중...</div>

        </Main>
    );
};

export default Map;
