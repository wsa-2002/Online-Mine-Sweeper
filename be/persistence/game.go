package persistence

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

const gameCollectionName = "game"

type Game struct {
	User1            string    `bson:"username1"`
	User2            string    `bson:"username2,omitempty"`
	RoomId           int       `bson:"room_id"`
	RoomType         string    `bson:"room_type"`
	MineNum          int       `bson:"mine_num"`
	BoardSize        int       `bson:"board_size"`
	TimeLimit        int       `bson:"time_limit"`
	IsFinished       bool      `bson:"is_finished"`
	IsUser1Ready     bool      `bson:"is_user1_ready"`
	IsUser2Ready     bool      `bson:"is_user2_ready"`
	StartTime        time.Time `bson:"start_time"`
	Turn             string    `bson:"turn"`
	User1TimeLeft    float32   `bson:"user1_time_left"`
	User2TimeLeft    float32   `bson:"user2_time_left"`
	LastResponseTime time.Time `bson:"last_response_time"`
	Winner           string    `bson:"winner"`
	Board            [][]Board `bson:"board"`
}

type Board struct {
	CellType   int  `bson:"cell_type"`
	IsRevealed bool `bson:"is_revealed"`
	IsFlagged  bool `bson:"is_flagged"`
}

func CreateGame(creatorUsername string, roomId int, roomType string, mineNum int, boardSize int,
	timeLimit int) (*Game, error) {
	collection := DB.Collection(gameCollectionName)
	newGame := Game{
		RoomId:        roomId,
		User1:         creatorUsername,
		RoomType:      roomType,
		MineNum:       mineNum,
		BoardSize:     boardSize,
		TimeLimit:     timeLimit,
		User1TimeLeft: float32(timeLimit),
		User2TimeLeft: float32(timeLimit),
		IsFinished:    false,
	}

	_, err := collection.InsertOne(context.TODO(), newGame)
	if err != nil {
		return nil, err
	}
	return &newGame, nil
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

func EditUserReadyStatus(roomId int, status bool, updateColumn string) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{{updateColumn, status}}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func CheckReadyStatus(roomId int) (bool, error) {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	var result *Game
	if err := collection.FindOne(context.TODO(), filter).Decode(&result); err != nil {
		return false, err
	}
	if result.IsUser1Ready && result.IsUser2Ready {
		return true, nil
	}
	return false, nil
}

func SetGameStart(roomId int, startTime time.Time, turn string) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{
		{"start_time", startTime},
		{"turn", turn},
		{"last_response_time", startTime},
	}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func SetBoard(roomId int, board [][]Board) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{
		{"board", board},
	}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func UpdateGameStatus(roomId int, turn string, user1TimeLeft float32, user2TimeLeft float32) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{
		{"turn", turn},
		{"user1_time_left", user1TimeLeft},
		{"user2_time_left", user2TimeLeft},
	}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func UpdateResponseTime(roomId int, responseTime time.Time) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{{"last_response_time", responseTime}}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}

func SetGameFinish(roomId int) error {
	collection := DB.Collection(gameCollectionName)
	filter := bson.D{{"room_id", roomId}}
	update := bson.D{{"$set", bson.D{{"is_finished", true}}}}
	_, err := collection.UpdateOne(context.TODO(), filter, update)
	return err
}
