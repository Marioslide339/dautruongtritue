import React, { useState } from 'react';
import { Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../audio';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'Giaovien' && password === '123456') {
      sound.playCorrect();
      onLoginSuccess();
    } else {
      sound.playWrong();
      setError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex items-center justify-between pb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-sky-700 font-bold rounded-xl border border-slate-100 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl relative overflow-hidden bubble-shadow-md"
      >
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-slate-600 to-slate-800" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-slate-700" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Cổng Quản Trị</h2>
          <p className="text-sm text-slate-500 mt-1">Dành riêng cho Giáo viên & Quản trị viên</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600">
              Tài khoản đăng nhập
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản..."
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 transition-all font-semibold"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ĐĂNG NHẬP HỆ THỐNG</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
