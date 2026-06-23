/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, Search, HelpCircle, FileText, ShoppingBag, Eye } from 'lucide-react';
import { ACTIVITIES_DATA as ACTIVITIES_DATA_FALLBACK, VILLAGES_DATA } from '../data/dummy';
import { HorizontalBarChart } from './SVGCharts';
import { useSyncedState } from '../lib/useSyncedState';

interface ModuleDashboardKecamatanProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
  activeSubTab?: 'statistik' | 'peta' | 'kelengkapan' | 'aktivitas' | 'rekap_komoditas';
  onSubTabChange?: (tab: 'statistik' | 'peta' | 'kelengkapan' | 'aktivitas' | 'rekap_komoditas') => void;
  isDedicatedMapMode?: boolean;
}

export const ModuleDashboardKecamatan: React.FC<ModuleDashboardKecamatanProps> = ({
  onShowNotification,
  userRole,
  operatorVillage,
  activeSubTab: propActiveSubTab,
  onSubTabChange,
  isDedicatedMapMode = false
}) => {
  const [localActiveSubTab, setLocalActiveSubTab] = useState<'statistik' | 'peta' | 'kelengkapan' | 'aktivitas' | 'rekap_komoditas'>('statistik');

  // Rekap Aktivitas Swadaya kini tersinkron lewat Data Server Lokal,
  // sehingga aktivitas terbaru yang dilakukan Operator Desa (mis. tambah
  // perangkat, tambah berita) langsung terlihat di dashboard ini.
  const [ACTIVITIES_DATA] = useSyncedState<typeof ACTIVITIES_DATA_FALLBACK>(
    'kec_activities',
    ACTIVITIES_DATA_FALLBACK,
    { readOnly: true }
  );

  const activeSubTab = isDedicatedMapMode ? 'peta' : (propActiveSubTab ?? localActiveSubTab);

  const setActiveSubTab = (val: 'statistik' | 'peta' | 'kelengkapan' | 'aktivitas' | 'rekap_komoditas') => {
    if (onSubTabChange) {
      onSubTabChange(val);
    } else {
      setLocalActiveSubTab(val);
    }
  };

  // Interactive Peta states
  const [selectedMapVillage, setSelectedMapVillage] = useState<typeof VILLAGES_DATA[0] | null>(null);

  // Rekap Aktivitas filters
  const [villageSearchQuery, setVillageSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('Semua');

  // Village quick-select chips (paired with the real Google Maps embed)
  const markers = [
    { name: 'Rejosari', x: '38%', y: '55%', color: 'bg-indigo-600', code: '3110009' },
    { name: 'Argo Mulyo', x: '45%', y: '50%', color: 'bg-blue-600', code: '3110010' },
    { name: 'Banjar Rejo', x: '55%', y: '25%', color: 'bg-emerald-600', code: '3110011' },
    { name: 'Girimulyo', x: '42%', y: '75%', color: 'bg-amber-650', code: '3110012' },
    { name: 'Karya Makmur', x: '20%', y: '40%', color: 'bg-cyan-600', code: '3110013' },
    { name: 'Madu Condo', x: '75%', y: '65%', color: 'bg-rose-600', code: '3110014' },
    { name: 'Margokoyo', x: '78%', y: '30%', color: 'bg-purple-650', code: '3110015' },
  ];

  const handleMarkerClick = (code: string) => {
    const v = VILLAGES_DATA.find((village) => village.id === code);
    if (v) {
      setSelectedMapVillage(v);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Lengkap':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />;
      case 'Perlu Diperbarui':
        return <AlertTriangle className="w-5 h-5 text-amber-500 inline" />;
      default:
        return <XCircle className="w-5 h-5 text-rose-500 inline" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Lengkap':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">Lengkap</span>;
      case 'Perlu Diperbarui':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">Perlu Diperbarui</span>;
      default:
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200">Belum Lengkap</span>;
    }
  };

  // Filtered activities
  const filteredActivities = ACTIVITIES_DATA.filter((act) => {
    const matchVillage = !villageSearchQuery || act.villageName.toLowerCase().includes(villageSearchQuery.toLowerCase());
    const matchType = filterType === 'Semua' || act.type === filterType;
    return matchVillage && matchType;
  });

  // Commodity Stats
  const commodityCategoryData = [
    { label: 'Pertanian', value: 45, color: '#10b981' },
    { label: 'Perkebunan', value: 23, color: '#f59e0b' },
    { label: 'UMKM', value: 34, color: '#8b5cf6' },
    { label: 'Peternakan', value: 18, color: '#f97316' },
    { label: 'Perikanan', value: 12, color: '#3b82f6' },
    { label: 'Kerajinan', value: 19, color: '#14b8a6' },
  ];

  const sebaranMatriks = [
    { desa: 'Argo Mulyo', pert: 12, perk: 3, pet: 4, peri: 5, umkm: 6, ker: 4, total: 34 },
    { desa: 'Banjar Rejo', pert: 8, perk: 6, pet: 3, peri: 2, umkm: 5, ker: 3, total: 27 },
    { desa: 'Girimulyo', pert: 7, perk: 4, pet: 4, peri: 1, umkm: 4, ker: 2, total: 22 },
    { desa: 'Karya Makmur', pert: 6, perk: 4, pet: 3, peri: 2, umkm: 8, ker: 4, total: 27 },
    { desa: 'Madu Condo', pert: 5, perk: 3, pet: 3, peri: 1, umkm: 5, ker: 3, total: 20 },
    { desa: 'Margokoyo', pert: 7, perk: 3, pet: 1, peri: 1, umkm: 6, ker: 3, total: 21 },
  ];

  return (
    <div className="space-y-6">

      {/* SUB-TAB CONTENTS */}

      {/* 1.1 STATISTIK KECAMATAN */}
      {activeSubTab === 'statistik' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 animate-fade-in">
            {[
              { val: '12',     label: 'Total Desa',       color: 'text-blue-950' },
              { val: '48.320', label: 'Penduduk',          color: 'text-emerald-800' },
              { val: '12.540', label: 'Jumlah KK',         color: 'text-indigo-900' },
              { val: '86',     label: 'Perangkat',         color: 'text-amber-700' },
              { val: '143',    label: 'Berita',            color: 'text-rose-800' },
              { val: '67',     label: 'Produk Lapak',      color: 'text-emerald-900' },
              { val: '234',    label: 'Aset Desa',         color: 'text-slate-950' },
            ].map((s) => (
              <div key={s.label} className="bg-white p-3 rounded-xl border border-slate-300 shadow-sm text-center hover:border-slate-400 transition-all col-span-1">
                <span className={`block text-2xl font-black ${s.color} leading-tight`}>{s.val}</span>
                <span className="text-[10px] text-slate-600 font-extrabold uppercase block mt-1 tracking-wide leading-tight break-words">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
              <h3 className="font-black text-slate-950 border-b border-slate-200 pb-3 mb-4 text-xs font-mono uppercase tracking-wider">Grafik Kategori Potensi Komoditas</h3>
              <HorizontalBarChart data={commodityCategoryData} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
              <h3 className="font-black text-slate-950 border-b border-slate-200 pb-3 text-xs font-mono uppercase tracking-wider">Informasi Sub-Distrik (Kecamatan)</h3>
              <div className="text-sm space-y-3.5 text-slate-900 font-medium leading-relaxed">
                <p>
                  Website <strong className="text-blue-900 font-extrabold font-sans">SCOPE Kecamatan</strong> menyediakan sistem monitoring satu pintu (single-window dashboard) bagi instansi dan perangkat aparat <strong className="text-slate-950 font-black">Kecamatan Belitang Jaya</strong>, Kabupaten Ogan Komering Ulu Timur (OKU Timur), Provinsi Sumatera Selatan.
                </p>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-900 rounded text-xs text-blue-950 font-bold shadow-sm">
                  <span className="font-black text-blue-900 block text-[11px] uppercase tracking-wider mb-1.5">Petunjuk Penggunaan Panel:</span>
                  Gunakan menu folder dropdown navigasi di sidebar sebelah kiri untuk melakukan monitoring peta spasial desa, kepatuhan monografi kependudukan, rekap data komoditas, pasar wirausaha desa, audit log akun, maupun status unggahan profil aparatur secara real-time.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1.2 MONITORING PETA DESA */}
      {activeSubTab === 'peta' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-950 text-sm font-mono uppercase tracking-wider">Peta Wilayah Kecamatan Belitang Jaya</h3>
                <span className="text-xs text-slate-800 font-bold block mt-0.5">Kabupaten OKU Timur, Provinsi Sumatera Selatan — pilih desa di panel kanan untuk meninjau data lengkap</span>
              </div>
              <span className="px-3 py-1.5 bg-blue-950 text-white text-xs font-black rounded-lg shadow-sm">{markers.length} Desa Terpetakan</span>
            </div>

            {/* Real Google Maps embed centered on Kecamatan Belitang Jaya */}
            <div className="relative aspect-[16/10] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              <iframe
                title="Peta Kecamatan Belitang Jaya"
                src="https://www.google.com/maps?q=Kecamatan+Belitang+Jaya,+Kabupaten+Ogan+Komering+Ulu+Timur,+Sumatera+Selatan&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Quick desa selector chips (since the embedded map can't carry custom clickable pins) */}
            <div className="flex flex-wrap gap-2 mt-4">
              {markers.map((marker, mIdx) => (
                <button
                  key={mIdx}
                  onClick={() => handleMarkerClick(marker.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    selectedMapVillage?.id === marker.code
                      ? 'bg-blue-950 text-white border-blue-950'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${marker.color}`} />
                  Desa {marker.name}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-black text-slate-900 border-b border-slate-200 pb-3 mb-4 text-xs font-mono uppercase tracking-wider">Informasi Desa Terpilih</h3>
              {selectedMapVillage ? (
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-xl shadow-inner text-white animate-fade-in">
                    <span className="text-[11px] text-blue-300 font-extrabold uppercase tracking-wider block">Nama Desa Binaan</span>
                    <h4 className="text-xl font-black text-white mt-1">Desa {selectedMapVillage.name}</h4>
                  </div>
                  
                  <div className="space-y-2.5 px-0.5 text-xs text-slate-900">
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-800 font-bold">Kepala Desa:</span>
                      <span className="font-black text-slate-950">{selectedMapVillage.headName}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-800 font-bold">Kode Wilayah:</span>
                      <span className="font-mono text-slate-950 font-black">{selectedMapVillage.id}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-800 font-bold">Luas Wilayah:</span>
                      <span className="font-black text-slate-950">{selectedMapVillage.areaHa} Ha</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-800 font-bold">Batas Utara:</span>
                      <span className="font-black text-slate-950 text-right">{selectedMapVillage.boundaries.north}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-800 font-bold">Kelengkapan Data:</span>
                      {getStatusBadge(selectedMapVillage.dataStatus)}
                    </div>
                  </div>

                  <p className="text-[12px] text-slate-800 font-bold bg-slate-50 p-3.5 rounded-lg border border-slate-200 italic leading-relaxed shadow-sm">
                    "{selectedMapVillage.geographicalInfo}"
                  </p>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 space-y-3">
                  <HelpCircle className="w-12 h-12 mx-auto text-slate-400 animate-pulse" />
                  <p className="text-xs font-black text-slate-850 tracking-wide leading-relaxed">Silakan pilih salah satu desa di bawah peta untuk melihat profil detail.</p>
                </div>
              )}
            </div>

            {selectedMapVillage && (
              <button
                onClick={() => {
                  onShowNotification(`Koneksi langsung ke web http://${selectedMapVillage.webUrl || 'rejosari.desa.id'}`);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 mt-6 rounded-lg text-xs"
              >
                Kunjungi Web Desa
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1.3 STATUS KELENGKAPAN DATA */}
      {activeSubTab === 'kelengkapan' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-black text-slate-950 text-base tracking-tight uppercase">Kepatuhan Audit Data Desa</h3>
            <p className="text-xs text-slate-800 font-bold mt-1">Ulasan verifikasi berkala atas kelengkapan monografi umum kependudukan, aparatur, komoditas & lapak binaan.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="bg-slate-100 text-slate-900 text-xs font-black uppercase border-b border-slate-300">
                <tr>
                  <th className="p-4">No</th>
                  <th className="p-4">Nama Desa</th>
                  <th className="p-4 text-center">Profil</th>
                  <th className="p-4 text-center">Perangkat</th>
                  <th className="p-4 text-center">Monografi</th>
                  <th className="p-4 text-center">Komoditas</th>
                  <th className="p-4 text-center">Aset</th>
                  <th className="p-4">Status Kepatuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-extrabold text-slate-950">
                {VILLAGES_DATA.map((v, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-950 font-black">{index + 1}</td>
                    <td className="p-4 font-black text-slate-955">Desa {v.name}</td>
                    <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-emerald-600 inline" /></td>
                    <td className="p-4 text-center">
                      {v.dataStatus === 'Belum Lengkap' && v.name === 'Madu Condo' || v.name === 'Girimulyo' ? (
                        <XCircle className="w-5 h-5 text-rose-600 inline" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {v.name === 'Girimulyo' || v.name === 'Madu Condo' ? (
                        <XCircle className="w-5 h-5 text-rose-600 inline" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {v.name === 'Girimulyo' || v.name === 'Madu Condo' ? (
                        <XCircle className="w-5 h-5 text-rose-600 inline" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {v.name === 'Girimulyo' || v.name === 'Madu Condo' || v.name === 'Karya Makmur' ? (
                        <XCircle className="w-5 h-5 text-rose-600 inline" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(v.dataStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-100 p-4 border-t border-slate-300 flex flex-wrap gap-4 justify-around text-xs font-black text-slate-900">
            <span className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
              Lengkap: 3 Desa Terpilih
            </span>
            <span className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
              Belum Lengkap: 2 Desa Terpilih
            </span>
            <span className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
              <span className="w-3 h-3 rounded-full bg-amber-600 animate-pulse" />
              Perlu Diperbarui: 1 Desa Terpilih
            </span>
          </div>
        </div>
      )}

      {/* 1.4 REKAP AKTIVITAS DESA */}
      {activeSubTab === 'aktivitas' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls */}
          <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-1.5 tracking-wider">Cari Desa</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-900" />
                  </span>
                  <input
                    type="text"
                    value={villageSearchQuery}
                    onChange={(e) => setVillageSearchQuery(e.target.value)}
                    placeholder="Argo Mulyo, Girimulyo..."
                    className="pl-9 pr-8 py-2 text-xs font-bold text-slate-900 placeholder-slate-500 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white w-52 shadow-xs"
                  />
                  {villageSearchQuery && (
                    <button
                      onClick={() => setVillageSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-600 hover:text-slate-900 font-extrabold"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-1.5 tracking-wider">Jenis Aktivitas</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-900 border border-slate-350 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white shadow-xs"
                >
                  <option value="Semua">Semua Jenis</option>
                  <option value="Berita Baru">Berita Baru</option>
                  <option value="Kegiatan Baru">Kegiatan Baru</option>
                  <option value="Produk Baru">Produk Baru</option>
                  <option value="Update Profil">Update Profil</option>
                  <option value="Perangkat Update">Perangkat Update</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-white font-black bg-blue-950 px-3.5 py-2 rounded-xl shadow-xs">
              Menampilkan {filteredActivities.length} Riwayat Aktivitas Binaan
            </span>
          </div>

          {/* Table list */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-900">
                <thead className="bg-slate-100 text-slate-900 text-xs font-black uppercase border-b border-slate-300">
                  <tr>
                    <th className="p-4">Asal Desa</th>
                    <th className="p-4">Jenis Aktivitas</th>
                    <th className="p-4">Rincian Informasi</th>
                    <th className="p-4">Rentang Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-extrabold text-slate-950">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-black rounded-md block w-fit shadow-xs">
                            {act.villageName}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-black text-blue-900 uppercase tracking-wide">{act.type}</span>
                        </td>
                        <td className="p-4 text-xs font-bold text-slate-900 leading-relaxed">{act.detail}</td>
                        <td className="p-4 text-xs font-mono font-black text-slate-700">{act.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-700 text-xs font-black">
                        Tidak ada kecocokan hasil aktivitas desa untuk filter ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 1.5 REKAP KOMODITAS DESA */}
      {activeSubTab === 'rekap_komoditas' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm col-span-1">
              <h3 className="font-black text-slate-950 border-b border-slate-200 pb-3 mb-4 text-xs font-mono uppercase tracking-wider">Total Sensus Kategori</h3>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">Pertanian:</span>
                  <span className="font-mono text-slate-950 font-black text-sm">45</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">Perkebunan:</span>
                  <span className="font-mono text-slate-950 font-black text-sm">23</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">UMKM:</span>
                  <span className="font-mono text-slate-950 font-black text-sm">34</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">Peternakan:</span>
                  <span className="font-mono text-slate-950 font-black text-sm">18</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">Perikanan:</span>
                  <span className="font-mono text-slate-950 font-black text-sm">12</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-300 pt-3.5 font-black text-slate-950">
                  <span>Grand Total Sensus:</span>
                  <span className="font-mono text-blue-900 text-base font-black">151 Komoditas</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-300 col-span-2 shadow-sm overflow-hidden">
              <h3 className="font-black text-slate-955 border-b border-slate-200 pb-3 mb-4 text-xs font-mono uppercase tracking-wider">Sebaran Komoditas Per Desa (Matrix)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-900">
                  <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase">
                    <tr className="border-b border-slate-300">
                      <th className="p-3">Desa</th>
                      <th className="p-3 text-center">Tani</th>
                      <th className="p-3 text-center">Kebun</th>
                      <th className="p-3 text-center">Ternak</th>
                      <th className="p-3 text-center">Ikan</th>
                      <th className="p-3 text-center">UMKM</th>
                      <th className="p-3 text-center">Rajin</th>
                      <th className="p-3 text-center bg-blue-100 text-blue-950 font-black">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-bold text-slate-950">
                    {sebaranMatriks.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-black text-slate-950">Desa {r.desa}</td>
                        <td className="p-3 text-center font-mono text-slate-955">{r.pert}</td>
                        <td className="p-3 text-center font-mono text-slate-955">{r.perk}</td>
                        <td className="p-3 text-center font-mono text-slate-955">{r.pet}</td>
                        <td className="p-3 text-center font-mono text-slate-955">{r.peri}</td>
                        <td className="p-3 text-center font-mono text-slate-955">{r.umkm}</td>
                        <td className="p-3 text-center font-mono text-slate-955">{r.ker}</td>
                        <td className="p-3 text-center bg-blue-50 text-blue-950 font-black font-mono text-xs">{r.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
