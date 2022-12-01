import { useEffect, useState } from "react";
// client side
const client = new WebSocket("ws://localhost:8000");

const username = "whoami"; // string

const sendData = async (data) => {
	await client.send(JSON.stringify(data));
};

const sendSetup = (data) => {
	sendData({ task: "setup", data });
};

const sendReady = (data) => {
	sendData({ task: "ready", username: username, data: data });
};

const sendAction = (data) => {
	sendData({ task: "action", username: username, data: data });
};

const sendCheckStatus = (data) => {
	sendData({ task: "check_status", username: username, data: data });
};

client.onopen = () => {
	console.log("hello");
};

client.onclose = () => {
	console.log("connection closed");
};

// home page
const useSetup = () => {
	const [setupRes, setSetupRes] = useState(null);

	client.onmessage = (bytestring) => {
		const { raw } = bytestring;
		const { task, data, error } = JSON.parse(raw);

		if (task === "setup") {
			setSetupRes(data);
		}
	};
	return { sendSetup, setupRes };
};

// board page
const useReady = () => {
	const [readyRes, setReadyRes] = useState(null);

	client.onmessage = (bytestring) => {
		const { raw } = bytestring;
		const { task, data, error } = JSON.parse(raw);

		if (task === "ready") {
			setReadyRes(data);
		}
	};

	// 模擬input可以先這樣寫
	useEffect(() => {
		setReadyRes({
			start_time: "2022-11-29T21:25:00",
			turns: "string", // username
		});
	}, []);

	return { sendReady, readyRes };
};

// board page
const useUpdate = () => {
	const [updateRes, setUpdateRes] = useState(null);

	client.onmessage = (bytestring) => {
		const { raw } = bytestring;
		const { task, data, error } = JSON.parse(raw);
		if (task === "update_board") {
			setUpdateRes(data);
		}
	};
	return { sendAction, updateRes };
};

// board page
const useCheck = () => {
	const [checkRes, setCheckRes] = useState(null);

	client.onmessage = (bytestring) => {
		const { raw } = bytestring;
		const { task, data, error } = JSON.parse(raw);
		if (task === "check_status") {
			setCheckRes(data);
		}
	};
	return { sendCheckStatus, checkRes };
};

export { useReady, useCheck, useSetup, useUpdate };
