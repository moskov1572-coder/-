import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen, AlertCircle, Award } from 'lucide-react';
import { TestQuestion, UserProgress } from '../types';
import { allTheoryQuestions } from '../data/theory';
import { getQuestionsByTicketId, getRandomQuestions, allTestQuestions } from '../data/tests';

interface TestingSectionProps {
  progress: UserProgress;
  onFinishTest: (
    ticketId: number | null,
    score: number,
    wrongQuestionIds: string[],
    correctQuestionIds: string[]
  ) => void;
  onGoToTheory: (ticketId: number) => void;
  initialTicketId?: number | null;
}

export function TestingSection({
  progress,
  onFinishTest,
  onGoToTheory,
  initialTicketId
}: TestingSectionProps) {
  // Выбор режима или активный тест
  const [activeQuestions, setActiveQuestions] = useState<TestQuestion[] | null>(() => {
    if (initialTicketId) {
      return getQuestionsByTicketId(initialTicketId);
    }
    return null;
  });

  const [testModeTitle, setTestModeTitle] = useState<string>("Тест по билету");
  const [currentTicketContext, setCurrentTicketContext] = useState<number | null>(initialTicketId || null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Сбор статистики в текущем тесте
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongIdsInTest, setWrongIdsInTest] = useState<string[]>([]);
  const [correctIdsInTest, setCorrectIdsInTest] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Запуск режима по конкретному билету
  const startTicketTest = (tId: number) => {
    const q = getQuestionsByTicketId(tId);
    setActiveQuestions(q);
    setTestModeTitle(`Билет №${tId}: ${allTheoryQuestions.find(item => item.id === tId)?.title || ''}`);
    setCurrentTicketContext(tId);
    resetSessionState();
  };

  // Запуск экспресс-теста (10 случайных)
  const startExpressTest = () => {
    const q = getRandomQuestions(10);
    setActiveQuestions(q);
    setTestModeTitle("Экспресс-тест (10 случайных вопросов)");
    setCurrentTicketContext(null);
    resetSessionState();
  };

  // Запуск марафона (48 вопросов по одному из каждого билета)
  const startMarathonTest = () => {
    const marathonArr: TestQuestion[] = [];
    allTheoryQuestions.forEach(t => {
      const ticketQ = getQuestionsByTicketId(t.id);
      if (ticketQ.length > 0) {
        const randomOne = ticketQ[Math.floor(Math.random() * ticketQ.length)];
        marathonArr.push(randomOne);
      }
    });
    setActiveQuestions(marathonArr);
    setTestModeTitle("Экзаменационный марафон (48 вопросов)");
    setCurrentTicketContext(null);
    resetSessionState();
  };

  // Запуск работы над ошибками
  const startMistakesTest = () => {
    const mistakesPool = allTestQuestions.filter(q => progress.wrongQuestionIds?.includes(q.id));
    if (mistakesPool.length === 0) {
      alert("У вас пока нет сохраненных ошибок для повторения!");
      return;
    }
    const shuffled = [...mistakesPool].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 15));
    setTestModeTitle("Работа над ошибками");
    setCurrentTicketContext(null);
    resetSessionState();
  };

  const resetSessionState = () => {
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setWrongIdsInTest([]);
    setCorrectIdsInTest([]);
    setIsFinished(false);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || !activeQuestions) return;
    setIsAnswerSubmitted(true);

    const currQ = activeQuestions[currentIndex];
    if (selectedOptionIndex === currQ.correctIndex) {
      setCorrectCount(prev => prev + 1);
      setCorrectIdsInTest(prev => [...prev, currQ.id]);
    } else {
      setWrongIdsInTest(prev => [...prev, currQ.id]);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuestions) return;
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      // Итог
      setIsFinished(true);
      const finalScore = correctCount + (selectedOptionIndex === activeQuestions[currentIndex].correctIndex ? 1 : 0);
      
      if (finalScore === activeQuestions.length) {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) {
          // ignore
        }
      }

      // Если тест был по конкретному билету из 5 вопросов, сохраняем официальный результат билета
      if (currentTicketContext && activeQuestions.length === 5) {
        onFinishTest(currentTicketContext, finalScore, wrongIdsInTest, correctIdsInTest);
      } else {
        onFinishTest(null, finalScore, wrongIdsInTest, correctIdsInTest);
      }
    }
  };

  // ЭКРАН 1: Меню выбора тренажера
  if (!activeQuestions) {
    const wrongCount = progress.wrongQuestionIds?.length || 0;

    return (
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        
        <div className="text-center space-y-2 pt-4">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Система тестирования и тренажер
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Проверьте усвояемость материала перед экзаменом в одном из 4 разноплановых режимов.
          </p>
        </div>

        {/* Карточки режимов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div
            onClick={startExpressTest}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Экспресс-тест</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Быстрая проверка знаний: 10 случайных вопросов со всего курса МВП с подробным разбором ответов.
            </p>
            <div className="text-xs font-semibold text-indigo-600 pt-1 flex items-center gap-1">
              Начать тест <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={startMarathonTest}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Экзаменационный марафон</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Генеральная симуляция экзамена: ровно 48 вопросов — по 1 вопросу из каждого экзаменационного билета.
            </p>
            <div className="text-xs font-semibold text-blue-600 pt-1 flex items-center gap-1">
              Запустить марафон <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={startMistakesTest}
            className={`p-6 rounded-2xl border shadow-xs transition-all space-y-3 ${
              wrongCount > 0
                ? 'bg-white border-amber-200 hover:shadow-md hover:border-amber-400 cursor-pointer group'
                : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Работа над ошибками</h3>
              <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {wrongCount} шт
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Повторение только тех вопросов, на которые вы ранее давали неправильные ответы во время тренировок.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white space-y-3 shadow-md flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">База 240 вопросов</span>
              <h3 className="font-bold text-lg text-white">Выбор конкретного билета</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ниже представлен сетка выбора билета №1..48. В каждом тесте ровно 5 вопросов для точной проверки усвоения.
              </p>
            </div>
          </div>

        </div>

        {/* Сетка выбора билета */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Выберите билет для тренировки:</h3>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
            {allTheoryQuestions.map(ticket => {
              const ticketProg = progress.tickets[ticket.id];
              const bestScore = ticketProg?.bestScore;

              return (
                <button
                  key={ticket.id}
                  onClick={() => startTicketTest(ticket.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center relative group hover:scale-105 ${
                    bestScore === 5
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : bestScore !== undefined
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-400'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-mono font-bold">#{ticket.id}</span>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {bestScore !== undefined ? `${bestScore}/5` : '5 вопр'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // ЭКРАН 2: Итоги завершенного теста
  if (isFinished) {
    const totalCount = activeQuestions.length;
    const finalPercent = Math.round((correctCount / totalCount) * 100);

    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg text-center space-y-6">
        
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-inner animate-bounce bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900">Тестирование завершено!</h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500">{testModeTitle}</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Верно</div>
            <div className="text-2xl font-mono font-bold text-emerald-600">{correctCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Ошибок</div>
            <div className="text-2xl font-mono font-bold text-rose-600">{totalCount - correctCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Результат</div>
            <div className="text-2xl font-mono font-bold text-indigo-700">{finalPercent}%</div>
          </div>
        </div>

        {wrongIdsInTest.length > 0 && (
          <div className="text-left bg-rose-50/60 rounded-2xl p-4 border border-rose-200 space-y-3">
            <h4 className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" /> Рекомендуем повторить билеты по ошибкам:
            </h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(wrongIdsInTest.map(id => allTestQuestions.find(q => q.id === id)?.ticketId))).filter(Boolean).map(tId => (
                <button
                  key={tId}
                  onClick={() => onGoToTheory(tId as number)}
                  className="text-xs bg-white text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl font-medium hover:bg-rose-100 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Билет №{tId}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => { resetSessionState(); }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Пройти этот тест повторно
          </button>

          <button
            onClick={() => setActiveQuestions(null)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-all flex items-center justify-center"
          >
            К списку режимов тренажера
          </button>
        </div>

      </div>
    );
  }

  // ЭКРАН 3: Активный процесс ответа на вопрос
  const currQ = activeQuestions[currentIndex];
  const ticketInfo = allTheoryQuestions.find(t => t.id === currQ.ticketId);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      
      {/* Прогресс-бар вопроса */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
        <button
          onClick={() => { if (confirm("Прервать текущий тест? Прогресс попытки не сохранится.")) setActiveQuestions(null); }}
          className="text-xs font-medium text-slate-400 hover:text-slate-700 underline underline-offset-2"
        >
          ✕ Завершить досрочно
        </button>

        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-slate-700">
          <span>Вопрос {currentIndex + 1} из {activeQuestions.length}</span>
        </div>

        <div className="w-24 sm:w-32 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Карточка вопроса */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
            Билет #{currQ.ticketId}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">
            {ticketInfo?.category}
          </span>
        </div>

        <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 leading-snug">
          {currQ.question}
        </h3>

        {/* Варианты ответов */}
        <div className="space-y-3 pt-2">
          {currQ.options.map((opt, optIdx) => {
            let styleClass = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/80 hover:border-slate-300";

            if (isAnswerSubmitted) {
              if (optIdx === currQ.correctIndex) {
                styleClass = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs";
              } else if (optIdx === selectedOptionIndex) {
                styleClass = "bg-rose-50 border-rose-400 text-rose-950";
              } else {
                styleClass = "bg-slate-50/50 border-slate-200/50 text-slate-400 opacity-60";
              }
            } else if (optIdx === selectedOptionIndex) {
              styleClass = "bg-indigo-50 border-indigo-600 text-indigo-950 font-medium shadow-xs";
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`p-4 rounded-2xl border text-sm sm:text-base cursor-pointer transition-all flex items-start space-x-3 select-none ${styleClass}`}
              >
                <div className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                  isAnswerSubmitted && optIdx === currQ.correctIndex
                    ? 'bg-emerald-600 text-white'
                    : isAnswerSubmitted && optIdx === selectedOptionIndex
                    ? 'bg-rose-500 text-white'
                    : optIdx === selectedOptionIndex
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <div className="flex-1 leading-relaxed">{opt}</div>
              </div>
            );
          })}
        </div>

        {/* Появление объяснения после ответа */}
        {isAnswerSubmitted && (
          <div className="bg-indigo-50/70 rounded-2xl p-4 sm:p-5 border border-indigo-200 space-y-2 text-xs sm:text-sm text-indigo-950 animate-fade-in">
            <div className="font-bold flex items-center gap-1.5 text-indigo-800">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Объяснение из теории экзамена:</span>
            </div>
            <p className="leading-relaxed text-slate-700 pl-5 border-l-2 border-indigo-400">
              {currQ.explanation}
            </p>
          </div>
        )}

        {/* Кнопки ответа / продолжения */}
        <div className="pt-4 flex justify-end border-t border-slate-100">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOptionIndex === null}
              className={`px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
                selectedOptionIndex !== null
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Проверить ответ
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <span>{currentIndex < activeQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить и посмотреть итог'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
