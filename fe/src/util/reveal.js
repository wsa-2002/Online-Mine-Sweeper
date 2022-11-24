/****************************************************************************
  FileName      [ reveal.js ]
  PackageName   [ src/util ]
  Author        [ Cheng-Hua Lu, Chin-Yi Cheng ]
  Synopsis      [ This file states the reaction when left clicking a cell. ]
  Copyright     [ 2021 10 ]
****************************************************************************/

export const revealed = (board, x, y, newNonMinesCount) => {
  {
    /* -- TODO 4-2 -- */
  }
  {
    /* Useful Hint: If the cell is already revealed, do nothing. */
  }
  {
    /* Useful Hint: If the value of the cell is not 0, only show the cell value. */
  }
  if (!board[x][y].revealed && board[x][y].value !== 0) {
    console.log("!");
    board[x][y].revealed = true;
  }

  {
    /* -- TODO 4-2 -- */
  }
  {
    /* Useful Hint: If the value of the cell is 0, we should try to find the value of adjacent cells until the value we found is not 0. */
  }
  {
    /* Useful Hint: The input variables 'newNonMinesCount' and 'board' may be changed in this function. */
  }
  if (!board[x][y].revealed && board[x][y] === 0) {
    for (let a = 0; a < board.length; a++) {
      for (let b = 0; b < board.length; b++) {}
    }
  }

  return { board, newNonMinesCount };
};
