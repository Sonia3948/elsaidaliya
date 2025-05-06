
package routes

import (
	"elsaidaliya/handlers"
	"elsaidaliya/middleware"

	"github.com/gin-gonic/gin"
)

// SetupUserRoutes configures routes for user management
func SetupUserRoutes(r *gin.Engine) {
	users := r.Group("/api/users")
	{
		users.GET("/", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.GetAllUsers)
		users.GET("/featured", handlers.GetFeaturedSuppliers) // New endpoint for featured suppliers
		users.GET("/:id", middleware.RequireAuth, handlers.GetUserByID)
		users.PUT("/:id", middleware.RequireAuth, handlers.UpdateUser)
		users.PUT("/:id/status", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.UpdateUserStatus)
		users.PUT("/:id/subscription", middleware.RequireAuth, middleware.RequireRole("admin"), handlers.UpdateUserSubscription)
	}
}
