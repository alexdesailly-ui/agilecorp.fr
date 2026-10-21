# agilecorp.fr — consignes pour les agents

Lu à chaque exécution par les agents (revue de PR, correctifs `@claude`). Rester court.

## Le produit

Site vitrine du cabinet de conseil IT AgileCorp (AMOA, QA, pilotage, agilité, conduite du changement) avec des retours de mission dans `articles/`. Site statique publié sur Hostinger par FTP à chaque push sur `main`.

## Commandes

| But | Commande |
|---|---|
| Aperçu local | `python3 -m http.server 8000` |
| Syntaxe du JavaScript | `node --check js/main.js` |
| Vérification avant de pousser | relire son diff : aucun lint, test ni build dans ce dépôt |

## Règles non négociables

1. **Confidentialité client.** Aucun nom de client réel, de personne ou de chiffre sous NDA dans `articles/` : les retours de mission restent anonymisés.
2. **Aucun secret dans le dépôt.** Les identifiants FTP vivent dans les secrets GitHub ; tout fichier non exclu par `deploy.yml` est publié.
3. **Aucune collecte cachée.** Le formulaire de contact ouvre un `mailto:` ; pas de service tiers, d'analytics ni de traqueur sans consentement.
4. **SEO.** Chaque page garde `lang="fr"`, un `<title>`, une `meta description` et, pour l'accueil, des balises Open Graph pointant vers `https://agilecorp.fr`.
5. **Liens.** Toute page ajoutée ou renommée est reliée depuis `index.html` et ne casse aucun lien existant.
6. **Accessibilité.** Chaque image a un `alt`, chaque champ son `label`.

## Conventions

- Contenu, messages de commit et documentation en français ; anglicismes modérés.
- Pas de dépendance ni de framework : HTML, CSS et JavaScript natifs.
- Ne jamais fusionner sur la branche par défaut, ne jamais déployer, ne jamais toucher à .github/workflows/ sans demande explicite d'Alex.
