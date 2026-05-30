import React, { useState } from 'react';
import { Trophy, Clock, RefreshCw, Send, CheckCircle, AlertCircle, Bookmark, Star, ArrowRight, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../audio';

import { submitToGlobalLeaderboard } from '../firebase';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  fullName: string;
  className: string;
  schoolName: string;
  onRestart: () => void;
  onGoToLeaderboard: () => void;
  onSaveLocalLeaderboard?: (entry: any) => void; // Legacy prop
}

export default function ResultScreen({
  score,
  totalQuestions,
  timeSpent,
  fullName,
  className,
  schoolName,
  onRestart,
  onGoToLeaderboard,
  onSaveLocalLeaderboard
}: ResultScreenProps) {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  // Evaluate performance to award custom badges for primary school students (Ages 6-11)
  const getEvaluation = () => {
    const ratio = score / totalQuestions;
    if (ratio >= 0.9) return {
      title: "🥇 TRẠNG NGUYÊN HOÀNG KIM",
      color: "text-amber-500",
      bg: "bg-amber-50 border-amber-200",
      message: "Xuất chúng! Bé đã trả lời đúng gần như tuyệt đối các câu đố hiểm hóc. Bé quả là Trạng Nguyên tương lai tài ba của tổ quốc! 🌟🌟🌟",
      emoji: "👑"
    };
    if (ratio >= 0.7) return {
      title: "🥈 THẦN ĐỒNG THÔNG THÁI",
      color: "text-blue-500",
      bg: "bg-blue-50 border-blue-200",
      message: "Quá cừ khôi! Điểm số xuất sắc phản ánh sự tập trung và hiểu biết rất rộng của bé. Hãy tiếp tục học giỏi nha! 🚀📚",
      emoji: "💡"
    };
    if (ratio >= 0.5) return {
      title: "🥉 TÀI NĂNG TRIỂN VỌNG",
      color: "text-emerald-500",
      bg: "bg-emerald-50 border-emerald-200",
      message: "Bé làm rất tốt! Bé nắm bài vô cùng vững vàng và biết tư duy nhạy bén. Hãy luyện tập nhiều hơn nữa để đạt thứ hạng cao hơn nha! 🌱",
      emoji: "🎨"
    };
    return {
      title: "🎖️ CHIẾN BINH BỀN BỈ",
      color: "text-violet-500",
      bg: "bg-violet-50 border-violet-200",
      message: "Cố lên bé nhé! Đừng nản lòng vì mỗi câu sai đều mang lại bài học quý giá mới. Chắc chắn lần sau bé sẽ làm xuất sắc hơn! ❤️💪",
      emoji: "🛡️"
    };
  };

  const evalInfo = getEvaluation();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  // Submit to Firebase
  const handleSyncToFirebase = async () => {
    setSyncStatus('loading');
    setSyncMessage('Đang truyền điểm của bé lên hệ thống toàn cầu... 📡');

    try {
      const payload = {
        fullName,
        className,
        schoolName,
        score,
        timeSpent,
        timestamp: new Date().toISOString()
      };

      const docId = await submitToGlobalLeaderboard(payload);

      if (docId) {
        setSyncStatus('success');
        setSyncMessage('🎉 Đồng bộ hóa thành công lên Bảng Xếp Hạng Toàn Cầu (Firebase)!');
        sound.playVictory();
      } else {
        throw new Error("Không thể lưu vào Firebase (kiểm tra cấu hình).");
      }
    } catch (error: any) {
      console.error('Firebase error:', error);
      setSyncStatus('error');
      setSyncMessage(`Không thể liên kết qua internet: ${error.message || error}. Tuy nhiên điểm số đã được tự động lưu tủ kính cục bộ!`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      {/* Decorative Fireworks CONFETTI Confetti Elements */}
      <div className="relative overflow-visible">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          className="inline-block py-5 px-6 rounded-full bg-yellow-100 border-2 border-yellow-300 text-6xl shadow-sm animate-cartoon-bounce mb-3"
        >
          {evalInfo.emoji}
        </motion.div>

        {/* Floating Stars particles effect */}
        <div className="absolute top-0 left-10 text-xl animate-pulse text-amber-400">⭐</div>
        <div className="absolute top-10 right-10 text-2xl animate-bounce text-pink-400">✨</div>
        <div className="absolute bottom-5 left-16 text-lg animate-pulse text-emerald-400">🎨</div>
        <div className="absolute -bottom-2 right-20 text-xl animate-bounce text-sky-400">🎈</div>

        <h1 className="text-3xl font-extrabold text-slate-800">
          CHÚC MỪNG BÉ HOÀN THÀNH VÒNG THI! 🎉
        </h1>
        <p className="text-sm text-gray-500">
          Hãy cùng ngắm nhìn thành tích đáng tự hào của bé nhé!
        </p>
      </div>

      {/* Main Score Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl relative overflow-hidden bubble-shadow-md text-left"
      >
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-teal-400 via-sky-400 to-amber-400" />

        {/* Student personal summary */}
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800">{fullName}</h3>
          <p className="text-xs text-sky-700 bg-sky-50 inline-block px-3 py-1 rounded-full font-bold mt-1">
            Lớp {className} • Trường {schoolName}
          </p>
        </div>

        {/* Score & Time Indicators (Bento Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              🎯
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Số câu trả lời đúng</p>
              <p className="text-2xl font-extrabold text-sky-700">{score} / {totalQuestions} câu</p>
            </div>
          </div>

          <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              ⏱️
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Thời gian hoàn thành</p>
              <p className="text-2xl font-extrabold text-orange-700">{formatTime(timeSpent)}</p>
            </div>
          </div>
        </div>

        {/* Motivational assessment sticker */}
        <div className={`mt-6 p-5 rounded-2xl border ${evalInfo.bg} space-y-2`}>
          <h4 className={`text-lg font-extrabold ${evalInfo.color} flex items-center gap-1.5`}>
            <span>Danh Hiệu:</span>
            <span>{evalInfo.title}</span>
          </h4>
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            {evalInfo.message}
          </p>
        </div>

        {/* Action synchronization status display */}
        {syncStatus !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-2xl border text-sm flex gap-3 ${
              syncStatus === 'loading' ? 'bg-sky-50 border-sky-200 text-sky-800' :
              syncStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
              'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {syncStatus === 'loading' && <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
            {syncStatus === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
            {syncStatus === 'error' && <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
            <span className="font-semibold">{syncMessage}</span>
          </motion.div>
        )}

        {/* Submit scores button panel */}
        <div className="mt-8 flex flex-col md:flex-row gap-3">
          {syncStatus !== 'success' ? (
            <button
              onClick={handleSyncToFirebase}
              disabled={syncStatus === 'loading'}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-emerald-600 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
              <span>{syncStatus === 'loading' ? 'Đang gửi điểm số...' : 'Lưu điểm & Gửi lên lớp học 🚀'}</span>
            </button>
          ) : (
            <button
              onClick={onGoToLeaderboard}
              className="flex-1 py-4 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-sky-600 cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              <span>Xem Bảng Xếp Hạng Vàng 👑</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-2xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
            <span>Thi Lượt Mới 🔄</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
