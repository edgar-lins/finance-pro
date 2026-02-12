package service

import (
	"time"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/edgar-lins/finance-pro/internal/repository"
	"github.com/google/uuid"
)

type TransactionService struct {
	repo        *repository.TransactionRepository
	accountRepo *repository.AccountRepository
}

func NewTransactionService(r *repository.TransactionRepository, ar *repository.AccountRepository) *TransactionService {
	return &TransactionService{repo: r, accountRepo: ar}
}

func (s *TransactionService) Create(req models.CreateTransactionRequest, userID uuid.UUID) error {
	parsedDate, _ := time.Parse("2006-01-02", req.Date)
	parentID := uuid.New()

	// Se for apenas 1 parcela, total_installments vem como 0 ou 1
	total := req.TotalInstallments
	if total <= 0 {
		total = 1
	}

	for i := 1; i <= total; i++ {
		transaction := &models.Transaction{
			UserID:            userID,
			AccountID:         req.AccountID,
			CategoryID:        req.CategoryID,
			Description:       req.Description,
			Amount:            req.Amount,
			Date:              parsedDate.AddDate(0, i-1, 0), // Adiciona 1 mês para cada parcela
			Type:              req.Type,
			IsCreditCard:      req.IsCreditCard,
			InstallmentNumber: i,
			TotalInstallments: total,
			Status:            "confirmed",
		}

		if total > 1 {
			transaction.ParentTransactionID = &parentID
		}

		if err := s.repo.Create(transaction); err != nil {
			return err
		}

		// LÓGICA DE SALDO: Só atualiza se NÃO for cartão de crédito (débito/pix direto)
		if !req.IsCreditCard {
			// Aqui chamaríamos uma função do accountRepo para atualizar o saldo
			// s.accountRepo.UpdateBalance(req.AccountID, req.Amount, req.Type)
		}
	}
	return nil
}
