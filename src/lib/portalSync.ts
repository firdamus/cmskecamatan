/**
 * portalSync.ts — Jembatan satu-arah dari SCOPE Kecamatan menuju
 * Portal Desa Rejosari (website publik).
 *
 * Komponen Operator Desa memanggil fungsi-fungsi `publish...` di sini
 * setiap kali data Desa Rejosari berubah (profil, perangkat, produk
 * lapak, berita). Fungsi ini akan:
 *
 *   1. Mengubah bentuk data dari "bentuk kecamatan" ke "bentuk portal"
 *      (nama field memang berbeda di kedua aplikasi).
 *   2. Mengirimkannya ke Data Server Lokal pada koleksi yang dibaca
 *      langsung oleh Portal Rejosari (mis. koleksi 'pejabat', 'berita',
 *      'lapak_produk', dst).
 *
 * Hanya data milik Desa Rejosari yang dipublikasikan ke portal (desa
 * lain di kecamatan belum punya situs portal sendiri pada paket ini).
 *
 * Semua fungsi ini "aman gagal": kalau Data Server Lokal belum menyala,
 * publikasi akan dicoba lagi otomatis nanti (lewat efek di komponen)
 * dan tidak akan membuat aplikasi error.
 */

import { apiGet, apiPut } from './api';
import type { Village, Product } from '../types';

const PORTAL_VILLAGE = 'Rejosari';
const SOURCE_TAG = 'operator_desa';

/* ────────────────────────────────────────────────────────────────
   Util kecil
   ──────────────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'item';
}

/** Ambil koleksi portal saat ini, buang kontribusi lama dari Operator
 * Desa untuk desa yang sama, lalu gabungkan dengan data baru. Dengan
 * begitu data bawaan (seed) Portal Rejosari tidak pernah hilang/dobel,
 * dan setiap publikasi baru menggantikan publikasi lama dari desa yang
 * sama (bukan menumpuk terus-menerus).
 */
async function mergeAndPublish<T extends { id: string }>(
  collectionKey: string,
  freshItemsFromVillage: (T & { source?: string; villageName?: string })[],
  villageName: string
): Promise<void> {
  let current: (T & { source?: string; villageName?: string })[] = [];
  try {
    current = await apiGet<(T & { source?: string; villageName?: string })[]>(collectionKey);
    if (!Array.isArray(current)) current = [];
  } catch {
    current = [];
  }

  const kept = current.filter(
    (item) => !(item.source === SOURCE_TAG && item.villageName === villageName)
  );

  const merged = [...freshItemsFromVillage, ...kept];
  await apiPut(collectionKey, merged);
}

/* ────────────────────────────────────────────────────────────────
   1) Profil Desa  ->  koleksi 'profil_desa' (objek tunggal)
   ──────────────────────────────────────────────────────────────── */

export async function publishVillageProfile(villages: Village[]): Promise<void> {
  const rejosari = villages.find((v) => v.name === PORTAL_VILLAGE);
  if (!rejosari) return;
  try {
    await apiPut('profil_desa', rejosari);
  } catch {
    /* server lokal belum aktif — tidak apa-apa, dicoba lagi nanti */
  }
}

/* ────────────────────────────────────────────────────────────────
   2) Perangkat / Staf Desa  ->  koleksi 'pejabat'
   ──────────────────────────────────────────────────────────────── */

export interface StafKecamatan {
  id: string;
  nama: string;
  jabatan: string;
  nip: string;
  telp: string;
  alamat: string;
  tmt: string;
  status: string;
  desa: string;
  badge: string;
}

function badgeToPejabatType(badge: string): 'Pimpinan' | 'Kasi / Kaur' | 'Kepala Dusun' | 'Staf' {
  switch (badge) {
    case 'Pimpinan':
      return 'Pimpinan';
    case 'Sekretariat':
      return 'Pimpinan';
    case 'Pelaksana':
      return 'Kasi / Kaur';
    case 'Kewilayahan':
      return 'Kepala Dusun';
    default:
      return 'Staf';
  }
}

function avatarUrl(name: string, bg = '10b981'): string {
  return `https://ui-avatars.com/api/?background=${bg}&color=fff&bold=true&name=${encodeURIComponent(name)}`;
}

export async function publishPerangkatDesa(stafList: StafKecamatan[]): Promise<void> {
  const stafRejosari = stafList.filter((s) => s.desa === PORTAL_VILLAGE && s.status === 'Aktif');

  const adapted = stafRejosari.map((s) => ({
    id: `op_${s.id}`,
    name: s.nama,
    position: s.jabatan,
    type: badgeToPejabatType(s.badge),
    image: avatarUrl(s.nama),
    contact: s.telp && s.telp !== '-' ? s.telp : '-',
    profile: `${s.jabatan} Desa ${s.desa}, menjabat sejak ${s.tmt}.`,
    source: SOURCE_TAG,
    villageName: PORTAL_VILLAGE,
  }));

  try {
    await mergeAndPublish('pejabat', adapted, PORTAL_VILLAGE);
  } catch {
    /* server lokal belum aktif — tidak apa-apa, dicoba lagi nanti */
  }
}

