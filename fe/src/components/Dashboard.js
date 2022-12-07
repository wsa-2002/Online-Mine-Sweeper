/****************************************************************************
  FileName      [ Dashnoard.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Dashboard. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from "react";
import "./css/Dashboard.css";
let myTimeIntervalId;
let rivalTimeIntervalId;

export default function Dashboard({ username, rivalUsername, timeLimit, myTurn, remainFlagNum, gameOver, setGameOver }) {
	let [myTime, setMyTime] = useState(timeLimit);
	let [rivalTime, setRivalTime] = useState(timeLimit);
	let [sTime, setSTime] = useState(0);

	useEffect(() => {
		if (myTime <= 0 || rivalTime <= 0) {
		  setGameOver(true);
		}
	  }, [myTime, rivalTime]);
	  
	  useEffect(() => {
		if (gameOver) {
		  setMyTime(timeLimit);
		  setRivalTime(timeLimit);
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
		
		if (myTurn) {
		  myTimeIntervalId = setTimeout(() => {
			decrementMyTime();
		  }, 1000);
		}
		else {
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
			<p>{username}</p>
			<div className="dashBoard_col">
			  <p className="icon">⏰</p>
			  {gameOver ? sTime : myTime}
			</div>
		  </div>
		  <div id="dashBoard_col1">
			<p>   </p>
			<div className="dashBoard_col">
			  <p className="icon">🚩</p>
			  {remainFlagNum}
			</div>
		  </div>
		  <div id="dashBoard_col1">
			<p>{rivalUsername}</p>
			<div className="dashBoard_col">
			  <p className="icon">⏰</p>
			  {gameOver ? sTime : rivalTime}
			</div>
		  </div>
		</div>
	  );
}
