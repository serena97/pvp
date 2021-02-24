package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"pvp/models"
	"strings"

	"github.com/FuzzyStatic/blizzard/v2"
	"github.com/FuzzyStatic/blizzard/v2/wowp"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type characterResponse struct {
	*models.Character
}

func (cr *characterResponse) Render(w http.ResponseWriter, r *http.Request) error {
	// Upper case fields before rendering the response
	if cr.Character != nil {
		cr.Character.Name = strings.Title(cr.Character.Name)
		cr.Character.Realm = strings.Title(cr.Character.Realm)
	}
	return nil
}

func newCharacterResponse(character *models.Character) *characterResponse {
	return &characterResponse{Character: character}
}

func (s *server) GetCharacter(w http.ResponseWriter, r *http.Request) {
	c := r.Context().Value(contextKey("character")).(*models.Character)
	if c != nil {
		render.Render(w, r, newCharacterResponse(c))
		return
	}

	bClient := r.Context().Value(contextKey("client")).(*blizzard.Client)
	name, realm := chi.URLParam(r, "name"), chi.URLParam(r, "realm")

	// Check if character being requested is valid
	status, _, err := bClient.WoWCharacterProfileStatus(r.Context(), realm, name)
	if (err != nil && err.Error() == "404 Not Found") || !status.IsValid {
		log.Println(err)
		render.Render(w, r, ErrNotFound)
		return
	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}
	// Check if we have the character in our db
	// Retrieve a summary which allows us to populate most of the generic fields
	summary, b, err := bClient.WoWCharacterProfileSummary(r.Context(), realm, name)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}
	cov := &models.Covenant{}
	if err := json.Unmarshal(b, cov); err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	}

	// Retrieve character media
	media, _, err := bClient.WoWCharacterMediaSummary(r.Context(), realm, name)
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
		Name:        strings.ToLower(summary.Name),
		Realm:       strings.ToLower(summary.Realm.Name),
		Realmslug:   summary.Realm.Slug,
		Region:      strings.ToLower(chi.URLParam(r, "region")),
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
	stats, _, err := bClient.WoWCharacterAchievementsStatistics(context.Background(), realm, name)
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

	twos, _, err := bClient.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.Bracket2v2)
	if err != nil && err.Error() == "404 Not Found" {
		character.PvPStatistics.TwoVTwo.CurrentRating = 0
	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	} else {
		character.PvPStatistics.TwoVTwo.CurrentRating = float64(twos.Rating)
	}

	threes, _, err := bClient.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.Bracket3v3)
	if err != nil && err.Error() == "404 Not Found" {
		character.PvPStatistics.ThreeVThree.CurrentRating = 0
	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	} else {
		character.PvPStatistics.ThreeVThree.CurrentRating = float64(threes.Rating)
	}

	rbg, _, err := bClient.WoWCharacterPvPBracketStatistics(r.Context(), realm, name, wowp.BracketRBG)
	if err != nil && err.Error() == "404 Not Found" {
		character.PvPStatistics.RBG.CurrentRating = 0
	} else if err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
		return
	} else {
		character.PvPStatistics.RBG.CurrentRating = float64(rbg.Rating)
	}

	if err := s.db.InsertCharacter(r.Context(), character); err != nil {
		log.Println(err)
	}

	if err := render.Render(w, r, newCharacterResponse(character)); err != nil {
		log.Println(err)
		render.Render(w, r, ServerError(err))
	}
}
