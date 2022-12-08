import React, { useEffect, useState, useContext } from "react";
import "./MineSweeper.css";
import Board from "../components/Board";
import SelectMode from "../components/SelectMode";
import HomePage from "../components/HomePage";
import { WebsocketContext } from "../context/websocket";

const MineSweeper = () => {
	const [selectMode, setSelectMode] = useState(false);
	const [startGame, setStartGame] = useState(false);
	const [username, setUsername] = useState(null);
	const [roomOption, setRoomOption] = useState(null);
	const [roomType, setRoomType] = useState("PUBLIC");
	const [mineNum, setMineNum] = useState(10);
	const [boardSize, setBoardSize] = useState(10);
	const [timeLimit, setTimeLimit] = useState(60);
	const [roomNumber, setRoomNumber] = useState(null);
	const [rivalUsername, setRivalUsername] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [value, send] = useContext(WebsocketContext);

	const startGameOnClick = () => {
		const data = {
			task: "setup",
			username: username,
			data: {
				room_option: roomOption,
				board_size: boardSize,
				mine_num: mineNum,
				time_limit: timeLimit,
				room_type: roomType,
				room_number: roomNumber,
			},
		};
		send(data); // web socket
	};

	// only set game param states after receiving setup response
	useEffect(() => {
		if (value && value.task === "setup") {
			if (value.data && !value.error) {
				const res = value.data;
				setBoardSize(res["board_size"]);
				setMineNum(res["mine_num"]);
				setTimeLimit(res["time_limit"]);
				setRoomNumber(res["room_number"]);
				setRivalUsername(res["rival_username"]);
			}
			setErrorMessage(value.error);
		}
	}, [value]);

	// only start game after receiving setup response
	useEffect(() => {
		if (roomOption === "NEW") {
			if (!value.error && boardSize && mineNum && timeLimit && roomNumber) {
				// to prevent: room not found -> create new room
				setStartGame(true);
			}
		} else if (roomOption === "RANDOM") {
			if (errorMessage === "no rooms available") {
				setBoardSize(10);
				setMineNum(10);
				setTimeLimit(60);
				setRoomNumber(null);
				setRivalUsername(null);
			} else if (
				boardSize &&
				mineNum &&
				timeLimit &&
				roomNumber &&
				rivalUsername
			) {
				setStartGame(true);
			}
		} else if (roomOption === "ASSIGN") {
			if (errorMessage === "room not found") {
				setBoardSize(10);
				setMineNum(10);
				setTimeLimit(60);
				setRoomNumber(null);
				setRivalUsername(null);
			} else if (
				boardSize &&
				mineNum &&
				timeLimit &&
				roomNumber &&
				rivalUsername
			) {
				setStartGame(true);
			}
		}
	}, [
		boardSize,
		mineNum,
		timeLimit,
		roomNumber,
		rivalUsername,
		roomOption,
		errorMessage,
	]);

	const backToHomeOnClick = () => {
		setStartGame(false);
		setRoomOption(null);
		setRoomType("PUBLIC");
		setBoardSize(null);
		setMineNum(null);
		setTimeLimit(null);
		setRivalUsername(null);
		setRoomNumber(null)
	};

	return (
		<div className="mineSweeper">
			{selectMode ? (
				startGame ? (
					<Board
						username={username}
						boardSize={boardSize}
						roomNumber={roomNumber}
						rivalUsername={rivalUsername}
						timeLimit={timeLimit}
						backToHome={backToHomeOnClick}
					/>
				) : (
					<SelectMode
						roomOption={roomOption}
						setRoomOption={setRoomOption}
						roomType={roomType}
						setRoomType={setRoomType}
						mineNum={mineNum}
						setMineNum={setMineNum}
						boardSize={boardSize}
						setBoardSize={setBoardSize}
						timeLimit={timeLimit}
						setTimeLimit={setTimeLimit}
						roomNumber={roomNumber}
						setRoomNumber={setRoomNumber}
						startGame={startGameOnClick}
						error={errorMessage}
					/>
				)
			) : (
				<HomePage
					username={username}
					setUsername={setUsername}
					moveOnToSelectMode={() => setSelectMode(true)}
				/>
			)}
		</div>
	);
};
export default MineSweeper;
