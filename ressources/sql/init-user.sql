-- Création de l'utilisateur applicatif ChâTop
-- Cet utilisateur dispose de droits limités (uniquement les opérations de lecture/écriture
-- de données) et ne doit jamais être le compte root.
-- Le mot de passe réel est stocké dans le fichier .env du back-end (jamais dans le code).
--
-- À exécuter après schema.sql :
--   mysql -u root < ressources/sql/init-user.sql

CREATE USER IF NOT EXISTS 'chatop_user'@'localhost' IDENTIFIED BY 'CHANGE_ME';

-- Permissions limitées aux manipulations de données sur la base chatop_db.
-- Pas de droits de structure (CREATE, ALTER, DROP) ni d'administration (GRANT).
GRANT SELECT, INSERT, UPDATE, DELETE ON chatop_db.* TO 'chatop_user'@'localhost';

FLUSH PRIVILEGES;
