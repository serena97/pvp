package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

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

	//eu := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.EU, blizzard.EnUS)
	//us := blizzard.NewClient(cfg.ClientID, cfg.ClientSecret, blizzard.US, blizzard.EnUS)

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

	r := chi.NewRouter()

	r.Use(middleware.RealIP)
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(middleware.Timeout(5 * time.Second))
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/{region}/{realm}/{name}", func(r chi.Router) {
			r.Get("/", func(w http.ResponseWriter, r *http.Request) {
				region, realm, name := chi.URLParam(r, "region"), chi.URLParam(r, "realm"), chi.URLParam(r, "name")
				fmt.Fprint(w, region, realm, name)
			})

		})
	})
	http.ListenAndServe(":8080", r)

}

type CharacterRequest struct {
}

type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

var ErrNotFound = &ErrResponse{HTTPStatusCode: 404, StatusText: "Resource not found."}
