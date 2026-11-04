# Connexion MCP — La Maison Vigneronne

Le site expose un serveur **Model Context Protocol (MCP)** public et strictement
en lecture seule. Il permet à un assistant compatible MCP de consulter les
informations publiques du gîte, ses pages en français et en anglais, et ses
liens officiels de réservation.

## Point de connexion

| Élément | Valeur |
| --- | --- |
| URL MCP | `https://cheverny.andrologiciels.com/mcp` |
| Transport | Streamable HTTP |
| Authentification | Aucune, données publiques uniquement |
| Langues | `fr`, `en` |
| Informations techniques | `https://cheverny.andrologiciels.com/mcp/info` |

Dans un client acceptant une configuration JSON générique, la déclaration est :

```json
{
  "mcpServers": {
    "la-maison-vigneronne": {
      "type": "http",
      "url": "https://cheverny.andrologiciels.com/mcp"
    }
  }
}
```

Le nom exact des champs peut varier selon le client. Lorsqu'une interface ne
demande qu'une URL de serveur distant, indiquez simplement l'URL MCP ci-dessus.

## Outils disponibles

| Outil | Fonction |
| --- | --- |
| `get_site_overview` | Présentation du gîte et liste des pages dans la langue demandée |
| `list_pages` | Titres, descriptions et URL de toutes les pages publiques |
| `get_page` | Contenu structuré complet d'une page |
| `search_site` | Recherche textuelle dans les contenus français ou anglais |
| `get_booking_links` | Liens officiels Airbnb et Booking.com |

Les mêmes contenus sont également publiés sous forme de ressources MCP avec des
URI du type `site://la-maison-vigneronne/fr/pages/chateaux`.

## Sécurité et périmètre

- le serveur ne propose aucun outil d'écriture ;
- il n'accède ni à Decap CMS, ni à GitHub, ni aux secrets du VPS ;
- il ne publie pas l'adresse privée du logement ;
- les en-têtes `Host` et `Origin` sont contrôlés contre le domaine de production
  et les adresses locales de développement ;
- les corps de requête sont limités à 64 Kio et les abonnements simultanés à 32 ;
- les outils sont annotés comme non destructifs, idempotents et en lecture seule.

## Tester localement

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test:mcp
pnpm build
```

Le test ouvre un vrai serveur HTTP temporaire, connecte le client officiel MCP,
liste les outils, appelle `get_page` et lit une ressource. Il ne dépend pas du VPS.

## NGINX

La configuration actuelle qui transmet déjà `location /` vers Node.js couvre
automatiquement `/mcp`. Si NGINX utilise des blocs plus restrictifs, ajoutez :

```nginx
location /mcp {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 300s;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Rechargez NGINX seulement si ce bloc est nécessaire :

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Publication automatique

Le workflow `.github/workflows/deploy.yml` exécute désormais, dans cet ordre :

1. installation reproductible avec le fichier `pnpm-lock.yaml` ;
2. contrôle TypeScript ;
3. tests MCP ;
4. construction complète du client et du serveur ;
5. connexion SSH au VPS uniquement si tous les contrôles réussissent ;
6. mise à jour de `main`, reconstruction et redémarrage PM2 ;
7. vérification des routes `/health` et `/mcp/info` depuis le VPS.

Un clic sur **Publier** dans Decap crée un commit GitHub sur `main`. Ce commit
déclenche donc le même workflow sans commande SSH manuelle.

