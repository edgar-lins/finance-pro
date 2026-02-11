package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/edgar-lins/finance-pro/internal/database"
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

	fmt.Println("Banco de dados ligado com sucesso!")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Servidor a correr na porta %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
