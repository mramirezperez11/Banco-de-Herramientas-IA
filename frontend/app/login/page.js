"use client";

import { useState } from 'react';
import { authApi } from '../../lib/api';

const initialForm = { email: '', password: '', role: 'buyer' };

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const { token } = await authApi.login(loginForm);
      window.localStorage.setItem('frp_token', token);
      setMessage('Sesión iniciada. Ahora puedes comprar tickets.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await authApi.register(registerForm);
      setMessage('Cuenta creada. Inicia sesión para continuar.');
      setRegisterForm(initialForm);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Ingreso</h2>
        <p className="mt-2 text-sm text-slate-600">
          Usa tu correo y contraseña para acceder a la compra de entradas.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm({ ...loginForm, email: event.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Contraseña
            <input
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm({ ...loginForm, password: event.target.value })
              }
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-700 px-4 py-2 text-white"
          >
            Iniciar sesión
          </button>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold">Registro</h2>
        <p className="mt-2 text-sm text-slate-600">
          Crea una cuenta para compradores u organizadores.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm({ ...registerForm, email: event.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Contraseña
            <input
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm({ ...registerForm, password: event.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium">
            Rol
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={registerForm.role}
              onChange={(event) =>
                setRegisterForm({ ...registerForm, role: event.target.value })
              }
            >
              <option value="buyer">Comprador</option>
              <option value="organizer">Organizador</option>
            </select>
          </label>
          <button
            type="submit"
            className="w-full rounded-xl border border-brand-700 px-4 py-2 text-brand-700"
          >
            Crear cuenta
          </button>
        </form>
      </section>

      {(message || error) && (
        <div className="lg:col-span-2">
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {error || message}
          </div>
        </div>
      )}
    </div>
  );
}
