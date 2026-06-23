/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { logoBase64 } from '../assets_logo';
import {
  LayoutDashboard,
  Database,
  TrendingUp,
  Users2,
  Newspaper,
  ShoppingBag,
  Building2,
  MapPin,
  ShieldAlert,
  Map,
  PhoneCall,
  Mail,
  Home,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: (initialMode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
      title: 'Dashboard Monitoring',
      desc: 'Pantau seluruh data desa dalam satu tampilan terpadu dan praktis.',
    },
    {
      icon: <Database className="w-6 h-6 text-green-600" />,
      title: 'Data Desa Terpusat',
      desc: 'Kelola profil, monografi, dan informasi penting setiap desa secara lengkap.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      title: 'Komoditas & Potensi',
      desc: 'Petakan dan kelola potensi ekonomi serta komoditas unggulan seluruh desa.',
    },
    {
      icon: <Users2 className="w-6 h-6 text-purple-600" />,
      title: 'Perangkat Desa',
      desc: 'Data struktur organisasi pemerintahan desa yang selalu diperbarui.',
    },
    {
      icon: <Newspaper className="w-6 h-6 text-red-600" />,
      title: 'Berita & Kegiatan',
      desc: 'Publikasi kegiatan resmi dikoordinasikan langsung ke web tingkat desa.',
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-pink-600" />,
      title: 'Lapak Produk Desa',
      desc: 'Katalog terpadu untuk ajang promosi produk lokal bernilai jual tinggi.',
    },
    {
      icon: <Building2 className="w-6 h-6 text-cyan-600" />,
      title: 'Manajemen Aset',
      desc: 'Catat, amankan, dan kelompokkan aset bernilai milik tiap daerah desa.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-indigo-600" />,
      title: 'Peta & Geo Tagging',
      desc: 'Visualisasi koordinat penting peta sebaran komoditas dan batas wilayah.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-slate-700" />,
      title: 'Hak Akses & Keamanan',
      desc: 'Atur otorisasi multi-user demi keamanan administrasi data kecamatan.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div id="landing-container" className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-50 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden">
              <img src={logoBase64} alt="Logo Belitang Jaya" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="block text-sm font-extrabold text-blue-900 tracking-wider uppercase">
                KEC. BELITANG JAYA
              </span>
              <span className="block text-[10px] text-slate-500 font-semibold tracking-tight uppercase mt-0.5">
                KABUPATEN OKU TIMUR
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button key="nav-beranda" onClick={() => scrollToSection('landing-container')} className="hover:text-blue-700 transition cursor-pointer">Beranda</button>
            <button key="nav-tentang" onClick={() => scrollToSection('about-section')} className="hover:text-blue-700 transition cursor-pointer">Tentang</button>
            <button key="nav-fitur" onClick={() => scrollToSection('features-section')} className="hover:text-blue-700 transition cursor-pointer">Fitur</button>
            <button key="nav-kontak" onClick={() => scrollToSection('contact-section')} className="hover:text-blue-700 transition cursor-pointer">Kontak</button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigateToLogin('login')}
              className="px-5 py-2 text-sm font-semibold text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => onNavigateToLogin('register')}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
            >
              Daftar
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-3 shadow-lg flex flex-col z-40 fixed top-18 left-0 right-0"
        >
          <button onClick={() => scrollToSection('landing-container')} className="text-left py-2 px-3 hover:bg-slate-50 rounded text-slate-700 font-medium">Beranda</button>
          <button onClick={() => scrollToSection('about-section')} className="text-left py-2 px-3 hover:bg-slate-50 rounded text-slate-700 font-medium">Tentang</button>
          <button onClick={() => scrollToSection('features-section')} className="text-left py-2 px-3 hover:bg-slate-50 rounded text-slate-700 font-medium">Fitur</button>
          <button onClick={() => scrollToSection('contact-section')} className="text-left py-2 px-3 hover:bg-slate-50 rounded text-slate-700 font-medium">Kontak</button>
          <div className="pt-2 border-t border-slate-100 flex gap-3">
            <button
              onClick={() => onNavigateToLogin('login')}
              className="flex-1 py-2 text-center text-sm font-semibold text-blue-850 border border-blue-200 rounded-lg bg-white"
            >
              Masuk
            </button>
            <button
              onClick={() => onNavigateToLogin('register')}
              className="flex-1 py-2 text-center text-sm font-semibold text-white bg-blue-700 rounded-lg"
            >
              Daftar
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 py-20 lg:py-28 text-white">
        {/* Geometric Background Decorations */}
        <div className="absolute top-1/4 left-10 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-12 w-64 h-64 border-2 border-white/5 rounded-3xl rotate-45 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-3 h-3 bg-amber-400 rounded-full animate-ping pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 grid grid-cols-4 gap-2 opacity-15 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`dot-${i}`} className="w-1.5 h-1.5 bg-white rounded-full" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-xs font-semibold tracking-wide text-amber-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Informasi Desa & Kecamatan Terpadu
            </motion.div>

            {/* Big Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight"
            >
              SCOPE <span className="text-amber-400">Kecamatan</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl"
            >
              Sistem monitoring dan pengelolaan data seluruh desa dalam satu kecamatan secara terpusat, real-time, komprehensif, dan mudah diakses.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={() => onNavigateToLogin('login')}
                className="px-8 py-3.5 text-base font-bold bg-white text-blue-900 hover:text-blue-800 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition duration-200 cursor-pointer"
              >
                Masuk Sekarang
              </button>
              <button
                onClick={() => scrollToSection('features-section')}
                className="px-8 py-3.5 text-base font-bold border border-white/30 hover:border-white hover:bg-white/5 rounded-xl transition cursor-pointer"
              >
                Pelajari Lebih Lanjut
              </button>
            </motion.div>
          </div>

          {/* Quick Stats Rows */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/10"
          >
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center sm:text-left">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">12</span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Binaan Desa</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center sm:text-left">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">48.320</span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Total Penduduk</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center sm:text-left">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">151</span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Macam Komoditas</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center sm:text-left">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-300">234</span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Inventaris Aset</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">TENTANG KECAMATAN</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Kecamatan Belitang <span className="text-blue-700">Jaya</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Kecamatan Belitang Jaya secara geografis terletak di Kabupaten Ogan Komering Ulu Timur (OKU Timur), Provinsi Sumatera Selatan. Wilayah agraria subur ini memiliki potensi komoditas pertanian melimpah serta kemandirian ekonomi desa binaan yang tinggi. Pada era modern ini, kecanggihan digital menjadi motor penting penopang komunikasi dinas publik.
              </p>
              <div className="p-4 bg-slate-50 border-l-4 border-blue-700 rounded-r-lg">
                <p className="text-xs sm:text-sm text-slate-700 font-medium italic">
                  "Melalui SCOPE Kecamatan, kami melahirkan inovasi monitoring tata pamong desa transparan sebagai fondasi utama pelayanan masyarakat prima."
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="inline-flex w-8 h-8 rounded-full bg-blue-100 text-blue-800 items-center justify-center font-bold text-sm">✓</span>
                <h4 className="font-bold text-slate-900">Visi Daerah Mandiri</h4>
                <p className="text-xs text-slate-500">Mendorong produktivitas ekonomi berbasis hortikultura agrowisata nasional.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="inline-flex w-8 h-8 rounded-full bg-blue-100 text-blue-800 items-center justify-center font-bold text-sm">✓</span>
                <h4 className="font-bold text-slate-900">Sinergi Satu Atap</h4>
                <p className="text-xs text-slate-500">Integrasi data kependudukan dinas dengan mutasi aset dalam dashboard kecamatan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features-section" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700">UNGGULAN UTAMA</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Fitur Unggulan Sistem SCOPE
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Semua instrumen monitoring terintegrasi yang dibutuhkan jajaran kecamatan dalam satu platform operasional.
            </p>
          </div>

          {/* Grid 3x3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistik Kecamatan Section */}
      <section className="py-16 bg-blue-50 text-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800">ANGKA RINGKASAN DATA</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-905">Data Kecamatan Belitang Jaya</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <span className="block text-4xl sm:text-5xl font-black text-blue-900 font-mono">12</span>
              <span className="block text-sm font-semibold text-blue-750">Desa Binaan</span>
            </div>
            <div className="space-y-1.5">
              <span className="block text-4xl sm:text-5xl font-black text-blue-900 font-mono">48.320</span>
              <span className="block text-sm font-semibold text-blue-750">Total Penduduk</span>
            </div>
            <div className="space-y-1.5">
              <span className="block text-4xl sm:text-5xl font-black text-blue-900 font-mono">12.540</span>
              <span className="block text-sm font-semibold text-blue-750">Jumlah KK</span>
            </div>
            <div className="space-y-1.5">
              <span className="block text-4xl sm:text-5xl font-black text-blue-900 font-mono">151</span>
              <span className="block text-sm font-semibold text-blue-750">Komoditas Produksi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700">SIAP BEKERJA SAMA</span>
                <h2 className="text-3xl font-extrabold text-slate-900">Hubungi Kami Sekarang</h2>
                <p className="text-slate-500 font-medium">Bila ada kendala akses operator desa maupun kebutuhan kearsipan fisik dinas sekretariat.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">Alamat Kantor</span>
                    <span className="text-xs text-slate-500 leading-relaxed block">Jl. Raya Belitang Jaya No.1, Kab. OKU Timur, Sumatera Selatan</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">Surel / Email</span>
                    <span className="text-xs text-slate-500 block">admin@kecamatan.go.id</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">Hubungi Telepon</span>
                    <span className="text-xs text-slate-500 block">(0735) 123456</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Peta Lokasi Kantor Kecamatan</h3>
              {/* Dummy Maps Placeholder */}
              <div className="aspect-video bg-blue-100 rounded-xl border border-blue-200 overflow-hidden relative flex flex-col justify-center items-center text-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <Map className="w-12 h-12 text-blue-700 mb-2 animate-bounce" />
                <span className="font-bold text-slate-900 text-sm z-10">Kecamatan Belitang Jaya</span>
                <span className="text-[10px] text-slate-500 z-10 px-6">Jl. Raya Belitang Jaya No.1, OKU Timur, Sumatera Selatan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-white text-base font-extrabold tracking-wider">
              SCOPE KECAMATAN
            </span>
            <p className="text-xs leading-relaxed text-slate-400">
              Sistem Informasi Manajemen Data Kecamatan Belitang Jaya, Kabupaten OKU Timur, Provinsi Sumatera Selatan.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-wider">NAVIGASI</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => scrollToSection('landing-container')} className="text-left hover:text-white transition">Beranda</button>
              <button onClick={() => scrollToSection('about-section')} className="text-left hover:text-white transition">Tentang</button>
              <button onClick={() => scrollToSection('features-section')} className="text-left hover:text-white transition">Fitur</button>
              <button onClick={() => onNavigateToLogin('login')} className="text-left hover:text-white transition">Masuk</button>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-wider">KONTAK SEKRETARIAT</h4>
            <p className="text-xs leading-relaxed">
              Jl. Raya Belitang Jaya No.1, OKU Timur, Sumatera Selatan.<br />
              Email: admin@kecamatan.go.id<br />
              Telp: (0735) 123456
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-905 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-xs text-slate-500 font-medium">
          <span>&copy; 2025 SCOPE Kecamatan. Kecamatan Belitang Jaya, Kabupaten OKU Timur.</span>
          <span>Republik Indonesia</span>
        </div>
      </footer>
    </div>
  );
};
