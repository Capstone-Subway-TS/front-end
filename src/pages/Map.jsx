import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Main from '../components/section/Main'
import subwayData from '../data/seoulsubwaydata.json'
import { FaLongArrowAltRight } from "react-icons/fa";
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
    "경강선": "#003DA5",
    "경의선": "#77C4A3",
    "경춘선": "#0C8E72",
    "공항철도": "#3681B7",
    "분당선": "#F5A200",
    "서해선": "#81A914",
    "수인선": "#F06A00",
    "신분당선": "#D4003B",
    "안산선": "#00A5DE",
    "우이신설경전철": "#B0CE18",
    "의정부경전철": "#FFD400",
    "인천1호선": "#8CADCB",
    "인천2호선": "#F5A200",
    "인천선": "#FF8000",
    "일산선": "#B0CE18",
    "장항선": "#F5A200",
    "중앙선": "#77C4A3",
    "김포도시철도": "#BDB092",
    "신림선": "#738C00",
    "용인경전철": "#509F22",
    "경전철의정부": "#FFD400",
    "김포골드라인": "#A17E46",
    "인천공항 자기부상철도": "#0B4CA2",

    // 추가 노선에 대한 이미지 URL...
};

const Map = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [map, setMap] = useState(null); // 지도 인스턴스 상태 관리
    const [startStation, setStartStation] = useState(''); // 출발지 상태 관리
    const [endStation, setEndStation] = useState(''); // 도착지 상태 관리
    

    //정보 넘겨주기
    const navigate = useNavigate();

    const navigateToRouteResult = () => {
        // navigate 함수를 사용하여 페이지 이동 및 state 전달
        navigate('/nav', { state: { startStation, endStation } });
    };



    useEffect(() => {
        window.setStation = (stationName, type) => {
            if (type === 'start') {
                setStartStation(stationName);
            } else if (type === 'end') {
                setEndStation(stationName);
            }
        };
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=a576239cea9ab4b2daf2a00e251e97e9&autoload=false";
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => {
        window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map'),
        mapOption = {
            center: new window.kakao.maps.LatLng(37.5503, 127.0731),//세종대학교 위치
            level: 5
    };
    
    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    setMap(map); // 지도 인스턴스를 상태에 저장
    
    //
    
    //
    subwayData.forEach((station, index) => {
        const markerPosition = new window.kakao.maps.LatLng(station.y, station.x);
    
        // 노선에 맞는 이미지 URL을 가져옵니다.
        const markerImageSrc = lineImages[station.line]; // 해당 역의 노선에 맞는 이미지
        const markerImageSize = new window.kakao.maps.Size(24, 30); // 마커 이미지의 크기
        const markerImageOption = {offset: new window.kakao.maps.Point(12, 35)}; // 마커 이미지의 옵션(이미지의 중심점 설정)
    
        // 마커 이미지 객체를 생성합니다.
        const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);
    
        // 마커를 생성하고 지도에 표시합니다.
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map,
            image: markerImage // 마커 이미지 설정
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
        
/*

const lineColors = {
    "1호선": "#0D3692",
    "2호선": "#33A23D",
    "3호선": "#FE5B10",
    "4호선": "#00A2D1",
    "5호선": "#8B50A4",
    "6호선": "#C55C1D",
    "7호선": "#54640D",
    "8호선": "#F14C82",
    "9호선": "#AA9872",
    "경강선": "#003DA5",
    "경의선": "#77C4A3",
    "경춘선": "#0C8E72",
    "공항철도": "#3681B7",
    "분당선": "#F5A200",
    "서해선": "#81A914",
    "수인선": "#F06A00",
    "신분당선": "#D4003B",
    "안산선": "#00A5DE",
    "우이신설경전철": "#B0CE18",
    "의정부경전철": "#FFD400",
    "인천1호선": "#8CADCB",
    "인천2호선": "#F5A200",
    "인천선": "#FF8000",
    "일산선": "#B0CE18",
    "장항선": "#F5A200",
    "중앙선": "#77C4A3",
    "김포도시철도": "#BDB092",
    "신림선": "#738C00",
    "용인경전철": "#509F22",
    "경전철의정부": "#FFD400",
    "김포골드라인": "#A17E46",
    "인천공항 자기부상철도": "#0B4CA2",

};
const lines = subwayData.reduce((acc, curr) => {
    acc[curr.line] = acc[curr.line] || [];
    acc[curr.line].push(new window.kakao.maps.LatLng(curr.lat, curr.lng));
    return acc;
}, {});

Object.keys(lines).forEach(line => {
    const polyline = new window.kakao.maps.Polyline({
        path: lines[line],
        strokeWeight: 5,
        strokeColor: lineColors[line] || "#FFAE00", // 기본 색상
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
    });

    polyline.setMap(map);
});
*/
    const overlay = new window.kakao.maps.CustomOverlay({
        content: content,
        position: marker.getPosition(),
        yAnchor: 1
    });
  
            window.kakao.maps.event.addListener(marker, 'click', function() {
              overlay.setMap(map);
              document.querySelectorAll('.wrap').forEach(el => el.style.display = 'none'); // 다른 오버레이 숨기기
              document.getElementById(`overlay-${index}`).style.display = 'block'; // 현재 오버레이 표시
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
      }
    }, []);
  
    const handleSearch = (e) => {
        e.preventDefault(); // 폼 제출 이벤트 기본 동작 방지
        const station = subwayData.find(station => station.name.includes(searchTerm));
        if (station && map) {
          const moveLatLon = new window.kakao.maps.LatLng(station.y, station.x);
          map.setCenter(moveLatLon); // 검색된 지하철역 위치로 지도 중심 이동
          map.setLevel(4); // 확대 수준 조정 
        }
      };
    
    

    return (
        <Main title="지도" description="지도 페이지">
            <div className="search-container">
  <div className="search-form">
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="  지하철역 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">검색</button>
    </form>
    <div className="route-box">
      <div className="route-info">출발지: {startStation}</div>
      <FaLongArrowAltRight />
      <div className="route-info">도착지: {endStation}</div>
      <button onClick={navigateToRouteResult}>길찾기</button>
    </div>
  </div>
</div>
          <div id="map">지도 로딩중...</div>
        </Main>
    );
};
    
export default Map;