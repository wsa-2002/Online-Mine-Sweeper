import React, { useEffect, useState } from "react";
import "./MineSweeper.css";
import Board from "../components/Board";
import SelectMode from "../components/SelectMode";
import HomePage from "../components/HomePage";

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

  const startGameOnClick = () => {
    const packet = {
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
    console.log("data for setup ", packet);
    // TODO: send this data somewhere
    setStartGame(true);
  };

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
