
package routes

import (
	"elsaidaliya/handlers/notification"
	"elsaidaliya/middleware"

	"github.com/gin-gonic/gin"
)

// SetupNotificationRoutes initializes routes for notification management
func SetupNotificationRoutes(r *gin.Engine) {
	notificationGroup := r.Group("/api/notifications")
	notificationGroup.POST("/payment", notification.CreatePaymentNotificationFunc)
	notificationGroup.POST("/create", middleware.AuthMiddleware(), notification.CreateNotificationFunc)
	
	// Supplier specific notifications (will only be shown to suppliers)
	notificationGroup.POST("/supplier/subscription", middleware.AuthMiddleware(), notification.CreateSupplierSubscriptionNotificationFunc)
	
	// Protected routes requiring authentication
	notificationGroup.Use(middleware.AuthMiddleware())
	{
		notificationGroup.GET("/admin", notification.GetAdminNotificationsFunc)
		notificationGroup.GET("/user", notification.GetUserNotificationsFunc)
		notificationGroup.PUT("/:id/read", notification.MarkNotificationAsReadFunc)
		notificationGroup.PUT("/:id/status", notification.UpdateNotificationStatusFunc)
	}
}
