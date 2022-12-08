/****************************************************************************
  FileName      [ Dashnoard.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Dashboard. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState, useContext } from "react";
import { WebsocketContext } from "../context/websocket";
import "./css/Dashboard.css";
let myTimeIntervalId;
let rivalTimeIntervalId;

export default function Dashboard({ userInfo, myTurn, gameStart, gameOver, setGameOver, win, setWin }) {
	const [value, send] = useContext(WebsocketContext);
	const [myName, setMyName] = useState('');
	const [rival_username, setRivalUsername] = useState('');
	const [myTime, setMyTime] = useState(60);
	const [rivalTime, setRivalTime] = useState(60);
	const [sTime, setSTime] = useState(0);
	const [showFlag, setShowFlag] = useState(false);

	useEffect(() => {
		setMyName(userInfo.username);
	}, [userInfo])

	useEffect(() => {
		if (value.task === "setup" && value.task) {
			// setMyName(userInfo.username);
			setRivalUsername(value.data.rival_username);
			setMyTime(value.data.time_limit);
			setRivalTime(value.data.time_limit);
		}

		else if (value.task === "update_board" && value.data.time_left) {
			setMyTime(Math.round(value.data.time_left[myName]))
			setRivalTime(Math.round(value.data.time_left[rival_username]))
		}
	}, [value]);

	useEffect(() => {
		if (myTime <= 0 || rivalTime <= 0) {
		  setGameOver(true);
		  if (myTime <= 0) { setWin(false) }
		  else { setWin(true) }
		}
	  }, [myTime, rivalTime]);
	  
	useEffect(() => {
		if (gameOver) {
		  setMyTime(userInfo.timeLimit);
		  setRivalTime(userInfo.timeLimit);
		}
	}, [gameOver]);
	
	useEffect(() => {    
		const decrementMyTime = () => {
		  let newTime = myTime - 1;
		  setMyTime(newTime);
		}
	
		const decrementRivalTime = () => {
		  let newTime = rivalTime - 1;
		  setRivalTime(newTime);
		}
		
		if (myTurn && gameStart) {
		  myTimeIntervalId = setTimeout(() => {
			decrementMyTime();
		  }, 1000);
		}
		else if (gameStart) {
		  rivalTimeIntervalId = setTimeout(() => {
			decrementRivalTime();
		  }, 1000);
		}
	
		return () => {
		  clearInterval(myTimeIntervalId);
		  clearInterval(rivalTimeIntervalId);
		};
	}, [myTime, rivalTime, myTurn, gameStart]);
	
	useEffect(() => {
		if (gameOver) {
		  clearInterval(myTimeIntervalId);
		  clearInterval(rivalTimeIntervalId);
		}
	}, [gameOver]);

	return (
		<div>
		  {gameStart ? 
		    <div className="dashBoard">
				<div id="dashBoard_col1">
					{myTurn ? <p className="icon">🚩</p> : <></>}
					<p>{myName}</p>
					<div className="dashBoard_col">
						<p className="icon">⏰</p>
						{gameOver ? sTime : myTime}
					</div>
				</div>
				<div id="dashBoard_col1">
					{myTurn ? <></> : <p className="icon">🚩</p>}
					<p>{rival_username}</p>
					<div className="dashBoard_col">
						<p className="icon">⏰</p>
						{gameOver ? sTime : rivalTime}
					</div>
				</div>
			</div> 
			: 
			<div className="dashBoard">
				<div id="dashBoard_col1">
					<p>{myName}</p>
					<div className="dashBoard_col">
						<p className="icon">⏰</p>
						{gameOver ? sTime : myTime}
					</div>
				</div>
				<div id="dashBoard_col1">
					<p>{rival_username}</p>
					<div className="dashBoard_col">
						<p className="icon">⏰</p>
						{gameOver ? sTime : rivalTime}
					</div>
				</div>
			</div>
		  }  
		</div>
	  );
}
