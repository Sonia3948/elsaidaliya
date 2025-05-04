package handlers

import (
	"context"
	"log"
	"net/http"
	"time"

	"elsaidaliya/models"
	"elsaidaliya/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var adminCollection *mongo.Collection
var userCollection *mongo.Collection

// InitAuthHandlers initializes the collections for auth handlers
func InitAuthHandlers(db *mongo.Database) {
	adminCollection = db.Collection("admins")
	userCollection = db.Collection("users")
	
	// Create the admin user if it doesn't exist
	createAdminUser()
}

// Create admin user if it doesn't exist
func createAdminUser() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Check if admin exists
	var existingAdmin models.AdminUser
	err := adminCollection.FindOne(ctx, bson.M{"phone": "0549050018"}).Decode(&existingAdmin)
	
	if err == mongo.ErrNoDocuments {
		// Admin doesn't exist, create it
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Ned@0820"), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Error hashing admin password: %v", err)
			return
		}
		
		admin := models.AdminUser{
			ID:        primitive.NewObjectID(),
			Phone:     "0549050018",
			Password:  string(hashedPassword),
			CreatedAt: time.Now(),
		}
		
		_, err = adminCollection.InsertOne(ctx, admin)
		if err != nil {
			log.Printf("Error creating admin user: %v", err)
			return
		}
		
		log.Println("Admin user created successfully")
	} else if err != nil {
		log.Printf("Error checking for admin user: %v", err)
	} else {
		log.Println("Admin user already exists")
	}
}

// RegisterUser handles user registration
func RegisterUser(c *gin.Context) {
	var newUser models.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if user already exists
	var existingUser models.User
	err := userCollection.FindOne(ctx, bson.M{
		"$or": []bson.M{
			{"email": newUser.Email},
			{"phone": newUser.Phone},
		},
	}).Decode(&existingUser)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Un utilisateur avec cet e-mail ou ce numéro de téléphone existe déjà"})
		return
	} else if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la vérification de l'utilisateur"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du traitement du mot de passe"})
		return
	}

	// Prepare user document
	newUser.ID = primitive.NewObjectID()
	newUser.Password = string(hashedPassword)
	newUser.IsActive = false // User requires activation
	newUser.CreatedAt = time.Now()
	newUser.UpdatedAt = time.Now()
	
	if newUser.Role == "" {
		newUser.Role = "pharmacien" // Default role
	}

	// Insert user
	_, err = userCollection.InsertOne(ctx, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création de l'utilisateur"})
		return
	}

	// Don't return the password
	newUser.Password = ""

	c.JSON(http.StatusCreated, gin.H{
		"message": "Utilisateur enregistré avec succès. Votre compte est en attente d'activation.",
		"user": newUser,
	})
}

// Login function handles both regular user and admin login
func LoginUser(c *gin.Context) {
	var credentials struct {
		Identifier string `json:"identifier"` // Email, phone, or username
		Password   string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// First check if it's the admin trying to login
	var admin models.AdminUser
	err := adminCollection.FindOne(ctx, bson.M{"phone": credentials.Identifier}).Decode(&admin)
	if err == nil {
		// Found admin user, verify password
		err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(credentials.Password))
		if err == nil {
			// Password is correct, login successful
			c.JSON(http.StatusOK, gin.H{
				"message": "Login successful",
				"user": gin.H{
					"id":   admin.ID.Hex(),
					"role": "admin",
				},
			})
			return
		}
	}

	// Not an admin or wrong admin password, try regular user login
	var user models.User
	filter := bson.M{
		"$or": []bson.M{
			{"email": credentials.Identifier},
			{"phone": credentials.Identifier},
		},
	}

	err = userCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Identifiant ou mot de passe incorrect"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la connexion"})
		}
		return
	}

	// Check if account is active
	if !user.IsActive {
		c.JSON(http.StatusForbidden, gin.H{"error": "Votre compte est en attente d'activation"})
		return
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Identifiant ou mot de passe incorrect"})
		return
	}

	// All good, login successful
	c.JSON(http.StatusOK, gin.H{
		"message": "Connexion réussie",
		"user": gin.H{
			"id":      user.ID.Hex(),
			"name":    user.BusinessName,
			"role":    user.Role,
			"email":   user.Email,
			"phone":   user.Phone,
		},
	})
}

// ForgotPassword handles password reset requests
func ForgotPassword(c *gin.Context) {
	var request struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Adresse e-mail invalide"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := userCollection.FindOne(ctx, bson.M{"email": request.Email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Don't reveal if email exists or not for security
			c.JSON(http.StatusOK, gin.H{"message": "Si votre email est enregistré, vous recevrez un lien de réinitialisation"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la vérification de l'email"})
		return
	}

	// Generate reset token
	resetToken := utils.GenerateRandomToken()
	resetExpiry := time.Now().Add(24 * time.Hour)

	// Update user with reset token
	_, err = userCollection.UpdateOne(
		ctx,
		bson.M{"_id": user.ID},
		bson.M{
			"$set": bson.M{
				"resetPasswordToken": resetToken,
				"resetPasswordExpires": resetExpiry,
				"updatedAt": time.Now(),
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la génération du token de réinitialisation"})
		return
	}

	// TODO: Send email with reset token
	// For now, just return success
	c.JSON(http.StatusOK, gin.H{"message": "Si votre email est enregistré, vous recevrez un lien de réinitialisation"})
}
