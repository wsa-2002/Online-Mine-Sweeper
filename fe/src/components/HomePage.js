import React, { useState, useEffect } from "react";
import "./css/HomePage.css";
import Popup from "reactjs-popup";
import UsernameSetting from "./dialog/UsernameSetting";

const HomePage = ({ moveOnToSelectMode }) => {
  const [showUsernameSetting, setShowUsernameSetting] = useState(false);

  const handleUsernameSubmit = () => {
    setShowUsernameSetting(false);
    moveOnToSelectMode();
  };

  useEffect(() => {
    console.log(showUsernameSetting);
  }, [showUsernameSetting]);

  return (
    <div className="HomeWrapper">
      <p className="title">MineSweeper</p>
      <div className="controlContainer">
        <Popup
          open={showUsernameSetting}
          position="center"
          closeOnDocumentClick={false}
        >
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
