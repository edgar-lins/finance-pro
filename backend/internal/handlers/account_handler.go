package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/edgar-lins/finance-pro/internal/repository"
	"github.com/google/uuid"
)

type AccountHandler struct {
	repo *repository.AccountRepository
}

func NewAccountHandler(repo *repository.AccountRepository) *AccountHandler {
	return &AccountHandler{repo: repo}
}

func (h *AccountHandler) Create(w http.ResponseWriter, r *http.Request) {
	// 1. Pegar UserID do contexto (colocado pelo middleware)
	userIDStr := r.Context().Value("user_id").(string)
	userID, _ := uuid.Parse(userIDStr)

	var req models.CreateAccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	account := &models.Account{
		UserID:      userID,
		Name:        req.Name,
		Type:        req.Type,
		Balance:     req.Balance,
		CreditLimit: req.CreditLimit,
	}

	if err := h.repo.Create(account); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(account)
}

// Adicione este método ao final do seu account_handler.go
func (h *AccountHandler) List(w http.ResponseWriter, r *http.Request) {
	// 1. Pegar UserID do contexto
	userIDStr, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Não autorizado", http.StatusUnauthorized)
		return
	}
	userID, _ := uuid.Parse(userIDStr)

	// 2. Chamar o repositório
	accounts, err := h.repo.ListByUserID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Retornar JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(accounts)
}
