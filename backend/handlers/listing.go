
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

var listingCollection *mongo.Collection

// InitListingHandlers initializes handlers for listing management
func InitListingHandlers(db *mongo.Database) {
	listingCollection = db.Collection("listings")
}

// GetAllListings fetches all medicine listings
func GetAllListings(c *gin.Context) {
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

	cursor, err := listingCollection.Find(ctx, filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des listings"})
		return
	}
	defer cursor.Close(ctx)

	var listings []models.Listing
	if err = cursor.All(ctx, &listings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du traitement des listings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"listings": listings})
}

// GetListingByID fetches a single listing by ID
func GetListingByID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	listingID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de listing invalide"})
		return
	}

	var listing models.Listing
	err = listingCollection.FindOne(ctx, bson.M{"_id": listingID}).Decode(&listing)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Listing non trouvé"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération du listing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"listing": listing})
}

// CreateListing creates a new medicine listing
func CreateListing(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	var newListing models.Listing
	if err := c.ShouldBindJSON(&newListing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Set the supplier ID to the current user
	newListing.ID = primitive.NewObjectID()
	newListing.SupplierID = userID
	newListing.CreatedAt = time.Now()
	newListing.UpdatedAt = time.Now()

	// Insert listing
	_, err = listingCollection.InsertOne(ctx, newListing)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création du listing"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Listing créé avec succès",
		"listing": newListing,
	})
}

// UpdateListing updates an existing medicine listing
func UpdateListing(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	listingID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de listing invalide"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if listing exists and belongs to user
	var existingListing models.Listing
	err = listingCollection.FindOne(ctx, bson.M{
		"_id": listingID,
		"supplierID": userID,
	}).Decode(&existingListing)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Listing non trouvé ou vous n'avez pas l'autorisation de le modifier"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la vérification du listing"})
		return
	}

	// Bind the update data
	var updateData models.Listing
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	// Create update document
	update := bson.M{
		"$set": bson.M{
			"title":       updateData.Title,
			"description": updateData.Description,
			"medications": updateData.Medications,
			"pdfUrl":      updateData.PdfURL,
			"updatedAt":   time.Now(),
		},
	}

	// Update the listing
	_, err = listingCollection.UpdateOne(ctx, bson.M{"_id": listingID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour du listing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Listing mis à jour avec succès"})
}

// DeleteListing deletes a medicine listing
func DeleteListing(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	listingID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de listing invalide"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Only allow deletion of user's own listings (or admin can delete any)
	userRole, _ := c.Get("userRole")
	filter := bson.M{"_id": listingID}
	if userRole != "admin" {
		filter["supplierID"] = userID
	}

	result, err := listingCollection.DeleteOne(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression du listing"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing non trouvé ou vous n'avez pas l'autorisation de le supprimer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Listing supprimé avec succès"})
}

// SearchListings searches for medicines in listings
func SearchListings(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Paramètre de recherche manquant"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Build the search query - search in medication names and in listing title/description
	filter := bson.M{
		"$or": []bson.M{
			{"title": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
			{"medications.name": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	cursor, err := listingCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la recherche"})
		return
	}
	defer cursor.Close(ctx)

	var results []models.Listing
	if err = cursor.All(ctx, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du traitement des résultats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"listings": results})
}
