import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import subwayData from '../data/test.json';
import Main from '../components/section/Main';

const Developer = () => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
        .on("click", () => { // 배경 클릭 시 툴팁 제거
            d3.select(".tooltip").remove();
        }, true) // true로 설정하여 이벤트 캡처 단계에서 이벤트 리스너가 동작하도록 함
            .attr('width', 800)
            .attr('height', 600);
        svg.selectAll("*").remove(); // SVG 요소 내의 모든 자식 요소 제거

        const svgContainer = svg.append("g")
            .attr("id", "svg-container");

        const zoom = d3.zoom()
            .scaleExtent([0.5, 2]) // 확대/축소 범위 설정
            .translateExtent([[0, 0], [800, 600]]) // 이동 범위 설정
            .on("zoom", zoomed);

        svg.call(zoom);

        function zoomed(event) {
            svgContainer.attr("transform", event.transform);
        }

        // 스케일 설정
        const xScale = d3.scaleLinear()
            .domain(d3.extent(subwayData, d => parseFloat(d.x)))
            .range([100, 800]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(subwayData, d => parseFloat(d.y)))
            .range([800, 100]);

        // 노선별 색상 설정
        const lineColor = (line) => {
            if (line === "2호선") return "green"; // 2호선은 초록색으로 설정
            return "black"; // 기본 색상
        };

        // 라인 생성 함수
        const line = d3.line()
            .x(d => xScale(parseFloat(d.x)))
            .y(d => yScale(parseFloat(d.y)))
            .curve(d3.curveLinear);

        svgContainer.append("path")
            .datum(subwayData)
            .attr("fill", "none")
            .attr("stroke", d => lineColor(d[0].line))
            .attr("stroke-width", 4)
            .attr("d", line);

        // 점 추가
        svgContainer.selectAll(".station")
            .data(subwayData)
            .enter()
            .append("circle")
            .attr("class", "station")
            .attr("cx", d => xScale(parseFloat(d.x)))
            .attr("cy", d => yScale(parseFloat(d.y)))
            .attr("r", 5)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .on("click", function (event, d) {
                event.stopPropagation(); // 이벤트 버블링을 방지
                showTooltip(d);
            });

        // 점 하단에 이름 추가
        svgContainer.selectAll(".station-name")
            .data(subwayData)
            .enter()
            .append("text")
            .attr("class", "station-name")
            .attr("x", d => xScale(parseFloat(d.x)))
            .attr("y", d => yScale(parseFloat(d.y)) + 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "black")
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
        const showTooltip = (data) => {
            d3.select(".tooltip").remove(); // 기존 툴팁 제거

            const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .attr("transform", `translate(${xScale(parseFloat(data.x))}, ${yScale(parseFloat(data.y)) - 120})`);

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
            title="테스트 페이지"
            description="테스트 페이지"
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
                    viewBox={`0 0 ${1000} ${1000}`} // SVG 요소의 viewBox를 설정하여 내부 요소가 잘 보이도록 함
                    style={{
                        width: '100%',
                        height: '70%',
                        position: 'absolute', // SVG 요소의 위치를 부모 요소에 상대적으로 설정
                        top: 0, // SVG 요소가 부모 요소의 좌측 상단에 위치하도록 함
                        left: 0
                    }}
                ></svg>
            </div>
        </Main>
    );
};

export default Developer;
