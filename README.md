# 🌐 Environnement centralisé de l'ECE

> [!WARNING]
> Le site est hoster [ici](https://ececefrontend-production.up.railway.app/)
> Comme le backend est hoster sur un tier gratuit, il s'éteint après quelque minutes d'inactivité
> Donc si le site semble charger trop longtemps recharger la page peut le refaire marcher

> [!WARNING]
> Les pages ```/tools``` sont les seules où ne pas être connecter n'as pas d'importance  

## 📖 Table des matières
- [🎯 Objectifs](#-objectifs)
  - [🔍 Aperçu](#-aperçu)
  - [📌 Détails](#-détails)
    - [📊 Notes](#-notes)
    - [📅 Emploi du temps & absences](#-emploi-du-temps--absences)
    - [📚 Cours](#-cours)
    - [🛠️ Outils](#-outils)
    - [👤 Compte](#-compte)
    - [⚙️ Réglages](#-réglages)
- [🔒 Vie privée et sécurité](#-vie-privée-et-sécurité)
- [🛣️ Plan de route](#️-plan-de-route)
- [👨‍💻 Organision du code](#-organisation-du-code)
---


## 🎯 Objectifs

### 🔍 Aperçu

L'objectif principal est de regrouper les *3* sites qu'un étudiant de l'ECE consulte presque quotidiennement :  
1. 📖 Le site de l'école (principalement pour ses notes)  
2. 📅 Hyperplanning (pour son emploi du temps et les absences)  
3. 🎓 Boostcamp (pour les cours)  

Le site proposera également plusieurs améliorations pour un meilleur confort d'utilisation, telles que :  
- 📈 Calcul des moyennes  
- 🗺️ Plan des salles  
- Etc.  

### 📌 Détails

#### 📊 Notes

Les notes sont affichées par semestre et le site *permettra* de :  
- Voir sa moyenne générale  
- Voir ses moyennes par module  
- Voir ses moyennes et ses notes par cours  
- Suivre l'évolution de ses notes  
- Simuler sa moyenne  

#### 📅 Emploi du temps & absences

Le site *permettra* d'afficher son agenda avec :  
- 📆 Les cours et événements récupérés depuis Hyperplanning  
- ❌ Les absences  
- 📝 Les devoirs et notes ajoutés par l'utilisateur  

#### 🛠️ Outils

Le site proposera un certain nombre d'outils utiles aux étudiants comme par exemple :
 - Une todo list
 - Un timer
 - Un auto remplisseur de rapport d'électronique
 - Etc 

Il proposera aussi des lien vers des site utile.



#### 📚 Cours

Le site *proposera* une liste des cours avec la possibilité de :  
- 📖 Afficher le contenu  
- ⭐ Mettre des cours en favoris  
- (Autre fonctionnalité à ajouter)  

#### 👤 Compte

Le site *pourra* afficher les informations présentes sur le site de l'école, notamment :  
- 🏷️ Nom et prénom  
- 🖼️ Photo  
- 🔢 Numéro INE  
- Etc.  

#### ⚙️ Réglages

De nombreux réglages *seront* disponibles pour personnaliser le site.  
Cela inclut le choix du thème, l'affichage des moyennes, la personnalisation des icônes des matières, etc.  

---

## 🔒 Vie privée et sécurité

Pour se connecter, il est nécessaire d'utiliser ses identifiants, qui **peuvent ou non** être stockés localement.  
Bien qu'ils soient chiffrés, la clé de chiffrement n'est pas difficile à trouver, ce qui constitue une limitation du front-end.  

De plus, lors de la connexion, la requête envoie l'email en clair et le mot de passe chiffré.  

Aucune donnée n'est stockée sur le back-end, et il est possible de désactiver la sauvegarde locale des informations.  
Pour en savoir plus sur le back-end, cliquez [ici]() *(Pas encore disponible sur GitHub)*.  

---

## 🛣️ Plan de route

### 🚀 Version 0.0 (MVP)

#### 🎨 Interface utilisateur (UI)  

- [ ] 🏠 Page d'accueil  
- [ ] 🔑 Page de connexion  
- [ ] 📅 Page agenda  
- [ ] 📚 Page cours  
- [ ] 📊 Page notes  
- [ ] 👤 Page compte  
- [ ] ⚙️ Page réglages  
- [ ] ❌ Page 404  

#### ⚡ Fonctionnalités principales  

- [X] 🔐 Connexion via CampusOnline  
- [X] 💾 Sauvegarde locale des données  
- [X] 📆 Parsing des fichiers iCal  
- [ ] 📊 Calcul automatique des moyennes  
- [ ] 📌 Ajout de devoirs et notes personnelles  
- [ ] 🌙 Mode sombre et personnalisation de l'interface  

---


## 👨‍💻 Organisation du code

Dans l'idée ce site est une SPA (Single Page Application), où les pages sont décomposées et où le client se charche de construire le suite.

### Racine :

La racine ne contient que 4 fichiers :
 1. ```index.html```
 2. ```index.php```
 3. ```load-template.php```
 4. ```main.js```


```index.html``` est un fichier html presque vide qui agis comme 'coquille' pour notre site.
```index.php``` est le points d'entré du serveur et 
