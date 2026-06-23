/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Newspaper, Image as ImageIcon, Calendar, BookOpen,
  ToggleRight, BarChart2, ChevronLeft, Search,
  CheckCircle, Clock, AlertCircle, Eye, Trash2, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSyncedState } from '../lib/useSyncedState';
import { publishBerita } from '../lib/portalSync';
import { logActivity } from '../lib/activityLog';

interface ModuleBeritaKegiatanProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
}

type SubKey = '6.1' | '6.2' | '6.3' | '6.4' | '6.5' | '6.6';

const subTabs: { id: SubKey; label: string; icon: React.ElementType }[] = [
  { id: '6.1', label: 'Rekap Berita & Galeri', icon: Newspaper },
  { id: '6.2', label: 'Galeri Kegiatan',        icon: ImageIcon },
  { id: '6.3', label: 'Kalender Kegiatan',      icon: Calendar },
  { id: '6.4', label: 'Pengumuman Resmi',        icon: BookOpen },
  { id: '6.5', label: 'Status Publikasi',        icon: ToggleRight },
  { id: '6.6', label: 'Statistik Konten',        icon: BarChart2 },
];

/* ── photo helper (Unsplash via source URL) ── */
const beritaPhotos = [
  'https://www.bloranews.com/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-17-at-13.11.32-e1650185820554.jpeg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnLue2bloQoUuXbpQzWZma6nuR2iF2pGRkNv5052gL3Q&s=10',
  'https://desadalung.badungkab.go.id/storage/desadalung/image/Potret%20Antusias%20Posyandu%20Balita%20Banjar%20Tegal%20Jaya%20Dalung%20di%20Bulan%20Juni.jpeg',
  'https://cdn.antaranews.com/cache/1200x800/2026/04/11/IMG-20251023-WA0031.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStbK_2_oPmfSConERli5EjZn_M0cDvu_WuvRQGH7K1LA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAy5gzBR0FPKSOyZaXdisk13oCQMCMnstfNztsPjD6HK73AmBoDR6NX14L&s=10',
];
const galeriPhotos = [
  'https://desabaha.badungkab.go.id/storage/desabaha/image/WhatsApp%20Image%202022-01-11%20at%2009.09.48%20(1).jpeg',
  'https://desa-babakanjati.kuningankab.go.id/sites/des2106/files/berita-photo/RAKOR%20BPD%20DAN%20PEMDES.jpeg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGjM7-BAPfqEL1fgewnEcd2GJCaoTndvKg3X1DLcIlAPTEtiECjpUHFCFU&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-EFXr_wMGL047KeuuD68WmSr0ydXPrdYxATHMZZVUZQ&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTvlDDm-13Ja_rH6hhbrLZMtzpqtHQWGd-8HZOQqP-s2gjLSAalzc9E0Y&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHjXX25iobyIvZGdqQKUcwTUmkRHMlcpUXcT3xHsH2dZtcbSFYmqoCFYw&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg7_sWTuxlwV93TqKCRGj7Euesbk-6TBwvkopyr3CLdr6EXDjsxvybZf3p&s=10',
  'https://dailykaltim.co/glameely/2024/09/WhatsApp-Image-2024-09-01-at-15.11.08.jpeg',
];

