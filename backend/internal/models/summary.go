package models

type RuleGroupSummary struct {
	Total      float64 `json:"total"`
	Percentage float64 `json:"percentage"`
	Limit      float64 `json:"limit"` // Baseado na regra customizada do usuário
}

type DashboardSummary struct {
	TotalIncome   float64          `json:"total_income"`
	TotalExpenses float64          `json:"total_expenses"`
	Rule50        RuleGroupSummary `json:"rule_50"`
	Rule30        RuleGroupSummary `json:"rule_30"`
	Rule20        RuleGroupSummary `json:"rule_20"`
	Balance       float64          `json:"balance"`
}
