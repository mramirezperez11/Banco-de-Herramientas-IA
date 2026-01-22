"use client";

import { useEffect, useState } from 'react';
import { ticketsApi } from '../../lib/api';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await ticketsApi.list();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadTickets();
  }, []);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Mis tickets</h2>
        <p className="mt-2 text-sm text-slate-600">
          Aquí puedes visualizar tus entradas emitidas después del pago.
        </p>
      </header>

      {tickets.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{ticket.event_name}</h3>
              <p className="mt-2 text-sm text-slate-600">QR: {ticket.qr_code}</p>
              <p className="mt-1 text-sm text-slate-600">Estado: {ticket.status}</p>
              <p className="mt-1 text-sm text-slate-600">
                Fecha: {new Date(ticket.start_time).toLocaleString('es-CR')}
              </p>
              <p className="mt-1 text-sm text-slate-600">Lugar: {ticket.venue}</p>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
          No hay tickets emitidos todavía.
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
