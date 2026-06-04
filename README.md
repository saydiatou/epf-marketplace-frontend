# EPF Marketplace — Frontend

## Installation

1. Ouvrez un terminal à la racine du dossier frontend :

bash
cd epf-marketplace-frontend


2. Installez les dépendances :

bash
npm install


## Variables d'environnement

Copiez ou créez le fichier .env à la racine de epf-marketplace-frontend.

Contenu :

env
VITE_API_URL=http://localhost:8000/api


Modifiez cette valeur si votre API Laravel est sur un autre hôte ou port.

## Démarrage en développement

bash
npm run dev

Le frontend s'exécute avec Vite, généralement sur http://localhost:5173.

## Build de production

bash
npm run build

## Gestion globale des erreurs Axios

Le client Axios global se trouve dans src/services/api.js.

Comportement principal :

- 401 : suppression du token, redirection vers /login et notification.
- 403 : notification d'accès refusé.
- Erreurs réseau/CORS : notification d'erreur réseau.
- Les messages d'erreur renvoyés par l'API sont affichés si disponibles.

## Fichiers modifiés

- .env : définit VITE_API_URL pour le frontend.
- src/services/api.js : gestion centralisée des erreurs Axios et ajout de notifications.
- README.md : instructions d'installation et d'exécution simplifiées.
