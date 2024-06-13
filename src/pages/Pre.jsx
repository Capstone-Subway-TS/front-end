import React, { useEffect, useState } from 'react';
import Main from '../components/section/Main';
import { useSelector } from 'react-redux';
import { getCurrentTime, getDayType } from '../data/time';
import train from '../assets/img/nav/train.png';
import wait from '../assets/img/nav/waiting.png';
import walk from '../assets/img/nav/walk.png';
import { Link, useNavigate,useLocation } from 'react-router-dom'; // React Router를 사용한다고 가정합니다.
import { ctime } from './Nav';
import { useTime } from '../data/TimeContext';
import { navPath } from './Nav';

const Pre = () => {
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);
    const [loading, setLoading] = useState(false); // 로딩 상태 변수
    const navigate  = useNavigate(); // useHistory 훅 사용
    let ingtime=[0];
    const { hour, minute, weekday } = useTime();
    const currentTime = ctime;
    /*
    const [result, setResult] = useState([]);
    */
    const [result, setResult] = useState([
        {
            "path": [
                "장한평",
                "군자(능동)"
            ],
            "finalTime": "12:31:55",
            "eachTransferStation": [],
            "startLine": "5호선",
            "eachTime": [],
            "eachWalkingTime": [],
            "eachTypeOfLine": [],
            "eachWaitingTime": [],
            "totalTime": 100
        },
        {
            "path": [
                "장한평",
                "답십리",
                "마장",
                "왕십리(성동구청)",
                "한양대",
                "뚝섬",
                "성수",
                "건대입구",
                "어린이대공원(세종대)",
                "군자(능동)"
            ],
            "finalTime": "13:05:40",
            "eachTransferStation": [
                "왕십리(성동구청)",
                "건대입구",
                "수락산"
            ],
            "startLine": "5호선",
            "eachTime": [
                260,
                330,
                400
            ],
            "eachWalkingTime": [
                180,
                240,
                400
            ],
            "eachTypeOfLine": [
                "2호선",
                "7호선",
                "2호선"

            ],
            "eachWaitingTime": [
                265,
                90,
                400
            ],
            "totalTime": 3325
        },
        {
            "path": [
                "장한평",
                "답십리",
                "마장",
                "왕십리(성동구청)",
                "행당",
                "신금호",
                "청구",
                "신당",
                "동묘앞",
                "창신",
                "보문",
                "안암(고대병원앞)",
                "고려대(종암)",
                "월곡(동덕여대)",
                "상월곡(한국과학기술연구원)",
                "돌곶이",
                "석계",
                "태릉입구",
                "먹골",
                "중화",
                "상봉(시외버스터미널)",
                "면목",
                "사가정",
                "용마산",
                "중곡",
                "군자(능동)"
            ],
            "finalTime": "13:25:50",
            "eachTransferStation": [
                "청구",
                "태릉입구"
            ],
            "startLine": "5호선",
            "eachTime": [
                500,
                810
            ],
            "eachWalkingTime": [
                120,
                120
            ],
            "eachTypeOfLine": [
                "6호선",
                "7호선"
            ],
            "eachWaitingTime": [
                465,
                90
            ],
            "totalTime": 3335
        }
    ]);


    const location = useLocation();
    
    console.log(navPath);


    useEffect(() => {
        // 첫 번째 서비스에서 전달된 데이터
        const firstServiceData = location.state?.results;

        // 데이터가 존재하는 경우에만 두 번째 서비스 호출
        if (firstServiceData) {
            const fetchSecondServiceData = async () => {
                try {
                    const response = await fetch('http://localhost:8080/Predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(firstServiceData),
                    });
                    const secondServiceData = await response.json();
                    setResult(secondServiceData);
                    console.log('두 번째 서비스 응답 데이터:', secondServiceData);
                } catch (error) {
                    console.error('두 번째 서비스 요청 실패:', error);
                }
            };

            fetchSecondServiceData();
        }
    }, [location]);

    const renderResults = () => {
        return result.map((result, index) => (
            
            
            <div key={index} className="resultsMap">
                <h1 className="resultsHeader">AI 예측 길찾기 결과 {index + 1}</h1>
                <h3>출발 시간: {Math.floor((currentTime) / (60*60))}시 {Math.floor((currentTime) % (60*60)/60)}분 {Math.floor((currentTime)% 60)}초, ({weekday})</h3>
                <div className="visualRepresentation" style={{ width: '1250px', height: '30px', backgroundColor: 'lightgray', margin: '20px 0' }}>
                    {renderTransferBars(result)}
                </div>
                <p className="scheduleTime">도착 시간(시간표): {Math.floor((currentTime+result.totalTime) / (60*60))}시 {Math.floor((currentTime+result.totalTime) % (60*60)/60)}분 {Math.floor((currentTime+result.totalTime)% 60)}초</p>
                {result.path && (
                    <>
                        <p className="resultItem">걸리는시간: {Math.floor(result.totalTime / 60)}분 {Math.floor(result.totalTime % 60)}초</p>
                        <p className="resultItem">경로: {result.path.map((place, index) => {
                        // 마지막 요소가 아니면 ->를 붙여줌
                        if (index !== result.path.length - 1) {
                            return `${place} -> `;
                        } else {
                            return place; // 마지막 요소는 ->를 붙이지 않음
                        }
                        })}</p>
                        {result.eachTypeOfLine.map((line, index) => (
                            <p key={index} className="resultItem">{index + 1}번 환승: {line}({result.eachTransferStation[index]}) - {Math.floor((currentTime+ingtime[index]) / (60*60))}시 {Math.floor((currentTime+ingtime[index]) % (60*60)/60)}분 {Math.floor((currentTime+ingtime[index])% 60)}초 열차 탑승</p>
                        ))}
                    </>
                )}
            </div>
        ));
    };

    const renderTransferBars = (result) => {
        const transferBars = [];
        const iconSize = 20; // 이미지 크기
        let i = 0;
    
        // 환승역이 없는 경우 처리
        if (result.eachTransferStation.length === 0) {
            // 출발지에서 도착지까지 바로 이동하는 경우
            transferBars.push(
                <div key={`go${i}`} style={{ display: 'inline-block', width: '100%', height: '30px', backgroundColor: getLineColor(result.startLine), position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={train} alt="subway" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', top: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(result.startLine) }}>{startStation}({result.startLine})</span>
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(result.startLine) }}>{Math.floor(result.totalTime / 60)}분 {Math.floor(result.totalTime % 60)}초</span>
                </div>
            );
            return transferBars;
        }
    
        // 각 막대의 비율 계산
    const totalBarWidth = result.totalTime;
    let accumulatedWidth = 0;
    let tt = 0; // tt 변수 초기화


        result.eachTypeOfLine.forEach((line, index) => {
            const goBarWidth = result.eachTime[index] / totalBarWidth * 1250;
            const transferBarWidth = result.eachWalkingTime[index] / totalBarWidth * 1250;
            const waitingBarWidth = result.eachWaitingTime[index] / totalBarWidth * 1250;
            ingtime[index]=0;

            // 각 막대의 총합이 1250이 되도록 비율 조정
            const totalRatio = goBarWidth + transferBarWidth + waitingBarWidth;
            const adjustedGoBarWidth = goBarWidth / totalRatio * 1250;
            const adjustedTransferBarWidth = transferBarWidth / totalRatio * 1250;
            const adjustedWaitingBarWidth = waitingBarWidth / totalRatio * 1250;


            transferBars.push(
                <div key={`go${index}`} style={{ display: 'inline-block', width: `${goBarWidth}px`, height: '30px', backgroundColor: getLineColor(index === 0 ? result.startLine : result.eachTypeOfLine[index - 1]), position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={train} alt="subway" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${adjustedGoBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(index === 0 ? result.startLine : result.eachTypeOfLine[index - 1]) }}>{Math.floor(result.eachTime[index] / 60)}분 {Math.floor(result.eachTime[index] % 60)}초</span>
                    <span style={{ position: 'absolute', left: '50%', top: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(index === 0 ? result.startLine : result.eachTypeOfLine[index - 1]) }}>{(index === 0 ? startStation : result.eachTransferStation[index - 1])}({(index === 0 ? result.startLine : result.eachTypeOfLine[index - 1])})</span>
                </div>
            );

            transferBars.push(
                <div key={`transfer${index}`} style={{ display: 'inline-block', width: `${transferBarWidth}px`, height: '30px', backgroundColor: 'lightgray', position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={walk} alt="walk" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${adjustedTransferBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: '#000' }}>{Math.floor(result.eachWalkingTime[index] / 60)}분 {Math.floor(result.eachWalkingTime[index] % 60)}초</span>
                </div>
            );

            transferBars.push(
                <div key={`wait${index}`} style={{ display: 'inline-block', width: `${waitingBarWidth}px`, height: '30px', backgroundColor: 'red', position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={wait} alt="wait" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${adjustedWaitingBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: '#000' }}>{Math.floor(result.eachWaitingTime[index] / 60)}분 {Math.floor(result.eachWaitingTime[index] % 60)}초 </span>
                </div>
            );
            result.eachTime.forEach((_, index) => {
                if (index === 0) {
                    ingtime[index] = result.eachTime[index] + result.eachWalkingTime[index] + result.eachWaitingTime[index];
                } else {
                    ingtime[index] = ingtime[index - 1] + result.eachTime[index] + result.eachWalkingTime[index] + result.eachWaitingTime[index];
                }
            });

            accumulatedWidth += adjustedGoBarWidth + adjustedTransferBarWidth + adjustedWaitingBarWidth;
            tt = tt+result.eachTime[index]+result.eachWalkingTime[index]+result.eachWaitingTime[index];
        });

        // 마지막 열차 막대 추가
        const lastIndex = result.eachTypeOfLine.length - 1;
        const lastGoBarWidth = (result.eachTime[lastIndex] !== 0 ? result.totalTime - tt: result.totalTime) / totalBarWidth * 1250;
        const lastTotalWidth = lastGoBarWidth;

        const lastAdjustedGoBarWidth = lastGoBarWidth / lastTotalWidth * (1250 - accumulatedWidth);
        transferBars.push(
            <div key={`go${lastIndex}`} style={{ display: 'inline-block', width: `${lastGoBarWidth}px`, height: '30px', backgroundColor: getLineColor(result.eachTypeOfLine[lastIndex]), position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                <img src={train} alt="subway" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `50px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(result.eachTypeOfLine[lastIndex]) }}>{Math.floor((result.totalTime - tt)/ 60)}분 {Math.floor(result.eachTime[lastIndex] % 60)}초</span>
                <span style={{ position: 'absolute', left: '50%', top: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(result.eachTypeOfLine[lastIndex]) }}>{result.eachTransferStation[result.eachTransferStation.length - 1]}({result.eachTypeOfLine[result.eachTypeOfLine.length - 1]})</span>
            </div>
        );
        return transferBars;
    };
        const getLineColor = (line) => {
            const lineColors = {
                '1호선': '#0d3692',
                '2호선': '#33a23d',
                '3호선': '#fe5d10',
                '4호선': '#00a2d1',
                '5호선': '#8b50a4',
                '6호선': '#c55c1d',
                '7호선': '#54640d',
                '8호선': '#f14c82',
            };
            return lineColors[line] || '#000'; // 기본 색상은 검정색
        };
        


        return (
            <Main title="실시간 길찾기" description="실시간 길찾기 페이지">
                
                <div className="resultsContainer">
                    <h1 className="resultsHeader">출발지/도착지</h1> <p>설정된 시간: {hour}시 {minute}분 ({weekday})</p>
                    {startStation && <p className="resultItem">출발지: {startStation}</p>}
                    {endStation && <p className="resultItem">도착지: {endStation}</p>}
                    {!startStation && <p className="resultItem">출발지 정보가 없습니다.</p>}
                    {!endStation && <p className="resultItem">도착지 정보가 없습니다.</p>}
                </div>
                
                {renderResults()}
            </Main>
        );
        };

export default Pre;