# 🚀 Guide de Démarrage Rapide - Je cours l'exam API

## 1️⃣ Installation

```bash
# Cloner ou accéder au projet
cd schools-exams

# Installer les dépendances
npm install
```

## 2️⃣ Configuration de la Base de Données

### Avec PostgreSQL

```bash
# Créer une base de données
createdb schools_exams

# Configurer .env.local
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/schools_exams"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

### Avec SQLite (Alternative légère)

```bash
cat > .env.local << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

## 3️⃣ Initialiser la Base de Données

```bash
# Appliquer les migrations
npx prisma migrate dev

# Remplir avec des données de test
npx prisma db seed

# (Optionnel) Ouvrir Prisma Studio
npx prisma studio
```

## 4️⃣ Lancer l'Application

```bash
npm run dev
```

L'application sera accessible à **http://localhost:3000**

## 5️⃣ Tester l'API

### Option A : Avec cURL

```bash
# 1. Inscrire un professeur
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "PROF"
  }'
```

### Option B : Avec Postman

1. Importer la collection : `postman_collection.json`
2. Configurer les variables :
   - `base_url`: `http://localhost:3000`
3. Exécuter les requêtes dans l'ordre

### Option C : Avec le Script Bash

```bash
chmod +x test-api.sh
./test-api.sh
```

## 📚 Documentation

- **API_DOCS.md** - Documentation complète de tous les endpoints
- **API_README.md** - Guide d'installation détaillé
- **IMPLEMENTATION_SUMMARY.md** - Résumé des fonctionnalités

## 🧑‍🏫 Flux Exemple : Professeur

```bash
# 1. Inscrire un professeur
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "PROF"
  }'

# Récupérer le token et l'ID
TEACHER_TOKEN="<le-token-reçu>"
TEACHER_ID="<l-id-utilisateur>"

# 2. Créer une école
curl -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Lycée Saint-Paul"}'

SCHOOL_ID="<l-id-école>"

# 3. Créer une classe
curl -X POST http://localhost:3000/api/classes \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "3ème A",
    "schoolId": "'$SCHOOL_ID'"
  }'

CLASS_ID="<l-id-classe>"

# 4. Créer un examen
curl -X POST http://localhost:3000/api/exams \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Examen de Mathématiques",
    "pdfUrl": "https://example.com/exam.pdf",
    "classId": "'$CLASS_ID'",
    "startsAt": "2025-01-10T08:00:00Z",
    "endsAt": "2025-01-10T10:00:00Z"
  }'

EXAM_ID="<l-id-examen>"

# 5. Voir les examens créés
curl -X GET http://localhost:3000/api/exams \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

## 👨‍🎓 Flux Exemple : Élève

```bash
# 1. Inscrire un élève
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Durand",
    "email": "marie@example.com",
    "role": "STUDENT"
  }'

STUDENT_TOKEN="<le-token-reçu>"

# 2. Voir ses invitations
curl -X GET http://localhost:3000/api/invitations \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# 3. Valider l'invitation (optionnel)
INVITATION_ID="<l-id-invitation>"
INVITATION_TOKEN="<le-token-invitation>"

curl -X POST http://localhost:3000/api/invitations/$INVITATION_ID/validate \
  -H "Content-Type: application/json" \
  -d '{"token": "'$INVITATION_TOKEN'"}'

# 4. Soumettre l'examen
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invitationId": "'$INVITATION_ID'",
    "token": "'$INVITATION_TOKEN'",
    "content": "Mes réponses à l examen...",
    "cheatingLog": {}
  }'

# 5. Voir ses soumissions
curl -X GET http://localhost:3000/api/submissions \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

## 🔧 Débogage

### Afficher les requêtes SQL
```bash
# Ajouter à .env.local
DATABASE_DEBUG=true

# Puis relancer
npm run dev
```

### Accéder à Prisma Studio
```bash
npx prisma studio
```

## ❌ Problèmes Courants

### "Error: ENOENT: no such file or directory"
→ Vérifier que `.env.local` existe et contient `DATABASE_URL`

### "P1000: Authentication failed"
→ Vérifier les identifiants PostgreSQL dans `DATABASE_URL`

### "Port 3000 already in use"
```bash
# Utiliser un port différent
npm run dev -- -p 3001
```

## 🎯 Prochaines Étapes

- [ ] Intégrer l'authentification JWT robuste
- [ ] Ajouter des passwords
- [ ] Mettre en place des tests
- [ ] Déployer sur Vercel/Railway
- [ ] Ajouter un système d'email
- [ ] Implémenter la notation automatique

## 📞 Support

Voir les fichiers de documentation pour plus de détails :
- Questions sur les endpoints → **API_DOCS.md**
- Installation détaillée → **API_README.md**
- Implémentation complète → **IMPLEMENTATION_SUMMARY.md**

---

**Happy Testing! 🎉**
