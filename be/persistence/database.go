package persistence

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

var (
	client *mongo.Client
	err    error
	DB     *mongo.Database
)

func Init(mongoUri string, dbName string) error {
	if client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoUri).SetConnectTimeout(5*time.Second)); err != nil {
		fmt.Print(err)
		return err
	}
	DB = client.Database(dbName)
	return nil
}

func Close() error {
	return client.Disconnect(context.TODO())
}
