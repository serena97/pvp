package main

type config struct {
	// API
	Host string `env:"HOST"`
	Port string `env:"PORT,required"`

	// Blizzard API
	ClientID     string `env:"CLIENT_ID,required"`
	ClientSecret string `env:"CLIENT_SECRET,required"`

	// MongoDB
	MongoHost     string `env:"MONGO_HOST,required"`
	MongoPort     string `env:"MONGO_PORT,required"`
	MongoDatabase string `env:"MONGO_DATABASE,required"`
}
