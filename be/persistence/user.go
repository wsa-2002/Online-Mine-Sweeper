package persistence

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var userCollection = "user"

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
}

func getLastRecord() int {
	collection := DB.Collection(userCollection)
	opts := options.FindOne().SetSort(bson.M{"$natural": -1})
	var lastRecord bson.M
	if err := collection.FindOne(context.TODO(), opts).Decode(&lastRecord); err != nil {
		return 1
	}
	return lastRecord["id"].(int)
}

func CreateUser(username string) *mongo.InsertOneResult {
	collection := DB.Collection(userCollection)
	lastId := getLastRecord()
	newUser := User{Id: lastId + 1, Username: username}
	result, err := collection.InsertOne(context.TODO(), newUser)
	if err != nil {
		fmt.Println(err.Error())
		panic(err)
	}
	return result
}