/* ────────────────────────────────────────────────────────────────
   3) Komoditas / Produk Lapak  ->  koleksi 'lapak_produk' + 'lapak_pelapak'
   ──────────────────────────────────────────────────────────────── */

const PRODUCT_PHOTOS_BY_CATEGORY: Record<string, string> = {
  'Makanan Olahan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=70',
  Minuman: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=70',
  'Hasil Pertanian': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=70',
  'Kerajinan Tangan': 'https://images.unsplash.com/photo-1528283648649-33347faa5d9e?w=500&q=70',
  'Hasil Perikanan': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=70',
  'Hasil Peternakan': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&q=70',
  Jasa: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=70',
  Lainnya: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=70',
};

function parsePriceString(price: string): { amount: number; unit: string } {
  // Contoh masukan: "Rp 12.000/kg" atau "Rp 250.000/lembar"
  const numMatch = price.replace(/[^0-9]/g, '');
  const amount = numMatch ? parseInt(numMatch, 10) : 0;
  const unitMatch = price.split('/')[1] || 'pcs';
  return { amount, unit: unitMatch.trim() };
}

export async function publishLapakProduk(products: Product[]): Promise<void> {
  const productsRejosari = products.filter(
    (p) => p.villageName === PORTAL_VILLAGE && p.stockStatus !== 'Tidak Aktif'
  );

  const adaptedProducts: any[] = [];
  const pelapakMap = new Map<string, any>();

  for (const p of productsRejosari) {
    const pelapakId = `op_pelapak_${slugify(p.sellerName)}`;
    if (!pelapakMap.has(pelapakId)) {
      pelapakMap.set(pelapakId, {
        id: pelapakId,
        name: p.sellerName,
        phone: p.whatsapp,
        address: `Desa ${p.villageName}`,
        avatar: avatarUrl(p.sellerName, '047857'),
        source: SOURCE_TAG,
        villageName: PORTAL_VILLAGE,
      });
    }

    const { amount, unit } = parsePriceString(p.price);
    adaptedProducts.push({
      id: `op_${p.id}`,
      name: p.name,
      price: amount,
      unit,
      isAvailable: p.stockStatus === 'Tersedia' || p.stockStatus === 'Terbatas',
      description: p.description,
      image: PRODUCT_PHOTOS_BY_CATEGORY[p.category] || PRODUCT_PHOTOS_BY_CATEGORY.Lainnya,
      category: p.category,
      pelapakId,
      source: SOURCE_TAG,
      villageName: PORTAL_VILLAGE,
    });
  }

  try {
    await mergeAndPublish('lapak_pelapak', Array.from(pelapakMap.values()), PORTAL_VILLAGE);
    await mergeAndPublish('lapak_produk', adaptedProducts, PORTAL_VILLAGE);
  } catch {
    /* server lokal belum aktif — tidak apa-apa, dicoba lagi nanti */
  }
}

/* ────────────────────────────────────────────────────────────────
   4) Status Publikasi Berita  ->  koleksi 'berita'
   ──────────────────────────────────────────────────────────────── */

export interface PublikasiKecamatan {
  judul: string;
  desa: string;
  tgl: string;
  status: string;
  kategori: string;
}

const BERITA_PHOTOS = [
  'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=700&q=70',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=70',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=70',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=70',
];

export async function publishBerita(publikasiList: PublikasiKecamatan[]): Promise<void> {
  const terbitRejosari = publikasiList.filter(
    (p) => p.desa === PORTAL_VILLAGE && p.status === 'Terbit'
  );

  const adapted = terbitRejosari.map((p, idx) => ({
    id: `op_berita_${slugify(p.judul)}`,
    title: p.judul,
    description: `Publikasi resmi kategori ${p.kategori} dari Desa ${p.desa}.`,
    content: `Berita "${p.judul}" dipublikasikan oleh Operator Desa ${p.desa} melalui SCOPE Kecamatan pada ${p.tgl}. Konten lengkap berita ini dapat dilengkapi lebih lanjut oleh redaksi desa.`,
    image: BERITA_PHOTOS[idx % BERITA_PHOTOS.length],
    date: p.tgl,
    category: p.kategori,
    author: `Operator Desa ${p.desa}`,
    views: 0,
    source: SOURCE_TAG,
    villageName: PORTAL_VILLAGE,
  }));

  try {
    await mergeAndPublish('berita', adapted, PORTAL_VILLAGE);
  } catch {
    /* server lokal belum aktif — tidak apa-apa, dicoba lagi nanti */
  }
}
