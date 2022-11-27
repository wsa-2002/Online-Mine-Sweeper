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

  {
    /* -- TODO 4-2 -- */
  }
  {
    /* Useful Hint: If the value of the cell is 0, we should try to find the value of adjacent cells until the value we found is not 0. */
  }
  {
    /* Useful Hint: The input variables 'newNonMinesCount' and 'board' may be changed in this function. */
  }

  console.log(board[x][y]);
  if (board[x][y].revealed) return;

  let flipped = [];
  flipped.push(board[x][y]);
  while (flipped.length !== 0) {
    let single = flipped.pop();
    if (!single.revealed) {
      newNonMinesCount--;
      single.revealed = true;
    }
    if (single.value !== 0) break;

    // Bottom - Right
    if (
      single.x > 0 &&
      single.y > 0 &&
      board[single.x - 1][single.y - 1].value === 0 &&
      !board[single.x - 1][single.y - 1].revealed
    )
      flipped.push(board[single.x - 1][single.y - 1]);

    // Bottom - Left
    if (
      single.x < board.length - 1 &&
      single.y < board[0].length - 1 &&
      board[single.x + 1][single.y + 1].value === 0 &&
      !board[single.x + 1][single.y + 1].revealed
    )
      flipped.push(board[single.x + 1][single.y + 1]);

    // Top - Left
    if (
      single.x < board.length - 1 &&
      single.y > 0 &&
      board[single.x + 1][single.y - 1].value === 0 &&
      !board[single.x + 1][single.y - 1].revealed
    )
      flipped.push(board[single.x + 1][single.y - 1]);

    // Top - Right
    if (
      single.x > 0 &&
      single.y < board[0].length - 1 &&
      board[single.x - 1][single.y + 1].value === 0 &&
      !board[single.x - 1][single.y + 1].revealed
    )
      flipped.push(board[single.x - 1][single.y + 1]);

    // Single ones

    // Top
    if (
      single.x > 0 &&
      board[single.x - 1][single.y].value === 0 &&
      !board[single.x - 1][single.y].revealed
    )
      flipped.push(board[single.x - 1][single.y]);

    // Bottom
    if (
      single.x < board.length - 1 &&
      board[single.x + 1][single.y].value === 0 &&
      !board[single.x + 1][single.y].revealed
    )
      flipped.push(board[single.x + 1][single.y]);

    // Left
    if (
      single.y > 0 &&
      board[single.x][single.y - 1].value === 0 &&
      !board[single.x][single.y - 1].revealed
    )
      flipped.push(board[single.x][single.y - 1]);

    // Right
    if (
      single.y < board[0].length - 1 &&
      board[single.x][single.y + 1].value === 0 &&
      !board[single.x][single.y + 1].revealed
    )
      flipped.push(board[single.x][single.y + 1]);

    // Start reveal items

    // Top left
    if (
      single.x > 0 &&
      single.y > 0 &&
      !board[single.x - 1][single.y - 1].revealed
    ) {
      board[single.x - 1][single.y - 1].revealed = true;
      newNonMinesCount--;
    }

    // Left
    if (single.y > 0 && !board[single.x][single.y - 1].revealed) {
      board[single.x][single.y - 1].revealed = true;
      newNonMinesCount--;
    }

    // Bottom left
    if (
      single.x < board.length - 1 &&
      single.y > 0 &&
      !board[single.x + 1][single.y - 1].revealed
    ) {
      board[single.x + 1][single.y - 1].revealed = true;
      newNonMinesCount--;
    }

    // Bottom
    if (
      single.x < board.length - 1 &&
      !board[single.x + 1][single.y].revealed
    ) {
      board[single.x + 1][single.y].revealed = true;
      newNonMinesCount--;
    }

    // Bottom right
    if (
      single.x < board.length - 1 &&
      single.y < board[0].length - 1 &&
      !board[single.x + 1][single.y + 1].revealed
    ) {
      board[single.x + 1][single.y + 1].revealed = true;
      newNonMinesCount--;
    }

    // Right
    if (
      single.y < board[0].length - 1 &&
      !board[single.x][single.y + 1].revealed
    ) {
      board[single.x][single.y + 1].revealed = true;
      newNonMinesCount--;
    }

    // Top right
    if (
      single.x > 0 &&
      single.y < board[0].length - 1 &&
      !board[single.x - 1][single.y + 1].revealed
    ) {
      board[single.x - 1][single.y + 1].revealed = true;
      newNonMinesCount--;
    }

    // Top
    if (single.x > 0 && !board[single.x - 1][single.y].revealed) {
      board[single.x - 1][single.y].revealed = true;
      newNonMinesCount--;
    }
  }

  return { board, newNonMinesCount };
};
