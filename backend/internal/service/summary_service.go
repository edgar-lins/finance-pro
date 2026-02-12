package service

import (
	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/edgar-lins/finance-pro/internal/repository"
	"github.com/google/uuid"
)

type SummaryService struct {
	transRepo   *repository.TransactionRepository
	prefRepo    *repository.PreferencesRepository
	accountRepo *repository.AccountRepository
}

func NewSummaryService(tr *repository.TransactionRepository, pr *repository.PreferencesRepository, ar *repository.AccountRepository) *SummaryService {
	return &SummaryService{transRepo: tr, prefRepo: pr, accountRepo: ar}
}

func (s *SummaryService) GetDashboardData(userID uuid.UUID, month, year int) (*models.DashboardSummary, error) {
	// 1. Buscar transações do mês
	transactions, err := s.transRepo.GetMonthlySummary(userID, month, year)
	if err != nil {
		return nil, err
	}

	// 2. Buscar preferências do usuário (limites 50/30/20)
	prefs, err := s.prefRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	summary := &models.DashboardSummary{
		Rule50: models.RuleGroupSummary{Limit: prefs.Limit50},
		Rule30: models.RuleGroupSummary{Limit: prefs.Limit30},
		Rule20: models.RuleGroupSummary{Limit: prefs.Limit20},
	}

	// 3. Processar cálculos
	for _, t := range transactions {
		if t.Type == "income" {
			summary.TotalIncome += t.Amount
		} else {
			summary.TotalExpenses += t.Amount

			// Somar por grupo da regra (Lógica baseada no RuleGroup retornado pelo JOIN)
			// Nota: No Passo 7.2, ajustamos a query para trazer o grupo
			switch t.Type { // Aqui usaríamos o campo RuleGroup que vem da categoria
			case "50":
				summary.Rule50.Total += t.Amount
			case "30":
				summary.Rule30.Total += t.Amount
			case "20":
				summary.Rule20.Total += t.Amount
			}
		}
	}

	// 4. Calcular porcentagens reais em relação à renda
	if summary.TotalIncome > 0 {
		summary.Rule50.Percentage = (summary.Rule50.Total / summary.TotalIncome) * 100
		summary.Rule30.Percentage = (summary.Rule30.Total / summary.TotalIncome) * 100
		summary.Rule20.Percentage = (summary.Rule20.Total / summary.TotalIncome) * 100
	}

	summary.Balance = summary.TotalIncome - summary.TotalExpenses

	return summary, nil
}