/* ── DATA ── */
const beritaData = [
  { id:'b0', judul:'Panen Padi Organik Desa Rejosari Capai Hasil Memuaskan', desa:'Rejosari', kategori:'Pertanian', tanggal:'12 Jun 2025', penulis:'Suparno, S.Sos.', ringkasan:'Kelompok tani organik Desa Rejosari berhasil memanen padi seluas 45 hektar dengan hasil rata-rata 6,8 ton per hektar tanpa pupuk kimia, menjadi percontohan pertanian organik kecamatan.', photo: beritaPhotos[0], status:'Terbit' },
  { id:'b1', judul:'Pembangunan Jalan Desa Argo Mulyo Rampung Tepat Waktu', desa:'Argo Mulyo', kategori:'Pembangunan', tanggal:'10 Jun 2025', penulis:'Budi Santoso', ringkasan:'Proyek peningkatan jalan desa sepanjang 1,2 km telah diselesaikan oleh kontraktor lokal. Warga menyambut antusias karena akses ke sawah dan pasar jadi lebih mudah.', photo: beritaPhotos[1], status:'Terbit' },
  { id:'b2', judul:'Posyandu Balita Banjar Rejo Raih Penghargaan Nasional',  desa:'Banjar Rejo', kategori:'Kesehatan',    tanggal:'08 Jun 2025', penulis:'Siti Rahayu',  ringkasan:'Posyandu Anggrek Banjar Rejo menerima penghargaan posyandu terbaik tingkat nasional dari Kemenkes RI. Keberhasilan ini atas dedikasi 12 kader posyandu aktif selama 5 tahun terakhir.', photo: beritaPhotos[2], status:'Terbit' },
  { id:'b3', judul:'Panen Raya Padi Girimulyo Tembus 7 Ton per Hektar',      desa:'Girimulyo',   kategori:'Pertanian',    tanggal:'05 Jun 2025', penulis:'Ahmad Fauzi',  ringkasan:'Kelompok tani Sumber Makmur berhasil mencapai produktivitas tertinggi tahun ini. Penggunaan varietas unggul IR64 dan pupuk organik lokal jadi kunci keberhasilan.', photo: beritaPhotos[3], status:'Terbit' },
  { id:'b4', judul:'Pelatihan Digital Marketing UMKM Desa Karya Makmur',       desa:'Karya Makmur', kategori:'Ekonomi',      tanggal:'03 Jun 2025', penulis:'Dewi Kusuma', ringkasan:'Sebanyak 35 pelaku UMKM Karya Makmur mengikuti workshop pemasaran digital yang difasilitasi Dinas Koperasi. Peserta belajar cara berjualan di marketplace dan media sosial.', photo: beritaPhotos[4], status:'Terbit' },
  { id:'b5', judul:'Gotong Royong Bersih Sungai Madu Condo Libatkan 200 Warga', desa:'Madu Condo',   kategori:'Lingkungan',   tanggal:'01 Jun 2025', penulis:'Hendra Wijaya', ringkasan:'Warga Madu Condo bersatu membersihkan Sungai Kali Bening dari sampah plastik. Kegiatan rutin bulanan ini diinisiasi karang taruna desa bersama kelompok lingkungan hidup.', photo: beritaPhotos[5], status:'Terbit' },
  { id:'b6', judul:'Festival Budaya Margokoyo Tampilkan Seni Tradisional',    desa:'Margokoyo', kategori:'Budaya',       tanggal:'28 Mei 2025', penulis:'Kopdes Margokoyo', ringkasan:'Festival tahunan Margokoyo tahun ini menampilkan 15 grup kesenian daerah. Ribuan penonton dari berbagai desa hadir menyaksikan pertunjukan wayang, tari tradisional, dan musik gamelan.', photo: beritaPhotos[0], status:'Terbit' },
];

const galeriData = [
  { id:'g1', judul:'Posyandu Rutin Balita', desa:'Banjar Rejo', tgl:'10 Jun 2025', photo: galeriPhotos[0], kategori:'Kesehatan' },
  { id:'g2', judul:'Rapat Koordinasi Desa', desa:'Argo Mulyo',  tgl:'09 Jun 2025', photo: galeriPhotos[1], kategori:'Pemerintahan' },
  { id:'g3', judul:'Pelatihan Jahit UMKM',  desa:'Karya Makmur', tgl:'08 Jun 2025', photo: galeriPhotos[2], kategori:'Ekonomi' },
  { id:'g4', judul:'Pasar Desa Pagi',       desa:'Margokoyo',  tgl:'07 Jun 2025', photo: galeriPhotos[3], kategori:'Ekonomi' },
  { id:'g5', judul:'Lomba Memasak Kartini', desa:'Girimulyo',   tgl:'06 Jun 2025', photo: galeriPhotos[4], kategori:'Budaya' },
  { id:'g6', judul:'Upacara HUT RI',        desa:'Argo Mulyo',  tgl:'17 Agt 2024', photo: galeriPhotos[5], kategori:'Nasional' },
  { id:'g7', judul:'Donor Darah Massal',    desa:'Madu Condo',   tgl:'04 Jun 2025', photo: galeriPhotos[6], kategori:'Kesehatan' },
  { id:'g8', judul:'Expo Produk UMKM',      desa:'Banjar Rejo', tgl:'03 Jun 2025', photo: galeriPhotos[7], kategori:'Ekonomi' },
];

