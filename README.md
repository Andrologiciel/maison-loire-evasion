# Maison Loire Évasion

Site React servi en production par un serveur Node.js/Express. Les images sont incluses dans le dépôt : aucun service Manus n'est nécessaire.

## Prérequis

- Node.js 20 ou supérieur (Node.js 22 recommandé)
- pnpm 10

## Développement local

```bash
corepack enable
pnpm install
pnpm dev
```

Le serveur de développement est disponible sur `http://localhost:3000`.

## Construction et démarrage Node.js

```bash
pnpm install --frozen-lockfile
pnpm build
HOST=127.0.0.1 PORT=3000 pnpm start
```

Vérification :

```bash
curl http://127.0.0.1:3000/health
```

## Exécution avec PM2

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Exécutez ensuite la commande affichée par `pm2 startup` avec `sudo`.

Après une mise à jour du dépôt :

```bash
git pull
pnpm install --frozen-lockfile
pnpm build
pm2 restart maison-loire-evasion
```

## Administration Decap CMS

L’administration est disponible sur `/admin/`. Elle permet de modifier :

- l’ensemble des pages existantes et leurs listes, images, liens et cartes ;
- les libellés du menu, le pied de page et les liens de réservation ;
- les polices et les tailles globales des titres et des textes ;
- quatre thèmes prédéfinis, les couleurs, les boutons, la largeur et les arrondis ;
- des pages supplémentaires, créées dans `client/src/content/pages`.

Une page supplémentaire reçoit automatiquement une route `/<slug>`, peut être affichée
dans le menu et rejoint la recherche interne après la prochaine construction du site.
Les changements Decap sont enregistrés dans GitHub. Le workflow de déploiement se
connecte ensuite au VPS sur le port 9922, met à jour `/opt/maison-loire-evasion`,
reconstruit le site et redémarre PM2 automatiquement.

## Exemple NGINX

```nginx
server {
    listen 80;
    server_name votre-domaine.fr www.votre-domaine.fr;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Après avoir activé ce virtual host, ajoutez HTTPS avec Certbot.
