# Gestion de Stock - Quincaillerie

Une application web de gestion de stock pour quincaillerie développée avec le stack MERN (MongoDB, Express.js, React.js, Node.js).

## 🎯 Fonctionnalités

- 📊 **Tableau de bord** avec statistiques en temps réel
- 📦 **Gestion des produits** (CRUD complet)
- 🏷️ **Catégories** de produits pour quincaillerie
- ⚠️ **Alertes de stock faible** et rupture de stock
- 🔍 **Recherche et filtrage** avancés des produits
- � **Vente de produits** avec gestion automatique du stock
- 📈 **Historique des ventes** complet avec export Excel
- 📊 **Export Excel** pour produits et transactions
- 🔐 **Authentification sécurisée** avec JWT
- 📱 **Interface responsive** et moderne

## 🛠️ Technologies

### Backend
- **Node.js** avec Express.js
- **MongoDB** avec Mongoose ODM
- **TypeScript** pour la sécurité du typage
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe

### Frontend
- **React.js** avec TypeScript
- **Custom CSS** moderne et responsive
- **Axios** pour les appels API
- **React Router** pour la navigation
- **XLSX** pour l'export Excel

## 🚀 Installation

### Prérequis
- **Node.js** (v14 ou supérieur)
- **MongoDB** installé localement ou accès à MongoDB Atlas
- **npm** ou **yarn** pour la gestion des paquets

### Backend

1. **Naviguer vers le dossier backend:**
```bash
cd backend
```

2. **Installer les dépendances:**
```bash
npm install
```

3. **Créer un fichier `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quincaillerie-stock
JWT_SECRET=votre_cle_secrete_jwt_ici
```

4. **Démarrer le serveur de développement:**
```bash
npm run dev
```

### Frontend

1. **Naviguer vers le dossier frontend:**
```bash
cd frontend
```

2. **Installer les dépendances:**
```bash
npm install
```

3. **Démarrer le serveur de développement:**
```bash
npm start
```

## 👤 Création du Compte Administrateur

### ⚠️ Important: Pas d'interface d'inscription

Cette application **n'inclut pas d'interface d'inscription publique** pour des raisons de sécurité. Le compte administrateur doit être créé manuellement via le script de setup.

### Méthode 1: Script Automatique (Recommandé)

1. **Exécuter le script de setup:**
```bash
cd backend
node setup-admin.js
```

2. **Résultat attendu:**
```
✅ Admin user created successfully!
📝 Login credentials:
   Username: admin
   Password: admin123(OR U CAN CHANGE IT IN THE SCRIPT)
🌐 You can now login at: http://localhost:3000
```

### Méthode 2: API Directe

1. **Avec Postman/cURL:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@quincaillerie.com",
  "password": "votre_mot_de_passe"
}
```

### 🔐 Identifiants par Défaut

- **Nom d'utilisateur:** `admin`
- **Mot de passe:** `admin123`
- **Email:** `admin@quincaillerie.com`
- **Rôle:** `admin`

## 📱 Utilisation de l'Application

### 1. Connexion

1. **Accéder à l'application:** http://localhost:3000
2. **Utiliser les identifiants administrateur** pour se connecter
3. **Accéder au tableau de bord** après connexion

### 2. Gestion des Produits

- **Ajouter un produit:** Formulaire complet avec validation
- **Modifier un produit:** Clic sur "Modifier" dans la liste
- **Supprimer un produit:** Clic sur "Supprimer" avec confirmation
- **Filtrer les produits:** Par catégorie, nom, ou référence
- **Exporter les produits:** Bouton "Télécharger Excel"

### 3. Vente de Produits

- **Sélectionner un produit:** Menu déroulant avec stock disponible
- **Quantité:** Validation automatique du stock
- **Client:** Information optionnelle pour le suivi
- **Notes:** Description de la transaction

### 4. Historique des Ventes

- **Vue complète** de toutes les transactions
- **Filtrage:** Par type (vente, achat, ajustement)
- **Recherche:** Par produit, client, ou notes
- **Export Excel:** Bouton de téléchargement

### 5. Tableau de Bord

- **Statistiques en temps réel:** Valeur totale, produits en stock faible
- **Ventes du mois/jour:** Chiffres d'affaires automatiques
- **Alertes visuelles:** Produits nécessitant un réapprovisionnement

## 🗂️ Catégories de Produits

L'application inclut des catégories spécifiques pour la quincaillerie:

- **Outils:** Perceuses, scies, mèches, etc.
- **Quincaillerie:** Vis, écrous, fixations, etc.
- **Matériaux:** Ciment, fer, bois, etc.
- **Électricité:** Compteurs, interrupteurs, câbles, etc.
- **Plomberie:** Robinets, tuyaux, raccords, etc.
- **Jardinage:** Tondeuses, arroseurs, outils de jardin, etc.
- **Sécurité:** Caméras, détecteurs, alarmes, etc.
- **Autre:** Articles non classés

## 💾 Base de Données

### Structure des Produits
```javascript
{
  name: "Nom du produit",
  reference: "REF-001",
  category: "outils",
  description: "Description détaillée",
  quantity: 50,
  minQuantity: 10,
  price: 299.99,
  supplier: "Fournisseur",
  location: "Entrepôt A, Allée 3"
}
```

### Structure des Transactions
```javascript
{
  product: "ID du produit",
  type: "sale|purchase|adjustment",
  quantity: 5,
  price: 299.99,
  totalPrice: 1499.95,
  customerName: "Nom du client",
  notes: "Notes de transaction"
}
```

## 🔧 Configuration

### Variables d'Environnement

```env
# Configuration du serveur
PORT=5000

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/quincaillerie-stock

