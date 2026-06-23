/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  FileSpreadsheet,
  Globe,
  StickyNote,
  Send,
  Building,
  GraduationCap,
  HeartPulse,
  Milestone,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Briefcase,
  BookOpen,
  ArrowLeft,
  Plus,
  X,
  MapPinned
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VILLAGES_DATA, STATIC_DISTRI_USIA, STATIC_AGAMA, STATIC_LAND_USAGE, MONOGRAFI_PER_DESA } from '../data/dummy';
import { Village } from '../types';
import { DonutChart, VerticalBarChart } from './SVGCharts';
import { useSyncedState } from '../lib/useSyncedState';
import { publishVillageProfile } from '../lib/portalSync';

interface ModuleDataDesaProps {
  onShowNotification: (msg: string) => void;
  userRole?: 'Admin' | 'Operator';
  operatorVillage?: string;
  activeMainModule?: 'profil_desa' | 'monografi';
  activeSubTab?: string;
  onSubTabChange?: (main: 'profil_desa' | 'monografi', sub: string) => void;
}

export const ModuleDataDesa: React.FC<ModuleDataDesaProps> = ({
  onShowNotification,
  userRole,
  operatorVillage,
  activeMainModule: propActiveMainModule,
  activeSubTab: propActiveSubTab,
  onSubTabChange
}) => {
  const [localActiveMainModule, setLocalActiveMainModule] = useState<'profil_desa' | 'monografi'>('profil_desa');
  const [localActiveSubTab, setLocalActiveSubTab] = useState<string>('daftar');

  // Data desa kini tersinkron lewat Data Server Lokal: "Tambah Desa" akan
  // langsung terlihat oleh Admin maupun Operator, dan profil Desa Rejosari
  // otomatis dipublikasikan ke Portal Rejosari.
  const [villages, setVillages] = useSyncedState<Village[]>('kec_villages', VILLAGES_DATA);

  useEffect(() => {
    publishVillageProfile(villages);
  }, [villages]);

  const activeMainModule = propActiveMainModule ?? localActiveMainModule;
  const activeSubTab = propActiveSubTab ?? localActiveSubTab;

  const setActiveMainModule = (val: 'profil_desa' | 'monografi') => {
    if (onSubTabChange) {
      onSubTabChange(val, val === 'profil_desa' ? 'daftar' : 'kependudukan');
    } else {
      setLocalActiveMainModule(val);
      setLocalActiveSubTab(val === 'profil_desa' ? 'daftar' : 'kependudukan');
    }
  };

  const setActiveSubTab = (val: string) => {
    if (onSubTabChange) {
      onSubTabChange(activeMainModule, val);
    } else {
      setLocalActiveSubTab(val);
    }
  };

  // Active village selection for detail view
  const [selectedVillageCode, setSelectedVillageCode] = useState<string>(() => {
    if (userRole === 'Operator' && operatorVillage) {
      const found = villages.find(v => v.name === operatorVillage);
      if (found) return found.id;
    }
    return villages[0].id;
  });

  // Search/Filters for Daftar Desa
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWebStatus, setFilterWebStatus] = useState('Semua');
  const [filterDataStatus, setFilterDataStatus] = useState('Semua');

  // Catatan State
  const [notesList, setNotesList] = useState([
    { id: 1, tanggal: '14 Jun 2025', desa: 'Banjar Rejo', jenis: 'Arahan', isi: 'Lakukan peremajaan data jumlah komoditas panen karet semester ganjil.', prioritas: 'Tinggi', status: 'Selesai' },
    { id: 2, tanggal: '12 Jun 2025', desa: 'Girimulyo', jenis: 'Permintaan Update', isi: 'Audit kelengkapan pendataan monografi warga usia produktif.', prioritas: 'Sedang', status: 'Pending' },
    { id: 3, tanggal: '10 Jun 2025', desa: 'Madu Condo', jenis: 'Koreksi Data', isi: 'Koordinasi pembaruan profil struktur organisasi Kades/Sekdes baru.', prioritas: 'Tinggi', status: 'Pending' },
    { id: 4, tanggal: '08 Jun 2025', desa: 'Argo Mulyo', jenis: 'Pujian', isi: 'Pertahankan kemandirian lapak digital desa yang sudah melampaui target berkala.', prioritas: 'Rendah', status: 'Selesai' },
  ]);
  const [noteFormDesa, setNoteFormDesa] = useState('Argo Mulyo');
  const [noteFormJenis, setNoteFormJenis] = useState('Koreksi Data');
  const [noteFormIsi, setNoteFormIsi] = useState('');
  const [noteFormPrioritas, setNoteFormPrioritas] = useState('Sedang');

  // Monografi specific interactive states
  const [monografiSelectedVillage, setMonografiSelectedVillage] = useState<string>(
    userRole === 'Operator' ? (operatorVillage || 'Rejosari') : 'Rejosari'
  );

  // ── Form edit profil desa (hanya untuk Operator) ──────────────────────
  const isOperator = userRole === 'Operator';
  const [isEditingProfil, setIsEditingProfil] = useState(false);
  const [editForm, setEditForm] = useState<{
    headName: string; vision: string; missions: string[]; history: string;
    officeAddress: string; geographicalInfo: string;
    boundaryNorth: string; boundarySouth: string; boundaryWest: string; boundaryEast: string;
  } | null>(null);

  const selectedVillage = villages.find(v => v.id === selectedVillageCode) ?? villages[0];

  const openEditProfil = () => {
    setEditForm({
      headName: selectedVillage.headName,
      vision: selectedVillage.vision,
      missions: [...(selectedVillage.missions.length ? selectedVillage.missions : [''])],
      history: selectedVillage.history,
      officeAddress: selectedVillage.officeAddress,
      geographicalInfo: selectedVillage.geographicalInfo ?? '',
      boundaryNorth: selectedVillage.boundaries.north,
      boundarySouth: selectedVillage.boundaries.south,
      boundaryWest: selectedVillage.boundaries.west,
      boundaryEast: selectedVillage.boundaries.east,
    });
    setIsEditingProfil(true);
  };

  const saveProfil = () => {
    if (!editForm) return;
    setVillages(prev =>
      prev.map(v =>
        v.id === selectedVillage.id
          ? {
              ...v,
              headName: editForm.headName,
              vision: editForm.vision,
              missions: editForm.missions.filter(m => m.trim() !== ''),
              history: editForm.history,
              officeAddress: editForm.officeAddress,
              geographicalInfo: editForm.geographicalInfo,
              boundaries: {
                north: editForm.boundaryNorth,
                south: editForm.boundarySouth,
                west: editForm.boundaryWest,
                east: editForm.boundaryEast,
              },
              dataStatus: 'Lengkap' as const,
              lastUpdate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            }
          : v
      )
    );
    setIsEditingProfil(false);
    onShowNotification(`Profil Desa ${selectedVillage.name} berhasil diperbarui dan dikirim ke Portal Rejosari.`);
  };
  const currentMonografi = MONOGRAFI_PER_DESA[monografiSelectedVillage] || MONOGRAFI_PER_DESA['Rejosari'];

  // Modal Tambah Desa
  const [showAddDesaModal, setShowAddDesaModal] = useState(false);
  const [addDesaForm, setAddDesaForm] = useState({ nama: '', kode: '', alamat: '', kades: '', webStatus: 'Draft' });

  // Modal Tambah Catatan
  const [showAddCatatanModal, setShowAddCatatanModal] = useState(false);

  // Search details states
  const [showVillageDetailSearch, setShowVillageDetailSearch] = useState(false);
  const [villageDetailSearch, setVillageDetailSearch] = useState('');

  const [showNoteDesaSearch, setShowNoteDesaSearch] = useState(false);
  const [noteDesaSearchText, setNoteDesaSearchText] = useState('');

  const [showMonografiSearch, setShowMonografiSearch] = useState(false);
  const [monografiSearchText, setMonografiSearchText] = useState('');

  const filteredVillagesDetail = villages.filter((v) =>
    v.name.toLowerCase().includes(villageDetailSearch.toLowerCase())
  );

  const filteredNoteVillages = VILLAGES_DATA.filter((v) =>
    v.name.toLowerCase().includes(noteDesaSearchText.toLowerCase())
  );

  const filteredMonografiVillages = VILLAGES_DATA.filter((v) =>
    v.name.toLowerCase().includes(monografiSearchText.toLowerCase())
  );

  // selectedVillage already declared above with edit state

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteFormIsi.trim()) return;

    const newNote = {
      id: Date.now(),
      tanggal: '15 Jun 2025',
      desa: noteFormDesa,
      jenis: noteFormJenis,
      isi: noteFormIsi,
      prioritas: noteFormPrioritas,
      status: 'Pending',
    };

    setNotesList([newNote, ...notesList]);
    setNoteFormIsi('');
    onShowNotification(`Catatan arahan sukses disimpan untuk Desa ${noteFormDesa}!`);
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'Tinggi':
        return 'text-rose-700 bg-rose-50 border-rose-250';
      case 'Sedang':
        return 'text-amber-700 bg-amber-50 border-amber-250';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Lengkap':
      case 'Aktif':
      case 'Selesai':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-250">Aktif/Selesai</span>;
      case 'Perlu Diperbarui':
      case 'Draft':
      case 'Pending':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-250">Pending/Draft</span>;
      default:
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-250">Belum Aktif</span>;
    }
  };

  const filteredVillages = villages.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.headName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchWeb = filterWebStatus === 'Semua' || v.webStatus === filterWebStatus;
    const matchData = filterDataStatus === 'Semua' || v.dataStatus === filterDataStatus;
    return matchSearch && matchWeb && matchData;
  });

  return (
    <div className="space-y-6">

      {/* TAB SUB-CONTENTS MODULE 2: DATA DESA */}

      {/* 2.1 DAFTAR DESA */}
      {activeMainModule === 'profil_desa' && activeSubTab === 'daftar' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-800" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kepala desa atau nama daerah..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-slate-950 font-bold"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterWebStatus}
                onChange={(e) => setFilterWebStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 font-extrabold"
              >
                <option value="Semua">Status Web (Semua)</option>
                <option value="Aktif">Aktif</option>
                <option value="Draft">Draft</option>
                <option value="Belum">Belum</option>
              </select>
              <select
                value={filterDataStatus}
                onChange={(e) => setFilterDataStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 font-extrabold"
              >
                <option value="Semua">Kepatuhan Data (Semua)</option>
                <option value="Lengkap">Lengkap</option>
                <option value="Belum Lengkap">Belum Lengkap</option>
                <option value="Perlu Diperbarui">Perlu Diperbarui</option>
              </select>
              {userRole === 'Admin' && (
                <button
                  onClick={() => setShowAddDesaModal(true)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded-lg cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Desa
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-900">
                <thead className="bg-slate-100 text-slate-900 text-xs font-black uppercase border-b border-slate-300">
                  <tr>
                    <th className="p-4">Kode Desa</th>
                    <th className="p-4">Nama Desa</th>
                    <th className="p-4">Alamat Kantor</th>
                    <th className="p-4">Kepala Desa</th>
                    <th className="p-4">Web Desa</th>
                    <th className="p-4">Status Data</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-black text-slate-950">
                  {filteredVillages.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-800 font-bold">{v.id}</td>
                      <td className="p-4 font-black text-slate-950">Desa {v.name}</td>
                      <td className="p-4 text-xs max-w-[200px] truncate font-bold text-slate-900" title={v.officeAddress}>{v.officeAddress}</td>
                      <td className="p-4 text-slate-950 font-black">{v.headName}</td>
                      <td className="p-4 text-xs font-black uppercase text-blue-950">{v.webStatus}</td>
                      <td className="p-4 text-xs">{getStatusBadge(v.dataStatus)}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedVillageCode(v.id);
                              setActiveSubTab('detail');
                            }}
                            className="p-1.5 px-3 bg-blue-900 text-white hover:bg-blue-800 text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
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

      {/* 2.2 DETAIL PROFIL DESA */}
      {activeMainModule === 'profil_desa' && activeSubTab === 'detail' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3">
              {userRole !== 'Operator' && (
                <button
                  onClick={() => setActiveSubTab('daftar')}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center border border-slate-200/60 shadow-xs"
                  title="Kembali ke Daftar Desa"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-800 stroke-[2.5]" />
                </button>
              )}
              <div>
                <span className="text-[10px] uppercase font-extrabold text-blue-700 tracking-wide">DETAIL WILAYAH BINAAN</span>
                <h3 className="text-xl font-extrabold text-slate-950">Desa {selectedVillage.name}</h3>
              </div>
            </div>
            {userRole !== 'Operator' && (
              <div className="relative">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={villageDetailSearch || `Ganti ke Desa ${selectedVillage.name}`}
                    onFocus={() => {
                      setVillageDetailSearch('');
                      setShowVillageDetailSearch(true);
                    }}
                    onChange={(e) => {
                      setVillageDetailSearch(e.target.value);
                      setShowVillageDetailSearch(true);
                    }}
                    onBlur={() => setTimeout(() => setShowVillageDetailSearch(false), 200)}
                    placeholder="Ketik untuk cari desa..."
                    className="pl-8 pr-3 py-1.5 text-xs text-slate-700 border border-slate-200 bg-white rounded-lg font-medium cursor-text focus:outline-none focus:ring-1 focus:ring-blue-600 w-48"
                  />
                </div>
                {showVillageDetailSearch && (
                  <div className="absolute right-0 mt-1 w-48 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                    {filteredVillagesDetail.length > 0 ? (
                      filteredVillagesDetail.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVillageCode(v.id);
                            setVillageDetailSearch(`Desa ${v.name}`);
                            setShowVillageDetailSearch(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 text-slate-700 cursor-pointer block"
                        >
                          Desa {v.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-1.5 text-xs text-slate-400">Tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900">Histori Geografis</h4>
                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div>Kode Regional: <span className="font-mono font-bold">{selectedVillage.id}</span></div>
                  <div>Alamat Kantor: <span>{selectedVillage.officeAddress}</span></div>
                  <div>Kepala Desa (Aktif): <span className="font-bold text-slate-800">{selectedVillage.headName}</span></div>
                  <div>Sensus wilayah: <span className="font-bold text-slate-800">{selectedVillage.areaHa} Ha</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900">Batas Koordinat Wilayah</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                  <div>Utara: <span className="font-bold text-slate-800">{selectedVillage.boundaries.north}</span></div>
                  <div>Selatan: <span className="font-bold text-slate-800">{selectedVillage.boundaries.south}</span></div>
                  <div>Barat: <span className="font-bold text-slate-800">{selectedVillage.boundaries.west}</span></div>
                  <div>Timur: <span className="font-bold text-slate-800">{selectedVillage.boundaries.east}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900">Visi & Misi Desa</h4>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-blue-900 italic">Visi:</div>
                  <p className="text-xs text-slate-600">"{selectedVillage.vision}"</p>
                  
                  <div className="text-xs font-semibold text-blue-900 pt-2">Misi:</div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {selectedVillage.missions.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-blue-950 block">Sejarah Pendirian:</span>
            <p className="text-blue-900 leading-relaxed">{selectedVillage.history}</p>
          </div>

          {/* Tombol Edit Profil — hanya untuk Operator, untuk desanya sendiri */}
          {isOperator && (
            <div className="flex justify-end">
              <button
                onClick={openEditProfil}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow"
              >
                <CheckCircle className="w-4 h-4" /> Edit Profil Desa
              </button>
            </div>
          )}

          {/* Modal Form Edit Profil Desa */}
          <AnimatePresence>
            {isEditingProfil && editForm && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-base">Edit Profil Desa {selectedVillage.name}</h3>
                    <button onClick={() => setIsEditingProfil(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4 text-sm">
                    {/* Kepala Desa */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Nama Kepala Desa</label>
                      <input value={editForm.headName} onChange={e => setEditForm(f => f && ({ ...f, headName: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                    </div>
                    {/* Alamat Kantor */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Alamat Kantor Desa</label>
                      <input value={editForm.officeAddress} onChange={e => setEditForm(f => f && ({ ...f, officeAddress: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                    </div>
                    {/* Visi */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Visi Desa</label>
                      <textarea rows={2} value={editForm.vision} onChange={e => setEditForm(f => f && ({ ...f, vision: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
                    </div>
                    {/* Misi */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Misi Desa</label>
                      {editForm.missions.map((m, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input value={m} onChange={e => setEditForm(f => { if (!f) return f; const ms = [...f.missions]; ms[i] = e.target.value; return { ...f, missions: ms }; })}
                            placeholder={`Misi ${i + 1}`}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                          {editForm.missions.length > 1 && (
                            <button onClick={() => setEditForm(f => f && ({ ...f, missions: f.missions.filter((_, j) => j !== i) }))}
                              className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
                          )}
                        </div>
                      ))}
                      {editForm.missions.length < 5 && (
                        <button onClick={() => setEditForm(f => f && ({ ...f, missions: [...f.missions, ''] }))}
                          className="flex items-center gap-1 text-xs text-blue-600 font-bold mt-1 hover:underline">
                          <Plus className="w-3 h-3" /> Tambah Misi
                        </button>
                      )}
                    </div>
                    {/* Sejarah */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Sejarah Singkat Desa</label>
                      <textarea rows={4} value={editForm.history} onChange={e => setEditForm(f => f && ({ ...f, history: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
                    </div>
                    {/* Informasi Geografis */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Informasi Geografis</label>
                      <textarea rows={2} value={editForm.geographicalInfo} onChange={e => setEditForm(f => f && ({ ...f, geographicalInfo: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
                    </div>
                    {/* Batas Wilayah */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Batas Wilayah</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Utara', key: 'boundaryNorth' as const },
                          { label: 'Selatan', key: 'boundarySouth' as const },
                          { label: 'Barat', key: 'boundaryWest' as const },
                          { label: 'Timur', key: 'boundaryEast' as const },
                        ].map(({ label, key }) => (
                          <div key={key}>
                            <span className="text-xs text-slate-500 block mb-1">{label}</span>
                            <input value={editForm[key]} onChange={e => setEditForm(f => f && ({ ...f, [key]: e.target.value }))}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                    <button onClick={() => setIsEditingProfil(false)}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Batal</button>
                    <button onClick={saveProfil}
                      className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Simpan & Publikasikan
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Peta Lokasi Desa (Google Maps) */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-blue-700" /> Peta Lokasi Desa {selectedVillage.name}
            </h4>
            <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-slate-200">
              <iframe
                title={`Peta Desa ${selectedVillage.name}`}
                src={`https://www.google.com/maps?q=Desa+${encodeURIComponent(selectedVillage.name)},+Kecamatan+Belitang+Jaya,+Kabupaten+Ogan+Komering+Ulu+Timur,+Sumatera+Selatan&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2.3 STATUS WEB DESA */}
      {activeMainModule === 'profil_desa' && activeSubTab === 'web' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900">Integrasi Web Desa</h3>
              <p className="text-xs text-slate-500 mt-1">Status ketersediaan tautan, publikasi daerah dan pembaruan berkala desa.</p>
            </div>
            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Nama Desa</th>
                  <th className="p-4">URL Domain Web Pasang</th>
                  <th className="p-4">Status Web</th>
                  <th className="p-4">Terakhir Diunggah</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {villages.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-850">Desa {v.name}</td>
                    <td className="p-4 font-mono text-xs text-blue-900">
                      {v.webUrl ? `${v.webUrl}` : '—'}
                    </td>
                    <td className="p-4">
                      {v.webStatus === 'Aktif' ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded border border-emerald-200">AKTIF</span>
                      ) : v.webStatus === 'Draft' ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded border border-amber-200">DRAFT SISTEM</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[11px] font-bold rounded border border-rose-200">BELUM TERSEDIA</span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500">{v.lastUpdate}</td>
                    <td className="p-4 text-center">
                      {v.webUrl ? (
                        <button
                          onClick={() => onShowNotification(`Membuka URL administratif web desa ${v.webUrl}...`)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5" /> Lihat Web
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Hubungi admin kecamatan untuk pembuatan hosting sub-domain kemendagri bagi desa ${v.name}.`)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-400 font-bold text-xs rounded-md cursor-not-allowed mx-auto"
                        >
                          Ajukan Web
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2.4 CATATAN KECAMATAN */}
      {activeMainModule === 'profil_desa' && activeSubTab === 'catatan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-blue-700" /> Catatan & Arahan Kecamatan
            </h3>
            <button
              onClick={() => setShowAddCatatanModal(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Catatan
            </button>
          </div>
          {/* Notes list */}
          <div className="space-y-3">
            {notesList.map((note) => (
              <div key={note.id} className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-slate-800">Desa {note.desa}</span>
                    <span className="text-[10px] text-slate-400 mx-2 font-mono">{note.tanggal}</span>
                    <span className="text-[10px] font-bold text-blue-700">{note.jenis}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getPriorityColor(note.prioritas)}`}>
                    {note.prioritas}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{note.isi}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                  <span className="font-medium text-slate-400">Status: <span className="font-bold text-slate-700">{note.status}</span></span>
                  <button onClick={() => onShowNotification(`Catatan untuk Desa ${note.desa} ditandai selesai.`)} className="text-blue-700 font-bold hover:underline cursor-pointer">Tandai Selesai</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB SUB-CONTENTS MODULE 3: PROFIL & MONOGRAFI DESA */}

      {/* 3.1 DATA KEPENDUDUKAN */}
      {activeMainModule === 'monografi' && activeSubTab === 'kependudukan' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Distribusi Demografi Warga</h3>
              <p className="text-xs text-slate-500">Sensus kependudukan Desa <strong>{monografiSelectedVillage}</strong></p>
            </div>
            {/* Only show village selector for Admin */}
            {userRole === 'Admin' && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Desa:</span>
                <select
                  value={monografiSelectedVillage}
                  onChange={e => setMonografiSelectedVillage(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
                >
                  {VILLAGES_DATA.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Penduduk', value: currentMonografi.penduduk.total, color: 'text-blue-900' },
              { label: 'Laki-Laki', value: currentMonografi.penduduk.laki, color: 'text-rose-500' },
              { label: 'Perempuan', value: currentMonografi.penduduk.perempuan, color: 'text-teal-600' },
              { label: 'Jumlah KK', value: currentMonografi.penduduk.kk, color: 'text-amber-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className={`block text-2xl font-black ${stat.color}`}>{stat.value.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Grafik Sebaran Struktur Usia</h4>
              <VerticalBarChart
                data={currentMonografi.distriUsia.labels.map((label, i) => ({
                  label,
                  value: currentMonografi.distriUsia.data[i],
                  color: ['#3b82f6','#06b6d4','#10b981','#f59e0b','#f97316','#ef4444'][i] || '#6b7280'
                }))}
              />
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 bg-violet-50 rounded-xl">
                  <HeartPulse className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">Agama Penduduk</h4>
                  <p className="text-[11px] text-slate-500">Demografi kerukunan beragama</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                {currentMonografi.agama.map((ag, idx) => {
                  const colors = ['bg-emerald-600','bg-blue-500','bg-amber-500','bg-slate-400'];
                  const pct = parseFloat(ag.percent);
                  return (
                    <div key={ag.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${colors[idx] || 'bg-slate-400'}`} />
                          <span className="text-slate-800">{ag.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{ag.count.toLocaleString('id-ID')} ({ag.percent})</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[idx] || 'bg-slate-400'} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.2 DATA SOSIAL EKONOMI */}
      {activeMainModule === 'monografi' && activeSubTab === 'sosial_ekonomi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Pekerjaan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-2xl">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Distribusi Pekerjaan Utama</h3>
                  <p className="text-[11px] text-slate-500">Mata pencaharian warga Desa {monografiSelectedVillage}</p>
                </div>
              </div>
              {userRole === 'Admin' && (
                <select value={monografiSelectedVillage} onChange={e => setMonografiSelectedVillage(e.target.value)}
                  className="text-xs font-extrabold text-slate-700 border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                  {VILLAGES_DATA.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              )}
            </div>
            <div className="space-y-3 pt-1">
              {currentMonografi.pekerjaan.map(job => {
                const total = currentMonografi.pekerjaan.reduce((s, j) => s + j.value, 0);
                const pct = Math.round((job.value / total) * 100);
                return (
                  <div key={job.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: job.color }} />
                        <span className="text-slate-800">{job.name}</span>
                      </div>
                      <span className="font-mono font-bold">{job.value.toLocaleString('id-ID')} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: job.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pendidikan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-blue-50 rounded-2xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Tingkat Pendidikan</h3>
                <p className="text-[11px] text-slate-500">Kualifikasi edukasi formal Desa {monografiSelectedVillage}</p>
              </div>
            </div>
            <div className="space-y-3 pt-1">
              {currentMonografi.pendidikan.map((edu, idx) => {
                const colors = ['bg-indigo-600','bg-blue-500','bg-teal-500','bg-amber-500','bg-slate-400','bg-purple-600','bg-violet-500'];
                const pct = parseFloat(edu.percent);
                return (
                  <div key={edu.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors[idx] || 'bg-slate-400'}`} />
                        <span className="text-slate-800">{edu.name}</span>
                      </div>
                      <span className="font-mono font-bold">{edu.count.toLocaleString('id-ID')} ({edu.percent})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[idx] || 'bg-slate-400'} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ringkasan sosek */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              {currentMonografi.sosekRingkas.map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{item.label}</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3.3 SARANA PRASARANA */}
      {activeMainModule === 'monografi' && activeSubTab === 'sarana' && (
        <div className="space-y-4">
          {userRole === 'Admin' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 w-fit">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Desa:</span>
              <select value={monografiSelectedVillage} onChange={e => setMonografiSelectedVillage(e.target.value)}
                className="text-xs font-extrabold text-slate-900 outline-none cursor-pointer bg-transparent">
                {VILLAGES_DATA.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMonografi.fasilitas.map((f, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{f.nama}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{f.ket}</p>
                  <span className="mt-1.5 inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{f.jumlah} Unit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3.4 LUAS WILAYAH */}
      {activeMainModule === 'monografi' && activeSubTab === 'luas_wilayah' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Tata Guna Lahan — Desa {monografiSelectedVillage}</h4>
              {userRole === 'Admin' && (
                <select value={monografiSelectedVillage} onChange={e => setMonografiSelectedVillage(e.target.value)}
                  className="text-xs font-extrabold text-slate-700 border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none cursor-pointer">
                  {VILLAGES_DATA.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              )}
            </div>
            <DonutChart data={currentMonografi.landUsage} centerLabel={`${currentMonografi.landUsage.reduce((s,i)=>s+i.value,0)} Ha`} centerSub="Total Lahan" />
          </div>
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Distribusi Penggunaan</h4>
            <div className="space-y-4 text-xs font-semibold">
              {currentMonografi.landUsage.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-650">{item.name}</span>
                  </div>
                  <span className="text-slate-900 font-mono">{item.value} Ha ({item.percent})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* ── MODAL TAMBAH DESA ── */}
      <AnimatePresence>
        {showAddDesaModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} exit={{scale:0.95,y:12}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-blue-950 to-indigo-900">
                <div>
                  <h3 className="font-black text-white text-base flex items-center gap-2"><Plus className="w-4 h-4 text-amber-400"/>Tambah Data Desa Baru</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">Isi semua data desa dengan lengkap</p>
                </div>
                <button onClick={()=>setShowAddDesaModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white transition"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                {[
                  {label:'Nama Desa *',         key:'nama',      placeholder:'Contoh: Desa Sindangrasa'},
                  {label:'Kode Desa *',          key:'kode',      placeholder:'Contoh: 3110016'},
                  {label:'Alamat Kantor Desa',   key:'alamat',    placeholder:'Jl. Raya Desa No.1'},
                  {label:'Nama Kepala Desa',     key:'kades',     placeholder:'Contoh: H. Budi Santoso'},
                ].map(f=>(
                  <div key={f.key}>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                    <input value={(addDesaForm as any)[f.key]} onChange={e=>setAddDesaForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"/>
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Status Web Desa</label>
                  <select value={addDesaForm.webStatus} onChange={e=>setAddDesaForm(p=>({...p,webStatus:e.target.value}))} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Draft</option><option>Aktif</option><option>Belum Aktif</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-slate-100">
                <button onClick={()=>setShowAddDesaModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer transition">Batal</button>
                <button onClick={()=>{
                  if(!addDesaForm.nama||!addDesaForm.kode){onShowNotification('Nama dan kode desa wajib diisi.');return;}
                  const newVillage: Village = {
                    id: addDesaForm.kode,
                    name: addDesaForm.nama,
                    officeAddress: addDesaForm.alamat || '-',
                    headName: addDesaForm.kades || '-',
                    webStatus: addDesaForm.webStatus as Village['webStatus'],
                    dataStatus: 'Belum Lengkap',
                    areaHa: 0,
                    boundaries: { north: '-', south: '-', west: '-', east: '-' },
                    geographicalInfo: '-',
                    history: '-',
                    vision: '-',
                    missions: []
                  };
                  setVillages(prev => [newVillage, ...prev]);
                  onShowNotification(`Desa "${addDesaForm.nama}" berhasil ditambahkan.`);
                  setShowAddDesaModal(false);
                  setAddDesaForm({nama:'',kode:'',alamat:'',kades:'',webStatus:'Draft'});
                }} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl cursor-pointer transition">Simpan Desa</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL TAMBAH CATATAN ── */}
      <AnimatePresence>
        {showAddCatatanModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale:0.95,y:12}} animate={{scale:1,y:0}} exit={{scale:0.95,y:12}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-amber-700 to-orange-800">
                <div>
                  <h3 className="font-black text-white text-base flex items-center gap-2"><StickyNote className="w-4 h-4 text-amber-200"/>Tambah Catatan Kecamatan</h3>
                  <p className="text-[11px] text-amber-200 mt-0.5">Arahan atau koreksi untuk operator desa</p>
                </div>
                <button onClick={()=>setShowAddCatatanModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white transition"><X className="w-4 h-4"/></button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Tujuan Desa *</label>
                  <select value={noteFormDesa} onChange={e=>setNoteFormDesa(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {VILLAGES_DATA.map(v=><option key={v.id} value={v.name}>Desa {v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Jenis Catatan</label>
                  <select value={noteFormJenis} onChange={e=>setNoteFormJenis(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="Koreksi Data">Koreksi Data</option>
                    <option value="Arahan">Arahan Pimpinan</option>
                    <option value="Permintaan Update">Permintaan Update</option>
                    <option value="Pujian">Apresiasi & Pujian</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Isi Pesan / Instruksi *</label>
                  <textarea rows={4} value={noteFormIsi} onChange={e=>setNoteFormIsi(e.target.value)} placeholder="Instruksikan perbaikan data atau arahan khusus..." className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"/>
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Prioritas</label>
                  <div className="flex gap-3">
                    {['Rendah','Sedang','Tinggi'].map(p=>(
                      <label key={p} className={`flex-1 text-center py-2 rounded-xl border-2 text-xs font-extrabold cursor-pointer transition ${noteFormPrioritas===p ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" name="catatan-prio" className="hidden" checked={noteFormPrioritas===p} onChange={()=>setNoteFormPrioritas(p)}/>{p}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-5 border-t border-slate-100">
                <button onClick={()=>setShowAddCatatanModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer transition">Batal</button>
                <button onClick={()=>{ if(!noteFormIsi.trim()){onShowNotification('Isi catatan tidak boleh kosong.');return;} const now=new Date(); setNotesList(prev=>[{id:Date.now(),tanggal:`${now.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'][now.getMonth()]} ${now.getFullYear()}`,desa:noteFormDesa,jenis:noteFormJenis,isi:noteFormIsi,prioritas:noteFormPrioritas,status:'Pending'},...prev]); onShowNotification(`Catatan untuk Desa ${noteFormDesa} berhasil dikirim.`); setNoteFormIsi(''); setShowAddCatatanModal(false); }} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm rounded-xl cursor-pointer transition">Kirim Catatan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
