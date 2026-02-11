package repository

import (
	"database/sql"

	"github.com/edgar-lins/finance-pro/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO users (first_name, last_name, email, password_hash)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`

	return r.db.QueryRow(
		query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.PasswordHash,
	).Scan(&user.ID, &user.CreatedAt)
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, first_name, last_name, email, password_hash, created_at FROM users WHERE email = $1`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.PasswordHash, &user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}
