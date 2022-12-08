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

// useEffect(() => {
// 	setUserInfo({
// 		username,
// 		boardSize,
// 		roomNumber,
// 		rivalUsername,
// 		timeLimit,
// 	});
// }, []);

export default function Dashboard({ userInfo, myTurn, gameStart, gameOver, setGameOver }) {
	const [myTime, setMyTime] = useState(userInfo.timeLimit);
	const [rivalTime, setRivalTime] = useState(userInfo.timeLimit);
	const [sTime, setSTime] = useState(0);
	const [task, value, error, send] = useContext(WebsocketContext);

	useEffect(() => {
		if (task === "update_board" && value) {
			console.log("dashboard", task, value)
		}
	}, []);

	useEffect(() => {
		console.log('rival username', userInfo.rivalUsername)
		console.log('time limit', userInfo.timeLimit)
	}, [gameStart])

	useEffect(() => {
		if (myTime <= 0 || rivalTime <= 0) {
		  setGameOver(true);
		}
	  }, [myTime, rivalTime]);
	  
	  useEffect(() => {
		if (gameOver) {
		  setMyTime(userInfo.timeLimit);
		  setRivalTime(userInfo.timeLimit);
		}
	  }, [gameOver, myTime, rivalTime]);
	
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
	  }, [myTime, setMyTime, rivalTime, setRivalTime, myTurn]);
	
	  useEffect(() => {
		if (gameOver) {
		  clearInterval(myTimeIntervalId);
		  clearInterval(rivalTimeIntervalId);
		}
	  }, [gameOver]);

	return (
		<div className="dashBoard">
		  <div id="dashBoard_col1">
			<p>{userInfo.username}</p>
			<div className="dashBoard_col">
			  <p className="icon">⏰</p>
			  {gameOver ? sTime : myTime}
			</div>
		  </div>
		  <div id="dashBoard_col1">
			<p>   </p>
			<div className="dashBoard_col">
			  <p className="icon">🚩</p>
			  {/* {remainFlagNum} */}
			</div>
		  </div>
		  <div id="dashBoard_col1">
			<p>{userInfo.rivalUsername}</p>
			<div className="dashBoard_col">
			  <p className="icon">⏰</p>
			  {gameOver ? sTime : rivalTime}
			</div>
		  </div>
		</div>
	  );
}
