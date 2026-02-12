package models

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID                  uuid.UUID  `json:"id"`
	UserID              uuid.UUID  `json:"user_id"`
	AccountID           uuid.UUID  `json:"account_id"`
	CategoryID          uuid.UUID  `json:"category_id"`
	Description         string     `json:"description"`
	Amount              float64    `json:"amount"`
	Date                time.Time  `json:"date"`
	Type                string     `json:"type"` // income, expense
	IsCreditCard        bool       `json:"is_credit_card"`
	InstallmentNumber   int        `json:"installment_number"`
	TotalInstallments   int        `json:"total_installments"`
	ParentTransactionID *uuid.UUID `json:"parent_transaction_id"`
	Status              string     `json:"status"` // pending, confirmed
}

type CreateTransactionRequest struct {
	AccountID         uuid.UUID `json:"account_id"`
	CategoryID        uuid.UUID `json:"category_id"`
	Description       string    `json:"description"`
	Amount            float64   `json:"amount"`
	Date              string    `json:"date"` // Formato YYYY-MM-DD
	Type              string    `json:"type"`
	IsCreditCard      bool      `json:"is_credit_card"`
	TotalInstallments int       `json:"total_installments"` // Default 1
}