const kalenderData = [
  { tgl:'16 Jun', hari:'Senin',  kegiatan:'Rapat Koordinasi Bulanan Kecamatan', lokasi:'Kantor Kecamatan', pic:'Admin Kecamatan', warna:'bg-blue-500' },
  { tgl:'17 Jun', hari:'Selasa', kegiatan:'Posyandu Balita Desa Argo Mulyo',       lokasi:'Balai Desa Argo Mulyo', pic:'Kader Posyandu', warna:'bg-emerald-500' },
  { tgl:'18 Jun', hari:'Rabu',   kegiatan:'Musrenbangdes Banjar Rejo 2025',         lokasi:'Balai Desa Banjar Rejo', pic:'Kepala Desa', warna:'bg-amber-500' },
  { tgl:'20 Jun', hari:'Jumat',  kegiatan:'Penyaluran BLT-DD Girimulyo',           lokasi:'Kantor Desa Girimulyo', pic:'Kasi Pelayanan', warna:'bg-violet-500' },
  { tgl:'22 Jun', hari:'Minggu', kegiatan:'Gotong Royong Madu Condo',               lokasi:'Area Sungai Madu Condo', pic:'Karang Taruna', warna:'bg-rose-500' },
  { tgl:'24 Jun', hari:'Selasa', kegiatan:'Pelatihan Operator Desa',             lokasi:'Aula Kecamatan', pic:'Dinas PMD', warna:'bg-indigo-500' },
  { tgl:'25 Jun', hari:'Rabu',   kegiatan:'Panen Raya Padi Karya Makmur',           lokasi:'Sawah Kelompok Tani', pic:'Poktan Sumber Makmur', warna:'bg-teal-500' },
  { tgl:'27 Jun', hari:'Jumat',  kegiatan:'Evaluasi APBDes Triwulan II',         lokasi:'Kantor Kecamatan', pic:'Admin Kecamatan', warna:'bg-slate-600' },
];

const pengumumanData = [
  { id:'p1', judul:'Batas Waktu Penyerahan SPJ BOP Tahap I', tanggal:'12 Jun 2025', urgensi:'Mendesak', isi:'Seluruh Kepala Desa dan Bendahara Desa diwajibkan menyerahkan SPJ BOP Tahap I paling lambat 20 Juni 2025. Keterlambatan akan mempengaruhi pencairan dana tahap berikutnya.', sudahBaca: ['Argo Mulyo','Banjar Rejo'], belumBaca: ['Girimulyo','Karya Makmur','Madu Condo','Margokoyo'] },
  { id:'p2', judul:'Verifikasi Data IDM Tahun 2025',          tanggal:'08 Jun 2025', urgensi:'Penting',   isi:'Dinas PMD meminta seluruh operator desa untuk memverifikasi data Indeks Desa Membangun (IDM) tahun 2025 melalui sistem Prodeskel paling lambat 30 Juni 2025.', sudahBaca: ['Argo Mulyo','Banjar Rejo','Girimulyo','Margokoyo'], belumBaca: ['Karya Makmur','Madu Condo'] },
  { id:'p3', judul:'Jadwal Monev Program P3MD Kecamatan',     tanggal:'05 Jun 2025', urgensi:'Informasi', isi:'Kecamatan Belitang Jaya akan melaksanakan Monitoring dan Evaluasi P3MD di seluruh desa mulai 15-25 Juli 2025. Harap menyiapkan dokumen APBDes, laporan realisasi, dan bukti kegiatan.', sudahBaca: ['Argo Mulyo','Banjar Rejo','Girimulyo','Karya Makmur','Madu Condo','Margokoyo'], belumBaca: [] },
];

const publikasiData = [
  { judul:'Panen Padi Organik Desa Rejosari',  desa:'Rejosari',   tgl:'12 Jun 2025', status:'Terbit',           kategori:'Pertanian' },
  { judul:'Pembangunan Jalan Desa Argo Mulyo', desa:'Argo Mulyo', tgl:'10 Jun 2025', status:'Terbit',           kategori:'Pembangunan' },
  { judul:'Posyandu Balita Banjar Rejo',       desa:'Banjar Rejo',tgl:'08 Jun 2025', status:'Terbit',           kategori:'Kesehatan' },
  { judul:'Panen Raya Padi Girimulyo',         desa:'Girimulyo',  tgl:'05 Jun 2025', status:'Terbit',           kategori:'Pertanian' },
  { judul:'Program Beasiswa Desa Madu Condo',   desa:'Madu Condo',  tgl:'03 Jun 2025', status:'Draft',            kategori:'Pendidikan' },
  { judul:'Festival Budaya Margokoyo',        desa:'Margokoyo', tgl:'28 Mei 2025', status:'Terbit',           kategori:'Budaya' },
  { judul:'Infrastruktur Jembatan Baru',     desa:'Karya Makmur',tgl:'25 Mei 2025', status:'Perlu Diperbarui', kategori:'Pembangunan' },
  { judul:'Laporan BLT Dana Desa Q1',        desa:'Argo Mulyo', tgl:'20 Mei 2025', status:'Arsip',            kategori:'Keuangan' },
];

