package repository

import (
	"database/sql"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/google/uuid"
)

type AccountRepository struct {
	db *sql.DB
}

func NewAccountRepository(db *sql.DB) *AccountRepository {
	return &AccountRepository{db: db}
}

func (r *AccountRepository) Create(acc *models.Account) error {
	query := `
		INSERT INTO accounts (user_id, name, type, balance, credit_limit)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at`

	return r.db.QueryRow(
		query, acc.UserID, acc.Name, acc.Type, acc.Balance, acc.CreditLimit,
	).Scan(&acc.ID, &acc.CreatedAt)
}

func (r *AccountRepository) ListByUserID(userID uuid.UUID) ([]models.Account, error) {
	query := `SELECT id, user_id, name, type, balance, credit_limit, created_at 
	          FROM accounts WHERE user_id = $1`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var accounts []models.Account
	for rows.Next() {
		var a models.Account
		if err := rows.Scan(&a.ID, &a.UserID, &a.Name, &a.Type, &a.Balance, &a.CreditLimit, &a.CreatedAt); err != nil {
			return nil, err
		}
		accounts = append(accounts, a)
	}
	return accounts, nil
}
