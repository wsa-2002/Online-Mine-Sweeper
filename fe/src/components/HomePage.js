import React, { useState } from "react";
import "./css/HomePage.css";
import Popup from "reactjs-popup";
import UsernameSetting from "./dialog/UsernameSetting";

const HomePage = ({ moveOnToSelectMode }) => {
  const [showUsernameSetting, setShowUsernameSetting] = useState(false);

  const handleUsernameSubmit = () => {
    setShowUsernameSetting(false);
    moveOnToSelectMode();
  };

  return (
    <div className="HomeWrapper">
      <p className="title">MineSweeper</p>
      <div className="controlContainer">
        <Popup
          open={showUsernameSetting}
          position="center"
          closeOnDocumentClick={false}
        >
          <div className="blurredBackground" />
          <UsernameSetting close={handleUsernameSubmit} />
        </Popup>
        <button className="btn" onClick={() => setShowUsernameSetting(true)}>
          Start
        </button>
      </div>
    </div>
  );
};
export default HomePage;
