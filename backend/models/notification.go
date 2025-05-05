
package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Notification represents a notification in the system
type Notification struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID      primitive.ObjectID `bson:"userId,omitempty" json:"userId,omitempty"`
	Type        string             `bson:"type" json:"type"` // payment_receipt, system, etc.
	Title       string             `bson:"title" json:"title"`
	Content     string             `bson:"content" json:"content"`
	UserRole    string             `bson:"userRole,omitempty" json:"userRole,omitempty"`
	UserName    string             `bson:"userName,omitempty" json:"userName,omitempty"`
	PaymentType string             `bson:"paymentType,omitempty" json:"paymentType,omitempty"`
	ReceiptURL  string             `bson:"receiptUrl,omitempty" json:"receiptUrl,omitempty"`
	Status      string             `bson:"status" json:"status"` // pending, approved, rejected
	Read        bool               `bson:"read" json:"read"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
