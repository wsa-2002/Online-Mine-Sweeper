/****************************************************************************
  FileName      [ App.js ]
  PackageName   [  ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [  ]
  Copyright     [ 2021 10 ]
****************************************************************************/

import React from "react";
import "./App.css";
import MineSweeper from "./containers/MineSweeper";
import { WebsocketProvider } from "./context/websocket";

const App = () => {
	return (
		<div className="App">
			<WebsocketProvider>
				<MineSweeper />
			</WebsocketProvider>
		</div>
	);
};

export default App;
