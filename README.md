# Burger King — Carte mentale de préparation à l'examen oral M2

Mini-site statique, responsive et interactif, construit à partir du document **« BURGER KING — BRIEF EXAMEN ORAL M2 »** transmis.

## Contenu

- `index.html` : structure des pages et sections.
- `styles.css` : identité visuelle responsive, carte mentale et styles d'impression.
- `content.js` : informations du brief, objections d'entraînement, éléments manquants et liens vers les assets.
- `app.js` : interactions (branches dépliables, recherche, filtres, tirage d'objection, copie de la méthode, impression PDF).
- `favicon.svg` : icône de l'onglet.

Aucune dépendance, aucun framework et aucune clé API ne sont nécessaires.

## Publier sur GitHub Pages

1. Crée un dépôt GitHub, par exemple `burger-king-oral`.
2. Ajoute **tous les fichiers de ce dossier à la racine du dépôt** (pas dans un sous-dossier supplémentaire).
3. Ouvre `Settings` → `Pages` dans le dépôt.
4. Dans `Build and deployment`, sélectionne `Deploy from a branch`.
5. Choisis la branche `main` et le dossier `/ (root)`, puis valide.
6. Après le déploiement, GitHub affichera l'adresse du site dans cette page (généralement `https://TON-PSEUDO.github.io/burger-king-oral/`).

Tu peux aussi prévisualiser le site en ouvrant `index.html` directement dans ton navigateur.

## Utilisation pour réviser

- Ouvre les branches de la carte mentale pour réviser chaque bloc.
- Utilise la recherche et les filtres pour retrouver une objection.
- Clique sur **Tirer une objection** pour simuler le tirage au sort.
- Utilise **Imprimer / PDF** pour imprimer ou enregistrer la fiche depuis le navigateur.
- Les réponses proposées dans la partie objections sont des **pistes d'entraînement** élaborées à partir du brief ; elles ne sont pas des objections officielles fournies dans le sujet.

## Précision sur les sources

Les faits, montants, dates, contraintes et liens d'assets sont repris du brief fourni. Les pourcentages budgétaires sont calculés à partir des montants du document. Les exemples de formulation orale, les scénarios d'arbitrage et les questions probables sont des aides à la préparation, clairement distinguées des faits.

Le brief ne précise notamment pas l'année des jalons, la cible, les KPI, les prévisions média ou la ventilation détaillée de l'achat d'espace : le site les signale comme des informations à confirmer et non comme des faits.
