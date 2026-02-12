package repository

import (
	"database/sql"

	"github.com/edgar-lins/finance-pro/internal/models"
)

type TransactionRepository struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(t *models.Transaction) error {
	query := `
		INSERT INTO transactions (
			user_id, account_id, category_id, description, amount, 
			date, type, is_credit_card, installment_number, 
			total_installments, parent_transaction_id, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id`

	return r.db.QueryRow(
		query, t.UserID, t.AccountID, t.CategoryID, t.Description, t.Amount,
		t.Date, t.Type, t.IsCreditCard, t.InstallmentNumber,
		t.TotalInstallments, t.ParentTransactionID, t.Status,
	).Scan(&t.ID)
}
