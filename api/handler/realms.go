package handler

import (
	"context"
	"log"
	"net/http"
	"pvp/models"

	"github.com/FuzzyStatic/blizzard/v2/wowgd"
	"github.com/go-chi/render"
)

type RealmResponse struct {
	Realms []models.Realm `json:"realms"`
}

func (rr *RealmResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewRealmResponse(realms []models.Realm) *RealmResponse {
	return &RealmResponse{Realms: realms}
}

func (s *server) GetRealms(w http.ResponseWriter, r *http.Request) {
	realms, err := s.db.GetRealms(r.Context())
	if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}
	// If we don't have any realms saved retrieve and insert them
	if len(realms) == 0 {
		realms, err = s.insertRealms(r)
		if err != nil {
			log.Println(err)
			render.Render(w, r, ServerError(err))
			return
		}
	}

	if err := render.Render(w, r, NewRealmResponse(realms)); err != nil {
		render.Render(w, r, ServerError(err))
	}
}

func (s *server) insertRealms(r *http.Request) ([]models.Realm, error) {
	var realms []models.Realm

	populateRealmsSlice := func(realmIndex *wowgd.RealmIndex, region string) {
		for _, r := range realmIndex.Realms {
			realm := models.Realm{
				Name:   r.Name,
				Slug:   r.Slug,
				Region: region,
			}
			realms = append(realms, realm)
		}
	}
	realmIndexEU, _, err := s.c["eu"].WoWRealmIndex(context.Background())
	if err != nil {
		return nil, err
	}
	realmIndexUS, _, err := s.c["us"].WoWRealmIndex(context.Background())
	if err != nil {
		return nil, err
	}
	populateRealmsSlice(realmIndexEU, "eu")
	populateRealmsSlice(realmIndexUS, "us")

	return realms, s.db.InsertRealms(realms)

}
