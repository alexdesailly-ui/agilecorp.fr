# Règles de revue d'agilecorp.fr

Référentiel lu par l'agent de revue à chaque PR. Alex l'enrichit à chaque faux positif ou oubli constaté : c'est ce fichier qui fait progresser la revue, pas le prompt.

Dépôt allégé : site vitrine statique du cabinet AgileCorp (`index.html`, `articles/*.html`, `css/`, `js/main.js`), sans build ni tests. Chaque push sur `main` est publié en production par FTP (`deploy.yml`, `dangerous-clean-slate`). La revue porte sur le contenu, les liens, le SEO, l'accessibilité, la confidentialité des clients et les secrets.

## Ce que l'agent cherche, par ordre de gravité

| Gravité | Exemples propres à agilecorp.fr |
|---|---|
| **Bloquant** | Secret ou identifiant FTP dans un fichier du dépôt (tout ce qui n'est pas exclu par `deploy.yml` est publié) ; nom d'un client réel, d'une personne ou d'un chiffre sous NDA dans un retour de mission de `articles/` ; formulaire `#contactForm` qui envoie les données à un service tiers sans le dire ; lien de navigation cassé vers une page de `articles/` ou vers `../index.html#contact` ; fichier supprimé qu'un autre fichier référence encore (le `clean-slate` le retire aussi du serveur) |
| **Important** | `<title>`, `meta description` ou balises Open Graph manquants ou dupliqués sur une page nouvelle ou modifiée ; `og:url` ou `og:image` qui ne pointe pas vers `https://agilecorp.fr` ; nouvel article absent des cartes « Retours de terrain » de `index.html` ; image sans `alt` ; champ de formulaire sans `label for` ou absent du `mailto:` construit par `js/main.js` ; script tiers ou traqueur ajouté sans bandeau de consentement ; promesse commerciale ou référence client invérifiable |
| **Mineur** | Entité HTML mal formée (`&eacute;` cassé) ; anglicisme évitable dans un texte destiné à un client francophone ; image lourde ajoutée sans compression ; incohérence de coordonnées entre la section contact et le pied de page |

## Ce que l'agent ne commente pas

- Les préférences de style CSS sans conséquence visible.
- Le code non modifié par la PR, sauf si le changement le casse.
- Il n'y a pas de CI de vérification : l'agent cite seulement ce qu'il a vérifié lui-même.

## Filtre anti faux positifs

Un constat n'est publié que si l'agent a :
1. relu le code autour du diff (page liée, sélecteur CSS, fonction de `js/main.js`, liste `exclude` de `deploy.yml`) ;
2. décrit un scénario concret de défaillance (« un prospect qui clique sur la carte de l'article arrive sur une 404… ») ;
3. vérifié qu'aucun autre élément du site ne le couvre déjà.

Sinon, le constat est écarté ou reformulé en question.

## Faux positifs connus (à ne plus signaler)

- Email et téléphone professionnels en clair dans `index.html` et `js/main.js` : coordonnées publiques voulues.
- Formulaire de contact en `mailto:` : choix assumé, pas de backend.
