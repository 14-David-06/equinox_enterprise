This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Seguridad: prevención de secretos en el repo

Este repositorio incluye reglas para detectar secretos accidentalmente commiteados.

- Pre-commit: Husky + gitleaks bloquean commits que contienen claves/secretos.
- CI: workflow de GitHub Actions ejecuta gitleaks en Pull Requests y falla si detecta secretos.

Para instalar y usar localmente:

```bash
# instalar hooks de husky (solo una vez en la máquina del dev)
npm run prepare

# para probar manualmente el escaneo en staged files
npm run scan:secrets
```

Si se detectan secretos, revoca la clave inmediatamente y reemplázala por una variable de entorno o un secret manager (Vercel / GitHub Secrets / Doppler / 1Password).

### Tokens y variables necesarias

En producción debes configurar estas variables en Vercel (o la plataforma que uses):

- TURSO_DATABASE_URL (libsql url)
- TURSO_AUTH_TOKEN (token generado en Turso)
- AUTH_SECRET (secreto para firmar JWTs)

### Desarrollo y endpoints de apoyo

Hay dos endpoints diseñados solo para desarrollo que **no** deben quedar abiertos en producción:

- `POST /api/setup` — crea las tablas en la base de datos (ejecutar 1 vez en dev)
- `POST /api/auth/seed` — crea un usuario de prueba (cédula `123456789`, password `1234`)

Ambos endpoints están protegidos para ambiente de producción. Si realmente necesitas habilitarlos en un entorno remoto, usa la variable de entorno `ENABLE_DEV_ENDPOINTS=true` (no recomendado en producción).

### Sesiones y Refresh Tokens

Implementamos JWT de acceso (corto plazo) y Refresh Tokens (rotados, guardados en la base de datos) para mantener la sesión segura y persistente:

- `token` (cookie HttpOnly) — access token, corta duración (ej. 15 minutos)
- `refreshToken` (cookie HttpOnly) — identificador + valor, rotado en cada uso y almacenado hashed en la DB (ej. 30 días)

El servidor maneja la rotación segura del refresh token cuando se usa `POST /api/auth/refresh` y `GET /api/auth/me` intentará refrescar automáticamente cuando el access token haya expirado.

No metas valores reales en `.env` dentro del repo — usa `.env.example` como plantilla.
