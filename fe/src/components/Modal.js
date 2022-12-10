/****************************************************************************
  FileName      [ Modal.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Modal component. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from "react";
import "./css/Modal.css";

export default function Modal({ backToHome, win, overReason }) {
	const [render, setRender] = useState(false);
	const [reason, setReason] = useState(overReason);
	useEffect(() => {
		setTimeout(() => {
			setRender(true);
		}, 1000);
	}, []);

	useEffect(() => {
		setReason(overReason);
	}, []);

	return (
		<div className="modal" style={{ opacity: render ? 1 : 0 }}>
			<div className="modalWrapper"></div>
			<div className="modalContent">
				{win ? (
					<div className="modalResult">You Win</div>
				) : (
					<div className="modalResult">You Lose</div>
				)}
				<p className="modalSubText">{reason}</p>
				<div className="modalBtnWrapper">
					<div className="modalBtn" onClick={backToHome}>
						Back to Home
					</div>
				</div>
			</div>
			<div className="modalWrapper"></div>
		</div>
	);
}
