
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	
	"elsaidaliya/handlers"
	"elsaidaliya/middleware"
)

var client *mongo.Client
var database *mongo.Database

func main() {
	// Chargement des variables d'environnement
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}
	
	// Configuration de MongoDB
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/elsaidaliya"
	}
	
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}
	
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Connexion à MongoDB
	clientOptions := options.Client().ApplyURI(mongoURI)
	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	
	// Vérifiez la connexion
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	
	log.Println("Connecté à MongoDB!")
	
	// Initialize database and collections
	database = client.Database("elsaidaliya")
	
	// Initialize handlers with database connection
	handlers.InitAuthHandlers(database)
	handlers.InitUserHandlers(database)
	handlers.InitListingHandlers(database)
	handlers.InitOfferHandlers(database)
	
	// Initialize middleware
	middleware.InitAuthMiddleware(database)
	
	// Configuration de Gin
	r := gin.Default()
	
	// Configuration CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	// Routes de base
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"message": "El Saidaliya API is running",
		})
	})
	
	// Routes pour les utilisateurs
	setupUserRoutes(r)
	
	// Routes pour l'authentification
	setupAuthRoutes(r)
	
	// Routes pour les listings
	setupListingRoutes(r)
	
	// Routes pour les offres
	setupOfferRoutes(r)
	
	log.Printf("Serveur démarré sur le port %s", port)
	r.Run(":" + port)
}

func setupUserRoutes(r *gin.Engine) {
	users := r.Group("/api/users")
	{
		users.GET("/", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.GetAllUsers)
		users.GET("/:id", middleware.RequireAuth, handlers.GetUserByID)
		users.PUT("/:id", middleware.RequireAuth, handlers.UpdateUser)
		users.PUT("/:id/status", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.UpdateUserStatus)
		users.PUT("/:id/subscription", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.UpdateUserSubscription)
	}
}

func setupAuthRoutes(r *gin.Engine) {
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", handlers.RegisterUser)
		auth.POST("/login", handlers.LoginUser)
		auth.POST("/forgot-password", handlers.ForgotPassword)
	}
}

func setupListingRoutes(r *gin.Engine) {
	listings := r.Group("/api/listings")
	{
		listings.GET("/", handlers.GetAllListings)
		listings.GET("/:id", handlers.GetListingByID)
		listings.POST("/", middleware.RequireAuth, middleware.RequireRole("fournisseur"), handlers.CreateListing)
		listings.PUT("/:id", middleware.RequireAuth, middleware.RequireRole("fournisseur"), handlers.UpdateListing)
		listings.DELETE("/:id", middleware.RequireAuth, handlers.DeleteListing)
		listings.GET("/search", handlers.SearchListings)
	}
}

func setupOfferRoutes(r *gin.Engine) {
	offers := r.Group("/api/offers")
	{
		offers.GET("/", handlers.GetAllOffers)
		offers.GET("/:id", handlers.GetOfferByID)
		offers.POST("/", middleware.RequireAuth, middleware.RequireRole("fournisseur"), handlers.CreateOffer)
		offers.PUT("/:id", middleware.RequireAuth, middleware.RequireRole("fournisseur"), handlers.UpdateOffer)
		offers.DELETE("/:id", middleware.RequireAuth, handlers.DeleteOffer)
	}
}
