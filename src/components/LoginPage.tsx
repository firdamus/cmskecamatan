/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Shield, UserPlus, KeyRound, CheckCircle } from 'lucide-react';
import { logoBase64 } from '../assets_logo';

interface LoginPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onLoginSuccess: (role: 'Admin' | 'Operator', village: string, email: string) => void;
  onBackToHome: () => void;
}

const DEFAULT_USERS = [
  { email: 'admin@kecamatan.go.id', password: 'admin123', role: 'Admin' as const, village: 'Semua' },
  { email: 'operator@rejosari.go.id', password: 'operator123', role: 'Operator' as const, village: 'Rejosari' }
];

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode = 'login', onLoginSuccess, onBackToHome }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Sync mode with prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Load registered users from LocalStorage or fallback to defaults
  const [users, setUsers] = useState<typeof DEFAULT_USERS>(() => {
    const stored = localStorage.getItem('scope_registered_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEFAULT_USERS;
      }
    }
    return DEFAULT_USERS;
  });

  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register inputs
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'Admin' | 'Operator'>('Operator');
  const [regVillage, setRegVillage] = useState('Rejosari'); // This state will now store manual text input as requested
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Forgot Password inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1: enter email, 2: reset password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Handler for login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail && u.password === password);

    if (foundUser) {
      onLoginSuccess(foundUser.role, foundUser.village, foundUser.email);
    } else {
      setErrorMsg('Email atau password salah. Silakan coba lagi.');
    }
  };

  // Handler for demo credentials fill
  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  // Handler for registration submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    const trimmedEmail = regEmail.trim();
    if (!trimmedEmail) {
      setRegError('Email tidak boleh kosong.');
      return;
    }

    const trimmedVillage = regVillage.trim();
    if (regRole === 'Operator' && !trimmedVillage) {
      setRegError('Nama desa tidak boleh kosong.');
      return;
    }

    // Check email uniqueness
    const emailExists = users.some(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (emailExists) {
      setRegError('Email ini sudah terdaftar sebagai pengguna.');
      return;
    }

    if (regPassword.length < 5) {
      setRegError('Password minimal harus 5 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Password konfirmasi tidak cocok.');
      return;
    }

    const newUser = {
      email: trimmedEmail,
      password: regPassword,
      role: regRole,
      village: regRole === 'Admin' ? 'Semua' : trimmedVillage
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('scope_registered_users', JSON.stringify(updatedUsers));

    setRegSuccess(`Akun ${regRole} berhasil didaftarkan! Mengalihkan ke login...`);
    
    setTimeout(() => {
      setMode('login');
      setEmail(trimmedEmail);
      setPassword(regPassword);
      setRegSuccess('');
      // reset forms
      setRegFullName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegVillage('Rejosari');
    }, 1800);
  };

  // Handler for forgot password submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotStep === 1) {
      const trimmedEmail = forgotEmail.trim().toLowerCase();
      const userExists = users.some(u => u.email.toLowerCase() === trimmedEmail);
      if (!userExists) {
        setForgotError('Alamat email tidak ditemukan dalam sistem kami.');
        return;
      }
      setForgotStep(2);
    } else {
      if (newPassword.length < 5) {
        setForgotError('Password baru minimal harus 5 karakter.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setForgotError('Konfirmasi password baru tidak cocok.');
        return;
      }

      // Update password of user in users list
      const trimmedEmail = forgotEmail.trim().toLowerCase();
      const updatedUsers = users.map(u => {
        if (u.email.toLowerCase() === trimmedEmail) {
          return { ...u, password: newPassword };
        }
        return u;
      });

      setUsers(updatedUsers);
      localStorage.setItem('scope_registered_users', JSON.stringify(updatedUsers));

      setForgotSuccess('Kata sandi berhasil diperbarui! Silahkan masuk kembali.');
      
      setTimeout(() => {
        setMode('login');
        setEmail(forgotEmail);
        setPassword(newPassword);
        setForgotEmail('');
        setForgotStep(1);
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotSuccess('');
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 font-sans relative overflow-hidden">
      
      {/* Decorative landing-like backgrounds */}
      <div className="absolute top-1/4 left-10 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-12 w-64 h-64 border-2 border-white/5 rounded-3xl rotate-45 pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-3 h-3 bg-amber-400 rounded-full animate-ping pointer-events-none opacity-20" />

      {/* LEFT COLUMN: FORM PANEL WITH MAJESTIC DEEP BLUE COHESIVE CELL */}
      <div className="lg:col-span-4 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between p-8 sm:p-12 shadow-2xl relative z-10 border-r border-white/10 text-white">
        
        {/* Top Header Row with Logo Badge in top-left as requested */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 overflow-hidden">
                <img src={logoBase64} alt="Logo Belitang Jaya" className="w-full h-full object-contain" />
              </div>
            <div>
              <span className="block text-xs font-black text-white tracking-wider leading-tight uppercase">KEC. BELITANG JAYA</span>
              <span className="block text-[8px] text-amber-400 font-black tracking-widest uppercase mt-0.5">KABUPATEN OKU TIMUR</span>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md uppercase tracking-wider">
            {mode === 'login' ? 'Masuk' : mode === 'register' ? 'Daftar' : 'Reset'}
          </span>
        </div>

        {/* Dynamic Inner Form Page State */}
        <div className="my-auto py-6 max-w-sm w-full mx-auto space-y-6">

          {/* MODE 1: LOGIN FORM */}
          {mode === 'login' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Masuk Sistem</h2>
                <p className="text-xs text-slate-350 font-medium">Lakukan otentikasi login untuk mengakses kontrol panel administrasi</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black text-slate-200 uppercase" htmlFor="email-input">
                    Alamat Email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kecamatan.go.id"
                    className="w-full px-4 py-2.5 text-sm text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-medium"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="block text-[11px] font-black text-slate-200 uppercase" htmlFor="password-input">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/80 border-l-4 border-red-500 rounded text-xs text-red-200 font-bold shadow-xs">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black py-2.5 rounded-lg text-sm shadow-md transition cursor-pointer uppercase tracking-wider"
                >
                  Masuk Sekarang
                </button>
              </form>

              {/* Rearranged options at the bottom of form as requested */}
              <div className="text-center space-y-2 border-t border-white/10 pt-4 mt-2">
                <div className="text-xs text-slate-300 font-medium">
                  Belum punya akun ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegError('');
                      setRegSuccess('');
                      setMode('register');
                    }}
                    className="text-amber-400 hover:underline font-bold outline-none border-b border-transparent hover:border-amber-450"
                  >
                    Klik Disini
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotError('');
                      setForgotSuccess('');
                      setForgotStep(1);
                      setMode('forgot');
                    }}
                    className="text-xs text-slate-300 hover:text-amber-400 font-bold outline-none transition"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: REGISTER FORM */}
          {mode === 'register' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-amber-400" /> Daftar Akun Baru
                </h2>
                <p className="text-xs text-slate-350 font-medium">Registrasi akun pelapor mandiri tingkat desa binaan</p>
              </div>

              {regSuccess ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/35 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <p className="text-xs font-black text-emerald-200 leading-relaxed">{regSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-200 uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="misal. Ahmad Firdaus"
                      className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-200 uppercase">Alamat Email (.go.id / umum)</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="operator@sukamaju.go.id"
                      className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-200 uppercase">Hak Akses</label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as any)}
                        className="w-full px-2.5 py-2 text-xs text-white bg-slate-900 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold cursor-pointer"
                      >
                        <option value="Operator" className="bg-slate-950 text-white">Operator Desa</option>
                        <option value="Admin" className="bg-slate-950 text-white">Admin Kecamatan</option>
                      </select>
                    </div>

                    {regRole === 'Operator' && (
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-200 uppercase">Isi Nama Desa</label>
                        <input
                          type="text"
                          required
                          value={regVillage}
                          onChange={(e) => setRegVillage(e.target.value)}
                          placeholder="cth. Rejosari"
                          className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 relative">
                    <label className="block text-[10px] font-black text-slate-200 uppercase">Kata Sandi</label>
                    <div className="relative">
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 5 Karakter"
                        className="w-full pl-3 pr-10 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {regShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-200 uppercase">Konfirmasi Kata Sandi</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi"
                      className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                    />
                  </div>

                  {regError && (
                    <div className="p-2.5 bg-red-950/80 border-l-4 border-red-500 rounded text-xs text-red-200 font-bold">
                      {regError}
                    </div>
                  )}

                  {/* BUG RESOLVED: Changed non-existent tailwind class bg-emerald-750 to bg-emerald-600 */}
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black py-2.5 rounded-lg text-xs shadow-md transition cursor-pointer uppercase tracking-wider"
                  >
                    Daftar Akun Baru
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-white/10">
                <span className="text-xs text-slate-300 font-medium">
                  Sudah punya akun ?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Masuk Disini
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* MODE 3: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <KeyRound className="w-6 h-6 text-amber-400" /> Lupa Password
                </h2>
                <p className="text-xs text-slate-350 font-medium font-sans">
                  {forgotStep === 1 
                    ? 'Masukkan alamat email terdaftar Anda untuk verifikasi identitas akun' 
                    : 'Lakukan pengaturan ulang kata sandi baru untuk mengamankan akun Anda'}
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/35 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-xs font-black text-emerald-250">{forgotSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  {forgotStep === 1 ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-200 uppercase">Alamat Email Akun</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="admin@kecamatan.go.id"
                        className="w-full px-4 py-2.5 text-sm text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      <div className="p-3 bg-blue-950/60 text-blue-100 rounded-lg text-xs font-bold border border-blue-800">
                        Email Ditemukan: <span className="font-extrabold text-amber-400 block mt-0.5">{forgotEmail}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-200 uppercase">Kata Sandi Baru</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 5 Karakter"
                          className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-black text-slate-200 uppercase">Ketik Ulang Sandi Baru</label>
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Verifikasi sandi baru"
                          className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {forgotError && (
                    <div className="p-2.5 bg-red-955/80 border-l-4 border-red-500 rounded text-xs text-red-200 font-bold">
                      {forgotError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-lg text-xs uppercase tracking-wider transition"
                  >
                    {forgotStep === 1 ? 'Cek Ketenangan Akun' : 'Perbarui Kata Sandi'}
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setForgotEmail('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setMode('login');
                  }}
                  className="text-xs text-amber-400 hover:underline font-bold outline-none"
                >
                  Kembali ke Halaman Login
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Back Link bottom - Fully functioning link to homepage */}
        <div className="text-center pt-4 border-t border-white/10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            Kembali ke Beranda Utama
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: BRANDING & DEMO CONTROLS */}
      <div className="hidden lg:flex lg:col-span-6 bg-transparent flex-col justify-between p-12 text-white relative z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <span className="font-extrabold font-mono text-sm tracking-wider uppercase text-amber-404">SCOPE Monitoring System</span>
        </div>

        <div className="my-auto max-w-lg space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">Selamat Datang</h1>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Silahkan login terlebih dahulu untuk mengakses pelaporan data, silsilah kependudukan desa, mutasi komoditas potensial, serta monitoring spatial aset terpadu Kecamatan Belitang Jaya, Kabupaten OKU Timur.
          </p>
        </div>

        {/* Floating Demo Credentials Card */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Kredensial Cepat Masuk (Demo Accounts):
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Admin Account */}
            <div
              onClick={() => handleFillDemo('admin@kecamatan.go.id', 'admin123')}
              className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/25 p-3.5 rounded-xl transition cursor-pointer text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Admin Kecamatan</span>
                <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-black uppercase">Admin</span>
              </div>
              <div className="mt-2 font-mono text-xs text-amber-300 group-hover:text-amber-200">admin@kecamatan.go.id</div>
              <div className="font-mono text-xs text-slate-300">Pass: admin123</div>
              <span className="text-[10px] text-slate-400 block mt-1 group-hover:text-white transition font-bold">⚡ Klik untuk auto-fill data</span>
            </div>

            {/* Operator Account */}
            <div
              onClick={() => handleFillDemo('operator@rejosari.go.id', 'operator123')}
              className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/25 p-3.5 rounded-xl transition cursor-pointer text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Desa Rejosari</span>
                <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-black uppercase">Operator</span>
              </div>
              <div className="mt-2 font-mono text-xs text-amber-300 group-hover:text-amber-200 font-semibold">operator@rejosari.go.id</div>
              <div className="font-mono text-xs text-slate-300 animate-none">Pass: operator123</div>
              <span className="text-[10px] text-slate-400 block mt-1 group-hover:text-white transition font-bold">⚡ Klik untuk auto-fill data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
