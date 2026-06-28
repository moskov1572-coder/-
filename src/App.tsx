import { useState, useEffect } from 'react';
import { ActiveTab, UserProgress } from './types';
import { loadProgress, markTicketAsRead, toggleBookmark, saveTestResult, resetAllProgress, calculateStats } from './utils/progress';
import { Header } from './components/Header';
import { TheorySection } from './components/TheorySection';
import { TestingSection } from './components/TestingSection';
import { CabinetSection } from './components/CabinetSection';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('theory');
  const [progress, setProgress] = useState<UserProgress>(getInitialOrLoadedProgress);
  const [activeTestTicketId, setActiveTestTicketId] = useState<number | null>(null);

  function getInitialOrLoadedProgress() {
    return loadProgress();
  }

  const stats = calculateStats(progress);

  // Синхронизация между вкладками (если открыто в нескольких окнах)
  useEffect(() => {
    const handleStorage = () => {
      setProgress(loadProgress());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggleRead = (ticketId: number, currentRead: boolean) => {
    const nextProg = markTicketAsRead(ticketId, !currentRead);
    setProgress(nextProg);
  };

  const handleToggleBookmark = (ticketId: number) => {
    const nextProg = toggleBookmark(ticketId);
    setProgress(nextProg);
  };

  const handleStartTicketTestFromTheory = (ticketId: number) => {
    setActiveTestTicketId(ticketId);
    setActiveTab('testing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToTheoryFromTestOrCabinet = (ticketId: number) => {
    setActiveTab('theory');
    setActiveTestTicketId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const el = document.getElementById(`ticket-card-${ticketId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleFinishTest = (
    ticketId: number | null,
    score: number,
    wrongQuestionIds: string[],
    correctQuestionIds: string[]
  ) => {
    if (ticketId !== null) {
      const nextProg = saveTestResult(ticketId, score, wrongQuestionIds, correctQuestionIds);
      setProgress(nextProg);
    } else {
      // Даже если экспресс или марафон, можно просто сохранить списки ошибок
      const prog = loadProgress();
      wrongQuestionIds.forEach(id => {
        if (!prog.wrongQuestionIds.includes(id)) prog.wrongQuestionIds.push(id);
      });
      correctQuestionIds.forEach(id => {
        prog.wrongQuestionIds = prog.wrongQuestionIds.filter(wId => wId !== id);
      });
      // Сохраняем в localStorage
      localStorage.setItem('mvp_exam_progress_2026', JSON.stringify(prog));
      setProgress(prog);
    }
  };

  const handleResetProgress = () => {
    const res = resetAllProgress();
    setProgress(res);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== 'testing') setActiveTestTicketId(null);
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          masteryPercent={stats.overallMasteryPercent}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {activeTab === 'theory' && (
            <TheorySection
              progress={progress}
              onToggleRead={handleToggleRead}
              onToggleBookmark={handleToggleBookmark}
              onStartTicketTest={handleStartTicketTestFromTheory}
            />
          )}

          {activeTab === 'testing' && (
            <TestingSection
              progress={progress}
              onFinishTest={handleFinishTest}
              onGoToTheory={handleGoToTheoryFromTestOrCabinet}
              initialTicketId={activeTestTicketId}
            />
          )}

          {activeTab === 'cabinet' && (
            <CabinetSection
              progress={progress}
              stats={stats}
              onResetProgress={handleResetProgress}
              onGoToTicketTheory={handleGoToTheoryFromTestOrCabinet}
              onGoToTicketTest={handleStartTicketTestFromTheory}
            />
          )}
        </main>
      </div>

      {/* Подвал */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-1">
          <p>Тренажер подготовки к экзамену по международному валютному праву • 2026</p>
          <p className="font-mono text-[10px]">Всего билетов: 48 | Тестовых вопросов: 240 | Локальная сохранность данных</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
