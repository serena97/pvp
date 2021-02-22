package db

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	*mongo.Client
	dbName string
}

func NewDatabase(host, port, dbName string) (Database, error) {
	db := Database{}
	clientOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s", host, port))
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return db, err
	}
	if err := client.Ping(context.TODO(), nil); err != nil {
		return db, err
	}

	db.Client = client
	db.dbName = dbName
	return db, nil
}
