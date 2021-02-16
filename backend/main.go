package main

import (
	"log"

	"github.com/caarlos0/env/v6"
)

func main() {
	cfg := config{}
	if err := env.Parse(&cfg); err != nil {
		log.Fatal(err)
	}
}
