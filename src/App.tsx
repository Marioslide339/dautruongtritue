/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, getRandomQuestions } from './questions';
import WelcomeScreen from './components/WelcomeScreen';
import QuizSection from './components/QuizSection';
import ResultScreen from './components/ResultScreen';
import Leaderboard from './components/Leaderboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ApiConfigModal from './components/ApiConfigModal';
import { sound } from './audio';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'result' | 'leaderboard' | 'admin_login' | 'admin_dashboard'>('welcome');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Registration data
  const [fullName, setFullName] = useState(() => localStorage.getItem("primary_quiz_name") || "");
  const [className, setClassName] = useState(() => localStorage.getItem("primary_quiz_class") || "3A");
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem("primary_quiz_school") || "");
  
  // App configs
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem("primary_quiz_muted") === "true");

  // Game active states
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Keep audio module state updated
  useEffect(() => {
    sound.setMute(isMuted);
  }, [isMuted]);

  // Handle mutable operations
  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    localStorage.setItem("primary_quiz_muted", nextState ? "true" : "false");
  };

  const handleStartQuiz = (name: string, grade: string, school: string) => {
    // Save registration info
    setFullName(name);
    setClassName(grade);
    setSchoolName(school);
    localStorage.setItem("primary_quiz_name", name);
    localStorage.setItem("primary_quiz_class", grade);
    localStorage.setItem("primary_quiz_school", school);

    // Shuffle and pick random questions from the standard library
    const examQuestions = getRandomQuestions(15);
    setActiveQuestions(examQuestions);
    setScore(0);
    setTimeSpent(0);
    setScreen('quiz');
  };

  const handleQuizFinished = (finalScore: number, totalQs: number, duration: number) => {
    setScore(finalScore);
    setTimeSpent(duration);
    setScreen('result');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-between select-none pb-8">
      {/* Whimsical Pastel Floating Background Spheres */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-72 h-72 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[30%] left-[5%] w-60 h-60 bg-pink-100/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Educational Application Container */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-6 md:py-10 z-10">
        
        {/* Animated Main App Title Row and Settings Button */}
        {screen !== 'quiz' && (
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md py-2 px-4 rounded-full border border-slate-100 shadow-sm mx-auto sm:mx-0">
              <GraduationCap className="w-5 h-5 text-sky-500" />
              <span className="text-xs font-bold text-slate-600">Đấu Trường Trí Tuệ Tiểu Học</span>
            </div>

            <button 
              onClick={() => setIsApiModalOpen(true)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 py-2 px-4 rounded-full border border-rose-200 shadow-sm transition-all cursor-pointer group"
            >
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
              <span className="text-xs font-bold text-rose-500 group-hover:text-rose-600">
                Lấy API key để sử dụng app
              </span>
            </button>
          </header>
        )}

        {/* Screen Switch Router with Smooth Transitions */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {screen === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <WelcomeScreen
                  onStartQuiz={handleStartQuiz}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  onViewLeaderboard={() => setScreen('leaderboard')}
                  onAdminClick={() => setScreen('admin_login')}
                  highScore={null}
                />
              </motion.div>
            )}

            {screen === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <QuizSection
                  questions={activeQuestions}
                  fullName={fullName}
                  className={className}
                  schoolName={schoolName}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  onQuizFinished={handleQuizFinished}
                  onExitQuiz={() => setScreen('welcome')}
                />
              </motion.div>
            )}

            {screen === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ResultScreen
                  score={score}
                  totalQuestions={15}
                  timeSpent={timeSpent}
                  fullName={fullName}
                  className={className}
                  schoolName={schoolName}
                  onRestart={() => handleStartQuiz(fullName, className, schoolName)}
                  onGoToLeaderboard={() => setScreen('leaderboard')}
                  onSaveLocalLeaderboard={() => {}} // Legacy prop
                />
              </motion.div>
            )}

            {screen === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Leaderboard
                  onBack={() => setScreen('welcome')}
                />
              </motion.div>
            )}

            {screen === 'admin_login' && (
              <motion.div
                key="admin_login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <AdminLogin
                  onLoginSuccess={() => setScreen('admin_dashboard')}
                  onBack={() => setScreen('welcome')}
                />
              </motion.div>
            )}

            {screen === 'admin_dashboard' && (
              <motion.div
                key="admin_dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AdminDashboard
                  onLogout={() => setScreen('welcome')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Humble Footer */}
      <footer className="w-full text-center py-4 border-t border-slate-200/50 text-slate-400 text-xs mt-6 z-10 font-sans">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Đấu Trường Trí Tuệ • Giải pháp Công nghệ Giáo dục EdTech</p>
          <p className="font-semibold text-sky-400">Thiết kế đầy yêu thương dành cho bé yêu học tập tốt! 🌸</p>
        </div>
      </footer>
      {/* Modal Cấu hình API Key */}
      <ApiConfigModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
      />
    </div>
  );
}
