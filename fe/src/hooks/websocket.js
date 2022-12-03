import { useEffect, useState } from "react";

const client = new WebSocket("ws://localhost:8000/socket");

client.onopen = () => {
	console.log("connection established");
};

client.onclose = () => {
	console.log("connection closed");
};

const sendData = async (data) => {
	client.send(JSON.stringify(data));
};

const sendSetup = (data) => {
	sendData({ task: "setup", ...data });
};

const sendReady = (data) => {
	sendData({ task: "ready", ...data });
};

const sendAction = (data) => {
	sendData({ task: "action", ...data });
};

const sendCheckStatus = (data) => {
	sendData({ task: "check_status", ...data });
};

const useReceiveMsg = (taskLabel) => {
	const [data, setData] = useState(null);
	const [task, setTask] = useState(null);

	client.onmessage = (bytestring) => {
		var { data } = bytestring;
		var { task, data, error } = JSON.parse(data);
		if (task === taskLabel) {
			if (error) {
				console.log("server error msg:", error);
				return;
			}
			setTask(task);
			setData(data);
		}
	};

	return { task, data };
};

export { useReceiveMsg, sendSetup, sendReady, sendAction, sendCheckStatus };
