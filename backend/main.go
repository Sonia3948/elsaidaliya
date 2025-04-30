
package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func main() {
	// Configuration de MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Connectez-vous à MongoDB - remplacez l'URL par votre chaîne de connexion MongoDB
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
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
	
	// Configuration de Gin
	r := gin.Default()
	
	// Configuration CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // URL de votre frontend
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
	
	log.Println("Serveur démarré sur le port 8080")
	r.Run(":8080")
}

func setupUserRoutes(r *gin.Engine) {
	users := r.Group("/api/users")
	{
		users.GET("/", getAllUsers)
		users.GET("/:id", getUserById)
		users.POST("/", createUser)
		users.PUT("/:id", updateUser)
		users.DELETE("/:id", deleteUser)
	}
}

func setupAuthRoutes(r *gin.Engine) {
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", registerUser)
		auth.POST("/login", loginUser)
		auth.POST("/forgot-password", forgotPassword)
	}
}

func setupListingRoutes(r *gin.Engine) {
	listings := r.Group("/api/listings")
	{
		listings.GET("/", getAllListings)
		listings.GET("/:id", getListingById)
		listings.POST("/", createListing)
		listings.PUT("/:id", updateListing)
		listings.DELETE("/:id", deleteListing)
		listings.GET("/search", searchListings)
	}
}

func setupOfferRoutes(r *gin.Engine) {
	offers := r.Group("/api/offers")
	{
		offers.GET("/", getAllOffers)
		offers.GET("/:id", getOfferById)
		offers.POST("/", createOffer)
		offers.PUT("/:id", updateOffer)
		offers.DELETE("/:id", deleteOffer)
	}
}

// Définitions des handlers pour les utilisateurs
func getAllUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Récupération de tous les utilisateurs"})
}

func getUserById(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Récupération de l'utilisateur " + id})
}

func createUser(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Utilisateur créé"})
}

func updateUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Mise à jour de l'utilisateur " + id})
}

func deleteUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Suppression de l'utilisateur " + id})
}

// Définitions des handlers pour l'authentification
func registerUser(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Utilisateur enregistré"})
}

func loginUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Connexion réussie"})
}

func forgotPassword(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Email de réinitialisation envoyé"})
}

// Définitions des handlers pour les listings
func getAllListings(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Récupération de tous les listings"})
}

func getListingById(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Récupération du listing " + id})
}

func createListing(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Listing créé"})
}

func updateListing(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Mise à jour du listing " + id})
}

func deleteListing(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Suppression du listing " + id})
}

func searchListings(c *gin.Context) {
	query := c.Query("q")
	c.JSON(http.StatusOK, gin.H{"message": "Recherche de listings pour " + query})
}

// Définitions des handlers pour les offres
func getAllOffers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Récupération de toutes les offres"})
}

func getOfferById(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Récupération de l'offre " + id})
}

func createOffer(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Offre créée"})
}

func updateOffer(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Mise à jour de l'offre " + id})
}

func deleteOffer(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Suppression de l'offre " + id})
}
