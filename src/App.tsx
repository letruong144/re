/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
}

const QUIZ_DATA: Section[] = [
  {
    title: "Phần 1: Thì Hiện tại đơn (Present Simple)",
    description: "Dấu hiệu: always, usually, often, sometimes, every...",
    questions: [
      { id: 1, text: "She ____ to school every day.", options: ["go", "goes", "is going", "going"], correctAnswer: "B" },
      { id: 2, text: "They usually ____ football on Sundays.", options: ["plays", "playing", "play", "are playing"], correctAnswer: "C" },
      { id: 3, text: "Water ____ at 100 degrees Celsius.", options: ["boil", "is boiling", "boils", "boiled"], correctAnswer: "C" },
      { id: 4, text: "My brother ____ reading comic books.", options: ["don't like", "doesn't like", "isn't liking", "has liked"], correctAnswer: "B" },
      { id: 5, text: "____ your mother often get up early?", options: ["Do", "Does", "Is", "Has"], correctAnswer: "B" },
    ]
  },
  {
    title: "Phần 2: Thì Hiện tại tiếp diễn (Present Continuous)",
    description: "Dấu hiệu: now, right now, at the moment, Look!, Listen!...",
    questions: [
      { id: 6, text: "Look! The children ____ in the garden.", options: ["play", "are playing", "is playing", "plays"], correctAnswer: "B" },
      { id: 7, text: "She ____ TV right now.", options: ["watches", "watching", "is watching", "are watching"], correctAnswer: "C" },
      { id: 8, text: "Listen! The birds ____ beautifully.", options: ["sing", "sings", "are singing", "is singing"], correctAnswer: "C" },
      { id: 9, text: "I ____ English at present.", options: ["am learning", "learn", "learning", "have learned"], correctAnswer: "A" },
      { id: 10, text: "Where is John? - He ____ his car at the moment.", options: ["washes", "is washing", "washed", "washing"], correctAnswer: "B" },
    ]
  },
  {
    title: "Phần 3: Thì Hiện tại hoàn thành (Present Perfect)",
    description: "Dấu hiệu: already, yet, just, ever, never, since, for...",
    questions: [
      { id: 11, text: "I ____ my homework already.", options: ["finish", "finished", "have finished", "has finished"], correctAnswer: "C" },
      { id: 12, text: "She ____ to Japan three times.", options: ["goes", "went", "have gone", "has been"], correctAnswer: "D" },
      { id: 13, text: "We ____ each other for 5 years.", options: ["know", "knew", "have known", "are knowing"], correctAnswer: "C" },
      { id: 14, text: "____ you ever ____ sushi?", options: ["Do / eat", "Did / eat", "Have / eaten", "Has / eaten"], correctAnswer: "C" },
      { id: 15, text: "He ____ the report yet.", options: ["hasn't finished", "haven't finished", "didn't finish", "doesn't finish"], correctAnswer: "A" },
    ]
  },
  {
    title: "Phần 4: Thì Quá khứ đơn (Past Simple)",
    description: "Dấu hiệu: yesterday, last night/week, ago, in + năm trong quá khứ...",
    questions: [
      { id: 16, text: "She ____ a new dress yesterday.", options: ["buy", "buys", "bought", "has bought"], correctAnswer: "C" },
      { id: 17, text: "They ____ to Hanoi last week.", options: ["go", "went", "gone", "have gone"], correctAnswer: "B" },
      { id: 18, text: "I ____ him two days ago.", options: ["meet", "met", "have met", "meeting"], correctAnswer: "B" },
      { id: 19, text: "My family ____ here in 2010.", options: ["move", "moved", "has moved", "is moving"], correctAnswer: "B" },
      { id: 20, text: "Did she ____ the party last night?", options: ["enjoy", "enjoyed", "enjoys", "enjoying"], correctAnswer: "A" },
    ]
  },
  {
    title: "Phần 5: Thì Tương lai đơn (Future Simple)",
    description: "Dấu hiệu: tomorrow, next week/year, soon, in the future...",
    questions: [
      { id: 21, text: "I think it ____ tomorrow.", options: ["rains", "is raining", "will rain", "rained"], correctAnswer: "C" },
      { id: 22, text: "The phone is ringing. I ____ it!", options: ["answer", "will answer", "am answering", "answered"], correctAnswer: "B" },
      { id: 23, text: "They ____ a new house next year.", options: ["build", "built", "will build", "have built"], correctAnswer: "C" },
      { id: 24, text: "Will she ____ her grandmother this weekend?", options: ["visit", "visits", "visited", "visiting"], correctAnswer: "A" },
      { id: 25, text: "Don't worry, I ____ you with your homework.", options: ["help", "will help", "helped", "am helping"], correctAnswer: "B" },
    ]
  },
  {
    title: "Phần 6: Bài tập tổng hợp & Phân biệt các thì (Mixed Practice)",
    description: "Kiểm tra khả năng phản xạ và tránh các lỗi sai phổ biến",
    questions: [
      { id: 26, text: "She usually ____ to work by bus, but today she ____ a taxi.", options: ["goes / is taking", "go / takes", "is going / takes", "goes / takes"], correctAnswer: "A" },
      { id: 27, text: "I ____ this movie. Can we watch something else?", options: ["see", "saw", "have seen", "am seeing"], correctAnswer: "C" },
      { id: 28, text: "When I was a child, I ____ lots of cartoons.", options: ["watch", "watched", "have watched", "am watching"], correctAnswer: "B" },
      { id: 29, text: "Please be quiet! The baby ____.", options: ["sleeps", "slept", "is sleeping", "has slept"], correctAnswer: "C" },
      { id: 30, text: "Oh no! I ____ my keys. I can't find them anywhere.", options: ["lose", "lost", "have lost", "am losing"], correctAnswer: "C" },
    ]
  }
];

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function App() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: OPTION_LABELS[optionIndex]
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    QUIZ_DATA.forEach(section => {
      section.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
    });
    const totalQuestions = QUIZ_DATA.reduce((acc, section) => acc + section.questions.length, 0);
    return (10 * correctCount / totalQuestions).toFixed(1);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < 30) {
      if (!confirm("Bạn chưa hoàn thành tất cả các câu hỏi. Bạn có chắc chắn muốn nộp bài không?")) {
        return;
      }
    }
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">English Grammar Quiz</h1>
            <p className="text-stone-500 text-sm">Kiểm tra kiến thức về các thì trong tiếng Anh</p>
          </div>
          {isSubmitted && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest font-semibold text-stone-400">Điểm số</p>
                <p className="text-3xl font-bold text-emerald-600">{score}/10</p>
              </div>
              <button 
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-600"
                title="Làm lại"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-12">
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-6"
          >
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <Award size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">Kết quả của bạn</h2>
              <p className="text-emerald-700">
                Bạn đã đạt được <span className="font-bold">{score}</span> trên thang điểm 10. 
                Hãy xem lại các câu trả lời bên dưới để học hỏi thêm!
              </p>
            </div>
          </motion.div>
        )}

        {QUIZ_DATA.map((section, sIdx) => (
          <section key={sIdx} className="space-y-6">
            <div className="border-l-4 border-stone-900 pl-4">
              <h2 className="text-xl font-bold text-stone-900 italic serif">{section.title}</h2>
              <p className="text-stone-500 text-sm mt-1">{section.description}</p>
            </div>

            <div className="grid gap-6">
              {section.questions.map((q) => (
                <div 
                  key={q.id} 
                  id={`question-${q.id}`}
                  className={`bg-white border rounded-2xl p-6 transition-all ${
                    isSubmitted 
                      ? (answers[q.id] === q.correctAnswer ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30')
                      : 'border-stone-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium leading-relaxed">
                      <span className="text-stone-400 mr-2 font-mono text-sm uppercase tracking-tighter">Câu {q.id}:</span>
                      {q.text}
                    </h3>
                    {isSubmitted && (
                      answers[q.id] === q.correctAnswer ? (
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                      ) : (
                        <XCircle className="text-rose-500 shrink-0" size={24} />
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, oIdx) => {
                      const label = OPTION_LABELS[oIdx];
                      const isSelected = answers[q.id] === label;
                      const isCorrect = label === q.correctAnswer;
                      
                      let buttonClass = "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ";
                      
                      if (isSubmitted) {
                        if (isSelected && isCorrect) {
                          buttonClass += "border-emerald-500 bg-emerald-100 text-emerald-900";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "border-rose-500 bg-rose-100 text-rose-900";
                        } else if (isCorrect) {
                          buttonClass += "border-emerald-200 bg-emerald-50 text-emerald-800";
                        } else {
                          buttonClass += "border-stone-100 text-stone-400 opacity-60";
                        }
                      } else {
                        buttonClass += isSelected 
                          ? "border-stone-900 bg-stone-900 text-white" 
                          : "border-stone-100 hover:border-stone-300 bg-stone-50 text-stone-700";
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(q.id, oIdx)}
                          disabled={isSubmitted}
                          className={buttonClass}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            isSelected && !isSubmitted ? 'bg-white/20' : 'bg-stone-200/50'
                          }`}>
                            {label}
                          </span>
                          <span className="font-medium">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2">
                      <span className={`text-sm font-bold uppercase tracking-wider ${
                        answers[q.id] === q.correctAnswer ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {answers[q.id] === q.correctAnswer ? 'Đúng' : 'Sai'}
                      </span>
                      {!answers[q.id] && (
                        <span className="text-stone-400 text-sm italic">(Chưa trả lời)</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {!isSubmitted && (
          <div className="pt-8 pb-12 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-stone-900 text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-stone-900/20"
            >
              Nộp bài & Chấm điểm
            </button>
          </div>
        )}
      </main>

      {/* Progress Bar */}
      {!isSubmitted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-2xl z-20">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-stone-900"
                initial={{ width: 0 }}
                animate={{ width: `${(Object.keys(answers).length / 30) * 100}%` }}
              />
            </div>
            <span className="text-stone-500 font-mono text-sm font-bold">
              {Object.keys(answers).length}/30
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
