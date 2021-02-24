package handler

import (
	"context"
	"fmt"
	"net/http"
	"pvp/db"
	"pvp/models"
	"strings"
	"time"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/mongo"
)

type contextKey string

type server struct {
	r  http.Handler
	db db.Database
	c  map[string]*blizzard.Client
}

// NewServer returns a server with its dependencies
func NewServer(db db.Database, c map[string]*blizzard.Client) *server {
	return &server{
		db: db,
		c:  c,
	}
}

func (s server) Serve() http.Handler {
	return s.r
}

func (s *server) NewHandler() {
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
		r.Route("/realms", func(r chi.Router) {
			r.Get("/", s.GetRealms)
		})
		r.Route("/character/{region}/{realm}/{name}", func(r chi.Router) {
			r.Use(s.AllowedRegion)
			r.Use(s.ClientCtx())
			r.Use(s.CharacterCtx)
			r.Get("/", s.GetCharacter)
		})
	})

	s.r = r
}

// AllowedRegion ensures the region being requested is supported
func (s *server) AllowedRegion(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch chi.URLParam(r, "region") {
		case blizzard.EU.String(), blizzard.US.String():
			next.ServeHTTP(w, r)
		default:
			render.Render(w, r, ServerError(fmt.Errorf("requested region not supported")))
			return
		}
	})
}

func (s *server) ClientCtx() func(next http.Handler) http.Handler {
	var client *blizzard.Client
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			switch chi.URLParam(r, "region") {
			case blizzard.EU.String():
				client = s.c[blizzard.EU.String()]
			case blizzard.US.String():
				client = s.c[blizzard.US.String()]
			}
			ctx := context.WithValue(r.Context(), contextKey("client"), client)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func (s *server) CharacterCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name, region, realm := chi.URLParam(r, "name"), chi.URLParam(r, "realm"), chi.URLParam(r, "region")
		fmt.Println(name, realm, region)
		normalizeRealm := func(r string) string {
			rSplit := strings.Split(strings.ToLower(r), " ")
			return strings.Join(rSplit, "-")
		}
		realm = normalizeRealm(realm)
		fmt.Println(realm)
		var c *models.Character
		c, err := s.db.GetCharacterByNameRealmSlugRegion(r.Context(), name, region, realm)
		if err != nil && err != mongo.ErrNoDocuments {
			render.Render(w, r, ServerError(err))
			return
		}
		ctx := context.WithValue(r.Context(), contextKey("character"), c)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
