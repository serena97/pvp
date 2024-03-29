package db

import (
	"context"
	"pvp/models"

	"go.mongodb.org/mongo-driver/bson"
)

const realmCollection collection = "realms"

func (db Database) GetRealms(ctx context.Context) ([]*models.Realm, error) {
	collection := db.Database(db.dbName).Collection(string(realmCollection))
	var realms []*models.Realm
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	if err := cur.All(ctx, &realms); err != nil {
		return nil, err
	}

	return realms, nil
}

func (db Database) InsertRealms(realms []*models.Realm) error {
	collection := db.Database(db.dbName).Collection(string(realmCollection))
	docs := make([]interface{}, len(realms))
	for i, realm := range realms {
		docs[i] = realm
	}
	if _, err := collection.InsertMany(context.TODO(), docs); err != nil {
		return err
	}

	return nil
}
