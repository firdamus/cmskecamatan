/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  MapPin,
  Calendar,
  Layers,
  ShoppingBag,
  TrendingUp,
  MessageCircle,
  Eye,
  Settings,
  Grid,
  ListFilter,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { COMMODITIES_DATA, PRODUCTS_DATA, VILLAGES_DATA } from '../data/dummy';
import { Commodity, Product } from '../types';
import { useSyncedState } from '../lib/useSyncedState';
import { publishLapakProduk } from '../lib/portalSync';

interface ModuleKomoditasLapakProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
  activeMainModule?: 'komoditas' | 'lapak_desa';
  activeSubTab?: string;
  onSubTabChange?: (main: 'komoditas' | 'lapak_desa', sub: string) => void;
}

export const ModuleKomoditasLapak: React.FC<ModuleKomoditasLapakProps> = ({
  onShowNotification,
  userRole,
  operatorVillage,
  activeMainModule: propActiveMainModule,
  activeSubTab: propActiveSubTab,
  onSubTabChange
}) => {
  const isOperator = userRole === 'Operator';
  const [localActiveMainModule, setLocalActiveMainModule] = useState<'komoditas' | 'lapak_desa'>('komoditas');
  const [localActiveSubTab, setLocalActiveSubTab] = useState<string>('daftar');

  const activeMainModule = propActiveMainModule ?? localActiveMainModule;
  const activeSubTab = propActiveSubTab ?? localActiveSubTab;

  const setActiveMainModule = (val: 'komoditas' | 'lapak_desa') => {
    if (onSubTabChange) {
      onSubTabChange(val, val === 'komoditas' ? 'daftar' : 'rekap');
    } else {
      setLocalActiveMainModule(val);
      setLocalActiveSubTab(val === 'komoditas' ? 'daftar' : 'rekap');
    }
  };

  const setActiveSubTab = (val: string) => {
    if (onSubTabChange) {
      onSubTabChange(activeMainModule, val);
    } else {
      setLocalActiveSubTab(val);
    }
    setReadProductPage(null);
  };

  // Komoditas & produk kini tersinkron lewat Data Server Lokal sehingga
  // Admin & Operator selalu melihat data terbaru yang sama, dan produk
  // Desa Rejosari otomatis tampil di Portal Rejosari (menu Lapak).
  const [commodities, setCommodities] = useSyncedState<Commodity[]>('kec_commodities', COMMODITIES_DATA);
  const [products, setProducts] = useSyncedState<Product[]>('kec_products', PRODUCTS_DATA);

  useEffect(() => {
    publishLapakProduk(products);
  }, [products]);

  // Selected object detail modals
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [readProductPage, setReadProductPage] = useState<Product | null>(null);
  const [readCommodityPage, setReadCommodityPage] = useState<Commodity | null>(null);
  const [cartQty, setCartQty] = useState<number>(1);

  // Modal Tambah Data states
  const [showTambahProdukModal, setShowTambahProdukModal]   = useState(false);
  const [showTambahPelapakModal, setShowTambahPelapakModal] = useState(false);
  const [showTambahKomModal, setShowTambahKomModal]         = useState(false);
  const [showUbahStokModal, setShowUbahStokModal]           = useState<Product | null>(null);
  const [ubahFotoUrl, setUbahFotoUrl] = useState('');
  const [tambahProdukForm, setTambahProdukForm] = useState({ nama:'', harga:'', desa:'Argo Mulyo', kategori:'Makanan Olahan' as Product['category'], pelapak:'', telp:'', stok:'Tersedia' as Product['stockStatus'], deskripsi:'', foto:'' });
  const [tambahPelapakForm, setTambahPelapakForm] = useState({ nama:'', wa:'', desa:'Argo Mulyo', alamat:'', usaha:'' });
  const [tambahKomForm, setTambahKomForm]   = useState({ nama:'', kategori:'Pertanian', desa:'Argo Mulyo', produksi:'', lahan:'', periode:'Tahunan', deskripsi:'' });

  // Filters for Commodities
  const [commSearch, setCommSearch] = useState('');
  const [commCategory, setCommCategory] = useState('Semua');
  const [commVillage, setCommVillage] = useState('Semua');
  const [commFeaturedOnly, setCommFeaturedOnly] = useState(false);

  // Sebaran matrix dropdown filter
  const [sebaranSelectedCommName, setSebaranSelectedCommName] = useState('Padi');

  // Filters for Products
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategory, setProdCategory] = useState('Semua');
  const [prodVillage, setProdVillage] = useState('Semua');
  const [prodStockTab, setProdStockTab] = useState<'Semua' | 'Tersedia' | 'Terbatas' | 'Kosong'>('Semua');

  // Toggle Featured status (Simulated server-side write)
  const toggleFeaturedCommodity = (id: string) => {
    setCommodities((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus: 'Unggulan' | 'Biasa' = c.status === 'Unggulan' ? 'Biasa' : 'Unggulan';
          onShowNotification(`Sistem: Komoditas ${c.name} diatur menjadi ${newStatus}.`);
          // update open modal if any
          if (selectedCommodity && selectedCommodity.id === id) {
            setSelectedCommodity({ ...selectedCommodity, status: newStatus });
          }
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const toggleFeaturedProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = !p.isFeatured;
          onShowNotification(`Sistem: Produk ${p.name} ${newStatus ? 'ditandai Unggulan' : 'dilepas dari Unggulan'}.`);
          if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct({ ...selectedProduct, isFeatured: newStatus });
          }
          return { ...p, isFeatured: newStatus };
        }
        return p;
      })
    );
  };

  const changeProductAvailability = (id: string, newStock: 'Tersedia' | 'Terbatas' | 'Kosong') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          onShowNotification(`Status ketersediaan ${p.name} diubah menjadi ${newStock}.`);
          if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct({ ...selectedProduct, stockStatus: newStock });
          }
          return { ...p, stockStatus: newStock };
        }
        return p;
      })
    );
  };

  // COMMODITY FILTERS CALCULATION
  // Operator hanya melihat komoditas desanya sendiri; Admin melihat semua.
  const baseCommodities = isOperator && operatorVillage
    ? commodities.filter(c => c.villageName === operatorVillage)
    : commodities;

  const filteredCommodities = baseCommodities.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(commSearch.toLowerCase());
    const matchCategory = commCategory === 'Semua' || c.category === commCategory;
    const matchVillage = commVillage === 'Semua' || c.villageName === commVillage;
    const matchFeatured = !commFeaturedOnly || c.status === 'Unggulan';
    return matchSearch && matchCategory && matchVillage && matchFeatured;
  });

  // PRODUCT FILTERS CALCULATION
  // Operator hanya melihat produk desanya sendiri; Admin melihat semua.
  const baseProducts = isOperator && operatorVillage
    ? products.filter(p => p.villageName === operatorVillage)
    : products;

  const filteredProducts = baseProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
                        p.sellerName.toLowerCase().includes(prodSearch.toLowerCase());
    const matchCategory = prodCategory === 'Semua' || p.category === prodCategory;
    const matchVillage = prodVillage === 'Semua' || p.villageName === prodVillage;
    const matchStock = prodStockTab === 'Semua' || p.stockStatus === prodStockTab;
    return matchSearch && matchCategory && matchVillage && matchStock;
  });

  // Product photos from Unsplash — now stateful so newly added products can carry their own photo
  const [productPhotos, setProductPhotos] = useState<Record<string, string>>({
    'p1':  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThVy5MKkzRk_-Tavq5J4g6qRVcvn1Ikza02gRBTalEXTk6acMglJAKNfjW&s=10', // beras
    'p2':  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9G6-AiYqNeIc3clt5_pYoZrdcIQZMpioE6ibksLFfSTmd7Q3qIOu2KNM&s=10', // kopi
    'p3':  'https://img.lazcdn.com/g/ff/kf/S2a308f74333949689cbc1aeda682613fP.jpg_720x720q80.jpg', // keripik
    'p4':  'https://ik.imagekit.io/tvlk/blog/2024/05/i43AX98J-image-3.png', // anyaman bambu
    'p5':  'https://halalmui.org/wp-content/uploads/2022/07/Fermentasi_Media_Padat_dari_Tempe_sampai_Enzim_11zon.jpg', // tempe
    'p6':  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr3Os5Mw97ZW6LA2Qly6cC7Oe423Ftek1WgK04arIdYd_O13ODGOiOcVw&s=10', // madu
    'p7':  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05MBXoggjhXkHwZmTnojOCWfMYRiUcrOHcHXEMOSU6nA_ew4HywpB0_c&s=10', // ikan lele
    'p8':  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS065H2pITPO877_-ii1y81nvRf5rMB0YzOq4yeL8OC54MVIEh_Zgxpj5Q&s=10', // batik
    'p9':  'https://www.mypangandaran.com/gambar/blog/blog-menikmati-manisnya-gula-aren-pangandaran-untuk-sajian-takjil-378-l.jpg', // gula aren
    'p10': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXuMTFPQiRPxvohQ75GV4rMXobdC8yovWsfLPERrtXKL9in63OQ6qgkURw&s=10', // rotan
    'p11': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWtACox55eoXGrgEc2H2_UQO99ODfNH1aJoQpe-GayNMhTER1DRVo4CgQ&s=10', // sambal
    'p12': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSouxG2J3k8T0FLmEL-DWBPsOoOlexo_EpOb2SGwiXeb-oTlJZVP2Bxo3e5&s=10', // kacang
  });

  // Pelapak summary data
  const [pelapakData, setPelapakData] = useState([
    { name: 'Ibu Sari Dewi', wa: '0812-1111-2222', village: 'Argo Mulyo', count: 4, status: 'Aktif' },
    { name: 'Pak Heri Susanto', wa: '0813-2222-3333', village: 'Banjar Rejo', count: 3, status: 'Aktif' },
    { name: 'Ibu Wati Rahayu', wa: '0814-3333-4444', village: 'Girimulyo', count: 2, status: 'Aktif' },
    { name: 'CV Maju Bersama', wa: '0815-4444-5555', village: 'Karya Makmur', count: 5, status: 'Aktif' },
    { name: 'Ibu Ningsih', wa: '0816-5555-6666', village: 'Madu Condo', count: 3, status: 'Aktif' },
    { name: 'Kopdes Margokoyo', wa: '0817-6666-7777', village: 'Margokoyo', count: 4, status: 'Aktif' },
    { name: 'Pak Ahmad Yani', wa: '0818-7777-8888', village: 'Argo Mulyo', count: 3, status: 'Nonaktif' },
    { name: 'Ibu Ratna Sari', wa: '0819-8888-9999', village: 'Banjar Rejo', count: 2, status: 'Aktif' },
  ]);

  // Colors dictionary for category illustration
  const categoryThemes: Record<string, string> = {
    'Pertanian': 'from-emerald-500 to-green-600 border-emerald-200 text-emerald-800 bg-emerald-50',
    'Perkebunan': 'from-amber-600 to-yellow-705 border-amber-200 text-amber-800 bg-amber-50',
    'Peternakan': 'from-orange-500 to-red-600 border-orange-200 text-orange-850 bg-orange-50',
    'Perikanan': 'from-blue-500 to-indigo-600 border-blue-200 text-blue-800 bg-blue-50',
    'UMKM': 'from-purple-500 to-violet-605 border-purple-200 text-purple-800 bg-purple-50',
    'Kerajinan': 'from-teal-550 to-cyan-600 border-teal-200 text-teal-800 bg-teal-50',
    'Makanan Olahan': 'from-pink-500 to-rose-600 border-pink-200 text-pink-805 bg-pink-50',
    'Minuman': 'from-sky-500 to-blue-600 border-sky-200 text-sky-800 bg-sky-50',
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'Tersedia':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-150">Tersedia</span>;
      case 'Terbatas':
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-150">Terbatas</span>;
      default:
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-150">Kosong/Nonaktif</span>;
    }
  };

  return (
    <div className="space-y-6">

      {/* --- SUB TAB PANELS: MODULE 4 KOMODITAS --- */}

      {/* 4.1 DAFTAR KOMODITAS */}
      {activeMainModule === 'komoditas' && activeSubTab === 'daftar' && (
        readCommodityPage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <button
                onClick={() => setReadCommodityPage(null)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-705 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                ← Kembali ke Sensus Komoditas
              </button>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${categoryThemes[readCommodityPage.category] || 'bg-slate-100 text-slate-700'}`}>
                  Kategori {readCommodityPage.category}
                </span>
                {readCommodityPage.status === 'Unggulan' && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] border border-amber-200 font-extrabold uppercase rounded-full inline-flex items-center gap-1">
                    ★ Unggulan Kecamatan
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 max-w-4xl">
              <span className="font-mono text-xs text-slate-400 block">Sensus Rutin Semester Ganjil • Desa {readCommodityPage.villageName}</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-905 leading-tight">
                Laporan Profiling & Tingkat Hambatan Komoditas {readCommodityPage.name}
              </h2>
            </div>

            {/* Coverage Header Image */}
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-xs border border-slate-100 relative bg-slate-100">
              <img
                src={
                  {
                    'Padi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3j_SovNoCg6VVLTDj0Z-qFnMe-P9pEaA4AbZyqkjgFr3e65zz8GNwtyg&s=10',
                    'Karet': 'https://doktor.pertanian.uma.ac.id/wp-content/uploads/2023/06/Fakta-Perkebunan-Karet-300x200.jpeg',
                    'Lele': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05MBXoggjhXkHwZmTnojOCWfMYRiUcrOHcHXEMOSU6nA_ew4HywpB0_c&s=10',
                    'Ayam Broiler': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVSAjYHFz04XULSInQ_s9PGvKh0IutZH1VA1KvFaEMnQ&s=10',
                    'Keripik Pisang': 'https://img.lazcdn.com/g/ff/kf/S2a308f74333949689cbc1aeda682613fP.jpg_720x720q80.jpg',
                    'Kopi Robusta': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9G6-AiYqNeIc3clt5_pYoZrdcIQZMpioE6ibksLFfSTmd7Q3qIOu2KNM&s=10',
                    'Sapi Potong': 'https://sawitplus.co/assets/berita/original/94882793026-mengenal-sistem-penggemukan-sapi-secara-intensif.jpg',
                    'Anyaman Bambu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSQuTboQY7zO7JMR3meIqndsMaoZmog0Lreiqz8SIckXNCYIfNAULum50J&s=10',
                    'Jagung': 'https://asset.kompas.com/crops/eK31KhEEUduaF6f7n_HFYnSdbHU=/0x1058:1920x2338/1200x800/data/photo/2022/08/18/62fdcdc921923.jpg',
                    'Batik Tulis': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5tm-GQRyelZqM8X2QuIN4AxspRG9N81-hauhYUQtnSA&s=10'
                  }[readCommodityPage.name] || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80'
                }
                alt={readCommodityPage.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Metrics Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estimasi Produksi</span>
                <span className="text-sm md:text-base font-black text-slate-900 font-mono">{readCommodityPage.estProduction}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Luas Lahan Aktif</span>
                <span className="text-sm md:text-base font-black text-slate-900 font-mono">{readCommodityPage.areaUnit}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Periode Panen</span>
                <span className="text-sm md:text-base font-black text-blue-900 leading-tight block">{readCommodityPage.period}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Desa Utama Pembina</span>
                <span className="text-sm md:text-base font-black text-slate-900 leading-tight block">Desa {readCommodityPage.villageName}</span>
              </div>
            </div>

            {/* Detailed write-up content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-8 space-y-6">
                <div className="prose max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
                  <h3 className="text-lg font-black text-slate-900">Ulasan & Potensi Sektoral</h3>
                  <p>
                    Komoditas <strong>{readCommodityPage.name}</strong> di wilayah Belitang Jaya memegang peranan krusial bagi ketahanan pangan serta pertumbuhan ekonomi riil mikro masyarakat lokal. Melalui kontribusi para petani desa binaan yang andal, hasil pengelolaan komoditas ini telah teruji menyokong pasokan pasar kecamatan hingga distribusi kargo luar kota.
                  </p>
                  <p>
                    {readCommodityPage.description} Sensus tanah menunjukkan kondisi kelembapan dan keasaman (pH) tanah di wilayah ini berada pada angka rentang ideal 6.2 s.d 6.8 yang menunjang stabilitas respirasi sel tanaman dari akar utama.
                  </p>
                  <p>
                    Pemerintah Kecamatan berkomitmen menyalurkan peralatan mekanisasi, jaminan kuota pupuk hayati cair bersubsidi, dan pelatihan pengendalian hayati terpadu (PHT) guna melipatgandakan indeks mutu secara masif dan berkelanjutan bagi pelaku klaster usaha agro-kompleks ini.
                  </p>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-105 text-xs text-blue-900 space-y-1">
                  <span className="font-extrabold block">Desa Pendukung Lain di Kecamatan Belitang Jaya:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {readCommodityPage.otherVillages.map((v, vIdx) => (
                      <span key={vIdx} className="bg-white border border-blue-200/60 px-2 rounded-md py-0.5 font-bold">Desa {v}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Action & Simulation Parameter */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-black text-slate-900 text-sm">Validasi Operator Kecamatan</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Setiap data sensus komoditas dipelihara resmi oleh perwakilan operator komputer desa terdaftar untuk menjaga ketelitian perencanaan pembangunan.
                  </p>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <button
                      onClick={() => {
                        toggleFeaturedCommodity(readCommodityPage.id);
                        setReadCommodityPage(prev => prev ? { ...prev, status: prev.status === 'Unggulan' ? 'Biasa' : 'Unggulan' } : null);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition text-center shadow-xs cursor-pointer ${
                        readCommodityPage.status === 'Unggulan' 
                          ? 'bg-amber-100 hover:bg-amber-150 border border-amber-300 text-amber-900' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {readCommodityPage.status === 'Unggulan' ? '★ Lepas Banner Unggulan' : '★ Jadikan Unggulan Utama'}
                    </button>
                    <button
                      onClick={() => setReadCommodityPage(null)}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-205 text-slate-705 text-xs font-black rounded-xl text-center cursor-pointer transition"
                    >
                      Kembali ke Daftar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={commSearch}
                  onChange={(e) => setCommSearch(e.target.value)}
                  placeholder="Cari komoditas (misal: Kopi, Padi)..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={commCategory}
                  onChange={(e) => setCommCategory(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white text-slate-705 font-bold"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Perkebunan">Perkebunan</option>
                  <option value="Peternakan">Peternakan</option>
                  <option value="Perikanan">Perikanan</option>
                  <option value="UMKM">UMKM</option>
                  <option value="Kerajinan">Kerajinan</option>
                </select>

                <select
                  value={commVillage}
                  onChange={(e) => setCommVillage(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white text-slate-705 font-bold"
                >
                  <option value="Semua">Semua Desa</option>
                  {VILLAGES_DATA.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer px-2.5 border border-slate-200 bg-slate-50/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={commFeaturedOnly}
                    onChange={(e) => setCommFeaturedOnly(e.target.checked)}
                    className="rounded text-blue-700 bg-white"
                  />
                  Hanya Unggulan
                </label>

                <button
                  onClick={() => onShowNotification('Sistem: Data sensus komoditas sukses diekspor berkala (XLSX).')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-lg cursor-pointer"
                >
                  Ekspor Sensus
                </button>
                <button
                  onClick={() => setShowTambahKomModal(true)}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-lg cursor-pointer flex items-center gap-1"
                >
                  + Tambah Komoditas
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 font-medium">
                  <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-4">No</th>
                      <th className="p-4">Nama Komoditas</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Desa Asal</th>
                      <th className="p-4">Est. Produksi</th>
                      <th className="p-4">Luas / Unit</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCommodities.length > 0 ? (
                      filteredCommodities.map((c, index) => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-mono text-xs">{index + 1}</td>
                          <td className="p-4 font-bold text-slate-900">{c.name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${categoryThemes[c.category] || 'bg-slate-50 text-slate-705'}`}>
                              {c.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-755">{c.villageName}</td>
                          <td className="p-4 font-mono text-xs text-slate-700">{c.estProduction}</td>
                          <td className="p-4 text-xs font-mono text-slate-600">{c.areaUnit}</td>
                          <td className="p-4 text-center">
                            {c.status === 'Unggulan' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] border border-amber-200 font-black">
                                <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" /> Unggulan
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[10px] border border-slate-200 font-bold">Biasa</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => setReadCommodityPage(c)}
                                className="p-1 px-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-md cursor-pointer"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => toggleFeaturedCommodity(c.id)}
                                className={`p-1 px-1.5 text-xs font-bold rounded-md border cursor-pointer ${
                                  c.status === 'Unggulan' ? 'border-amber-200 text-amber-700 bg-amber-50/50' : 'border-slate-200 text-slate-505 bg-slate-100'
                                }`}
                                title="Tandai Unggulan Kecamatan"
                              >
                                ★
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-slate-400 text-xs font-semibold">
                          Tidak ada kecocokan data komoditas untuk kriteria filter ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

      {/* 4.2 KATEGORI & UNGGULAN */}
      {activeMainModule === 'komoditas' && activeSubTab === 'kategori' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Pertanian', 'Perkebunan', 'Peternakan', 'Perikanan', 'UMKM', 'Kerajinan'].map((category) => (
              <div
                key={category}
                onClick={() => {
                  setCommCategory(category);
                  setActiveSubTab('daftar');
                }}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-700 hover:shadow transition"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-705 flex items-center justify-center mb-2">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs">{category}</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">Klik Filter</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900">Ulasan Khusus Komoditas Unggulan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {commodities.filter((c) => c.status === 'Unggulan').map((comm) => (
                <div key={comm.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm relative">
                  <div className="absolute top-4 right-4 text-amber-500 bg-amber-50 p-1.5 rounded-full border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{comm.category}</span>
                  <h4 className="font-black text-slate-900 mt-1">Komoditas {comm.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Asal Desa: <span className="font-bold text-slate-850">Desa {comm.villageName}</span></p>
                  
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1 text-slate-655">
                    <div>Sensus Produksi: <span className="font-bold font-mono">{comm.estProduction}</span></div>
                    <div>Tata Lahan: <span className="font-bold font-mono">{comm.areaUnit}</span></div>
                    <div>Siklus Panen: <span>{comm.period}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4.5 SEBARAN KOMODITAS MATRIKS */}
      {activeMainModule === 'komoditas' && activeSubTab === 'sebaran' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-6">
          <div>
            <h3 className="font-black text-slate-900">Peta Sebaran Lintas Komoditas</h3>
            <p className="text-xs text-slate-500 mt-1">Pilih jenis produk komoditas untuk memetakan nama desa mana saja yang memilikinya.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-600 uppercase mb-1">Cari sebaran desa untuk komoditas:</label>
              <select
                value={sebaranSelectedCommName}
                onChange={(e) => setSebaranSelectedCommName(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg text-slate-700 font-bold max-w-xs w-full"
              >
                <option value="Padi">Padi</option>
                <option value="Karet">Karet</option>
                <option value="Lele">Lele</option>
                <option value="Ayam Broiler">Ayam Broiler</option>
                <option value="Keripik Pisang">Keripik Pisang</option>
                <option value="Kopi Robusta">Kopi Robusta</option>
                <option value="Sapi Potong">Sapi Potong</option>
                <option value="Anyaman Bambu">Anyaman Bambu</option>
                <option value="Jagung">Jagung</option>
                <option value="Batik Tulis">Batik Tulis</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-500">Desa yang Memiliki Komoditas Ini:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {VILLAGES_DATA.filter((v) => {
                  const checkOwns = commodities.some((c) => c.name === sebaranSelectedCommName && (c.villageName === v.name || c.otherVillages.includes(v.name)));
                  return checkOwns;
                }).map((village) => (
                  <span key={village.id} className="px-3 py-1.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-lg border border-blue-200">
                    Desa {village.name} (Kades: {village.headName})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB TAB PANELS: MODULE 7 LAPAK DESA --- */}

      {/* 7.1 REKAP & PELAPAK */}
      {activeMainModule === 'lapak_desa' && activeSubTab === 'rekap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Masyarakat Pelapak</span>
              <span className="block text-3xl font-black text-slate-900">8 Pelapak Utama</span>
              <p className="text-[11px] text-slate-400 mt-1">Mengelola 67 produk unggulan desa.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Status Ketersediaan</span>
              <div className="flex justify-between items-center text-xs mt-1 font-bold">
                <span className="text-emerald-700 bg-emerald-50 px-2 rounded-md">80% Tersedia</span>
                <span className="text-amber-700 bg-amber-50 px-2 rounded-md">15% Terbatas</span>
                <span className="text-rose-700 bg-rose-50 px-2 rounded-md">5% Kosong</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-205 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Unggulan Rekomendasi</span>
              <span className="block text-1.5xl font-extrabold text-amber-500">Bintang Emas Kecamatan</span>
              <p className="text-[11px] text-slate-400 mt-1">Promosi produk digital ke tingkat kabupaten.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-905">Data Pelapak Sensus Desa</h3>
                <p className="text-xs text-slate-400 mt-0.5">Daftar wirausaha UMKM yang terdaftar di database SCOPE Belitang Jaya.</p>
              </div>
              <button onClick={() => setShowTambahPelapakModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer">
                + Tambah Pelapak
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 font-medium">
                <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">No</th>
                    <th className="p-4">Nama Pelapak</th>
                    <th className="p-4">No. WhatsApp</th>
                    <th className="p-4">Desa Binaan</th>
                    <th className="p-4">Jumlah Sajian Produk</th>
                    <th className="p-4">Status Usaha</th>
                    <th className="p-4 text-center">Aksi WA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pelapakData.map((p, pIdx) => (
                    <tr key={pIdx} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-xs">{pIdx + 1}</td>
                      <td className="p-4 font-bold text-slate-900">{p.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-600">{p.wa}</td>
                      <td className="p-4 font-bold text-slate-700">Desa {p.village}</td>
                      <td className="p-4 text-center text-slate-600">{p.count} Produk</td>
                      <td className="p-4">
                        {p.status === 'Aktif' ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded border border-emerald-250 font-bold">AKTIF</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded border border-slate-200 font-bold">SUSPEND</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onShowNotification(`Menghubungkan langsung obrolan WhatsApp ke nomor pelapak ${p.name} (${p.wa}).`)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded shadow flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Hubungi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7.4 KATALOG LAPAK PASAR — DETAIL PAGE */}
      {activeMainModule === 'lapak_desa' && activeSubTab === 'katalog' && readProductPage && (
        <motion.div
          key="product-detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-0"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Hero foto */}
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <img
                src={productPhotos[readProductPage.id] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'}
                alt={readProductPage.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setReadProductPage(null)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-extrabold px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/30 transition"
              >
                ← Kembali ke Katalog
              </button>
              {readProductPage.isFeatured && (
                <span className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full">
                  ★ Unggulan Kecamatan
                </span>
              )}
              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${categoryThemes[readProductPage.category] || 'bg-slate-100 text-slate-700'}`}>
                    {readProductPage.category}
                  </span>
                  {getStockBadge(readProductPage.stockStatus)}
                </div>
                <h2 className="text-white font-black text-2xl leading-tight">{readProductPage.name}</h2>
                <p className="text-slate-300 text-sm mt-1 font-semibold">{readProductPage.price}</p>
              </div>
            </div>

            {/* Info body */}
            <div className="p-6 md:p-8 space-y-6">

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Nama Produk',   value: readProductPage.name },
                  { label: 'Harga Satuan',  value: readProductPage.price },
                  { label: 'Stok',          value: readProductPage.stockStatus },
                  { label: 'Tanggal Rilis', value: readProductPage.releaseDate || '12 Januari 2025' },
                  { label: 'Desa Asal',     value: `Desa ${readProductPage.villageName}` },
                  { label: 'Nama Pelapak',  value: readProductPage.sellerName },
                  { label: 'No. WhatsApp',  value: readProductPage.whatsapp },
                  { label: 'Kategori',      value: readProductPage.category },
                ].map(row => (
                  <div key={row.label} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{row.label}</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block leading-snug">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Deskripsi */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Deskripsi Produk</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{readProductPage.description}</p>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Produk ini merupakan hasil kerajinan dan usaha mandiri pelaku ekonomi lokal desa yang telah melalui proses seleksi kualitas oleh pendamping desa. Pembelian langsung mendukung peningkatan ekonomi masyarakat desa setempat.
                </p>
              </div>

              {/* Ubah stok */}
              <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                <h4 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-3">Ubah Status Ketersediaan Stok</h4>
                <div className="flex gap-2">
                  {(['Tersedia', 'Terbatas', 'Kosong'] as const).map((stk) => (
                    <button
                      key={stk}
                      onClick={() => {
                        changeProductAvailability(readProductPage.id, stk);
                        setReadProductPage({ ...readProductPage, stockStatus: stk });
                      }}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-xl border cursor-pointer transition ${
                        readProductPage.stockStatus === stk
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aksi */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onShowNotification(`Menghubungi pelapak ${readProductPage.sellerName} via WhatsApp (${readProductPage.whatsapp})`)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4" /> Hubungi Pelapak
                </button>
                <button
                  onClick={() => {
                    toggleFeaturedProduct(readProductPage.id);
                    setReadProductPage({ ...readProductPage, isFeatured: !readProductPage.isFeatured });
                  }}
                  className={`flex items-center gap-2 font-extrabold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition border ${
                    readProductPage.isFeatured
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {readProductPage.isFeatured ? '★ Lepas Unggulan' : '☆ Jadikan Unggulan'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 7.4 KATALOG LAPAK PASAR — GRID LIST */}
      {activeMainModule === 'lapak_desa' && activeSubTab === 'katalog' && !readProductPage && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                placeholder="Cari produk lapak (Beras, Madu, Anyaman)..."
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white text-slate-705 font-bold"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Hasil Pertanian">Hasil Pertanian</option>
                <option value="Hasil Perikanan">Hasil Perikanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Makanan Olahan">Makanan Olahan</option>
                <option value="Kerajinan Tangan">Kerajinan Tangan</option>
              </select>

              <select
                value={prodVillage}
                onChange={(e) => setProdVillage(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-205 rounded-lg bg-white text-slate-705 font-bold"
              >
                <option value="Semua">Semua Desa</option>
                {VILLAGES_DATA.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>

              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['Semua', 'Tersedia', 'Terbatas', 'Kosong'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setProdStockTab(tab)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer ${
                      prodStockTab === tab ? 'bg-white shadow text-blue-900' : 'text-slate-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowTambahProdukModal(true)} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg cursor-pointer">
                + Tambah Produk
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={productPhotos[p.id] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${categoryThemes[p.category] || 'bg-white/90 text-slate-700'}`}>
                        {p.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {p.isFeatured && (
                        <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded text-[9px] font-extrabold">★</span>
                      )}
                      {getStockBadge(p.stockStatus)}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-white font-extrabold text-sm leading-tight drop-shadow">{p.name}</p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 space-y-2">
                    <p className="text-xl font-black text-blue-900">{p.price}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-600">
                        <span>📍</span> Desa {p.villageName}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                        <span>👤</span> {p.sellerName}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                        <span>📅</span> {p.releaseDate || '12 Jan 2025'}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={() => setReadProductPage(p)}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat Detail
                    </button>
                    <button
                      onClick={() => setShowUbahStokModal(p)}
                      className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold rounded-xl cursor-pointer hover:bg-emerald-100 transition"
                      title="Ubah Status Stok"
                    >
                      Stok
                    </button>
                    <button
                      onClick={() => toggleFeaturedProduct(p.id)}
                      className={`px-3 py-2 text-sm font-bold rounded-xl border cursor-pointer transition ${
                        p.isFeatured ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                      }`}
                      title="Tandai Unggulan"
                    >
                      {p.isFeatured ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-400 text-xs font-bold">
                Tidak ada kecocokan produk katalog lapak untuk pencarian & filter ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7.6 PRODUK PILIHAN UNGGULAN — DETAIL PAGE */}
      {activeMainModule === 'lapak_desa' && activeSubTab === 'unggulan' && readProductPage && (
        <motion.div
          key="unggulan-detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-0"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative h-72 overflow-hidden bg-slate-100">
              <img
                src={productPhotos[readProductPage.id] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'}
                alt={readProductPage.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setReadProductPage(null)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-extrabold px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/30 transition"
              >
                ← Kembali ke Produk Unggulan
              </button>
              <span className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full">★ PREMIUM UNGGULAN</span>
              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${categoryThemes[readProductPage.category] || 'bg-slate-100 text-slate-700'}`}>{readProductPage.category}</span>
                  {getStockBadge(readProductPage.stockStatus)}
                </div>
                <h2 className="text-white font-black text-2xl leading-tight">{readProductPage.name}</h2>
                <p className="text-slate-300 text-sm mt-1 font-semibold">{readProductPage.price}</p>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Nama Produk',   value: readProductPage.name },
                  { label: 'Harga Satuan',  value: readProductPage.price },
                  { label: 'Stok',          value: readProductPage.stockStatus },
                  { label: 'Tanggal Rilis', value: readProductPage.releaseDate || '12 Jan 2025' },
                  { label: 'Desa Asal',     value: `Desa ${readProductPage.villageName}` },
                  { label: 'Nama Pelapak',  value: readProductPage.sellerName },
                  { label: 'No. WhatsApp',  value: readProductPage.whatsapp },
                  { label: 'Kategori',      value: readProductPage.category },
                ].map(row => (
                  <div key={row.label} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{row.label}</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block leading-snug">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
                <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-widest mb-2">Deskripsi Produk Unggulan</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{readProductPage.description}</p>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">Produk ini telah dipilih sebagai unggulan kecamatan karena kualitas, keunikan, dan potensi pasar yang tinggi. Dipromosikan aktif di tingkat kecamatan untuk mendukung ekonomi lokal desa.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onShowNotification(`Menghubungi ${readProductPage.sellerName} via WhatsApp (${readProductPage.whatsapp})`)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4" /> Hubungi Pelapak
                </button>
                <button
                  onClick={() => {
                    toggleFeaturedProduct(readProductPage.id);
                    setReadProductPage({ ...readProductPage, isFeatured: !readProductPage.isFeatured });
                  }}
                  className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-300 font-extrabold text-sm px-5 py-2.5 rounded-xl cursor-pointer hover:bg-amber-100 transition"
                >
                  {readProductPage.isFeatured ? '★ Lepas dari Unggulan' : '☆ Jadikan Unggulan'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 7.6 PRODUK PILIHAN UNGGULAN — GRID */}
      {activeMainModule === 'lapak_desa' && activeSubTab === 'unggulan' && !readProductPage && (
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
            <h3 className="font-black text-slate-900 text-lg">Produk Unggulan Kecamatan Belitang Jaya</h3>
            <p className="text-xs text-slate-505">Katalog selektif produk premium daerah yang dipasarkan intensif ke tingkat nasional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.filter((p) => p.isFeatured).map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border-2 border-amber-200 shadow-md overflow-hidden flex flex-col group hover:shadow-xl transition">
                {/* Foto */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={productPhotos[p.id] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full">★ PREMIUM</span>
                  <div className="absolute bottom-2 left-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${categoryThemes[p.category] || 'bg-white/90 text-slate-700'}`}>{p.category}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 space-y-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-base leading-tight">{p.name}</h4>
                    <p className="text-xl font-black text-blue-900 mt-1">{p.price}</p>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-600"><span>📍</span> Desa {p.villageName}</div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-semibold"><span>👤</span> {p.sellerName}</div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold"><span>📅</span> {p.releaseDate || '12 Jan 2025'}</div>
                    <div className="mt-1">{getStockBadge(p.stockStatus)}</div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 italic">"{p.description}"</p>
                </div>

                <div className="px-5 pb-5 flex gap-2">
                  <button
                    onClick={() => { setReadProductPage(p); }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat Detail
                  </button>
                  <button
                    onClick={() => onShowNotification(`Menghubungi ${p.sellerName} via WhatsApp (${p.whatsapp})`)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Hubungi WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- DYNAMIC OVERLAY DETAIL MODALS --- */}

      {/* COMMODITY DETAIL MODAL */}
      {selectedCommodity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-250 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-105 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{selectedCommodity.category}</span>
                <h3 className="font-black text-slate-900 text-lg">Komoditas {selectedCommodity.name}</h3>
              </div>
              <button onClick={() => setSelectedCommodity(null)} className="text-slate-400 hover:text-slate-600 font-extrabold text-sm cursor-pointer">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-550">Asal Desa:</span><span className="font-bold text-blue-900">Desa {selectedCommodity.villageName}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-550">Sensus Produksi:</span><span className="font-bold font-mono text-slate-800">{selectedCommodity.estProduction}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-550">Luas Lahan:</span><span className="font-bold font-mono text-slate-800">{selectedCommodity.areaUnit}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-550">Siklus Panen:</span><span className="font-bold text-slate-850">{selectedCommodity.period}</span></div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1 mb-1">Deskripsi Sensus:</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">{selectedCommodity.description}</p>
            </div>
            <div className="p-2.5 bg-blue-50/50 rounded-lg text-[10px] text-blue-950">
              <span className="font-bold">Desa Pendukung:</span>
              <div className="flex gap-1 mt-1 flex-wrap">{selectedCommodity.otherVillages.map((o, oIdx) => (<span key={oIdx} className="bg-white px-2 py-0.5 rounded border border-blue-100">{o}</span>))}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => toggleFeaturedCommodity(selectedCommodity.id)} className={`flex-1 font-bold py-2 rounded-lg text-xs cursor-pointer ${selectedCommodity.status === 'Unggulan' ? 'bg-amber-100 border border-amber-300 text-amber-800' : 'bg-slate-100 border border-slate-200'}`}>
                {selectedCommodity.status === 'Unggulan' ? '★ Terpilih Unggulan' : 'Set Unggulan'}
              </button>
              <button onClick={() => setSelectedCommodity(null)} className="px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs cursor-pointer">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL TAMBAH PRODUK ══ */}
      {showTambahProdukModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-blue-900 to-indigo-900">
              <div><h3 className="font-black text-white text-base">+ Tambah Produk Lapak</h3><p className="text-[11px] text-slate-300 mt-0.5">Isi data produk baru</p></div>
              <button onClick={()=>setShowTambahProdukModal(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer">✕</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              <div className="col-span-2">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">URL Foto Produk</label>
                <input
                  value={tambahProdukForm.foto}
                  onChange={e=>setTambahProdukForm(p=>({...p,foto:e.target.value}))}
                  placeholder="https://... (opsional, tempel link foto produk)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {tambahProdukForm.foto && (
                  <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={tambahProdukForm.foto}
                      alt="Pratinjau foto produk"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
              {[
                {label:'Nama Produk *',  key:'nama',    placeholder:'Contoh: Beras Premium',   col:'col-span-2'},
                {label:'Harga Satuan *', key:'harga',   placeholder:'Contoh: Rp 12.000/kg',    col:'col-span-1'},
                {label:'Nama Pelapak *', key:'pelapak', placeholder:'Nama wirausaha',           col:'col-span-1'},
                {label:'No. WA Pelapak',key:'telp',    placeholder:'0812-xxxx-xxxx',           col:'col-span-1'},
                {label:'Deskripsi',      key:'deskripsi',placeholder:'Deskripsi singkat produk',col:'col-span-2'},
              ].map(f=>(
                <div key={f.key} className={f.col}>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                  <input value={(tambahProdukForm as any)[f.key]} onChange={e=>setTambahProdukForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Desa</label>
                <select value={tambahProdukForm.desa} onChange={e=>setTambahProdukForm(p=>({...p,desa:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none">
                  {VILLAGES_DATA.map(v=><option key={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Kategori</label>
                <select value={tambahProdukForm.kategori} onChange={e=>setTambahProdukForm(p=>({...p,kategori:e.target.value as Product['category']}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none">
                  {['Makanan Olahan','Minuman','Hasil Pertanian','Kerajinan Tangan','Hasil Perikanan','Hasil Peternakan','Jasa','Lainnya'].map(k=><option key={k}>{k}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Status Stok</label>
                <div className="flex gap-2">
                  {(['Tersedia','Terbatas','Kosong'] as const).map(s=>(
                    <button key={s} onClick={()=>setTambahProdukForm(p=>({...p,stok:s}))} className={`flex-1 py-2 text-xs font-extrabold rounded-xl border-2 cursor-pointer transition ${tambahProdukForm.stok===s?'bg-slate-900 text-white border-slate-900':'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={()=>setShowTambahProdukModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer">Batal</button>
              <button onClick={()=>{
                if(!tambahProdukForm.nama||!tambahProdukForm.harga||!tambahProdukForm.pelapak){onShowNotification('Nama, harga, dan pelapak wajib diisi.');return;}
                const newId = `p${Date.now()}`;
                const newProd: Product = { id:newId, name:tambahProdukForm.nama, price:tambahProdukForm.harga, sellerName:tambahProdukForm.pelapak, whatsapp:tambahProdukForm.telp||'-', villageName:tambahProdukForm.desa, stockStatus:tambahProdukForm.stok, isFeatured:false, description:tambahProdukForm.deskripsi||'-', category:tambahProdukForm.kategori, releaseDate:new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) };
                setProducts(prev=>[newProd,...prev]);
                if (tambahProdukForm.foto.trim()) {
                  setProductPhotos(prev => ({ ...prev, [newId]: tambahProdukForm.foto.trim() }));
                }
                onShowNotification(`Produk "${tambahProdukForm.nama}" berhasil ditambahkan ke katalog lapak.`);
                setTambahProdukForm({nama:'',harga:'',desa:'Argo Mulyo',kategori:'Makanan Olahan',pelapak:'',telp:'',stok:'Tersedia',deskripsi:'',foto:''});
                setShowTambahProdukModal(false);
              }} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl cursor-pointer">Simpan Produk</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ MODAL TAMBAH PELAPAK ══ */}
      {showTambahPelapakModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-emerald-800 to-teal-800">
              <div><h3 className="font-black text-white text-base">+ Tambah Data Pelapak</h3><p className="text-[11px] text-emerald-200 mt-0.5">Daftarkan wirausaha UMKM baru</p></div>
              <button onClick={()=>setShowTambahPelapakModal(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {[
                {label:'Nama Pelapak *',  key:'nama',   placeholder:'Nama lengkap wirausaha'},
                {label:'No. WhatsApp *',  key:'wa',     placeholder:'0812-xxxx-xxxx'},
                {label:'Alamat Usaha',    key:'alamat', placeholder:'Alamat lengkap'},
                {label:'Nama/Jenis Usaha',key:'usaha',  placeholder:'Contoh: UMKM Kerajinan Anyaman'},
              ].map(f=>(
                <div key={f.key}>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                  <input value={(tambahPelapakForm as any)[f.key]} onChange={e=>setTambahPelapakForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Desa Asal</label>
                <select value={tambahPelapakForm.desa} onChange={e=>setTambahPelapakForm(p=>({...p,desa:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none">
                  {VILLAGES_DATA.map(v=><option key={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={()=>setShowTambahPelapakModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer">Batal</button>
              <button onClick={()=>{
                if(!tambahPelapakForm.nama||!tambahPelapakForm.wa){onShowNotification('Nama dan nomor WA wajib diisi.');return;}
                setPelapakData(prev => [
                  { name: tambahPelapakForm.nama, wa: tambahPelapakForm.wa, village: tambahPelapakForm.desa, count: 0, status: 'Aktif' },
                  ...prev
                ]);
                onShowNotification(`Pelapak "${tambahPelapakForm.nama}" dari Desa ${tambahPelapakForm.desa} berhasil didaftarkan.`);
                setTambahPelapakForm({nama:'',wa:'',desa:'Argo Mulyo',alamat:'',usaha:''});
                setShowTambahPelapakModal(false);
              }} className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl cursor-pointer">Daftarkan Pelapak</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ MODAL UBAH STOK PRODUK ══ */}
      {showUbahStokModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-amber-700 to-orange-700">
              <div><h3 className="font-black text-white text-base">Ubah Status & Foto Produk</h3><p className="text-[11px] text-amber-200 line-clamp-1 mt-0.5">{showUbahStokModal.name}</p></div>
              <button onClick={()=>{setShowUbahStokModal(null);setUbahFotoUrl('');}} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {/* Foto preview & update */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Foto Produk Saat Ini</span>
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={ubahFotoUrl || productPhotos[showUbahStokModal.id] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'}
                    alt={showUbahStokModal.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'; }}
                  />
                </div>
                <input
                  value={ubahFotoUrl}
                  onChange={e=>setUbahFotoUrl(e.target.value)}
                  placeholder="Tempel URL foto baru untuk mengganti..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {ubahFotoUrl.trim() && (
                  <button
                    onClick={() => {
                      setProductPhotos(prev => ({ ...prev, [showUbahStokModal.id]: ubahFotoUrl.trim() }));
                      onShowNotification(`Foto produk "${showUbahStokModal.name}" berhasil diperbarui.`);
                      setUbahFotoUrl('');
                    }}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl cursor-pointer transition"
                  >
                    Simpan Foto Baru
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">Pilih status ketersediaan stok saat ini:</p>
              <div className="grid grid-cols-3 gap-2">
                {(['Tersedia','Terbatas','Kosong','Tidak Aktif'] as const).map(s=>(
                  <button key={s} onClick={()=>{
                    if(s !== 'Tidak Aktif') changeProductAvailability(showUbahStokModal.id, s);
                    if(readProductPage?.id===showUbahStokModal.id) setReadProductPage({...readProductPage,stockStatus:s});
                    onShowNotification(`Stok "${showUbahStokModal.name}" diubah → ${s}.`);
                    setShowUbahStokModal(null);
                  }} className={`py-2.5 text-xs font-extrabold rounded-xl border-2 cursor-pointer transition col-span-1 ${showUbahStokModal.stockStatus===s?'bg-slate-900 text-white border-slate-900':'border-slate-200 text-slate-600 hover:bg-slate-50'} ${s==='Tidak Aktif'?'col-span-3':''}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="p-5 border-t">
              <button onClick={()=>setShowUbahStokModal(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer">Batal</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ MODAL TAMBAH KOMODITAS ══ */}
      {showTambahKomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-green-800 to-emerald-800">
              <div><h3 className="font-black text-white text-base">+ Tambah Data Komoditas</h3><p className="text-[11px] text-emerald-200 mt-0.5">Daftarkan potensi komoditas desa baru</p></div>
              <button onClick={()=>setShowTambahKomModal(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer">✕</button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              <div className="col-span-2">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Nama Komoditas *</label>
                <input value={tambahKomForm.nama} onChange={e=>setTambahKomForm(p=>({...p,nama:e.target.value}))} placeholder="Contoh: Padi Sawah, Kopi Robusta" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Kategori</label>
                <select value={tambahKomForm.kategori} onChange={e=>setTambahKomForm(p=>({...p,kategori:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none">
                  {['Pertanian','Perkebunan','Peternakan','Perikanan','UMKM','Kerajinan'].map(k=><option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Desa Asal</label>
                <select value={tambahKomForm.desa} onChange={e=>setTambahKomForm(p=>({...p,desa:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none">
                  {VILLAGES_DATA.map(v=><option key={v.id}>{v.name}</option>)}
                </select>
              </div>
              {[
                {label:'Est. Produksi',key:'produksi',placeholder:'Contoh: 12 Ton/Tahun'},
                {label:'Luas Lahan/Unit',key:'lahan',placeholder:'Contoh: 45 Hektar'},
              ].map(f=>(
                <div key={f.key}>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                  <input value={(tambahKomForm as any)[f.key]} onChange={e=>setTambahKomForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Deskripsi Singkat</label>
                <textarea rows={2} value={tambahKomForm.deskripsi} onChange={e=>setTambahKomForm(p=>({...p,deskripsi:e.target.value}))} placeholder="Keterangan tambahan komoditas..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none resize-none"/>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={()=>setShowTambahKomModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer">Batal</button>
              <button onClick={()=>{
                if(!tambahKomForm.nama){onShowNotification('Nama komoditas wajib diisi.');return;}
                const newCommodity: Commodity = {
                  id: `kom_new_${Date.now()}`,
                  name: tambahKomForm.nama,
                  category: tambahKomForm.kategori as Commodity['category'],
                  villageName: tambahKomForm.desa,
                  estProduction: tambahKomForm.produksi || '-',
                  areaUnit: tambahKomForm.lahan || '-',
                  status: 'Biasa',
                  period: tambahKomForm.periode,
                  description: tambahKomForm.deskripsi || '-',
                  otherVillages: []
                };
                setCommodities(prev => [newCommodity, ...prev]);
                onShowNotification(`Komoditas "${tambahKomForm.nama}" dari Desa ${tambahKomForm.desa} berhasil ditambahkan.`);
                setTambahKomForm({nama:'',kategori:'Pertanian',desa:'Argo Mulyo',produksi:'',lahan:'',periode:'Tahunan',deskripsi:''});
                setShowTambahKomModal(false);
              }} className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm rounded-xl cursor-pointer">Simpan Komoditas</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
