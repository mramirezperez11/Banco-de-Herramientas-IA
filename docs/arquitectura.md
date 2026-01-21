# Arquitectura MVP FRP Digital Tickets S.R.L.

## Visión general
- **Frontend:** Next.js + Tailwind CSS para la experiencia de compra y paneles de usuarios.
- **Backend:** Node.js + Express con API REST para autenticación, eventos, órdenes, tickets y validaciones.
- **Base de datos:** PostgreSQL con transacciones ACID y bloqueo pesimista para evitar sobreventa.
- **Pasarela de pago:** Integración externa simulada vía webhook que confirma pagos y activa la emisión de tickets.

## Componentes
1. **Cliente Web (Next.js)**
   - Páginas de información de eventos, flujo de compra y paneles básicos.
   - Consume la API REST del backend.

2. **API REST (Express)**
   - Endpoints para registro/login, gestión de eventos, órdenes y tickets.
   - Webhook de pagos que autoriza la emisión de tickets.
   - Middleware JWT para controlar roles (buyer, organizer, admin).

3. **Persistencia (PostgreSQL)**
   - Tablas para usuarios, eventos, órdenes, tickets y validaciones.
   - Transacciones para reservar cupos y emitir tickets.

## Flujos críticos
- **Creación de orden y reserva de cupos:**
  - Se bloquea la fila del evento con `FOR UPDATE`.
  - Se valida el aforo disponible y se crea la orden en estado `pending`.
- **Confirmación de pago:**
  - El webhook marca la orden como `paid` y genera los tickets con QR único.
- **Validación en puerta:**
  - El ticket se bloquea y se marca como `validated`, evitando reuso.

## Escalabilidad y seguridad
- Escalamiento horizontal del backend detrás de un balanceador.
- Indexación en tablas críticas para lectura rápida.
- JWT con expiración y roles para seguridad.
