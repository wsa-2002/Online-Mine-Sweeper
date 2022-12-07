package service

import (
	"be/persistence"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"math/rand"
	"time"
)

type ActionInput struct {
	RoomNumber int    `json:"room_number"`
	ActionType string `json:"action_type"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
}

type ActionOutput struct {
	Status   string      `json:"status"`
	Winner   string      `json:"winner"`
	Turns    string      `json:"turns"`
	TimeLeft interface{} `json:"time_left"`
	Board    [][]int     `json:"board"`
}

type mineLocation struct {
	x int
	y int
}

func HandleAction(username string, data ActionInput, requestTime time.Time) (*ActionOutput, error) {
	gameInfo, err := persistence.GetGameByRoomId(data.RoomNumber)
	if err != nil {
		return nil, err
	}
	if gameInfo.Turn != username {
		return nil, errors.New("no permission")
	}
	if !gameInfo.IsUser1Ready && !gameInfo.IsUser2Ready {
		return nil, errors.New("user hasn't ready")
	}
	if gameInfo.StartTime.After(requestTime) {
		return nil, errors.New("game hasn't start")
	}
	if len(gameInfo.Board) == 0 {
		board := createBoard(gameInfo.BoardSize, gameInfo.MineNum, data.X, data.Y)
		gameInfo.Board = board
		if err := persistence.SetBoard(gameInfo.RoomId, board); err != nil {
			return nil, err
		}
	}

	var (
		board = gameInfo.Board
		x     = data.X
		y     = data.Y
	)
	var timeLeft float32
	if gameInfo.User1 == username {
		if timeLeft = gameInfo.User1TimeLeft - float32((requestTime.Sub(gameInfo.LastResponseTime)).Seconds()); timeLeft < 0 {
			if err = persistence.SetGameFinish(gameInfo.RoomId); err != nil {
				return nil, err
			}
			return &ActionOutput{
				Status: "GAMEOVER",
				Winner: gameInfo.User2,
				Board:  renderBoard(board),
			}, nil
		}
	} else {
		if timeLeft = gameInfo.User2TimeLeft - float32((requestTime.Sub(gameInfo.LastResponseTime)).Seconds()); timeLeft < 0 {
			if err = persistence.SetGameFinish(gameInfo.RoomId); err != nil {
				return nil, err
			}
			return &ActionOutput{
				Status: "GAMEOVER",
				Winner: gameInfo.User1,
				Board:  renderBoard(board),
			}, nil
		}
	}
	switch data.ActionType {
	case "STEP":
		board[x][y].IsRevealed = true
		// cond 1: if step on a mine
		if board[x][y].CellType == -1 {
			var winner string
			if gameInfo.User1 == username {
				winner = gameInfo.User2
			} else {
				winner = gameInfo.User1
			}
			if err = persistence.SetGameFinish(gameInfo.RoomId); err != nil {
				return nil, err
			}
			return &ActionOutput{
				Status: "GAMEOVER",
				Winner: winner,
				Board:  renderBoard(board),
			}, nil
		}
		// update board
		recursiveRevealBoard(&board, x, y)

		// check board status
		if isGameOver(board) {
			gameInfo, _ = persistence.GetGameByRoomId(data.RoomNumber)
			var winner string
			if gameInfo.User1TimeLeft > gameInfo.User2TimeLeft {
				winner = gameInfo.User1
			} else {
				winner = gameInfo.User2
			}
			if err = persistence.SetGameFinish(gameInfo.RoomId); err != nil {
				return nil, err
			}
			return &ActionOutput{
				Status: "GAMEOVER",
				Winner: winner,
				Board:  renderBoard(board),
			}, nil
		}
	case "FLAG":
		board[x][y].IsFlagged = !board[x][y].IsFlagged
	}
	if err := persistence.SetBoard(data.RoomNumber, board); err != nil {
		return nil, err
	}
	var turn string
	if gameInfo.Turn == gameInfo.User1 {
		turn = gameInfo.User2
		gameInfo.User1TimeLeft = timeLeft
	} else {
		turn = gameInfo.User1
		gameInfo.User2TimeLeft = timeLeft
	}
	if err := persistence.UpdateGameStatus(data.RoomNumber, turn, gameInfo.User1TimeLeft, gameInfo.User2TimeLeft); err != nil {
		return nil, err
	}
	gameInfo, _ = persistence.GetGameByRoomId(data.RoomNumber)
	if err := persistence.UpdateResponseTime(data.RoomNumber, time.Now()); err != nil {
		return nil, err
	}

	return &ActionOutput{
		Status: "KEEP",
		Board:  renderBoard(board),
		Turns:  turn,
		TimeLeft: bson.M{
			gameInfo.User1: gameInfo.User1TimeLeft,
			gameInfo.User2: gameInfo.User2TimeLeft,
		},
	}, nil
}

func createBoard(boardSize int, mineNum int, initX int, initY int) [][]persistence.Board {
	board := make([][]persistence.Board, boardSize)
	mineLocations := make([]mineLocation, mineNum)
	for i := 0; i < boardSize; i++ {
		board[i] = make([]persistence.Board, boardSize)
	}
	var mineCount = 0
	for mineCount < mineNum {
		var (
			x = rand.Intn(boardSize)
			y = rand.Intn(boardSize)
		)
		if board[x][y].CellType != -1 && x != initX && y != initY {
			board[x][y].CellType = -1
			mineLocations[mineCount] = mineLocation{x, y}
			mineCount++
		}
	}
	for _, location := range mineLocations {
		for x := location.x - 1; x <= location.x+1; x++ {
			for y := location.y - 1; y <= location.y+1; y++ {
				if x < 0 || y < 0 || x > boardSize-1 || y > boardSize-1 {
					continue
				}
				if board[x][y].CellType != -1 {
					board[x][y].CellType++
				}
			}
		}
	}
	return board
}

func renderBoard(board [][]persistence.Board) [][]int {
	boardSize := len(board)
	render := make([][]int, boardSize)
	for x := 0; x < boardSize; x++ {
		render[x] = make([]int, boardSize)
		for y := 0; y < boardSize; y++ {
			if board[x][y].IsRevealed {
				render[x][y] = board[x][y].CellType
			} else if board[x][y].IsFlagged {
				render[x][y] = -2
			} else {
				render[x][y] = -3
			}
		}
	}
	return render
}

func isGameOver(board [][]persistence.Board) bool {
	boardSize := len(board)
	for x := 0; x < boardSize; x++ {
		for y := 0; y < boardSize; y++ {
			if board[x][y].CellType > 0 && !board[x][y].IsRevealed {
				return false
			}
		}
	}
	return true
}

func recursiveRevealBoard(board *[][]persistence.Board, x int, y int) {
	boardSize := len(*board)
	for i := x - 1; i <= x+1; i++ {
		for j := y - 1; j <= y+1; j++ {
			if i < 0 || j < 0 || i > boardSize-1 || j > boardSize-1 || (i == x && j == y) {
				continue
			}
			if (*board)[i][j].IsRevealed == true {
				continue
			}
			if (*board)[i][j].CellType == 0 {
				(*board)[i][j].IsRevealed = true
				recursiveRevealBoard(board, i, j)
			} else if (*board)[i][j].CellType > 0 {
				(*board)[i][j].IsRevealed = true
			}
		}
	}
}
