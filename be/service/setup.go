package service

import (
	"be/persistence"
	"errors"
	"math/rand"
)

type SetUpInput struct {
	RoomOption string `json:"room_option"`
	BoardSize  int    `json:"board_size,omitempty"`
	MineNum    int    `json:"mine_num,omitempty"`
	TimeLimit  int    `json:"time_limit,omitempty"`
	RoomType   string `json:"room_type,omitempty"`
	RoomNumber int    `json:"room_number,omitempty"`
}

type SetUpOutput struct {
	BoardSize     int    `json:"board_size"`
	MineNum       int    `json:"mine_num"`
	TimeLimit     int    `json:"time_limit"`
	RoomType      string `json:"room_type"`
	RoomNumber    int    `json:"room_number"`
	RivalUsername string `json:"rival_username"`
}

const MaxRoomId = 1000

func SetUp(username string, data SetUpInput) (*SetUpOutput, error) {
	if persistence.UserIsInGame(username) {
		return nil, errors.New("username is used")
	}
	switch data.RoomOption {
	case "NEW":
		roomId := rand.Intn(MaxRoomId)
		gameInfo, err := persistence.CreateGame(username, roomId, data.RoomType, data.MineNum, data.BoardSize, data.TimeLimit)
		if err != nil {
			return nil, err
		}
		return &SetUpOutput{
			BoardSize:  gameInfo.BoardSize,
			MineNum:    gameInfo.MineNum,
			TimeLimit:  gameInfo.TimeLimit,
			RoomType:   gameInfo.RoomType,
			RoomNumber: gameInfo.RoomId,
		}, nil
	case "RANDOM":
		gameInfo, err := persistence.GetRandomGame()
		if err != nil {
			return nil, err
		}
		if gameInfo == nil {
			return nil, errors.New("no rooms available")
		}
		err = persistence.AddUserIntoGame(username, gameInfo.RoomId)
		if err != nil {
			return nil, err
		}
		return &SetUpOutput{
			BoardSize:     gameInfo.BoardSize,
			MineNum:       gameInfo.MineNum,
			TimeLimit:     gameInfo.TimeLimit,
			RoomType:      gameInfo.RoomType,
			RoomNumber:    gameInfo.RoomId,
			RivalUsername: gameInfo.User1,
		}, nil
	case "ASSIGN":
		gameInfo, err := persistence.GetGameByRoomId(data.RoomNumber)
		if err != nil || gameInfo.IsFinished || gameInfo.RoomType == "PRIVATE" {
			return nil, errors.New("room not found")
		}
		if gameInfo.User2 != "" {
			return nil, errors.New("room is full")
		}
		err = persistence.AddUserIntoGame(username, data.RoomNumber)
		if err != nil {
			return nil, err
		}
		return &SetUpOutput{
			BoardSize:     gameInfo.BoardSize,
			MineNum:       gameInfo.MineNum,
			TimeLimit:     gameInfo.TimeLimit,
			RoomType:      gameInfo.RoomType,
			RoomNumber:    gameInfo.RoomId,
			RivalUsername: gameInfo.User1,
		}, nil
	default:
		return nil, errors.New("invalid room type")
	}
}
