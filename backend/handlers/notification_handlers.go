
package handlers

import (
	"elsaidaliya/handlers/notification"
	"go.mongodb.org/mongo-driver/mongo"
)

// InitNotificationHandlers initializes handlers for notification management
func InitNotificationHandlers(db *mongo.Database) {
	notification.InitNotificationHandlersFunc(db)
}

// CreatePaymentNotification creates a notification when a payment receipt is uploaded
var CreatePaymentNotification = notification.CreatePaymentNotificationFunc

// GetAdminNotifications gets all notifications for admin
var GetAdminNotifications = notification.GetAdminNotificationsFunc

// MarkNotificationAsRead marks a notification as read
var MarkNotificationAsRead = notification.MarkNotificationAsReadFunc

// UpdateNotificationStatus updates the status of a notification
var UpdateNotificationStatus = notification.UpdateNotificationStatusFunc
