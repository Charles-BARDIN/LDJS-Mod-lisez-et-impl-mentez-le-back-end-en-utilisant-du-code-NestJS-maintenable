# ChâTop — Back-end

API REST de l'application de location saisonnière **ChâTop**, développée avec **NestJS**, **Prisma**
et **MySQL**. Elle fournit l'authentification (JWT), la gestion des locations (avec upload d'image)
et l'envoi de messages, et alimente le front-end React fourni.

## Sommaire

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de la base de données](#configuration-de-la-base-de-données)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer l'application](#lancer-lapplication)
- [Documentation de l'API (Swagger)](#documentation-de-lapi-swagger)
- [Routes disponibles](#routes-disponibles)
- [Architecture](#architecture)

## Prérequis

- **Node.js** 22 LTS (ou supérieur) et **npm**
- **MySQL** 8.0 (ou supérieur)

## Installation

Depuis le dossier `backend/` :

```bash
npm install
```

## Configuration de la base de données

> Les commandes SQL ci-dessous se lancent depuis la **racine du dépôt** (où se trouve le dossier
> `ressources/`). Adaptez l'utilisateur administrateur (`-u root`) à votre installation MySQL.

### 1. Créer la base et les tables

```bash
mysql -u root < ressources/sql/schema.sql
```

Cela crée la base `chatop_db` et les tables `USERS`, `RENTALS`, `MESSAGES`.

### 2. Créer un utilisateur applicatif à droits limités

L'application ne doit pas se connecter avec le compte `root`. Créez un utilisateur dédié en
remplaçant `motDePasseChoisi` par un mot de passe de votre choix (le **même** que dans le `.env`) :

```bash
mysql -u root -e "
CREATE USER IF NOT EXISTS 'chatop_user'@'localhost' IDENTIFIED BY 'motDePasseChoisi';
GRANT SELECT, INSERT, UPDATE, DELETE ON chatop_db.* TO 'chatop_user'@'localhost';
FLUSH PRIVILEGES;"
```

Le script `ressources/sql/init-user.sql` sert de modèle pour cette étape.

## Variables d'environnement

Depuis le dossier `backend/`, copiez le gabarit puis renseignez vos valeurs :

```bash
cp .env.example .env
```

| Variable       | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `DATABASE_URL` | URL de connexion MySQL (utilisateur applicatif à droits limités)   |
| `JWT_SECRET`   | Chaîne longue et aléatoire pour signer les tokens JWT              |
| `APP_URL`      | URL publique du serveur (sert à construire l'URL des images)      |

Exemple de `.env` :

```
DATABASE_URL="mysql://chatop_user:motDePasseChoisi@localhost:3306/chatop_db"
JWT_SECRET="une_chaine_longue_et_aleatoire"
APP_URL="http://localhost:3001"
```

Le fichier `.env` contient des informations sensibles : il n'est **jamais** versionné.

## Lancer l'application

Générez d'abord le client Prisma (à refaire après toute modification du schéma) :

```bash
npx prisma generate
```

Puis lancez le serveur (port **3001**) :

```bash
# développement (rechargement automatique)
npm run start:dev

# production
npm run build
npm run start:prod
```

L'API est alors disponible sur `http://localhost:3001/api`.

## Documentation de l'API (Swagger)

La documentation interactive est accessible (sans authentification) sur :

**http://localhost:3001/api/docs**

Pour tester les routes protégées : connectez-vous via `POST /api/auth/login`, copiez le token, puis
cliquez sur **Authorize** et collez-le.

## Routes disponibles

Toutes les routes sont préfixées par `/api` et nécessitent un token JWT, **sauf** `register`,
`login` et la documentation Swagger.

| Méthode | Route                | Description                  | Auth |
| ------- | -------------------- | ---------------------------- | ---- |
| POST    | `/api/auth/register` | Créer un compte              | non  |
| POST    | `/api/auth/login`    | Se connecter                 | non  |
| GET     | `/api/auth/me`       | Utilisateur connecté         | oui  |
| GET     | `/api/rentals`       | Liste des locations          | oui  |
| GET     | `/api/rentals/:id`   | Détail d'une location        | oui  |
| POST    | `/api/rentals`       | Créer une location (image)   | oui  |
| PUT     | `/api/rentals/:id`   | Modifier une location        | oui  |
| GET     | `/api/user/:id`      | Détail d'un utilisateur      | oui  |
| POST    | `/api/messages`      | Envoyer un message           | oui  |

Le détail complet (corps des requêtes, exemples de réponses, codes d'erreur) est décrit dans
`docs/api-definition.md` et dans Swagger.

## Architecture

Architecture modulaire en couches, un module par domaine :

```
src/
├── main.ts              # bootstrap : préfixe /api, CORS, validation, Swagger, fichiers statiques
├── app.module.ts        # module racine (garde JWT globale, modules métier)
├── prisma/              # accès à la base (PrismaService)
├── common/filters/      # filtre d'exception global (réponses { message })
├── auth/                # register / login / me (JWT, bcrypt, Passport)
├── users/               # GET /user/:id
├── rentals/             # CRUD locations + upload d'image
└── messages/            # POST /messages
```

Chaque domaine est découpé en **Modèle (Prisma) / Repository / Service / Controller**. Les images
sont stockées dans `uploads/` et servies sous `/uploads`.
