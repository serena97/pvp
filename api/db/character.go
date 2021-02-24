package db

import (
	"context"
	"pvp/models"

	"go.mongodb.org/mongo-driver/bson"
)

const characterCollection collection = "characters"

func (db Database) GetCharacterByID(ctx context.Context, id int) (*models.Character, error) {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	var c *models.Character
	filter := bson.D{{"_id", id}}
	if err := collection.FindOne(ctx, filter).Decode(&c); err != nil {
		return nil, err
	}

	return c, nil
}

func (db Database) GetCharacterByNameRealmSlugRegion(ctx context.Context, name, realmSlug, region string) (*models.Character, error) {
	var c *models.Character
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	filter := bson.D{{"name", name}, {"realmslug", realmSlug}, {"region", region}}
	if err := collection.FindOne(ctx, filter).Decode(&c); err != nil {
		return nil, err
	}

	return c, nil
}

func (db Database) InsertCharacter(ctx context.Context, c *models.Character) error {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	if _, err := collection.InsertOne(ctx, c); err != nil {
		return err
	}

	return nil
}
