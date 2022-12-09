package service

import (
	"be/persistence"
	"errors"
	"time"
)

type ReadyInput struct {
	RoomNumber int `json:"room_number"`
}

type ReadyOutput struct {
	StartTime time.Time `json:"start_time"`
	Turns     string    `json:"turns"`
}

func HandleReady(username string, data ReadyInput) (*ReadyOutput, error) {
	gameInfo, err := persistence.GetGameByRoomId(data.RoomNumber)
	if err != nil {
		return nil, err
	}
	if gameInfo.User1 == username {
		err = persistence.EditUserReadyStatus(data.RoomNumber, true, "is_user1_ready")
	} else if gameInfo.User2 == username {
		err = persistence.EditUserReadyStatus(data.RoomNumber, true, "is_user2_ready")
	} else {
		err = errors.New("user not in room")
	}
	if err != nil {
		return nil, err
	}
	ready, err := persistence.CheckReadyStatus(data.RoomNumber)
	if err != nil {
		return nil, err
	}
	if ready {
		startTime := time.Now().Add(time.Second * 4)
		err = persistence.SetGameStart(gameInfo.RoomId, startTime, gameInfo.User1, gameInfo.TimeLimit)
		if err != nil {
			return nil, err
		}
		return &ReadyOutput{
			StartTime: startTime,
			Turns:     gameInfo.User1,
		}, nil
	}
	return nil, nil
}
