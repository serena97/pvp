package models

// Character represents a WoW character to be loaded
type Character struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Realm       string `json:"realm"`
	Faction     string `json:"faction"`
	Class       string `json:"class"`
	Race        string `json:"race"`
	Gender      string `json:"gender"`
	Level       int    `json:"level"`
	Guild       string `json:"guild"`
	Spec        string `json:"spec"`
	ItemLevel   int    `json:"item_level"`
	Covenant    string `json:"covenant"`
	RenownLevel int    `json:"renown_level"`
	Media       Media
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
