package models

const (
	Highest2v2PersonalRating int = 370
	Highest3v3PersonalRating int = 595
)

// Character represents a WoW character to be loaded
type Character struct {
	ID            int           `json:"id" bson:"_id"`
	Name          string        `json:"name"`
	Realm         string        `json:"realm"`
	Realmslug     string        `json:"realm_slug"`
	Region        string        `json:"region"`
	Faction       string        `json:"faction"`
	Class         string        `json:"class"`
	Race          string        `json:"race"`
	Gender        string        `json:"gender"`
	Level         int           `json:"level"`
	Guild         string        `json:"guild"`
	Spec          string        `json:"spec"`
	ItemLevel     int           `json:"item_level"`
	Covenant      string        `json:"covenant"`
	RenownLevel   int           `json:"renown_level"`
	Media         Media         `json:"media"`
	PvPStatistics PvPStatistics `json:"pvp_statistcs"`
}

// Media contains character media such as avatar and render links
type Media struct {
	Avatar string `json:"avatar"`
	Main   string `json:"main"`
}

// Covenant ToDo: Currently the blizzard api client we are using is not up to date with
// the latest shadowlands payloads so we need to unmarshal covenant data ourselves
type Covenent struct {
	CovenantProgress struct {
		ChosenCovenant struct {
			Name string `json:"name"`
		} `json:"chosen_covenant"`
		RenownLevel int `json:"renown_level"`
	} `json:"covenant_progress"`
}

type PvPStatistics struct {
	TwoVTwo     Rating `json:"2v2"`
	ThreeVThree Rating `json:"3v3"`
	RBG         Rating `json:"rbg"`
}

type Rating struct {
	HighestRating       float64 `json:"highest_rating"`
	CurrentRating       float64 `json:"current_rating"`
	SeasonHighestRating float64 `json:"season_highest_rating"`
}
