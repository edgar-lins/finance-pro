package database

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

func GetConnection() (*sql.DB, error) {
	// Pegamos a URL do banco das variáveis de ambiente
	dsn := os.Getenv("DATABASE_URL")

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	// Testar se a conexão está realmente ativa
	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}
