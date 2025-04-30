
#!/bin/bash

# S'assurer que le module est initialisé
echo "Initialisation du module Go..."
go mod tidy

echo "Installation des dépendances..."
go get -u github.com/gin-gonic/gin
go get -u github.com/gin-contrib/cors
go get -u go.mongodb.org/mongo-driver/mongo

echo "Vérification des dépendances..."
go mod verify

echo "Installation terminée."
echo "Vous pouvez maintenant démarrer le serveur avec: go run main.go"
