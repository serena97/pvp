package db

import (
	"context"
	"pvp/models"

	"go.mongodb.org/mongo-driver/bson"
)

type collection string

const characterCollection collection = "character"

func (db Database) GetCharacterByID(id int) (*models.Character, error) {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	var c *models.Character
	filter := bson.D{{"_id", id}}
	if err := collection.FindOne(context.TODO(), filter).Decode(&c); err != nil {
		return nil, err
	}

	return c, nil
}

func (db Database) GetCharacterByNameRealmRegion(name, realm, region string) (*models.Character, error) {
	var c *models.Character
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	filter := bson.D{{"name", name}, {"realm", realm}, {"region", region}}
	if err := collection.FindOne(context.TODO(), filter).Decode(&c); err != nil {
		return nil, err
	}

	return c, nil
}

func (db Database) AddCharacter(c *models.Character) error {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	if _, err := collection.InsertOne(context.TODO(), c); err != nil {
		return err
	}

	return nil
}
