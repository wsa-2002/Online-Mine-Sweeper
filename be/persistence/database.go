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
	//1.建立连接
	if client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoUri).SetConnectTimeout(5*time.Second)); err != nil {
		fmt.Print(err)
		return err
	}
	//defer func() {
	//	if err := client.Disconnect(context.TODO()); err != nil {
	//		panic(err)
	//	}
	//}()
	DB = client.Database(dbName)
	return nil
}

func Close() error {
	return client.Disconnect(context.TODO())
}
