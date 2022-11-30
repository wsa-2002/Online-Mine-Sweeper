import React, { useState } from "react";
import "./css/HomePage.css";
import Popup from "reactjs-popup";
import UsernameSetting from "./dialog/UsernameSetting";

const HomePage = ({ moveOnToSelectMode }) => {
  const [showUsernameSetting, setShowUsernameSetting] = useState(false);

  // const handleMineNum = (e) => {
  //   const isvalid = mineNumOnChange(e.target.value);
  //   setError(isvalid);
  // };

  // const handleBoardSize = (e) => {
  //   const isvalid = boardSizeOnChange(e.target.value);
  //   setError(isvalid);
  // };

  return (
    <div className="HomeWrapper">
      <p className="title">MineSweeper</p>
      <div className="controlContainer">
        <Popup open={showUsernameSetting} position="center">
          <UsernameSetting
            close={() => {
              setShowUsernameSetting(false);
              moveOnToSelectMode();
            }}
          />
        </Popup>
        <button className="btn" onClick={() => setShowUsernameSetting(true)}>
          Start
        </button>
      </div>
    </div>
  );
};
export default HomePage;
