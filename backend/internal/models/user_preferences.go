package models

import (
	"time"

	"github.com/google/uuid"
)

type UserPreferences struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Limit50   float64   `json:"limit_50"`
	Limit30   float64   `json:"limit_30"`
	Limit20   float64   `json:"limit_20"`
	UpdatedAt time.Time `json:"updated_at"`
}
