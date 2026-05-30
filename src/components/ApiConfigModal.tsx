import React, { useState, useEffect } from 'react';
import { Settings, Key, X, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AI_MODELS, AiModel } from '../gemini';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiConfigModal({ isOpen, onClose }: ApiConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<AiModel>(AI_MODELS[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('gemini_api_key') || '');
      const savedModel = localStorage.getItem('gemini_selected_model') as AiModel;
      if (savedModel && AI_MODELS.includes(savedModel)) {
        setSelectedModel(savedModel);
      }
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_selected_model', selectedModel);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="p-6 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-sky-600" />
              Thiết lập Hệ thống AI
            </h2>
            <p className="text-xs text-slate-500 mt-1">Cấu hình kết nối Gemini API để sử dụng tính năng thông minh.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              Mã API Key (Gemini) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all font-mono text-sm"
              />
            </div>
            <a 
              href="https://aistudio.google.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-bold"
            >
              Nhấn vào đây để lấy API Key miễn phí <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              Lựa chọn Model AI (Mô hình ngôn ngữ)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {AI_MODELS.map((model) => (
                <label 
                  key={model} 
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedModel === model ? 'bg-sky-50 border-sky-400 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="ai_model"
                    value={model}
                    checked={selectedModel === model}
                    onChange={() => setSelectedModel(model as AiModel)}
                    className="w-4 h-4 text-sky-600 border-slate-300 focus:ring-sky-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-slate-800">
                      {model} {model === 'gemini-3-flash-preview' && '(Mặc định)'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-md transition-all active:scale-95"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Đã lưu cấu hình!</span>
                </>
              ) : (
                <span>Lưu Cài Đặt</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
