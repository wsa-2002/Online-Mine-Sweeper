/****************************************************************************
  FileName      [ Board.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Board. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import Modal from "./Modal";
import Dashboard from "./Dashboard";
import createBoard from "../util/createBoard";
import { revealed } from "../util/reveal";
import "./css/Board.css";
import { sendReady, useReceiveMsg } from "../hooks/websocket";
import CountDown from "./CountDown";

const Board = ({ boardSize, mineNum, backToHome }) => {
	const [board, setBoard] = useState([]); // An 2-dimentional array. It is used to store the board.
	const [nonMineCount, setNonMineCount] = useState(0); // An integer variable to store the number of cells whose value are not '💣'.
	const [mineLocations, setMineLocations] = useState([]); // An array to store all the coordinate of '💣'.
	const [gameOver, setGameOver] = useState(false); // A boolean variable. If true, means you lose the game (Game over).
	const [remainFlagNum, setRemainFlagNum] = useState(0); // An integer variable to store the number of remain flags.
	const [win, setWin] = useState(false); // A boolean variable. If true, means that you win the game.
	const [myTurn, setMyTurn] = useState(false); // 1 -> this player's turn
	const [countDown, setCountDown] = useState(false); // 1 -> show countdown page
	const [gameStart, setGameStart] = useState(false); // 1 -> game start
	const [ready, setReady] = useState(false); // 1 -> this player is ready
	const [startTime, setStartTime] = useState(null);
	const { task, data } = useReceiveMsg("ready");
	const username = "hello";
	const nowww = new Date(); // debug

	useEffect(() => {
		freshBoard();
	}, []);

	useEffect(() => {
		if (data) {
			//setStartTime(new Date(data.start_time));
			setStartTime(new Date(nowww.getTime() + 6000));
			let diff = 0;
			const timeIntervalId = setInterval(() => {
				const now = new Date();
				diff = timeDiff(now, new Date(nowww.getTime() + 6000));
				//diff = timeDiff(now, new Date(data.start_time));
				if (diff <= 3) {
					clearInterval(timeIntervalId);
					setCountDown(true);
					// if (data.turns === username) {
					// 	setMyTurn(true);
					// }
				}
			}, 1000);
		}
	}, [data]);

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
	};

	const readyGame = () => {
		const data = {
			room_number: 0,
		};
		sendReady(data);
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
						remainFlagNum={remainFlagNum}
						gameOver={gameOver}
						gameStart={gameStart}
					/>
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
