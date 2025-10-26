const API_BASE = process.env.REACT_APP_API_URL || '/api';

export async function apiLogin(key: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiSendCommand(target: string, serverId: string) {
  const res = await fetch(`${API_BASE}/command/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` },
    body: JSON.stringify({ target, serverId })
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiGetKeys() {
  const res = await fetch(`${API_BASE}/keys`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` }
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiCreateKey(payload) {
  const res = await fetch(`${API_BASE}/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiDeleteKey(id) {
  const res = await fetch(`${API_BASE}/keys/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` }
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiGetServers() {
  const res = await fetch(`${API_BASE}/servers`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` }
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiGetSettings() {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` }
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function apiGetHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('vely_key') || ''}` }
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}
