
package routes

import (
	"elsaidaliya/handlers"
	"elsaidaliya/middleware"

	"github.com/gin-gonic/gin"
)

// SetupNotificationRoutes configures routes for notification management
func SetupNotificationRoutes(r *gin.Engine) {
	notifications := r.Group("/api/notifications")
	{
		notifications.POST("/payment", middleware.RequireAuth, handlers.CreatePaymentNotification)
		notifications.GET("/admin", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.GetAdminNotifications)
		notifications.PUT("/:id/read", middleware.RequireAuth, handlers.MarkNotificationAsRead)
		notifications.PUT("/:id/status", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.UpdateNotificationStatus)
	}
}
