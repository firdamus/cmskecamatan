/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  Settings,
  AlertCircle,
  Users,
  ShoppingBag,
  ShoppingCart,
  Building,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  FileCheck,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { DonutChart } from './SVGCharts';

// Mock data structures tailored for the operator's village (e.g. Argo Mulyo, or custom operator village)
interface ModuleOperatorBerandaProps {
  onShowNotification: (msg: string) => void;
  operatorVillage: string;
  operatorEmail: string;
}

export const ModuleOperatorBeranda: React.FC<ModuleOperatorBerandaProps> = ({
  onShowNotification,
  operatorVillage,
  operatorEmail
}) => {
  // Configurable states for operator dashboard interactive components
  const [webStatus, setWebStatus] = useState<'Aktif' | 'Draft'>('Aktif');
  const [progressPercent, setProgressPercent] = useState<number>(78);
  const [correctionAcknowledged, setCorrectionAcknowledged] = useState<boolean>(false);

  // Stats
  const [totalPenduduk, setTotalPenduduk] = useState({ total: 3450, laki: 1710, perempuan: 1740 });
  const [jmlKomoditas, setJmlKomoditas] = useState(14);
  const [jmlUMKM, setJmlUMKM] = useState(8);
  const [jmlAset, setJmlAset] = useState(25);

  // Selected asset from geo-tagging map
  const [selectedMapAsset, setSelectedMapAsset] = useState<{ name: string; type: string; lat: string; lng: string; status: string } | null>({
    name: `Kantor Kepala Desa ${operatorVillage}`,
    type: "Bangunan",
    lat: "-4.1284",
    lng: "104.5932",
    status: "Hak Pakai"
  });

  // Log Aktivitas Desa state list
  const [activitiesList, setActivitiesList] = useState([
    { id: 1, time: "10 menit yang lalu", desc: `Anda memperbarui stok kue basah pisang di Lapak UMKM Desa ${operatorVillage}`, category: "UMKM" },
    { id: 2, time: "2 jam yang lalu", desc: "Anda mengumumkan berita agenda gotong royong warga RT 02", category: "Berita" },
    { id: 3, time: "Kemarin", desc: "Anda menambahkan sertifikat tanah kas desa seluas 4.500 m2", category: "Aset" },
    { id: 4, time: "2 hari lalu", desc: "Anda memperbarui data sensus Kartu Keluarga rujukan stunting", category: "Kependudukan" }
  ]);

  const [newLogDesc, setNewLogDesc] = useState('');
  const [newLogCategory, setNewLogCategory] = useState('Sistem');
  // Filter state for riwayat
  const [filterLogCategory, setFilterLogCategory] = useState<string>('Semua');

  const filteredActivities = filterLogCategory === 'Semua'
    ? activitiesList
    : activitiesList.filter(a => a.category === filterLogCategory);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogDesc.trim()) return;
    const newLog = { id: Date.now(), time: "Baru saja", desc: newLogDesc.trim(), category: newLogCategory };
    setActivitiesList([newLog, ...activitiesList]);
    setNewLogDesc('');
    onShowNotification(`Aktivitas berhasil dicatat: "${newLog.desc}"`);
  };

  // Agenda detail state (pindah halaman)
  const [selectedAgenda, setSelectedAgenda] = useState<typeof upcomingAgendas[0] | null>(null);

  // Agenda list
  const upcomingAgendas = [
    { id: 1, date: "18 Jun 2026", title: "Rapat Koordinasi BLT Dana Desa", time: "09:00 WIB", loc: `Aula Kantor Desa ${operatorVillage}`, desc: "Rapat koordinasi penyaluran BLT Dana Desa Tahap II. Seluruh perangkat desa wajib hadir membawa daftar penerima manfaat.", pic: "Kepala Desa" },
    { id: 2, date: "24 Jun 2026", title: "Monev Spasial Sertifikasi Lapangan oleh Kecamatan", time: "10:00 WIB", loc: "Balai RW 03", desc: "Monitoring dan evaluasi sertifikasi aset tanah desa oleh Tim Kecamatan. Siapkan dokumen aset dan peta wilayah.", pic: "Admin Kecamatan" },
    { id: 3, date: "05 Jul 2026", title: `Festival Produk Kreatif Pemuda ${operatorVillage}`, time: "08:00 WIB", loc: `Lapangan Utama Desa ${operatorVillage}`, desc: "Festival tahunan menampilkan produk UMKM dan kreasi pemuda desa. Daftarkan produk lapak sebelum 30 Juni 2026.", pic: "Karang Taruna" }
  ];

  // Demographic breakdown data for DonutChart
  const demographicStats = [
    { name: 'Pekerja Swasta & Tani', value: 1420, color: '#0284c7' }, // blue-650
    { name: 'PNS & Aparat Negara', value: 310, color: '#f59e0b' }, // amber-500
    { name: 'Ibu Rumah Tangga', value: 890, color: '#ec4899' }, // pink-500
    { name: 'Pelajar & Mahasiswa', value: 830, color: '#10b981' } // emerald-500
  ];

  // Geo-tagged assets map points specifically for the Operator Desa
  const villageMapAssets = [
    { name: "Kantor Kepala Desa Argo Mulyo", type: "Bangunan", lat: "-4.1284", lng: "104.5932", status: "Hak Pakai/Sertifikasi Lengkap", x: "41%", y: "45%" },
    { name: "Lahan Tanah Kas Desa RT 03", type: "Tanah", lat: "-4.1350", lng: "104.5898", status: "Sertifikat Elektronik", x: "28%", y: "65%" },
    { name: "Posyandu Mawar Argo Mulyo", type: "Bangunan", lat: "-4.1242", lng: "104.5980", status: "Sertifikasi Pemda", x: "68%", y: "30%" },
    { name: "Lapak Sentra Tani Singkong Unggul", type: "Potensi", lat: "-4.1412", lng: "104.5950", status: "BUMDes Aktif", x: "55%", y: "78%" }
  ];

  return (
    <div className="space-y-6">
      
      {/* BAGIAN 1: HEADER STATUS (Alert & Progress) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Status Web Desa & Progress Kelengkapan (8 Columns) */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-stretch justify-between relative overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          
          {/* Left Block: Web Status & Info */}
          <div className="flex-1 space-y-4">
            <div>
              <span className="block text-xs font-inter font-semibold text-slate-500 uppercase tracking-widest">Kondisi Manajemen</span>
              <h2 className="text-xl font-poppins font-semibold text-slate-900 mt-1 flex items-center gap-2">
                Tata Pamong Desa <span className="text-blue-600 italic">Desa {operatorVillage}</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Status Portal Web:</span>
                {webStatus === 'Aktif' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    Aktif (Go-Live)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    Draft Pengeditan
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  const newStatus = webStatus === 'Aktif' ? 'Draft' : 'Aktif';
                  setWebStatus(newStatus);
                  onShowNotification(`Lokal: Status Web Desa berhasil diubah menjadi ${newStatus}`);
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition"
              >
                Ubah Status Web
              </button>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Kelengkapan Berkas & Data Desa
                </span>
                <span className="text-sm font-black text-blue-600">{progressPercent}% Lengkap</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 italic font-sans">
                Lengkapi berkas sisa (Job Desk & Luas Sifat Tanah) untuk mencapai standar pelaporan 100% kecamatan.
              </p>
            </div>
          </div>

          {/* Vertical divider on desktop */}
          <div className="hidden md:block w-px bg-slate-250 self-stretch my-2" />

          {/* Right Block: Dynamic Actionable To-dos list inside progress */}
          <div className="flex-1 flex flex-col justify-between space-y-3">
            <span className="block text-[11px] font-black text-indigo-950 uppercase tracking-wider">Aksi Cepat Kelengkapan:</span>
            
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 leading-tight">
                <input
                  type="checkbox"
                  checked={progressPercent >= 85}
                  onChange={(e) => {
                    setProgressPercent(e.target.checked ? 88 : 78);
                    onShowNotification(e.target.checked ? "Sensus Penduduk ditandai selesai." : "Sensus Penduduk dikembalikan.");
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  id="chk1 text-slate-700"
                />
                <label htmlFor="chk1 text-slate-700" className="cursor-pointer font-sans select-none">Verifikasi Akurasi Sensus Demografi (+10%)</label>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 leading-tight">
                <input
                  type="checkbox"
                  checked={progressPercent === 100}
                  onChange={(e) => {
                    setProgressPercent(e.target.checked ? 100 : 78);
                    onShowNotification(e.target.checked ? "Semua berkas ditandai selesai!" : "Pengaturan berkas dibatalkan");
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  id="chk2"
                />
                <label htmlFor="chk2" className="cursor-pointer font-sans select-none">Sertifikasi & Peta Geo-tagging Aset (+12%)</label>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 leading-tight">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  disabled
                  className="rounded text-slate-400 bg-slate-100 cursor-not-allowed"
                />
                <span className="text-slate-400 line-through font-sans">Daftarkan Profil Struktur BPD & Organisasi (Tercapai)</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setProgressPercent(100);
                onShowNotification("Sukses mengunggah semua instrumen tertinggal!");
              }}
              className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-[11px] uppercase tracking-wider hover:bg-black transition-colors"
            >
              Kirim Semua Data Sisa
            </button>
          </div>
        </div>

        {/* Kotak Alert khusus "Catatan Koreksi dari Kecamatan" (4 Columns) */}
        <div className="xl:col-span-4">
          {!correctionAcknowledged ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-10 -mt-10 pointer-events-none" />
              
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-amber-900">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
                  <span className="text-xs font-poppins font-black uppercase tracking-wider">Koreksi Dari Kecamatan</span>
                </div>
                
                <h3 className="font-poppins font-bold text-sm text-amber-900 leading-snug">
                  Adanya Tanggapan Audit Lapangan & Aset Tanah Kas RT 03
                </h3>
                
                <p className="text-xs text-amber-800 leading-relaxed font-sans">
                  "Mohon lampirkan scan dokumen sertifikat tanah kas desa di samping jalan raya RT 03. Format gambar harus jernih dan batas koordinat spasial tolong diperbaiki di sub-modul Geo Tagging."
                </p>
                <div className="text-[10px] text-amber-700/80 font-mono font-semibold">
                  Dikirim Oleh: Admin Kecamatan (Moch. Ridwan)
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setCorrectionAcknowledged(true);
                    onShowNotification("Status koreksi ditahan. Anda akan segera diarahkan ke modul peta asalkan berkas lengkap.");
                  }}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg transition-colors cursor-pointer"
                >
                  Tandai Selesai Diperbaiki
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-full">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
              <h3 className="font-poppins font-bold text-slate-900 text-sm">Semua Catatan Koreksi Beres!</h3>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Tidak ada tanggapan revisi aktif dari kecamatan saat ini. Wilayah binaan Anda berstatus patuh.
              </p>
              <button
                onClick={() => setCorrectionAcknowledged(false)}
                className="mt-3.5 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Simulasi Munculkan Catatan Koreksi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BAGIAN 2: CARDS STATISTIK (Ringkasan Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Penduduk */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-blue-300 transition-all group">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
              BPS Sensus
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Total Penduduk</span>
            <span className="block text-3xl font-black text-slate-950 font-poppins">{totalPenduduk.total.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-500">Jiwa</span></span>
          </div>
          {/* Detailed breakdown counts of Male/Female */}
          <div className="mt-3 border-t border-slate-100 pt-2 flex justify-between items-center text-xs text-slate-600">
            <span className="font-sans font-medium">👨 Laki: <strong className="text-slate-800">{totalPenduduk.laki.toLocaleString('id-ID')}</strong></span>
            <span className="text-slate-350">|</span>
            <span className="font-sans font-medium">👩 Perempuan: <strong className="text-slate-800">{totalPenduduk.perempuan.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        {/* Card 2: Komoditas Unggulan */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-amber-300 transition-all group">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 uppercase tracking-wide">
              Unggulan Desa
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Sektor Komoditas</span>
            <span className="block text-3xl font-black text-slate-950 font-poppins">{jmlKomoditas} <span className="text-sm font-semibold text-slate-500">Komoditas</span></span>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 font-medium">
            Sektor Unggulan: <strong className="text-slate-800 font-sans">Pertanian & Perkebunan</strong>
          </div>
        </div>

        {/* Card 3: Produk Lapak Aktif */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-pink-300 transition-all group">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 uppercase tracking-wide">
              UMKM Go Digital
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Produk Lapak Aktif</span>
            <span className="block text-3xl font-black text-slate-950 font-poppins">{jmlUMKM} <span className="text-sm font-semibold text-slate-500">Item Produk</span></span>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 font-medium truncate">
            Produk terpopuler: <strong className="text-slate-800 font-sans">Kripik Singkong Madu</strong>
          </div>
        </div>

        {/* Card 4: Total Aset Desa */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-300 transition-all group">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Building className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-250 uppercase tracking-wide">
              Aset terdaftar
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Sertifikasi Aset</span>
            <span className="block text-3xl font-black text-slate-950 font-poppins">{jmlAset} <span className="text-sm font-semibold text-slate-500">Registrasi</span></span>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 font-medium">
            Inventori: <strong className="text-slate-800 font-sans">8 Tanah, 17 Bangunan/Barang</strong>
          </div>
        </div>

      </div>

      {/* BAGIAN 3: GRAFIK & VISUALISASI (Middle Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sebelah Kiri: Grafik data kependudukan (Sektor Pekerjaan Penduduk) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-semibold text-slate-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Komposisi Sektor Pekerjaan Penduduk Desa
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Distribusi demografi sediaan warga produktif berdasarkan survei mandiri tahun 2026.
            </p>
          </div>

          <div className="my-4">
            <DonutChart 
              data={demographicStats} 
              centerLabel={totalPenduduk.total.toLocaleString('id-ID')} 
              centerSub="Total Pekerja" 
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              Mayoritas penduduk adalah pekerja swasta dan bercocok tanam (41.1%). Anda bisa memperbarui sebaran data terperinci melalui menu <strong>Profil & Monografi</strong> jika terjadi pergeseran ekonomi musiman.
            </p>
          </div>
        </div>

        {/* Sebelah Kanan: Peta Geo-tagging Desa (Google Maps) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-poppins font-semibold text-slate-900 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Peta & Geo-tagging Desa {operatorVillage}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Peta lokasi desa beserta titik koordinat aset dan komoditas terdaftar — pilih objek di bawah peta untuk meninjau detail.
              </p>
            </div>
          </div>

          {/* Real Google Maps embed centered on the operator's own village */}
          <div className="my-4 relative h-64 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <iframe
              title={`Peta Desa ${operatorVillage}`}
              src={`https://www.google.com/maps?q=Desa+${encodeURIComponent(operatorVillage || 'Rejosari')},+Kecamatan+Belitang+Jaya,+Kabupaten+Ogan+Komering+Ulu+Timur,+Sumatera+Selatan&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Asset quick-select chips (since the embedded map can't carry custom clickable pins) */}
          <div className="flex flex-wrap gap-2 mb-1">
            {villageMapAssets.map((asset, index) => {
              const isSelected = selectedMapAsset?.name === asset.name;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedMapAsset(asset);
                    onShowNotification(`Menampilkan detail koordinat objek "${asset.name}"`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    isSelected ? 'bg-blue-950 text-white border-blue-950' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${
                    asset.type === 'Bangunan' ? 'text-blue-500' : asset.type === 'Potensi' ? 'text-pink-500' : 'text-emerald-500'
                  }`} />
                  {asset.name}
                </button>
              );
            })}
          </div>

          {/* Display coordinates panel of the selected asset marker */}
          {selectedMapAsset ? (
            <div className="p-3.5 bg-blue-950/80 text-blue-100 rounded-2xl border border-blue-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest block font-sans">
                  Detail Geo-Tagging Aset Teridentifikasi:
                </span>
                <strong className="text-white text-xs block font-poppins mt-0.5">{selectedMapAsset.name}</strong>
                <span className="text-[11px] text-slate-300 block font-sans">
                  Jenis: <strong className="text-slate-100">{selectedMapAsset.type}</strong> | Lat: <code className="text-amber-300">{selectedMapAsset.lat}</code>, Lng: <code className="text-amber-300">{selectedMapAsset.lng}</code>
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-white/10 text-white border border-white/20 rounded-md">
                {selectedMapAsset.status}
              </span>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 text-slate-500 rounded-2xl border border-slate-200 text-center text-xs italic font-sans font-medium">
              Silakan pilih salah satu objek di atas untuk memuat detail koordinat geografisnya.
            </div>
          )}

        </div>

      </div>

      {/* BAGIAN 4: AKTIVITAS & AGENDA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Riwayat Log Aktivitas dengan Filter */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-poppins font-semibold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Rincian Riwayat Log Aktivitas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Rekam jejak tindakan pelaporan yang tersimpan.</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Filter:</span>
            {['Semua','UMKM','Berita','Aset','Kependudukan','Sistem','Monografi'].map(cat => (
              <button key={cat} onClick={() => setFilterLogCategory(cat)}
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer transition ${
                  filterLogCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}>{cat}</button>
            ))}
          </div>

          {/* Add Log Form */}
          <form onSubmit={handleAddLog} className="flex gap-2">
            <input type="text" required value={newLogDesc} onChange={e => setNewLogDesc(e.target.value)}
              placeholder="Tambah catatan aktivitas baru..."
              className="flex-1 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <select value={newLogCategory} onChange={e => setNewLogCategory(e.target.value)}
              className="px-2 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none cursor-pointer font-semibold">
              <option>Sistem</option><option>UMKM</option><option>Berita</option><option>Aset</option><option>Monografi</option><option>Kependudukan</option>
            </select>
            <button type="submit" className="bg-slate-900 hover:bg-black text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition cursor-pointer">
              <PlusCircle className="w-4 h-4" />Catat
            </button>
          </form>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-black uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Waktu</th>
                  <th className="py-2.5 px-4">Kategori</th>
                  <th className="py-2.5 px-4">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredActivities.length === 0 ? (
                  <tr><td colSpan={3} className="py-6 text-center text-slate-400 text-xs">Tidak ada aktivitas untuk kategori ini.</td></tr>
                ) : filteredActivities.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500 whitespace-nowrap">{log.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg border uppercase tracking-wider ${
                        log.category === 'UMKM' ? 'bg-pink-50 text-pink-700 border-pink-200'
                        : log.category === 'Berita' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : log.category === 'Aset' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : log.category === 'Kependudukan' ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>{log.category}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 leading-snug">{log.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kalender Agenda — klik pindah halaman detail */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-4">
          {selectedAgenda ? (
            /* Detail Agenda Page */
            <div className="flex-1 flex flex-col space-y-4">
              <button onClick={() => setSelectedAgenda(null)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer transition">
                ← Kembali ke Kalender
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-950 rounded-2xl flex flex-col items-center justify-center font-black border border-blue-200 shrink-0">
                  <span className="text-[9px] font-bold uppercase">{selectedAgenda.date.split(' ')[2]}</span>
                  <span className="text-lg -mt-0.5">{selectedAgenda.date.split(' ')[0]}</span>
                  <span className="text-[9px] font-bold uppercase">{selectedAgenda.date.split(' ')[1]}</span>
                </div>
                <div>
                  <h3 className="font-poppins font-black text-slate-900 text-base leading-tight">{selectedAgenda.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">⏰ {selectedAgenda.time} · 📍 {selectedAgenda.loc}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{selectedAgenda.desc}</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Penanggung Jawab</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedAgenda.pic}</span>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Status</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">Terjadwal</span>
                </div>
              </div>
              <button onClick={() => { onShowNotification(`Pengingat agenda "${selectedAgenda.title}" berhasil ditambahkan.`); }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition">
                + Tambahkan Pengingat
              </button>
            </div>
          ) : (
            /* Kalender List */
            <>
              <div>
                <h3 className="font-poppins font-semibold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Kalender Kegiatan & Agenda Desa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Klik agenda untuk melihat detail lengkap.</p>
              </div>
              <div className="space-y-3 flex-1 py-1">
                {upcomingAgendas.map(agenda => (
                  <button key={agenda.id} onClick={() => setSelectedAgenda(agenda)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 border border-slate-150 hover:border-blue-200 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer">
                    <div className="w-14 h-14 bg-blue-100 text-blue-950 font-poppins rounded-xl flex flex-col items-center justify-center font-black flex-shrink-0 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors text-center">
                      <span className="text-[9px] uppercase font-bold">{agenda.date.split(' ')[2]}</span>
                      <span className="text-xs font-black">{agenda.date.split(' ')[0]}</span>
                      <span className="text-[9px] font-bold uppercase">{agenda.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-poppins font-bold text-slate-900 text-xs truncate group-hover:text-blue-700">{agenda.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">⏰ {agenda.time} · 📍 {agenda.loc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0" />
                  </button>
                ))}
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900">
                💡 Klik setiap agenda untuk membuka detail, lokasi, dan menambahkan pengingat.
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
