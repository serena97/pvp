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

	eu := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.EU, blizzard.EnUS)
	us := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.US, blizzard.EnUS)
	clients := handler.NewClients(eu, us)

	r := handler.NewHandler(clients)

	log.Println("starting webserver")
	http.ListenAndServe(":8080", r)
}
