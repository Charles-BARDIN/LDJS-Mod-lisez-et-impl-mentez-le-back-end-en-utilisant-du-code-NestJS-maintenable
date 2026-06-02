# ChâTop - Portail de Location Saisonnière

Application full-stack TypeScript mettant en relation locataires et propriétaires dans une zone
touristique. Le dépôt contient le **front-end React** (fourni) et le **back-end NestJS** (API REST
avec authentification JWT, gestion des locations et messagerie).

## Sommaire

- [Prérequis](#prérequis)
- [Structure du projet](#structure-du-projet)
- [Installation et lancement](#installation-et-lancement)
- [Installation de la base de données](#installation-de-la-base-de-données)
- [Documentation de l'API (Swagger)](#documentation-de-lapi-swagger)

## Prérequis

- **Node.js** 22 LTS (ou supérieur) et **npm**
- **MySQL** 8.0 (ou supérieur)

## Structure du projet

```
.
├── frontend/      # Application React (fournie) — port 5173
├── backend/       # API REST NestJS + Prisma — port 3001
└── ressources/
    └── sql/       # Scripts SQL (schéma + utilisateur applicatif)
```

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/Charles-BARDIN/LDJS-Mod-lisez-et-impl-mentez-le-back-end-en-utilisant-du-code-NestJS-maintenable
cd LDJS-Mod-lisez-et-impl-mentez-le-back-end-en-utilisant-du-code-NestJS-maintenable
```

### 2. Installer et configurer le back-end

```bash
cd backend
npm install
```

Copiez le gabarit d'environnement puis renseignez vos valeurs :

```bash
cp .env.example .env
```

| Variable       | Description                                                       |
| -------------- | ---------------------------------------------------------------- |
| `DATABASE_URL` | URL de connexion MySQL (utilisateur applicatif à droits limités) |
| `JWT_SECRET`   | Chaîne longue et aléatoire pour signer les tokens JWT            |
| `APP_URL`      | URL publique du serveur (sert à construire l'URL des images)     |

Exemple de `.env` :

```
DATABASE_URL="mysql://chatop_user:motDePasseChoisi@localhost:3306/chatop_db"
JWT_SECRET="une_chaine_longue_et_aleatoire"
APP_URL="http://localhost:3001"
```

> Configurez la base de données avant de lancer le serveur (voir
> [Installation de la base de données](#installation-de-la-base-de-données)).

### 3. Lancer le back-end

```bash
# Générer le client Prisma (à refaire après toute modification du schéma)
npx prisma generate

# Démarrer le serveur (port 3001)
npm run start:dev
```

L'API est disponible sur `http://localhost:3001/api`.

### 4. Lancer le front-end

Dans un second terminal, depuis la racine du dépôt :

```bash
cd frontend
npm install
npm run dev
```

Le front-end est accessible sur [http://localhost:5173](http://localhost:5173).

## Installation de la base de données

Les commandes SQL ci-dessous se lancent depuis la **racine du dépôt**. Adaptez l'utilisateur
administrateur (`-u root`) à votre installation MySQL.

### 1. Créer la base et les tables

```bash
mysql -u root < ressources/sql/schema.sql
```

Cela crée la base `chatop_db` et les tables `USERS`, `RENTALS`, `MESSAGES`.

### 2. Créer un utilisateur applicatif à droits limités

L'application ne se connecte pas avec le compte `root`. Créez un utilisateur dédié en remplaçant
`motDePasseChoisi` par le **même** mot de passe que dans le `.env` :

```bash
mysql -u root -e "
CREATE USER IF NOT EXISTS 'chatop_user'@'localhost' IDENTIFIED BY 'motDePasseChoisi';
GRANT SELECT, INSERT, UPDATE, DELETE ON chatop_db.* TO 'chatop_user'@'localhost';
FLUSH PRIVILEGES;"
```

Le script `ressources/sql/init-user.sql` sert de modèle pour cette étape.

## Documentation de l'API (Swagger)

La documentation interactive est accessible (sans authentification) sur :

**http://localhost:3001/api/docs**

Pour tester les routes protégées : connectez-vous via `POST /api/auth/login`, copiez le token JWT,
cliquez sur **Authorize** puis collez-le.

Le `README.md` du dossier `backend/` détaille les routes disponibles et l'architecture.
