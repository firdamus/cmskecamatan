/**
 * useSyncedState — pengganti langsung (drop-in replacement) untuk
 * `useState(NILAI_AWAL)`, tapi datanya disimpan & dibagi lewat
 * Data Server Lokal (data-server/), sehingga:
 *
 *   - Dashboard Admin Kecamatan dan Dashboard Operator Desa otomatis
 *     melihat data yang sama (karena sama-sama membaca/menulis ke
 *     server yang sama), bukan lagi data bawaan (dummy) yang terpisah
 *     tiap kali halaman dibuka.
 *   - Perubahan yang disimpan tidak akan hilang saat halaman di-refresh.
 *
 * Cara pakai (persis seperti useState biasa):
 *
 *   const [villages, setVillages] = useSyncedState<Village[]>('kec_villages', VILLAGES_DATA);
 *
 * Jika Data Server Lokal belum/tidak dijalankan, hook ini otomatis
 * "jatuh kembali" (fallback) memakai nilai awal yang dikirim, sehingga
 * aplikasi tetap bisa dipakai seperti biasa tanpa error.
 */

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { apiGet, apiPut } from './api';

interface SyncedStateOptions {
  /** Jika true, hook hanya membaca dari server, tidak pernah menulis balik. */
  readOnly?: boolean;
  /** Interval cek pembaruan dari server (ms). 0 = jangan polling berkala. */
  pollMs?: number;
}

export function useSyncedState<T>(
  key: string,
  initialValue: T,
  options: SyncedStateOptions = {}
): [T, Dispatch<SetStateAction<T>>] {
  const { readOnly = false, pollMs = 4000 } = options;
  const [state, setState] = useState<T>(initialValue);

  // Penanda: apakah kita sudah pernah berhasil memuat (atau mencoba memuat)
  // data dari server minimal satu kali. Sebelum ini true, kita TIDAK boleh
  // menulis balik ke server (supaya tidak menimpa data server dengan nilai
  // bawaan/dummy sesaat sebelum data asli selesai dimuat).
  const hasAttemptedLoadRef = useRef(false);
  // Penanda: lewati satu siklus "simpan ke server" berikutnya karena
  // perubahan state berasal dari hasil memuat data server itu sendiri
  // (bukan dari aksi pengguna), supaya tidak terjadi tulis-baca berulang.
  const skipNextPersistRef = useRef(false);

  // ── Muat data dari server saat pertama kali render, lalu cek berkala ──
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await apiGet<T>(key);
        if (!cancelled) {
          skipNextPersistRef.current = true;
          setState(data);
        }
      } catch {
        // Server lokal belum menyala atau key belum ada di server.
        // Tidak apa-apa — tetap pakai nilai yang sedang berjalan saat ini.
      } finally {
        hasAttemptedLoadRef.current = true;
      }
    };

    load();

    if (pollMs > 0) {
      const interval = setInterval(load, pollMs);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // ── Simpan ke server setiap kali state berubah karena aksi pengguna ──
  useEffect(() => {
    if (readOnly) return;
    if (!hasAttemptedLoadRef.current) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      apiPut(key, state).catch(() => {
        // Server lokal belum/tidak menyala — perubahan tetap tampil di
        // layar ini, hanya belum tersinkron ke aplikasi lain.
      });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, key, readOnly]);

  return [state, setState];
}
