package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type CreateRoomInput struct {
	CreatorId primitive.ObjectID `json:"creator_id"`
	RoomType  string             `json:"room_type"`
	MineNum   int                `json:"mine_num"`
	BoardSize int                `json:"board_size"`
	TimeLimit int                `json:"time_limit"`
}
