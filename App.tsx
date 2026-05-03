/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, GraduationCap, MapPin, Globe, ChevronRight, Eye, EyeOff, BookOpen, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { examData, Question } from './data';
import { cn } from './lib/utils';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Russia' | 'USA' | 'General'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(examData[0]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredData = useMemo(() => {
    return examData.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', label: 'Все темы', icon: BookOpen },
    { id: 'Russia', label: 'Россия (ОЭЗ)', icon: MapPin },
    { id: 'USA', label: 'США (Зоны возм.)', icon: Globe },
    { id: 'General', label: 'Общие темы', icon: Globe },
  ] as const;

  return (
    <div id="app-root" className="h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Top Header Navigation */}
      <header id="app-header" className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">L</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Правовое регулирование СЭЗ</h1>
            <p className="text-[10px] text-slate-400 font-medium">ПОДГОТОВКА К ЗАЧЕТУ • 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Изучено разделов</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[60%] h-full bg-indigo-500"></div>
              </div>
              <span className="text-xs font-bold text-slate-700">60%</span>
            </div>
          </div>
          <button
            id="quiz-toggle"
            onClick={() => {
              setIsQuizMode(!isQuizMode);
              setShowAnswer(false);
            }}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded transition-colors uppercase border",
              isQuizMode 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {isQuizMode ? 'Режим обучения' : 'Режим зачета'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Question List */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                id="search-input"
                type="text"
                placeholder="Поиск вопроса..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div id="category-tabs" className="flex items-center gap-1 p-2 bg-slate-50/50 border-b border-slate-100 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap",
                  selectedCategory === cat.id
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div id="question-list" className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            <AnimatePresence mode="popLayout">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <button
                      onClick={() => {
                        setSelectedQuestion(item);
                        setShowAnswer(!isQuizMode);
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded transition-colors group",
                        selectedQuestion?.id === item.id
                          ? "bg-indigo-50 border-l-4 border-indigo-500 rounded-r"
                          : "hover:bg-slate-50"
                      )}
                    >
                      <span className={cn(
                        "text-[10px] font-bold block mb-1 uppercase",
                        selectedQuestion?.id === item.id ? "text-indigo-600" : "text-slate-400"
                      )}>
                        Вопрос {item.id}
                      </span>
                      <p className={cn(
                        "text-xs leading-tight transition-all",
                        selectedQuestion?.id === item.id ? "font-semibold text-slate-900" : "font-medium text-slate-600"
                      )}>
                        {item.question}
                      </p>
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-300 italic text-[10px]">
                  Ничего не найдено
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-slate-900 text-white">
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-indigo-300 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Как запустить (Diploi)
            </h3>
            <p className="text-[9px] leading-relaxed text-slate-400">
              1. Создайте проект на diploi.com<br />
              2. Подключите Git репозиторий<br />
              3. Выберите Node.js окружение<br />
              4. Порт: 3000 (автоматически)<br />
              5. Нажмите 'Deploy'
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <section id="content-area" className="flex-1 flex flex-col bg-white overflow-y-auto no-scrollbar">
          {selectedQuestion ? (
            <div className="max-w-3xl w-full mx-auto p-8 sm:p-12 flex-1 flex flex-col">
              <nav className="flex gap-2 mb-8">
                <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                  {selectedQuestion.category === 'Russia' ? '🇷🇺 Россия' : selectedQuestion.category === 'USA' ? '🇺🇸 США' : '🌐 Общее'}
                </span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">ВАЖНО</span>
              </nav>
              
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-slate-900 leading-tight mb-8">
                {selectedQuestion.question}
              </h2>

              <div className="space-y-8 text-slate-700 leading-relaxed font-serif">
                {isQuizMode && !showAnswer ? (
                  <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                    <Eye className="w-10 h-10 text-slate-200 mb-4" />
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-6 py-3 bg-indigo-600 text-white text-xs font-bold rounded shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                    >
                      Показать ответ
                    </button>
                    <p className="text-[10px] text-slate-400 mt-4 font-sans font-bold uppercase tracking-tighter italic">Попробуйте вспомнить самостоятельно</p>
                  </div>
                ) : (
                  <motion.div
                    id="answer-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none prose-p:text-lg sm:prose-p:text-xl prose-p:leading-relaxed prose-li:text-base prose-strong:text-slate-900 prose-thead:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-th:text-xs prose-th:text-slate-500 prose-th:uppercase prose-td:text-sm prose-table:border prose-table:border-slate-100"
                  >
                     <ReactMarkdown
                      components={{
                        table: ({node, ...props}) => <div className="overflow-x-auto my-8 border border-slate-100 rounded-lg"><table {...props} className="min-w-full border-collapse" /></div>,
                        th: ({node, ...props}) => <th {...props} className="bg-slate-50 border-b border-slate-100 p-4 text-left font-bold text-[10px] text-slate-400 uppercase tracking-widest" />,
                        td: ({node, ...props}) => <td {...props} className="border-b border-slate-50 p-4 text-slate-600" />,
                        p: ({node, ...props}) => <p {...props} className="mb-6 last:mb-0" />,
                        li: ({node, ...props}) => <li {...props} className="mb-3 list-none relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-indigo-500 before:font-bold" />
                      }}
                    >
                      {selectedQuestion.answer}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </div>

              {/* Floating Control Bar */}
              <div className="mt-auto flex items-center justify-between pt-12 pb-4 border-t border-slate-100 flex-wrap gap-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const idx = examData.findIndex(q => q.id === selectedQuestion.id);
                      if (idx > 0) setSelectedQuestion(examData[idx - 1]);
                    }}
                    disabled={examData.findIndex(q => q.id === selectedQuestion.id) === 0}
                    className="p-3 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600 rotate-180" />
                  </button>
                  <button 
                    onClick={() => {
                      const idx = examData.findIndex(q => q.id === selectedQuestion.id);
                      if (idx < examData.length - 1) setSelectedQuestion(examData[idx + 1]);
                    }}
                    disabled={examData.findIndex(q => q.id === selectedQuestion.id) === examData.length - 1}
                    className="p-3 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <div className="flex gap-3">
                  {isQuizMode && showAnswer && (
                    <button
                      onClick={() => setShowAnswer(false)}
                      className="px-6 py-3 border border-slate-300 text-[10px] font-bold rounded text-slate-600 hover:bg-slate-50 uppercase tracking-widest"
                    >
                      НУЖНО ПОВТОРИТЬ
                    </button>
                  )}
                  <button className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-bold rounded shadow-lg shadow-indigo-100 hover:bg-indigo-700 uppercase tracking-widest">
                    ОТМЕТИТЬ КАК ИЗУЧЕННОЕ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 italic font-serif text-xl">
              Выберите вопрос из списка слева
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

