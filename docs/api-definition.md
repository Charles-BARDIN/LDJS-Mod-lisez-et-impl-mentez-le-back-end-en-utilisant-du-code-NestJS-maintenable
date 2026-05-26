# Définition de l'API — ChâTop

Ce document décrit l'interface entre le front-end React et le back-end à développer. Il sert de
contrat de référence pour l'implémentation de l'API REST (NestJS) qui remplace l'API mockée (Mockoon).

## 1. Fonctionnement de l'application

ChâTop est un portail de mise en relation entre locataires et propriétaires de biens en location
saisonnière. Le front-end React communique avec le serveur via des appels HTTP REST :

- L'ensemble des routes est préfixé par `/api` et exposé sur `http://localhost:3001`.
- L'authentification repose sur un **JWT** : après inscription ou connexion, le serveur renvoie un
  token que le front stocke dans le `localStorage` et joint à chaque requête via l'en-tête
  `Authorization: Bearer <token>`.
- Toutes les routes nécessitent l'authentification, **sauf** la création de compte (`register`),
  la connexion (`login`) et la documentation Swagger.
- Les échanges se font au format JSON, à l'exception de la création et de la mise à jour d'une
  location qui utilisent `multipart/form-data` (envoi du fichier image).

## 2. Entités métier

| Entité | Description | Champs |
|--------|-------------|--------|
| **User** | Utilisateur du portail (locataire ou propriétaire) | `id`, `email`, `name`, `password` (chiffré), `created_at`, `updated_at` |
| **Rental** | Bien proposé à la location | `id`, `name`, `surface`, `price`, `picture` (URL), `description`, `owner_id` → User, `created_at`, `updated_at` |
| **Message** | Message envoyé au sujet d'une location | `id`, `rental_id` → Rental, `user_id` → User, `message`, `created_at`, `updated_at` |

Relations : un `User` possède plusieurs `Rental` ; un `Rental` appartient à un `User` (`owner`) et
peut recevoir plusieurs `Message`.

## 3. Dépendances back-end prévues

- **NestJS** (framework) et **Prisma** (ORM MySQL)
- **@nestjs/passport**, **passport-jwt**, **@nestjs/jwt** (authentification JWT)
- **bcrypt** (chiffrement des mots de passe)
- **class-validator** / **class-transformer** (validation des DTO)
- **@nestjs/config** (variables d'environnement)
- **@nestjs/serve-static** (service des images uploadées)
- **@nestjs/swagger** (documentation OpenAPI)

## 4. Conventions générales

- **URL de base** : `http://localhost:3001`
- **Préfixe** : `/api`
- **En-tête d'authentification** : `Authorization: Bearer <token>`
- **Format des erreurs** : `{ "message": "<description>" }`
- **Codes de statut transverses** :
  - `400` — données invalides (validation)
  - `401` — authentification manquante ou invalide
  - `404` — ressource introuvable
  - `500` — erreur interne du serveur

## 5. Endpoints

Vue d'ensemble (modèle de définition d'API) :

| URL | Méthode | Description | Params | Body | Status | Auth |
|-----|---------|-------------|--------|------|--------|------|
| `/api/auth/register` | POST | Créer un compte | – | `{ name, email, password }` | 200, 400 | non |
| `/api/auth/login` | POST | Se connecter | – | `{ email, password }` | 200, 401 | non |
| `/api/auth/me` | GET | Utilisateur connecté | – | – | 200, 401 | oui |
| `/api/rentals` | GET | Liste des locations | – | – | 200, 401 | oui |
| `/api/rentals/:id` | GET | Détail d'une location | path `id` | – | 200, 401, 404 | oui |
| `/api/rentals` | POST | Créer une location | – | multipart `{ name, surface, price, picture, description }` | 201, 400, 401 | oui |
| `/api/rentals/:id` | PUT | Modifier une location | path `id` | multipart `{ name?, surface?, price?, picture?, description? }` | 200, 401, 404 | oui |
| `/api/user/:id` | GET | Détail d'un utilisateur | path `id` | – | 200, 401, 404 | oui |
| `/api/messages` | POST | Envoyer un message | – | `{ rental_id, user_id, message }` | 200, 400, 401 | oui |

### 5.1 POST `/api/auth/register`

Créer un compte utilisateur et renvoyer un token JWT.

- **Body** : `{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }`
- **200 OK** :
  ```json
  { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
  ```
- **400 Bad Request** (email déjà utilisé) :
  ```json
  { "message": "Email already exists" }
  ```

### 5.2 POST `/api/auth/login`

Authentifier un utilisateur et renvoyer un token JWT.

- **Body** : `{ "email": "john@example.com", "password": "secret123" }`
- **200 OK** :
  ```json
  { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
  ```
- **401 Unauthorized** (identifiants invalides) :
  ```json
  { "message": "Invalid credentials" }
  ```

### 5.3 GET `/api/auth/me`

Renvoyer les informations de l'utilisateur authentifié (déduit du token).

- **200 OK** :
  ```json
  {
    "id": 1,
    "name": "Test User",
    "email": "test@test.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```
- **401 Unauthorized** :
  ```json
  { "message": "Unauthorized" }
  ```

### 5.4 GET `/api/rentals`

Renvoyer la liste de toutes les locations, chacune accompagnée de son propriétaire (`owner`).

- **200 OK** :
  ```json
  {
    "rentals": [
      {
        "id": 1,
        "name": "Appartement Paris",
        "surface": 50,
        "price": 1200,
        "picture": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "description": "Bel appartement au coeur de Paris",
        "owner": { "id": 1, "name": "Patrick" },
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```
- **401 Unauthorized** : `{ "message": "Unauthorized" }`

### 5.5 GET `/api/rentals/:id`

Renvoyer le détail d'une location.

- **Params** : `id` (identifiant de la location)
- **200 OK** :
  ```json
  {
    "id": 1,
    "name": "Appartement Paris",
    "surface": 50,
    "price": 1200,
    "picture": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "description": "Bel appartement au coeur de Paris avec vue sur la Tour Eiffel",
    "owner": { "id": 1, "name": "Patrick" },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```
- **404 Not Found** : `{ "message": "Rental not found" }`

### 5.6 POST `/api/rentals`

Créer une location. L'image est envoyée en `multipart/form-data`, stockée sur le serveur, et son
URL est enregistrée en base.

- **Content-Type** : `multipart/form-data`
- **Champs** : `name` (texte), `surface` (nombre), `price` (nombre), `picture` (fichier image),
  `description` (texte)
- **201 Created** :
  ```json
  { "message": "Rental created!" }
  ```
- **400 Bad Request** (validation) : `{ "message": "Validation error" }`

### 5.7 PUT `/api/rentals/:id`

Modifier une location existante.

- **Params** : `id`
- **Content-Type** : `multipart/form-data`
- **200 OK** :
  ```json
  { "message": "Rental updated!" }
  ```
- **404 Not Found** : `{ "message": "Rental not found" }`

### 5.8 GET `/api/user/:id`

Renvoyer les informations publiques d'un utilisateur (sans le mot de passe).

- **Params** : `id`
- **200 OK** :
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```
- **404 Not Found** : `{ "message": "User not found" }`

### 5.9 POST `/api/messages`

Envoyer un message au sujet d'une location.

- **Body** : `{ "rental_id": 1, "user_id": 1, "message": "Bonjour, ce bien est-il disponible ?" }`
- **200 OK** :
  ```json
  { "message": "Message sent!" }
  ```
- **400 Bad Request** (validation) : `{ "message": "Validation error" }`
