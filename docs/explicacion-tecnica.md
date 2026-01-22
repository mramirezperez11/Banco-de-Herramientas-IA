# Explicación técnica del MVP

## Backend (Node.js + Express)
- **Autenticación:** JWT con roles (`buyer`, `organizer`, `admin`).
- **Eventos:** creación por organizadores y consulta pública.
- **Órdenes:** creación en estado `pending` con transacción para reservar aforo.
- **Webhook pagos:** confirma el pago y emite tickets con QR único.
- **Validación:** endpoint que marca ticket como `validated` para evitar reuso.

## Frontend (Next.js + Tailwind)
- **Home:** presenta el MVP y resume flujo de compra, validaciones y paneles.
- **Login:** formulario de registro e inicio de sesión con almacenamiento de JWT en el navegador.
- **Compra:** reserva cupos, simula checkout y confirma webhook para emitir tickets.
- **Tickets:** listado de entradas emitidas por el usuario comprador.
- **Integración API:** base URL configurable por `NEXT_PUBLIC_API_BASE_URL`.

## Base de datos (PostgreSQL)
- **Transacciones ACID:** uso de `BEGIN/COMMIT` y `SELECT ... FOR UPDATE`.
- **Integridad:** constraints y llaves foráneas para relaciones.

## Comisión
La comisión estándar está implementada como 8% sobre el subtotal más ₡350 por ticket.
