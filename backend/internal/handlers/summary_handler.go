package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/edgar-lins/finance-pro/internal/service"
	"github.com/google/uuid"
)

type SummaryHandler struct {
	service *service.SummaryService
}

func NewSummaryHandler(s *service.SummaryService) *SummaryHandler {
	return &SummaryHandler{service: s}
}

func (h *SummaryHandler) GetSummary(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.Context().Value("user_id").(string)
	userID, _ := uuid.Parse(userIDStr)

	// Pegar mês e ano da Query String
	month, _ := strconv.Atoi(r.URL.Query().Get("month"))
	year, _ := strconv.Atoi(r.URL.Query().Get("year"))

	data, err := h.service.GetDashboardData(userID, month, year)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
