/****************************************************************************
  FileName      [ createBoard.js ]
  PackageName   [ src/util ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file generates the pattern of mines and the board. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

// import randomNum from "./randomFixSeed";

// eslint-disable-next-line
export default (boardSize) => {
	let board = [];

	// Create a blank board
	for (let x = 0; x < boardSize; x++) {
		let subCol = [];
		for (let y = 0; y < boardSize; y++) {
			subCol.push({
				value: -3,
				x: x,
				y: y,
			});
		}
		board.push(subCol);
	}

	return board;
};
