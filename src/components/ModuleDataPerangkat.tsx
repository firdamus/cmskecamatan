/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, UserCheck, Briefcase, ToggleRight, Clock,
  ChevronLeft, Building2, CheckCircle, Phone, MapPin,
  Calendar, ArrowRight, Search, Filter, X, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSyncedState } from '../lib/useSyncedState';
import { publishPerangkatDesa } from '../lib/portalSync';
import { logActivity } from '../lib/activityLog';

interface ModuleDataPerangkatProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
}

type SubKey = '5.1' | '5.2' | '5.3' | '5.4' | '5.5';

const subTabs: { id: SubKey; label: string; icon: React.ElementType }[] = [
  { id: '5.1', label: 'Struktur Organisasi', icon: Users },
  { id: '5.2', label: 'Profil Perangkat',    icon: UserCheck },
  { id: '5.3', label: 'Job Desk',            icon: Briefcase },
  { id: '5.4', label: 'Status Keaktifan',    icon: ToggleRight },
  { id: '5.5', label: 'Riwayat Jabatan',     icon: Clock },
];

/* ── Per-desa org structures (berbeda tiap desa) ── */
const orgByDesa: Record<string, { id: string; label: string; name: string; level: number; jabatan: string }[]> = {
  Rejosari: [
    { id: 'kd',  label: 'Kepala Desa',       name: 'Suparno, S.Sos.',       level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Heru Prasetyo, S.E.',   level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Bpk. Joko Susilo',      level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Pelayanan',    name: 'Ibu Sumarni',           level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kasi Kesejahteraan',name: 'Bpk. Slamet Riyadi',    level: 2, jabatan: 'Pelaksana' },
    { id: 'k4',  label: 'Kaur Keuangan',     name: 'Ibu Sri Wahyuni',       level: 2, jabatan: 'Staf' },
    { id: 'k5',  label: 'Kaur Umum & TU',    name: 'Bpk. Wagiman',          level: 2, jabatan: 'Staf' },
    { id: 'k6',  label: 'Kadus I',           name: 'Pak Karno',             level: 3, jabatan: 'Kewilayahan' },
    { id: 'k7',  label: 'Kadus II',          name: 'Pak Paimin',            level: 3, jabatan: 'Kewilayahan' },
  ],
  'Argo Mulyo': [
    { id: 'kd',  label: 'Kepala Desa',       name: 'H. Suryanto, S.E.',    level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Agus Wahyudi, S.H.',   level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Drs. Bambang S.',      level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Pelayanan',    name: 'Ibu Siti Aminah',      level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kasi Kesejahteraan',name: 'Bpk. Faturrahman',     level: 2, jabatan: 'Pelaksana' },
    { id: 'k4',  label: 'Kaur Keuangan',     name: 'Nona Marlina, A.Md.',  level: 2, jabatan: 'Staf' },
    { id: 'k5',  label: 'Kaur Umum & TU',    name: 'Bpk. Hendra K.',       level: 2, jabatan: 'Staf' },
    { id: 'k6',  label: 'Kadus Dusun I',     name: 'Pak Rohman',           level: 3, jabatan: 'Kewilayahan' },
    { id: 'k7',  label: 'Kadus Dusun II',    name: 'Pak Saifudin',         level: 3, jabatan: 'Kewilayahan' },
  ],
  'Banjar Rejo': [
    { id: 'kd',  label: 'Kepala Desa',       name: 'Dra. Yuni Hartati',    level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Bpk. Irwan Setiawan',  level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Ibu Neni Kurniawati',  level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Pelayanan',    name: 'Bpk. Dodi Permana',    level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kaur Keuangan',     name: 'Ibu Winda Sari',       level: 2, jabatan: 'Staf' },
    { id: 'k4',  label: 'Kaur Umum',         name: 'Bpk. Rudi Hartono',    level: 2, jabatan: 'Staf' },
    { id: 'k5',  label: 'Kadus Mekar I',     name: 'Pak Sunaryo',          level: 3, jabatan: 'Kewilayahan' },
    { id: 'k6',  label: 'Kadus Mekar II',    name: 'Pak Edi Wahyono',      level: 3, jabatan: 'Kewilayahan' },
    { id: 'k7',  label: 'Kadus Mekar III',   name: 'Pak Sumardi',          level: 3, jabatan: 'Kewilayahan' },
  ],
  Girimulyo: [
    { id: 'kd',  label: 'Kepala Desa',       name: 'H. Maman Abdurrahman', level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Ibu Tati Suryati',     level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Bpk. Ujang Saepulloh', level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Pelayanan',    name: 'Ibu Eni Rohaeni',      level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kasi Kesejahteraan',name: 'Bpk. Asep Gunawan',    level: 2, jabatan: 'Pelaksana' },
    { id: 'k4',  label: 'Kaur Perencanaan',  name: 'Ibu Wati Nurhayati',   level: 2, jabatan: 'Staf' },
    { id: 'k5',  label: 'Kaur Keuangan',     name: 'Bpk. Deni Supriyadi',  level: 2, jabatan: 'Staf' },
    { id: 'k6',  label: 'Kadus Girimulyo A',   name: 'Pak Wahyu',            level: 3, jabatan: 'Kewilayahan' },
    { id: 'k7',  label: 'RT 01/001',          name: 'Pak Sutarno',          level: 4, jabatan: 'RT/RW' },
    { id: 'k8',  label: 'RW 001',             name: 'Pak Arifin',           level: 4, jabatan: 'RT/RW' },
  ],
  'Karya Makmur': [
    { id: 'kd',  label: 'Kepala Desa',       name: 'Ir. Dadang Kusmayadi', level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Bpk. Yayat Hidayat',   level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Ibu Lina Marlina',     level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Pelayanan',    name: 'Bpk. Agus Rahmat',     level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kaur Keuangan',     name: 'Ibu Dewi Lestari',     level: 2, jabatan: 'Staf' },
    { id: 'k4',  label: 'Kadus Karya Makmur',   name: 'Pak Suryana',          level: 3, jabatan: 'Kewilayahan' },
  ],
  'Madu Condo': [
    { id: 'kd',  label: 'Kepala Desa',       name: 'Bpk. Rahmat Hidayat',  level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Ibu Fitri Handayani',  level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Bpk. Haris Maulana',   level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Kesejahteraan',name: 'Ibu Sari Indah',       level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kaur Keuangan',     name: 'Bpk. Tono Wibowo',     level: 2, jabatan: 'Staf' },
    { id: 'k4',  label: 'Kaur Umum',         name: 'Ibu Rini Susanti',     level: 2, jabatan: 'Staf' },
    { id: 'k5',  label: 'Kadus Madu Condo',     name: 'Pak Yanto',            level: 3, jabatan: 'Kewilayahan' },
    { id: 'k6',  label: 'RT 01/001',          name: 'Pak Subur',            level: 4, jabatan: 'RT/RW' },
  ],
  Margokoyo: [
    { id: 'kd',  label: 'Kepala Desa',       name: 'Hj. Siti Romlah, S.Pd.', level: 0, jabatan: 'Pimpinan' },
    { id: 'sd',  label: 'Sekretaris Desa',   name: 'Bpk. Endang Suhendar', level: 1, jabatan: 'Sekretariat' },
    { id: 'k1',  label: 'Kasi Pemerintahan', name: 'Ibu Nining Sumarni',   level: 2, jabatan: 'Pelaksana' },
    { id: 'k2',  label: 'Kasi Pelayanan',    name: 'Bpk. Asep Saepudin',   level: 2, jabatan: 'Pelaksana' },
    { id: 'k3',  label: 'Kasi Kesejahteraan',name: 'Ibu Imas Komariah',    level: 2, jabatan: 'Pelaksana' },
    { id: 'k4',  label: 'Kaur Keuangan',     name: 'Bpk. Dudi Rustandi',   level: 2, jabatan: 'Staf' },
    { id: 'k5',  label: 'Kaur Perencanaan',  name: 'Ibu Euis Nurhasanah',  level: 2, jabatan: 'Staf' },
    { id: 'k6',  label: 'Kaur Umum',         name: 'Bpk. Yudi Permana',    level: 2, jabatan: 'Staf' },
    { id: 'k7',  label: 'Kadus Margokoyo I',  name: 'Pak Entis',            level: 3, jabatan: 'Kewilayahan' },
    { id: 'k8',  label: 'Kadus Margokoyo II', name: 'Pak Udin',             level: 3, jabatan: 'Kewilayahan' },
  ],
};

