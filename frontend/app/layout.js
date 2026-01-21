import './globals.css';

export const metadata = {
  title: 'FRP Digital Tickets S.R.L.',
  description: 'Venta de entradas digitales para eventos en Costa Rica.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <div className="bg-brand-700 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm uppercase tracking-widest">FRP Digital Tickets</p>
              <h1 className="text-xl font-semibold">Entradas digitales sin filas</h1>
            </div>
            <nav className="flex gap-4 text-sm">
              <a href="#eventos" className="hover:text-brand-50">Eventos</a>
              <a href="#comprar" className="hover:text-brand-50">Comprar</a>
              <a href="#organizador" className="hover:text-brand-50">Organizadores</a>
            </nav>
          </div>
        </div>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">
            © 2024 FRP Digital Tickets S.R.L. · Costa Rica
          </div>
        </footer>
      </body>
    </html>
  );
}
