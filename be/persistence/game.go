package persistence

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

const gameCollectionName = "game"

type Game struct {
	User1      string `bson:"username1"`
	User2      string `bson:"username2,omitempty"`
	RoomId     int    `bson:"room_id"`
	RoomType   string `bson:"room_type"`
	MineNum    int    `bson:"mine_num"`
	BoardSize  int    `bson:"board_size"`
	TimeLimit  int    `bson:"time_limit"`
	IsFinished bool   `bson:"is_finished"`
}

func CreateGame(creatorUsername string, roomId int, roomType string, mineNum int, boardSize int,
	timeLimit int) (*Game, error) {
	collection := DB.Collection(gameCollectionName)
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

func GetUserGame(username string) (*Game, error) {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{
		{"$or", bson.A{
			bson.D{{"username1", username}},
			bson.D{{"username2", username}},
		}},
		{
			"is_finished", false,
		},
	}
	var userGame *Game
	err := collection.FindOne(context.TODO(), filter).Decode(&userGame)
	if err != nil {
		return nil, err
	}
	return userGame, nil
}

func UserIsInGame(username string) bool {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{
		{"$or", bson.A{
			bson.D{{"username1", username}},
			bson.D{{"username2", username}},
		}},
		{
			"is_finished", false,
		},
	}
	count, _ := collection.CountDocuments(context.TODO(), filter)
	return count > 0
}

func GetRandomGame() (*Game, error) {
	collection := DB.Collection(gameCollectionName)
	match := bson.D{
		{"$match", bson.D{
			{"$and", bson.A{
				bson.D{{"is_finished", false}},
				bson.D{{"room_type", "PUBLIC"}},
				bson.D{{"username2", nil}},
			}}},
		},
	}
	sample := bson.D{
		{"$sample", bson.D{{"size", 1}}},
	}
	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{match, sample})
	if err != nil {
		return nil, err
	}
	var results []*Game
	_ = cursor.All(context.TODO(), &results)
	for _, result := range results {
		return result, nil
	}
	return nil, nil
}

func AddUserIntoGame(username string, roomId int) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{{"username2", username}}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func GetGameByRoomId(roomId int) (*Game, error) {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	var game *Game
	if err := collection.FindOne(context.TODO(), filter).Decode(&game); err != nil {
		return nil, err
	}
	return game, nil

}
