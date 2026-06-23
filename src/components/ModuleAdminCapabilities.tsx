/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCog,
  MessageSquare,
  ToggleRight,
  Star,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Lock,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleAdminCapabilitiesProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
}

const capabilities = [
  {
    key: 'akun_akses',
    number: '1',
    title: 'Manajemen Akun dan Hak Akses',
    subtitle: 'Modul 9 — Pengguna & Keamanan',
    icon: UserCog,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    headerBg: 'bg-gradient-to-r from-blue-900 to-indigo-900',
    accentColor: '#1d4ed8',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    adminOnly: true,
    intro: 'Kontrol utama yang dipegang oleh Admin Kecamatan untuk mengatur siapa saja yang bisa menambah atau mengubah data di dalam sistem.',
    items: [
      {
        ref: 'Sub-modul 9.1',
        title: 'Menambah, Mengubah, dan Menonaktifkan Akun',
        desc: 'Admin dapat membuat akun baru untuk perangkat desa baru, mengubah informasi akun yang sudah ada, atau menonaktifkannya jika sudah tidak bertugas.',
      },
      {
        ref: 'Sub-modul 9.2 & 9.3',
        title: 'Mengatur Role & Permission',
        desc: 'Admin Kecamatan mengatur batasan akses. Admin/Operator Desa hanya diberi hak untuk menambah dan mengubah data di desanya sendiri, sedangkan Admin Kecamatan bisa melihat rekapitulasi seluruh desa.',
      },
      {
        ref: 'Sub-modul 9.4',
        title: 'Reset Password',
        desc: 'Admin dapat membantu pengguna/operator desa yang lupa kata sandi dengan melakukan reset password tanpa harus mengetahui sandi lama.',
      },
    ],
  },
  {
    key: 'catatan_feedback',
    number: '2',
    title: 'Memberikan Catatan dan Feedback',
    subtitle: 'Modul 2 — Profil & Monografi Desa',
    icon: MessageSquare,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    headerBg: 'bg-gradient-to-r from-emerald-700 to-teal-800',
    accentColor: '#059669',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    adminOnly: false,
    intro: 'Admin Kecamatan dapat memberikan arahan dan koreksi langsung kepada operator desa melalui sistem catatan terstruktur.',
    items: [
      {
        ref: 'Sub-modul 2.4',
        title: 'Catatan Kecamatan',
        desc: 'Jika Admin Kecamatan melihat ada data desa yang belum lengkap atau salah input, Admin Kecamatan dapat menambahkan catatan, koreksi, atau arahan kepada operator desa sebagai umpan balik (feedback) agar data tersebut diperbaiki.',
      },
    ],
  },
  {
    key: 'ubah_status',
    number: '3',
    title: 'Mengubah Status Konten, Produk, dan Aset',
    subtitle: 'Modul 2, 5, 6, 7, 8 — Lintas Modul',
    icon: ToggleRight,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    headerBg: 'bg-gradient-to-r from-amber-700 to-orange-800',
    accentColor: '#d97706',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    adminOnly: false,
    intro: 'Admin memiliki wewenang untuk menambah data baru atau mengubah status operasional di berbagai modul secara terpusat.',
    items: [
      {
        ref: 'Sub-modul 2.3',
        title: 'Status Web Desa',
        desc: 'Admin dapat mengubah status kesiapan publikasi digital desa menjadi: Aktif, Belum Aktif, Draft, atau Perlu Diperbarui.',
      },
      {
        ref: 'Sub-modul 5.4',
        title: 'Status Keaktifan Perangkat Desa',
        desc: 'Admin dapat memperbarui status perangkat desa menjadi: Aktif, Nonaktif, Pindah Tugas, Meninggal Dunia, Habis Masa Jabatan, atau Diganti.',
      },
      {
        ref: 'Sub-modul 6.5',
        title: 'Status Publikasi Berita',
        desc: 'Saat Admin/Operator Desa menambah berita atau kegiatan baru, mereka bisa mengubah statusnya menjadi: Draft, Terbit, Arsip, atau Perlu Diperbarui.',
      },
      {
        ref: 'Sub-modul 7.7',
        title: 'Status Ketersediaan Produk Lapak',
        desc: 'Admin dapat mengubah status stok produk lokal menjadi: Tersedia, Terbatas, Kosong, atau Tidak Aktif.',
      },
      {
        ref: 'Sub-modul 8.5',
        title: 'Status Kondisi Aset',
        desc: 'Admin dapat memperbarui kondisi aset desa menjadi: Aktif Digunakan, Rusak Ringan, Rusak Berat, Tidak Digunakan, Dipinjamkan, atau Disewakan.',
      },
    ],
  },
  {
    key: 'unggulan',
    number: '4',
    title: 'Menandai Potensi Unggulan Kecamatan',
    subtitle: 'Modul 4 & 7 — Komoditas & Lapak Desa',
    icon: Star,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
    headerBg: 'bg-gradient-to-r from-violet-800 to-purple-900',
    accentColor: '#7c3aed',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200',
    adminOnly: true,
    intro: 'Khusus Admin Kecamatan — memiliki hak eksklusif untuk mengubah status komoditas atau produk biasa menjadi skala prioritas kecamatan.',
    items: [
      {
        ref: 'Sub-modul 4.4',
        title: 'Komoditas Unggulan',
        desc: 'Menandai komoditas tertentu dari desa sebagai potensi utama kecamatan agar muncul di dashboard ringkasan kecamatan dan laporan statistik sektoral.',
      },
      {
        ref: 'Sub-modul 7.6',
        title: 'Produk Unggulan Kecamatan',
        desc: 'Memilih dan menandai beberapa produk dari Lapak Desa untuk dipromosikan di tingkat kecamatan sebagai produk prioritas UMKM daerah.',
      },
    ],
  },
  {
    key: 'audit',
    number: '5',
    title: 'Pengawasan Keamanan — Audit Trail',
    subtitle: 'Modul 9 — Log Aktivitas Sistem',
    icon: ClipboardList,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    headerBg: 'bg-gradient-to-r from-rose-700 to-pink-800',
    accentColor: '#e11d48',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    adminOnly: true,
    intro: 'Setiap kali ada Admin atau Operator yang menambah atau mengubah data, sistem akan mencatatnya secara otomatis sebagai jejak audit yang tidak bisa dimanipulasi.',
    items: [
      {
        ref: 'Sub-modul 9.5',
        title: 'Log Aktivitas Pengguna',
        desc: 'Sistem akan mencatat setiap aksi: tambah data, ubah data, hapus data, login, validasi, dan perubahan status yang dilakukan oleh Admin. Fitur ini berfungsi sebagai kontrol dan audit internal agar seluruh perubahan data dapat dipertanggungjawabkan.',
      },
    ],
  },
];

