import { Award, BookOpen, CheckCircle2, RotateCcw, AlertTriangle, Play, Sparkles, TrendingUp } from 'lucide-react';
import { UserProgress } from '../types';
import { allTheoryQuestions, CATEGORIES } from '../data/theory';

interface CabinetSectionProps {
  progress: UserProgress;
  stats: {
    totalTickets: number;
    readCount: number;
    testedCount: number;
    masteredCount: number;
    totalCorrect: number;
    totalWrong: number;
    totalQuestionsAnswered: number;
    accuracyPercent: number;
    overallMasteryPercent: number;
  };
  onResetProgress: () => void;
  onGoToTicketTheory: (ticketId: number) => void;
  onGoToTicketTest: (ticketId: number) => void;
}

export function CabinetSection({
  progress,
  stats,
  onResetProgress,
  onGoToTicketTheory,
  onGoToTicketTest
}: CabinetSectionProps) {

  // Проблемные билеты (где балл < 4 или вообще не сдан, но есть ошибки)
  const problematicTickets = allTheoryQuestions.filter(t => {
    const p = progress.tickets[t.id];
    if (!p) return false;
    if (p.bestScore !== undefined && p.bestScore < 4) return true;
    if (p.wrongAnswersTotal > p.correctAnswersTotal) return true;
    return false;
  });

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-mono font-bold uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            <span>Панель мониторинга усвоения МВП</span>
          </div>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-white">
            Личный кабинет и прогресс
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Комплексная статистика изучения билетов, сдачи тестовых тренажеров и выявления слабых мест перед экзаменом.
          </p>
        </div>

        {/* Круговой индикатор */}
        <div className="flex items-center justify-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shrink-0">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-indigo-300">
              {stats.overallMasteryPercent}%
            </div>
            <div className="text-xs font-medium text-slate-200 mt-1 uppercase tracking-wider">Итоговая готовность</div>
          </div>
        </div>
      </div>

      {/* 4 главных метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Изучено теории</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
            {stats.readCount} <span className="text-xs font-normal text-slate-400">/ 48</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(stats.readCount / 48) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Сдано тестов</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
            {stats.testedCount} <span className="text-xs font-normal text-slate-400">/ 48</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(stats.testedCount / 48) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Освоено на 5/5</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
            {stats.masteredCount} <span className="text-xs font-normal text-slate-400">/ 48</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(stats.masteredCount / 48) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Точность ответов</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
            {stats.accuracyPercent}%
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            Всего попыток: {stats.totalQuestionsAnswered} вопр
          </p>
        </div>

      </div>

      {/* Модули курса (разбивка по темам) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-lg text-slate-900">
          Прогресс по разделам экзаменационной программы:
        </h3>

        <div className="space-y-4">
          {CATEGORIES.filter(cat => cat !== "Все категории").map(cat => {
            const catTickets = allTheoryQuestions.filter(t => t.category === cat);
            const total = catTickets.length;
            const read = catTickets.filter(t => progress.tickets[t.id]?.isRead).length;
            const tested5 = catTickets.filter(t => progress.tickets[t.id]?.bestScore === 5).length;
            const percent = total > 0 ? Math.round(((read * 0.5 + tested5 * 0.5) / total) * 100) : 0;

            return (
              <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm font-semibold text-slate-900">
                  <span>{cat}</span>
                  <div className="flex items-center space-x-3 font-mono text-xs text-slate-500 font-normal">
                    <span>Теория: <strong>{read}/{total}</strong></span>
                    <span>•</span>
                    <span>Сдано на 5: <strong>{tested5}/{total}</strong></span>
                    <span>•</span>
                    <span className="text-indigo-700 font-bold">{percent}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Блок проблемных тем */}
      {problematicTickets.length > 0 && (
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-base sm:text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3>Темы, требующие особого внимания (выявлены ошибки или низкий балл):</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {problematicTickets.map(t => {
              const score = progress.tickets[t.id]?.bestScore;

              return (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-800">
                      <span>#{t.id}</span>
                      <span>{score !== undefined ? `Балл: ${score}/5` : 'Ошибки'}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2">
                      {t.title.replace(/^\d+\.\s*/, '')}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onGoToTicketTheory(t.id)}
                      className="flex-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-1.5 rounded-lg text-center transition-colors"
                    >
                      Повторить
                    </button>
                    <button
                      onClick={() => onGoToTicketTest(t.id)}
                      className="flex-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 rounded-lg text-center transition-colors"
                    >
                      Пересдать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Очистка прогресса */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 max-w-md">
          <strong>Обнуление данных:</strong> сбросит отметки изучения всех 48 билетов, статистику тестов и сохраненные ошибки в браузере.
        </div>

        <button
          onClick={() => {
            if (confirm("Вы уверены, что хотите полностью стереть весь накопленный прогресс подготовки к экзамену?")) {
              onResetProgress();
            }
          }}
          className="flex items-center space-x-2 px-5 py-2.5 bg-rose-50 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить весь прогресс</span>
        </button>
      </div>

    </div>
  );
}
