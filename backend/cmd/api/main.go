package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/edgar-lins/finance-pro/internal/database"
	"github.com/edgar-lins/finance-pro/internal/handlers"
	"github.com/edgar-lins/finance-pro/internal/middleware"
	"github.com/edgar-lins/finance-pro/internal/repository"
	"github.com/edgar-lins/finance-pro/internal/service"
	"github.com/joho/godotenv"
)

func main() {
	// Carregar variáveis do .env
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: .env não encontrado")
	}

	// Inicializar Banco de Dados
	db, err := database.GetConnection()
	if err != nil {
		log.Fatalf("Erro ao ligar ao banco: %v", err)
	}
	defer db.Close()

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Falha nas migrations: %v", err)
	}

	// Instanciar as camadas (Injeção de Dependência)
	userRepo := repository.NewUserRepository(db)

	authService := service.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	accRepo := repository.NewAccountRepository(db)
	accHandler := handlers.NewAccountHandler(accRepo)

	catRepo := repository.NewCategoryRepository(db)
	catHandler := handlers.NewCategoryHandler(catRepo)

	transRepo := repository.NewTransactionRepository(db)
	transService := service.NewTransactionService(transRepo, accRepo) // Note que passamos o accRepo aqui
	transHandler := handlers.NewTransactionHandler(transService)

	prefRepo := repository.NewPreferencesRepository(db)
	summaryService := service.NewSummaryService(transRepo, prefRepo, accRepo)
	summaryHandler := handlers.NewSummaryHandler(summaryService)

	// 2. Definir as rotas
	http.HandleFunc("/auth/register", authHandler.Register)
	http.HandleFunc("/auth/login", authHandler.Login)
	http.HandleFunc("/accounts", middleware.AuthMiddleware(accHandler.Create))
	http.HandleFunc("/categories", middleware.AuthMiddleware(catHandler.Create))
	http.HandleFunc("/transactions", middleware.AuthMiddleware(transHandler.Create))
	http.HandleFunc("/dashboard/summary", middleware.AuthMiddleware(summaryHandler.GetSummary))
	fmt.Println("✅ Rotas de autenticação prontas!")

	fmt.Println("Banco de dados ligado com sucesso!")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Servidor a correr na porta %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
