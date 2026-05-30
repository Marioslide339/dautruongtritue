import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Search, Settings, CloudLightning, RefreshCw, Trash2, ArrowLeft, ShieldAlert, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { LeaderboardEntry } from '../questions';
import { getGlobalLeaderboard } from '../firebase';
import { sound } from '../audio';

interface LeaderboardProps {
  localEntries: LeaderboardEntry[];
  onClearLocalLeaderboard: () => void;
  onBack: () => void;
}

export default function Leaderboard({
  localEntries,
  onClearLocalLeaderboard,
  onBack
}: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'local' | 'cloud'>('local');
  const [cloudEntries, setCloudEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudError, setCloudError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real-time cloud entries from Firebase
  const fetchCloudData = async () => {
    setLoadingCloud(true);
    setCloudError('');
    try {
      const entries = await getGlobalLeaderboard();
      if (entries && entries.length > 0) {
        setCloudEntries(entries);
        sound.playCorrect();
      } else {
        setCloudError('Chưa có dữ liệu trên bảng xếp hạng toàn cầu hoặc chưa cấu hình Firebase. Hãy là người đầu tiên! 🌟');
      }
    } catch (err: any) {
      console.error(err);
      setCloudError(`Không thể lấy dữ liệu: ${err.message || err}. Hãy đảm bảo Firebase được cấu hình đúng!`);
      sound.playWrong();
    } finally {
      setLoadingCloud(false);
    }
  };

  // Auto-fetch cloud data on mount or when tab transitions
  useEffect(() => {
    if (activeTab === 'cloud') {
      fetchCloudData();
    }
  }, [activeTab]);

  // Combine and sort leaderboard items: Score DESC, TimeSpent ASC
  const getSortedList = () => {
    const rawList = activeTab === 'local' ? localEntries : cloudEntries;
    
    // Sort logic
    const sorted = [...rawList].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score ranks first
      }
      return a.timeSpent - b.timeSpent; // Faster time wins ties!
    });

    // Apply search filter
    if (!searchTerm.trim()) return sorted;
    return sorted.filter(
      item => 
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const results = getSortedList();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-sky-700 font-bold rounded-xl border border-slate-100 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </button>

        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          🏆 BẢNG BÀO DANH VÀNG
        </h2>
      </div>

      {/* Tabs list selecting Local or Google Sheets cloud data */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-xs flex gap-2">
        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-3 px-4 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'local'
              ? 'bg-sky-400 text-white shadow-md'
              : 'text-gray-500 hover:bg-slate-50 hover:text-gray-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Xếp hạng cục bộ (Máy này)</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex-1 py-3 px-4 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'cloud'
              ? 'bg-sky-400 text-white shadow-md'
              : 'text-gray-500 hover:bg-slate-50 hover:text-gray-800'
          }`}
        >
          <CloudLightning className="w-4 h-4" />
          <span>Bảng Đám Mây (Firebase)</span>
        </button>
      </div>

      {/* Leaderboard content board */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl relative overflow-hidden bubble-shadow-md">
        
        {/* Search input bar */}
        <div className="relative mb-5">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo học tên, lớp hoặc trường của bé..."
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all text-gray-800 placeholder-gray-400 font-semibold"
          />
        </div>

        {activeTab === 'cloud' && (
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-between bg-sky-50/70 border border-sky-100 p-3.5 rounded-2xl text-xs sm:text-sm">
            <span className="text-sky-800 font-bold flex items-center gap-1">
              <CloudLightning className="w-4 h-4" />
              <span>Nguồn cấp: Hệ thống dữ liệu toàn cầu (Firebase)</span>
            </span>
            <button
              onClick={fetchCloudData}
              disabled={loadingCloud}
              className="px-3.5 py-1.5 bg-sky-400 hover:bg-sky-500 text-white font-extrabold rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer text-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingCloud ? 'animate-spin' : ''}`} />
              <span>{loadingCloud ? 'Đang tải đám mây...' : 'Tải lại dữ liệu'}</span>
            </button>
          </div>
        )}

        {/* Loading / Error States for Cloud */}
        {activeTab === 'cloud' && loadingCloud && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-gray-400">Đang đồng bộ dữ liệu từ hệ thống toàn cầu...</p>
          </div>
        )}

        {activeTab === 'cloud' && cloudError && !loadingCloud && (
          <div className="py-10 text-center max-w-md mx-auto space-y-3 text-amber-800">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
            <p className="text-sm font-extrabold">Kết nối chưa sẵn sàng!</p>
            <p className="text-xs text-gray-500 leading-relaxed">{cloudError}</p>
          </div>
        )}

        {/* Dynamic score lines table */}
        {(!loadingCloud || activeTab === 'local') && (
          <div className="overflow-x-auto">
            {results.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Trophy className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm font-bold">Chưa tìm thấy sĩ tử nào ghi danh!</p>
                <p className="text-xs max-w-xs mx-auto">Vượt qua các câu hỏi lý thú ngay lập tức để khắc ghi tên mình lên bảng xếp hạng đầu tiên!</p>
              </div>
            ) : (
              <table className="min-w-full text-left font-sans">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 text-center w-14">Hạng</th>
                    <th className="pb-3 text-left">Họ và Tên</th>
                    <th className="pb-3 text-center pl-2">Lớp</th>
                    <th className="pb-3 text-left hidden sm:table-cell pl-4">Trường</th>
                    <th className="pb-3 text-center">Số câu đúng</th>
                    <th className="pb-3 text-center">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-sm text-gray-700">
                  {results.slice(0, 100).map((item, index) => {
                    const rank = index + 1;
                    
                    // High-quality podium medals
                    let medalBadge = <span className="font-bold text-slate-500">{rank}</span>;
                    let rowBg = "hover:bg-slate-50/50";

                    if (rank === 1) {
                      medalBadge = <span className="flex items-center justify-center w-7 h-7 bg-amber-100 border border-amber-300 rounded-full text-sm shadow-sm animate-cartoon-bounce">🥇</span>;
                      rowBg = "bg-amber-50/20 hover:bg-amber-50/40";
                    } else if (rank === 2) {
                      medalBadge = <span className="flex items-center justify-center w-7 h-7 bg-slate-100 border border-slate-300 rounded-full text-sm shadow-sm">🥈</span>;
                      rowBg = "bg-slate-50/20 hover:bg-slate-50/40";
                    } else if (rank === 3) {
                      medalBadge = <span className="flex items-center justify-center w-7 h-7 bg-orange-100 border border-orange-300 rounded-full text-sm shadow-sm">🥉</span>;
                      rowBg = "bg-orange-50/10 hover:bg-orange-50/20";
                    }

                    return (
                      <tr key={item.id || index} className={`transition-colors ${rowBg}`}>
                        <td className="py-3.5 text-center">{medalBadge}</td>
                        <td className="py-3.5 pr-2">
                          <p className="font-extrabold text-slate-800 text-sm">{item.fullName}</p>
                          <span className="text-[10px] text-gray-400 block sm:hidden">
                            Trường: {item.schoolName}
                          </span>
                        </td>
                        <td className="py-3.5 text-center font-bold text-sky-600 pl-2">
                          {item.className}
                        </td>
                        <td className="py-3.5 text-left hidden sm:table-cell text-gray-500 pl-4">
                          {item.schoolName}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                            {item.score}/15 đúng
                          </span>
                        </td>
                        <td className="py-3.5 text-center font-mono text-xs text-gray-500">
                          {formatTime(item.timeSpent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Clear leaderboard option for local scores */}
        {activeTab === 'local' && localEntries.length > 0 && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                if (window.confirm("Bé/Thầy cô có chắc chắn muốn xóa sạch bảng danh sách điểm số cục bộ trên máy tính này không? Hành động này không thể hoàn tác đâu nhé!")) {
                  onClearLocalLeaderboard();
                  sound.playWrong();
                }
              }}
              className="text-xs text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa sạch danh sách máy này</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl relative overflow-hidden bubble-shadow-md">
        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-3">
          ☁️ CẤU HÌNH LIÊN KẾT ĐÁM MÂY
        </h3>
        <p className="text-sm text-gray-600">
          Hệ thống hiện đang sử dụng Firebase để quản lý Bảng xếp hạng trực tuyến. Vui lòng cập nhật các biến môi trường <code>VITE_FIREBASE_*</code> trong file <code>.env.local</code> và khởi động lại ứng dụng để kích hoạt tính năng này.
        </p>
      </div>
    </div>
  );
}
