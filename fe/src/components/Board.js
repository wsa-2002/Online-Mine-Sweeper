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
import ReadyModal from "./ReadyModal";

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
	const [myTurn, setMyTurn] = useState(true); // 1 -> this player's turn
	const [countDown, setCountDown] = useState(false); // 1 -> show countdown page
	const [gameStart, setGameStart] = useState(false); // 1 -> game start
	const [bothReady, setBothReady] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [overReason, setOverReason] = useState(null);
	const [timediff, setTimediff] = useState(null);
	const [value, send] = useContext(WebsocketContext);
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
		if (value && value.task === "ready") {
			if (value.data && !value.error) {
				setBothReady(true);
				setStartTime(new Date(value.data.start_time));
				let interval = 0;
				const timeIntervalId = setInterval(() => {
					const now = new Date();
					interval = timeDiff(now, new Date(value.data.start_time));
					if (interval <= 3) {
						clearInterval(timeIntervalId);
						setCountDown(true);
						if (value.data.turns === userInfo.username) {
							setMyTurn(true);
						} else {
							setMyTurn(false);
						}
					}
				}, 1000);
			}
		}
	}, [value]);

	useEffect(() => {
		if (value.task === "update_board" && value) {
			if (value.data && !value.error) {
				let newBoard = [];
				for (let x = 0; x < userInfo.boardSize; x++) {
					let subCol = [];
					for (let y = 0; y < userInfo.boardSize; y++) {
						subCol.push({
							value: value.data.board[x][y],
							x: x,
							y: y,
						});
					}
					newBoard.push(subCol);
				}
				setBoard(newBoard);
				if (value.data.status === "GAMEOVER") {
					setGameOver(true);
					if (value.data.winner === userInfo.username) {
						setWin(true);
						// survive, rival's time's up, mines all found, you get XX more seconds left
						switch (value.data.game_over_reason) {
							case "dead":
								setOverReason("Survive");
								break;
							case "time's up":
								setOverReason("Rival's Time's Up");
								break;
							case "mines all found":
								setOverReason(
									`Mines All Found. You get${
										timediff ? " " + timediff : ""
									} more seconds left.`
								);
								break;
							default:
								break;
						}
					} else {
						// dead, time's up, mines all found, you get XX less seconds left
						switch (value.data.game_over_reason) {
							case "dead":
								setOverReason("Dead");
								break;
							case "time's up":
								setOverReason("Time's Up");
								break;
							case "mines all found":
								setOverReason(
									`Mines All Found. You get ${
										timediff ? " " + timediff : ""
									} fewer seconds left.`
								);
								break;
							default:
								break;
						}
					}
					return;
				}
				if (value.data.turns === userInfo.username) {
					setMyTurn(true);
				} else {
					setMyTurn(false);
				}
			}
		}
	}, [value]);

	const timeDiff = (now, start) => {
		const gap = start - now;
		return gap / 1000;
	};

	const freshBoard = () => {
		const newBoard = createBoard(boardSize);
		setBoard(newBoard);
	};

	const updateFlag = (e, myTurn, x, y) => {
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
		if (myTurn) {
			send(data);
		}
	};

	const revealCell = (gameStart, myTurn, x, y) => {
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
		if (gameStart && myTurn) {
			send(data);
		}
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
	};

	return (
		<div className="boardPage">
			<div className="boardWrapper">
				{!bothReady && (
					<ReadyModal roomNumber={userInfo.roomNumber} readyGame={readyGame} />
				)}
				<div className="roomNumber">Room Number : {userInfo.roomNumber}</div>
				<div className="boardContainer">
					<Dashboard
						userInfo={userInfo}
						myTurn={myTurn}
						gameStart={gameStart}
						gameOver={gameOver}
						setGameOver={setGameOver}
						win={win}
						setWin={setWin}
						setOverReason={setOverReason}
						setTimediff={setTimediff}
					/>
					{board.map((row, cnt) => (
						<div
							key={cnt}
							id={`row${cnt}`}
							style={{ display: "flex", justifyContent: "center" }}
						>
							{row.map((cell, key) => (
								<Cell
									key={key}
									rowIdx={cell.x}
									colIdx={cell.y}
									detail={cell}
									gameStart={gameStart}
									myTurn={myTurn}
									updateFlag={updateFlag}
									revealCell={revealCell}
								/>
							))}
						</div>
					))}
				</div>
				{(win || gameOver) && (
					<Modal backToHome={backToHome} win={win} overReason={overReason} />
				)}
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
