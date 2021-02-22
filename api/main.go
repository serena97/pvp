package main

import (
	"log"
	"net"
	"net/http"
	"pvp/db"
	"pvp/handler"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/caarlos0/env/v6"
)

func main() {
	cfg := config{}
	if err := env.Parse(&cfg); err != nil {
		log.Fatal(err)
	}

	db, err := db.NewDatabase(cfg.MongoHost, cfg.MongoPort, cfg.MongoDatabase)
	if err != nil {
		log.Fatal(err)
	}
	eu := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.EU, blizzard.EnUS)
	us := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.US, blizzard.EnUS)
	c := map[string]*blizzard.Client{
		"eu": eu,
		"us": us,
	}
	s := handler.NewServer(db, c)
	s.NewHandler()
	log.Println("starting webserver")
	http.ListenAndServe(net.JoinHostPort(cfg.Host, cfg.Port), s.Serve())
}
