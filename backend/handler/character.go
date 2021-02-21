package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"pvp/models"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/FuzzyStatic/blizzard/v2/wowp"
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
	if (err != nil && err.Error() == "404 Not Found") || !status.IsValid {
		log.Println(err)
		render.Render(w, r, ErrNotFound)
		return
	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}
	// Retrieve a summary which allows us to populate most of the generic fields
	summary, b, err := c.WoWCharacterProfileSummary(r.Context(), realm, name)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}
	cov := &models.Covenent{}
	if err := json.Unmarshal(b, cov); err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}

	// Retrieve character media
	media, _, err := c.WoWCharacterMediaSummary(r.Context(), realm, name)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
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
	stats, _, err := c.WoWCharacterAchievementsStatistics(context.Background(), realm, name)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}
	for _, catagory := range stats.Categories {
		if catagory.Name == "Player vs. Player" {
			for _, subCatagory := range catagory.SubCategories {
				if subCatagory.Name == "Rated Arenas" {
					for _, statistic := range subCatagory.Statistics {
						switch statistic.ID {
						case models.Highest2v2PersonalRating:
							character.PvPStatistics.TwoVTwo.HighestRating = statistic.Quantity
						case models.Highest3v3PersonalRating:
							character.PvPStatistics.ThreeVThree.HighestRating = statistic.Quantity
						}
					}
				}
			}
		}
	}

	twos, _, err := c.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.Bracket2v2)
	if err != nil && err.Error() == "404 Not Found" {
		character.PvPStatistics.TwoVTwo.CurrentRating = 0
	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
	} else {
		character.PvPStatistics.TwoVTwo.CurrentRating = float64(twos.Rating)
	}

	threes, _, err := c.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.Bracket3v3)
	if err != nil && err.Error() == "404 Not Found" {
		character.PvPStatistics.ThreeVThree.CurrentRating = 0

	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	} else {
		character.PvPStatistics.ThreeVThree.CurrentRating = float64(threes.Rating)
	}

	rbg, _, err := c.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.BracketRBG)
	if err != nil && err.Error() == "404 Not Found" {
		character.PvPStatistics.RBG.CurrentRating = 0
	} else if err != nil {
		render.Render(w, r, ServerError(err))
		return
	} else {
		character.PvPStatistics.RBG.CurrentRating = float64(rbg.Rating)
	}

	if err := render.Render(w, r, NewCharacterResponse(character)); err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
	}
}
