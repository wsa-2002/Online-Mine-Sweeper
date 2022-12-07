import { createContext, useEffect, useState, useRef } from "react";

export const WebsocketContext = createContext(null, null, null, () => {});

export const WebsocketProvider = ({ children }) => {
	const [task, setTask] = useState(null);
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);

	const ws = useRef(null);

	useEffect(() => {
		const client = new WebSocket(process.env.REACT_APP_ClIENT_ADDRESS);

		client.onopen = () => {
			console.log("connection established");
		};
		client.onclose = () => {
			console.log("connection closed");
		};
		client.onmessage = (bytestring) => {
			var { data } = bytestring;
			var { task, data, error } = JSON.parse(data);
			if (error) {
				console.log("server error msg: ", error);
			}
			setValue(data);
			setTask(task);
			setError(error);
		};

		ws.current = client;

		return () => {
			client.close();
		};
	}, []);

	const sendData = async (data) => {
		const bindSend = ws.current?.send.bind(ws.current);
		bindSend(JSON.stringify(data));
	};

	const ret = [task, value, error, sendData];

	return (
		<WebsocketContext.Provider value={ret}>
			{children}
		</WebsocketContext.Provider>
	);
};
