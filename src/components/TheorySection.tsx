import { useState, useMemo } from 'react';
import { Search, CheckCircle2, Bookmark, ChevronDown, ChevronUp, Play, Sparkles } from 'lucide-react';
import { allTheoryQuestions, CATEGORIES } from '../data/theory';
import { UserProgress } from '../types';

interface TheorySectionProps {
  progress: UserProgress;
  onToggleRead: (ticketId: number, currentRead: boolean) => void;
  onToggleBookmark: (ticketId: number) => void;
  onStartTicketTest: (ticketId: number) => void;
}

export function TheorySection({
  progress,
  onToggleRead,
  onToggleBookmark,
  onStartTicketTest
}: TheorySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Все категории");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'bookmarked'>('all');
  const [expandedTicketIds, setExpandedTicketIds] = useState<number[]>([1]); // Первый билет раскрыт по умолчанию

  const toggleExpand = (id: number) => {
    setExpandedTicketIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedTicketIds(allTheoryQuestions.map(t => t.id));
  };

  const collapseAll = () => {
    setExpandedTicketIds([]);
  };

  const filteredQuestions = useMemo(() => {
    return allTheoryQuestions.filter(q => {
      // 1. Категория
      if (selectedCategory !== "Все категории" && q.category !== selectedCategory) {
        return false;
      }
      // 2. Поиск
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const titleMatch = q.title.toLowerCase().includes(queryLower);
        const contentMatch = q.content.some(c => c.toLowerCase().includes(queryLower));
        if (!titleMatch && !contentMatch) return false;
      }
      // 3. Статус
      const ticketProg = progress.tickets[q.id];
      const isRead = ticketProg?.isRead || false;
      const isBookmarked = progress.bookmarkedTicketIds?.includes(q.id) || false;

      if (statusFilter === 'unread' && isRead) return false;
      if (statusFilter === 'read' && !isRead) return false;
      if (statusFilter === 'bookmarked' && !isBookmarked) return false;

      return true;
    });
  }, [selectedCategory, searchQuery, statusFilter, progress]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Верхняя панель управления: Поиск и фильтры */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Поиск */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по билетам, терминам, авторам (например, Альтшулер, Бреттон-Вудс, СДР)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Быстрые переключатели статуса */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium shrink-0 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Все ({allTheoryQuestions.length})
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === 'unread' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Изучать
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === 'read' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Изучено
            </button>
            <button
              onClick={() => setStatusFilter('bookmarked')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${statusFilter === 'bookmarked' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ★ Избранное
            </button>
          </div>
        </div>

        {/* Фильтр по разделам программы */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-400 font-medium shrink-0 mr-1 hidden sm:inline-block">Тема:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Строка с количеством и кнопками Раскрыть/Свернуть */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Найдено билетов: <strong className="text-slate-900 font-mono">{filteredQuestions.length}</strong> из 48</span>
          <div className="flex items-center space-x-3">
            <button onClick={expandAll} className="hover:text-indigo-600 underline underline-offset-2 decoration-dotted">Раскрыть все</button>
            <span>•</span>
            <button onClick={collapseAll} className="hover:text-indigo-600 underline underline-offset-2 decoration-dotted">Свернуть все</button>
          </div>
        </div>

      </div>

      {/* Список билетов */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl font-mono">?</div>
          <h3 className="font-semibold text-slate-900 text-base">Билеты не найдены</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Попробуйте изменить поисковый запрос или выбрать категорию «Все категории».
          </p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("Все категории"); setStatusFilter('all'); }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((ticket) => {
            const isExpanded = expandedTicketIds.includes(ticket.id);
            const ticketProg = progress.tickets[ticket.id];
            const isRead = ticketProg?.isRead || false;
            const bestScore = ticketProg?.bestScore;
            const isBookmarked = progress.bookmarkedTicketIds?.includes(ticket.id) || false;

            return (
              <div
                key={ticket.id}
                id={`ticket-card-${ticket.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isRead ? 'border-emerald-200/80 bg-emerald-50/10' : 'border-slate-200 shadow-xs'
                }`}
              >
                
                {/* Заголовок карточки билета */}
                <div
                  onClick={() => toggleExpand(ticket.id)}
                  className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 flex items-start justify-between gap-4 select-none"
                >
                  <div className="flex items-start space-x-3.5 flex-1">
                    
                    {/* Номер билета */}
                    <div className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isRead
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{ticket.id}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {ticket.category}
                        </span>
                        {isRead && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Изучено
                          </span>
                        )}
                        {bestScore !== undefined && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            bestScore === 5
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            ★ Тест: {bestScore}/5
                          </span>
                        )}
                      </div>
                      <h2 className="font-sans font-bold text-base sm:text-lg text-slate-900 leading-snug">
                        {ticket.title.replace(/^\d+\.\s*/, '')}
                      </h2>
                    </div>

                  </div>

                  {/* Кнопки справа в заголовке */}
                  <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleBookmark(ticket.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isBookmarked ? 'Убрать из избранного' : 'Добавить в избранное'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => toggleExpand(ticket.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                </div>

                {/* Подробное содержание билета */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 bg-slate-50/40">
                    
                    <div className="prose prose-slate max-w-none space-y-3.5 text-sm leading-relaxed text-slate-800 pt-3">
                      {ticket.content.map((paragraph, idx) => {
                        // Красивое форматирование заголовков подпунктов (I., II., III.) и списков (•)
                        const isSubHeader = /^I{1,3}V?\.\s+/.test(paragraph) || paragraph.endsWith(':');
                        const isBullet = paragraph.trim().startsWith('•') || paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('2.') || paragraph.trim().startsWith('3.') || paragraph.trim().startsWith('4.') || paragraph.trim().startsWith('5.');

                        if (isSubHeader) {
                          return (
                            <h4 key={idx} className="font-bold text-slate-900 text-sm sm:text-base pt-3 pb-1 border-b border-slate-200/60">
                              {paragraph}
                            </h4>
                          );
                        }

                        if (isBullet) {
                          return (
                            <div key={idx} className="pl-3 sm:pl-4 py-1 border-l-2 border-indigo-300 bg-white/60 rounded-r-lg p-2 text-slate-700">
                              {paragraph}
                            </div>
                          );
                        }

                        return (
                          <p key={idx} className="text-slate-700 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>

                    {/* Подвал карточки билета с действиями */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/70">
                      
                      <button
                        onClick={() => onToggleRead(ticket.id, isRead)}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isRead
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isRead ? 'Снять отметку «Изучено»' : 'Отметить как изученное'}</span>
                      </button>

                      <button
                        onClick={() => onStartTicketTest(ticket.id)}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Тренажер по этому билету (5 вопросов)</span>
                      </button>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
