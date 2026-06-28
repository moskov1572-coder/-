import { BookOpen, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  masteryPercent: number;
}

export function Header({ activeTab, setActiveTab, masteryPercent }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Логотип и заголовок */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('theory')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                Тренажер МВП <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold ml-1">2026</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Полный сборник билетов и тестов к экзамену
              </p>
            </div>
          </div>

          {/* Навигационные вкладки */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'theory'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Теория</span>
              <span className="hidden md:inline-block text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-mono ml-1">48</span>
            </button>

            <button
              onClick={() => setActiveTab('testing')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'testing'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Тренажер</span>
              <span className="hidden md:inline-block text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-mono ml-1">Тесты</span>
            </button>

            <button
              onClick={() => setActiveTab('cabinet')}
              className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'cabinet'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Прогресс</span>
            </button>
          </nav>

          {/* Индикатор общего усвоения */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl" title="Процент общего освоения материала">
            <div className="text-right">
              <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Готовность</div>
              <div className="text-xs font-bold font-mono text-indigo-700">{masteryPercent}%</div>
            </div>
            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
