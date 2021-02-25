package db

import (
	"context"
	"pvp/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const characterCollection collection = "characters"

// GetCharacterByID searches for a character by its ID
func (db Database) GetCharacterByID(ctx context.Context, id int) (*models.Character, error) {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	var c *models.Character
	filter := bson.D{{"_id", id}}
	if err := collection.FindOne(ctx, filter).Decode(&c); err != nil {
		return nil, err
	}

	return c, nil
}

// GetCharacterByNameRealmSlugRegion searches for a character using its name, realm and region
func (db Database) GetCharacterByNameRealmSlugRegion(ctx context.Context, name, realmSlug, region string) (*models.Character, error) {
	var c *models.Character
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	filter := bson.D{{"name", name}, {"realmslug", realmSlug}, {"region", region}}
	if err := collection.FindOne(ctx, filter).Decode(&c); err != nil {
		return nil, err
	}

	return c, nil
}

// SearchCharactersByName searches with regex for any characters that matches the name prefix
func (db Database) SearchCharactersByName(ctx context.Context, name string, resultsLimit int64) ([]*models.Character, error) {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	filter := bson.D{{"name", primitive.Regex{Pattern: name, Options: ""}}}
	options := options.Find().SetLimit(resultsLimit)
	cur, err := collection.Find(ctx, filter, options)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var characters []*models.Character
	for cur.Next(ctx) {
		var c *models.Character
		if err := cur.Decode(&c); err != nil {
			return nil, err
		}
		characters = append(characters, c)
	}

	return characters, nil
}

// InsertCharacter inserts a single character in to the DB
func (db Database) InsertCharacter(ctx context.Context, c *models.Character) error {
	collection := db.Database(db.dbName).Collection(string(characterCollection))
	if _, err := collection.InsertOne(ctx, c); err != nil {
		return err
	}

	return nil
}
