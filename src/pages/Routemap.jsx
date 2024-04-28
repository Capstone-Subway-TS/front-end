import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import subwayData from '../data/test.json';
import Main from '../components/section/Main';
import mark from '../assets/img/icon/환승역_마크.png';

const Routemap = () => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .on("click", () => { // 배경 클릭 시 툴팁 제거
                d3.select(".tooltip").remove();
            }, true) // true로 설정하여 이벤트 캡처 단계에서 이벤트 리스너가 동작하도록 함
            .attr('width', 1500)
            .attr('height', 1800);
        svg.selectAll("*").remove(); // SVG 요소 내의 모든 자식 요소 제거

        const svgContainer = svg.append("g")
            .attr("id", "svg-container");

        const zoom = d3.zoom()
            .scaleExtent([0.5, 2]) // 확대/축소 범위 설정
            .translateExtent([[0, 0], [2000, 2000]]) // 이동 범위 설정 (SVG 너비와 높이로 변경)
            .on("zoom", zoomed);

        svg.call(zoom);

        function zoomed(event) {
            svgContainer.attr("transform", event.transform);
        }

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
                .x(d => xScale(parseFloat(d.x)) * 2.6)
                .y(d => yScale(parseFloat(d.y)) * 2)
                .curve(d3.curveLinear);

            svgContainer.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", lineColor(line))
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);

            // 각 라인에 대한 원(역) 추가
            svgContainer.selectAll(`.station-${line}`) // 라인별로 클래스를 구분하여 선택
                .data(lineData)
                .enter()
                .append("circle")
                .attr("class", `station station-${line}`) // 라인별 클래스 추가
                .attr("cx", d => xScale(parseFloat(d.x)) * 2.6) // x 좌표에 3을 곱하여 3배로 확장
                .attr("cy", d => yScale(parseFloat(d.y)) * 2) // y 좌표에 3을 곱하여 3배로 확장
                .attr("r", 3)
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
            .attr("width", 10)
            .attr("height", 10)
            .attr("x", d => xScale(parseFloat(d.x)) * 2.6 - 5) // 이미지 중심을 원점으로 설정하기 위해 가로폭의 절반만큼 왼쪽으로 이동
            .attr("y", d => yScale(parseFloat(d.y)) * 2 - 5); // 이미지 중심을 원점으로 설정하기 위해 세로폭의 절반만큼 위쪽으로 이동


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
            .attr("x", d => xScale(parseFloat(d.x)) * 2.6) // 역 이름에도 2를 곱하여 2배로 확장
            .attr("y", d => yScale(parseFloat(d.y)) * 2 + 10) // 역 이름에도 2를 곱하여 2배로 확장
            .attr("text-anchor", "middle")
            .attr("font-size", "4px")
            .attr("fill", "black")
            .attr("font-weight", "bold") // 굵은 텍스트 설정
            .text(d => d.name);

        // SVG에 마우스 드래그로 이동 기능 추가
        svg.call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded)
        );

        let lastX = 0;
        let lastY = 0;

        function dragStarted(event) {
            lastX = event.x;
            lastY = event.y;
        }

        function dragged(event) {
            const newX = lastX - event.x;
            const newY = lastY - event.y;

            svgContainer.attr('transform', `translate(${-newX},${-newY})`);

            lastX = event.x;
            lastY = event.y;
        }

        function dragEnded() {
            // 마우스 드래그 종료 시 필요한 동작 구현
        }

        // 말풍선 표시 함수
        const showTooltip = (data, clickX, clickY) => {
            d3.select(".tooltip").remove(); // 기존 툴팁 제거

            const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", `translate(${clickX}, ${clickY - 120})`);

            tooltip.append("rect")
                .attr("width", 150)
                .attr("height", 100)
                .attr("x", -75)
                .attr("y", 0)
                .attr("fill", "white")
                .attr("stroke", "black");

            tooltip.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .text(data.name);

            // 버튼 데이터 배열
            const buttons = [
                { text: '출발', x: -30, y: 70 },
                { text: '도착', x: 30, y: 70 }
            ];

            // 버튼 생성
            buttons.forEach(button => {
                // 버튼 배경
                tooltip.append("rect")
                    .attr("x", button.x - 20)
                    .attr("y", button.y - 15)
                    .attr("width", 40)
                    .attr("height", 30)
                    .attr("fill", "lightgrey")
                    .attr("rx", 5) // 둥근 모서리
                    .style("cursor", "pointer")
                    .on("click", () => {
                        if (button.text === "닫기") {
                            tooltip.remove();
                        } else {
                            console.log(`${button.text} 버튼 클릭`);
                            // 출발 또는 도착 버튼 클릭 시 필요한 동작 구현
                        }
                    });

                // 버튼 텍스트
                tooltip.append("text")
                    .attr("x", button.x)
                    .attr("y", button.y)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .text(button.text)
                    .style("cursor", "pointer")
                    .on("click", () => {
                        if (button.text === "닫기") {
                            tooltip.remove();
                        } else {
                            console.log(`${button.text} 버튼 클릭`);
                            // 출발 또는 도착 버튼 클릭 시 필요한 동작 구현
                        }
                    });
            });
        };
    }, []);

    return (
        <Main
            title="지하철 노선도"
            description="지하철 노선도 페이지"
        >
            <div
                id="picture"
                style={{
                    width: 'calc(100vw - 260px)',
                    height: 'calc(100vh - 60px)',
                    overflow: 'hidden', // SVG가 컨테이너를 벗어나는 것을 방지하기 위해 overflow를 hidden으로 설정
                    position: 'relative' // 내부 SVG 요소의 위치를 절대적으로 조정하기 위해 부모 요소에 position을 설정
                }}
            >
                <svg
                    ref={ref}
                    viewBox={`0 0 ${1800} ${1000}`} // SVG 요소의 viewBox를 설정하여 내부 요소가 잘 보이도록 함
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute', // SVG 요소의 위치를 부모 요소에 상대적으로 설정
                        top: 0, // SVG 요소가 부모 요소의 좌측 상단에 위치하도록 함
                        left: 0
                    }}
                ></svg>
            </div>
        </Main>
    );
};

export default Routemap;