/* ── All staf across villages ── */
const allStafData = [
  { id: 's0',  nama: 'Suparno, S.Sos.',      jabatan: 'Kepala Desa',        nip: '19750608 200501 1 001', telp: '0812-0000-9001', alamat: 'Dusun I',    tmt: '2022-02-01', status: 'Aktif',    desa: 'Rejosari',  badge: 'Pimpinan'    },
  { id: 's0b', nama: 'Heru Prasetyo, S.E.',  jabatan: 'Sekretaris Desa',    nip: '19830417 200901 1 003', telp: '0813-0000-9002', alamat: 'Dusun I',    tmt: '2022-02-01', status: 'Aktif',    desa: 'Rejosari',  badge: 'Sekretariat' },
  { id: 's1',  nama: 'H. Suryanto, S.E.',    jabatan: 'Kepala Desa',        nip: '19780412 200801 1 003', telp: '0812-1111-0001', alamat: 'Dusun I',    tmt: '2021-03-01', status: 'Aktif',    desa: 'Argo Mulyo',  badge: 'Pimpinan'    },
  { id: 's2',  nama: 'Agus Wahyudi, S.H.',   jabatan: 'Sekretaris Desa',    nip: '19820715 200801 1 005', telp: '0813-2222-0002', alamat: 'Dusun I',    tmt: '2021-03-01', status: 'Aktif',    desa: 'Argo Mulyo',  badge: 'Sekretariat' },
  { id: 's3',  nama: 'Drs. Bambang S.',      jabatan: 'Kasi Pemerintahan',  nip: '19850903 201001 1 002', telp: '0814-3333-0003', alamat: 'Dusun II',   tmt: '2021-03-01', status: 'Aktif',    desa: 'Argo Mulyo',  badge: 'Pelaksana'   },
  { id: 's4',  nama: 'Dra. Yuni Hartati',    jabatan: 'Kepala Desa',        nip: '19790501 200601 2 001', telp: '0812-5555-1001', alamat: 'Dusun I',    tmt: '2021-04-01', status: 'Aktif',    desa: 'Banjar Rejo', badge: 'Pimpinan'    },
  { id: 's5',  nama: 'Bpk. Irwan Setiawan', jabatan: 'Sekretaris Desa',    nip: '19850210 200901 1 002', telp: '0813-6666-1002', alamat: 'Dusun II',   tmt: '2021-04-01', status: 'Aktif',    desa: 'Banjar Rejo', badge: 'Sekretariat' },
  { id: 's6',  nama: 'H. Maman Abdurrahman',jabatan: 'Kepala Desa',        nip: '19770315 200501 1 004', telp: '0812-7777-2001', alamat: 'Dusun I',    tmt: '2020-09-01', status: 'Aktif',    desa: 'Girimulyo',   badge: 'Pimpinan'    },
  { id: 's7',  nama: 'Ibu Tati Suryati',    jabatan: 'Sekretaris Desa',    nip: '19880120 201001 2 001', telp: '0814-8888-2002', alamat: 'Dusun I',    tmt: '2020-09-01', status: 'Aktif',    desa: 'Girimulyo',   badge: 'Sekretariat' },
  { id: 's8',  nama: 'Ir. Dadang Kusmayadi',jabatan: 'Kepala Desa',        nip: '19750820 200301 1 002', telp: '0812-9999-3001', alamat: 'Pusat',      tmt: '2022-01-01', status: 'Aktif',    desa: 'Karya Makmur', badge: 'Pimpinan'    },
  { id: 's9',  nama: 'Bpk. Rahmat Hidayat', jabatan: 'Kepala Desa',        nip: '19801210 200801 1 006', telp: '0815-1111-4001', alamat: 'Dusun I',    tmt: '2021-06-01', status: 'Aktif',    desa: 'Madu Condo',   badge: 'Pimpinan'    },
  { id: 's10', nama: 'Ibu Fitri Handayani', jabatan: 'Sekretaris Desa',    nip: '19900505 201501 2 003', telp: '0816-2222-4002', alamat: 'Dusun II',   tmt: '2021-06-01', status: 'Aktif',    desa: 'Madu Condo',   badge: 'Sekretariat' },
  { id: 's11', nama: 'Hj. Siti Romlah, S.Pd.',jabatan: 'Kepala Desa',    nip: '19760225 200401 2 001', telp: '0812-3333-5001', alamat: 'Pusat',      tmt: '2021-02-01', status: 'Aktif',    desa: 'Margokoyo',  badge: 'Pimpinan'    },
  { id: 's12', nama: 'Bpk. Endang Suhendar',jabatan: 'Sekretaris Desa',   nip: '19870710 201001 1 007', telp: '0817-4444-5002', alamat: 'Dusun I',    tmt: '2021-02-01', status: 'Aktif',    desa: 'Margokoyo',  badge: 'Sekretariat' },
  { id: 's13', nama: 'Pak Saifudin',         jabatan: 'Kepala Dusun II',   nip: '-',                     telp: '0811-9999-0009', alamat: 'Dusun II',   tmt: '2020-08-17', status: 'Nonaktif', desa: 'Argo Mulyo',  badge: 'Kewilayahan' },
];

