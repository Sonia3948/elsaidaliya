
package notification

import (
	"context"
	"net/http"
	"time"

	"elsaidaliya/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreatePaymentNotification creates a notification when a payment receipt is uploaded
func CreatePaymentNotification(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var notificationRequest struct {
		UserID      string `json:"userId" binding:"required"`
		UserRole    string `json:"userRole" binding:"required"`
		UserName    string `json:"userName" binding:"required"`
		PaymentType string `json:"paymentType" binding:"required"`
		ReceiptURL  string `json:"receiptUrl" binding:"required"`
	}

	if err := c.ShouldBindJSON(&notificationRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	userID, err := primitive.ObjectIDFromHex(notificationRequest.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID utilisateur invalide"})
		return
	}

	notification := models.Notification{
		UserID:      userID,
		Type:        "payment_receipt",
		Title:       "Nouveau bon de versement",
		Content:     "Un utilisateur a téléversé un bon de versement pour validation",
		UserRole:    notificationRequest.UserRole,
		UserName:    notificationRequest.UserName,
		PaymentType: notificationRequest.PaymentType,
		ReceiptURL:  notificationRequest.ReceiptURL,
		Status:      "pending",
		Read:        false,
		CreatedAt:   time.Now(),
	}

	result, err := notificationCollection.InsertOne(ctx, notification)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création de la notification"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Notification créée avec succès",
		"id":      result.InsertedID,
	})
}

// GetAdminNotifications gets all notifications for admin
func GetAdminNotifications(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"createdAt": -1})

	cursor, err := notificationCollection.Find(ctx, bson.M{}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des notifications"})
		return
	}
	defer cursor.Close(ctx)

	var notifications []models.Notification
	if err = cursor.All(ctx, &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du traitement des notifications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"notifications": notifications})
}

// MarkNotificationAsRead marks a notification as read
func MarkNotificationAsRead(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	notificationID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de notification invalide"})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"read":      true,
			"updatedAt": time.Now(),
		},
	}

	result, err := notificationCollection.UpdateOne(ctx, bson.M{"_id": notificationID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour de la notification"})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notification non trouvée"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marquée comme lue"})
}

// UpdateNotificationStatus updates the status of a notification
func UpdateNotificationStatus(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	notificationID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de notification invalide"})
		return
	}

	var statusUpdate struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"status":    statusUpdate.Status,
			"updatedAt": time.Now(),
		},
	}

	result, err := notificationCollection.UpdateOne(ctx, bson.M{"_id": notificationID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour de la notification"})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notification non trouvée"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Statut de la notification mis à jour"})
}
