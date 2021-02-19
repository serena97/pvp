package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/FuzzyStatic/blizzard/v2/wowp"
	"github.com/caarlos0/env/v6"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
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

	clients := &clients{
		eu: eu,
		us: us,
	}

	// CharacterRender
	//m, _, err := eu.WoWCharacterMediaSummary("silvermoon", "devz")
	//if err != nil {
	//	log.Fatal(err)
	//}
	//fmt.Printf("%+v\n", m)

	//c, _, err := eu.WoWCharacterPvPSummary(context.Background(), "silvermoon", "devz")
	//if err != nil {
	//	log.Fatal(err)
	//}
	//b, _, err := eu.WoWCharacterPvPBracketStatistics(context.Background(), "silvermoon", "devz", wowp.Bracket2v2)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//fmt.Printf("%+v\n", b)
	//eu.WoWPvPTalent()

	log.Println("initialising router")
	r := chi.NewRouter()

	r.Use(middleware.RealIP)
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(middleware.Timeout(5 * time.Second))
	r.Use(render.SetContentType(render.ContentTypeJSON))
	log.Println("initialising routes")
	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/{region}/{realm}/{name}", func(r chi.Router) {
			r.Use(AllowedRegion)
			r.Use(ClientCtx(clients))
			r.Get("/", GetCharacter)
		})
	})
	log.Println("listening")
	http.ListenAndServe(":8080", r)

}

// AllowedRegion ensures the region being requested is supported
func AllowedRegion(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch chi.URLParam(r, "region") {
		case blizzard.EU.String(), blizzard.US.String():
			next.ServeHTTP(w, r)
		default:
			render.Render(w, r, ErrNotFound)
			return
		}
	})
}

func ClientCtx(c *clients) func(next http.Handler) http.Handler {
	var client *blizzard.Client
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			switch chi.URLParam(r, "region") {
			case blizzard.EU.String():
				client = c.eu
			case blizzard.US.String():
				client = c.us
			}
			ctx := context.WithValue(r.Context(), "client", client)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

type clients struct {
	eu *blizzard.Client
	us *blizzard.Client
}

func GetCharacter(w http.ResponseWriter, r *http.Request) {
	c := r.Context().Value("client").(*blizzard.Client)
	name, realm := chi.URLParam(r, "name"), chi.URLParam(r, "realm")
	s, _, err := c.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.Bracket3v3)
	if err != nil {
		render.Render(w, r, ServerError(err))
		return
	}
	b, err := json.Marshal(&s)
	if err != nil {
		render.Render(w, r, ErrNotFound)
		return
	}
	w.Write(b)
}

type CharacterResponse struct {
	Name  string `json:"name"`
	Realm string `json:"realm"`
	Guild string `json:"guild"`
}

func (cr *CharacterResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}
