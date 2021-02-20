package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/FuzzyStatic/blizzard/v2"
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
	log.Println("starting webserver")
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

	// Check if Character being requested is valid
	status, _, err := c.WoWCharacterProfileStatus(r.Context(), realm, name)
	if err != nil || status.IsValid != true {
		render.Render(w, r, ErrNotFound)
		return
	}
	// Retrieve a summary which allows us to populate most of the generic fields
	summary, b, err := c.WoWCharacterProfileSummary(r.Context(), realm, name)
	if err != nil {
		render.Render(w, r, ErrNotFound)
	}
	// ToDo: Currently the blizzard api client we are using is not up to date with
	// the latest shadowlands payloads so we need to unmarshal covenant data ourselves
	covenant := struct {
		CovenantProgress struct {
			ChosenCovenant struct {
				Name string `json:"name"`
			} `json:"chosen_covenant"`
			RenownLevel int `json:"renown_level"`
		} `json:"covenant_progress"`
	}{}

	if err := json.Unmarshal(b, &covenant); err != nil {
		render.Render(w, r, ServerError(err))
		return
	}

	character := &Character{
		ID:          summary.ID,
		Name:        summary.Name,
		Realm:       summary.Realm.Name,
		Faction:     summary.Faction.Name,
		Class:       summary.CharacterClass.Name,
		Race:        summary.Race.Name,
		Gender:      summary.Gender.Name,
		Level:       summary.Level,
		Guild:       summary.Guild.Name,
		Spec:        summary.ActiveSpec.Name,
		ItemLevel:   summary.AverageItemLevel,
		Covenant:    covenant.CovenantProgress.ChosenCovenant.Name,
		RenownLevel: covenant.CovenantProgress.RenownLevel,
	}

	if err := render.Render(w, r, NewCharacterResponse(character)); err != nil {
		render.Render(w, r, ServerError(err))
	}
}

type CharacterResponse struct {
	*Character
}

func (cr *CharacterResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewCharacterResponse(character *Character) *CharacterResponse {
	return &CharacterResponse{Character: character}
}

type Character struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Realm       string `json:"realm"`
	Faction     string `json:"faction"`
	Class       string `json:"class"`
	Race        string `json:"race"`
	Gender      string `json:"gender"`
	Level       int    `json:"level"`
	Guild       string `json:"guild,omitempty"`
	Spec        string `json:"spec"`
	ItemLevel   int    `json:"item_level"`
	Covenant    string `json:"covenant"`
	RenownLevel int    `json:"renown_level"`
}
