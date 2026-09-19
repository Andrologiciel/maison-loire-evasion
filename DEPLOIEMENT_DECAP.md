# Installation sur le VPS avec NGINX, PM2 et Decap CMS

Ce guide correspond au domaine `cheverny.andrologiciels.com`, à NGINX 1.24 et au serveur Node.js du projet sur le port 3000.

## 1. Mettre cette version sur GitHub

Decap modifie les fichiers du dépôt GitHub. Cette version doit donc être présente sur la branche `main` du dépôt :

```text
Andrologiciel/maison-loire-evasion
```

Vérifier notamment que les fichiers suivants sont présents dans GitHub :

```text
client/public/admin/index.html
client/public/admin/config.yml
client/src/content/site.json
.github/workflows/deploy.yml
```

## 2. Installer le projet sur le VPS

Se connecter au serveur :

```bash
ssh cyrgui@ADRESSE_IP_DU_VPS
```

Installer les outils nécessaires :

```bash
sudo apt update
sudo apt install -y git nginx
sudo npm install -g pnpm@10 pm2
```

Cloner puis construire le site :

```bash
cd /home/cyrgui
git clone https://github.com/Andrologiciel/maison-loire-evasion.git
cd /home/cyrgui/maison-loire-evasion
pnpm install --frozen-lockfile
pnpm build
pm2 start ecosystem.config.cjs
```

Tester le serveur Node.js :

```bash
curl http://127.0.0.1:3000/health
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/admin/
```

Activer le démarrage automatique :

```bash
pm2 startup
```

Exécuter la commande `sudo` affichée par PM2, puis :

```bash
pm2 save
```

## 3. Installer la configuration NGINX

Le fichier prêt à l'emploi se trouve dans :

```text
deploy/nginx/cheverny.andrologiciels.com.conf
```

Le copier :

```bash
sudo cp deploy/nginx/cheverny.andrologiciels.com.conf /etc/nginx/sites-available/cheverny.andrologiciels.com
sudo ln -s /etc/nginx/sites-available/cheverny.andrologiciels.com /etc/nginx/sites-enabled/cheverny.andrologiciels.com
```

Si le lien existe déjà, ne pas recréer le lien. Tester puis recharger :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Vérifier :

```bash
curl -I https://cheverny.andrologiciels.com/
curl -I https://cheverny.andrologiciels.com/admin/
```

## 4. Créer le compte Decap Turbo

1. Ouvrir `https://turbo.decapcms.org/`.
2. Créer une organisation.
3. Dans **Git connection**, connecter GitHub.
4. Installer l'application Decap Turbo uniquement sur le dépôt `Andrologiciel/maison-loire-evasion`.
5. Créer un site avec les valeurs suivantes :

```text
Provider       : GitHub
Repository     : Andrologiciel/maison-loire-evasion
Branch         : main
Config path    : client/public/admin/config.yml
Admin URL      : https://cheverny.andrologiciels.com/admin/
```

6. Copier le **Site ID** affiché dans l'onglet Overview.

Le plan gratuit Decap Turbo permet actuellement un site et un utilisateur.

## 5. Renseigner l'identifiant Decap

Dans `client/public/admin/config.yml`, remplacer :

```yaml
turbo_site_id: VOTRE_IDENTIFIANT_DECAP_TURBO
```

par l'identifiant réel, par exemple :

```yaml
turbo_site_id: 00000000-0000-0000-0000-000000000000
```

Enregistrer et pousser cette modification sur la branche `main`, puis reconstruire une dernière fois le site sur le VPS.

## 6. Préparer le déploiement automatique

Le workflow `.github/workflows/deploy.yml` reconstruit et redémarre le site après chaque publication Decap.

Créer une clé réservée au déploiement sur le VPS :

```bash
ssh-keygen -t ed25519 -f /home/cyrgui/github-actions-deploy -C "github-actions-maison" -N ""
cat /home/cyrgui/github-actions-deploy.pub >> /home/cyrgui/.ssh/authorized_keys
chmod 700 /home/cyrgui/.ssh
chmod 600 /home/cyrgui/.ssh/authorized_keys
```

Afficher la clé privée à copier dans GitHub :

```bash
cat /home/cyrgui/github-actions-deploy
```

Depuis un ordinateur de confiance, obtenir la clé publique SSH du VPS :

```bash
ssh-keyscan -t ed25519 ADRESSE_IP_DU_VPS
```

Dans GitHub, ouvrir :

```text
Repository > Settings > Secrets and variables > Actions
```

Créer quatre secrets :

| Secret | Valeur |
|---|---|
| `VPS_HOST` | adresse IP ou nom DNS du VPS |
| `VPS_USER` | `cyrgui` |
| `VPS_SSH_PRIVATE_KEY` | contenu complet de `github-actions-deploy` |
| `VPS_KNOWN_HOSTS` | ligne complète produite par `ssh-keyscan` |

Après avoir enregistré `VPS_SSH_PRIVATE_KEY` dans GitHub **et validé un premier déploiement**, supprimer uniquement la copie de cette clé privée créée pour le transfert :

```bash
shred -u /home/cyrgui/github-actions-deploy
```

Conserver le fichier `.pub` et l'entrée dans `authorized_keys`.

## 7. Première mise à jour automatique

Dans GitHub, ouvrir l'onglet **Actions**, sélectionner **Deploy to VPS** et vérifier que le dernier lancement est vert.

À partir de ce moment :

1. ouvrir `https://cheverny.andrologiciels.com/admin/` ;
2. se connecter avec Decap Turbo ;
3. modifier le contenu ;
4. cliquer sur **Publier** ;
5. attendre la fin de l'action GitHub ;
6. recharger le site.

## 8. Contenus actuellement administrables

Cette première configuration permet de modifier :

- le titre principal de la page d'accueil ;
- son texte d'introduction ;
- les trois lignes du badge ;
- l'adresse Airbnb ;
- l'adresse Booking.com.

Les autres contenus restent dans les composants React et pourront être déplacés progressivement dans les fichiers administrés par Decap.

## 9. Diagnostic

État du site :

```bash
pm2 status
pm2 logs maison-loire-evasion --lines 100
```

Tests NGINX :

```bash
sudo nginx -t
sudo tail -n 100 /var/log/nginx/error.log
```

Relance manuelle :

```bash
cd /home/cyrgui/maison-loire-evasion
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm build
pm2 restart maison-loire-evasion --update-env
```
