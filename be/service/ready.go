package service

import "go.mongodb.org/mongo-driver/bson/primitive"

type ReadyInput struct {
	RoomNumber int `json:"room_number"`
}

type ReadyOutput struct {
	StartTime primitive.DateTime `json:"start_time"`
	Turns     string             `json:"turns"`
}

func HandleReady(username string, data ReadyInput) (*ReadyOutput, error) {
	return nil, nil
}
