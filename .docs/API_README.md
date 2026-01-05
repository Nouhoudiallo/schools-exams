# API Backend - Je cours l'exam

L'API backend est construite avec **Next.js 16** et **Prisma** pour gérer tous les aspects de la plateforme d'examens en ligne.

## Installation

```bash
npm install
```

## Configuration

1. Crée un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/schools_exams"
```

2. Initialise la base de données :

```bash
npx prisma migrate dev
```

3. Lance le serveur de développement :

```bash
npm run dev
```

Le serveur sera accessible à `http://localhost:3000`

## Structure de l'API

```
app/
├── api/
│   ├── auth/
│   │   ├── register/       # Inscription
│   │   └── login/          # Connexion
│   ├── schools/            # Gestion des écoles
│   ├── classes/            # Gestion des classes
│   ├── enrollments/        # Inscriptions d'élèves
│   ├── exams/              # Gestion des examens
│   ├── invitations/        # Invitations d'examens
│   └── submissions/        # Soumissions d'examens
```

## Authentification

L'API utilise des **tokens Bearer** simples. Pour les environnements de production, intègre une solution JWT appropriée.

Pour chaque requête protégée, inclus le header :
```
Authorization: Bearer <token>
```

## Modèle de données

### User
- **PROF**: Professeur (crée écoles, classes, examens)
- **STUDENT**: Élève (suit les classes, passe les examens)

### School
Créée par un professeur, contient plusieurs classes.

### Class
Appartient à une école, contient les inscriptions des élèves et les examens.

### Enrollment
Relie un élève à une classe.

### Exam
Examen créé par un professeur, limité à une période de temps.

### ExamInvitation
Invite un élève à passer un examen avec un token unique.

### ExamSubmission
Soumission des réponses d'un élève à un examen.

## API Complète

Voir [API_DOCS.md](./API_DOCS.md) pour la documentation complète des endpoints.

## Cas d'usage

### Professeur

1. S'inscrire et se connecter
2. Créer une ou plusieurs écoles
3. Créer des classes dans chaque école
4. Ajouter des élèves aux classes via leur email
5. Créer des examens avec sujet PDF
6. Envoyer des invitations aux élèves
7. Consulter les réponses soumises

### Élève

1. Recevoir une invitation d'examen
2. Valider le token d'invitation
3. Répondre aux questions durant la période prévue
4. Soumettre ses réponses
5. Consulter ses soumissions

## Détection de triche

L'API capture les événements de triche (focus, blur, etc.) lors de la soumission des réponses. Ces informations sont stockées dans le champ `cheatingLog` de la soumission.

## Limitations V1

- Pas de système de notation automatique
- Pas de chat ou messages
- Pas de correction collaborative
- Authentification simple (pas de mot de passe)
- Pas de gestion des permissions granulaires

---

**Note**: Cette API est une première version (V1). Elle peut être étendue pour supporter des fonctionnalités additionnelles.
