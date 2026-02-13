package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/edgar-lins/finance-pro/internal/repository"
	"github.com/google/uuid"
)

type CategoryHandler struct {
	repo *repository.CategoryRepository
}

func NewCategoryHandler(repo *repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{repo: repo}
}

func (h *CategoryHandler) Create(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value("user_id").(string)
	userID, _ := uuid.Parse(userIDStr)

	var cat models.Category
	if err := json.NewDecoder(r.Body).Decode(&cat); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}
	cat.UserID = userID

	if err := h.repo.Create(&cat); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(cat)
}

func (h *CategoryHandler) List(w http.ResponseWriter, r *http.Request) {
	// 1. Pegar UserID do contexto
	userIDStr, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Não autorizado", http.StatusUnauthorized)
		return
	}
	userID, _ := uuid.Parse(userIDStr)

	// 2. Chamar o repositório para listar as categorias do usuário
	categories, err := h.repo.ListByUserID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 3. Retornar JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}
