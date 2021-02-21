package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
)

type clients struct {
	eu *blizzard.Client
	us *blizzard.Client
}

func NewClients(eu, us *blizzard.Client) *clients {
	return &clients{
		eu: eu,
		us: us,
	}
}

func NewHandler(c *clients) http.Handler {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		//AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET"},
	}))
	r.Use(middleware.RealIP)
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(middleware.Timeout(5 * time.Second))
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/{region}/{realm}/{name}", func(r chi.Router) {
			r.Use(AllowedRegion)
			r.Use(ClientCtx(c))
			r.Get("/", GetCharacter)
		})
	})

	return r
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
