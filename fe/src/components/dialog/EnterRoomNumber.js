import React, { useState, useEffect } from "react";
import "../css/dialog/UsernameSetting.css";

const EnterRoomNumber = ({ close, startGame }) => {
  const [roomNumber, setRoomNumber] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleSubmit = () => {
    console.log("roomNumber: ", roomNumber);
    // TODO: send username and roomNumber to somewhere
    close(); // close EnterRoomNumber dialog
    startGame();
  };

  useEffect(() => {
    if (roomNumber) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [roomNumber]);

  return (
    <div className="smDialog">
      <p className="smDialogTitle">Enter Room Number</p>
      <input onChange={(e) => setRoomNumber(e.target.value)} />
      <div>
        <button className="dialogBtn" onClick={close}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="dialogBtn"
          disabled={submitDisabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EnterRoomNumber;
