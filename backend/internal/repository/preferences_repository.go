package repository

import (
	"database/sql"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/google/uuid"
)

type PreferencesRepository struct {
	db *sql.DB
}

func NewPreferencesRepository(db *sql.DB) *PreferencesRepository {
	return &PreferencesRepository{db: db}
}

func (r *PreferencesRepository) GetByUserID(userID uuid.UUID) (*models.UserPreferences, error) {
	query := `SELECT id, user_id, limit_50, limit_30, limit_20 FROM user_preferences WHERE user_id = $1`
	p := &models.UserPreferences{}
	err := r.db.QueryRow(query, userID).Scan(&p.ID, &p.UserID, &p.Limit50, &p.Limit30, &p.Limit20)

	if err == sql.ErrNoRows {
		// Retorna valores padrão caso o usuário nunca tenha configurado
		return &models.UserPreferences{Limit50: 50, Limit30: 30, Limit20: 20}, nil
	}
	return p, err
}

func (r *PreferencesRepository) Save(p *models.UserPreferences) error {
	query := `
		INSERT INTO user_preferences (user_id, limit_50, limit_30, limit_20)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id) 
		DO UPDATE SET limit_50 = $2, limit_30 = $3, limit_20 = $4, updated_at = CURRENT_TIMESTAMP`

	_, err := r.db.Exec(query, p.UserID, p.Limit50, p.Limit30, p.Limit20)
	return err
}