# Clé secrète JWT (à changer en production)
JWT_SECRET=votre_cle_secrete_tres_securisee

# Configuration CORS (optionnel)
FRONTEND_URL=http://localhost:3000
```

### Ports par Défaut

- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:3000`
- **MongoDB:** `mongodb://localhost:27017`

## 🚨 Sécurité

### Mesures Implémentées

- **Hashage des mots de passe** avec bcryptjs
- **Tokens JWT** avec expiration 24h
- **Validation des entrées** côté serveur
- **Protection CORS** configurée
- **Rôles d'accès** (admin/employé)
- **Pas d'inscription publique** pour la sécurité

### Bonnes Pratiques

- **Changer le mot de passe admin** après premier accès
- **Utiliser des variables d'environnement** en production
- **Sécuriser la clé JWT** avec une valeur forte
- **Configurer HTTPS** en production
- **Sauvegarder régulièrement** la base de données

## 🐛 Dépannage

### Problèmes Communs

1. **Connexion MongoDB échouée:**
   - Vérifier que MongoDB est en cours d'exécution
   - Vérifier la chaîne de connexion dans `.env`

2. **Erreur 401 Unauthorized:**
   - Vérifier les identifiants de connexion
   - Créer le compte admin avec le script setup

3. **CORS errors:**
   - Vérifier les ports frontend/backend
   - Configurer `FRONTEND_URL` dans `.env`

### Logs Utiles

- **Backend:** Console du serveur Node.js
- **Frontend:** Console du navigateur (F12)
- **MongoDB:** Logs de la base de données

## 📞 Support

### Structure du Projet

```
gestion de stock/
├── backend/
│   ├── src/
│   │   ├── models/          # Modèles Mongoose
│   │   ├── routes/          # Routes Express
│   │   ├── middleware/       # Middleware d'authentification
│   │   └── index.ts         # Point d'entrée principal
│   ├── package.json
│   ├── .env              # Configuration (à créer)
│   └── setup-admin.js     # Script de création admin
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── contexts/        # Contextes React
│   │   ├── services/        # Services API
│   │   └── types/          # Types TypeScript
│   └── package.json
└── README.md               # Ce fichier
```

### Technologies Clés

- **MERN Stack:** MongoDB + Express.js + React.js + Node.js
- **TypeScript:** Typage statique pour la fiabilité
- **JWT:** Authentification stateless
- **Custom CSS:** Stylise moderne sans framework CSS
- **XLSX:** Export Excel natif côté client

---

## 🎉 Prêt à Utiliser!

Une fois l'application installée et le compte administrateur créé, vous pouvez:

1. **Démarrer les deux serveurs** (backend et frontend)
2. **Vous connecter** avec les identifiants admin
3. **Commencer à gérer** votre stock de quincaillerie
4. **Ajouter vos produits** et commencer les ventes

**Développé avec ❤️ pour les professionnels de la quincaillerie!**

1. Assurez-vous que MongoDB est en cours d'exécution
2. Démarrez le backend (`npm run dev` dans le dossier backend)
3. Démarrez le frontend (`npm start` dans le dossier frontend)
4. Ouvrez votre navigateur sur `http://localhost:3000`

## Structure du Projet

```
gestion-de-stock/
├── backend/
│   ├── src/
│   │   ├── models/          # Modèles Mongoose
│   │   ├── routes/          # Routes Express
│   │   └── index.ts         # Point d'entrée du serveur
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── services/        # Services API
│   │   ├── types/           # Types TypeScript
│   │   └── App.tsx          # Composant principal
│   └── package.json
└── README.md
```

## Catégories de Produits

L'application inclut les catégories suivantes pour la quincaillerie:
- Outils
- Quincaillerie
- Matériaux
- Électricité
- Plomberie
- Jardinage
- Sécurité
- Autre

## API Endpoints

### Produits
- `GET /api/products` - Lister tous les produits
- `GET /api/products/:id` - Obtenir un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/products/low-stock` - Produits en stock faible
- `PATCH /api/products/:id/stock` - Mettre à jour le stock

### Catégories
- `GET /api/categories` - Lister toutes les catégories
- `GET /api/categories/:id` - Obtenir une catégorie
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Mettre à jour une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

## Développement Futur

- [ ] Système d'authentification complet
- [ ] Gestion des fournisseurs
- [ ] Historique des mouvements de stock
- [ ] Rapports et exportation
- [ ] Notifications par email
- [ ] Interface mobile (PWA)

## Licence

MIT License
