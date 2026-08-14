# SUBVERSE

**Tous tes abonnements. Un seul univers.**

Site concept consacré aux abonnements numériques, monnaies virtuelles et services en ligne.
**Démonstration uniquement** : prix fictifs, aucun achat réel, aucune donnée transmise à un tiers.
Les marques citées appartiennent à leurs détenteurs respectifs.

## Lancer

```bash
node server.js        # http://localhost:3000
```

Aucune dépendance (Node ≥ 18). Le serveur sert le site statique **et** l'API JSON.

## Contenu

- **7 univers / salles** : gaming, social, streaming, musique, création, IA, cloud — 56 services, ~200 packs.
- **Parcours en 3 étapes identique partout** : `1. Pack → 2. Compte → 3. Validation`
  (validation différente selon le service : SMS, email, QR code, billet numérique, lien d'activation,
  code promotionnel, bibliothèque, statut en attente).
- **Outils** : constructeur de bundle (coûts mensuel/annuel, économie, renouvellement), mode cadeau,
  comparateur (max 4), budget intelligent (roue), favoris (« Mes prochains abonnements »),
  quiz de recommandation, roulette « Surprends-moi ».
- **Console ops** (`#/ops`) : flux temps réel façon bot Discord avec données masquées
  (`06••••••78`, `a•••@mail.fr`), stats, suivi de référence.
- Accessibilité : mode mouvement réduit (auto + interrupteur), clavier complet, ARIA de base.

## API

| Méthode | Endpoint | Rôle |
| --- | --- | --- |
| GET | `/api/services`, `/api/services/:id` | catalogue |
| GET | `/api/categories` | univers |
| GET | `/api/plans/:service` | packs d'un service |
| GET | `/api/status/:reference` | suivi d'un parcours |
| GET | `/api/events`, `/api/stats`, `/api/health` | flux bot, stats, santé |
| POST | `/api/selection` | termine un parcours (génère `SUB-XXXXX`) |
| POST | `/api/favorites`, `/api/compare`, `/api/events`, `/api/contact` | favoris, comparateur, télémétrie, contact |

## Structure

```
server.js          serveur statique + API (zéro dépendance)
index.html         coquille SPA (header, recherche, dock, transition de salle)
assets/data.js     catalogue : 7 catégories, 56 services, packs, quiz, presets
assets/fx.js       moteur canvas (galaxie, cubes, portails, tunnel, vinyle, radar…)
assets/app.js      routeur hash, pages, parcours, bundle, cadeau, ops…
assets/style.css   design system complet + responsive + reduced-motion
assets/img/        visuels générés (hero + 7 salles)
```
