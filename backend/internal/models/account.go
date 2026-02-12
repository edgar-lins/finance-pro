package models

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID          uuid.UUID `json:"id"`
	UserID      uuid.UUID `json:"user_id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"` // 'checking', 'savings', 'credit_card'
	Balance     float64   `json:"balance"`
	CreditLimit float64   `json:"credit_limit,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateAccountRequest struct {
	Name        string  `json:"name"`
	Type        string  `json:"type"`
	Balance     float64 `json:"balance"`
	CreditLimit float64 `json:"credit_limit"`
}