export const ModuleAdminCapabilities: React.FC<ModuleAdminCapabilitiesProps> = ({
  onShowNotification,
  userRole,
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>('akun_akses');

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">
                Panduan Admin — Cakupan Aksi Sistem
              </span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">
              Apa yang Dapat Dilakukan Admin?
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
              Panduan lengkap kemampuan penambahan, pengubahan, dan pengelolaan data yang dapat dilakukan
              oleh Admin Kecamatan maupun Admin/Operator Desa di dalam sistem SCOPE.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 text-center">
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">Area Kemampuan</span>
              <span className="block text-3xl font-black text-amber-400">{capabilities.length}</span>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5">
          <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-1.5">
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-extrabold text-amber-400">Admin Kecamatan</span>
            <span className="text-[11px] text-slate-300">— Akses Penuh Lintas Desa</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
            <Eye className="w-3 h-3 text-slate-300" />
            <span className="text-[11px] font-extrabold text-slate-200">Operator Desa</span>
            <span className="text-[11px] text-slate-400">— Akses Terbatas per Desa</span>
          </div>
        </div>
      </div>

      {/* Capability Cards */}
      <div className="space-y-3">
        {capabilities.map((cap) => {
          const isExpanded = expandedCard === cap.key;
          const Icon = cap.icon;

          return (
            <div
              key={cap.key}
              className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-200 ${
                isExpanded ? cap.borderColor + ' shadow-md' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setExpandedCard(isExpanded ? null : cap.key)}
                className="w-full text-left cursor-pointer"
              >
                <div className={`${isExpanded ? cap.headerBg : 'bg-white hover:bg-slate-50'} transition-colors p-5 flex items-center justify-between gap-4`}>
                  <div className="flex items-center gap-4">
                    {/* Number circle */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isExpanded ? 'bg-white/15' : cap.iconBg
                    }`}>
                      <Icon className={`w-5 h-5 ${isExpanded ? 'text-white' : cap.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          isExpanded ? 'bg-white/20 text-white border-white/30' : cap.badgeColor
                        }`}>
                          {cap.number}
                        </span>
                        <h3 className={`font-extrabold text-base ${isExpanded ? 'text-white' : 'text-slate-900'}`}>
                          {cap.title}
                        </h3>
                        {cap.adminOnly && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isExpanded ? 'bg-amber-400/30 text-amber-300 border-amber-400/50' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <Lock className="w-2.5 h-2.5" /> Khusus Admin Kecamatan
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>
                        {cap.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isExpanded ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-white border-t border-slate-100 space-y-5">
                      {/* Intro */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-700 leading-relaxed">{cap.intro}</p>
                      </div>

                      {/* Action items */}
                      <div className="space-y-3">
                        {cap.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-colors"
                          >
                            <div
                              className="mt-0.5 shrink-0 px-2 py-1 rounded-lg text-[10px] font-extrabold text-white whitespace-nowrap"
                              style={{ background: cap.accentColor }}
                            >
                              {item.ref}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-slate-900 text-sm mb-1">{item.title}</h5>
                              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action button */}
                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          onClick={() => onShowNotification(`Navigasi ke ${cap.title} — ${cap.subtitle}.`)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mengerti
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Seluruh aksi Admin dicatat otomatis di <strong className="text-white">Log Aktivitas (Sub-modul 9.5)</strong> sebagai bukti audit
            yang tidak dapat dimanipulasi.
          </span>
        </div>
        <span className="shrink-0 bg-amber-400/20 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full font-extrabold">
          SCOPE v1.0
        </span>
      </div>
    </div>
  );
};