const statData = [
  { desa:'Argo Mulyo',  berita:12, galeri:8, pengumuman:5, total:25 },
  { desa:'Banjar Rejo', berita:10, galeri:6, pengumuman:4, total:20 },
  { desa:'Girimulyo',   berita:7,  galeri:5, pengumuman:3, total:15 },
  { desa:'Karya Makmur', berita:9,  galeri:7, pengumuman:4, total:20 },
  { desa:'Madu Condo',   berita:6,  galeri:4, pengumuman:2, total:12 },
  { desa:'Margokoyo',  berita:11, galeri:9, pengumuman:5, total:25 },
];

const statusColor: Record<string, string> = {
  'Terbit':           'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Draft':            'bg-slate-100 text-slate-600 border-slate-200',
  'Arsip':            'bg-amber-50 text-amber-700 border-amber-200',
  'Perlu Diperbarui': 'bg-rose-50 text-rose-700 border-rose-200',
};
const urgensiColor: Record<string, string> = {
  'Mendesak':  'bg-rose-600 text-white',
  'Penting':   'bg-amber-500 text-white',
  'Informasi': 'bg-blue-600 text-white',
};
const kategoriColor: Record<string, string> = {
  'Pembangunan':'bg-blue-50 text-blue-700','Kesehatan':'bg-rose-50 text-rose-700',
  'Pertanian':'bg-emerald-50 text-emerald-700','Ekonomi':'bg-amber-50 text-amber-700',
  'Budaya':'bg-violet-50 text-violet-700','Lingkungan':'bg-teal-50 text-teal-700',
  'Nasional':'bg-indigo-50 text-indigo-700','Pemerintahan':'bg-slate-100 text-slate-700',
};

