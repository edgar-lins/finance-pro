package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/edgar-lins/finance-pro/internal/service"
	"github.com/google/uuid"
)

type TransactionHandler struct {
	service *service.TransactionService
}

func NewTransactionHandler(s *service.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: s}
}

func (h *TransactionHandler) Create(w http.ResponseWriter, r *http.Request) {
	// 1. Extrair UserID do contexto (protegido pelo middleware)
	userIDStr, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Não autorizado", http.StatusUnauthorized)
		return
	}
	userID, _ := uuid.Parse(userIDStr)

	// 2. Decodificar o corpo da requisição
	var req models.CreateTransactionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	// 3. Chamar o service (que lida com as parcelas)
	if err := h.service.Create(req, userID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Transação(ões) criada(s) com sucesso"})
}

func (h *TransactionHandler) List(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value("user_id").(string)
	userID, _ := uuid.Parse(userIDStr)

	list, err := h.service.List(userID) // Implemente o List no Service chamando o Repo
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(list)
}
