package repository

import (
	"database/sql"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/google/uuid"
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

func (r *TransactionRepository) GetMonthlySummary(userID uuid.UUID, month, year int) ([]models.Transaction, error) {
	// 1. A Query agora faz JOIN com categories para trazer o RuleGroup
	// e usamos EXTRACT para filtrar o período
	query := `
		SELECT 
			t.amount, t.type, t.is_credit_card, c.rule_group 
		FROM transactions t
		LEFT JOIN categories c ON t.category_id = c.id
		WHERE t.user_id = $1 
		AND EXTRACT(MONTH FROM t.date) = $2 
		AND EXTRACT(YEAR FROM t.date) = $3`

	rows, err := r.db.Query(query, userID, month, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []models.Transaction
	for rows.Next() {
		var t models.Transaction
		var ruleGroup sql.NullString // Usamos NullString caso a categoria tenha sido deletada

		// 2. Lemos os dados. Note que estamos simplificando o model Transaction
		// ou você pode criar um model específico para o resumo
		err := rows.Scan(&t.Amount, &t.Type, &t.IsCreditCard, &ruleGroup)
		if err != nil {
			return nil, err
		}

		// Atribuímos o grupo da regra ao campo da transação (precisaremos desse campo no Model)
		if ruleGroup.Valid {
			// Se você adicionar um campo "RuleGroup" no seu models.Transaction
			// t.RuleGroup = ruleGroup.String
		}

		transactions = append(transactions, t)
	}

	return transactions, nil
}

func (r *TransactionRepository) ListByUserID(userID uuid.UUID) ([]models.Transaction, error) {
	query := `SELECT id, description, amount, date, type, is_credit_card, installment_number, total_installments 
	          FROM transactions WHERE user_id = $1 ORDER BY date DESC`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Transaction
	for rows.Next() {
		var t models.Transaction
		rows.Scan(&t.ID, &t.Description, &t.Amount, &t.Date, &t.Type, &t.IsCreditCard, &t.InstallmentNumber, &t.TotalInstallments)
		list = append(list, t)
	}
	return list, nil
}
