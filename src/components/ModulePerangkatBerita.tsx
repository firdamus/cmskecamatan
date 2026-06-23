/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  UserCheck,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Trash2,
  CalendarDays
} from 'lucide-react';
import { motion } from 'motion/react';
import { OFFICIALS_DATA, ACTIVITIES_DATA, VILLAGES_DATA } from '../data/dummy';
import { Official, Activity } from '../types';

export interface OrgOfficial {
  id: string;
  name: string;
  position: string;
  phone: string;
  address: string;
  period: string;
  status: string;
  photoUrl: string;
  level: number; // 1: Kades, 2: Sekdes, 3: Kasi, 4: Kaur, 5: Kadus
  detail: string;
}

export const getVillageStaffList = (vName: string): OrgOfficial[] => {
  const normalized = vName.toLowerCase();
  const vMatch = VILLAGES_DATA.find((item) => item.name.toLowerCase() === normalized);
  const kadesName = vMatch ? vMatch.headName : 'Budi Santoso';

  if (normalized === 'mekarjaya') {
    return [
      {
        id: `${normalized}-off1`,
        name: kadesName,
        position: 'Kepala Desa',
        phone: '0812-7788-9900',
        address: `RT 01 RW 01 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
        level: 1,
        detail: 'Memimpin pelaksanaan administrasi perkebunan dan urusan kemasyarakatan Desa Mekarjaya.'
      },
      {
        id: `${normalized}-off2`,
        name: 'Agus Setiawan',
        position: 'Sekretaris Desa',
        phone: '0813-8899-0011',
        address: `RT 02 RW 01 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&h=200&q=80',
        level: 2,
        detail: 'Mengelola tata kearsipan, regulasi hasil bumi latex karet, dan kesekretariatan.'
      },
      {
        id: `${normalized}-off3`,
        name: 'Bambang Tri',
        position: 'Kasi Pemerintahan',
        phone: '0814-9900-1122',
        address: `RT 01 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Mengawal registrasi legalitas kepemilikan kebun, batas tanah perkebunan karet, dan administrasi pertanahan.'
      },
      {
        id: `${normalized}-off5`,
        name: 'M. Ridwan',
        position: 'Kasi Kesejahteraan (Kesra)',
        phone: '0815-1122-2233',
        address: `RT 03 RW 02 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Mengordinasikan program jaminan sosial masyarakat perkebunan dan distribusi pupuk subsidi.'
      },
      {
        id: `${normalized}-off6`,
        name: 'Rina Wijaya',
        position: 'Kaur Keuangan',
        phone: '0816-2233-3344',
        address: `RT 01 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Menyusun anggaran penyerapan APBDes Mekarjaya serta pembuatan laporan perpajakan sirkulasi BUMDes Karet.'
      },
      {
        id: `${normalized}-off7`,
        name: 'Deni Ramadhan',
        position: 'Kaur Umum & Tata Usaha',
        phone: '0817-3344-4455',
        address: `RT 02 RW 03 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Mengelola sarana balai pertemuan umum, fasilitas sanitasi desa, serta surat tugas operator desa.'
      },
      {
        id: `${normalized}-off9`,
        name: 'Slamet Ariyadi',
        position: 'Kepala Dusun I',
        phone: '0821-4455-5566',
        address: `Dusun I, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Ketertiban sosial dusun karet raya, sosialisasi program ketahanan pangan nabati.'
      },
      {
        id: `${normalized}-off10`,
        name: 'Kurniawan',
        position: 'Kepala Dusun II',
        phone: '0821-5566-6677',
        address: `Dusun II, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Koordinasi pemeliharaan jalan usaha tani ke perkebunan latex dan urusan kemasyarakatan dusun.'
      }
    ];
  }

  if (normalized === 'ciputat') {
    return [
      {
        id: `${normalized}-off1`,
        name: kadesName,
        position: 'Kepala Desa',
        phone: '0812-1111-2222',
        address: `RT 01 RW 01 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
        level: 1,
        detail: 'Memimpin pembangunan kawasan sentra peternakan unggas dan perikanan air payau Ciputat.'
      },
      {
        id: `${normalized}-off2`,
        name: 'Rudi Wijaya',
        position: 'Sekretaris Desa',
        phone: '0813-2222-3333',
        address: `RT 02 RW 01 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80',
        level: 2,
        detail: 'Mengoordinasikan pelaporan pembukuan dana BUMDes, arsip akta kependudukan, dan korespondensi dinas.'
      },
      {
        id: `${normalized}-off3`,
        name: 'M. Yusuf',
        position: 'Kasi Pemerintahan',
        phone: '0814-3333-4444',
        address: `RT 01 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Menyusun sertifikasi tanah rawa teratur, pendaftaran legalitas kepemilikan aset, dan administrasi kependudukan.'
      },
      {
        id: `${normalized}-off4`,
        name: 'Dewi Lestari',
        position: 'Kasi Pelayanan',
        phone: '0815-4444-5555',
        address: `RT 02 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Mengoordinir posyandu terpadu balita, bantuan kesehatan, dan pelestarian adat islami desa.'
      },
      {
        id: `${normalized}-off6`,
        name: 'Farida Utami',
        position: 'Kaur Keuangan',
        phone: '0816-5555-6666',
        address: `RT 01 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Mengelola tata pembukuan dana sirkulasi dinas, pencatatan pajak, dan program penyaluran subsidi.'
      },
      {
        id: `${normalized}-off7`,
        name: 'Anto Hermawan',
        position: 'Kaur Umum',
        phone: '0817-6666-7777',
        address: `RT 02 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Mengelola sarana fisik kandang desa, kendaraan dinas, serta kebersihan kantor sekretariat.'
      },
      {
        id: `${normalized}-off9`,
        name: 'Giring Saputra',
        position: 'Kepala Dusun I',
        phone: '0821-7777-8888',
        address: `Dusun I, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Mengawal kamtibmas warga, gotong royong saluran drainase, dan koordinasi sensus kemiskinan.'
      },
      {
        id: `${normalized}-off10`,
        name: 'Harto',
        position: 'Kepala Dusun II',
        phone: '0821-8888-9999',
        address: `Dusun II, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Menyusun laporan keamanan warga, pemantauan status jembatan penghubung rawa.'
      }
    ];
  }

  if (normalized === 'margaasih') {
    return [
      {
        id: `${normalized}-off1`,
        name: kadesName,
        position: 'Kepala Desa',
        phone: '0812-1010-1010',
        address: `RT 01 RW 01 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
        level: 1,
        detail: 'Kepala pemerintahan desa yang berkomitmen memajukan sentra UMKM keripik pisang nasional.'
      },
      {
        id: `${normalized}-off2`,
        name: 'Sofyan Hadi',
        position: 'Sekretaris Desa',
        phone: '0813-2020-2020',
        address: `RT 02 RW 01 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
        level: 2,
        detail: 'Mengelola perumusan kebijakan bersama, pembukuan korespondensi dikoordinir secara digital.'
      },
      {
        id: `${normalized}-off3`,
        name: 'Lukman Hakim',
        position: 'Kasi Pemerintahan',
        phone: '0814-3030-3030',
        address: `RT 01 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Menjalankan fungsi registrasi mutasi penduduk, administrasi aset dinas, berkas sengketa lahan.'
      },
      {
        id: `${normalized}-off4`,
        name: 'Siti Badriah',
        position: 'Kasi Pelayanan',
        phone: '0815-4040-4040',
        address: `RT 02 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Mengoordinasi pengembangan ketrampilan ibu-ibu PKK, gizi balita, dan bimbingan pranikah sanitasi.'
      },
      {
        id: `${normalized}-off6`,
        name: 'Linda Permata',
        position: 'Kaur Keuangan',
        phone: '0816-5050-5050',
        address: `RT 01 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Menata anggaran kas BUMDes Margaasih, pembukuan kas kecil, pembuatan kelengkapan kuitansi pengrajin.'
      },
      {
        id: `${normalized}-off7`,
        name: 'Hendra Setiawan',
        position: 'Kaur Umum',
        phone: '0817-6060-6060',
        address: `RT 02 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Urusan logistik pameran dagang produk pisang kepok, ketersediaan alat tulis, pemeliharaan gedung balai pertemuan.'
      },
      {
        id: `${normalized}-off9`,
        name: 'Ujang Slamet',
        position: 'Kepala Dusun I',
        phone: '0821-7070-7070',
        address: `Dusun I, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Penanggung jawab ketenteraman dan kebersihan lingkungan dusun agro-pisang.'
      }
    ];
  }

  if (normalized === 'cikaret') {
    return [
      {
        id: `${normalized}-off1`,
        name: kadesName,
        position: 'Kepala Desa',
        phone: '0812-4455-2233',
        address: `RT 01 RW 01 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
        level: 1,
        detail: 'Berkomitmen mengembangkan pelestarian hutan lindung tumpang sari penopang madu murni.'
      },
      {
        id: `${normalized}-off2`,
        name: 'Ahmad Jayadi',
        position: 'Sekretaris Desa',
        phone: '0813-5566-3344',
        address: `RT 02 RW 01 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
        level: 2,
        detail: 'Melaksanakan administrasi surat pengantar warga, monitoring operasional pos siaga kebakaran hutan.'
      },
      {
        id: `${normalized}-off3`,
        name: 'Aris Munandar',
        position: 'Kasi Pemerintahan',
        phone: '0814-6677-4455',
        address: `RT 01 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Pemetaan wilayah batas desa dengan zona kehutanan register negara beserta penyelesaian sertifikat.'
      },
      {
        id: `${normalized}-off4`,
        name: 'Sri Wahyuni',
        position: 'Kasi Pelayanan',
        phone: '0815-7788-5566',
        address: `RT 02 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Layanan kebudayaan lokal gotong royong serta monitoring kesejahteraan petani tumpang sari.'
      },
      {
        id: `${normalized}-off6`,
        name: 'Novianti',
        position: 'Kaur Keuangan',
        phone: '0816-8899-6677',
        address: `RT 01 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Mengelola cashflow desa, akuntabilitas Siskeudes, dan pengajuan dana desa triwulanan.'
      },
      {
        id: `${normalized}-off7`,
        name: 'Rian Syah',
        position: 'Kaur Umum',
        phone: '0817-9900-7788',
        address: `RT 02 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Mengelola operasional kantor desa, penerimaan tamu pemkab, dan inventaris barang balai.'
      },
      {
        id: `${normalized}-off9`,
        name: 'Tatang Sutarman',
        position: 'Kepala Dusun I',
        phone: '0821-1122-3344',
        address: `Dusun I, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Koordinasi pos ronda malam hutan, pengawasan penebangan liar, pemeliharaan parit batas dusun.'
      }
    ];
  }

  if (normalized === 'padasuka') {
    return [
      {
        id: `${normalized}-off1`,
        name: kadesName,
        position: 'Kepala Desa',
        phone: '0812-9900-5566',
        address: `RT 01 RW 01 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&h=200&q=80',
        level: 1,
        detail: 'Memimpin Desa Padasuka menjadi simpul agrowisata kopi robusta dan batik tulis OKU Timur.'
      },
      {
        id: `${normalized}-off2`,
        name: 'Nyoman Artha',
        position: 'Sekretaris Desa',
        phone: '0813-8899-4455',
        address: `RT 02 RW 01 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
        level: 2,
        detail: 'Administrasi komparatif terpadu, penyusunan laporan kemajuan penenun batik dan pekebun.'
      },
      {
        id: `${normalized}-off3`,
        name: 'Ketut Astawa',
        position: 'Kasi Pemerintahan',
        phone: '0814-7788-3344',
        address: `RT 01 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Administrasi kependudukan hak sipil warga transmigran asal Bali dan tatar Sunda.'
      },
      {
        id: `${normalized}-off4`,
        name: 'Ni Luh Gede',
        position: 'Kasi Pelayanan',
        phone: '0815-6677-2233',
        address: `RT 02 RW 02 Desa ${vName}`,
        period: '2020-2026',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Fasilitasi pembinaan kerukunan antar suku lintas budaya bali-sumsel dan kegiatan pameran kesenian.'
      },
      {
        id: `${normalized}-off5`,
        name: 'Wayan Sudiarta',
        position: 'Kasi Kesejahteraan (Kesra)',
        phone: '0815-5566-1122',
        address: `RT 03 RW 02 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
        level: 3,
        detail: 'Pecatatan subsidi benih kopi robusta, tata kelola penyaluran asuransi tani gagal panen.'
      },
      {
        id: `${normalized}-off6`,
        name: 'Made Suardana',
        position: 'Kaur Keuangan',
        phone: '0816-4455-0011',
        address: `RT 01 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Menyusun laporan arus masuk kas wisata, pemenuhan iuran pajak pengrajin batik bersama.'
      },
      {
        id: `${normalized}-off7`,
        name: 'Gede Sukra',
        position: 'Kaur Umum',
        phone: '0817-3344-9988',
        address: `RT 02 RW 03 Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
        level: 4,
        detail: 'Pengelolaan sekretariat gedung balai serbaguna adat kesenian dan pemeliharaan genset pompa air desa.'
      },
      {
        id: `${normalized}-off9`,
        name: 'Wayan Gede',
        position: 'Kepala Dusun I',
        phone: '0821-2233-4455',
        address: `Dusun I, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Pemeliharaan irigasi subak dusun kopi, pendaftaran siskamling ronda terpadu.'
      },
      {
        id: `${normalized}-off10`,
        name: 'Ni Nyoman Alit',
        position: 'Kepala Dusun II',
        phone: '0821-3344-5566',
        address: `Dusun II, Desa ${vName}`,
        period: '2021-2027',
        status: 'Aktif',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
        level: 5,
        detail: 'Pengawasan rukun warga daerah perajin batik canting, penyuluhan pencegahan stunting.'
      }
    ];
  }

  // Default is Sukamaju
  return [
    {
      id: `${normalized}-off1`,
      name: kadesName,
      position: 'Kepala Desa',
      phone: '0812-3456-7890',
      address: `RT 01 RW 01 Desa ${vName}`,
      period: '2021-2027',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      level: 1,
      detail: 'Penanggung jawab utama Pemerintahan, memimpin pelaksanaan pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat desa.'
    },
    {
      id: `${normalized}-off2`,
      name: 'Agus Permana',
      position: 'Sekretaris Desa',
      phone: '0813-2345-6789',
      address: `RT 02 RW 01 Desa ${vName}`,
      period: '2020-2026',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      level: 2,
      detail: 'Mengatur penyelenggaraan administrasi umum, pelaporan kegiatan, dan koordinasi jajaran pelaksana dalam kesekretariatan desa.'
    },
    {
      id: `${normalized}-off3`,
      name: 'Rudi Hartono',
      position: 'Kasi Pemerintahan',
      phone: '0814-3456-7891',
      address: `RT 01 RW 02 Desa ${vName}`,
      period: '2020-2026',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
      level: 3,
      detail: 'Melaksanakan manajemen kependudukan, pembinaan ketertiban umum, perlindungan masyarakat, pertanahan, serta tata kelola administrasi batas wilayah.'
    },
    {
      id: `${normalized}-off4`,
      name: 'Ani Kusumawati',
      position: 'Kasi Pelayanan',
      phone: '0815-4567-8902',
      address: `RT 02 RW 02 Desa ${vName}`,
      period: '2520-2026',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      level: 3,
      detail: 'Mengurusi fasilitasi pembinaan kepemudaan, sarana kesehatan masyarakat (Posyandu), olahraga, kesejahteraan sosial, serta kebudayaan desa.'
    },
    {
      id: `${normalized}-off5`,
      name: 'Hendra Wijaya',
      position: 'Kasi Kesejahteraan (Kesra)',
      phone: '0815-8877-6655',
      address: `RT 03 RW 02 Desa ${vName}`,
      period: '2021-2027',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
      level: 3,
      detail: 'Mengelola program jaminan sosial, bantuan kemiskinan, kemandirian pangan kelompok tani, silsilah keagamaan, dan pembinaan moral warga.'
    },
    {
      id: `${normalized}-off6`,
      name: 'Dian Pratiwi',
      position: 'Kaur Keuangan',
      phone: '0816-5678-9013',
      address: `RT 01 RW 03 Desa ${vName}`,
      period: '2021-2027',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
      level: 4,
      detail: 'Menyusun penatausahaan anggaran pendapatan belanja desa (APBDes), pencatatan kas, penyetoran pajak dinas, dan pengisian aplikasi Siskeudes.'
    },
    {
      id: `${normalized}-off7`,
      name: 'Eko Saputra',
      position: 'Kaur Umum & TU',
      phone: '0817-6789-0124',
      address: `RT 02 RW 03 Desa ${vName}`,
      period: '2020-2026',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80',
      level: 4,
      detail: 'Bertanggung jawab atas sarana prasarana fisik kantor, inventarisasi aset desa, surat-menyurat ekspedisi publikasi, serta keprotokolan desa.'
    },
    {
      id: `${normalized}-off8`,
      name: 'Siti Rahma',
      position: 'Kaur Perencanaan',
      phone: '0818-7890-1235',
      address: `RT 03 RW 03 Desa ${vName}`,
      period: '2022-2028',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      level: 4,
      detail: 'Menyusun Rencana Kerja Pemerintah Desa (RKPDes), menghimpun masukan pembangunan dusun, serta memformulasikan dokumen laporan kinerja desa.'
    },
    {
      id: `${normalized}-off9`,
      name: 'Yusuf Ahmad',
      position: 'Kepala Dusun I',
      phone: '0821-3344-5566',
      address: `Dusun I, Desa ${vName}`,
      period: '2021-2027',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80',
      level: 5,
      detail: 'Perwakilan Kepala Desa dalam wilayah Dusun I, melakukan sosialisasi ketenteraman warga, keguyuban gotong royong, dan ketertiban administrasi.'
    },
    {
      id: `${normalized}-off10`,
      name: 'Sunardi',
      position: 'Kepala Dusun II',
      phone: '0821-4455-6677',
      address: `Dusun II, Desa ${vName}`,
      period: '2021-2027',
      status: 'Aktif',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
      level: 5,
      detail: 'Perwakilan Kepala Desa dalam wilayah Dusun II, pembidangan sektor pertanian dusun, pendaftaran sensus jaminan sosial, dan pembinaan rukun warga.'
    }
  ];
};

interface ModulePerangkatBeritaProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
  activeMainModule?: 'perangkat' | 'berita_kegiatan';
  activeSubTab?: string;
  onSubTabChange?: (main: 'perangkat' | 'berita_kegiatan', sub: string) => void;
}

export const ModulePerangkatBerita: React.FC<ModulePerangkatBeritaProps> = ({
  onShowNotification,
  userRole,
  operatorVillage,
  activeMainModule: propActiveMainModule,
  activeSubTab: propActiveSubTab,
  onSubTabChange
}) => {
  const [localActiveMainModule, setLocalActiveMainModule] = useState<'perangkat' | 'berita_kegiatan'>('perangkat');
  const [localActiveSubTab, setLocalActiveSubTab] = useState<string>('organisasi');

  const activeMainModule = propActiveMainModule ?? localActiveMainModule;
  const activeSubTab = propActiveSubTab ?? localActiveSubTab;

  const setActiveMainModule = (val: 'perangkat' | 'berita_kegiatan') => {
    if (onSubTabChange) {
      onSubTabChange(val, val === 'perangkat' ? 'organisasi' : 'rekap_news');
    } else {
      setLocalActiveMainModule(val);
      setLocalActiveSubTab(val === 'perangkat' ? 'organisasi' : 'rekap_news');
    }
  };

  const setActiveSubTab = (val: string) => {
    if (onSubTabChange) {
      onSubTabChange(activeMainModule, val);
    } else {
      setLocalActiveSubTab(val);
    }
  };

  // Local state copy of officials & news to simulate status adjustments
  const [officials, setOfficials] = useState<Official[]>(OFFICIALS_DATA);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES_DATA);
  const [selectedNewsReader, setSelectedNewsReader] = useState<any>(null);

  // Search/Filters for officials list
  const [offSearch, setOffSearch] = useState('');
  const [offFilterVillage, setOffFilterVillage] = useState('Semua');
  const [offFilterStatus, setOffFilterStatus] = useState('All');

  // Timeline selected official state
  const [selectedOfficialTimeline, setSelectedOfficialTimeline] = useState<Official | null>(null);

  // Job desk accordion state
  const [openJobTab, setOpenJobTab] = useState<string | null>('Kades');

  // News and Activities filters
  const [newsSearch, setNewsSearch] = useState('');
  const [newsFilterVillage, setNewsFilterVillage] = useState('Semua');
  const [newsFilterCategory, setNewsFilterCategory] = useState('Semua');

  // Village selection and search state for the organization structure and merged jobdesks
  const [selectedVillageOrg, setSelectedVillageOrg] = useState<string>(
    userRole === 'Operator' && operatorVillage ? operatorVillage : 'Sukamaju'
  );
  const [showVillageOrgDropdown, setShowVillageOrgDropdown] = useState(false);
  const [villageOrgSearch, setVillageOrgSearch] = useState('');

  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    level1: true, // Kades
    level2: true, // Sekdes
    level3: true, // Kasi
    level4: true, // Kaur
    level5: true  // Kadus
  });

  const [expandedProfileDetails, setExpandedProfileDetails] = useState<Record<string, boolean>>({});

  // Determine organizational structure dynamic data
  const getOfficialsForVillage = (vName: string) => {
    const list = getVillageStaffList(vName);
    return {
      kades: list[0]?.name || 'Budi Santoso',
      sekdes: list[1]?.name || 'Agus Permana',
      kasiPem: list[2]?.name || 'Rudi Hartono',
      kasiPel: list[3]?.name || 'Ani Kusumawati',
      kaurKeu: list[5]?.name || 'Dian Pratiwi',
      kaurUmum: list[6]?.name || 'Eko Saputra',
      phone: list[0]?.phone || '0812-3456-7890'
    };
  };

  const villageStaff = getOfficialsForVillage(selectedVillageOrg);
  const filteredVillagesOrg = VILLAGES_DATA.filter((v) =>
    v.name.toLowerCase().includes(villageOrgSearch.toLowerCase())
  );

  // Calendar specific states (June 2025)
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<{
    date: number;
    title: string;
    village: string;
    location: string;
    desc: string;
  } | null>(null);

  // Collapsible Job definitions
  const jobDesks = [
    {
      key: 'Kades',
      title: 'Kepala Desa',
      items: [
        'Memimpin penyelenggaraan pemerintahan desa secara tertib dan transparan.',
        'Mengangkat dan memberhentikan jajaran staf perangkat desa sesuai peraturan menteri.',
        'Memegang kekuasaan tertinggi atas tata kelola keuangan kas desa.',
        'Mewakili lembaga desa dalam dan luar persidangan pengadilan hukum.'
      ]
    },
    {
      key: 'Sekdes',
      title: 'Sekretaris Desa',
      items: [
        'Membantu Kepala Desa di bidang kesekretariatan dan ketatausahaan administrasi.',
        'Mengkoordinasikan jajaran kepala seksi dan kepala urusan desa lainnya.',
        'Mengelola arsip dokumen fisik maupun digital secara aman.',
        'Menyusun kerangka rancangan laporan pertanggungjawaban APBDes.'
      ]
    },
    {
      key: 'KasiPem',
      title: 'Kasi Pemerintahan',
      items: [
        'Membantu Kepala Desa dalam penegapan kebijakan tata pemerintahan.',
        'Mengurus administrasi mutasi kependudukan warga di tingkat desa.',
        'Mengelola pendaftaran sertifikasi pertanahan sengketa daerah.',
        'Melakukan pembinaan kerukunan ketertiban keamanan warga lingkungan.'
      ]
    },
    {
      key: 'KaurKeu',
      title: 'Kaur Keuangan',
      items: [
        'Mengurusi pencatatan arus masuk dan keluar finansial kas.',
        'Menyelenggarakan pembayaran gaji jajaran dan operasional desa.',
        'Menyiapkan berkas-berkas perpajakan dinas terkait.',
        'Mengoperasikan software pelaporan keuangan Siskeudes.'
      ]
    }
  ];

  // Calendar parameters June 2025 (Starts on Sunday index 0 for grid, June 1 2025 is Sunday)
  const daysInJune = 30;
  const juneEvents = [
    { date: 10, title: 'Panen Raya Padi Sukamaju', village: 'Sukamaju', color: 'bg-emerald-500', hover: 'text-emerald-700', location: 'Persawahan Dsn III Sukamaju', desc: 'Ritus adat panen raya padi Ciherang mengundang jajaran pimpinan Kabupaten OKU Timur.' },
    { date: 12, title: 'Rapat Koordinasi Kecamatan', village: 'Semua Desa', color: 'bg-blue-600', hover: 'text-blue-700', location: 'Kantor Aula Kecamatan', desc: 'Konsolidasi bulanan membahas kepatuhan input data evaluasi monografi.' },
    { date: 15, title: 'Posyandu Lansia Cikaret', village: 'Cikaret', color: 'bg-rose-500', hover: 'text-rose-700', location: 'Gedung Balai Cikaret', desc: 'Pemeriksaan kesehatan gratis lansia, pembagian vitamin, dan imunisasi berkala.' },
    { date: 18, title: 'Pelatihan UMKM Margaasih', village: 'Margaasih', color: 'bg-amber-500', hover: 'text-amber-700', location: 'BUMDes Margaasih Baru', desc: 'Peningkatan keahlian pengolahan, pelabelan, sediaan kemasan lapak produk.' },
    { date: 22, title: 'Festival Kopi Robusta', village: 'Padasuka', color: 'bg-teal-600', hover: 'text-teal-700', location: 'Selasar Kompleks Padasuka', desc: 'Ajang promosi biji barista seduhan kopi robusta Belitang Jaya.' },
    { date: 25, title: 'Musyawarah Desa Mekarjaya', village: 'Mekarjaya', color: 'bg-purple-600', hover: 'text-purple-700', location: 'Balai Pertemuan Mekarjaya', desc: 'Penyusunan anggaran awal Rencana Anggaran Pembangunan Desa (RAPBDes).' },
  ];

  const toggleJobDesk = (key: string) => {
    setOpenJobTab(openJobTab === key ? null : key);
  };

  // Switch status (Simulated server-side write)
  const changeOfficialStatus = (id: string, newStats: 'Aktif' | 'Nonaktif') => {
    setOfficials((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          onShowNotification(`Sistem: Status perangkat ${o.name} diganti menjadi ${newStats}.`);
          return { ...o, status: newStats };
        }
        return o;
      })
    );
  };

  const publishNewsToggle = (id: string, newStatus: 'Terbit' | 'Arsip') => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          onShowNotification(`Konten "${a.detail}" berhasil diubah menjadi ${newStatus}.`);
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  };

  const deleteNewsItem = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus konten publikasi ini secara permanen dari database SCOPE?')) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      onShowNotification('Konten publikasi berita sukses dihapus.');
    }
  };

  // Filtered officials list
  const filteredOfficials = officials.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(offSearch.toLowerCase()) || o.position.toLowerCase().includes(offSearch.toLowerCase());
    const matchVillage = offFilterVillage === 'Semua' || o.villageName === offFilterVillage;
    const matchStatus = offFilterStatus === 'All' || o.status === offFilterStatus;
    return matchSearch && matchVillage && matchStatus;
  });

  // Filtered news list
  const filteredNews = activities.filter((a) => {
    const matchSearch = a.detail.toLowerCase().includes(newsSearch.toLowerCase());
    const matchVillage = newsFilterVillage === 'Semua' || a.villageName === newsFilterVillage;
    const matchCategory = newsFilterCategory === 'Semua' || a.category === newsFilterCategory;
    return matchSearch && matchVillage && matchCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
      case 'Terbit':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">Aktif/Terbit</span>;
      case 'Draft':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg border border-slate-200">Draft</span>;
      case 'Nonaktif':
      case 'Arsip':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-250">Arsip/Nonaktif</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">

      {/* --- SUB TAB PANELS: MODULE 5 PERANGKAT --- */}

      {/* 5.1 STRUKTUR ORGANISASI */}
      {activeMainModule === 'perangkat' && activeSubTab === 'organisasi' && (() => {
        const currentVillageName = userRole === 'Operator' && operatorVillage ? operatorVillage : selectedVillageOrg;
        const activeStaffList = getVillageStaffList(currentVillageName);

        return (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-8 overflow-hidden animate-fade-in">
            
            {/* Header Row: Title & Search/Select District */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 pb-5 gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-850" />
                  Hierarki Visual Organisasi Pemerintahan Desa
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Bagan kedudukan tata usaha sekretariat aparatur untuk <strong className="text-blue-905 font-extrabold text-blue-900">Desa {currentVillageName}</strong>
                </p>
              </div>
              
              {/* Search and Select Village (ONLY FOR ADMIN) */}
              {userRole === 'Admin' ? (
                <div className="relative">
                  <label className="block text-[10px] font-extrabold text-blue-900 uppercase tracking-wider mb-1 text-right md:text-left">Pilih / Cari Desa</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      value={villageOrgSearch || `Desa ${selectedVillageOrg}`}
                      onFocus={() => {
                        setVillageOrgSearch('');
                        setShowVillageOrgDropdown(true);
                      }}
                      onChange={(e) => {
                        setVillageOrgSearch(e.target.value);
                        setShowVillageOrgDropdown(true);
                      }}
                      onBlur={() => setTimeout(() => setShowVillageOrgDropdown(false), 200)}
                      placeholder="Ketik nama desa..."
                      className="pl-9 pr-8 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl w-52 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all font-sans"
                    />
                    <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                  </div>
                  {showVillageOrgDropdown && (
                    <div className="absolute right-0 mt-1 w-52 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 divide-y divide-slate-50">
                      {filteredVillagesOrg.length > 0 ? (
                        filteredVillagesOrg.map((v) => (
                          <button
                            key={v.id}
                            onMouseDown={() => {
                              setSelectedVillageOrg(v.name);
                              setVillageOrgSearch(`Desa ${v.name}`);
                              setShowVillageOrgDropdown(false);
                              onShowNotification(`Menampilkan struktur organisasi Pemerintahan Desa ${v.name}`);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold tracking-wide transition-colors duration-150 block cursor-pointer"
                          >
                            Desa {v.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-xs text-slate-400">Tidak ditemukan</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-blue-50/50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-blue-900 uppercase">Operator Desa {currentVillageName}</span>
                </div>
              )}
            </div>

            {/* Org Tree Visualization with Up/Down Collapses */}
            <div className="flex flex-col items-center gap-6 min-w-[700px] overflow-x-auto py-6 bg-slate-50/40 rounded-2xl border border-slate-100 text-center">
              
              {/* Level 1 & 2: Pimpinan & Sekretaris */}
              <div className="w-full flex flex-col items-center">
                <button
                  onClick={() => setExpandedTiers(prev => ({ ...prev, level1: !prev.level1 }))}
                  className="flex items-center gap-2 bg-blue-55 bg-blue-50/80 hover:bg-blue-100 px-4.5 py-2 rounded-full text-[10px] font-extrabold text-blue-900 uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                >
                  <span>1. Unsur Pimpinan & Sekretariat</span>
                  {expandedTiers.level1 ? <ChevronUp className="w-3.5 h-3.5 text-blue-700" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-700" />}
                </button>

                {expandedTiers.level1 && (
                  <div className="flex flex-col items-center animate-fade-in mt-4">
                    {/* Kades (Level 1) */}
                    <div className="w-68 bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white rounded-2xl border-2 border-amber-300 p-3.5 shadow-md flex items-center gap-3">
                      <img src={activeStaffList[0].photoUrl} alt={activeStaffList[0].name} className="w-12 h-12 rounded-full border-2 border-amber-300 object-cover" referrerPolicy="no-referrer" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9px] text-amber-300 font-black tracking-widest uppercase block mb-0.5">Kepala Desa</span>
                        <h4 className="font-extrabold text-xs text-white truncate">{activeStaffList[0].name}</h4>
                        <p className="text-[9px] text-slate-300 font-mono mt-0.5">{activeStaffList[0].phone}</p>
                      </div>
                    </div>

                    <div className="w-0.5 h-6 bg-slate-300" />

                    {/* Sekdes (Level 2) */}
                    <div className="w-68 bg-slate-850 bg-slate-800 text-white rounded-2xl border border-slate-700/60 p-3.5 shadow-sm flex items-center gap-3">
                      <img src={activeStaffList[1].photoUrl} alt={activeStaffList[1].name} className="w-11 h-11 rounded-full border-2 border-slate-600 object-cover" referrerPolicy="no-referrer" />
                      <div className="text-left min-w-0 flex-1">
                        <span className="text-[9px] text-slate-300 font-bold tracking-widest block uppercase mb-0.5">Sekretaris Desa</span>
                        <h4 className="font-bold text-xs truncate text-white">{activeStaffList[1].name}</h4>
                        <p className="text-[9px] text-slate-400 font-mono">Unsur Staf Pembina</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Level 3: Pelaksana Teknis (Kasi Pemerintahan, Pelayanan, Kesra) */}
              <div className="w-full flex flex-col items-center mt-3">
                {expandedTiers.level1 && <div className="w-0.5 h-6 bg-slate-300 mb-1" />}
                <button
                  onClick={() => setExpandedTiers(prev => ({ ...prev, level3: !prev.level3 }))}
                  className="flex items-center gap-2 bg-blue-50/80 hover:bg-blue-100 px-4.5 py-2 rounded-full text-[10px] font-extrabold text-blue-900 uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                >
                  <span>2. Unsur Pelaksana Teknis (KASI)</span>
                  {expandedTiers.level3 ? <ChevronUp className="w-3.5 h-3.5 text-blue-700" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-700" />}
                </button>

                {expandedTiers.level3 && (
                  <div className="w-full flex flex-col items-center animate-fade-in mt-4">
                    <div className="w-0.5 h-4 bg-slate-300" />
                    <div className="relative w-full">
                      {/* Horizontal Connector Line */}
                      <div className="absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-slate-300" />
                      
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        {/* Kasi Pemerintahan */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[2].photoUrl} alt={activeStaffList[2].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-blue-800 block uppercase mb-0.5">Kasi Pemerintahan</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[2].name}</h5>
                            </div>
                          </div>
                        </div>

                        {/* Kasi Pelayanan */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[3].photoUrl} alt={activeStaffList[3].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-blue-800 block uppercase mb-0.5">Kasi Pelayanan</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[3].name}</h5>
                            </div>
                          </div>
                        </div>

                        {/* Kasi Kesejahteraan (Kesra) */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[4].photoUrl} alt={activeStaffList[4].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-blue-800 block uppercase mb-0.5">Kasi Kesejahteraan</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[4].name}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Level 4: Pelaksana Umum / Kesekretariatan (Kaur Keuangan, Umum, Perencanaan) */}
              <div className="w-full flex flex-col items-center mt-3">
                {expandedTiers.level3 && <div className="w-0.5 h-6 bg-slate-300 mb-1" />}
                <button
                  onClick={() => setExpandedTiers(prev => ({ ...prev, level4: !prev.level4 }))}
                  className="flex items-center gap-2 bg-emerald-50/80 hover:bg-emerald-100 px-4.5 py-2 rounded-full text-[10px] font-extrabold text-emerald-900 uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                >
                  <span>3. Unsur Staf Kesekretariatan (KAUR)</span>
                  {expandedTiers.level4 ? <ChevronUp className="w-3.5 h-3.5 text-emerald-700" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />}
                </button>

                {expandedTiers.level4 && (
                  <div className="w-full flex flex-col items-center animate-fade-in mt-4">
                    <div className="w-0.5 h-4 bg-slate-300" />
                    <div className="relative w-full">
                      {/* Horizontal Connector Line */}
                      <div className="absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-slate-300" />
                      
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        {/* Kaur Keuangan */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[5].photoUrl} alt={activeStaffList[5].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-emerald-800 block uppercase mb-0.5">Kaur Keuangan</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[5].name}</h5>
                            </div>
                          </div>
                        </div>

                        {/* Kaur Umum */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[6].photoUrl} alt={activeStaffList[6].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-emerald-800 block uppercase mb-0.5">Kaur Umum & TU</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[6].name}</h5>
                            </div>
                          </div>
                        </div>

                        {/* Kaur Perencanaan */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[7].photoUrl} alt={activeStaffList[7].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-emerald-800 block uppercase mb-0.5">Kaur Perencanaan</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[7].name}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Level 5: Pembinaan Wilayah Kewilayahan (Kadus I, II, III) */}
              <div className="w-full flex flex-col items-center mt-3">
                {expandedTiers.level4 && <div className="w-0.5 h-6 bg-slate-300 mb-1" />}
                <button
                  onClick={() => setExpandedTiers(prev => ({ ...prev, level5: !prev.level5 }))}
                  className="flex items-center gap-2 bg-indigo-50/80 hover:bg-indigo-100 px-4.5 py-2 rounded-full text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                >
                  <span>4. Unsur Pelaksana Kewilayahan (KADUS)</span>
                  {expandedTiers.level5 ? <ChevronUp className="w-3.5 h-3.5 text-indigo-700" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-700" />}
                </button>

                {expandedTiers.level5 && (
                  <div className="w-full flex flex-col items-center animate-fade-in mt-4">
                    <div className="w-0.5 h-4 bg-slate-300" />
                    <div className="relative w-full">
                      {/* Horizontal Connector Line */}
                      <div className="absolute top-0 left-[16.6%] right-[16.6%] h-0.5 bg-slate-300" />
                      
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        {/* Kepala Dusun I */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[8].photoUrl} alt={activeStaffList[8].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-indigo-800 block uppercase mb-0.5">Kepala Dusun I</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[8].name}</h5>
                            </div>
                          </div>
                        </div>

                        {/* Kepala Dusun II */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[9].photoUrl} alt={activeStaffList[9].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-indigo-800 block uppercase mb-0.5">Kepala Dusun II</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[9].name}</h5>
                            </div>
                          </div>
                        </div>

                        {/* Kepala Dusun III */}
                        <div className="flex flex-col items-center relative">
                          <div className="absolute top-0 w-0.5 h-4 bg-slate-300" />
                          <div className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-800 shadow-xs flex items-center gap-3 w-56 transition-all duration-150 mt-4 hover:border-slate-350">
                            <img src={activeStaffList[10].photoUrl} alt={activeStaffList[10].name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                            <div className="text-left min-w-0 flex-1">
                              <span className="text-[8px] font-black text-indigo-800 block uppercase mb-0.5">Kepala Dusun III</span>
                              <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{activeStaffList[10].name}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* PROFIL PORTFOLIO DENGAN FOTO, JABATAN, DETAIL & UP/DOWN CHEVRONS */}
            <div className="border-t border-slate-100 pt-8 space-y-5">
              <div>
                <h4 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-900" />
                  Daftar Profil Lengkap & Detail Aparatur Desa
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Portofolio rincian data diri resmi, status kerja, nomor telepon, dan rincian fungsional tugas pokok pamong <strong className="text-blue-900">Desa {currentVillageName}</strong>. Klik tombol ditiap kartu untuk memperluas info detail:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeStaffList.map((st) => {
                  const isDetailExpanded = !!expandedProfileDetails[st.id];

                  return (
                    <div key={st.id} className="bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="p-5 space-y-4">
                        {/* Profile Info Card with Photo */}
                        <div className="flex gap-4 items-start">
                          <img
                            src={st.photoUrl}
                            alt={st.name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-blue-100 shadow-sm flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1 min-w-0 flex-1">
                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                              {st.position}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm truncate leading-tight">
                              {st.name}
                            </h5>
                            <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded border border-emerald-200">
                              Status: {st.status}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Detail Info block */}
                        {isDetailExpanded && (
                          <div className="space-y-2.5 border-t border-slate-100 pt-3.5 text-xs text-slate-600 animate-fade-in font-medium leading-relaxed">
                            <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                              <span className="text-slate-400">Kontak Telepon:</span>
                              <span className="text-slate-800 font-mono font-bold">{st.phone}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                              <span className="text-slate-400">Masa Bakti:</span>
                              <span className="text-slate-800 font-bold">{st.period}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                              <span className="text-slate-400">Alamat Tempat Tinggal:</span>
                              <span className="text-slate-800 font-bold truncate max-w-[155px]" title={st.address}>{st.address}</span>
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <span className="text-slate-400 block text-[9px] uppercase font-extrabold tracking-wider">Uraian Tugas Pokok & Kewenangan:</span>
                              <p className="text-slate-600 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-150 leading-relaxed">
                                {st.detail}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expand/Collapse Trigger (Up/Down Arrow Button) */}
                      <button
                        onClick={() => setExpandedProfileDetails(prev => ({ ...prev, [st.id]: !prev[st.id] }))}
                        className="w-full bg-slate-50/70 hover:bg-blue-50/40 py-3 border-t border-slate-150 text-center font-bold text-[9px] text-blue-800 uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isDetailExpanded ? (
                          <>
                            <span>Sembunyikan Rincian</span>
                            <ChevronUp className="w-3.5 h-3.5 text-blue-750" />
                          </>
                        ) : (
                          <>
                            <span>Tampilkan Rincian</span>
                            <ChevronDown className="w-3.5 h-3.5 text-blue-750" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        );
      })()}

      {/* 5.2 TUPOKSI & URAIAN JABATAN */}
      {activeMainModule === 'perangkat' && activeSubTab === 'tupoksi' && (() => {
        const currentVillageName = userRole === 'Operator' && operatorVillage ? operatorVillage : selectedVillageOrg;

        const allJobDesks = [
          {
            key: 'Kades',
            title: 'Kepala Desa',
            badge: 'Unsur Pimpinan',
            badgeColor: 'bg-blue-900 text-white',
            icon: '👑',
            items: [
              'Memimpin penyelenggaraan pemerintahan desa secara tertib dan transparan sesuai amanat undang-undang.',
              'Mengangkat dan memberhentikan jajaran staf perangkat desa sesuai peraturan menteri dalam negeri.',
              'Memegang kekuasaan tertinggi atas tata kelola keuangan dan aset kas desa.',
              'Mewakili lembaga desa dalam dan luar persidangan pengadilan hukum.',
              'Menetapkan Peraturan Desa (Perdes) bersama Badan Permusyawaratan Desa (BPD).',
              'Menyusun dan melaporkan Rencana Pembangunan Jangka Menengah Desa (RPJMDes).'
            ]
          },
          {
            key: 'Sekdes',
            title: 'Sekretaris Desa',
            badge: 'Unsur Kesekretariatan',
            badgeColor: 'bg-slate-700 text-white',
            icon: '📋',
            items: [
              'Membantu Kepala Desa di bidang kesekretariatan dan ketatausahaan administrasi umum.',
              'Mengkoordinasikan jajaran kepala seksi dan kepala urusan desa lainnya setiap hari kerja.',
              'Mengelola arsip dokumen fisik maupun digital secara aman dan tertib.',
              'Menyusun kerangka rancangan laporan pertanggungjawaban APBDes tiap akhir tahun anggaran.',
              'Mengawasi dan memastikan kepatuhan pelaksanaan SOP pelayanan administrasi desa.',
              'Mengkoordinir penyusunan laporan realisasi pembangunan desa tahunan kepada Camat.'
            ]
          },
          {
            key: 'KasiPem',
            title: 'Kasi Pemerintahan',
            badge: 'Pelaksana Teknis',
            badgeColor: 'bg-indigo-600 text-white',
            icon: '🏛️',
            items: [
              'Membantu Kepala Desa dalam penetapan kebijakan tata pemerintahan lokal.',
              'Mengurus administrasi mutasi kependudukan warga di tingkat desa secara akurat.',
              'Mengelola pendaftaran sertifikasi pertanahan dan penyelesaian sengketa batas wilayah.',
              'Melakukan pembinaan kerukunan, ketertiban, dan keamanan warga lingkungan desa.',
              'Mengoordinasikan pelaksanaan pemilihan RT/RW dan lembaga kemasyarakatan desa.',
              'Menyusun profil data administrasi kependudukan yang terkini dan valid.'
            ]
          },
          {
            key: 'KasiPel',
            title: 'Kasi Pelayanan',
            badge: 'Pelaksana Teknis',
            badgeColor: 'bg-indigo-600 text-white',
            icon: '🤝',
            items: [
              'Mengelola dan memastikan pelayanan administratif kepada masyarakat berjalan lancar.',
              'Memproses surat keterangan domisili, kelahiran, kematian, dan dokumen kependudukan lain.',
              'Mengoordinasikan pelaksanaan program sosial bantuan warga tidak mampu di desa.',
              'Membantu pengelolaan data penerima manfaat PKH, BPJS, dan program subsidi lainnya.',
              'Menyusun laporan data pelayanan publik bulanan untuk dilaporkan ke kecamatan.',
              'Memastikan standar waktu pelayanan surat menyurat maksimal 1x24 jam kerja.'
            ]
          },
          {
            key: 'KasiKesra',
            title: 'Kasi Kesejahteraan',
            badge: 'Pelaksana Teknis',
            badgeColor: 'bg-indigo-600 text-white',
            icon: '🌱',
            items: [
              'Mengoordinasikan kegiatan pemberdayaan dan peningkatan kesejahteraan masyarakat desa.',
              'Memfasilitasi program posyandu, beasiswa, dan layanan kesehatan warga.',
              'Mengelola data kelompok rentan: lansia, difabel, dan keluarga pra-sejahtera.',
              'Mendampingi pelaksanaan kegiatan BUMDes dan kelompok usaha produktif desa.',
              'Menyusun laporan perkembangan Indeks Desa Membangun (IDM) secara berkala.',
              'Memfasilitasi forum musyawarah pemberdayaan masyarakat dan gotong royong.'
            ]
          },
          {
            key: 'KaurKeu',
            title: 'Kaur Keuangan',
            badge: 'Staf Kesekretariatan',
            badgeColor: 'bg-emerald-700 text-white',
            icon: '💰',
            items: [
              'Mengurusi pencatatan arus masuk dan keluar finansial kas desa secara transparan.',
              'Menyelenggarakan pembayaran gaji jajaran perangkat dan operasional desa.',
              'Menyiapkan berkas-berkas perpajakan dinas terkait dan laporan keuangan bulanan.',
              'Mengoperasikan software pelaporan keuangan Siskeudes sesuai regulasi.',
              'Menyusun Rancangan APBDes dan laporan realisasi belanja desa tiap semester.',
              'Memastikan seluruh transaksi keuangan didukung bukti yang sah dan teraudit.'
            ]
          },
          {
            key: 'KaurUmum',
            title: 'Kaur Umum & TU',
            badge: 'Staf Kesekretariatan',
            badgeColor: 'bg-emerald-700 text-white',
            icon: '🗂️',
            items: [
              'Mengelola sarana dan prasarana balai pertemuan serta fasilitas umum desa.',
              'Mengurusi tata naskah dinas, surat masuk dan keluar, serta pengarsipan.',
              'Mengelola inventaris perlengkapan kantor desa dan kebutuhan ATK.',
              'Membantu administrasi kepegawaian perangkat desa (absensi, cuti, data diri).',
              'Memfasilitasi dan mendokumentasikan pelaksanaan rapat-rapat resmi desa.',
              'Mengelola website dan media sosial resmi desa sebagai sarana informasi publik.'
            ]
          },
          {
            key: 'KaurPerenc',
            title: 'Kaur Perencanaan',
            badge: 'Staf Kesekretariatan',
            badgeColor: 'bg-emerald-700 text-white',
            icon: '📊',
            items: [
              'Menyusun draft RKPDes (Rencana Kerja Pemerintah Desa) tahunan secara terukur.',
              'Menginventarisir usulan pembangunan dari tiap dusun melalui Musrenbangdes.',
              'Menganalisis data potensi desa sebagai basis perencanaan pembangunan yang tepat sasaran.',
              'Memantau dan mengevaluasi pelaksanaan program dan kegiatan pembangunan desa.',
              'Menyusun profil dan monografi desa yang akurat dan mutakhir.',
              'Mengkoordinasikan input data desa ke sistem informasi pusat (Prodeskel/SIAK).'
            ]
          },
          {
            key: 'Kadus',
            title: 'Kepala Dusun (KADUS)',
            badge: 'Pelaksana Kewilayahan',
            badgeColor: 'bg-violet-700 text-white',
            icon: '🏘️',
            items: [
              'Melaksanakan kegiatan pemerintahan, pembangunan, dan kemasyarakatan di wilayah dusun.',
              'Menjadi penghubung utama antara warga dusun dengan aparat pemerintah desa.',
              'Membantu pelaksanaan distribusi bantuan sosial dan program pemerintah di lingkungan.',
              'Memfasilitasi kegiatan gotong royong, musyawarah warga, dan resolusi konflik lokal.',
              'Melaporkan kondisi keamanan, ketertiban, dan kejadian penting di wilayah dusun.',
              'Mendata warga pendatang baru dan memastikan ketertiban administrasi kependudukan dusun.'
            ]
          }
        ];

        return (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-800" />
                  Tupoksi & Uraian Jabatan Perangkat Desa
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tugas Pokok dan Fungsi resmi seluruh jajaran aparatur pemerintahan{' '}
                  <strong className="text-blue-900">Desa {currentVillageName}</strong> berdasarkan Permendagri No. 67 Tahun 2017.
                </p>
              </div>
              <span className="shrink-0 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Permendagri 67/2017
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              {[
                { label: 'Unsur Pimpinan', color: 'bg-blue-900 text-white' },
                { label: 'Pelaksana Teknis (KASI)', color: 'bg-indigo-600 text-white' },
                { label: 'Staf Kesekretariatan (KAUR)', color: 'bg-emerald-700 text-white' },
                { label: 'Pelaksana Kewilayahan (KADUS)', color: 'bg-violet-700 text-white' },
              ].map((leg) => (
                <span key={leg.label} className={`px-2.5 py-1 rounded-full ${leg.color}`}>{leg.label}</span>
              ))}
            </div>

            {/* Accordion Job Desk Cards */}
            <div className="space-y-3">
              {allJobDesks.map((jd) => {
                const isOpen = openJobTab === jd.key;
                return (
                  <div
                    key={jd.key}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen ? 'border-blue-200 shadow-md' : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleJobDesk(jd.key)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl leading-none">{jd.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">{jd.title}</span>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${jd.badgeColor}`}>
                              {jd.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {jd.items.length} poin uraian tugas pokok & kewenangan
                          </p>
                        </div>
                      </div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isOpen
                          ? <ChevronUp className="w-4 h-4" />
                          : <ChevronDown className="w-4 h-4" />
                        }
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 space-y-2"
                      >
                        {jd.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                            <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white ${jd.badgeColor.split(' ')[0]}`}>
                              {idx + 1}
                            </span>
                            <p className="leading-relaxed">{item}</p>
                          </div>
                        ))}

                        <div className="pt-3 border-t border-slate-200 mt-3 flex gap-2">
                          <button
                            onClick={() => onShowNotification(`Dokumen Tupoksi ${jd.title} berhasil diunduh (format PDF resmi).`)}
                            className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs cursor-pointer"
                          >
                            ↓ Unduh Dokumen Resmi
                          </button>
                          <button
                            onClick={() => onShowNotification(`SK Penetapan Tupoksi ${jd.title} berhasil dikirim ke email operator desa.`)}
                            className="px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-lg text-xs cursor-pointer"
                          >
                            Kirim SK
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer info */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
              <Layers className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
              <p className="leading-relaxed">
                Seluruh uraian tugas di atas mengacu pada <strong>Peraturan Menteri Dalam Negeri No. 67 Tahun 2017</strong> tentang Perubahan atas Permendagri No. 83 Tahun 2015 mengenai Pengangkatan dan Pemberhentian Perangkat Desa, serta disesuaikan dengan Peraturan Desa setempat.
              </p>
            </div>
          </div>
        );
      })()}

      {/* 5.3 PROFIL KANTOR PERANGKAT */}
      {activeMainModule === 'perangkat' && activeSubTab === 'profil_staf' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={offSearch}
                onChange={(e) => setOffSearch(e.target.value)}
                placeholder="Cari nama aparatur atau posisi jabatan..."
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={offFilterVillage}
                onChange={(e) => setOffFilterVillage(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white text-slate-705 font-bold cursor-pointer"
              >
                <option value="Semua">Asal Desa (Semua)</option>
                {VILLAGES_DATA.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>

              <select
                value={offFilterStatus}
                onChange={(e) => setOffFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white text-slate-705 font-bold cursor-pointer"
              >
                <option value="All">Status (Semua)</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 font-medium">
                <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-center">Inisial</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Jabatan Pamong</th>
                    <th className="p-4">Nomor HP</th>
                    <th className="p-4">Alamat Rumah</th>
                    <th className="p-4 text-center">Masa Bakti</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOfficials.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-center">
                        <span className="inline-flex w-7 h-7 bg-blue-105 text-blue-800 font-black rounded-full items-center justify-center text-xs">
                          {o.initials}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{o.name}</td>
                      <td className="p-4 text-xs text-slate-700 font-bold">{o.position}</td>
                      <td className="p-4 font-mono text-xs text-slate-600">{o.phone}</td>
                      <td className="p-4 text-xs max-w-[120px] truncate" title={o.address}>{o.address}</td>
                      <td className="p-4 text-center font-mono text-xs">{o.period}</td>
                      <td className="p-4">{getStatusBadge(o.status)}</td>
                      <td className="p-4 text-center">
                        <div className="flex gap-1.5 justify-center">
                          <button
                            onClick={() => setSelectedOfficialTimeline(o)}
                            className="p-1 px-2 bg-slate-900 text-white text-[11px] font-bold rounded cursor-pointer"
                          >
                            Riwayat
                          </button>
                          <button
                            onClick={() => changeOfficialStatus(o.id, o.status === 'Aktif' ? 'Nonaktif' : 'Aktif')}
                            className="p-1 px-1.5 border border-slate-200 text-xs bg-slate-100 rounded"
                            title="Konfirmasi Status Keaktifan"
                          >
                            ⚙
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB TAB PANELS: MODULE 6 BERITA & KEGIATAN --- */}

      {/* 6.1 REKAP BERITA & GALERI */}
      {activeMainModule === 'berita_kegiatan' && activeSubTab === 'rekap_news' && (() => {
        const DETAILED_NEWS_LIST = [
          {
            id: 'n1',
            title: 'Hari Kemenangan Tani: Sukamaju Gelar Pencanangan Panen Raya Padi Organik 2025',
            shortDesc: 'Desa Sukamaju berhasil mencatatkan rekor produktivitas padi organik dengan capai hasil giling panen raya melimpah ruah.',
            fullContent: [
              'Sukamaju, Belitang Jaya — Kelompok Tani Makmur Utama Desa Sukamaju hari ini menyambut gembira dimulainya panen raya padi organik unggulan daerah. Bertepatan dengan musim giling tahun ini, Desa Sukamaju berhasil melampaui target swasembada pangan tingkat daerah dengan hasil panen menyentuh angka fantastis.',
              'Kepala Desa Sukamaju Budi Santoso meresmikan kegiatan pemotongan tumpeng dan pemanenan simbolis menggunakan mesin pemotong modern bersama perwakilan jajaran dinas pertanian kabupaten OKU Timur. Program penyediaan pupuk subsidi bio-organik mandiri yang dirilis kas desa sejak dua tahun lalu kini terbukti mampu meningkatkan kualitas hasil bulir beras menjadi lebih padat, pulen, dan bernilai jual tinggi bebas zat kimia aktif.',
              'Diharapkan beras premium Sukamaju ini akan segera terdistribusi penuh melintasi pasar daerah Belitang Jaya hingga menembus minimarket provinsi dalam menyokong kestabilan pangan dan kebangkitan finansial petani pasca pandemi.',
              'Upaya berkelanjutan ini juga ditunjang pemeliharaan irigasi subak teratur dari hulu aliran air yang dikoordinir langsung oleh para kepala dusun. Sinergi ini membuahkan hasil panen yang lebih sehat dan tahan lama dibanding gabah non-organik tradisional.'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
            villageName: 'Sukamaju',
            category: 'Pertanian',
            date: '10 Jun 2025',
            author: 'Operator Desa Sukamaju'
          },
          {
            id: 'n2',
            title: 'Zero Stunting: Cikaret Sukses Gelar Posyandu Prima & Pembagian Vitamin Balita Gratis',
            shortDesc: 'Kader PKK Desa Cikaret mengawal kesehatan 120 balita serta penyuluhan nutrisi sehat guna cegah stunting.',
            fullContent: [
              'Cikaret, Belitang Jaya — Sebagai bagian dari aksi akselerasi penurunan angka stunting nasional, jajaran kader Posyandu Melati Desa Cikaret bekerja sama dengan Puskesmas Belitang Jaya menyelenggarakan program Posyandu Prima serentak di tiga dusun utama.',
              'Dalam agenda ini, sebanyak 120 ibu menyusui dan balita mendapatkan layanan penimbangan berat badan rutin, pemetaan riwayat tumbuh kembang secara berkala, vaksinasi tambahan, serta pembagian paket asupan gizi sehat gratis berisi susu formula, kacang hijau kupas, dan multivitamin kalsium tinggi.',
              'Kades Hendra Wijaya mengapresiasi kinerja sukarelawan kesehatan desa yang gigih mendatangi rumah warga terpencil (door-to-door) demi memastikan tidak ada satu pun balita di Desa Cikaret yang terlewat dari pemenuhan hak nutrisi dasar.',
              'Program ini rencananya akan dibuat berkala setiap bulan dengan tambahan kader edukasi gizi masak MPASI murah kaya zat besi bagi ibu-ibu muda.'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
            villageName: 'Cikaret',
            category: 'Kesehatan',
            date: '08 Jun 2025',
            author: 'Operator Desa Cikaret'
          },
          {
            id: 'n3',
            title: 'Sensus Perkebunan: Penyuluhan Standardisasi Mutu Latex Karet Bersama Asosiasi Daerah',
            shortDesc: 'Asosiasi Eksportir Latex mengadakan workshop pemrosesan getah karet bersih guna dongkrak harga komoditas Mekarjaya.',
            fullContent: [
              'Mekarjaya, Belitang Jaya — Kelesuan harga latex karet rakyat selama beberapa kuartal terakhir disikapi serius oleh pemerintah Desa Mekarjaya. Mengandalkan sinergi bersama tim riset perkebunan daerah, diselenggarakan sosialisasi cara menderes pohon karet yang baik serta pembersihan mangkok latex dari kotoran sisa serangga.',
              'Hasil getah karet yang bercampur air dan kotoran tanah menurunkan kadar karet kering (KKK), sehingga harganya jatuh di tingkat pengepul. Dengan bimbingan intensif ini, warga diajarkan memformulasikan asam pembeku organik cair.',
              'Ibu Siti Rahayu selaku Kepala Desa menekankan pentingnya kejujuran kualitas panen agar citra komoditas karet Mekarjaya di mata agen skala besar selalu terjaga bersih dan memperoleh nilai tawar optimal.',
              'Dalam jangka panjang, BUMDes Karet desa juga bersiap memfasilitasi gudang timbang mandiri agar hak petani terlindungi dari pemotongan timbangan spekulan.'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            villageName: 'Mekarjaya',
            category: 'Pertanian',
            date: '08 Jun 2025',
            author: 'Operator Desa Mekarjaya'
          },
          {
            id: 'n4',
            title: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Ciputat RKPD 2026',
            shortDesc: 'Perwakilan RT, RW dan tokoh agama berkumpul menetapkan prioritas pembangunan drainase guna pencegahan banjir berkala.',
            fullContent: [
              'Ciputat, Belitang Jaya — Bertempat di balai serbaguna desa, Pemerintah Desa Ciputat secara resmi menggelar Musyawarah Rencana Pembangunan Desa (Musrenbangdes) dalam rangka menyerap aspirasi pembangunan fisik untuk pagu anggaran tahun 2026.',
              'Rapat yang dipimpin langsung oleh Ahmad Fauzi ini menghasilkan kesepakatan krusial mengenai penanganan aliran pembuangan sanitasi rumah tangga guna mereduksi ancaman banjir genangan di kawasan pemukiman basah dekat rawa.',
              'Sebesar 40% alokasi dana desa tahun depan direncanakan dialokasikan ke pengerjaan beton jembatan swadaya dan drainase tertutup, disusul pembentukan waduk kontrol perikanan terpadu.',
              'Penyaluran ini diprioritaskan demi keberlangsungan sanitasi sehat di RT 01-RT 04 yang kerap menyumbang angka jentik nyamuk demam berdarah di kala musim hujan tiba.'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
            villageName: 'Ciputat',
            category: 'Pemerintahan',
            date: '03 Jun 2025',
            author: 'Operator Desa Ciputat'
          },
          {
            id: 'n5',
            title: 'Gotong Royong Sambut Musim Hujan: Perbaikan Jembatan Bambu Desa Margaasih',
            shortDesc: 'Sebanyak 80 relawan pemuda dan warga desa bergotong-royong merenovasi jembatan penghubung perkebunan hortikultura.',
            fullContent: [
              'Margaasih, Belitang Jaya — Rasa kekeluargaan yang kental ditunjukkan oleh warga Desa Margaasih. Menyambut datangnya siklus hujan lebat, warga berbondong-bondong membawa parang, bambu tali, dan tali kawat guna meninggikan instalasi jembatan penyeberangan sungai kecil yang menghubungkan dusun pemukiman dengan sentra kebun pisang kepok.',
              'Kepala Desa Dewi Kusuma dan jajaran sekdes turun langsung menyiapkan hidangan dapur umum bersama kader dawis untuk para pekerja bakti.',
              'Jembatan setinggi 6 meter ini berhasil diselesaikan dalam tempo sehari penuh, memastikan akses para petani tetap aman membawa hasil panen ke pasar kecamatan tanpa khawatir hanyut terbawa banjir bandang.',
              'Sikap tangguh kearifan lokal ini menjadi teladan penting pembinaan karakter pemuda desa.'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
            villageName: 'Margaasih',
            category: 'Lingkungan',
            date: '07 Jun 2025',
            author: 'Operator Desa Margaasih'
          },
          {
            id: 'n6',
            title: 'Puncak Festival Budaya: Padasuka Sukses Menyelenggarakan Pentas Seni Gending Angklung',
            shortDesc: 'Pagelaran luhur kesenian karawitan, gending sunda, dan tari bali simbol keharmonisan suku transmigrasi.',
            fullContent: [
              'Padasuka, Belitang Jaya — Menunjukkan keindahan toleransi dan asimilasi kultur harmonis di tanah Belitang Jaya, Desa Padasuka menyulap lapangan dusun utama menjadi panggung kemegahan festival seni tahunan.',
              'Kegiatan ini mementaskan kesenian Gending Sunda kolaborasi dengan tabuhan gamelan Bali yang dimainkan oleh anak-anak usia sekolah dasar setempat secara serempak.',
              'Nurul Hidayah menuturkan bahwa festival ini bukan hanya sekedar tontonan hiburan akhir pekan warga, namun komitmen luhur melestarikan akar budaya di tengah gempuran tren digital modern, sekaligus menjadi magnet pariwisata lokal pendukung ekonomi kreatif.',
              'Sajian kopi robusta gratis bagi penonton menambah antusiasme melimpahnya pengunjung dari luar daerah.'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
            villageName: 'Padasuka',
            category: 'Budaya',
            date: '09 Jun 2025',
            author: 'Operator Desa Padasuka'
          }
        ];

        // Search and filter inside the Portal Berita
        const [portalSearch, setPortalSearch] = useState('');
        const [portalFilterVillage, setPortalFilterVillage] = useState('Semua');

        const filteredPortalNews = DETAILED_NEWS_LIST.filter(item => {
          const matchSearch = item.title.toLowerCase().includes(portalSearch.toLowerCase()) || 
                              item.shortDesc.toLowerCase().includes(portalSearch.toLowerCase());
          const matchVillage = portalFilterVillage === 'Semua' || item.villageName === portalFilterVillage;
          return matchSearch && matchVillage;
        });

        // If a news article has been selected to read ("pindah halaman"), render the reader view:
        if (selectedNewsReader) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <button
                  onClick={() => setSelectedNewsReader(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  ← Kembali ke Portal Berita
                </button>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase rounded-full">
                    {selectedNewsReader.category}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase rounded-full">
                    Desa {selectedNewsReader.villageName}
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-4xl">
                <span className="font-mono text-xs text-slate-400 block">{selectedNewsReader.date} • Ditulis oleh {selectedNewsReader.author}</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {selectedNewsReader.title}
                </h2>
              </div>

              {/* Cover Image */}
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative bg-slate-100">
                <img
                  src={selectedNewsReader.imageUrl}
                  alt={selectedNewsReader.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Rich text body article */}
              <div className="prose max-w-4xl text-slate-700 text-sm md:text-base leading-relaxed space-y-5">
                {selectedNewsReader.fullContent.map((paragraph, index) => (
                  <p key={index} className="indent-4 md:indent-8">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Footer Author Card */}
              <div className="max-w-4xl p-5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-900 flex items-center justify-center rounded-full text-white text-sm font-black font-mono">
                  SBJ
                </div>
                <div>
                  <span className="block font-black text-slate-800 text-xs uppercase tracking-wide">
                    Redaksi Resmi Belitang Jaya
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Informasi terbitan ini telah dikonfirmasi sah kebenarannya oleh Pemerintah Desa {selectedNewsReader.villageName} dan Operator Sistem Informasi Kecamatan.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedNewsReader(null)}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Kembali ke Daftar Berita
                </button>
              </div>
            </motion.div>
          );
        }

        // Standard Portal Berita Grid listing view with beautiful filters:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-amber-300">Hub Portal Berita Desa Belitang Jaya</h3>
                <p className="text-xs text-slate-300">Akses rilis berita, pengumuman gotong-royong, dan liputan bermakna langsung dari rujukan terpercaya desa binaan.</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-center border border-white/10">
                  <span className="block text-xl font-bold font-mono text-amber-300">6</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 block font-semibold">Tautan Utama</span>
                </div>
              </div>
            </div>

            {/* Portal Filters */}
            <div className="p-4 bg-white rounded-2xl border border-slate-202 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={portalSearch}
                  onChange={(e) => setPortalSearch(e.target.value)}
                  placeholder="Cari berita berdasarkan judul..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-205 rounded-xl bg-slate-50/50 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={portalFilterVillage}
                  onChange={(e) => setPortalFilterVillage(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-205 rounded-xl bg-white font-semibold cursor-pointer text-slate-705 focus:outline-none"
                >
                  <option value="Semua">Asal Desa (Semua)</option>
                  {VILLAGES_DATA.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortalNews.map((news) => (
                <motion.div
                  key={news.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-202 shadow-xs hover:shadow-md transition duration-200 flex flex-col"
                >
                  <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden group">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="px-2.5 py-0.5 bg-blue-900/90 text-amber-300 text-[9px] font-black uppercase rounded-full">
                        {news.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold rounded-full">
                        {news.villageName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] text-slate-400 block">{news.date}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 hover:text-blue-700 transition leading-tight">
                        {news.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {news.shortDesc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold">{news.author}</span>
                      <button
                        onClick={() => setSelectedNewsReader(news)}
                        className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Baca Selengkapnya
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPortalNews.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-bold">Kabar berita tidak ditemukan</p>
                  <p className="text-xs">Silakan ganti kata kunci pencarian atau bersihkan filter desa binaan.</p>
                </div>
              )}
            </div>

            {/* Gallery documentation section */}
            <div className="space-y-4 pt-4">
              <h3 className="font-black text-slate-900 text-base">Album Dokumentasi Visual Kegiatan Desa Binaan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Panen Raya', id: 'photo-1574323347407-f5e1ad6d020b' },
                  { title: 'Gotong Royong', id: 'photo-1582213782179-e0d53f98f2ca' },
                  { title: 'Aktivitas Posyandu', id: 'photo-1516627145497-ae6968895b74' },
                  { title: 'Pelatihan UMKM', id: 'photo-1517048676732-d65bc937f952' }
                ].map((album, aIdx) => (
                  <div key={aIdx} className="bg-white border border-slate-205 rounded-2xl overflow-hidden relative group cursor-pointer shadow-xs">
                    <div className="aspect-video relative bg-slate-100 overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/photo-${album.id.split('photo-')[1]}?auto=format&fit=crop&w=200&q=85`}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-350"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition" />
                    </div>
                    <div className="p-3 text-xs bg-white">
                      <span className="font-black text-slate-800 block">{album.title} (Dokumentasi)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Juni 2025 • Belitang Jaya</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 6.3 KALENDER KEGIATAN */}
      {activeMainModule === 'berita_kegiatan' && activeSubTab === 'kalender' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900">&lt; Juni 2025 &gt;</h3>
                <span className="text-xs text-slate-400 font-medium">Bulan kalender operasional jajaran Belitang Jaya</span>
              </div>
              <CalendarDays className="w-5 h-5 text-slate-400" />
            </div>

            {/* Grid 7 days Sunday to Sat */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 border-b border-slate-100 pb-2">
              <div>Minggu</div>
              <div>Senin</div>
              <div>Selasa</div>
              <div>Rabu</div>
              <div>Kamis</div>
              <div>Jumat</div>
              <div>Sabtu</div>
            </div>

            {/* June 1 2025 starts on Sunday */}
            <div className="grid grid-cols-7 gap-1.5 text-xs text-left min-h-[280px]">
              {Array.from({ length: daysInJune }).map((_, dIdx) => {
                const dayNum = dIdx + 1;
                const eventsOnThisDay = juneEvents.filter((ev) => ev.date === dayNum);

                return (
                  <div
                    key={dIdx}
                    className="border border-slate-100 p-1.5 rounded bg-slate-50/40 relative flex flex-col justify-between min-h-[50px] group hover:bg-white hover:border-blue-300 transition"
                  >
                    <span className="font-bold font-mono text-slate-400">{dayNum}</span>
                    <div className="space-y-1 mt-1">
                      {eventsOnThisDay.map((ev, eIdx) => (
                        <button
                          key={eIdx}
                          onClick={() => setSelectedCalendarEvent({
                            date: dayNum,
                            title: ev.title,
                            village: ev.village,
                            location: ev.location,
                            desc: ev.desc
                          })}
                          className={`w-full text-left truncate block text-[9px] font-bold text-white px-1 py-0.5 rounded cursor-pointer ${ev.color} opacity-90`}
                          title={ev.title}
                        >
                          {ev.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Detail Side panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-205 shadow-sm flex flex-col justify-between">
            {selectedCalendarEvent ? (
              <div className="space-y-4">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                  Agenda Tanggal {selectedCalendarEvent.date} Juni 2025
                </span>
                <h4 className="font-extrabold text-slate-900 leading-tight">{selectedCalendarEvent.title}</h4>
                
                <div className="space-y-2 text-xs text-slate-650 font-medium">
                  <div>Tanggung Jawab: <span className="font-bold text-slate-800">{selectedCalendarEvent.village}</span></div>
                  <div>Instalasi Lokasi: <span className="font-bold text-slate-800">{selectedCalendarEvent.location}</span></div>
                </div>

                <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg leading-relaxed">
                  "{selectedCalendarEvent.desc}"
                </p>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-405 space-y-2 my-auto">
                <Calendar className="w-10 h-10 mx-auto text-slate-350 animate-pulse" />
                <p className="text-xs font-semibold">Silahkan klik salah satu event berwarna di kalender untuk ulasan rincian.</p>
              </div>
            )}

            {selectedCalendarEvent && (
              <button
                onClick={() => onShowNotification(`Agenda ${selectedCalendarEvent.title} ditambahkan ke pengingat lokal.`)}
                className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-xs"
              >
                Ingatkan Saya
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6.5 STATUS MANAJEMEN PUBLIKASI */}
      {activeMainModule === 'berita_kegiatan' && activeSubTab === 'publikasi' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
                placeholder="Cari rincian berita publikasi..."
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={newsFilterVillage}
                onChange={(e) => setNewsFilterVillage(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white font-semibold cursor-pointer text-slate-705"
              >
                <option value="Semua">Asal Desa (Semua)</option>
                {VILLAGES_DATA.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 font-medium">
                <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Jenis</th>
                    <th className="p-4">Asal Desa</th>
                    <th className="p-4">Isi Konten Berita</th>
                    <th className="p-4">Sensus Tanggal</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNews.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/50">
                      <td className="p-4 inline-flex items-center gap-1 mt-2 text-xs">
                        <Newspaper className="w-3.5 h-3.5 text-blue-700" /> {n.type}
                      </td>
                      <td className="p-4 font-bold text-slate-800">Desa {n.villageName}</td>
                      <td className="p-4 text-xs leading-relaxed max-w-[320px] truncate" title={n.detail}>{n.detail}</td>
                      <td className="p-4 font-mono text-xs text-slate-505">{n.date}</td>
                      <td className="p-4">{getStatusBadge(n.status)}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {n.status === 'Terbit' ? (
                            <button
                              onClick={() => publishNewsToggle(n.id, 'Arsip')}
                              className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-205 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Arsip
                            </button>
                          ) : (
                            <button
                              onClick={() => publishNewsToggle(n.id, 'Terbit')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-255 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Terbitkan
                            </button>
                          )}
                          <button
                            onClick={() => deleteNewsItem(n.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TIMELINE DIALOG MODAL --- */}
      {selectedOfficialTimeline && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-250 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-105 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">RIWAYAT REKAP KARIR/JABATAN</span>
                <h3 className="font-black text-slate-900 text-lg leading-tight">{selectedOfficialTimeline.name}</h3>
                <span className="text-xs text-blue-750 font-bold">{selectedOfficialTimeline.position} • Sukamaju</span>
              </div>
              <button
                onClick={() => setSelectedOfficialTimeline(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Vertical Timeline */}
            <div className="space-y-4 pl-4 relative border-l-2 border-blue-100 py-2 text-xs">
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-700 border-2 border-white box-content" />
                <span className="block font-bold text-slate-850">2021 - Sekarang</span>
                <p className="text-slate-500 mt-0.5">Kepala Desa Sukamaju (Bakti Periode I).</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white box-content" />
                <span className="block font-bold text-slate-850">2016 - 2021</span>
                <p className="text-slate-500 mt-0.5">Sekretaris Desa Sukamaju (Masa Transisi).</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white box-content" />
                <span className="block font-bold text-slate-850">2012 - 2016</span>
                <p className="text-slate-500 mt-0.5">Kepala Urusan Umum Desa Sukamaju.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white box-content" />
                <span className="block font-bold text-slate-850">2008 - 2012</span>
                <p className="text-slate-500 mt-0.5">Staf Bagian Pembukuan Pembantu.</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedOfficialTimeline(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs"
            >
              Tutup Ulasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
