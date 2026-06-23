import React, { useState } from 'react';
import { Lock, User, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModulePengaturanOperatorProps {
  onShowNotification: (msg: string) => void;
  operatorVillage?: string;
  operatorEmail?: string;
  userRole?: 'Admin' | 'Operator';
  activeSubTab?: string; // 'profil_akun' | 'ubah_password' — controlled externally via sidebar
}

export const ModulePengaturanOperator: React.FC<ModulePengaturanOperatorProps> = ({
  onShowNotification, operatorVillage, operatorEmail, userRole, activeSubTab
}) => {
  // Map external sidebar sub-tab id to internal tab key; default to profil
  const activeTab: 'profil' | 'password' = activeSubTab === 'ubah_password' ? 'password' : 'profil';

  // Profil form
  const [namaLengkap, setNamaLengkap] = useState('Operator Desa');
  const [email, setEmail] = useState(operatorEmail || 'operator@rejosari.desa.id');
  const [noTelp, setNoTelp] = useState('0812-xxxx-xxxx');
  const [idDesa, setIdDesa] = useState(operatorVillage || 'Rejosari');
  const [jabatan, setJabatan] = useState('Operator Desa');

  // Password form
  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');
  const [passKonfirm, setPassKonfirm] = useState('');
  const [showPassLama, setShowPassLama] = useState(false);
  const [showPassBaru, setShowPassBaru] = useState(false);
  const [showPassKonfirm, setShowPassKonfirm] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) { onShowNotification('⚠ Nama lengkap tidak boleh kosong.'); return; }
    onShowNotification(`Profil berhasil disimpan. Nama: ${namaLengkap}, Desa: ${idDesa}`);
  };

  const handleGantiPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);
    if (!passLama) { setPassError('Masukkan password lama Anda.'); return; }
    if (passBaru.length < 8) { setPassError('Password baru minimal 8 karakter.'); return; }
    if (passBaru !== passKonfirm) { setPassError('Konfirmasi password tidak cocok.'); return; }
    setPassSuccess(true);
    setPassLama(''); setPassBaru(''); setPassKonfirm('');
    onShowNotification('Password berhasil diperbarui. Gunakan password baru saat login berikutnya.');
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl shadow-xl relative overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
              {activeTab === 'profil' ? <User className="w-5 h-5 text-amber-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Pengaturan Akun</span>
              <h2 className="text-xl font-black text-white">{activeTab === 'profil' ? 'Profil & Data Akun' : 'Ubah Password'}</h2>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab Profil */}
        {activeTab === 'profil' && (
          <motion.div key="profil" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><User className="w-4 h-4 text-blue-700"/>Profil & Data Akun Operator</h3>
                <p className="text-xs text-slate-500 mt-0.5">Perbarui informasi profil dan identifikasi akun Anda.</p>
              </div>
              <form onSubmit={handleSaveProfil} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label:'Nama Lengkap *', value:namaLengkap, setter:setNamaLengkap, placeholder:'Nama lengkap operator', type:'text' },
                    { label:'Alamat Email', value:email, setter:setEmail, placeholder:'email@desa.id', type:'email' },
                    { label:'No. Telepon / WA', value:noTelp, setter:setNoTelp, placeholder:'0812-xxxx-xxxx', type:'text' },
                    { label:'Jabatan', value:jabatan, setter:setJabatan, placeholder:'Operator Desa', type:'text' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                      <input type={f.type} value={f.value} onChange={e=>f.setter(e.target.value)} placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  ))}
                </div>

                {/* ID Desa — bisa diubah operator */}
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">ID / Nama Desa Binaan</label>
                  <input type="text" value={idDesa} onChange={e=>setIdDesa(e.target.value)} placeholder="Nama desa tempat bertugas"
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <p className="text-[10px] text-slate-400 mt-1">Perubahan ID Desa harus dikonfirmasi Admin Kecamatan sebelum berlaku.</p>
                </div>

                {/* Info read-only */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:'Role Akses', value: userRole || 'Operator' },
                    { label:'Status Akun', value: 'Aktif ✓' },
                  ].map(info => (
                    <div key={info.label} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{info.label}</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{info.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl cursor-pointer transition">
                    <Save className="w-4 h-4"/>Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Tab Password */}
        {activeTab === 'password' && (
          <motion.div key="password" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-lg">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><Lock className="w-4 h-4 text-rose-600"/>Ubah Password Akun</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hanya Anda sendiri yang dapat mengubah password akun ini.</p>
              </div>
              <form onSubmit={handleGantiPassword} className="p-6 space-y-4">
                {passSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                    <CheckCircle className="w-4 h-4 shrink-0"/>Password berhasil diperbarui!
                  </div>
                )}
                {passError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 text-xs text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0"/>{passError}
                  </div>
                )}

                {[
                  { label:'Password Lama *', value:passLama, setter:setPassLama, show:showPassLama, toggleShow:()=>setShowPassLama(p=>!p) },
                  { label:'Password Baru * (min. 8 karakter)', value:passBaru, setter:setPassBaru, show:showPassBaru, toggleShow:()=>setShowPassBaru(p=>!p) },
                  { label:'Konfirmasi Password Baru *', value:passKonfirm, setter:setPassKonfirm, show:showPassKonfirm, toggleShow:()=>setShowPassKonfirm(p=>!p) },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                    <div className="relative">
                      <input type={f.show ? 'text' : 'password'} value={f.value} onChange={e=>f.setter(e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                      <button type="button" onClick={f.toggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer">
                        {f.show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                  <strong>Tips keamanan:</strong> Gunakan kombinasi huruf besar, kecil, angka, dan simbol. Jangan bagikan password ke siapapun.
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm py-2.5 rounded-xl cursor-pointer transition">
                  <Lock className="w-4 h-4"/>Perbarui Password
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
