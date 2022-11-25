package persistence

import (
	"context"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var gameCollection = "game"

type Game struct {
	User1     primitive.ObjectID `json:"user1_id"`
	User2     int                `json:"user2_id,omitempty"`
	RoomId    string             `json:"room_id"`
	RoomType  string             `json:"room_type"`
	MineNum   int                `json:"mine_num"`
	BoardSize int                `json:"board_size"`
	TimeLimit int                `json:"time_limit"`
}

func CreateGame(creatorId primitive.ObjectID, roomType string, mineNum int, boardSize int,
	timeLimit int) (*mongo.InsertOneResult, error) {
	collection := DB.Collection(gameCollection)
	newUuid := uuid.New().String()
	roomId := newUuid[len(newUuid)-6:]
	newGame := Game{RoomId: roomId, User1: creatorId, RoomType: roomType, MineNum: mineNum,
		BoardSize: boardSize, TimeLimit: timeLimit}

	result, err := collection.InsertOne(context.TODO(), newGame)
	if err != nil {
		return nil, err
	}
	return result, nil
}
