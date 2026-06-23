/**
 * activityLog.ts — Mencatat aktivitas Operator Desa ke koleksi
 * bersama 'kec_activities', supaya Admin Kecamatan dapat melihatnya
 * langsung di "Dashboard Eksekutif Kecamatan" (Rekap Aktivitas Swadaya).
 */

import { apiGet, apiPut } from './api';
import type { Activity } from '../types';

function formatTanggalSekarang(): string {
  const now = new Date();
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
}

export async function logActivity(entry: Omit<Activity, 'id' | 'time' | 'date'>): Promise<void> {
  try {
    let current: Activity[] = [];
    try {
      current = await apiGet<Activity[]>('kec_activities');
      if (!Array.isArray(current)) current = [];
    } catch {
      current = [];
    }

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      time: 'Baru saja',
      date: formatTanggalSekarang(),
      ...entry,
    };

    await apiPut('kec_activities', [newActivity, ...current]);
  } catch {
    /* server lokal belum aktif — pencatatan aktivitas dilewati, tidak menghentikan aksi utama */
  }
}
