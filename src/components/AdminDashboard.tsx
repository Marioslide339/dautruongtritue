import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Database, Settings, Plus, Save, RefreshCw, BarChart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, Question } from '../questions';
import { getGlobalLeaderboard, uploadQuestionToFirebase } from '../firebase';
import { generateAiResponse } from '../gemini';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'stats' | 'settings'>('stats');

  // Stats Data
  const [totalPlays, setTotalPlays] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Questions Data (Local Mocking for now, can be extended to Firebase)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    answerIndex: 0,
    category: CATEGORIES.TOAN,
    explanation: ''
  });

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const entries = await getGlobalLeaderboard();
      setTotalPlays(entries.length);
      if (entries.length > 0) {
        const totalScore = entries.reduce((acc, curr) => acc + curr.score, 0);
        setAvgScore(Number((totalScore / entries.length).toFixed(1)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await uploadQuestionToFirebase(newQuestion);
      if (id) {
        alert('Đã tải câu hỏi lên Ngân hàng câu hỏi (Firebase) thành công!');
        setNewQuestion({
          question: '',
          options: ['', '', '', ''],
          answerIndex: 0,
          category: CATEGORIES.TOAN,
          explanation: ''
        });
      } else {
        alert('Có lỗi xảy ra hoặc Firebase chưa được cấu hình.');
      }
    } catch (e) {
      alert('Lỗi: ' + e);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || [])];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleGenerateWithAi = async () => {
    setIsGeneratingAi(true);
    try {
      const prompt = `Bạn là một giáo viên chuyên ra đề thi tiểu học. Hãy tạo MỘT câu hỏi trắc nghiệm thuộc chuyên đề "${newQuestion.category}" dành cho học sinh tiểu học (lớp 1 - lớp 5).
Yêu cầu định dạng JSON chính xác:
{
  "question": "Nội dung câu hỏi",
  "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  "answerIndex": 0, // Vị trí đáp án đúng (từ 0 đến 3)
  "explanation": "Lời giải thích ngắn gọn, dễ hiểu, động viên học sinh."
}
Chỉ trả về chuỗi JSON, không có định dạng markdown hay bất kỳ chữ nào khác.`;
      
      const response = await generateAiResponse(prompt);
      
      // Clean json string if wrapped in markdown
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      setNewQuestion({
        ...newQuestion,
        question: parsed.question,
        options: parsed.options,
        answerIndex: parsed.answerIndex,
        explanation: parsed.explanation
      });
      alert('AI đã tạo câu hỏi thành công! Bạn có thể chỉnh sửa lại trước khi lưu.');
    } catch (e: any) {
      alert(e.message || 'Lỗi khi gọi AI');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Bảng Điều Khiển Giáo Viên</h2>
            <p className="text-xs font-semibold text-emerald-600">Đang đăng nhập: Giaovien</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-100 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="md:w-64 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`p-4 rounded-2xl text-left font-bold text-sm transition-all flex items-center gap-3 ${
              activeTab === 'stats' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <BarChart className="w-5 h-5" /> Tổng quan số liệu
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`p-4 rounded-2xl text-left font-bold text-sm transition-all flex items-center gap-3 ${
              activeTab === 'questions' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Database className="w-5 h-5" /> Ngân hàng câu hỏi
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-4 rounded-2xl text-left font-bold text-sm transition-all flex items-center gap-3 ${
              activeTab === 'settings' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" /> Cài đặt hệ thống
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-lg p-6 min-h-[500px]">
          
          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Thống Kê Ứng Dụng</h3>
                <button onClick={fetchStats} className="text-sky-600 hover:text-sky-800 p-2"><RefreshCw className={`w-5 h-5 ${loadingStats ? 'animate-spin' : ''}`} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl">
                  <p className="text-sky-800 font-bold mb-1">Tổng lượt hoàn thành</p>
                  <p className="text-4xl font-black text-sky-600">{totalPlays}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                  <p className="text-emerald-800 font-bold mb-1">Điểm trung bình (trên 15)</p>
                  <p className="text-4xl font-black text-emerald-600">{avgScore}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Thêm Câu Hỏi Mới</h3>
                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isGeneratingAi ? 'Đang tạo bằng AI...' : 'Tạo tự động bằng AI'}</span>
                </button>
              </div>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Chuyên mục</label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-sm"
                  >
                    {Object.values(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nội dung câu hỏi</label>
                  <textarea
                    required
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-sm h-24 resize-none"
                    placeholder="Ví dụ: 1 + 1 bằng mấy?"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={newQuestion.answerIndex === i}
                          onChange={() => setNewQuestion({ ...newQuestion, answerIndex: i })}
                          className="w-4 h-4 text-sky-600"
                        />
                        Đáp án {i + 1} {newQuestion.answerIndex === i && "(Đáp án đúng)"}
                      </label>
                      <input
                        required
                        type="text"
                        value={newQuestion.options?.[i] || ''}
                        onChange={(e) => updateOption(i, e.target.value)}
                        className={`w-full p-3 border rounded-xl font-semibold text-sm ${newQuestion.answerIndex === i ? 'bg-sky-50 border-sky-300' : 'bg-slate-50 border-slate-200'}`}
                        placeholder={`Lựa chọn ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Giải thích (Hiển thị khi học sinh trả lời)</label>
                  <textarea
                    required
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-sm h-20 resize-none"
                    placeholder="Giải thích vì sao đáp án đó đúng..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5" /> Tải lên Ngân hàng câu hỏi
                </button>
              </form>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800">Cài đặt Hệ thống</h3>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
                <p className="font-bold mb-1">Khu vực đang phát triển</p>
                <p>Các cài đặt nâng cao như tùy chỉnh giao diện, xuất file Excel sẽ được cập nhật trong phiên bản tiếp theo.</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
