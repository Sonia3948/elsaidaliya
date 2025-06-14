
package handlers

import (
	"context"
	"net/http"
	"time"

	"elsaidaliya/middleware"
	"elsaidaliya/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection

// InitUserHandlers initializes the user collection
func InitUserHandlers(db *mongo.Database) {
	userCollection = db.Collection("users")
}

// GetAllUsers fetches all users with optional filters (admin only)
func GetAllUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Build filter based on query parameters
	filter := bson.M{}
	
	// Add filters based on query parameters
	if role := c.Query("role"); role != "" {
		filter["role"] = role
	}
	if status := c.Query("status"); status != "" {
		if status == "active" {
			filter["isActive"] = true
		} else if status == "inactive" {
			filter["isActive"] = false
		}
	}

	cursor, err := userCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des utilisateurs"})
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du décodage des utilisateurs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"total": len(users),
	})
}

// GetFeaturedSuppliers fetches featured suppliers (public endpoint)
func GetFeaturedSuppliers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find suppliers with "or" subscription (featured suppliers)
	filter := bson.M{
		"role":         "fournisseur",
		"subscription": "or",
		"isActive":     true,
	}

	cursor, err := userCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des fournisseurs vedettes"})
		return
	}
	defer cursor.Close(ctx)

	var suppliers []models.User
	if err = cursor.All(ctx, &suppliers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du décodage des fournisseurs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"suppliers": suppliers,
		"total":     len(suppliers),
	})
}

// GetPendingUsers fetches users pending approval (admin only)
func GetPendingUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find users that are not active (pending approval)
	filter := bson.M{
		"isActive": false,
	}

	cursor, err := userCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des utilisateurs en attente"})
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du décodage des utilisateurs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"total": len(users),
	})
}

// GetUserByID fetches a single user by ID
func GetUserByID(c *gin.Context) {
	userID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID utilisateur invalide"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération de l'utilisateur"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

// UpdateUser updates user information
func UpdateUser(c *gin.Context) {
	userID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID utilisateur invalide"})
		return
	}

	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	// Add updated timestamp
	updateData["updatedAt"] = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := userCollection.UpdateOne(
		ctx,
		bson.M{"_id": userID},
		bson.M{"$set": updateData},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour de l'utilisateur"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Utilisateur mis à jour avec succès"})
}

// UpdateUserStatus updates user active status (admin only)
func UpdateUserStatus(c *gin.Context) {
	userID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID utilisateur invalide"})
		return
	}

	var statusData struct {
		IsActive bool `json:"isActive"`
	}
	if err := c.ShouldBindJSON(&statusData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := userCollection.UpdateOne(
		ctx,
		bson.M{"_id": userID},
		bson.M{"$set": bson.M{
			"isActive":  statusData.IsActive,
			"updatedAt": time.Now(),
		}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour du statut"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Statut utilisateur mis à jour avec succès"})
}

// UpdateUserSubscription updates user subscription (admin only)
func UpdateUserSubscription(c *gin.Context) {
	userID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID utilisateur invalide"})
		return
	}

	var subData struct {
		Subscription string `json:"subscription"`
		SubExpiry    string `json:"subExpiry"`
	}
	if err := c.ShouldBindJSON(&subData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := userCollection.UpdateOne(
		ctx,
		bson.M{"_id": userID},
		bson.M{"$set": bson.M{
			"subscription": subData.Subscription,
			"subExpiry":    subData.SubExpiry,
			"updatedAt":    time.Now(),
		}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour de l'abonnement"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Abonnement mis à jour avec succès"})
}

// DeleteAllUsers deletes all users (admin only)
func DeleteAllUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := userCollection.DeleteMany(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression des utilisateurs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Tous les utilisateurs ont été supprimés",
		"deleted": result.DeletedCount,
	})
}

// DeleteAllData deletes all users and listings (admin only)
func DeleteAllData(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Delete all users
	userResult, err := userCollection.DeleteMany(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression des utilisateurs"})
		return
	}

	// Delete all listings (if collection exists)
	listingCollection := userCollection.Database().Collection("listings")
	listingResult, err := listingCollection.DeleteMany(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression des listings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Toutes les données ont été supprimées",
		"usersDeleted":  userResult.DeletedCount,
		"listingsDeleted": listingResult.DeletedCount,
	})
}
