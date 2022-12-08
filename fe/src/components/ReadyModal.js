/****************************************************************************
  FileName      [ Modal.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Modal component. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from "react";
import "./css/ReadyModal.css";

export default function ReadyModal({ roomNumber, readyGame }) {
	const [disabled, setDisabled] = useState(false);
	const [waitMsg, setWaitMsg] = useState(false);

	const onReady = () => {
		readyGame();
		setDisabled(true);
	};

	useEffect(() => {
		if (disabled) {
			setWaitMsg(true);
		}
	}, [disabled]);

	return (
		<div className="modal" style={{ opacity: 1 }}>
			<div className="modalWrapper"></div>
			<div className="readyModalContent">
				<div className="readyModalText">Room Number : {roomNumber}</div>
				<div className="readyModalSubText">Press Ready to go!</div>
				<div className="readyBtnWrapper">
					<button className="readybtn" disabled={disabled} onClick={onReady}>
						Ready
					</button>
				</div>
				{waitMsg && <p className="waitMsg">⚠️ waiting for others to join</p>}
			</div>
			<div className="modalWrapper"></div>
		</div>
	);
}
