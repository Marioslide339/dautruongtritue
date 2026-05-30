import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Clock, Volume2, VolumeX, ChevronRight, XCircle, ArrowLeft, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../questions';
import { sound } from '../audio';
import { generateAiResponse } from '../gemini';

interface QuizSectionProps {
  questions: Question[];
  fullName: string;
  className: string;
  schoolName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onQuizFinished: (score: number, totalQuestions: number, timeSpent: number) => void;
  onExitQuiz: () => void;
}

export default function QuizSection({
  questions,
  fullName,
  className,
  schoolName,
  isMuted,
  onToggleMute,
  onQuizFinished,
  onExitQuiz
}: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  
  // Array tracking results for indicator: 'correct' | 'incorrect' | null
  const [resultsTracker, setResultsTracker] = useState<( 'correct' | 'incorrect' | null )[]>(
    Array(questions.length).fill(null)
  );

  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // AI Tutor state
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  // Motivational phrases
  const successPraise = [
    "Oa! Bé giỏi quá trời luôn! ⭐",
    "Tuyệt cú mèo! Đúng chóc luôn nè! 🏆",
    "Chính xác! Bé thông minh ghê á! 🎉",
    "Tuyệt vời ông mặt trời! Tiếp tục phát huy nha! ☀️",
    "Đỉnh của chóp! Câu trả lời hoàn hảo! 🚀"
  ];

  const skipEncourage = [
    "Tiếc một xíu thôi, cố lên ở câu sau nha! 💪",
    "Không sao cả đâu, vấp ngã là mẹ thành công mà! ❤️",
    "Cận kề rồi nè! Hãy bình tĩnh làm câu tiếp nhé! ✨",
    "Bé học thêm được một điều mới rồi đó! Cố lên! 🌿",
    "Ôi suýt trúng rồi! Đọc kỹ giải thích phía dưới nha!"
  ];

  const [praiseText, setPraiseText] = useState("");

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return; // Prevent multiple clicks

    setSelectedAnswerIndex(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.answerIndex;

    const newResults = [...resultsTracker];
    if (isCorrect) {
      setScore((prev) => prev + 1);
      newResults[currentIndex] = 'correct';
      setPraiseText(successPraise[Math.floor(Math.random() * successPraise.length)]);
      sound.playCorrect();
    } else {
      newResults[currentIndex] = 'incorrect';
      setPraiseText(skipEncourage[Math.floor(Math.random() * skipEncourage.length)]);
      sound.playWrong();
    }
    setResultsTracker(newResults);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
      setPraiseText("");
      setAiExplanation("");
    } else {
      // Quiz finished! Stop timer and pass data
      if (timerRef.current) clearInterval(timerRef.current);
      sound.playVictory();
      onQuizFinished(score, questions.length, elapsedTime);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper for dynamic category color scheme
  const getCategoryTheme = (category: string) => {
    if (category.includes("Toán")) return "from-pink-400 to-rose-500 bg-rose-50 text-rose-700 border-rose-200";
    if (category.includes("Tiếng Việt")) return "from-amber-400 to-orange-500 bg-amber-50 text-amber-700 border-amber-200";
    if (category.includes("Khoa học")) return "from-emerald-400 to-teal-500 bg-emerald-50 text-emerald-700 border-emerald-200";
    if (category.includes("Lịch sử")) return "from-violet-400 to-purple-500 bg-violet-50 text-violet-700 border-violet-200";
    return "from-sky-400 to-blue-500 bg-sky-50 text-sky-700 border-sky-200";
  };

  const handleAskAi = async () => {
    if (selectedAnswerIndex === null) return;
    setIsAiExplaining(true);
    setAiExplanation("");
    try {
      const prompt = `Học sinh tiểu học vừa trả lời sai một câu hỏi ${currentQuestion.category}.
Câu hỏi: ${currentQuestion.question}
Các đáp án: ${currentQuestion.options.join(', ')}
Đáp án học sinh chọn: ${currentQuestion.options[selectedAnswerIndex]}
Đáp án đúng: ${currentQuestion.options[currentQuestion.answerIndex]}
Lời giải thích hiện tại: ${currentQuestion.explanation}

Hãy đóng vai một gia sư thân thiện, giảng giải lại cho học sinh vì sao em ấy chọn sai và vì sao đáp án đúng lại là đáp án kia một cách dễ hiểu, sinh động, ngôn từ phù hợp với trẻ em. Khuyến khích em ấy cố gắng hơn. Giữ câu trả lời ngắn gọn dưới 4-5 câu.`;
      
      const response = await generateAiResponse(prompt);
      setAiExplanation(response);
    } catch (e: any) {
      setAiExplanation('Gia sư AI đang mệt một chút, bé hãy đọc lời giải thích của thầy cô ở trên nhé! Lỗi: ' + e.message);
    } finally {
      setIsAiExplaining(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Quiz Dashboard Top Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (window.confirm("Bé có chắc chắn muốn thoát khỏi vòng thi này không? Kết quả sẽ không được lưu đâu nhé!")) {
                onExitQuiz();
              }
            }}
            className="p-2 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
            title="Thoát đấu trường"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h4 className="font-bold text-gray-800 text-sm leading-tight flex items-center gap-1">
              <span>Sĩ tử:</span>
              <span className="text-sky-600">{fullName}</span>
            </h4>
            <p className="text-[11px] text-gray-400">
              Lớp {className} • {schoolName}
            </p>
          </div>
        </div>

        {/* Dynamic score tracker and timer */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 text-sky-800 rounded-xl font-bold text-xs sm:text-sm border border-sky-100">
            🏆 Đúng: {score}/{currentIndex + (isAnswered ? 1 : 0)}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-800 rounded-xl font-bold text-xs sm:text-sm border border-orange-100">
            <Clock className="w-4 h-4 text-orange-500 animate-spin-slow" />
            <span>{formatTime(elapsedTime)}</span>
          </span>
          <button
            onClick={onToggleMute}
            className="p-2 hover:bg-slate-100 text-gray-500 rounded-xl transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Progress Dots / Circles Grid */}
      <div className="bg-white/60 p-3 rounded-2xl border border-slate-100 flex flex-wrap gap-2 justify-center shadow-xs">
        {questions.map((_, idx) => {
          const state = resultsTracker[idx];
          const isCurrent = idx === currentIndex;
          
          let circleBg = "bg-slate-200 border-slate-300 text-slate-500";
          if (isCurrent) {
            circleBg = "bg-sky-400 border-sky-500 text-white scale-110 ring-4 ring-sky-200 font-bold";
          } else if (state === 'correct') {
            circleBg = "bg-emerald-400 border-emerald-500 text-white font-bold";
          } else if (state === 'incorrect') {
            circleBg = "bg-rose-400 border-rose-500 text-white font-bold";
          }

          return (
            <div
              key={idx}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-xs transition-all duration-300 ${circleBg}`}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {/* Main Question Card wrapper */}
      <motion.div 
        key={currentIndex}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -30, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-lg relative overflow-hidden bubble-shadow-md"
      >
        {/* Whimsical colored indicator line on top matching category */}
        <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${getCategoryTheme(currentQuestion.category).split(" ").slice(0, 2).join(" ")}`} />

        {/* Category sticker */}
        <div className="mb-4">
          <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold border ${getCategoryTheme(currentQuestion.category).split(" ").slice(2).join(" ")} animate-cartoon-bounce`}>
            {currentQuestion.category}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug mb-6 font-sans">
          CÂU {currentIndex + 1}: {currentQuestion.question}
        </h2>

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswerIndex === idx;
            const isCorectAns = currentQuestion.answerIndex === idx;
            const hasChosenThis = isAnswered && isSelected;

            let buttonStyle = "border-slate-200 bg-slate-50/50 text-gray-800 hover:border-sky-300 hover:bg-sky-50/20 active:scale-98";
            
            if (isAnswered) {
              if (isCorectAns) {
                buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold ring-4 ring-emerald-100";
              } else if (hasChosenThis) {
                buttonStyle = "border-rose-500 bg-rose-50 text-rose-800 font-extrabold ring-4 ring-rose-100";
              } else {
                buttonStyle = "border-slate-100 bg-slate-50/10 text-gray-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 text-left rounded-2xl border-2 text-base transition-all font-semibold flex items-start gap-3 cursor-pointer ${buttonStyle}`}
              >
                {/* Visual Label A, B, C, D */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                  hasChosenThis && isCorectAns ? "bg-emerald-500 text-white" :
                  hasChosenThis ? "bg-rose-500 text-white" :
                  "bg-slate-200 text-slate-700"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="pt-0.5">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Answer feedback panel */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 border-t border-slate-100 pt-5 space-y-4"
            >
              <div className={`p-4 rounded-2xl flex gap-3 ${
                selectedAnswerIndex === currentQuestion.answerIndex 
                  ? "bg-emerald-50/70 border border-emerald-200 text-emerald-900" 
                  : "bg-rose-50/70 border border-rose-200 text-rose-900"
              }`}>
                {selectedAnswerIndex === currentQuestion.answerIndex ? (
                  <Sparkles className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5 animate-spin-slow" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5 animate-bounce" />
                )}
                <div>
                  <h4 className="font-extrabold text-base mb-1 animate-laugh">
                    {praiseText}
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1 bg-white/70 p-3 rounded-xl border border-slate-100 shadow-xs">
                    <p className="font-bold text-gray-800 flex items-center gap-1 text-[13px]">
                      <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-100" />
                      Giải thích khoa học của thầy cô:
                    </p>
                    <p className="leading-relaxed font-medium">{currentQuestion.explanation}</p>
                    
                    {/* Gia Sư AI Feature */}
                    {selectedAnswerIndex !== currentQuestion.answerIndex && (
                      <div className="mt-4 pt-3 border-t border-rose-200/50">
                        {!aiExplanation && !isAiExplaining && (
                          <button
                            onClick={handleAskAi}
                            className="text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-sky-500" />
                            Nhờ Gia Sư AI giải thích thêm
                          </button>
                        )}
                        {isAiExplaining && (
                          <p className="text-xs text-sky-600 font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-spin-slow" />
                            Gia sư AI đang suy nghĩ...
                          </p>
                        )}
                        {aiExplanation && (
                          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl">
                            <p className="font-bold text-sky-800 flex items-center gap-1 text-[13px] mb-1">
                              <Sparkles className="w-4 h-4 text-sky-500" />
                              Gia Sư AI nói:
                            </p>
                            <p className="leading-relaxed font-medium text-sky-900 text-sm">{aiExplanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress and Next Action Panel */}
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  id="btn-next-question"
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-base rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 border-b-4 border-emerald-600 cursor-pointer"
                >
                  <span>{currentIndex + 1 === questions.length ? "Xem kết quả chung cuộc 🎉" : "Câu tiếp theo"}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
