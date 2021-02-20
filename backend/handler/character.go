package handler

import (
	"encoding/json"
	"net/http"
	"pvp/models"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type CharacterResponse struct {
	*models.Character
}

func (cr *CharacterResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewCharacterResponse(character *models.Character) *CharacterResponse {
	return &CharacterResponse{Character: character}
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
		render.Render(w, r, ServerError(err))
	}
	cov := &models.Covenent{}
	if err := json.Unmarshal(b, cov); err != nil {
		render.Render(w, r, ServerError(err))
		return
	}

	// Retrieve character media
	media, _, err := c.WoWCharacterMediaSummary(r.Context(), realm, name)
	if err != nil {
		render.Render(w, r, ServerError(err))
	}

	var avatar, main string
	for _, a := range media.Assets {
		switch a.Key {
		case "avatar":
			avatar = a.Value
		case "main":
			main = a.Value
		}
	}

	character := &models.Character{
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
		Covenant:    cov.CovenantProgress.ChosenCovenant.Name,
		RenownLevel: cov.CovenantProgress.RenownLevel,
		Media: models.Media{
			Avatar: avatar,
			Main:   main,
		},
	}

	if err := render.Render(w, r, NewCharacterResponse(character)); err != nil {
		render.Render(w, r, ServerError(err))
	}
}
