import React, { useState, useEffect } from "react";
import "../css/dialog/UsernameSetting.css";

const UsernameSetting = ({ close, username, setUsername }) => {
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleSubmit = () => {
    setUsername(username);
    close(); // close UsernameSetting dialog and show select mode (hide home page)
  };

  useEffect(() => {
    if (username) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [username]);

  return (
    <div className="smDialog">
      <p className="smDialogTitle">Enter Your Name</p>
      <input onChange={(e) => setUsername(e.target.value)} />
      <button
        onClick={handleSubmit}
        className="dialogBtn"
        disabled={submitDisabled}
      >
        Submit
      </button>
    </div>
  );
};

export default UsernameSetting;
