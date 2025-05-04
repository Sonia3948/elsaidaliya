
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
	"go.mongodb.org/mongo-driver/mongo/options"
)

var offerCollection *mongo.Collection

// InitOfferHandlers initializes handlers for offer management
func InitOfferHandlers(db *mongo.Database) {
	offerCollection = db.Collection("offers")
}

// GetAllOffers fetches all offers
func GetAllOffers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Define options to sort by createdAt DESC
	findOptions := options.Find()
	findOptions.SetSort(bson.M{"createdAt": -1})

	// Get filter from query params
	filter := bson.M{}
	if supplierID := c.Query("supplier"); supplierID != "" {
		objectID, err := primitive.ObjectIDFromHex(supplierID)
		if err == nil {
			filter["supplierID"] = objectID
		}
	}

	cursor, err := offerCollection.Find(ctx, filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des offres"})
		return
	}
	defer cursor.Close(ctx)

	var offers []models.Offer
	if err = cursor.All(ctx, &offers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du traitement des offres"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offers": offers})
}

// GetOfferByID fetches a single offer by ID
func GetOfferByID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	offerID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID d'offre invalide"})
		return
	}

	var offer models.Offer
	err = offerCollection.FindOne(ctx, bson.M{"_id": offerID}).Decode(&offer)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Offre non trouvée"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération de l'offre"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offer": offer})
}

// CreateOffer creates a new offer
func CreateOffer(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	var newOffer models.Offer
	if err := c.ShouldBindJSON(&newOffer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Set the supplier ID to the current user
	newOffer.ID = primitive.NewObjectID()
	newOffer.SupplierID = userID
	newOffer.CreatedAt = time.Now()
	newOffer.UpdatedAt = time.Now()

	// Insert offer
	_, err = offerCollection.InsertOne(ctx, newOffer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création de l'offre"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Offre créée avec succès",
		"offer": newOffer,
	})
}

// UpdateOffer updates an existing offer
func UpdateOffer(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	offerID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID d'offre invalide"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if offer exists and belongs to user
	var existingOffer models.Offer
	err = offerCollection.FindOne(ctx, bson.M{
		"_id": offerID,
		"supplierID": userID,
	}).Decode(&existingOffer)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Offre non trouvée ou vous n'avez pas l'autorisation de la modifier"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la vérification de l'offre"})
		return
	}

	// Bind the update data
	var updateData models.Offer
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	// Create update document
	update := bson.M{
		"$set": bson.M{
			"title":       updateData.Title,
			"description": updateData.Description,
			"price":       updateData.Price,
			"imageUrl":    updateData.ImageURL,
			"expiresAt":   updateData.ExpiresAt,
			"updatedAt":   time.Now(),
		},
	}

	// Update the offer
	_, err = offerCollection.UpdateOne(ctx, bson.M{"_id": offerID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour de l'offre"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Offre mise à jour avec succès"})
}

// DeleteOffer deletes an offer
func DeleteOffer(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	offerID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID d'offre invalide"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Only allow deletion of user's own offers (or admin can delete any)
	userRole, _ := c.Get("userRole")
	filter := bson.M{"_id": offerID}
	if userRole != "admin" {
		filter["supplierID"] = userID
	}

	result, err := offerCollection.DeleteOne(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression de l'offre"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Offre non trouvée ou vous n'avez pas l'autorisation de la supprimer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Offre supprimée avec succès"})
}
