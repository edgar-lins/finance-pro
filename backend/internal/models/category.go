package models

import (
	"github.com/google/uuid"
)

type Category struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	RuleGroup string    `json:"rule_group"` // 50, 30 ou 20
}
