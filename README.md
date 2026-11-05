# Site SKYCRAFT

Ce site est statique : il n’y a pas de compilation ni de dépendances à installer.
La page d’accueil est `index.html` et l’atelier de personnalisation est `personnaliser.html`.

## Publier sur GitHub Pages

1. Ajoute tous les fichiers du projet au dépôt GitHub, en conservant le dossier `images`.
2. Dans **Settings > Pages**, choisis **GitHub Actions** comme source de publication.
3. Envoie les changements sur la branche `main` ou `master`, ou lance le workflow
   **Publier le site sur GitHub Pages** depuis l’onglet **Actions**.
4. Une fois le workflow terminé, ouvre l’adresse affichée dans **Settings > Pages**.

Les pages et les images utilisent des chemins relatifs afin de fonctionner aussi bien
sur un dépôt de projet GitHub Pages que sur un domaine personnel.

## Modifier le site et ses images

- Modifie le texte et les liens de la page d’accueil dans `index.html`.
- Les images de la page d’accueil se trouvent dans `images`. Pour en remplacer une,
  garde son nom et son extension, ou modifie son chemin `images/...` dans `index.html`.
  Respecte exactement les majuscules et minuscules des noms de fichiers.
- Les réglages de l’atelier sont dans `personnaliser.html` et son fonctionnement dans
  `script.js`. Les styles communs sont dans `styles.css`.
- Dans l’atelier, le visiteur peut ajouter une image PNG, JPG ou WebP jusqu’à 512 Ko.
  Son brouillon reste dans le navigateur utilisé. Pour le reprendre ailleurs, il faut
  utiliser **Enregistrer mon projet**, puis **Ouvrir un projet** avec le fichier JSON.
  **Télécharger l’aperçu PNG** permet de conserver ou de partager le rendu.
