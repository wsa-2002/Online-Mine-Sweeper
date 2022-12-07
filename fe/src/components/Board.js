/****************************************************************************
  FileName      [ Board.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Board. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState, useContext } from "react";
import Cell from "./Cell";
import Modal from "./Modal";
import Dashboard from "./Dashboard";
import createBoard from "../util/createBoard";
import "./css/Board.css";
import { WebsocketContext } from "../context/websocket";
import CountDown from "./CountDown";

const Board = ({
	username,
	boardSize,
	roomNumber,
	rivalUsername,
	timeLimit,
	backToHome,
}) => {
	const [board, setBoard] = useState([]); // An 2-dimentional array. It is used to store the board
	const [gameOver, setGameOver] = useState(false); // A boolean variable. If true, means you lose the game (Game over).
	const [win, setWin] = useState(false); // A boolean variable. If true, means that you win the game.
	const [myTurn, setMyTurn] = useState(false); // 1 -> this player's turn
	const [countDown, setCountDown] = useState(false); // 1 -> show countdown page
	const [gameStart, setGameStart] = useState(false); // 1 -> game start
	const [ready, setReady] = useState(false); // 1 -> this player is ready
	const [startTime, setStartTime] = useState(null);
	const [task, value, error, send] = useContext(WebsocketContext);
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		freshBoard();
	}, []);

	useEffect(() => {
		setUserInfo({
			username,
			boardSize,
			roomNumber,
			rivalUsername,
			timeLimit,
		});
	}, []);

	useEffect(() => {
		if (task === "ready" && value) {
			setStartTime(new Date(value.start_time));
			let interval = 0;
			const timeIntervalId = setInterval(() => {
				const now = new Date();
				interval = timeDiff(now, new Date(value.start_time));
				if (interval <= 3) {
					clearInterval(timeIntervalId);
					setCountDown(true);
					if (value.turns === userInfo.username) {
						setMyTurn(true);
					}
				}
			}, 1000);
		}
	}, [task, value]);

	useEffect(() => {
		if (task === "update_board" && value) {
			let newBoard = [];
			for (let x = 0; x < userInfo.boardSize; x++) {
				let subCol = [];
				for (let y = 0; y < userInfo.boardSize; y++) {
					subCol.push({
						value: value.board[x][y],
						x: x,
						y: y,
					});
				}
				newBoard.push(subCol);
			}
			setBoard(newBoard);
			if (value.status === "GAMEOVER") {
				setGameOver(true);
				if (value.winner === userInfo.username) {
					setWin(true);
				}
				return;
			}
			if (value.turns === userInfo.username) {
				setMyTurn(true);
			}
		}
	}, [task, value]);

	const timeDiff = (now, start) => {
		const gap = start - now;
		return gap / 1000;
	};

	const freshBoard = () => {
		const newBoard = createBoard(boardSize);
		setBoard(newBoard);
	};

	const updateFlag = (e, x, y) => {
		e.preventDefault();
		const data = {
			task: "action",
			username: userInfo.username,
			data: {
				room_number: userInfo.roomNumber,
				action_type: "FLAG",
				x,
				y,
			},
		};
		send(data);
	};

	const revealCell = (x, y) => {
		const data = {
			task: "action",
			username: userInfo.username,
			data: {
				room_number: userInfo.roomNumber,
				action_type: "STEP",
				x,
				y,
			},
		};
		send(data);
	};

	const readyGame = () => {
		const data = {
			task: "ready",
			username: userInfo.username,
			data: {
				room_number: userInfo.roomNumber,
			},
		};
		send(data);
		setReady(true);
	};

	return (
		<div className="boardPage">
			<div className="boardWrapper">
				<button
					className="btnReady"
					disabled={ready}
					onClick={readyGame}
					style={countDown || gameStart ? { display: "none" } : {}}
				>
					Ready
				</button>
				<div className="boardContainer">
					<Dashboard gameOver={gameOver} gameStart={gameStart} />
					{board.map((row, cnt) => (
						<div id={`row${cnt}`} style={{ display: "flex" }}>
							{row.map((cell, key) => (
								<Cell
									key={key}
									rowIdx={cell.x}
									colIdx={cell.y}
									detail={cell}
									updateFlag={updateFlag}
									revealCell={revealCell}
								/>
							))}
						</div>
					))}
				</div>
				{(win || gameOver) && <Modal backToHome={backToHome} win={win} />}
				{countDown && (
					<CountDown
						startTime={startTime}
						setCountDown={setCountDown}
						setGameStart={setGameStart}
					/>
				)}
			</div>
		</div>
	);
};

export default Board;
