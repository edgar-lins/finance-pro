package repository

import (
	"database/sql"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/google/uuid"
)

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(cat *models.Category) error {
	query := `INSERT INTO categories (user_id, name, rule_group) VALUES ($1, $2, $3) RETURNING id`
	return r.db.QueryRow(query, cat.UserID, cat.Name, cat.RuleGroup).Scan(&cat.ID)
}

func (r *CategoryRepository) ListByUserID(userID uuid.UUID) ([]models.Category, error) {
	query := `SELECT id, name, rule_group FROM categories WHERE user_id = $1`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.Category
	for rows.Next() {
		var c models.Category
		c.UserID = userID
		if err := rows.Scan(&c.ID, &c.Name, &c.RuleGroup); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}
	return categories, nil
}
