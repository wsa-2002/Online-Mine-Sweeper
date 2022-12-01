package persistence

import (
	"context"
)

var gameCollection = "game"

type Game struct {
	User1      string `json:"user1_id"`
	User2      string `json:"user2_id,omitempty"`
	RoomId     int    `json:"room_id"`
	RoomType   string `json:"room_type"`
	MineNum    int    `json:"mine_num"`
	BoardSize  int    `json:"board_size"`
	TimeLimit  int    `json:"time_limit"`
	IsFinished bool   `json:"is_finished"`
}

func CreateGame(creatorUsername string, roomId int, roomType string, mineNum int, boardSize int,
	timeLimit int) (*Game, error) {
	collection := DB.Collection(gameCollection)
	newGame := Game{
		RoomId:     roomId,
		User1:      creatorUsername,
		RoomType:   roomType,
		MineNum:    mineNum,
		BoardSize:  boardSize,
		TimeLimit:  timeLimit,
		IsFinished: false,
	}

	_, err := collection.InsertOne(context.TODO(), newGame)
	if err != nil {
		return nil, err
	}
	return &newGame, nil
}
