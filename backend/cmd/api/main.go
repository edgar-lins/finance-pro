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
	"github.com/rs/cors" // Certifique-se de que este import existe
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: .env não encontrado")
	}

	db, err := database.GetConnection()
	if err != nil {
		log.Fatalf("Erro ao ligar ao banco: %v", err)
	}
	defer db.Close()

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Falha nas migrations: %v", err)
	}

	// 1. Instanciar Repositories
	userRepo := repository.NewUserRepository(db)
	accRepo := repository.NewAccountRepository(db)
	catRepo := repository.NewCategoryRepository(db)
	transRepo := repository.NewTransactionRepository(db)
	prefRepo := repository.NewPreferencesRepository(db)

	// 2. Instanciar Services
	authService := service.NewAuthService(userRepo)
	transService := service.NewTransactionService(transRepo, accRepo)
	summaryService := service.NewSummaryService(transRepo, prefRepo, accRepo)

	// 3. Instanciar Handlers
	authHandler := handlers.NewAuthHandler(authService)
	accHandler := handlers.NewAccountHandler(accRepo)
	catHandler := handlers.NewCategoryHandler(catRepo)
	transHandler := handlers.NewTransactionHandler(transService)
	summaryHandler := handlers.NewSummaryHandler(summaryService)

	// 4. Definir Rotas no DefaultServeMux
	http.HandleFunc("/auth/register", authHandler.Register)
	http.HandleFunc("/auth/login", authHandler.Login)
	http.HandleFunc("/accounts", middleware.AuthMiddleware(accHandler.Create))
	http.HandleFunc("/categories", middleware.AuthMiddleware(catHandler.Create))
	http.HandleFunc("/transactions", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			transHandler.Create(w, r)
		} else {
			transHandler.List(w, r)
		}
	}))
	http.HandleFunc("/dashboard/summary", middleware.AuthMiddleware(summaryHandler.GetSummary))

	// 5. Configurar CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(http.DefaultServeMux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("✅ Banco de dados e Migrations OK!")
	fmt.Printf("🚀 Servidor a correr na porta %s\n", port)

	log.Fatal(http.ListenAndServe(":"+port, handler))
}
