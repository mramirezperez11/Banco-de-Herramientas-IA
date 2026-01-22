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

## Flujo funcional MVP
1. Abre `http://localhost:3000/login` y registra un comprador.
2. Inicia sesión para guardar el token JWT.
3. Ve a `http://localhost:3000/compra`, selecciona evento y reserva cupos.
4. Simula el checkout y confirma el pago para emitir tickets.
5. Visualiza los tickets emitidos en `http://localhost:3000/tickets`.

## Colección Postman
En `docs/postman/frp-digital-tickets.postman_collection.json` encontrarás la colección para validar el flujo end-to-end.

## Documentación
- Arquitectura: `docs/arquitectura.md`
- Modelo de datos: `docs/modelo-datos.md`
- Explicación técnica: `docs/explicacion-tecnica.md`
