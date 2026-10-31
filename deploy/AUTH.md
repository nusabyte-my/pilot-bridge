# Authentication and roles

## Modes

| Mode | Configuration | Behavior |
|---|---|---|
| Demo | `PILOTBRIDGE_DEMO=true` | No login; fictional data only |
| Secured | unset or `false` | Signed session required for every page and mutation |

Production must **not** use demo mode with real corporate data.

## Required secrets

```env
AUTH_SECRET=<at least 32 random characters>
AUTH_USERS=[{"email":"...","role":"Programme manager","userId":"user-aisha","organisationId":"org-meridian","salt":"...","hash":"..."}]
```

Generate a password hash with:

```bash
node -e "const {randomBytes,scryptSync}=require('crypto');const salt=randomBytes(16).toString('hex');console.log(JSON.stringify({salt,hash:scryptSync(process.argv[1],salt,64).toString('hex')}))" 'your-strong-password'
```

Store the output in `AUTH_USERS`; never commit it.

## Roles

- **Programme manager:** all screens; only role allowed to reset the demo.
- **Corporate:** challenges, matching, charters, POC review and outcomes.
- **Startup:** marketplace, POC execution and profile; blocked from corporate-only mutations and challenge pages.

The middleware enforces page access; the operation endpoint independently enforces mutation roles. UI controls are not the security boundary.

## Session design

- HMAC-SHA256 signed payload, timing-safe comparison
- HTTP-only, `SameSite=Lax`, `Secure` in production
- 8-hour expiry
- Login limited to six attempts per minute per IP
- Passwords stored as scrypt hashes with per-user salt

## Deployment

```bash
ssh ecta-vps
cd /opt/pilotbridge
chmod 600 .env.production
# set AUTH_SECRET and AUTH_USERS; remove PILOTBRIDGE_DEMO or set false
docker compose -f docker-compose.production.yml up -d --force-recreate pilotbridge
```

Verify `/` redirects to `/login`, a bad password returns 401, and a Startup session cannot call `POST /api/reset`.
