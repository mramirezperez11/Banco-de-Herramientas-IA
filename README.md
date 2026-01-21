# FRP Digital Tickets S.R.L.

MVP para plataforma de venta de entradas digitales en Costa Rica, con eventos de aforo general y validación por QR.

## Estructura
- `frontend/`: Next.js + Tailwind CSS.
- `backend/`: Node.js + Express (API REST).
- `db/`: scripts SQL de esquema y datos de prueba.
- `docs/`: arquitectura, modelo de datos y explicación técnica.

## Requisitos
- Node.js 18+
- PostgreSQL 14+

## Inicio rápido

### Base de datos
```bash
psql -d frp_tickets -f db/schema.sql
psql -d frp_tickets -f db/seed.sql
```

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Documentación
- Arquitectura: `docs/arquitectura.md`
- Modelo de datos: `docs/modelo-datos.md`
- Explicación técnica: `docs/explicacion-tecnica.md`
