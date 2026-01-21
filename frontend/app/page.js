import DashboardCard from '../components/DashboardCard';
import FeatureList from '../components/FeatureList';
import { apiBaseUrl } from '../lib/config';

const quickLinks = [
  {
    title: 'Compra segura',
    description: 'Venta de entradas con confirmación de pago por webhook y QR único.',
    link: '#comprar'
  },
  {
    title: 'Control de aforo',
    description: 'Evita doble venta mediante reservas transaccionales en PostgreSQL.',
    link: '#eventos'
  },
  {
    title: 'Panel organizadores',
    description: 'Crea eventos y consulta ventas en tiempo real.',
    link: '#organizador'
  }
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-white p-10 shadow-sm">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-700">MVP funcional</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Plataforma para venta de entradas digitales en Costa Rica
            </h2>
            <p className="mt-4 text-slate-600">
              Conecta el frontend en Next.js con el backend en Node/Express y PostgreSQL para gestionar
              eventos con aforo general, pagos externos y validación en puerta.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-700">
                API REST en {apiBaseUrl}
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                Comisión 8% + ₡350 por ticket
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {quickLinks.map((item) => (
              <DashboardCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="eventos" className="grid gap-6 md:grid-cols-3">
        <FeatureList
          title="Eventos activos"
          items={[
            'Listar eventos disponibles',
            'Mostrar aforo restante en tiempo real',
            'Precios en colones costarricenses'
          ]}
        />
        <FeatureList
          title="Tickets digitales"
          items={[
            'QR único por ticket',
            'Entrega solo tras pago confirmado',
            'Estado de uso en puerta'
          ]}
        />
        <FeatureList
          title="Operación segura"
          items={[
            'Transacciones ACID en PostgreSQL',
            'Bloqueo de aforo por orden',
            'Auditoría de validaciones'
          ]}
        />
      </section>

      <section id="comprar" className="rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold">Flujo de compra MVP</h3>
        <ol className="mt-4 space-y-3 text-slate-600">
          <li>1. Selecciona evento y cantidad de entradas.</li>
          <li>2. Se crea una orden en estado pendiente y se redirige a la pasarela de pago.</li>
          <li>3. El webhook confirma el pago y emite los QR únicos.</li>
          <li>4. El usuario visualiza sus tickets en el panel.</li>
        </ol>
      </section>

      <section id="organizador" className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Acciones para organizadores</h3>
          <ul className="mt-4 space-y-2 text-slate-600">
            <li>• Crear eventos con aforo general y precio por ticket.</li>
            <li>• Revisar ventas y tickets emitidos.</li>
            <li>• Consultar liquidaciones por evento.</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold">Panel administrativo</h3>
          <ul className="mt-4 space-y-2 text-slate-600">
            <li>• Ver transacciones y estados de órdenes.</li>
            <li>• Monitorear validaciones en puerta.</li>
            <li>• Gestionar liquidaciones y comisiones.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
