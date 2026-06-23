/**
 * Klien sederhana untuk berbicara dengan "Data Server Lokal"
 * (folder data-server/ di root proyek). Server ini berjalan di
 * komputer yang sama (http://localhost:4000) — tidak perlu internet.
 *
 * Semua fungsi di sini "aman gagal": jika data-server belum dijalankan,
 * aplikasi tetap berjalan normal memakai data bawaan (dummy), hanya saja
 * belum tersinkron ke aplikasi lain sampai server dinyalakan.
 */

export const API_BASE = 'http://localhost:4000/api';

export async function apiGet<T>(key: string): Promise<T> {
  const res = await fetch(`${API_BASE}/data/${encodeURIComponent(key)}`);
  if (!res.ok) {
    throw new Error(`apiGet(${key}) gagal: status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPut<T>(key: string, value: T): Promise<void> {
  const res = await fetch(`${API_BASE}/data/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
  if (!res.ok) {
    throw new Error(`apiPut(${key}) gagal: status ${res.status}`);
  }
}
