package models

// Realm represents a wow realm
type Realm struct {
	Name   string `json:"name"`
	Slug   string `json:"slug"`
	Region string `json:"region"`
}
