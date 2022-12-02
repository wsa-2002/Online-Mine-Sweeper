package service

import (
	"be/persistence"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
)

type CheckStatusInput struct {
	RoomNumber int `json:"room_number"`
}

type CheckStatusOutput struct {
	Status   string      `json:"status"`
	Winner   string      `json:"winner"`
	Turns    string      `json:"turns"`
	TimeLeft interface{} `json:"time_left"`
}

func CheckStatus(username string, data CheckStatusInput) (*CheckStatusOutput, error) {
	gameInfo, err := persistence.GetGameByRoomId(data.RoomNumber)
	if err != nil {
		return nil, err
	}
	if gameInfo.User1 != username && gameInfo.User2 != username {
		return nil, errors.New("room not found")
	}
	if gameInfo.IsFinished {
		return &CheckStatusOutput{
			Status: "GAMEOVER",
			Winner: gameInfo.Winner,
		}, nil
	} else {
		return &CheckStatusOutput{
			Status: "KEEP",
			Turns:  gameInfo.Turn,
			TimeLeft: bson.M{
				gameInfo.User1: gameInfo.User1TimeLeft,
				gameInfo.User2: gameInfo.User2TimeLeft,
			},
		}, nil
	}
}
