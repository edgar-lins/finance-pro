CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos de conta: 'checking', 'savings', 'credit_card'
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00, -- Saldo Real
    credit_limit DECIMAL(15,2) DEFAULT 0.00, -- Para cartões
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transações com suporte a parcelas e status
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id),
    category_id UUID, 
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL, -- 'income' or 'expense'
    is_credit_card BOOLEAN DEFAULT false,
    installment_number INT DEFAULT 1,
    total_installments INT DEFAULT 1,
    parent_transaction_id UUID, -- Para agrupar parcelas
    status TEXT DEFAULT 'confirmed', -- 'pending', 'confirmed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);