package main

import (
	"log"
	"net/http"
	"pvp/handler"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/caarlos0/env/v6"
)

func main() {
	cfg := config{}
	if err := env.Parse(&cfg); err != nil {
		log.Fatal(err)
	}

	log.Println("initialising eu client")
	eu := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.EU, blizzard.EnUS)
	log.Println("initialising us client")
	us := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.US, blizzard.EnUS)

	clients := &handler.Clients{
		EU: eu,
		US: us,
	}

	r := handler.NewHandler(clients)

	log.Println("initialising router")
	log.Println("starting webserver")
	http.ListenAndServe(":8080", r)
}
