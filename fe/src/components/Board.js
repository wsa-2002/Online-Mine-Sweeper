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
import { revealed } from "../util/reveal";
import "./css/Board.css";
import { WebsocketContext } from "../context/websocket";
import CountDown from "./CountDown";

const Board = ({ boardSize, mineNum, backToHome }) => {
	const [board, setBoard] = useState([]); // An 2-dimentional array. It is used to store the board.
	const [nonMineCount, setNonMineCount] = useState(0); // An integer variable to store the number of cells whose value are not '💣'.
	const [mineLocations, setMineLocations] = useState([]); // An array to store all the coordinate of '💣'.
	const [gameOver, setGameOver] = useState(false); // A boolean variable. If true, means you lose the game (Game over).
	const [remainFlagNum, setRemainFlagNum] = useState(0); // An integer variable to store the number of remain flags.
	const [win, setWin] = useState(false); // A boolean variable. If true, means that you win the game.
	const [myTurn, setMyTurn] = useState(true); // 1 -> this player's turn
	const [countDown, setCountDown] = useState(false); // 1 -> show countdown page
	const [gameStart, setGameStart] = useState(false); // 1 -> game start
	const [ready, setReady] = useState(false); // 1 -> this player is ready
	const [startTime, setStartTime] = useState(null);
	const [task, value, error, send] = useContext(WebsocketContext);

	const username = "hello";
	const rivalname = "hi";
	const room_number = 100;

	useEffect(() => {
		freshBoard();
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
					if (value.turns === username) {
						setMyTurn(true);
					}
				}
			}, 1000);
		}
	}, [task, value]);

	const timeDiff = (now, start) => {
		const gap = start - now;
		return gap / 1000;
	};

	const freshBoard = () => {
		const newBoard = createBoard(boardSize, mineNum);
		setNonMineCount(boardSize * boardSize - mineNum);
		setRemainFlagNum(mineNum);
		setMineLocations(newBoard.mineLocations);
		setBoard(newBoard.board);
	};

	const restartGame = () => {
		freshBoard();
		setGameOver(false);
		setWin(false);
	};

	const updateFlag = (e, x, y) => {
		e.preventDefault();
		let newBoard = JSON.parse(JSON.stringify(board));
		let newFlagNum = remainFlagNum;
		if (newBoard[x][y].revealed === true) return;
		if (newBoard[x][y].flagged !== true && newBoard[x][y].revealed !== true) {
			newBoard[x][y].flagged = true;
			newFlagNum--;
		} else {
			newBoard[x][y].flagged = false;
			newFlagNum++;
		}
		setRemainFlagNum(newFlagNum);
		setBoard(newBoard);
	};

	const revealCell = (x, y) => {
		if (board[x][y].revealed || gameOver || board[x][y].flagged) return;

		let newBoard = JSON.parse(JSON.stringify(board));
		if (newBoard[x][y].value === "💣") {
			for (let i = 0; i < mineLocations.length; i++) {
				if (!newBoard[mineLocations[i][0]][mineLocations[i][1]].flagged)
					newBoard[mineLocations[i][0]][mineLocations[i][1]].revealed = true;
			}
			setBoard(newBoard);
			setGameOver(true);
		} else {
			let newRevealedBoard = revealed(newBoard, x, y, nonMineCount);
			setBoard(newRevealedBoard.board);
			setNonMineCount(newRevealedBoard.newNonMinesCount);
			if (newRevealedBoard.newNonMinesCount === 0) {
				console.log("win");
				setGameOver(true);
				setWin(true);
			}
		}

		// websocker here
	};

	const readyGame = () => {
		const data = {
			task: "ready",
			username: username,
			data: {
				room_number: room_number,
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
					<Dashboard
						username={username}
						rivalname={rivalname}
						myTurn={myTurn}
						remainFlagNum={remainFlagNum}
						gameOver={gameOver}
						setGameOver={setGameOver}
					/>
					{board.map((row, cnt) => (
						<div id={`row${cnt}`} style={{ display: "flex", justifyContent: "center"  }}>
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
				{(win || gameOver) && (
					<Modal restartGame={restartGame} backToHome={backToHome} win={win} />
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
