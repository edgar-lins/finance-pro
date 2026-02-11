package database

import (
	"database/sql"
	"fmt"
	"log"
)

func RunMigrations(db *sql.DB) error {
	query := `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS accounts (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		user_id UUID REFERENCES users(id) ON DELETE CASCADE,
		name TEXT NOT NULL,
		type TEXT NOT NULL, -- 'checking', 'savings', 'credit_card'
		balance DECIMAL(15,2) DEFAULT 0.00,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("erro ao rodar migrations: %v", err)
	}

	log.Println("✅ Migrations executadas com sucesso!")
	return nil
}
