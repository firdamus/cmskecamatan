/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Village {
  id: string; // Kode Desa
  name: string;
  officeAddress: string;
  headName: string;
  webStatus: 'Aktif' | 'Draft' | 'Belum';
  dataStatus: 'Lengkap' | 'Belum Lengkap' | 'Perlu Diperbarui';
  webUrl?: string;
  lastUpdate?: string;
  areaHa: number;
  boundaries: {
    north: string;
    south: string;
    west: string;
    east: string;
  };
  geographicalInfo: string;
  history: string;
  vision: string;
  missions: string[];
}

export interface Activity {
  id: string;
  villageName: string;
  type: string; // "Berita Baru" | "Update Profil" | "Produk Baru" | etc.
  detail: string;
  time: string; // E.g., "2 jam lalu"
  category: 'Pertanian' | 'Pemerintahan' | 'Kesehatan' | 'Ekonomi' | 'Budaya' | 'Infrastruktur' | 'Lingkungan' | 'Keuangan';
  status: 'Terbit' | 'Draft' | 'Arsip' | 'Perlu Diperbarui';
  date: string; // E.g., "10 Jun 2025"
}

export interface Commodity {
  id: string;
  name: string;
  category: 'Pertanian' | 'Perkebunan' | 'Peternakan' | 'Perikanan' | 'UMKM' | 'Kerajinan';
  villageName: string;
  estProduction: string; // E.g., "450 ton/thn"
  areaUnit: string; // E.g., "380 Ha" or "45 kolam"
  status: 'Unggulan' | 'Biasa';
  period: string;
  description: string;
  otherVillages: string[];
}

export interface Official {
  id: string;
  name: string;
  position: string;
  phone: string;
  address: string;
  period: string; // E.g. "2021-2027"
  status: 'Aktif' | 'Nonaktif' | 'Habis Masa Jabatan' | 'Pindah' | 'Meninggal';
  villageName: string;
  level: 1 | 2 | 3 | 4; // levels for hierarchy visual: 1 (Kades), 2 (Sekdes), 3 (Kaur/Kasi), 4 (Kadus)
  initials: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  sellerName: string;
  whatsapp: string;
  villageName: string;
  stockStatus: 'Tersedia' | 'Terbatas' | 'Kosong' | 'Tidak Aktif';
  isFeatured: boolean;
  description: string;
  category: 'Makanan Olahan' | 'Minuman' | 'Hasil Pertanian' | 'Kerajinan Tangan' | 'Hasil Perikanan' | 'Hasil Peternakan' | 'Jasa' | 'Lainnya';
  releaseDate?: string;
}

export interface Asset {
  id: string;
  name: string;
  villageName: string;
  location: string;
  type: 'Tanah' | 'Bangunan' | 'Inventaris';
  dimensionOrQuantity: string; // 2.50 Ha, 10 Unit, etc.
  ownershipOrYear: string; // "Milik Desa", "2010", etc.
  currentUseOrType: string; // "Pertanian", "Permanen", "Laptop", etc.
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Perlu Perbaikan' | 'Diperbaiki';
  status: 'Aktif' | 'Tidak Aktif' | 'Perlu Perbaikan' | 'Diperbaiki';
  hasDoc: boolean;
  docNumber?: string;
  docDate?: string;
  docType?: 'Sertifikat' | 'Foto Aset' | 'Berita Acara' | 'Surat Kepemilikan' | 'Dokumen Inventaris' | 'Lainnya';
  docNote?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Operator';
  villageName: string; // "Semua Desa" or e.g., "Sukamaju"
  status: 'Aktif' | 'Nonaktif';
  lastActive: string;
  initials: string;
}

export interface UserLog {
  id: string;
  time: string;
  user: string;
  role: 'Admin' | 'Operator';
  action: 'Login' | 'Lihat Data' | 'Tambah Data' | 'Edit Data' | 'Hapus Data' | 'Login Gagal';
  module: string;
  detail: string;
  ipAddress: string;
}