const jobDesks = [
  { jabatan: 'Kepala Desa',         color: 'bg-blue-700',    items: ['Memimpin penyelenggaraan pemerintahan desa secara tertib dan transparan.','Mengangkat dan memberhentikan staf perangkat desa sesuai peraturan.','Memegang kekuasaan pengelolaan keuangan dan aset kas desa.','Menetapkan Peraturan Desa (Perdes) bersama BPD.','Menyusun dan melaporkan RPJMDes.'] },
  { jabatan: 'Sekretaris Desa',     color: 'bg-slate-700',   items: ['Membantu Kepala Desa di bidang kesekretariatan dan ketatausahaan.','Mengkoordinasikan kepala seksi dan kepala urusan setiap hari.','Mengelola arsip dokumen fisik dan digital secara tertib.','Menyusun kerangka laporan pertanggungjawaban APBDes.','Mengawasi kepatuhan SOP pelayanan administrasi desa.'] },
  { jabatan: 'Kasi Pemerintahan',   color: 'bg-indigo-600',  items: ['Membantu Kepala Desa dalam kebijakan tata pemerintahan lokal.','Mengurus administrasi mutasi kependudukan warga.','Mengelola pendaftaran sertifikasi pertanahan.','Membina kerukunan, ketertiban, dan keamanan warga.','Mengoordinasikan pemilihan RT/RW dan lembaga kemasyarakatan.'] },
  { jabatan: 'Kasi Pelayanan',      color: 'bg-indigo-500',  items: ['Mengelola pelayanan administratif kepada masyarakat.','Memproses surat keterangan domisili, kelahiran, dan kematian.','Mengoordinasikan program sosial bantuan warga tidak mampu.','Membantu pengelolaan data penerima PKH, BPJS, dan subsidi.','Memastikan waktu layanan surat maksimal 1x24 jam kerja.'] },
  { jabatan: 'Kasi Kesejahteraan',  color: 'bg-indigo-400',  items: ['Mengoordinasikan pemberdayaan dan peningkatan kesejahteraan masyarakat.','Memfasilitasi program posyandu, beasiswa, dan layanan kesehatan.','Mengelola data kelompok rentan: lansia, difabel, pra-sejahtera.','Mendampingi BUMDes dan kelompok usaha produktif desa.','Menyusun laporan perkembangan Indeks Desa Membangun (IDM).'] },
  { jabatan: 'Kaur Keuangan',       color: 'bg-emerald-700', items: ['Mencatat arus masuk dan keluar kas desa secara transparan.','Menyelenggarakan pembayaran gaji perangkat dan operasional.','Menyiapkan perpajakan dinas dan laporan keuangan bulanan.','Mengoperasikan Siskeudes sesuai regulasi.','Menyusun Rancangan APBDes dan laporan realisasi belanja.'] },
  { jabatan: 'Kaur Umum & TU',      color: 'bg-emerald-600', items: ['Mengelola sarana balai pertemuan dan fasilitas umum desa.','Mengurusi tata naskah dinas, surat masuk/keluar, dan arsip.','Mengelola inventaris perlengkapan kantor dan ATK.','Membantu administrasi kepegawaian (absensi, cuti, data diri).','Mengelola website dan media sosial resmi desa.'] },
  { jabatan: 'Kaur Perencanaan',    color: 'bg-teal-600',    items: ['Menyusun draft RKPDes tahunan secara terukur.','Menginventarisir usulan pembangunan dari tiap dusun melalui Musrenbangdes.','Menganalisis data potensi desa sebagai basis perencanaan.','Memantau dan mengevaluasi pelaksanaan program pembangunan.','Mengkoordinasikan input data desa ke sistem informasi pusat.'] },
  { jabatan: 'Kepala Dusun',        color: 'bg-violet-700',  items: ['Melaksanakan pemerintahan, pembangunan, dan kemasyarakatan di dusun.','Menjadi penghubung warga dusun dengan pemerintah desa.','Membantu distribusi bantuan sosial dan program pemerintah.','Memfasilitasi gotong royong dan musyawarah warga.','Melaporkan kondisi keamanan di wilayah dusun.'] },
];

