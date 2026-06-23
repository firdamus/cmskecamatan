/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { logoBase64 } from './assets_logo';
import {
  LogOut,
  LayoutDashboard,
  Map,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Users,
  Newspaper,
  Layers,
  Building2,
  FileText,
  Lock,
  Bell,
  Sun,
  X,
  Compass,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { ModuleDashboardKecamatan } from './components/ModuleDashboardKecamatan';
import { ModuleDataDesa } from './components/ModuleDataDesa';
import { ModuleKomoditasLapak } from './components/ModuleKomoditasLapak';
import { ModulePerangkatBerita } from './components/ModulePerangkatBerita';
import { ModuleDataPerangkat } from './components/ModuleDataPerangkat';
import { ModuleBeritaKegiatan } from './components/ModuleBeritaKegiatan';
import { ModuleAdminCapabilities } from './components/ModuleAdminCapabilities';
import { ModulePengaturanOperator } from './components/ModulePengaturanOperator';
import { ModuleAsetPengguna } from './components/ModuleAsetPengguna';
import { ModuleOperatorBeranda } from './components/ModuleOperatorBeranda';

const subModulesMapAdmin: Record<string, { groupName: string; items: { id: string; name: string; main: string }[] }[]> = {
  peta_spasial: [
    {
      groupName: 'Spasial dan Geografis',
      items: [
        { id: 'peta', name: 'Peta Spasial Desa', main: 'peta_spasial' }
      ]
    }
  ],
  dashboard: [
    {
      groupName: 'Ringkasan Eksekutif',
      items: [
        { id: 'statistik', name: 'Statistik Kecamatan', main: 'dashboard' },
        { id: 'kelengkapan', name: 'Status Kelengkapan', main: 'dashboard' },
        { id: 'aktivitas', name: 'Rekap Aktivitas Swadaya', main: 'dashboard' },
        { id: 'rekap_komoditas', name: 'Rekap Komoditas Unggulan', main: 'dashboard' }
      ]
    }
  ],
  profil_desa: [
    {
      groupName: 'Profil Desa',
      items: [
        { id: 'daftar', name: 'Daftar Desa', main: 'profil_desa' },
        { id: 'web', name: 'Status Web Desa', main: 'profil_desa' },
        { id: 'catatan', name: 'Catatan Kecamatan', main: 'profil_desa' }
      ]
    }
  ],
  monografi: [
    {
      groupName: 'Monografi Desa',
      items: [
        { id: 'kependudukan', name: 'Data Kependudukan', main: 'monografi' },
        { id: 'sosial_ekonomi', name: 'Data Sosial Ekonomi', main: 'monografi' },
        { id: 'sarana', name: 'Sarana Prasarana', main: 'monografi' },
        { id: 'luas_wilayah', name: 'Luas Wilayah', main: 'monografi' }
      ]
    }
  ],
  komoditas: [
    {
      groupName: 'Komoditas Desa',
      items: [
        { id: 'daftar', name: 'Daftar Komoditas', main: 'komoditas' },
        { id: 'kategori', name: 'Kategori dan Unggulan', main: 'komoditas' },
        { id: 'sebaran', name: 'Sebaran Komoditas Matriks', main: 'komoditas' }
      ]
    }
  ],
  lapak_desa: [
    {
      groupName: 'Lapak Desa',
      items: [
        { id: 'rekap', name: 'Rekap dan Pelapak', main: 'lapak_desa' },
        { id: 'katalog', name: 'Katalog Lapak Pasar', main: 'lapak_desa' },
        { id: 'unggulan', name: 'Produk Pilihan Unggulan', main: 'lapak_desa' }
      ]
    }
  ],
  perangkat: [],
  berita: [],
  aset: [
    {
      groupName: 'Aset Milik Desa',
      items: [
        { id: 'tanah', name: 'Tanah Milik Desa', main: 'aset' },
        { id: 'bangunan', name: 'Bangunan Milik Desa', main: 'aset' },
        { id: 'inventaris', name: 'Inventaris Barang', main: 'aset' },
        { id: 'peta_geo', name: 'Geo Tagging Aset', main: 'aset' },
        { id: 'upload_berkas', name: 'Unggah Dokumen Sertifikat', main: 'aset' }
      ]
    }
  ],
  pengguna: [
    {
      groupName: 'Panduan Admin',
      items: [
        { id: 'admin_capabilities', name: 'Apa yang Bisa Admin Lakukan?', main: 'pengguna' }
      ]
    },
    {
      groupName: 'Pengguna dan Hak Akses',
      items: [
        { id: 'manajemen_akun', name: 'Manajemen Akun', main: 'pengguna' },
        { id: 'role_perm', name: 'Matrix Skenario Akses', main: 'pengguna' },
        { id: 'pembatasan', name: 'Pembatasan Wilayah Desa', main: 'pengguna' },
        { id: 'reset_pass', name: 'Ganti Sandi Pengguna', main: 'pengguna' },
        { id: 'audit_log', name: 'Audit Log Aktivitas', main: 'pengguna' }
      ]
    }
  ]
};

const subModulesMapOperator: Record<string, { groupName: string; items: { id: string; name: string; main: string }[] }[]> = {
  profil_monografi: [
    {
      groupName: 'Sensus & Administratif',
      items: [
        { id: 'detail', name: 'Identitas Profil Desa', main: 'profil_desa' },
        { id: 'kependudukan', name: 'Data Kependudukan', main: 'monografi' },
        { id: 'sosial_ekonomi', name: 'Data Sosial Ekonomi', main: 'monografi' },
        { id: 'sarana', name: 'Sarana & Prasarana', main: 'monografi' },
        { id: 'web', name: 'Status Web Desa', main: 'profil_desa' }
      ]
    }
  ],
  pemerintahan_desa: [],
  potensi_desa: [
    {
      groupName: 'Potensi Sektoral',
      items: [
        { id: 'daftar', name: 'Komoditas Desa', main: 'komoditas' },
        { id: 'kategori', name: 'Kategori Unggulan', main: 'komoditas' },
        { id: 'sebaran', name: 'Matriks Sebaran Tani', main: 'komoditas' },
        { id: 'katalog', name: 'Katalog Produk UMKM', main: 'lapak_desa' },
        { id: 'unggulan', name: 'Produk Unggulan UMKM', main: 'lapak_desa' }
      ]
    }
  ],
  informasi_publik: [],
  aset_desa: [
    {
      groupName: 'Tanah & Inventaris',
      items: [
        { id: 'tanah', name: 'Tanah Milik Desa', main: 'aset' },
        { id: 'bangunan', name: 'Bangunan Milik Desa', main: 'aset' },
        { id: 'inventaris', name: 'Inventaris Barang', main: 'aset' },
        { id: 'peta_geo', name: 'Geo Tagging Spasial', main: 'aset' },
        { id: 'upload_berkas', name: 'Unggah Berkas Sertifikat', main: 'aset' }
      ]
    }
  ],
  pengaturan: [
    {
      groupName: 'Pengaturan Akun',
      items: [
        { id: 'profil_akun', name: 'Profil & Data Akun', main: 'pengaturan' },
        { id: 'ubah_password', name: 'Ubah Password', main: 'pengaturan' }
      ]
    }
  ]
};

const moduleHeaderInfo: Record<string, { title: string; subtitle: string }> = {
  peta_spasial: {
    title: 'Monitoring Peta Spasial Desa',
    subtitle: 'Sistem Informasi Geografi dan Pemetaan Batas Teritorial Wilayah Binaan'
  },
  dashboard: {
    title: 'Dashboard Eksekutif Kecamatan',
    subtitle: 'Kompilasi Visual Agregat, Aktivitas Swadaya, dan Tingkat Kepatuhan Desa'
  },
  profil_desa: {
    title: 'Profil Administratif Desa',
    subtitle: 'Status Legalitas Wilayah, Sensus Kependudukan, Kepala Desa, dan Web Desa'
  },
  monografi: {
    title: 'Statistik Monografi Desa',
    subtitle: 'Ulasan Visual Sebaran Demografi, Sosial Ekonomi, dan Sarana Prasarana'
  },
  komoditas: {
    title: 'Komoditas Sektoral Unggulan',
    subtitle: 'Pemetaan Potensi Komoditas Tani, Perkebunan, Peternakan, dan Kerajinan Warga'
  },
  lapak_desa: {
    title: 'Lapak Niaga Digital Desa',
    subtitle: 'Katalog Promosi Wirausaha Ekonomi Kreatif dan Produk Unggulan UMKM Mandiri'
  },
  perangkat: {
    title: 'Kelembagaan & Perangkat Desa',
    subtitle: 'Struktur Organisasi Pemerintahan Desa Binaan dan Roda Kepengurusan'
  },
  berita: {
    title: 'Berita & Kalender Kegiatan Desa',
    subtitle: 'Pusat Publikasi Berita Swadaya, Rilis Aktual, dan Rencana Agenda Desa'
  },
  aset: {
    title: 'Pencatatan Aset Milik Desa',
    subtitle: 'Manajemen Sertifikasi Tanah, Bangunan Inventaris, dan Regulasi Kepemilikan'
  },
  pengguna: {
    title: 'Manajemen Hak Akses Portal',
    subtitle: 'Pengaturan Akun Pelapor Mandiri, Matriks Skenario Hak Akses, dan Log Audit'
  },
  // Operator specific headers
  operator_beranda: {
    title: 'Beranda Dashboard Administrasi Desa',
    subtitle: 'Rangkuman Status Web Desa, Kependudukan, Sektor Lapak UMKM, dan Aset Binaan'
  },
  profil_monografi: {
    title: 'Profil & Rekap Monografi Desa',
    subtitle: 'Informasi Kependudukan, Sensus Sektoral, Sosial Budaya, dan Sarana Prasarana Work'
  },
  pemerintahan_desa: {
    title: 'Kelembagaan & Pemerintahan Desa',
    subtitle: 'Struktur Organisasi Pemerintah Desa Binaan, Job Desk, dan Profil Kantor Kantor'
  },
  potensi_desa: {
    title: 'Komoditas Sektoral & Lapak Niaga BUMDes',
    subtitle: 'Daftar Potensi Tani Terpilih Serta Katalog Promosi UMKM Kreatif Warga'
  },
  informasi_publik: {
    title: 'Pusat Berita & Informasi Publik',
    subtitle: 'Publikasi Kegiatan, Galeri Swadaya Warga, dan Agenda Kalender Mendatang'
  },
  aset_desa: {
    title: 'E-Aset & Sertifikasi Milik Desa',
    subtitle: 'Pencatatan Bidang Tanah, Kondisi Inventaris, dan Geo-tagging Geografis'
  },
  pengaturan: {
    title: 'Pengaturan Sesi & Keamanan Akun',
    subtitle: 'Kelola Profil Operator Mandiri, Log Audit Aktivitas, dan Ganti Kata Sandi'
  }
};

type Screen = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');
  const [userRole, setUserRole] = useState<'Admin' | 'Operator'>('Admin');
  const [operatorVillage, setOperatorVillage] = useState<string>('Rejosari');
  const [operatorEmail, setOperatorEmail] = useState<string>('admin@kecamatan.go.id');

  // Active module in the admin dashboard panel
  const [activeModule, setActiveModule] = useState<string>('peta_spasial');

  // Independent expanded modules state for foldered/dynamic dropdown chevrons
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    dashboard: false,
    profil_desa: false,
    monografi: false,
    komoditas: false,
    lapak_desa: false,
    perangkat: false,
    berita: false,
    aset: false,
    pengguna: false,
    // Operator Specific Menu Expands
    profil_monografi: false,
    pemerintahan_desa: false,
    potensi_desa: false,
    informasi_publik: false,
    aset_desa: false,
    pengaturan: false
  });

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    if (moduleId !== 'peta_spasial' && moduleId !== 'operator_beranda') {
      setExpandedModules((prev) => ({
        ...prev,
        [moduleId]: !prev[moduleId]
      }));
    }
  };

  // Nested sub-tab states for each main module to orchestrate complete sidebar control
  const [subTabStates, setSubTabStates] = useState<Record<string, { main: any; sub: string }>>({
    peta_spasial: { main: 'peta_spasial', sub: 'peta' },
    dashboard: { main: 'dashboard', sub: 'statistik' },
    profil_desa: { main: 'profil_desa', sub: 'daftar' },
    monografi: { main: 'monografi', sub: 'kependudukan' },
    komoditas: { main: 'komoditas', sub: 'daftar' },
    lapak_desa: { main: 'lapak_desa', sub: 'rekap' },
    perangkat: { main: 'perangkat', sub: 'organisasi' },
    berita: { main: 'berita_kegiatan', sub: 'rekap_news' },
    aset: { main: 'aset', sub: 'tanah' },
    pengguna: { main: 'pengguna', sub: 'manajemen_akun' },
    // Operator Specific Subtabs Mapping
    operator_beranda: { main: 'operator_beranda', sub: 'dashboard' },
    profil_monografi: { main: 'profil_desa', sub: 'detail' },
    pemerintahan_desa: { main: 'perangkat', sub: 'organisasi' },
    potensi_desa: { main: 'komoditas', sub: 'daftar' },
    informasi_publik: { main: 'berita_kegiatan', sub: 'rekap_news' },
    aset_desa: { main: 'aset', sub: 'tanah' },
    pengaturan: { main: 'pengguna', sub: 'manajemen_akun' }
  });

  const handleSubTabClick = (moduleId: string, mainCategory: any, subTabId: string) => {
    setActiveModule(moduleId);
    setSubTabStates((prev) => ({
      ...prev,
      [moduleId]: { main: mainCategory, sub: subTabId }
    }));
    triggerNotification(`Navigasi: Memuat sub-modul ${subTabId}...`);
  };

  // Real-time notification system
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
  };

  // Auto close notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle successful login
  const handleLoginSuccess = (role: 'Admin' | 'Operator', village: string, email: string) => {
    setUserRole(role);
    setOperatorVillage(village);
    setOperatorEmail(email);
    setCurrentScreen('dashboard');
    if (role === 'Operator') {
      setActiveModule('operator_beranda');
    } else {
      setActiveModule('peta_spasial');
    }
    triggerNotification(`Selamat datang kembali! LOGIN sukses sebagai ${role} ${role === 'Operator' ? `(Daerah Desa: ${village}) ` : '(Kecamatan Belitang Jaya)'}`);
  };

  const sidebarItemsAdmin = [
    { id: 'peta_spasial', name: 'Monitoring Peta Desa', icon: Map, desc: 'Peta spasial wilayah binaan dan sebaran' },
    { id: 'dashboard', name: 'Dashboard Kecamatan', icon: LayoutDashboard, desc: 'Informasi visual rekapitulasi data agregat' },
    { id: 'profil_desa', name: 'Profil Desa', icon: FileText, desc: 'Sensus profil administratif dan catatan desa' },
    { id: 'monografi', name: 'Monografi Desa', icon: Layers, desc: 'Hasil sensus demografi sediaan warga' },
    { id: 'komoditas', name: 'Komoditas Desa', icon: ShoppingBag, desc: 'Daftar komoditas tani dan peternakan' },
    { id: 'lapak_desa', name: 'Lapak Desa', icon: ShoppingCart, desc: 'Katalog produk wirausaha UMKM desa' },
    { id: 'perangkat', name: 'Perangkat Desa', icon: Users, desc: 'Silsilah roda kepengurusan organisasi' },
    { id: 'berita', name: 'Berita Kegiatan', icon: Newspaper, desc: 'Portal publikasi berita dan agenda desa' },
    { id: 'aset', name: 'Aset Desa', icon: Building2, desc: 'Sertifikat real-estate dan sediaan barang' },
    { id: 'pengguna', name: 'Hak Akses Pengguna', icon: ShieldCheck, desc: 'CMS manajemen akun dan pembatasan' },
  ];

  const sidebarItemsOperator = [
    { id: 'operator_beranda', name: 'Beranda Dashboard', icon: LayoutDashboard, desc: 'Halaman utama dashboard monitor desa' },
    { id: 'profil_monografi', name: 'Profil & Monografi', icon: FileText, desc: 'Identitas, Kependudukan, Sosial Ekonomi, Sarana Prasarana' },
    { id: 'pemerintahan_desa', name: 'Pemerintahan Desa', icon: Users, desc: 'Struktur Organisasi & Perangkat Desa' },
    { id: 'potensi_desa', name: 'Potensi Desa', icon: ShoppingBag, desc: 'Komoditas Desa & Lapak Produk UMKM' },
    { id: 'informasi_publik', name: 'Informasi Publik', icon: Newspaper, desc: 'Berita & Agenda Kegiatan Desa' },
    { id: 'aset_desa', name: 'Aset Desa', icon: Building2, desc: 'Tanah, Bangunan, Inventaris, Geo-tagging' },
    { id: 'pengaturan', name: 'Pengaturan', icon: Lock, desc: 'Profil Akun & Keamanan' }
  ];

  const sidebarItems = userRole === 'Admin' ? sidebarItemsAdmin : sidebarItemsOperator;
  const subModulesMap = userRole === 'Admin' ? subModulesMapAdmin : subModulesMapOperator;

  // Render correct module component screen
  const renderActiveModuleContent = () => {
    switch (activeModule) {
      case 'peta_spasial':
        return (
          <ModuleDashboardKecamatan
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeSubTab="peta"
            isDedicatedMapMode={true}
          />
        );
      case 'dashboard':
        return (
          <ModuleDashboardKecamatan
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeSubTab={subTabStates.dashboard.sub as any}
            onSubTabChange={(sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                dashboard: { main: 'dashboard', sub }
              }));
            }}
          />
        );
      case 'profil_desa':
        return (
          <ModuleDataDesa
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule="profil_desa"
            activeSubTab={subTabStates.profil_desa.sub}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                profil_desa: { main, sub }
              }));
            }}
          />
        );
      case 'monografi':
        return (
          <ModuleDataDesa
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule="monografi"
            activeSubTab={subTabStates.monografi.sub}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                monografi: { main, sub }
              }));
            }}
          />
        );
      case 'komoditas':
        return (
          <ModuleKomoditasLapak
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule="komoditas"
            activeSubTab={subTabStates.komoditas.sub}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                komoditas: { main, sub }
              }));
            }}
          />
        );
      case 'lapak_desa':
        return (
          <ModuleKomoditasLapak
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule="lapak_desa"
            activeSubTab={subTabStates.lapak_desa.sub}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                lapak_desa: { main, sub }
              }));
            }}
          />
        );
      case 'perangkat':
        return (
          <ModuleDataPerangkat
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
          />
        );
      case 'berita':
        return (
          <ModuleBeritaKegiatan
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
          />
        );
      case 'aset':
        return (
          <ModuleAsetPengguna
            onShowNotification={triggerNotification}
            userRole={userRole}
            activeMainModule="aset"
            activeSubTab={subTabStates.aset.sub}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                aset: { main, sub }
              }));
            }}
          />
        );
      case 'pengguna':
        return (
          <ModuleAsetPengguna
            onShowNotification={triggerNotification}
            userRole={userRole}
            activeMainModule="pengguna"
            activeSubTab={subTabStates.pengguna.sub}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                pengguna: { main, sub }
              }));
            }}
          />
        );
      case 'operator_beranda':
        return (
          <ModuleOperatorBeranda
            onShowNotification={triggerNotification}
            operatorVillage={operatorVillage}
            operatorEmail={operatorEmail}
          />
        );
      case 'profil_monografi':
        return (
          <ModuleDataDesa
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule={subTabStates.profil_monografi?.main || "profil_desa"}
            activeSubTab={subTabStates.profil_monografi?.sub || "detail"}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                profil_monografi: { main, sub }
              }));
            }}
          />
        );
      case 'pemerintahan_desa':
        return (
          <ModuleDataPerangkat
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
          />
        );
      case 'potensi_desa':
        return (
          <ModuleKomoditasLapak
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule={subTabStates.potensi_desa?.main || "komoditas"}
            activeSubTab={subTabStates.potensi_desa?.sub || "daftar"}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                potensi_desa: { main, sub }
              }));
            }}
          />
        );
      case 'informasi_publik':
        return (
          <ModuleBeritaKegiatan
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
          />
        );
      case 'aset_desa':
        return (
          <ModuleAsetPengguna
            onShowNotification={triggerNotification}
            userRole={userRole}
            operatorVillage={operatorVillage}
            activeMainModule="aset"
            activeSubTab={subTabStates.aset_desa?.sub || "tanah"}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                aset_desa: { main, sub }
              }));
            }}
          />
        );
      case 'pengaturan':
        if (userRole === 'Operator') {
          return (
            <ModulePengaturanOperator
              onShowNotification={triggerNotification}
              operatorVillage={operatorVillage}
              operatorEmail="operator@rejosari.desa.id"
              userRole={userRole}
              activeSubTab={subTabStates.pengaturan?.sub || "profil_akun"}
            />
          );
        }
        return (
          <ModuleAsetPengguna
            onShowNotification={triggerNotification}
            userRole={userRole}
            activeMainModule="pengguna"
            activeSubTab={subTabStates.pengaturan?.sub || "manajemen_akun"}
            onSubTabChange={(main, sub) => {
              setSubTabStates((prev) => ({
                ...prev,
                pengaturan: { main, sub }
              }));
            }}
          />
        );
      default:
        return <ModuleDashboardKecamatan onShowNotification={triggerNotification} userRole={userRole} operatorVillage={operatorVillage} />;
    }
  };

  // Landing view
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onNavigateToLogin={(initialMode = 'login') => {
          setLoginInitialMode(initialMode);
          setCurrentScreen('login');
        }}
      />
    );
  }

  // Login view
  if (currentScreen === 'login') {
    return (
      <LoginPage
        initialMode={loginInitialMode}
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => {
          setLoginInitialMode('login'); // Reset
          setCurrentScreen('landing');
        }}
      />
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Dynamic top-side slide notification toast bar */}
      {notification && (
        <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-2xl flex items-start gap-3 transition-transform animate-slide-in">
          <Bell className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {notification}
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container Dashboard */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-80 bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 border-r border-blue-900/40 flex flex-col justify-between hidden lg:flex text-white">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-transparent">
                <img src={logoBase64} alt="Logo Belitang Jaya" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                {userRole === 'Operator' ? (
                  <>
                    <h2 className="font-black text-white text-[13px] leading-tight uppercase tracking-wide truncate">
                      DESA {operatorVillage || 'SUKAMAJU'}
                    </h2>
                    <span className="text-[10px] text-amber-400 font-bold tracking-tight block uppercase mt-0.5 truncate">
                      KEC. BELITANG JAYA
                    </span>
                  </>
                ) : (
                  <>
                    <h2 className="font-black text-white text-[13px] leading-tight uppercase tracking-wide truncate">
                      KEC. BELITANG JAYA
                    </h2>
                    <span className="text-[10px] text-amber-400 font-bold tracking-tight block uppercase mt-0.5 truncate">
                      KABUPATEN OKU TIMUR
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Logged in User Profile Info Card */}
            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex w-7 h-7 bg-amber-400 text-slate-950 font-black rounded-full items-center justify-center text-[10px] shadow-sm">
                  {userRole === 'Admin' ? 'AD' : 'OP'}
                </span>
                <div>
                  <h4 className="font-black text-white text-xs truncate max-w-[150px]">{operatorEmail}</h4>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">
                    Level: {userRole}
                  </span>
                </div>
              </div>
              <div className="p-2 bg-black/20 border border-white/10 rounded text-[10px] text-slate-200 font-bold truncate shadow-xs">
                Wilayah Kerja: <span className="font-black text-amber-400">{userRole === 'Admin' ? 'Kecamatan (Full)' : `Desa ${operatorVillage}`}</span>
              </div>
            </div>

            {/* Navigation Tabs Menu */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = activeModule === item.id;
                const isExpanded = !!expandedModules[item.id];
                const matchesRole = true;

                if (!matchesRole) return null;

                const hasArrow = item.id !== 'peta_spasial' && item.id !== 'operator_beranda';

                return (
                  <React.Fragment key={item.id}>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          handleModuleClick(item.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition cursor-pointer border ${
                          isActive 
                            ? 'bg-amber-400 text-slate-950 shadow-md border-amber-500' 
                            : 'text-slate-200 hover:text-white hover:bg-white/10 border-white/10'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-blue-955' : 'text-slate-300'}`} />
                        <div className="flex-1 min-w-0 pr-1">
                          <span className="block font-poppins font-medium text-[14px] lg:text-[15px] tracking-wide truncate">{item.name}</span>
                        </div>
                        {hasArrow && (
                          <div className="flex-shrink-0 self-center">
                            {isExpanded ? (
                              <ChevronUp className={`w-4 h-4 ${isActive ? 'text-blue-955' : 'text-slate-300'}`} />
                            ) : (
                              <ChevronDown className={`w-4 h-4 ${isActive ? 'text-blue-955' : 'text-slate-300'}`} />
                            )}
                          </div>
                        )}
                      </button>

                      {/* Highly polished, indented sub-modules tree list with vertical indicator lines */}
                      {isExpanded && subModulesMap[item.id] && (
                        <div className="ml-4 pl-3.5 border-l-2 border-white/20 mt-1 mb-2 space-y-3 bg-white/5 p-2 rounded-r-lg">
                          {subModulesMap[item.id].map((group) => (
                            <div key={group.groupName} className="space-y-1">
                              <span className="block text-[9px] uppercase font-bold text-amber-400 tracking-wider">
                                {group.groupName}
                              </span>
                              <div className="space-y-0.5">
                                {group.items.map((sub) => {
                                  const isSubActive =
                                    subTabStates[item.id] &&
                                    subTabStates[item.id].main === sub.main &&
                                    subTabStates[item.id].sub === sub.id;

                                  return (
                                    <button
                                      key={sub.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubTabClick(item.id, sub.main, sub.id);
                                      }}
                                      className={`w-full text-left py-1.5 px-2 rounded-md text-[11px] font-bold transition cursor-pointer block ${
                                        isSubActive
                                          ? 'bg-amber-400 text-slate-950 font-black border-l-2 border-amber-600 -ml-[15px] pl-[13px] rounded-r-md'
                                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                                      }`}
                                    >
                                      {sub.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {(item.id === 'peta_spasial' || item.id === 'operator_beranda') && (
                      <div className="border-b border-white/10 my-3" />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Quick links & Sign out */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                setCurrentScreen('landing');
                // Reset role and credentials
                setUserRole('Admin');
                setOperatorEmail('admin@kecamatan.go.id');
                setOperatorVillage('Rejosari');
                triggerNotification('Sistem: Anda berhasil logout dan kembali ke portal publik.');
              }}
              className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-red-500/30 cursor-pointer shadow-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar Sesi (Log Out)
            </button>
            <p className="text-[12px] lg:text-[14px] text-center text-slate-400 font-inter font-normal tracking-wide">SCOPE KECAMATAN v1.4.2 PREMIUM</p>
          </div>
        </aside>

        {/* Outer body */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Dashboard Header Bar */}
          <header className="h-16 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border-b border-blue-900/40 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs text-white">
            <div className="flex items-center gap-3">
              {/* Logo icon representation for mobile screens */}
              <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-white font-black text-sm lg:hidden border border-amber-400/50 shadow-xs">
                S
              </div>
              <h1 className="font-black text-white text-base lg:text-lg tracking-tight uppercase">
                SCOPE Administrative Console
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Sync status identifier */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-500/35">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync OK
              </div>


            </div>
          </header>

          {/* Dynamic Module Content view */}
          <main className="p-6 max-w-7xl w-full mx-auto flex-1 space-y-6">
            {/* Consistent Majestic Header with Poppins SemiBold (24-32px) and Poppins Medium (18-22px) */}
            {moduleHeaderInfo[activeModule] && (
              <div className="border-b border-slate-200 pb-5">
                <h1 className="font-poppins font-semibold text-2xl md:text-[32px] text-slate-950 leading-tight tracking-tight">
                  {moduleHeaderInfo[activeModule].title}
                </h1>
                <p className="font-poppins font-medium text-[15px] md:text-[19px] text-slate-600 mt-1.5">
                  {moduleHeaderInfo[activeModule].subtitle}
                </p>
              </div>
            )}
            
            {renderActiveModuleContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
