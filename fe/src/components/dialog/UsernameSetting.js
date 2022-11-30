import React, { useState } from "react";
import "../css/dialog/UsernameSetting.css";

const UsernameSetting = ({ close }) => {
  const [username, setUsername] = useState(null);

  const handleSubmit = () => {
    console.log(username);
    // TODO: send username to somewhere
    close();
  };

  //TODO: disabled button if name is empty

  return (
    <div className="smDialog">
      <p className="smDialogTitle">Enter Your Name</p>
      <input onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleSubmit} className="dialogBtn">
        Submit
      </button>
    </div>
  );
};

export default UsernameSetting;
