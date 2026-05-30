import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Database, Settings, Plus, RefreshCw, BarChart, Sparkles, FileText, Upload, Trophy, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, Question } from '../questions';
import { getGlobalLeaderboard, uploadQuestionToFirebase } from '../firebase';
import { generateAiResponse } from '../gemini';
import Leaderboard from './Leaderboard';
import * as mammoth from 'mammoth';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard' | 'questions' | 'settings'>('stats');

  // Stats Data
  const [totalPlays, setTotalPlays] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isUploadingWord, setIsUploadingWord] = useState(false);

  // Questions Data
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    answerIndex: 0,
    category: CATEGORIES.THUOC_LA,
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
          category: CATEGORIES.THUOC_LA,
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
      const prompt = `Bạn là một giáo viên chuyên ra đề thi tiểu học. Hãy tạo MỘT câu hỏi trắc nghiệm thuộc chuyên đề "${newQuestion.category}" dành cho học sinh tiểu học (đặc biệt là lớp 3) về kỹ năng sống, tác hại của tệ nạn.
Yêu cầu định dạng JSON chính xác:
{
  "question": "Nội dung câu hỏi",
  "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  "answerIndex": 0, // Vị trí đáp án đúng (từ 0 đến 3)
  "explanation": "Lời giải thích ngắn gọn, dễ hiểu, động viên học sinh."
}
Chỉ trả về chuỗi JSON, không có định dạng markdown hay bất kỳ chữ nào khác.`;
      
      const response = await generateAiResponse(prompt);
      
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingWord(true);
    try {
      // 1. Read Word file using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      if (!text || text.trim().length === 0) {
        throw new Error("Không tìm thấy chữ trong file Word.");
      }

      // 2. Send to Gemini to extract questions
      const prompt = `Đây là nội dung bộ câu hỏi trắc nghiệm được trích xuất từ file Word của giáo viên:
"""
${text.substring(0, 5000)}
"""

Hãy đóng vai trò chuyên gia, bóc tách nội dung trên thành MỘT MẢNG (array) các đối tượng JSON chứa thông tin các câu hỏi.
Mỗi câu hỏi phải có các trường sau:
- "question": nội dung câu hỏi
- "options": mảng 4 chuỗi chứa 4 đáp án (không kèm chữ A, B, C, D ở đầu)
- "answerIndex": số nguyên (0, 1, 2, 3) chỉ ra đáp án đúng
- "category": chuỗi tên chuyên mục (có thể phân tích từ nội dung hoặc dùng chung "Kỹ năng Phòng tránh 🛡️")
- "explanation": lời giải thích (nếu trong đề không có, hãy tự sinh ra một lời giải thích ngắn gọn phù hợp).

CHỈ TRẢ VỀ CHUỖI JSON CHỨA MẢNG (ARRAY), không có markdown, không có text nào khác. Ví dụ:
[
  { "question": "...", "options": ["...", "...", "...", "..."], "answerIndex": 0, "category": "Kỹ năng Phòng tránh 🛡️", "explanation": "..." }
]`;

      const response = await generateAiResponse(prompt);
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedArray = JSON.parse(cleanJson);

      if (!Array.isArray(parsedArray)) {
        throw new Error("Dữ liệu trả về không phải là mảng câu hỏi.");
      }

      // 3. Upload them to Firebase sequentially
      let successCount = 0;
      for (const q of parsedArray) {
        if (q.question && q.options && q.options.length === 4) {
          const id = await uploadQuestionToFirebase(q);
          if (id) successCount++;
        }
      }

      alert(`Đã xử lý file Word thành công! Tải lên được ${successCount}/${parsedArray.length} câu hỏi vào kho dữ liệu.`);
      // Reset input
      e.target.value = '';

    } catch (err: any) {
      console.error(err);
      alert('Lỗi khi đọc file Word hoặc xử lý AI: ' + (err.message || err));
    } finally {
      setIsUploadingWord(false);
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
            onClick={() => setActiveTab('leaderboard')}
            className={`p-4 rounded-2xl text-left font-bold text-sm transition-all flex items-center gap-3 ${
              activeTab === 'leaderboard' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <Trophy className="w-5 h-5" /> Bảng xếp hạng chung
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
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-lg p-6 min-h-[500px] overflow-hidden">
          
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

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Embed Leaderboard without the back button */}
              <div className="mt-[-20px] scale-[0.95] origin-top">
                <Leaderboard />
              </div>
            </motion.div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Thêm Câu Hỏi Mới</h3>
              </div>

              {/* Upload Word Section */}
              <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl mb-6">
                <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Đọc Đề Từ File Word
                </h4>
                <p className="text-xs text-indigo-600 mb-4">Tải lên file .docx (Word) chứa các câu hỏi trắc nghiệm. AI sẽ tự động đọc, bóc tách và đẩy lên hệ thống!</p>
                <label className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer transition-colors">
                  {isUploadingWord ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  <span>{isUploadingWord ? "Đang xử lý bằng AI..." : "Chọn file Word (.docx)"}</span>
                  <input type="file" accept=".docx" className="hidden" onChange={handleFileUpload} disabled={isUploadingWord} />
                </label>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-700">Hoặc Thêm Thủ Công</h4>
                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isGeneratingAi}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isGeneratingAi ? 'Đang tạo bằng AI...' : 'AI tự nghĩ 1 câu'}</span>
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
                    placeholder="Ví dụ: Thuốc lá có tác hại gì?"
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
              
              <div className="bg-sky-50 border border-sky-200 p-5 rounded-xl space-y-3">
                <h4 className="font-bold text-sky-800 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Hướng dẫn kết nối dữ liệu Online toàn quốc
                </h4>
                <p className="text-sm text-sky-700 leading-relaxed">
                  Ứng dụng này đã được cấu hình với cơ sở dữ liệu đám mây Firebase. Mọi lượt chơi từ bất kỳ học sinh nào trên toàn quốc đều được tự động lưu về một "Bảng Vàng Ghi Danh" chung.
                </p>
                <div className="bg-white p-4 rounded-lg border border-sky-100 mt-2">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Để lan tỏa cuộc thi, Thầy/Cô chỉ cần:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600">
                    <li>Đảm bảo ứng dụng đã được đẩy (deploy) lên Vercel thành công.</li>
                    <li>Copy đường link trang web của ứng dụng (ví dụ: <code className="bg-slate-100 text-rose-500 px-1 py-0.5 rounded">https://dautruong-tritue.vercel.app</code>)</li>
                    <li>Gửi link đó vào nhóm Zalo lớp hoặc Fanpage của trường.</li>
                    <li>Học sinh bấm vào link là có thể thi ngay trên điện thoại hoặc máy tính mà không cần cài đặt. Điểm số sẽ tự động nhảy vào Bảng xếp hạng!</li>
                  </ol>
                </div>
              </div>

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
