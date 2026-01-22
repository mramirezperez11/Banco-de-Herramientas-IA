# Modelo de datos

## Entidades principales
- **users**: compradores, organizadores y administradores.
- **events**: eventos con aforo general y precio por ticket.
- **orders**: reserva transaccional y estado del pago.
- **tickets**: QR único por ticket emitido.
- **validations**: registro de validación en puerta.

## Relacionamiento
- `users (organizer)` -> `events` (1:N)
- `users (buyer)` -> `orders` (1:N)
- `events` -> `orders` (1:N)
- `orders` -> `tickets` (1:N)
- `tickets` -> `validations` (1:1)

## Reglas de negocio soportadas
- Emisión de tickets solo tras pago confirmado (`orders.status = paid`).
- Control de aforo vía suma de órdenes `pending` y `paid`.
- QR único con estado `issued`/`validated` para single-use.
