import React, { useState } from 'react';
import { User, School, Sparkles, Trophy, HelpCircle, Volume2, VolumeX, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../audio';

interface WelcomeScreenProps {
  onStartQuiz: (fullName: string, className: string, schoolName: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onViewLeaderboard: () => void;
  onAdminClick: () => void;
  highScore: number | null;
}

export default function WelcomeScreen({
  onStartQuiz,
  isMuted,
  onToggleMute,
  onViewLeaderboard,
  onAdminClick,
  highScore
}: WelcomeScreenProps) {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('5A');
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState('');

  const gradeOptions = [
    "1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "5C", "Khác"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = fullName.trim();
    const trimmedSchool = schoolName.trim();

    if (!trimmedName) {
      setError('Bé yêu ơi, hãy điền đầy đủ Họ và tên của mình nhé! 💕');
      sound.playWrong();
      return;
    }
    if (trimmedName.length < 3) {
      setError('Bé ơi, Họ và tên phải có ít nhất 3 chữ cơ! Hãy viết đầy đủ nhé!');
      sound.playWrong();
      return;
    }
    if (!trimmedSchool) {
      setError('Bé hãy viết tên Trường tiểu học mà mình đang học nhé! 🏫');
      sound.playWrong();
      return;
    }

    sound.playCorrect();
    onStartQuiz(trimmedName, className, trimmedSchool);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top Banner with Logo and Whimsical Art */}
      <div className="text-center mb-8 relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-block relative mb-4"
        >
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center animate-bounce shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center animate-cartoon-bounce shadow-sm">
            <Trophy className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border-4 border-sky-400 shadow-lg text-6xl">
            🎒✨
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-sky-600 tracking-tight mb-2 drop-shadow-sm font-sans">
          Đấu Trường Trí Tuệ
        </h1>
        <p className="text-sm md:text-base text-sky-800 font-medium max-w-md mx-auto">
          Ứng dụng ôn tập trắc nghiệm sinh động, vui khỏe dành riêng cho ước mơ của học sinh tiểu học! 🌟
        </p>

        {highScore !== null && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100/90 text-yellow-800 border border-yellow-300 rounded-full text-xs font-bold shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Điểm cao nhất của máy bạn: {highScore}/15 đúng! ✨</span>
          </div>
        )}
      </div>

      {/* Primary Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-sky-100 p-6 md:p-8 shadow-xl relative overflow-hidden bubble-shadow-md"
      >
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-teal-400 via-sky-400 to-amber-400" />

        <div className="mb-6 bg-sky-50 text-sky-800 p-4 rounded-2xl text-xs sm:text-sm space-y-2 border border-sky-100">
          <p className="font-bold text-sky-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            Thể Lệ Đấu Trường:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Hệ thống lựa chọn ngẫu nhiên <strong>15 câu hỏi</strong> không trùng lặp từ kho 50 câu sinh động.</li>
            <li>Bao gồm các câu đố lý thú về <strong>Toán học 🔢, Tiếng Việt 📝, Khoa học 🌿, Địa lý 🗺️, Đố vui trí tuệ 💡</strong>.</li>
            <li>Không giới hạn thời gian làm bài, nhưng hãy giải thật nhanh để thăng tiến Bảng Báo Danh!</li>
            <li>Sau mỗi câu, bé sẽ nhận ngay phản hồi xem mình làm đúng hay chưa kèm giải thích chi tiết.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
            ✍️ Điền thông tin bé đăng ký thi
          </h3>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-600" htmlFor="full-name">
              Họ và tên của bé <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5 text-sky-400" />
              </span>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Minh Khang"
                className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-2xl bg-sky-50/20 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600" htmlFor="class-name">
                Chọn Lớp học <span className="text-rose-500">*</span>
              </label>
              <select
                id="class-name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="block w-full px-3 py-3 border border-sky-200 rounded-2xl bg-sky-50/20 text-gray-800 focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all font-semibold"
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    Lớp {grade}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-600" htmlFor="school-name">
                Tên trường TH học của bé <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <School className="w-5 h-5 text-sky-400" />
                </span>
                <input
                  id="school-name"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Ví dụ: Tiểu học Nguyễn Du"
                  className="block w-full pl-10 pr-3 py-3 border border-sky-200 rounded-2xl bg-sky-50/20 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center"
            >
              ⚠️ {error}
            </motion.p>
          )}

          {/* Buttons panel */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              id="btn-start"
              className="flex-1 py-4 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-extrabold text-lg rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-b-4 border-sky-600"
            >
              <span>BẮT ĐẦU THỬ THÁCH 🚀</span>
            </button>

            <button
              type="button"
              id="btn-view-leaderboard"
              onClick={onViewLeaderboard}
              className="px-6 py-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-bold rounded-2xl border border-yellow-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>Bảng Xếp Hạng</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Floating control buttons at the bottom of the card */}
      <div className="mt-4 flex justify-between items-center px-4">
        <button
          onClick={onToggleMute}
          className="flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-900 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 transition-colors cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-500" />
              <span>Bật âm thanh đố vui</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tắt âm thanh đố vui</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 bg-white/70 hover:bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Quản trị</span>
          </button>
          <p className="text-[10px] text-gray-400 font-mono">
            Phiên bản: v2.5.0 • EdTech Kids
          </p>
        </div>
      </div>
    </div>
  );
}
