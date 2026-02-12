package service

import (
	"errors"

	"github.com/edgar-lins/finance-pro/internal/models"
	"github.com/edgar-lins/finance-pro/internal/repository"
	"github.com/edgar-lins/finance-pro/pkg/auth"
)

type AuthService struct {
	repo *repository.UserRepository
}

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

// Adicione esta struct no arquivo ou no models/user.go
type LoginResponse struct {
	User  *models.User `json:"user"`
	Token string       `json:"token"`
}

func (s *AuthService) Login(email, password string) (*LoginResponse, error) {
	// 1. Buscar usuário por email
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, errors.New("credenciais inválidas")
	}

	// 2. Verificar se a senha está correta
	if !auth.CheckPasswordHash(password, user.PasswordHash) {
		return nil, errors.New("credenciais inválidas")
	}

	// 3. Gerar o Token JWT
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		User:  user,
		Token: token,
	}, nil
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.User, error) {
	// 1. Verificar se o usuário já existe
	existingUser, _ := s.repo.GetByEmail(req.Email)
	if existingUser != nil {
		return nil, errors.New("usuário com este e-mail já cadastrado")
	}

	// 2. Criptografar a senha
	hashedPassword, err := auth.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// 3. Criar a entidade de usuário
	user := &models.User{
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	// 4. Salvar no banco via Repository
	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}
