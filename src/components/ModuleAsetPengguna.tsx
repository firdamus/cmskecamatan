/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Lock,
  FileDigit,
  Trash2,
  Paperclip,
  Check,
  Building2,
  ShieldAlert,
  Download,
  Database,
  MapPin,
  RefreshCw,
  Eye,
  Settings,
  Shield,
  UploadCloud,
  UserCheck,
  X,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LAND_ASSETS_DATA,
  BUILDING_ASSETS_DATA,
  INVENTORY_ASSETS_DATA,
  USER_ACCOUNTS,
  USER_LOGS,
  VILLAGES_DATA
} from '../data/dummy';
import { Asset, UserAccount, UserLog } from '../types';
import { ModuleAdminCapabilities } from './ModuleAdminCapabilities';
import { useSyncedState } from '../lib/useSyncedState';

interface ModuleAsetPenggunaProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
  activeMainModule?: 'aset' | 'pengguna';
  activeSubTab?: string;
  onSubTabChange?: (main: 'aset' | 'pengguna', sub: string) => void;
}

export const ModuleAsetPengguna: React.FC<ModuleAsetPenggunaProps> = ({
  onShowNotification,
  userRole,
  operatorVillage,
  activeMainModule: propActiveMainModule,
  activeSubTab: propActiveSubTab,
  onSubTabChange
}) => {
  const [localActiveMainModule, setLocalActiveMainModule] = useState<'aset' | 'pengguna'>('aset');
  const [localActiveSubTab, setLocalActiveSubTab] = useState<string>('tanah');

  const activeMainModule = propActiveMainModule ?? localActiveMainModule;
  const activeSubTab = propActiveSubTab ?? localActiveSubTab;

  const setActiveMainModule = (val: 'aset' | 'pengguna') => {
    if (onSubTabChange) {
      onSubTabChange(val, val === 'aset' ? 'tanah' : 'manajemen_akun');
    } else {
      setLocalActiveMainModule(val);
      setLocalActiveSubTab(val === 'aset' ? 'tanah' : 'manajemen_akun');
    }
  };

  const setActiveSubTab = (val: string) => {
    if (onSubTabChange) {
      onSubTabChange(activeMainModule, val);
    } else {
      setLocalActiveSubTab(val);
    }
  };

  const isOperator = userRole === 'Operator';

  // Data aset bersifat baca saja (belum ada form tambah/ubah aset di
  // aplikasi ini), jadi cukup disinkronkan satu arah dari Data Server
  // Lokal supaya Admin & Operator melihat data yang sama dan konsisten.
  const [landsAll] = useSyncedState<Asset[]>('kec_aset_tanah', LAND_ASSETS_DATA, { readOnly: true });
  const [buildingsAll] = useSyncedState<Asset[]>('kec_aset_bangunan', BUILDING_ASSETS_DATA, { readOnly: true });
  const [inventoriesAll] = useSyncedState<Asset[]>('kec_aset_inventaris', INVENTORY_ASSETS_DATA, { readOnly: true });
  const lands = isOperator ? landsAll.filter(a => a.villageName === operatorVillage) : landsAll;
  const buildings = isOperator ? buildingsAll.filter(a => a.villageName === operatorVillage) : buildingsAll;
  const inventories = isOperator ? inventoriesAll.filter(a => a.villageName === operatorVillage) : inventoriesAll;

  // Akun pengguna & log aktivitas tersinkron penuh (baca-tulis) lewat
  // Data Server Lokal sehingga Admin & Operator melihat data yang sama.
  const [users, setUsers] = useSyncedState<UserAccount[]>('kec_akun_pengguna', USER_ACCOUNTS);
  const [logs, setLogs] = useSyncedState<UserLog[]>('kec_audit_log', USER_LOGS);

  // Asset type coordinates for geo-tagging simulation
  const [selectedAssetMap, setSelectedAssetMap] = useState<Asset | null>(null);

  // Modal "Tinjau Aset" — shows representative photo of the asset that has been turned over to the village
  const [showTinjauAsetModal, setShowTinjauAsetModal] = useState<Asset | null>(null);

  const getAssetPhoto = (asset: Asset): string => {
    const use = asset.currentUseOrType?.toLowerCase() || '';
    if (asset.type === 'Tanah') {
      if (use.includes('pertanian') || use.includes('sawah')) return 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=700&q=75';
      if (use.includes('olahraga') || use.includes('lapangan')) return 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=700&q=75';
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=75';
    }
    if (asset.type === 'Bangunan') {
      if (use.includes('balai')) return 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=700&q=75';
      if (use.includes('posyandu') || use.includes('kesehatan')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=700&q=75';
      if (use.includes('pasar')) return 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&q=75';
      return 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=700&q=75';
    }
    // Inventaris
    if (use.includes('traktor') || use.includes('pertanian')) return 'https://images.unsplash.com/photo-1605338198677-0fa6ec0b0b97?w=700&q=75';
    if (use.includes('laptop') || use.includes('it') || use.includes('komputer')) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=75';
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=75';
  };

  // Auto-generate a narrative description explaining the asset, its function, and where it sits
  const getAssetDescription = (asset: Asset): string => {
    const kepemilikan = asset.ownershipOrYear?.toLowerCase().includes('milik desa') || /^\d{4}$/.test(asset.ownershipOrYear || '')
      ? (asset.type === 'Tanah' ? `berstatus ${asset.ownershipOrYear}` : `dibangun pada tahun ${asset.ownershipOrYear}`)
      : `dengan status kepemilikan "${asset.ownershipOrYear}"`;

    if (asset.type === 'Tanah') {
      return `${asset.name} merupakan aset tanah milik Desa ${asset.villageName} seluas ${asset.dimensionOrQuantity}, ${kepemilikan}, yang saat ini digunakan untuk keperluan ${asset.currentUseOrType.toLowerCase()}. Aset ini berlokasi di ${asset.location} dan dalam kondisi ${asset.condition.toLowerCase()}.`;
    }
    if (asset.type === 'Bangunan') {
      return `${asset.name} adalah bangunan milik Desa ${asset.villageName} dengan luas ${asset.dimensionOrQuantity}, ${kepemilikan}, berfungsi sebagai fasilitas ${asset.currentUseOrType.toLowerCase()}. Bangunan ini terletak di ${asset.location} dan berada dalam kondisi ${asset.condition.toLowerCase()}.`;
    }
    return `${asset.name} merupakan inventaris milik Desa ${asset.villageName} sebanyak ${asset.dimensionOrQuantity}, digunakan untuk keperluan ${asset.currentUseOrType.toLowerCase()}. Barang ini disimpan/ditempatkan di ${asset.location} dengan kondisi fisik ${asset.condition.toLowerCase()}.`;
  };

  // Modal toggle state
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Document Upload dummy states
  const [uploadedDocs, setUploadedDocs] = useState([
    { id: 1, name: 'Sertifikat_Argo Mulyo_Pertanian.pdf', assetName: 'Tanah Kas Desa', tipe: 'Sertifikat', size: '1.2MB', date: '11 Jun 2025' },
    { id: 2, name: 'Akta_Hibah_Masjid_Margokoyo.pdf', assetName: 'Tanah Pasar Desa', tipe: 'Surat Kepemilikan', size: '2.5MB', date: '08 Jun 2025' },
  ]);
  const [selectedUploadAssetForm, setSelectedUploadAssetForm] = useState('Tanah Kas Desa');
  const [uploadTipeDoc, setUploadTipeDoc] = useState('Sertifikat');
  const [docNumberInput, setDocNumberInput] = useState('');

  // Sensus Search Filters
  const [assetSearch, setAssetSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');

  // Form states for Add User
  const [formUserName, setFormUserName] = useState('');
  const [formUserEmail, setFormUserEmail] = useState('');
  const [formUserRole, setFormUserRole] = useState<'Admin' | 'Operator'>('Operator');
  const [formUserVillage, setFormUserVillage] = useState('Argo Mulyo');

  // Form states for Reset Password
  const [resetSelectedUser, setResetSelectedUser] = useState('admin@kecamatan.go.id');
  const [resetNewPass, setResetNewPass] = useState('');

  // Coordinates of assets — filtered for Operator's own village, full set for Admin
  const allAssetCoords = [
    { name: 'Tanah Kas Desa Rejosari', x: '38%', y: '55%', color: 'border-emerald-600 bg-emerald-500', data: LAND_ASSETS_DATA.find(a => a.id === 'ast_l0')! },
    { name: 'Kantor Desa Rejosari', x: '35%', y: '30%', color: 'border-blue-700 bg-blue-600', data: BUILDING_ASSETS_DATA.find(a => a.id === 'ast_b0')! },
    { name: 'Tanah Kas Desa', x: '45%', y: '50%', color: 'border-emerald-600 bg-emerald-500', data: LAND_ASSETS_DATA.find(a => a.id === 'ast_l1')! },
    { name: 'Tanah Lapangan Bola', x: '42%', y: '75%', color: 'border-emerald-600 bg-emerald-500', data: LAND_ASSETS_DATA.find(a => a.id === 'ast_l3')! },
    { name: 'Kantor Desa Argo Mulyo', x: '55%', y: '25%', color: 'border-blue-700 bg-blue-600', data: BUILDING_ASSETS_DATA.find(a => a.id === 'ast_b1')! },
    { name: 'Balai Desa Banjar Rejo', x: '20%', y: '40%', color: 'border-blue-700 bg-blue-600', data: BUILDING_ASSETS_DATA.find(a => a.id === 'ast_b2')! },
    { name: 'Laptop Dinas IT', x: '75%', y: '65%', color: 'border-amber-600 bg-amber-500', data: INVENTORY_ASSETS_DATA.find(a => a.id === 'ast_i1')! },
    { name: 'Pasar Desa Margokoyo', x: '78%', y: '30%', color: 'border-blue-700 bg-blue-600', data: BUILDING_ASSETS_DATA.find(a => a.id === 'ast_b5')! },
  ];
  const assetCoords = isOperator ? allAssetCoords.filter(c => c.data.villageName === operatorVillage) : allAssetCoords;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUserName || !formUserEmail) return;

    const newUser: UserAccount = {
      id: 'usr_' + Date.now(),
      name: formUserName,
      email: formUserEmail,
      role: formUserRole,
      villageName: formUserRole === 'Admin' ? 'Semua Desa' : formUserVillage,
      status: 'Aktif',
      lastActive: '—',
      initials: formUserName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
    };

    setUsers([...users, newUser]);
    setShowAddUserModal(false);
    
    // Log active
    const newLog: UserLog = {
      id: 'log_' + Date.now(),
      time: '15 Jun 2025 14:40',
      user: 'Admin Kecamatan',
      role: 'Admin',
      action: 'Tambah Data',
      module: 'Pengguna',
      detail: `Tambah akun operator baru: ${formUserName}`,
      ipAddress: '192.168.1.1'
    };
    setLogs([newLog, ...logs]);

    setFormUserName('');
    setFormUserEmail('');
    onShowNotification(`Sukses: Akun untuk ${formUserName} berhasil didaftarkan!`);
  };

  const handleResetPasswordAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetNewPass) return;

    onShowNotification(`Berita Sukses: Password untuk email ${resetSelectedUser} berhasil direset!`);
    setResetNewPass('');

    // log log
    const newLog: UserLog = {
      id: 'log_' + Date.now(),
      time: '15 Jun 2025 14:42',
      user: 'Admin Kecamatan',
      role: 'Admin',
      action: 'Edit Data',
      module: 'Pengguna',
      detail: `Reset password akun email: ${resetSelectedUser}`,
      ipAddress: '192.168.1.1'
    };
    setLogs([newLog, ...logs]);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumberInput) {
      onShowNotification('⚠ Masukkan nomor dokumen sertifikat terlebih dahulu.');
      return;
    }

    const newDoc = {
      id: Date.now(),
      name: `${uploadTipeDoc}_Dokumen_No_${docNumberInput.substring(0, 5)}.pdf`,
      assetName: selectedUploadAssetForm,
      tipe: uploadTipeDoc,
      size: '1.4MB',
      date: '15 Jun 2025',
    };

    setUploadedDocs([newDoc, ...uploadedDocs]);
    setDocNumberInput('');
    onShowNotification(`Dokumen ${uploadTipeDoc} sukses diupload ke berkas aset: ${selectedUploadAssetForm}!`);
  };

  const deleteDocItem = (id: number) => {
    if (confirm('Apakah Anda yakin mau menghapus arsip dokumen pdf aset ini?')) {
      setUploadedDocs(uploadedDocs.filter((d) => d.id !== id));
      onShowNotification('Sertifikat dokumen aset dihapus.');
    }
  };

  // Switch status (Simulated server-side write)
  const changeUserStatus = (id: string, newStats: 'Aktif' | 'Nonaktif') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          onShowNotification(`Akses akun untuk ${u.name} diubah menjadi ${newStats}.`);
          return { ...u, status: newStats };
        }
        return u;
      })
    );
  };

  // FILTERS APPLICATIONS
  const filteredLands = lands.filter((l) => l.name.toLowerCase().includes(assetSearch.toLowerCase()) || l.location.toLowerCase().includes(assetSearch.toLowerCase()));
  const filteredBuildings = buildings.filter((b) => b.name.toLowerCase().includes(assetSearch.toLowerCase()) || b.location.toLowerCase().includes(assetSearch.toLowerCase()));
  const filteredInventories = inventories.filter((i) => i.name.toLowerCase().includes(assetSearch.toLowerCase()) || i.location.toLowerCase().includes(assetSearch.toLowerCase()));

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredLogs = logs.filter((lg) => lg.user.toLowerCase().includes(logSearch.toLowerCase()) || lg.detail.toLowerCase().includes(logSearch.toLowerCase()));

  return (
    <div className="space-y-6">

      {/* --- HALAMAN PENUH: TINJAU ASET MILIK DESA --- */}
      {showTinjauAsetModal && (
        <motion.div
          key="tinjau-aset-fullpage"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-0"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative h-64 md:h-72 bg-slate-100">
              <img
                src={getAssetPhoto(showTinjauAsetModal)}
                alt={showTinjauAsetModal.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=75'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <button
                onClick={() => setShowTinjauAsetModal(null)}
                className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-extrabold px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/30 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block">{showTinjauAsetModal.type} · Desa {showTinjauAsetModal.villageName}</span>
                <h2 className="font-black text-white text-2xl leading-tight mt-0.5">{showTinjauAsetModal.name}</h2>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                {getAssetDescription(showTinjauAsetModal)}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Lokasi</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{showTinjauAsetModal.location}</span>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ukuran / Quantity</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{showTinjauAsetModal.dimensionOrQuantity}</span>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Kondisi</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">{showTinjauAsetModal.condition}</span>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Sertifikat / Berkas</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{showTinjauAsetModal.hasDoc ? 'Terarsip ✓' : 'Belum Terarsip ✗'}</span>
                </div>
              </div>

              {/* Letak aset di peta */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Letak Aset di Peta</span>
                <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-slate-200">
                  <iframe
                    title={`Lokasi ${showTinjauAsetModal.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(showTinjauAsetModal.location)},+Desa+${encodeURIComponent(showTinjauAsetModal.villageName)},+Kecamatan+Belitang+Jaya,+Kabupaten+Ogan+Komering+Ulu+Timur,+Sumatera+Selatan&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowTinjauAsetModal(null)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl cursor-pointer transition"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Aset
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- SUB TAB CONTENTS: MODULE 8 ASET MILIK DESA --- */}
      {!showTinjauAsetModal && (
      <>

      {/* SEARCH BAR GLOBALS IF GENERAL LIST TABS ACTIVE */}
      {activeMainModule === 'aset' && activeSubTab !== 'peta_geo' && activeSubTab !== 'upload_berkas' && (
        <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm">
          <div className="max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              placeholder="Cari aset desa (contoh: Kas, Laptop, Balai)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 8.1 TANAH MILIK DESA */}
      {activeMainModule === 'aset' && activeSubTab === 'tanah' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 font-semibold">
              <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">No</th>
                  <th className="p-4">Nama Aset Terdaftar</th>
                  <th className="p-4">Asal Desa</th>
                  <th className="p-4">Detail Lokasi</th>
                  <th className="p-4 text-center">Ukuran Luas</th>
                  <th className="p-4">Status Kepemilikan</th>
                  <th className="p-4">Penggunaan Saat Ini</th>
                  <th className="p-4">Sertifikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredLands.map((l, lIdx) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono text-xs">{lIdx + 1}</td>
                    <td className="p-4 font-bold text-slate-900">{l.name}</td>
                    <td className="p-4">Desa {l.villageName}</td>
                    <td className="p-4 text-xs font-normal text-slate-500">{l.location}</td>
                    <td className="p-4 text-center font-mono text-xs">{l.dimensionOrQuantity}</td>
                    <td className="p-4 text-xs">{l.ownershipOrYear}</td>
                    <td className="p-4 text-xs">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold">{l.currentUseOrType}</span>
                    </td>
                    <td className="p-4 text-xs">
                      {l.hasDoc ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded font-bold text-[10px]">ADA</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-250 rounded font-bold text-[10px]">BELUM</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8.2 BANGUNAN MILIK DESA */}
      {activeMainModule === 'aset' && activeSubTab === 'bangunan' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 font-semibold">
              <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">No</th>
                  <th className="p-4">Nama Bangunan</th>
                  <th className="p-4">Asal Desa</th>
                  <th className="p-4">Tahun Bangun</th>
                  <th className="p-4">Ketipean Fisik</th>
                  <th className="p-4">Kondisi</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBuildings.map((b, bIdx) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 text-slate-800">
                    <td className="p-4 font-mono text-xs">{bIdx + 1}</td>
                    <td className="p-4 font-bold text-slate-900">{b.name}</td>
                    <td className="p-4 font-bold text-slate-705">Desa {b.villageName}</td>
                    <td className="p-4 font-mono text-xs text-center">{b.ownershipOrYear}</td>
                    <td className="p-4 text-xs">{b.currentUseOrType}</td>
                    <td className="p-4">
                      {b.condition === 'Baik' ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded border border-emerald-200 font-bold">BAIK</span>
                      ) : b.condition === 'Rusak Ringan' ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] rounded border border-amber-200 font-bold">RUSAK RINGAN</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] rounded border border-rose-200 font-bold">RUSAK BERAT</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-bold border border-slate-200 uppercase">{b.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setShowTinjauAsetModal(b)}
                        className="p-1 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded cursor-pointer"
                      >
                        Tinjau
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8.3 INVENTARIS BARANG */}
      {activeMainModule === 'aset' && activeSubTab === 'inventaris' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 font-semibold">
              <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">No</th>
                  <th className="p-4">Nama Inventaris Barang</th>
                  <th className="p-4">Desa Asal</th>
                  <th className="p-4">Unit Sedia</th>
                  <th className="p-4">Kondisi Fisik</th>
                  <th className="p-4">Penempatan Lokasi</th>
                  <th className="p-4">Status Penggunaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInventories.map((i, iIdx) => (
                  <tr key={i.id} className="hover:bg-slate-50/50 text-slate-800">
                    <td className="p-4 font-mono text-xs">{iIdx + 1}</td>
                    <td className="p-4 font-bold text-slate-900">{i.name}</td>
                    <td className="p-4">Desa {i.villageName}</td>
                    <td className="p-4 font-mono text-xs">{i.dimensionOrQuantity}</td>
                    <td className="p-4">
                      {i.condition === 'Baik' ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded border border-emerald-250 font-bold">BAIK</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] rounded border border-rose-250 font-bold">{i.condition}</span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-normal text-slate-500">{i.location}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-655 text-[10px] rounded border font-bold border-slate-200 uppercase">{i.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8.4 GEO TAGGING ASET */}
      {activeMainModule === 'aset' && activeSubTab === 'peta_geo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900">Peta Sebaran Koordinat Fisik Aset</h3>
              <p className="text-xs text-slate-500">
                {isOperator
                  ? `Peta wilayah Desa ${operatorVillage}, Kecamatan Belitang Jaya — pilih aset di bawah peta untuk meninjau detail.`
                  : 'Peta Kecamatan Belitang Jaya, Kabupaten OKU Timur — pilih aset di bawah peta untuk meninjau detail.'}
              </p>
            </div>

            {/* Real Google Maps embed centered on Kecamatan Belitang Jaya */}
            <div className="relative aspect-[16/10] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              <iframe
                title="Peta Geo Tagging Aset"
                src={`https://www.google.com/maps?q=${
                  isOperator
                    ? `Desa+${encodeURIComponent(operatorVillage || 'Rejosari')},+Kecamatan+Belitang+Jaya`
                    : 'Kecamatan+Belitang+Jaya'
                },+Kabupaten+Ogan+Komering+Ulu+Timur,+Sumatera+Selatan&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Asset quick-select chips (since the embedded map can't carry custom clickable pins) */}
            <div className="flex flex-wrap gap-2">
              {assetCoords.map((coord, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => setSelectedAssetMap(coord.data as Asset)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    selectedAssetMap?.id === coord.data.id
                      ? 'bg-blue-950 text-white border-blue-950'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${coord.color.split(' ')[1] || coord.color}`} />
                  {coord.name}
                </button>
              ))}
            </div>

            {/* Legends */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex gap-4 text-xs font-semibold justify-around">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Tanah Kas / Tanah Makam
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Aset Bangunan / Balai
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Inventaris Mesin / IT
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-205 shadow-sm flex flex-col justify-between">
            {selectedAssetMap ? (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 px-2 py-0.5 border border-blue-200 rounded">
                  {selectedAssetMap.type} Desa {selectedAssetMap.villageName}
                </span>
                <h4 className="font-extrabold text-slate-900 leading-tight">{selectedAssetMap.name}</h4>
                
                <div className="space-y-2 text-xs font-medium text-slate-650">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Penempatan Lokasi:</span>
                    <span className="font-bold text-slate-800">{selectedAssetMap.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Ukuran / Quantity:</span>
                    <span className="font-bold font-mono text-slate-800">{selectedAssetMap.dimensionOrQuantity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Sertifikat Legalitas:</span>
                    <span className="font-bold text-slate-800">{selectedAssetMap.hasDoc ? 'Terarsip ✓' : 'Belum Terarsip ✗'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-105 rounded-xl text-xs">
                  <span className="font-bold text-slate-800 block">Kondisi Lapangan:</span>
                  <span className="font-bold text-emerald-700">{selectedAssetMap.condition}</span>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2 my-auto">
                <MapPin className="w-10 h-10 mx-auto text-slate-350" />
                <p className="text-xs font-semibold">Silakan pilih salah satu aset di bawah peta untuk meninjau detail.</p>
              </div>
            )}

            {selectedAssetMap && (
              <button
                onClick={() => setShowTinjauAsetModal(selectedAssetMap)}
                className="w-full bg-slate-900 hover:bg-slate-805 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Tinjau Aset Milik Desa
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8.6 UPLOAD DOKUMEN ASET */}
      {activeMainModule === 'aset' && activeSubTab === 'upload_berkas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-700" />
              Unggah Dokumen Sertifikat Aset
            </h3>

            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 uppercase">Tujuan Nama Aset</label>
                <select
                  value={selectedUploadAssetForm}
                  onChange={(e) => setSelectedUploadAssetForm(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Tanah Kas Desa">Tanah Kas Desa (Argo Mulyo)</option>
                  <option value="Tanah Lapangan Bola">Tanah Lapangan Bola (Girimulyo)</option>
                  <option value="Balai Desa Banjar Rejo">Balai Desa Banjar Rejo (Banjar Rejo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 uppercase">Jenis Dokumen Sertifikat</label>
                <select
                  value={uploadTipeDoc}
                  onChange={(e) => setUploadTipeDoc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Sertifikat">Sertifikat Tanah BPN</option>
                  <option value="Akta Hibah">Akta Hibah Daerah</option>
                  <option value="Berita Acara">Surat Kepemilikan Desa</option>
                  <option value="Foto Aset">Foto Fisik Realisasi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 uppercase">Nomor Legalitas Sertifikat</label>
                <input
                  type="text"
                  required
                  value={docNumberInput}
                  onChange={(e) => setDocNumberInput(e.target.value)}
                  placeholder="Contoh: 503/KD-SM/IV/2025"
                  className="w-full px-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              {/* Area Drag & Drop */}
              <div
                onClick={() => {
                  if (!docNumberInput) {
                    onShowNotification('⚠ Isi No. Legalitas terlebih dahulu.');
                    return;
                  }
                  const fakeInput = document.createElement('input');
                  fakeInput.type = 'file';
                  fakeInput.onchange = () => {
                    onShowNotification('Dokumen pdf berhasil ditargetkan untuk upload!');
                  };
                  fakeInput.click();
                }}
                className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-xl bg-slate-50 text-center cursor-pointer text-xs"
              >
                <FileDigit className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <span className="font-extrabold text-blue-980 block hover:underline">Pilih File PDF Dokumen</span>
                <span className="text-[10px] text-slate-400">Maksimal 5MB • Format PDF, JPG, PNG</span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg text-xs"
              >
                Simpan Transaksi Dokumen Aset
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 border-b border-slate-100 pb-3">Daftar Dokumen Sertifikat Terunggah</h3>
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-800 text-sm">{doc.name}</span>
                    <div className="flex gap-2 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                      <span>Untuk: {doc.assetName}</span>
                      <span>•</span>
                      <span className="text-blue-700">{doc.tipe}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onShowNotification(`Mengunduh berkas ${doc.name}...`)}
                      className="p-1 px-1.5 bg-slate-90 shadow-sm rounded hover:bg-slate-200"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-650" />
                    </button>
                    <button
                      onClick={() => deleteDocItem(doc.id)}
                      className="p-1 px-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB TAB CONTENTS: MODULE 9 PENGGUNA & HAK AKSES --- */}

      {/* 9.1 MANAJEMEN AKUN */}
      {activeMainModule === 'pengguna' && activeSubTab === 'manajemen_akun' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari user email atau nama lengkap..."
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3 py-1.5 bg-blue-750 hover:bg-blue-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Pengguna Baru
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 font-semibold">
                <thead className="bg-slate-50 text-slate-705 text-xs font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-center">Inisial</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Alamat Email</th>
                    <th className="p-4">Hak Otoritas</th>
                    <th className="p-4">Akses Wilayah Desa</th>
                    <th className="p-4">Status Akun</th>
                    <th className="p-4">Terakhir Login</th>
                    <th className="p-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 text-slate-800">
                      <td className="p-4 text-center">
                        <span className="inline-flex w-7 h-7 bg-blue-105 text-blue-805 font-black rounded-full items-center justify-center text-xs">
                          {u.initials}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-605">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'Admin' ? 'bg-blue-50 text-blue-755 border border-blue-200' : 'bg-slate-100 text-slate-655 border border-slate-200'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{u.villageName}</td>
                      <td className="p-4">
                        {u.status === 'Aktif' ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded border border-emerald-250 font-bold">AKTIF</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] rounded border border-rose-250 font-bold">MUTED</span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-505">{u.lastActive}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setResetSelectedUser(u.email);
                              setActiveSubTab('reset_pass');
                            }}
                            className="px-2 py-1 bg-slate-900 text-white rounded font-bold text-xs cursor-pointer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => changeUserStatus(u.id, u.status === 'Aktif' ? 'Nonaktif' : 'Aktif')}
                            className="p-1 px-1.5 bg-slate-100 rounded border hover:bg-slate-200 text-xs text-slate-500"
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

      {/* 9.2 ROLE & PERMISSION MATRIX */}
      {activeMainModule === 'pengguna' && activeSubTab === 'role_perm' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900">Matriks Hak Otoritas Otonom</h3>
            <p className="text-xs text-slate-500">Matriks hak izin pembatasan fungsional antara Administrator Kecamatan dengan Operator Desa.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 font-semibold border border-slate-200">
              <thead className="bg-slate-50 text-slate-800 text-xs font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Modul Fungsional</th>
                  <th className="p-4 text-center">Admin Kecamatan</th>
                  <th className="p-4 text-center">Operator Desa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-4">[1] Dashboard & Spasial Monitoring</td>
                  <td className="p-4 text-center">✓ Full</td>
                  <td className="p-4 text-center">✓ Data Desa Sendiri</td>
                </tr>
                <tr>
                  <td className="p-4">[2] Profil Administratif Desa Binaan</td>
                  <td className="p-4 text-center">✓ Full (Semua Desa)</td>
                  <td className="p-4 text-center">✗ Tidak diizinkan</td>
                </tr>
                <tr>
                  <td className="p-4">[3] Sensus Monografi Kependudukan</td>
                  <td className="p-4 text-center">✓ Review & Export</td>
                  <td className="p-4 text-center">✓ Entri & Ubah Data</td>
                </tr>
                <tr>
                  <td className="p-4">[4] Pendataan Komoditas Wilayah</td>
                  <td className="p-4 text-center">✓ Moderasi & Sebaran</td>
                  <td className="p-4 text-center">✓ Entri & Ubah Data</td>
                </tr>
                <tr>
                  <td className="p-4">[7] Katalog Lapak Pasar & Pelapak</td>
                  <td className="p-4 text-center">✓ Moderasi Bintang Emas</td>
                  <td className="p-4 text-center">✓ Entri & Kurasi Stok</td>
                </tr>
                <tr>
                  <td className="p-4">[8] Audit Aset Real-Estate Milik Desa</td>
                  <td className="p-4 text-center">✓ Review Legalitas</td>
                  <td className="p-4 text-center">✓ Entri & Upload Dokumen</td>
                </tr>
                <tr>
                  <td className="p-4">[9] Pengguna & Hak Akses (CMS)</td>
                  <td className="p-4 text-center">✓ Full (Tambah/Reset/Mute)</td>
                  <td className="p-4 text-center">✗ Tidak diizinkan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9.3 PEMBATASAN DATA PER DESA */}
      {activeMainModule === 'pengguna' && activeSubTab === 'pementasan' || activeSubTab === 'pembatasan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900">Pembatasan Sediaan Akses Regional</h3>
            <p className="text-xs text-slate-400">Setiap operator desa diprogram agar secara sistematis hanya dapat memasukkan & mengedit profil bagi desa asalnya masing-masing saja.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {users.filter((u) => u.role === 'Operator').map((usr) => (
              <div key={usr.id} className="py-3 flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="block font-bold text-slate-800 text-sm">{usr.name}</span>
                  <span className="text-slate-450">{usr.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-205 rounded-full">
                    Dibatasi: Hanya Desa {usr.villageName}
                  </span>
                  <button
                    onClick={() => {
                      const newVillage = prompt(`Modifikasi limit desa untuk operator ${usr.name}:`, usr.villageName);
                      if (newVillage) {
                        setUsers((prev) =>
                          prev.map((u) => (u.id === usr.id ? { ...u, villageName: newVillage } : u))
                        );
                        onShowNotification(`Sistem: Pembatasan operator ${usr.name} disesuaikan ke Desa ${newVillage}.`);
                      }
                    }}
                    className="p-1 px-2.5 bg-slate-900 text-white rounded text-[11px]"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9.4 RESET PASSWORD */}
      {activeMainModule === 'pengguna' && activeSubTab === 'reset_pass' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-205 shadow-sm max-w-md">
          <h3 className="font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-700" />
            Reset Sandi Akun Pengguna
          </h3>

          <form onSubmit={handleResetPasswordAction} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Pilih Akun Email</label>
              <select
                value={resetSelectedUser}
                onChange={(e) => setResetSelectedUser(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg text-slate-800 font-semibold cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600 uppercase">Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={resetNewPass}
                onChange={(e) => setResetNewPass(e.target.value)}
                placeholder="Masukkan kata sandi baru..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-805 text-white font-bold py-2 rounded-lg text-xs"
            >
              Simpan Password Baru
            </button>
          </form>
        </div>
      )}

      {/* 9.5 AUDIT LOG AKTIVITAS */}
      {activeMainModule === 'pengguna' && activeSubTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-205 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Cari pelapak logs, IP, modul..."
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-205 rounded-lg focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => onShowNotification('Sistem: Dokumen log audit berhasil diekspor berkala (CSV).')}
              className="px-3 py-1.5 bg-slate-900 text-white font-extrabold text-xs rounded-lg cursor-pointer"
            >
              Ekspor Audit Log
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 font-semibold">
                <thead className="bg-slate-50 text-slate-705 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Aktor Pengguna</th>
                    <th className="p-3 text-center">Role</th>
                    <th className="p-3">Jenis Kegiatan</th>
                    <th className="p-3">Lokasi Modul</th>
                    <th className="p-3">Rincian Kegiatan</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((lg) => (
                    <tr key={lg.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-slate-500 whitespace-nowrap">{lg.time}</td>
                      <td className="p-3 font-bold text-slate-850">{lg.user}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${lg.role === 'Admin' ? 'bg-blue-50 text-blue-705 border border-blue-200' : 'bg-slate-100 text-slate-505 border border-slate-200'}`}>
                          {lg.role}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-blue-900 whitespace-nowrap">{lg.action}</td>
                      <td className="p-3 font-bold">{lg.module}</td>
                      <td className="p-3 text-slate-600 font-normal">{lg.detail}</td>
                      <td className="p-3 font-mono text-slate-500">{lg.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PANDUAN ADMIN - APA YANG BISA DILAKUKAN */}
      {activeMainModule === 'pengguna' && activeSubTab === 'admin_capabilities' && (
        <ModuleAdminCapabilities
          onShowNotification={onShowNotification}
          userRole={userRole}
        />
      )}

      {/* --- ADD USER DYNAMIC OVERLAY MODAL --- */}
      </>
      )}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-blue-950 to-indigo-900">
                <div>
                  <h3 className="font-black text-white text-base flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" /> Tambah Akun Pengguna Baru
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">Isi seluruh data akun dengan benar</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-5 space-y-4">
                {[
                  { label: 'Nama Lengkap', type: 'text', value: formUserName, setter: setFormUserName, placeholder: 'Contoh: Budi Santoso' },
                  { label: 'Alamat Email', type: 'email', value: formUserEmail, setter: setFormUserEmail, placeholder: 'operator@sukamaju.go.id' },
                  { label: 'Password Awal', type: 'password', value: '', setter: () => {}, placeholder: 'Min. 8 karakter' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      value={f.value}
                      onChange={f.type !== 'password' ? (e) => f.setter(e.target.value) : undefined}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Hak Akses (Role)</label>
                  <select
                    value={formUserRole}
                    onChange={(e) => setFormUserRole(e.target.value as 'Admin' | 'Operator')}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-white rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operator">Operator Desa</option>
                    <option value="Admin">Admin Kecamatan</option>
                  </select>
                </div>

                {formUserRole === 'Operator' && (
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Desa Binaan</label>
                    <select
                      value={formUserVillage}
                      onChange={(e) => setFormUserVillage(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs border border-slate-200 bg-white rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {VILLAGES_DATA.map((v) => (
                        <option key={v.id} value={v.name}>Desa {v.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl cursor-pointer transition"
                  >
                    Simpan Akun
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
