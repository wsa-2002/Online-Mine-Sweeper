import React, { useEffect, useState } from "react";
import "./css/CountDown.css";

export default function CountDown({ startTime, setCountDown, setGameStart }) {
	const [cnt, setCnt] = useState(3);

	useEffect(() => {
		const intervalID = setInterval(() => {
			const now = new Date();
			const diff = timeDiff(now, startTime);
			setCnt(diff);
			if (diff === 0) {
				clearInterval(intervalID);
				setTimeout(() => {
					setCountDown(false);
				}, 50);
				setGameStart(true);
			}
		}, 1000);
	}, []);

	const timeDiff = (now, start) => {
		const gap = start - now;
		console.log(gap / 1000);
		console.log(Math.floor(gap / 1000) + 1);
		return Math.floor(gap / 1000) + 1;
	};

	return (
		<div className="modal" style={{ opacity: 1 }}>
			<div className="modalWrapper"></div>
			<div className="countDownContent">
				<div className="countDown">{cnt}</div>
			</div>
			<div className="modalWrapper"></div>
		</div>
	);
}