const statusData = [
  { nama: 'H. Suryanto, S.E.',     jabatan: 'Kepala Desa',       desa: 'Argo Mulyo',  status: 'Aktif',    updated: '01 Mar 2021', alasan: '-' },
  { nama: 'Dra. Yuni Hartati',     jabatan: 'Kepala Desa',       desa: 'Banjar Rejo', status: 'Aktif',    updated: '01 Apr 2021', alasan: '-' },
  { nama: 'H. Maman Abdurrahman',  jabatan: 'Kepala Desa',       desa: 'Girimulyo',   status: 'Aktif',    updated: '01 Sep 2020', alasan: '-' },
  { nama: 'Ir. Dadang Kusmayadi',  jabatan: 'Kepala Desa',       desa: 'Karya Makmur', status: 'Aktif',    updated: '01 Jan 2022', alasan: '-' },
  { nama: 'Bpk. Rahmat Hidayat',   jabatan: 'Kepala Desa',       desa: 'Madu Condo',   status: 'Aktif',    updated: '01 Jun 2021', alasan: '-' },
  { nama: 'Hj. Siti Romlah, S.Pd.',jabatan: 'Kepala Desa',       desa: 'Margokoyo',  status: 'Aktif',    updated: '01 Feb 2021', alasan: '-' },
  { nama: 'Pak Saifudin',           jabatan: 'Kepala Dusun II',   desa: 'Argo Mulyo',  status: 'Nonaktif', updated: '30 Des 2023', alasan: 'Habis Masa Jabatan' },
  { nama: 'Bpk. Irwan Setiawan',   jabatan: 'Sekretaris Desa',   desa: 'Banjar Rejo', status: 'Aktif',    updated: '01 Apr 2021', alasan: '-' },
];

