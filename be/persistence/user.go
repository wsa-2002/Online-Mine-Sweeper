package persistence

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
)

const userCollectionName = "user"

type User struct {
	Username string `json:"username"`
}

func CreateUser(username string) *mongo.InsertOneResult {
	collection := DB.Collection(userCollectionName)
	newUser := User{Username: username}
	result, err := collection.InsertOne(context.TODO(), newUser)
	if err != nil {
		panic(err)
	}
	return result
}
