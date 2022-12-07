import { createContext, useEffect, useState, useRef } from "react";

export const WebsocketContext = createContext(null, () => {
	return 1;
});

export const WebsocketProvider = ({ children }) => {
	const [value, setValue] = useState({
		task: null,
		data: null,
		error: null,
	});

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
			// console.log(data);
			if (error) {
				console.log("server error msg: ", error);
			}
			setValue({
				task,
				data,
				error,
			});
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

	const ret = [value, sendData];

	return (
		<WebsocketContext.Provider value={ret}>
			{children}
		</WebsocketContext.Provider>
	);
};