export const ModuleBeritaKegiatan: React.FC<ModuleBeritaKegiatanProps> = ({ onShowNotification, userRole, operatorVillage }) => {
  const [activeTab, setActiveTab] = useState<SubKey>('6.1');
  const [selectedBerita, setSelectedBerita] = useState<typeof beritaData[0] | null>(null);
  const [beritaSearch, setBeritaSearch] = useState('');
  const [selectedGaleri, setSelectedGaleri] = useState<typeof galeriData[0] | null>(null);
  const [selectedPengumuman, setSelectedPengumuman] = useState<typeof pengumumanData[0] | null>(null);

  // 6.5 Status Publikasi — kini tersinkron lewat Data Server Lokal: Admin &
  // Operator melihat data yang sama, dan publikasi berstatus "Terbit" milik
  // Desa Rejosari otomatis tampil di Portal Rejosari (menu Berita).
  const [publikasiList, setPublikasiList] = useSyncedState('kec_publikasi', publikasiData);

  useEffect(() => {
    publishBerita(publikasiList);
  }, [publikasiList]);
  const isOperator = userRole === 'Operator';
  const filteredPublikasi = isOperator
    ? publikasiList.filter(p => p.desa === operatorVillage)
    : publikasiList;
  const [showTambahKontenModal, setShowTambahKontenModal] = useState(false);
  const [showUbahStatusModal, setShowUbahStatusModal] = useState<typeof publikasiData[0] | null>(null);
  const [tambahForm, setTambahForm] = useState({ judul: '', desa: 'Argo Mulyo', kategori: 'Pembangunan', status: 'Draft' });

  const filteredBerita = beritaData.filter(b =>
    b.judul.toLowerCase().includes(beritaSearch.toLowerCase()) ||
    b.desa.toLowerCase().includes(beritaSearch.toLowerCase()) ||
    b.kategori.toLowerCase().includes(beritaSearch.toLowerCase())
  );

  return (
    <div className="space-y-0">
      {/* Header + Tab Bar */}
      <div className="bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 rounded-3xl shadow-xl relative overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 p-6 pb-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Modul 6</span>
              <h2 className="text-xl font-black text-white leading-tight">Berita & Kegiatan Desa</h2>
            </div>
          </div>
          <div className="flex gap-2 pb-5 overflow-x-auto scrollbar-hide">
            {subTabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setSelectedBerita(null); setSelectedGaleri(null); setSelectedPengumuman(null); }}
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

        {/* ── 6.1 REKAP BERITA ── */}
        {activeTab === '6.1' && !selectedBerita && (
          <motion.div key="6.1-list" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 shadow-sm p-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0"/>
              <input value={beritaSearch} onChange={e=>setBeritaSearch(e.target.value)} placeholder="Cari berita, desa, atau kategori..." className="flex-1 text-xs outline-none text-slate-700"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBerita.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={b.photo} alt={b.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${kategoriColor[b.kategori] || 'bg-slate-100 text-slate-700'}`}>{b.kategori}</span>
                    <span className="absolute bottom-3 left-3 text-white text-[10px] font-semibold">{b.tanggal}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight line-clamp-2">{b.judul}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1">{b.ringkasan}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500">Desa {b.desa} · {b.penulis}</span>
                      <button onClick={() => setSelectedBerita(b)} className="flex items-center gap-1 text-[11px] font-extrabold text-blue-700 hover:text-blue-900 cursor-pointer">
                        <Eye className="w-3.5 h-3.5"/>Baca
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 6.1 DETAIL BERITA ── */}
        {activeTab === '6.1' && selectedBerita && (
          <motion.div key="6.1-detail" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0}}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="relative h-64">
                <img src={selectedBerita.photo} alt={selectedBerita.judul} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <button onClick={()=>setSelectedBerita(null)} className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/30 transition">
                  <ChevronLeft className="w-3.5 h-3.5"/>Kembali
                </button>
                <div className="absolute bottom-5 left-6 right-6">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-2 inline-block ${kategoriColor[selectedBerita.kategori]||'bg-slate-100 text-slate-700'}`}>{selectedBerita.kategori}</span>
                  <h2 className="text-white font-black text-xl leading-tight">{selectedBerita.judul}</h2>
                  <p className="text-slate-300 text-xs mt-1">Desa {selectedBerita.desa} · {selectedBerita.penulis} · {selectedBerita.tanggal}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-700 leading-relaxed text-sm">{selectedBerita.ringkasan}</p>
                <p className="text-slate-600 leading-relaxed text-sm mt-4">
                  Kegiatan ini merupakan bagian dari program pemberdayaan masyarakat yang dicanangkan oleh pemerintah desa dalam rangka meningkatkan kualitas hidup warga. Seluruh elemen masyarakat turut berpartisipasi aktif demi kemajuan bersama.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm mt-4">
                  Kepala Desa menyampaikan apresiasi kepada seluruh pihak yang terlibat dan berharap program ini dapat terus berlanjut di tahun-tahun mendatang sebagai wujud nyata kolaborasi antara pemerintah desa dan masyarakat.
                </p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <button onClick={()=>onShowNotification('Berita berhasil dipublikasikan ulang.')} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer">
                    <CheckCircle className="w-3.5 h-3.5"/>Terbitkan
                  </button>
                  <button onClick={()=>onShowNotification('Berita masuk mode draft.')} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer">
                    <Edit className="w-3.5 h-3.5"/>Edit Draft
                  </button>
                  <button onClick={()=>onShowNotification('Berita diarsipkan.')} className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5"/>Arsipkan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 6.2 GALERI ── */}
        {activeTab === '6.2' && !selectedGaleri && (
          <motion.div key="6.2-grid" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Galeri Dokumentasi Foto</h3>
              </div>
              <span className="text-[10px] font-extrabold bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">{galeriData.length} Foto Terdokumentasi</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {galeriData.map(g => (
                <div key={g.id} onClick={()=>setSelectedGaleri(g)} className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/3] border border-slate-200">
                  <img src={g.photo} alt={g.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                  <div className="absolute top-2 right-2">
                    <ImageIcon className="w-3.5 h-3.5 text-white/80" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full mb-1 inline-block ${kategoriColor[g.kategori]||'bg-slate-100 text-slate-700'}`}>{g.kategori}</span>
                    <h4 className="text-white font-extrabold text-xs leading-tight">{g.judul}</h4>
                    <p className="text-slate-300 text-[10px]">Desa {g.desa} · {g.tgl}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── 6.2 GALERI DETAIL ── */}
        {activeTab === '6.2' && selectedGaleri && (
          <motion.div key="6.2-detail" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
            <button onClick={()=>setSelectedGaleri(null)} className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer mb-4">
              <ChevronLeft className="w-4 h-4"/>Kembali ke Galeri
            </button>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="relative h-80">
                <img src={selectedGaleri.photo} alt={selectedGaleri.judul} className="w-full h-full object-cover"/>
              </div>
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${kategoriColor[selectedGaleri.kategori]||'bg-slate-100 text-slate-700'}`}>{selectedGaleri.kategori}</span>
                  <h3 className="font-black text-slate-900 text-xl mt-2">{selectedGaleri.judul}</h3>
                  <p className="text-sm text-slate-500 mt-1">Desa {selectedGaleri.desa} · {selectedGaleri.tgl}</p>
                </div>
                <button onClick={()=>onShowNotification('Foto berhasil diunduh.')} className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer">↓ Unduh Foto</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 6.3 KALENDER (timeline style — visually distinct from photo-grid Galeri) ── */}
        {activeTab === '6.3' && (
          <motion.div key="6.3" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-950 to-blue-900 rounded-2xl shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-white text-sm">Kalender Kegiatan — Juni 2025</h3>
                  <p className="text-[11px] text-indigo-200">Agenda terpadu seluruh desa Kecamatan Belitang Jaya</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-full">{kalenderData.length} Agenda</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="relative pl-6 border-l-2 border-dashed border-slate-200 space-y-4">
                {kalenderData.map((k,i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow ${k.warna}`} />
                    <div
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-slate-100"
                      onClick={()=>onShowNotification(`Detail kegiatan: ${k.kegiatan}`)}
                    >
                      <div className={`shrink-0 text-center rounded-xl p-2 min-w-[58px] text-white ${k.warna}`}>
                        <span className="block text-[9px] font-extrabold uppercase opacity-90">{k.hari.slice(0,3)}</span>
                        <span className="block text-lg font-black">{k.tgl.split(' ')[0]}</span>
                        <span className="block text-[9px] font-bold opacity-90">{k.tgl.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-slate-900 text-sm">{k.kegiatan}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">📍 {k.lokasi} · PIC: {k.pic}</p>
                      </div>
                      <button onClick={e=>{e.stopPropagation();onShowNotification(`Pengingat ditambahkan: ${k.kegiatan}`)}} className="shrink-0 text-[10px] font-bold border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg cursor-pointer text-slate-600">+ Ingatkan</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 6.4 PENGUMUMAN ── */}
        {activeTab === '6.4' && !selectedPengumuman && (
          <motion.div key="6.4-list" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            {userRole === 'Admin' && (
              <button onClick={()=>onShowNotification('Form pengumuman baru dibuka.')} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer">
                + Buat Pengumuman Baru
              </button>
            )}
            {pengumumanData.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:shadow-md transition cursor-pointer" onClick={()=>setSelectedPengumuman(p)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${urgensiColor[p.urgensi]}`}>{p.urgensi}</span>
                      <span className="text-[10px] text-slate-400">{p.tanggal}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900">{p.judul}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.isi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle className="w-3 h-3"/>{p.sudahBaca.length} desa sudah baca</span>
                  {p.belumBaca.length > 0 && <span className="flex items-center gap-1 text-rose-500 font-bold"><AlertCircle className="w-3 h-3"/>{p.belumBaca.length} belum baca</span>}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── 6.4 PENGUMUMAN DETAIL ── */}
        {activeTab === '6.4' && selectedPengumuman && (
          <motion.div key="6.4-detail" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0}}>
            <button onClick={()=>setSelectedPengumuman(null)} className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer mb-4">
              <ChevronLeft className="w-4 h-4"/>Kembali ke Pengumuman
            </button>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
              <div className="flex items-start gap-3">
                <span className={`shrink-0 text-[11px] font-extrabold px-3 py-1 rounded-full ${urgensiColor[selectedPengumuman.urgensi]}`}>{selectedPengumuman.urgensi}</span>
                <div>
                  <h2 className="font-black text-slate-900 text-xl leading-tight">{selectedPengumuman.judul}</h2>
                  <p className="text-xs text-slate-400 mt-1">Diterbitkan: {selectedPengumuman.tanggal} · Admin Kecamatan Belitang Jaya</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 text-sm text-slate-700 leading-relaxed">{selectedPengumuman.isi}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                  <h5 className="text-xs font-extrabold text-emerald-700 mb-2 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/>Sudah Dibaca ({selectedPengumuman.sudahBaca.length})</h5>
                  <div className="flex flex-wrap gap-1.5">{selectedPengumuman.sudahBaca.map(d=><span key={d} className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Desa {d}</span>)}</div>
                </div>
                <div className="bg-rose-50 rounded-xl border border-rose-100 p-4">
                  <h5 className="text-xs font-extrabold text-rose-700 mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/>Belum Dibaca ({selectedPengumuman.belumBaca.length})</h5>
                  <div className="flex flex-wrap gap-1.5">{selectedPengumuman.belumBaca.length>0 ? selectedPengumuman.belumBaca.map(d=><span key={d} className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">Desa {d}</span>) : <span className="text-[11px] text-emerald-700 font-bold">Semua desa sudah membaca ✓</span>}</div>
                </div>
              </div>
              <button onClick={()=>onShowNotification('Pengingat dikirim ulang ke desa yang belum membaca.')} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl cursor-pointer">Kirim Ulang ke yang Belum Baca</button>
            </div>
          </motion.div>
        )}

        {/* ── 6.5 STATUS PUBLIKASI ── */}
        {activeTab === '6.5' && (
          <motion.div key="6.5" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900">Manajemen Status Publikasi Konten</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isOperator
                      ? `Kelola status penerbitan konten berita dan kegiatan Desa ${operatorVillage}.`
                      : 'Kelola status penerbitan seluruh konten berita dan kegiatan desa.'}
                  </p>
                </div>
                <button onClick={()=>setShowTambahKontenModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer">
                  + Tambah Konten
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-600 text-left">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-4">Judul Konten</th>
                      <th className="p-4">Desa</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPublikasi.map((p,i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="p-4 font-bold text-slate-900 max-w-[220px]"><span className="line-clamp-1">{p.judul}</span></td>
                        <td className="p-4">Desa {p.desa}</td>
                        <td className="p-4"><span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${kategoriColor[p.kategori]||'bg-slate-50 text-slate-600 border-slate-200'}`}>{p.kategori}</span></td>
                        <td className="p-4 text-slate-400">{p.tgl}</td>
                        <td className="p-4"><span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusColor[p.status]}`}>{p.status}</span></td>
                        <td className="p-4 text-center">
                          <div className="flex gap-1.5 justify-center">
                            <button onClick={()=>setShowUbahStatusModal(p)} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-extrabold rounded-lg cursor-pointer flex items-center gap-1">
                              <Edit className="w-3 h-3"/>Ubah
                            </button>
                            <button onClick={()=>{ setPublikasiList(prev=>prev.filter(item=>item!==p)); onShowNotification(`Konten "${p.judul}" berhasil dihapus.`); }} className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold rounded-lg cursor-pointer hover:bg-rose-100">
                              <Trash2 className="w-3 h-3"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPublikasi.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-bold">Belum ada konten. Klik "+ Tambah Konten" untuk menambahkan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Tambah Konten */}
            <AnimatePresence>
              {showTambahKontenModal && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} exit={{scale:0.95,y:12}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-900 to-purple-900">
                      <div>
                        <h3 className="font-black text-white text-base flex items-center gap-2"><Newspaper className="w-4 h-4 text-amber-400"/>Tambah Konten Baru</h3>
                        <p className="text-[11px] text-slate-300 mt-0.5">Isi data konten berita atau kegiatan</p>
                      </div>
                      <button onClick={()=>setShowTambahKontenModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white">✕</button>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Judul Konten *</label>
                        <input value={tambahForm.judul} onChange={e=>setTambahForm(p=>({...p,judul:e.target.value}))} placeholder="Contoh: Pembangunan Jalan Desa..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Desa</label>
                          {isOperator ? (
                            <div className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-600 font-bold">
                              Desa {operatorVillage}
                            </div>
                          ) : (
                            <select value={tambahForm.desa} onChange={e=>setTambahForm(p=>({...p,desa:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                              {['Rejosari','Argo Mulyo','Banjar Rejo','Girimulyo','Karya Makmur','Madu Condo','Margokoyo'].map(d=><option key={d}>{d}</option>)}
                            </select>
                          )}
                        </div>
                        <div>
                          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Kategori</label>
                          <select value={tambahForm.kategori} onChange={e=>setTambahForm(p=>({...p,kategori:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {['Pembangunan','Kesehatan','Pertanian','Ekonomi','Budaya','Lingkungan','Pendidikan','Keuangan'].map(k=><option key={k}>{k}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Status Awal</label>
                        <div className="flex gap-2">
                          {['Draft','Terbit','Arsip'].map(s=>(
                            <button key={s} onClick={()=>setTambahForm(p=>({...p,status:s}))} className={`flex-1 py-2 text-xs font-extrabold rounded-xl border-2 cursor-pointer transition ${tambahForm.status===s ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 p-5 border-t border-slate-100">
                      <button onClick={()=>setShowTambahKontenModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer">Batal</button>
                      <button onClick={()=>{
                        if(!tambahForm.judul.trim()){onShowNotification('Judul konten tidak boleh kosong.');return;}
                        const now=new Date();
                        const desaFinal = isOperator ? (operatorVillage || tambahForm.desa) : tambahForm.desa;
                        setPublikasiList(prev=>[{judul:tambahForm.judul,desa:desaFinal,tgl:`${now.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'][now.getMonth()]} ${now.getFullYear()}`,status:tambahForm.status,kategori:tambahForm.kategori},...prev]);
                        onShowNotification(`Konten "${tambahForm.judul}" berhasil ditambahkan.`);
                        logActivity({
                          villageName: desaFinal,
                          type: 'Berita Baru',
                          detail: `Konten "${tambahForm.judul}" (${tambahForm.kategori}) ditambahkan dengan status ${tambahForm.status}.`,
                          category: 'Pemerintahan',
                          status: tambahForm.status as any,
                        });
                        setTambahForm({judul:'',desa:'Argo Mulyo',kategori:'Pembangunan',status:'Draft'});
                        setShowTambahKontenModal(false);
                      }} className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-sm rounded-xl cursor-pointer">Simpan Konten</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Ubah Status */}
            <AnimatePresence>
              {showUbahStatusModal && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} exit={{scale:0.95,y:12}} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-amber-700 to-orange-700">
                      <div>
                        <h3 className="font-black text-white text-base flex items-center gap-2"><Edit className="w-4 h-4"/>Ubah Status Publikasi</h3>
                        <p className="text-[11px] text-amber-200 mt-0.5 line-clamp-1">{showUbahStatusModal.judul}</p>
                      </div>
                      <button onClick={()=>setShowUbahStatusModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white">✕</button>
                    </div>
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600">Pilih status baru untuk konten ini:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Draft','Terbit','Arsip','Perlu Diperbarui'].map(s=>(
                          <button key={s} onClick={()=>{
                            setPublikasiList(prev=>prev.map(p=>p.judul===showUbahStatusModal.judul?{...p,status:s}:p));
                            onShowNotification(`Status "${showUbahStatusModal.judul}" diubah menjadi "${s}".`);
                            setShowUbahStatusModal(null);
                          }} className={`py-2.5 text-xs font-extrabold rounded-xl border-2 cursor-pointer transition ${showUbahStatusModal.status===s ? 'border-slate-900 bg-slate-900 text-white' : `border-slate-200 hover:bg-slate-50 text-slate-700`}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 border-t border-slate-100">
                      <button onClick={()=>setShowUbahStatusModal(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer">Batal</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── 6.6 STATISTIK ── */}
        {activeTab === '6.6' && (
          <motion.div key="6.6" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[{l:'Total Berita',v:55,c:'text-blue-700'},{l:'Total Galeri',v:39,c:'text-indigo-700'},{l:'Terbit',v:42,c:'text-emerald-700'},{l:'Draft',v:8,c:'text-slate-600'},{l:'Arsip',v:5,c:'text-amber-700'},{l:'Perlu Update',v:3,c:'text-rose-700'}].map(s=>(
                <div key={s.l} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                  <span className={`text-2xl font-black ${s.c}`}>{s.v}</span>
                  <span className="block text-[10px] text-slate-400 font-bold mt-1">{s.l}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-extrabold text-slate-900 mb-5">Produktivitas Konten per Desa</h3>
              <div className="space-y-4">
                {statData.map(s => {
                  const max = Math.max(...statData.map(x=>x.total));
                  return (
                    <div key={s.desa} className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-700 w-20 shrink-0">Desa {s.desa}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-end pr-2 transition-all" style={{width:`${(s.total/max)*100}%`}}>
                          <span className="text-[9px] text-white font-black">{s.total}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">{s.berita}B</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">{s.galeri}G</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