const riwayatData = [
  { tahun: '2024', jabatan: 'Kepala Dusun II',    desa: 'Argo Mulyo',  pejabat: 'Pak Hendra (Plt.)',     keterangan: 'Penunjukan Plt. menggantikan Pak Saifudin' },
  { tahun: '2023', jabatan: 'Kepala Dusun II',    desa: 'Argo Mulyo',  pejabat: 'Pak Saifudin',          keterangan: 'Habis masa jabatan 3 tahun' },
  { tahun: '2022', jabatan: 'Kepala Desa',         desa: 'Karya Makmur', pejabat: 'Ir. Dadang Kusmayadi', keterangan: 'Terpilih melalui Pilkades serentak' },
  { tahun: '2021', jabatan: 'Kepala Desa',         desa: 'Argo Mulyo',  pejabat: 'H. Suryanto, S.E.',    keterangan: 'Terpilih dalam Pilkades serentak' },
  { tahun: '2021', jabatan: 'Kepala Desa',         desa: 'Banjar Rejo', pejabat: 'Dra. Yuni Hartati',    keterangan: 'Terpilih dalam Pilkades serentak' },
  { tahun: '2020', jabatan: 'Kepala Desa',         desa: 'Girimulyo',   pejabat: 'H. Maman Abdurrahman', keterangan: 'Terpilih melalui musyawarah desa' },
  { tahun: '2019', jabatan: 'Sekretaris Desa',     desa: 'Argo Mulyo',  pejabat: 'Agus Wahyudi, S.H.',   keterangan: 'Mutasi dari Desa Banjar Rejo' },
];

const desaList = ['Rejosari', 'Argo Mulyo', 'Banjar Rejo', 'Girimulyo', 'Karya Makmur', 'Madu Condo', 'Margokoyo'];
const badgeColors: Record<string, string> = {
  'Pimpinan':    'bg-blue-100 text-blue-800 border border-blue-200',
  'Sekretariat': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Pelaksana':   'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'Staf':        'bg-emerald-100 text-emerald-800 border border-emerald-200',
  'Kewilayahan': 'bg-violet-100 text-violet-800 border border-violet-200',
  'RT/RW':       'bg-rose-100 text-rose-800 border border-rose-200',
};
const levelColors = [
  'bg-amber-50 border-amber-300 text-amber-900',
  'bg-blue-50 border-blue-300 text-blue-900',
  'bg-indigo-50 border-indigo-300 text-indigo-900',
  'bg-slate-50 border-slate-300 text-slate-700',
  'bg-rose-50 border-rose-300 text-rose-700',
];
const avatarColors = ['bg-blue-600','bg-indigo-600','bg-emerald-600','bg-amber-600','bg-violet-600','bg-rose-600','bg-teal-600','bg-orange-600','bg-cyan-600'];

