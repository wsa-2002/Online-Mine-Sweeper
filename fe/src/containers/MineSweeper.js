import React, { useEffect, useState } from "react";
import "./MineSweeper.css";
import Board from "../components/Board";
import SelectMode from "../components/SelectMode";
import HomePage from "../components/HomePage";
import { useSetup } from "../hooks/websocket";

const MineSweeper = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [username, setUsername] = useState(null);
  const [roomOption, setRoomOption] = useState(null);
  const [roomType, setRoomType] = useState("PUBLIC");
  const [mineNum, setMineNum] = useState(10);
  const [boardSize, setBoardSize] = useState(8);
  const [timeLimit, setTimeLimit] = useState(60);
  const [roomNumber, setRoomNumber] = useState(null);
  const [rivalUsername, setRivalUsername] = useState(null);
  const [error, setError] = useState(null);
  const { sendSetup, setupRes } = useSetup(); // web socket

  const startGameOnClick = () => {
    const packet = {
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
    console.log("data for setup ", packet);
    setStartGame(true);
    //sendSetup(packet); // web socket
  };
  /*
  // only set game param states after receiving setup response
  useEffect(() => {
    const res = setupRes.data;
    if (res["room_number"]) {
      setBoardSize(res["board_size"]);
      setMineNum(res["mine_num"]);
      setTimeLimit(res["time_limit"]);
      setRoomNumber(res["room_number"]);
      setRivalUsername(res["rivalUsername"]);
      setError(setupRes.error);
    }
  }, [setupRes]);
  // only start game after receiving setup response
  useEffect(() => {
    if (roomOption === "NEW") {
      if (roomNumber) {
        setStartGame(true);
      }
    } else if (roomOption === "RANDOM") {
      if (error) {
        // TODO: handle no room error
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
      if (boardSize && mineNum && timeLimit && roomNumber && rivalUsername) {
        setStartGame(true);
      }
    }
  }, [
    boardSize,
    mineNum,
    timeLimit,
    roomNumber,
    rivalUsername,
    // error,
    // roomOption,
  ]);*/

  const backToHomeOnClick = () => {
    setStartGame(false);
  };

  useEffect(() => {
    console.log("username: ", username);
  }, [username]);

  useEffect(() => {
    console.log("startGame(boolean): ", startGame);
  }, [startGame]);

  useEffect(() => {
    console.log("selectMode(boolean): ", selectMode);
  }, [selectMode]);

  return (
    <div className="mineSweeper">
      {selectMode ? (
        startGame ? (
          <Board
            boardSize={boardSize}
            mineNum={mineNum}
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
