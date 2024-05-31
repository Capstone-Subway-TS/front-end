import React, { useEffect, useState } from 'react';
import Main from '../components/section/Main';
import { useSelector } from 'react-redux';
import { getCurrentTime, getDayType } from '../data/time';
import { PiSubwayFill } from "react-icons/pi";
import train from '../assets/img/nav/train.png';
import wait from '../assets/img/nav/waiting.png';
import walk from '../assets/img/nav/walk.png';

const Nav = () => {
    const startStation = useSelector(state => state.startStation);
    const endStation = useSelector(state => state.endStation);

    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [dayType, setDayType] = useState(getDayType());

    const [cuTime, setCuTime] = useState("12:30:15");//현재시간
    const [fiTime, setfiTime] = useState("12:33:00");//탑승시간
    const [path, setPath] = useState(["온수(성공회대입구)", "오류동", "개봉", "구일", "구로", "신도림", "영등포", "신길", "대방", "노량진", "용산"]);//경로-리스트
    const [startLine, setStartLine] = useState("1호선");//시작호선
    const [goTime, setGoTime] = useState([30, 37, 70]);//각호선별 탑승시간-리스트
    const [transferTime, setTransferTime] = useState([4, 10]);//환승하는데 이동하는 시간-리스트
    const [nextLine, setNextLine] = useState(["7호선", "2호선"]);//환승하는 호선-리스트
    const [transferName, settransferName] = useState(["수락산", "역곡"]);//환승하는 호선-리스트
    const [waitingTime, setWaitingTime] = useState([2, 4]);//환승하는데 기다리는 시간-리스트
    const [adjustedTime, setAdjustedTime] = useState(157);//총 걸린시간
    const [estimatedArrival, setEstimatedArrival] = useState("13:25:15");//예상도착시간 현재시간+총걸린시간

    
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchDataFromSpring = async () => {
        try {
            const response = await fetch("http://backend:8080/SearchRoute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "Start": startStation, "Finish": endStation }),
            });

            const data = await response.json();
            // 데이터 처리
            setCuTime(data.cuTime);
            setfiTime(data.fiTime);
            setPath(data.path);
            setStartLine(data.startLine);
            setGoTime(data.goTime);
            setTransferTime(data.transferTime);
            settransferName(data.transferName);
            setNextLine(data.nextLine);
            setWaitingTime(data.waitingTime);
            setAdjustedTime(data.adjustedTime);
            setEstimatedArrival(data.estimatedArrival);

        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        if (startStation && endStation) {
            fetchDataFromSpring();
        }
    }, [startStation, endStation]);

    const getLineColor = (line) => {
        // 지하철 노선별 색상 매핑
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

    // 비율 계산
    const totalTransferTime = transferTime.reduce((acc, cur) => acc + cur, 0);
    const totalWaitingTime = waitingTime.reduce((acc, cur) => acc + cur, 0);
    const totalGoTime = goTime.reduce((acc, cur) => acc + cur, 0);
    const totalTime = totalTransferTime + totalWaitingTime + totalGoTime;
    const ratio = 1000 / totalTime;

    // 환승 횟수에 따라 막대 생성
    const renderTransferBars = () => {
        const transferBars = [];
        const iconSize = 20; // 이미지 크기
    
        for (let i = 0; i < goTime.length - 1; i++) {
            const goBarWidth = goTime[i] * ratio;
            const transferBarWidth = transferTime[i] * ratio;
            const waitingBarWidth = waitingTime[i] * ratio;
    
            transferBars.push(
                <div key={`go${i}`} style={{ display: 'inline-block', width: `${goBarWidth}px`, height: '30px', backgroundColor: getLineColor(i === 0 ? startLine : nextLine[i - 1]), position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={train} alt="subway" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${goBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(i === 0 ? startLine : nextLine[i - 1]) }}>{goTime[i]}분-{(i === 0 ? startStation : transferName[i - 1])}({(i === 0 ? startLine : nextLine[i - 1])})</span>
                </div>
            );
            transferBars.push(
                <div key={`transfer${i}`} style={{ display: 'inline-block', width: `${transferBarWidth}px`, height: '30px', backgroundColor: 'lightgray', position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={walk} alt="walk" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${transferBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: '#000' }}>{transferTime[i]}분</span>
                </div>
            );
            transferBars.push(
                <div key={`wait${i}`} style={{ display: 'inline-block', width: `${waitingBarWidth}px`, height: '30px', backgroundColor: 'red', position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                    <img src={wait} alt="wait" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${waitingBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                    <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: '#000' }}>{waitingTime[i]}분</span>
                </div>
            );
        }
    
        const lastGoBarWidth = goTime[goTime.length - 1] * ratio;
    
        transferBars.push(
            <div key={`go${goTime.length - 1}`} style={{ display: 'inline-block', width: `${lastGoBarWidth}px`, height: '30px', backgroundColor: getLineColor(nextLine[nextLine.length - 1]), position: 'relative', whiteSpace: 'nowrap', overflow: 'visible' }}>
                <img src={train} alt="subway" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', maxWidth: `${lastGoBarWidth}px`, maxHeight: '100%', width: 'auto', height: 'auto' }} />
                <span style={{ position: 'absolute', left: '50%', bottom: '-20px', transform: 'translate(-50%, 0)', color: getLineColor(nextLine[nextLine.length - 1]) }}>{goTime[goTime.length - 1]}분-{(transferName[transferName.length - 1])}({nextLine[nextLine.length - 1]})</span>
            </div>
        );
    
        return transferBars;
    };
    

    return (
        <Main title="실시간 길찾기" description="실시간 길찾기 페이지">
            <div className="resultsContainer">
                <h1 className="resultsHeader">출발지/도착지</h1>
                {startStation && <p className="resultItem">출발지: {startStation}</p>}
                {endStation && <p className="resultItem">도착지: {endStation}</p>}
                {!startStation && <p className="resultItem">출발지 정보가 없습니다.</p>}
                {!endStation && <p className="resultItem">도착지 정보가 없습니다.</p>}
            </div>
            <div className="resultsMap">
                <h1 className="resultsHeader">길찾기 결과</h1>
                <h3>출발 시간: {cuTime}, ({dayType})</h3>
                
                <div className="visualRepresentation" style={{ width: '1000px', height: '30px', backgroundColor: 'lightgray', margin: '20px 0' }}>
                    {renderTransferBars()}
                </div>
                <p className="scheduleTime">도착 시간(시간표): {estimatedArrival}</p>
                {startLine && <p className="resultItem">탑승: {startStation}({startLine}) - {fiTime} 열차 탑승</p>}
                {transferName.map((name, index) => (
                    <p key={`transfer${index}`} className="resultItem">{index + 1}번 환승: {name}({nextLine[index]}) - {(Number(fiTime) + Number(waitingTime[index]) + Number(transferTime[index]) + Number(goTime[index])).toString()} 열차 탑승</p>
                ))}
                {endStation && <p className="resultItem">하차: {endStation}({(nextLine[nextLine.length - 1])})</p>}
            </div>
        </Main>
    );
};

export default Nav;

{/*{goTime && (
                    <>
                        <p className="resultItem">이동시간: {goTime.join(', ')}</p>
                        <p className="resultItem">갈아타는 호선: {nextLine.join(', ')}</p>
                        <p className="resultItem">시간표 반영 후 걸리는 시간: {adjustedTime}</p>
                    </>
                )}
            <p className="resultItem">예상 최종 시간: {estimatedArrival}</p>*/}