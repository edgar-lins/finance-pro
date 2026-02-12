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

	CREATE TABLE IF NOT EXISTS categories (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		user_id UUID REFERENCES users(id) ON DELETE CASCADE,
		name TEXT NOT NULL,
		rule_group TEXT NOT NULL, -- '50', '30', '20'
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE IF NOT EXISTS transactions (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		user_id UUID REFERENCES users(id) ON DELETE CASCADE,
		account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
		category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
		description TEXT NOT NULL,
		amount DECIMAL(15,2) NOT NULL,
		date DATE NOT NULL,
		type TEXT NOT NULL, -- 'income' ou 'expense'
		is_credit_card BOOLEAN DEFAULT false,
		installment_number INT DEFAULT 1,
		total_installments INT DEFAULT 1,
		parent_transaction_id UUID,
		status TEXT DEFAULT 'confirmed',
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("erro ao rodar migrations: %v", err)
	}

	log.Println("✅ Migrations executadas com sucesso!")
	return nil
}