export const ModuleDataPerangkat: React.FC<ModuleDataPerangkatProps> = ({ onShowNotification, userRole, operatorVillage }) => {
  const [activeTab, setActiveTab] = useState<SubKey>('5.1');
  const [openJobDesk, setOpenJobDesk] = useState<string | null>('Kepala Desa');
  const [selectedStaf, setSelectedStaf] = useState<typeof allStafData[0] | null>(null);

  // Data perangkat kini tersinkron lewat Data Server Lokal: Admin & Operator
  // melihat data yang sama, dan perangkat aktif Desa Rejosari otomatis
  // tampil di Portal Rejosari (menu Tentang Desa > Pejabat).
  const [stafList, setStafList] = useSyncedState('kec_staf', allStafData);

  useEffect(() => {
    publishPerangkatDesa(stafList);
  }, [stafList]);

  // Filter/Search state — Admin sees all desa, Operator sees only their own
  const [filterDesa, setFilterDesa]   = useState<string>(userRole === 'Operator' ? (operatorVillage || 'Rejosari') : 'Rejosari');
  const [searchNama, setSearchNama]   = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
  const [filterBadge, setFilterBadge]  = useState('Semua');

  // Modal Tambah Perangkat
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ nama:'', jabatan:'', nip:'', telp:'', alamat:'', tmt:'', desa: filterDesa });

  const isOperator = userRole === 'Operator';
  const activeDesa = isOperator ? (operatorVillage || 'Rejosari') : filterDesa;

  // Current org nodes for selected desa
  const orgNodes = orgByDesa[activeDesa] || orgByDesa['Rejosari'];
  const byLevel = [0,1,2,3,4].map(l => orgNodes.filter(n => n.level === l)).filter(g => g.length > 0);

  // Filtered staf
  const filteredStaf = useMemo(() => {
    return stafList.filter(s => {
      const matchDesa   = s.desa === activeDesa;
      const matchSearch = searchNama === '' || s.nama.toLowerCase().includes(searchNama.toLowerCase()) || s.jabatan.toLowerCase().includes(searchNama.toLowerCase());
      const matchStatus = filterStatus === 'Semua' || s.status === filterStatus;
      const matchBadge  = filterBadge === 'Semua' || s.badge === filterBadge;
      return matchDesa && matchSearch && matchStatus && matchBadge;
    });
  }, [stafList, activeDesa, searchNama, filterStatus, filterBadge]);

  const handleAddSubmit = () => {
    if (!addForm.nama || !addForm.jabatan) { onShowNotification('Nama dan jabatan wajib diisi.'); return; }
    const newStaf = {
      id: `s_new_${Date.now()}`,
      nama: addForm.nama,
      jabatan: addForm.jabatan,
      nip: addForm.nip || '-',
      telp: addForm.telp || '-',
      alamat: addForm.alamat || '-',
      tmt: addForm.tmt || new Date().toISOString().slice(0,10),
      status: 'Aktif',
      desa: addForm.desa || activeDesa,
      badge: addForm.jabatan.toLowerCase().includes('kepala desa') ? 'Pimpinan'
        : addForm.jabatan.toLowerCase().includes('sekretaris') ? 'Sekretariat'
        : addForm.jabatan.toLowerCase().includes('kasi') ? 'Pelaksana'
        : addForm.jabatan.toLowerCase().includes('kadus') || addForm.jabatan.toLowerCase().includes('dusun') ? 'Kewilayahan'
        : 'Staf'
    };
    setStafList(prev => [newStaf, ...prev]);
    onShowNotification(`Perangkat baru "${addForm.nama}" (${addForm.jabatan}) berhasil ditambahkan ke Desa ${newStaf.desa}.`);
    logActivity({
      villageName: newStaf.desa,
      type: 'Update Perangkat',
      detail: `Perangkat baru ditambahkan: ${addForm.nama} (${addForm.jabatan}).`,
      category: 'Pemerintahan',
      status: 'Terbit',
    });
    setShowAddModal(false);
    setAddForm({ nama:'', jabatan:'', nip:'', telp:'', alamat:'', tmt:'', desa: activeDesa });
  };

  return (
    <div className="space-y-0">
      {/* Header + Tab Bar */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-3xl shadow-xl relative overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
        <div className="relative z-10 p-6 pb-0">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Modul 5</span>
                <h2 className="text-xl font-black text-white leading-tight">Data Perangkat Desa</h2>
              </div>
            </div>
            {/* Filter Desa (Admin only) */}
            {!isOperator && (
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] text-slate-300 font-bold">Desa:</span>
                <select
                  value={filterDesa}
                  onChange={e => setFilterDesa(e.target.value)}
                  className="bg-transparent text-white text-xs font-extrabold outline-none cursor-pointer"
                >
                  {desaList.map(d => <option key={d} value={d} className="text-slate-900">{d}</option>)}
                </select>
              </div>
            )}
            {isOperator && (
              <span className="text-xs text-amber-300 font-bold bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
                📍 Desa {activeDesa}
              </span>
            )}
          </div>
          {/* Sub-tabs */}
          <div className="flex gap-2 pb-5 overflow-x-auto scrollbar-hide">
            {subTabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setSelectedStaf(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}>
                  <Icon className="w-3 h-3" />{t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── 5.1 STRUKTUR ORGANISASI ── */}
        {activeTab === '5.1' && (
          <motion.div key={`5.1-${activeDesa}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Bagan Struktur Pemerintahan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Desa <strong>{activeDesa}</strong> — {orgNodes.length} jabatan terdaftar</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Tambah Jabatan
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(badgeColors).map(([k,v]) => (
                  <span key={k} className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${v}`}>{k}</span>
                ))}
              </div>

              {/* Org chart per level */}
              {byLevel.map((nodes, lvl) => (
                <div key={lvl} className={`${lvl > 0 ? 'border-t border-slate-100 pt-4' : ''}`}>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">
                    {['Pimpinan','Sekretariat','Pelaksana / Staf','Kewilayahan','RT / RW'][lvl] || `Level ${lvl}`}
                  </span>
                  <div className="flex flex-wrap justify-center gap-3">
                    {nodes.map(n => (
                      <div key={n.id} className={`flex flex-col items-center border rounded-xl p-3 min-w-[130px] text-center ${levelColors[lvl] || levelColors[4]}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-xs mb-2 ${avatarColors[n.id.length % avatarColors.length]}`}>
                          {n.name.split(' ').map((w:string) => w[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 leading-tight">{n.label}</span>
                        <span className="text-xs font-bold mt-0.5 leading-tight">{n.name}</span>
                        <span className={`mt-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${badgeColors[n.jabatan] || 'bg-slate-100 text-slate-600'}`}>{n.jabatan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 5.2 PROFIL PERANGKAT LIST ── */}
        {activeTab === '5.2' && !selectedStaf && (
          <motion.div key="5.2-list" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            {/* Filter & Search Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input value={searchNama} onChange={e=>setSearchNama(e.target.value)} placeholder="Cari nama atau jabatan..." className="flex-1 min-w-[180px] text-xs outline-none text-slate-700"/>
                <button onClick={()=>{setSearchNama('');setFilterStatus('Semua');setFilterBadge('Semua');}} className="text-[10px] text-slate-400 hover:text-slate-700 font-bold cursor-pointer flex items-center gap-1">
                  <X className="w-3 h-3"/>Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3 h-3 text-slate-400"/>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status:</span>
                </div>
                {(['Semua','Aktif','Nonaktif'] as const).map(s => (
                  <button key={s} onClick={()=>setFilterStatus(s)} className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer transition ${filterStatus===s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{s}</button>
                ))}
                <span className="text-slate-200">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kelompok:</span>
                </div>
                {(['Semua','Pimpinan','Sekretariat','Pelaksana','Staf','Kewilayahan'] as const).map(b => (
                  <button key={b} onClick={()=>setFilterBadge(b)} className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer transition ${filterBadge===b ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{b}</button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Menampilkan <strong>{filteredStaf.length}</strong> perangkat Desa {activeDesa}</span>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer">
                  <Plus className="w-3 h-3"/>Tambah Perangkat
                </button>
              </div>
            </div>

            {filteredStaf.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-bold bg-white rounded-2xl border border-slate-200">
                Tidak ada perangkat yang cocok dengan filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaf.map((s, idx) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
                    <div className={`h-2 ${avatarColors[idx % avatarColors.length]}`} />
                    <div className="p-5 flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                          {s.nama.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{s.nama}</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">{s.jabatan}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeColors[s.badge]}`}>{s.badge}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${s.status==='Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>{s.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400"/>Desa {s.desa}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400"/>{s.telp}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400"/>TMT: {s.tmt}</div>
                      </div>
                    </div>
                    <div className="px-5 pb-4">
                      <button onClick={()=>setSelectedStaf(s)} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5"/>Lihat Detail Profil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── 5.2 PROFIL DETAIL ── */}
        {activeTab === '5.2' && selectedStaf && (() => {
          const idx = allStafData.findIndex(s=>s.id===selectedStaf.id);
          return (
            <motion.div key="5.2-detail" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0}}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className={`h-24 ${avatarColors[idx % avatarColors.length]} relative`}>
                  <button onClick={()=>setSelectedStaf(null)} className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition">
                    <ChevronLeft className="w-3.5 h-3.5"/>Kembali
                  </button>
                </div>
                <div className="px-8 pb-8">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl -mt-10 border-4 border-white shadow-md ${avatarColors[idx % avatarColors.length]}`}>
                    {selectedStaf.nama.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}
                  </div>
                  <div className="mt-4 space-y-1">
                    <h2 className="font-black text-slate-900 text-2xl">{selectedStaf.nama}</h2>
                    <p className="text-slate-500 font-semibold">{selectedStaf.jabatan} — Desa {selectedStaf.desa}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${badgeColors[selectedStaf.badge]}`}>{selectedStaf.badge}</span>
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${selectedStaf.status==='Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}><CheckCircle className="w-3 h-3 inline mr-1"/>{selectedStaf.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {[{label:'NIP',value:selectedStaf.nip},{label:'No. Telepon',value:selectedStaf.telp},{label:'Alamat',value:selectedStaf.alamat},{label:'Desa Bertugas',value:`Desa ${selectedStaf.desa}`},{label:'TMT Jabatan',value:selectedStaf.tmt},{label:'Status',value:selectedStaf.status}].map(row=>(
                      <div key={row.label} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{row.label}</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>onShowNotification(`Menghubungi ${selectedStaf.nama} via WhatsApp...`)} className="mt-6 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl cursor-pointer transition">
                    <Phone className="w-4 h-4"/>Hubungi via WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* ── 5.3 JOB DESK ── */}
        {activeTab === '5.3' && (
          <motion.div key="5.3" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600">
              Uraian tupoksi masing-masing jabatan sesuai <strong>Permendagri No. 67 Tahun 2017</strong>. Berlaku sebagai template untuk semua desa.
            </div>
            {jobDesks.map(jd => (
              <div key={jd.jabatan} className={`rounded-2xl border-2 overflow-hidden ${openJobDesk===jd.jabatan ? 'border-slate-300 shadow-md' : 'border-slate-200'}`}>
                <button onClick={()=>setOpenJobDesk(openJobDesk===jd.jabatan ? null : jd.jabatan)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${jd.color}`}><Briefcase className="w-4 h-4"/></div>
                    <span className="font-extrabold text-slate-900">{jd.jabatan}</span>
                  </div>
                  <span className="text-slate-400">{openJobDesk===jd.jabatan ? '▲' : '▼'}</span>
                </button>
                <AnimatePresence>
                  {openJobDesk===jd.jabatan && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-2">
                      {jd.items.map((item,i)=>(
                        <div key={i} className="flex items-start gap-3 text-xs text-slate-700">
                          <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 ${jd.color}`}>{i+1}</div>
                          <p className="leading-relaxed">{item}</p>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-slate-200">
                        <button onClick={()=>onShowNotification(`Dokumen SK Tupoksi ${jd.jabatan} berhasil diunduh.`)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2 rounded-lg cursor-pointer">↓ Unduh SK Tupoksi</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── 5.4 STATUS KEAKTIFAN ── */}
        {activeTab === '5.4' && (
          <motion.div key="5.4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900">Status Keaktifan Perangkat Desa</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Desa {activeDesa} — perbarui status aktif perangkat secara real-time.</p>
                </div>
                <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer">
                  <Plus className="w-3.5 h-3.5"/>Tambah
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-4">Nama Perangkat</th>
                      <th className="p-4">Jabatan</th>
                      <th className="p-4">Desa</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Diperbarui</th>
                      <th className="p-4">Keterangan</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {statusData.filter(s => !isOperator || s.desa === activeDesa).map((s,i)=>(
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="p-4 font-bold text-slate-900">{s.nama}</td>
                        <td className="p-4">{s.jabatan}</td>
                        <td className="p-4 text-slate-500">{s.desa}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${s.status==='Aktif'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{s.status}</span></td>
                        <td className="p-4 text-slate-400">{s.updated}</td>
                        <td className="p-4 italic text-slate-400">{s.alasan==='-'?'—':s.alasan}</td>
                        <td className="p-4 text-center"><button onClick={()=>onShowNotification(`Status ${s.nama} berhasil diperbarui.`)} className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-extrabold rounded-lg cursor-pointer">Ubah Status</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 5.5 RIWAYAT JABATAN ── */}
        {activeTab === '5.5' && (
          <motion.div key="5.5" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-slate-900">Timeline Riwayat Perubahan Jabatan</h3>
                {!isOperator && (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                    <Filter className="w-3 h-3 text-slate-400"/>
                    <span className="text-slate-500 font-bold">Tampilkan:</span>
                    <span className="font-extrabold text-slate-900">Semua Desa</span>
                  </div>
                )}
              </div>
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                {riwayatData.filter(r => !isOperator || r.desa === activeDesa).map((r,i)=>(
                  <div key={i} className="relative">
                    <div className="absolute -left-[29px] w-5 h-5 rounded-full bg-blue-700 border-4 border-white shadow flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white"/></div>
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{r.tahun}</span>
                        <div className="flex gap-1.5">
                          <span className="text-[10px] font-bold text-slate-500">{r.jabatan}</span>
                          <span className="text-[10px] text-slate-300">·</span>
                          <span className="text-[10px] font-bold text-indigo-600">Desa {r.desa}</span>
                        </div>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{r.pejabat}</h4>
                      <p className="text-xs text-slate-500 italic">{r.keterangan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL TAMBAH PERANGKAT ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale:0.95,y:10}} animate={{scale:1,y:0}} exit={{scale:0.95,y:10}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2"><Plus className="w-4 h-4 text-blue-700"/>Tambah Data Perangkat</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Desa {activeDesa}</p>
                </div>
                <button onClick={()=>setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-700"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                {[
                  {label:'Nama Lengkap *',    key:'nama',    placeholder:'Contoh: H. Ahmad Fauzi, S.E.'},
                  {label:'Jabatan *',          key:'jabatan', placeholder:'Contoh: Kepala Desa'},
                  {label:'NIP',                key:'nip',     placeholder:'Opsional'},
                  {label:'No. Telepon',        key:'telp',    placeholder:'Contoh: 0812-xxxx-xxxx'},
                  {label:'Alamat',             key:'alamat',  placeholder:'Dusun / RT / RW'},
                  {label:'TMT (Tanggal Mulai)',key:'tmt',     placeholder:'YYYY-MM-DD'},
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">{f.label}</label>
                    <input
                      value={(addForm as any)[f.key]}
                      onChange={e=>setAddForm(prev=>({...prev,[f.key]:e.target.value}))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                ))}
                {!isOperator && (
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Desa Penugasan</label>
                    <select value={addForm.desa} onChange={e=>setAddForm(prev=>({...prev,desa:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                      {desaList.map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 p-5 border-t border-slate-100">
                <button onClick={()=>setShowAddModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer transition">Batal</button>
                <button onClick={handleAddSubmit} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl cursor-pointer transition">Simpan Perangkat</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
