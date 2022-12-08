/****************************************************************************
  FileName      [ Modal.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the Modal component. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React, { useEffect, useState } from "react";
import "./css/Modal.css";

export default function Modal({ backToHome, win }) {
	const [render, setRender] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			setRender(true);
		}, 1000);
	}, []);

	return (
		<div className="modal" style={{ opacity: render ? 1 : 0 }}>
			<div className="modalWrapper"></div>
			<div className="modalContent">
				{win ? (
					<div className="modalResult">Win</div>
				) : (
					<div className="modalResult">You lose</div>
				)}
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
