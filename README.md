# Masroufi 🇲🇦

**Masroufi** est une application mobile moderne de gestion de finances personnelles, spécialement conçue pour le contexte marocain. Elle permet de suivre ses dépenses quotidiennes, de définir des limites budgétaires par catégorie et d'analyser sa santé financière grâce à des indicateurs précis.

L'application est développée avec les technologies les plus récentes de l'écosystème React Native (**Expo SDK 54**, **React 19**, **New Architecture**).

---

## Fonctionnalités

### Gestion Quotidienne
* **Transactions :** Ajout, modification (via le crayon) et suppression de dépenses et revenus.
* **Solde en Temps Réel :** Calcul automatique du "Reste à vivre" (Revenus totaux - Dépenses totales).
* **Alertes Budgétaires :**
    * **Alerte globale :** Si le solde du mois devient négatif.
    * **Alerte catégorielle :** Si une catégorie dépasse son plafond défini (ex: "Budget Café dépassé").

### Analyse Financière
* **Comparaison Temporelle :** Analyse des variations par rapport au mois précédent (ex: "Dépenses : -10% vs Octobre").
* **Taux d'Épargne :** Jauge dynamique indiquant le pourcentage de revenu épargné.
* **Historique Mensuel :** Navigation mois par mois pour consulter les archives passées.

### Personnalisation & Outils
* **Catégories Sur-Mesure :** Modification du nom, de l'icône, de la couleur et du plafond budgétaire de chaque catégorie.
* **Export PDF :** Génération d'un rapport comptable complet partageable.
* **Mode Sombre :** Interface compatible Dark Mode.
* **Reset :** Option pour réinitialiser toutes les données de l'application.

---

## Technologies & Stack Technique

Ce projet utilise une stack technique de pointe ("Bleeding Edge") :

| Technologie | Version | Rôle |
| :--- | :--- | :--- |
| **Expo** | SDK 54 | Framework de développement |
| **React Native** | 0.76 | Moteur mobile (New Architecture enabled) |
| **React** | 19.1.0 | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique et sécurité du code |
| **Zustand** | 5.x | Gestion d'état global (State Management) |
| **React Navigation** | v7 | Navigation entre les écrans |
| **Lucide Icons** | Latest | Icônes vectorielles modernes |
| **AsyncStorage** | Latest | Persistance des données locale |
| **Expo Print** | Latest | Moteur de génération PDF |

---

## Structure du Projet

Le projet suit une architecture **Atomique** et modulaire ("Clean Architecture") pour faciliter la maintenance et l'évolution du code.

```text
src/
├── components/           # Composants d'interface (UI) réutilisables
│   ├── atoms/            # Éléments de base (Boutons, Inputs, Textes...)
│   ├── molecules/        # Assemblages simples (Ligne de transaction, Badge...)
│   └── organisms/        # Blocs complexes autonomes (Carte de Solde, Graphiques...)
│
├── constants/            # Données statiques
│   ├── categories.ts     # Configuration par défaut des catégories (Couleurs, Noms)
│   └── icons.ts          # Registre centralisé des icônes (Lucide React Native)
│
├── hooks/                # Logique métier (Custom Hooks)
│   └── useFinancials.ts  # Cerveau de l'app : calcul des soldes, stats, comparaisons et alertes
│
├── navigation/           # Configuration de la navigation
│   └── AppNavigator.tsx  # Définition des Onglets (Tabs) et de la Pile (Stack)
│
├── screens/              # Écrans de l'application
│   ├── DashboardScreen   # Accueil : Solde, Alertes budget, Barres de progression
│   ├── StatsScreen       # Statistiques : Comparaison N-1, Taux d'épargne, Jauges
│   ├── HistoryScreen     # Historique : Liste des transactions filtrable par mois
│   ├── AddTransaction    # Formulaire : Ajout et modification de dépenses/revenus
│   ├── SettingsScreen    # Paramètres : Mode sombre, Export PDF, Revenu fixe
│   ├── CategoryList      # Gestion : Liste des catégories personnalisables
│   └── EditCategory      # Édition : Changement d'icône et de limite budgétaire
│
├── store/                # Gestion d'état global
│   └── useStore.ts       # Store Zustand persistant (sauvegarde automatique sur le téléphone)
│
├── types/                # Définitions TypeScript (Interfaces et Types globaux)
│
└── utils/                # Fonctions utilitaires
    ├── currency.ts       # Formatage monétaire (DH)
    └── pdfGenerator.ts   # Génération de rapports HTML/PDF
```

## Installation et Exécution

Suivez ces instructions étape par étape pour configurer et lancer le projet sur votre machine.

### 1. Prérequis
* **Node.js** (v18 ou supérieur) installé.
* L'application **Expo Go** installée sur votre téléphone (disponible sur Google Play et App Store).

### 2. Récupération du projet
```bash
git clone [https://github.com/votre-compte/masroufi.git](https://github.com/votre-compte/masroufi.git)
cd masroufi
```

### 3. Installation des dépendances
Ce projet utilise **React 19** et **Expo SDK 54** (versions "Bleeding Edge"). Afin d'éviter les conflits de dépendances avec certaines librairies communautaires (comme la navigation ou les icônes), il est **impératif** d'utiliser la commande suivante :
```bash
npm install --legacy-peer-deps
```
*(Note : N'utilisez pas ```bash npm install ``` standard, car cela pourrait échouer en raison des exigences strictes de React 19).*

### 4. Lancer l'application
Démarrez le serveur de développement en vidant le cache pour garantir une compilation propre :
```bash
npx expo start --clear
```
Un QR Code apparaîtra dans votre terminal. Scannez-le simplement avec l'application Expo Go sur votre téléphone (Android) ou via l'appareil photo (iOS).

## Auteurs
Mohamed El Anouary & Othmane Najib

