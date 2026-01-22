"use client";

import { useEffect, useState } from 'react';
import { checkoutApi, eventsApi } from '../../lib/api';

export default function CompraPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [webhookResponse, setWebhookResponse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventsApi.list();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    loadEvents();
  }, []);

  const handleHold = async () => {
    setError('');
    setCheckout(null);
    setWebhookResponse(null);
    try {
      const data = await eventsApi.hold(selectedEventId, Number(quantity));
      setOrder(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSimulateCheckout = async () => {
    setError('');
    try {
      const data = await checkoutApi.simulate(order.id);
      setCheckout(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmPayment = async () => {
    setError('');
    try {
      const data = await checkoutApi.confirmPayment({
        orderId: order.id,
        paymentReference: checkout.paymentReference,
        status: 'paid'
      });
      setWebhookResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Comprar entradas</h2>
        <p className="mt-2 text-sm text-slate-600">
          Selecciona un evento, reserva tu cupo y simula el pago antes de emitir los tickets.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium">
            Evento
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} · ₡{event.price_crc}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Cantidad
            <input
              type="number"
              min="1"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              className="w-full rounded-xl bg-brand-700 px-4 py-2 text-white"
              onClick={handleHold}
              disabled={!selectedEventId}
            >
              Reservar cupo
            </button>
          </div>
        </div>
      </section>

      {order && (
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Orden pendiente</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Orden:</span> {order.id}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Total:</span> ₡{order.amount_total}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Estado:</span> {order.status}
            </p>
          </div>
          <button
            type="button"
            className="mt-4 rounded-xl border border-brand-700 px-4 py-2 text-brand-700"
            onClick={handleSimulateCheckout}
          >
            Simular checkout
          </button>
        </section>
      )}

      {checkout && (
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Checkout simulado</h3>
          <p className="mt-2 text-sm text-slate-600">
            Usa el botón para disparar el webhook que confirma el pago.
          </p>
          <div className="mt-4 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Referencia:</span>{' '}
              {checkout.paymentReference}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Monto:</span> ₡{checkout.amountTotal}
            </p>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-white"
            onClick={handleConfirmPayment}
          >
            Confirmar pago (webhook)
          </button>
        </section>
      )}

      {webhookResponse && (
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Tickets emitidos</h3>
          <p className="mt-2 text-sm text-slate-600">
            Se emitieron {webhookResponse.tickets.length} tickets con QR único. Visítalos en el
            panel de tickets.
          </p>
          <a
            href="/tickets"
            className="mt-4 inline-flex rounded-xl border border-brand-700 px-4 py-2 text-brand-700"
          >
            Ver mis tickets
          </a>
        </section>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
