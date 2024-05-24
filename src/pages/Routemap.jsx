import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as d3 from 'd3';
import subwayData from '../data/route.json';
import Main from '../components/section/Main';
import mark from '../assets/img/icon/환승역_마크.png';
import { IoSearch } from "react-icons/io5";
import { setStartStation, setEndStation } from '../data/actions';
import Right from '../components/section/Right'; // 추가


const Routemap = () => {
    const ref = useRef();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [departureStation, setDepartureStation] = useState(null);
    const [arrivalStation, setArrivalStation] = useState(null);
    const [isRightVisible, setIsRightVisible] = useState(false); // 추가
    const [stationName, setStationName] = useState(null);


    const toggleRightVisibility = (name = null) => {
        setIsRightVisible(!isRightVisible);
        setStationName(name);
    };

    useEffect(() => {
        const svg = d3.select(ref.current)
            .on("click", () => {
                d3.select(".tooltip").remove();
            }, true)
            .attr('width', 1500)
            .attr('height', 1800);
        svg.selectAll("*").remove();

        const svgContainer = svg.append("g")
            .attr("id", "svg-container");


        // 스케일 설정
        const xScale = d3.scaleLinear()
            .domain(d3.extent(subwayData, d => parseFloat(d.x)))
            .range([0, 500]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(subwayData, d => parseFloat(d.y)))
            .range([500, 0]);
        

        // 노선별 색상 설정
        const lineColor = (line) => {
            if (line === "1호선") return "#0D3692";
            if (line === "1호선1") return "#0D3692";
            if (line === "2호선") return "#33A23D";
            if (line === "2호선1") return "#33A23D";
            if (line === "2호선2") return "#33A23D";
            if (line === "3호선") return "#FE5B10";
            if (line === "4호선") return "#00A2D1";
            if (line === "5호선") return "#8B50A4";
            if (line === "5호선1") return "#8B50A4";
            if (line === "6호선") return "#C55C1D";
            if (line === "6호선1") return "#C55C1D";
            if (line === "7호선") return "#54640D";
            if (line === "8호선") return "#F14C82";
            if (line === "9호선") return "#AA9872";

            if (line === "수인분당선") return "#FFEB2A";
            if (line === "경의중앙선") return "#72C7A6";
            if (line === "경의중앙선1") return "#72C7A6";
            if (line === "경춘선") return "#2ABFD0";
            if (line === "공항철도1호선") return "#0065B3";
            if (line === "신림선") return "#6789CA";
            if (line === "우이신설선") return "#B7C452";
            if (line === "김포골드라인") return "#AD8605";
            return "black"; // 기본 색상
        };

        // 데이터를 라인별로 그룹화
        const groupedData = d3.group(subwayData, d => d.line);

        // 각 그룹(라인)을 순회하고 선과 원을 그립니다
        for (const [line, lineData] of groupedData) {
            const lineGenerator = d3.line()
                .x(d => xScale(parseFloat(d.x)) * 4)
                .y(d => yScale(parseFloat(d.y)) * 3.7 -200)
                .curve(d3.curveLinear);

            svgContainer.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", lineColor(line))
                .attr("stroke-width", 7)
                .attr("d", lineGenerator);

            // 각 라인에 대한 원(역) 추가
            svgContainer.selectAll(`.station-${line}`) // 라인별로 클래스를 구분하여 선택
                .data(lineData)
                .enter()
                .append("circle")
                .attr("class", `station station-${line}`) // 라인별 클래스 추가
                .attr("cx", d => xScale(parseFloat(d.x)) * 4) // x 좌표에 3을 곱하여 3배로 확장
                .attr("cy", d => yScale(parseFloat(d.y)) * 3.7 -200) // y 좌표에 3을 곱하여 3배로 확장
                .attr("r", 10)
                .attr("fill", d => lineColor(line)) // 동그라미의 색상을 라인의 색상에 따라 설정
                .attr("stroke", lineColor(line))
                .attr("stroke-width", 1)
                .on("click", function (event, d) {
                    event.stopPropagation(); // 이벤트 버블링 방지
                    const [clickX, clickY] = d3.pointer(event, svg.node());
                    showTooltip(d, clickX, clickY);
                });
        }

        // 중복된 역을 찾아 환승 역 이미지를 추가합니다.
        const transferStationsData = subwayData.filter((d, i) => {
            return subwayData.findIndex(e => e.name === d.name && e.line[0] !== d.line[0]) !== -1;
        });

        // 환승역 이미지를 추가합니다.
        const transferStations = svgContainer.selectAll(".transfer-station")
            .data(transferStationsData)
            .enter()
            .append("image")
            .attr("class", "transfer-station")
            .attr("xlink:href", mark) // 환승역 이미지 파일 경로로 수정해주세요
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", d => xScale(parseFloat(d.x)) * 4-10) // 이미지 중심을 원점으로 설정하기 위해 가로폭의 절반만큼 왼쪽으로 이동
            .attr("y", d => yScale(parseFloat(d.y)) * 3.7 -200-10); // 이미지 중심을 원점으로 설정하기 위해 세로폭의 절반만큼 위쪽으로 이동


        // 이미지 위에 툴팁을 표시할 수 있도록 설정합니다.
        transferStations.on("click", function (event, d) {
            const [clickX, clickY] = d3.pointer(event, svg.node());
            showTooltip(d, clickX, clickY);

            // 다른 곳을 클릭했을 때 툴팁을 제거합니다.
            d3.select(document).on("click.tooltip", function() {
                d3.select(".tooltip").remove();
                d3.select(document).on("click.tooltip", null); // 클릭 이벤트 리스너 제거
            });

            // 클릭 이벤트 전파 방지
            event.stopPropagation();
        });


        // 점 하단에 이름 추가
        svgContainer.selectAll(".station-name")
            .data(subwayData)
            .enter()
            .append("text")
            .attr("class", "station-name")
            .attr("x", d => xScale(parseFloat(d.x)) * 4) // 역 이름에도 2를 곱하여 2배로 확장
            .attr("y", d => yScale(parseFloat(d.y)) * 3.7 -200 + 20) // 역 이름에도 2를 곱하여 2배로 확장
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr("font-weight", "bold") // 굵은 텍스트 설정
            .text(d => d.name);


        // 말풍선 표시 함수
        const showTooltip = (data, clickX, clickY) => {
            d3.select(".tooltip").remove(); // 기존 툴팁 제거

            const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", `translate(${clickX}, ${clickY - 120})`);

            tooltip.append("rect")
                .attr("width", 350)
                .attr("height", 100) // Increased height to accommodate the new button
                .attr("x", -140)
                .attr("y", 0)
                .attr("fill", "white")
                .attr("stroke", "black");

            tooltip.append("text")
                .attr("x", 20)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .text(data.name);

            // 버튼 데이터 배열
            const buttons = [
                { text: '출발', x: -90, y: 70, color: '#90ee90' }, // Green color for 출발 button
                { text: '도착', x: -10, y: 70, color: '#f0f0f0' },   // Gray color for 도착 button
                { text: '실시간 도착정보', x: 70, y: 70, color: '#ff6347' ,width: 160, newx:115} // Red color for 실시간 도착정보 button
            ];
            // 버튼 생성
            buttons.forEach(button => {
                // 버튼 배경
                tooltip.append("rect")
                    .attr("x", button.x - 35)
                    .attr("y", button.y - 20)
                    .attr("width", button.width || 70)
                    .attr("height", 40)
                    .attr("fill", button.color)
                    .attr("rx", 5) // 둥근 모서리
                    .style("cursor", "pointer")
                    .on("click", () => {
                        if (button.text === "닫기") {
                            tooltip.remove();
                        } else {
                            if (button.text === "출발") {
                                setDepartureStation(data.name);
                                dispatch(setStartStation(data.name)); // Redux store 업데이트
                            } else if (button.text === "도착") {
                                setArrivalStation(data.name);
                                dispatch(setEndStation(data.name)); // Redux store 업데이트
                            } else if (button.text === "실시간 도착정보") {
                                toggleRightVisibility(data.name);
                            }
                        }
                    });

                // 버튼 텍스트
                tooltip.append("text")
                .attr("x", button.newx || button.x)
                .attr("y", button.y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .text(button.text)
                .style("cursor", "pointer")
                .on("click", () => {
                        if (button.text === "닫기") {
                            tooltip.remove();
                        } else {
                        }
                    });
            });

            
        };

        // 검색어 처리 로직
        if (isSearching && searchTerm.trim() !== '') {
            const searchedStation = subwayData.find(station => station.name.includes(searchTerm.trim()));
            if (searchedStation) {
                // 검색된 역의 위치에 말풍선 표시
                const [searchedX, searchedY] = [xScale(parseFloat(searchedStation.x)) * 4, yScale(parseFloat(searchedStation.y)) * 3.7 - 200];
                showTooltip(searchedStation, searchedX, searchedY);
            }
        }

        

    }, [isSearching, searchTerm,dispatch]);


    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
    };
    
    
    return (
        <Main
            title="지하철 노선도"
            description="지하철 노선도 페이지"
            departureStation={departureStation}
            arrivalStation={arrivalStation}
        >
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
                </div>
            </div>
            <div
                id="picture"
                style={{
                    width: 'calc(100vw - 260px)',
                    height: 'calc(100vh - 60px)',
                    overflow: 'auto', // 스크롤 추가
                    position: 'relative'
                }}
            >
                <svg
                    ref={ref}
                    viewBox={`${-30} ${800} ${2200} ${800}`}
                    style={{
                        width: '100%',
                        minHeight: '100%', // 최소 높이 설정
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                ></svg>
            </div>
            {isRightVisible && <Right isVisible={isRightVisible} toggleRightVisibility={toggleRightVisibility} stationName={stationName} />} {/* Right 컴포넌트 렌더링 */}
        </Main>
    );
    
};

export default Routemap;