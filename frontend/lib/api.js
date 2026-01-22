export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  const token = window.localStorage.getItem('frp_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Error en la solicitud');
  }
  return payload;
};

export const authApi = {
  register: (data) =>
    fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  login: (data) =>
    fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

export const eventsApi = {
  list: () => fetchJson('/api/events'),
  hold: (eventId, quantity) =>
    fetchJson(`/api/events/${eventId}/hold`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    })
};

export const checkoutApi = {
  simulate: (orderId) =>
    fetchJson('/api/checkout/simulate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId })
    }),
  confirmPayment: (payload) =>
    fetchJson('/api/webhooks/payments', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export const ticketsApi = {
  list: () =>
    fetchJson('/api/tickets', {
      headers: getAuthHeaders()
    })
};

export const ordersApi = {
  get: (orderId) =>
    fetchJson(`/api/orders/${orderId}`, {
      headers: getAuthHeaders()
    })
};
