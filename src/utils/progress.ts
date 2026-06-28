import { UserProgress } from '../types';
import { allTheoryQuestions } from '../data/theory';

const STORAGE_KEY = 'mvp_exam_progress_2026';

export function getInitialProgress(): UserProgress {
  const initialTickets: UserProgress['tickets'] = {};
  allTheoryQuestions.forEach(t => {
    initialTickets[t.id] = {
      ticketId: t.id,
      isRead: false,
      totalAttempts: 0,
      correctAnswersTotal: 0,
      wrongAnswersTotal: 0
    };
  });

  return {
    tickets: initialTickets,
    wrongQuestionIds: [],
    bookmarkedTicketIds: []
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialProgress();
      saveProgress(initial);
      return initial;
    }
    const parsed: UserProgress = JSON.parse(raw);
    
    // Обеспечим обратную совместимость или отсутствующие ключи
    allTheoryQuestions.forEach(t => {
      if (!parsed.tickets[t.id]) {
        parsed.tickets[t.id] = {
          ticketId: t.id,
          isRead: false,
          totalAttempts: 0,
          correctAnswersTotal: 0,
          wrongAnswersTotal: 0
        };
      }
    });
    if (!parsed.wrongQuestionIds) parsed.wrongQuestionIds = [];
    if (!parsed.bookmarkedTicketIds) parsed.bookmarkedTicketIds = [];

    return parsed;
  } catch (e) {
    console.error('Ошибка загрузки прогресса:', e);
    return getInitialProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Ошибка сохранения прогресса:', e);
  }
}

export function markTicketAsRead(ticketId: number, isRead: boolean): UserProgress {
  const prog = loadProgress();
  if (prog.tickets[ticketId]) {
    prog.tickets[ticketId].isRead = isRead;
    saveProgress(prog);
  }
  return prog;
}

export function toggleBookmark(ticketId: number): UserProgress {
  const prog = loadProgress();
  const exists = prog.bookmarkedTicketIds.includes(ticketId);
  if (exists) {
    prog.bookmarkedTicketIds = prog.bookmarkedTicketIds.filter(id => id !== ticketId);
  } else {
    prog.bookmarkedTicketIds.push(ticketId);
  }
  saveProgress(prog);
  return prog;
}

export function saveTestResult(
  ticketId: number,
  score: number, // из 5
  wrongQuestionIdsInThisTest: string[],
  correctQuestionIdsInThisTest: string[]
): UserProgress {
  const prog = loadProgress();
  const ticketProg = prog.tickets[ticketId];

  if (ticketProg) {
    ticketProg.totalAttempts += 1;
    ticketProg.lastAttemptDate = new Date().toISOString();
    ticketProg.correctAnswersTotal += score;
    ticketProg.wrongAnswersTotal += (5 - score);

    if (ticketProg.bestScore === undefined || score > ticketProg.bestScore) {
      ticketProg.bestScore = score;
    }
  }

  // Обновляем список ошибочных вопросов
  wrongQuestionIdsInThisTest.forEach(id => {
    if (!prog.wrongQuestionIds.includes(id)) {
      prog.wrongQuestionIds.push(id);
    }
  });

  // Если пользователь исправил ошибку (ответил правильно), можно убрать её из wrongQuestionIds
  correctQuestionIdsInThisTest.forEach(id => {
    prog.wrongQuestionIds = prog.wrongQuestionIds.filter(wId => wId !== id);
  });

  saveProgress(prog);
  return prog;
}

export function resetAllProgress(): UserProgress {
  const initial = getInitialProgress();
  saveProgress(initial);
  return initial;
}

export function calculateStats(progress: UserProgress) {
  const ticketsArr = Object.values(progress.tickets);
  const totalTickets = allTheoryQuestions.length; // 48
  
  const readCount = ticketsArr.filter(t => t.isRead).length;
  const testedCount = ticketsArr.filter(t => t.bestScore !== undefined).length;
  const masteredCount = ticketsArr.filter(t => t.bestScore === 5 && t.isRead).length;

  const totalCorrect = ticketsArr.reduce((acc, t) => acc + t.correctAnswersTotal, 0);
  const totalWrong = ticketsArr.reduce((acc, t) => acc + t.wrongAnswersTotal, 0);
  const totalQuestionsAnswered = totalCorrect + totalWrong;
  const accuracyPercent = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

  const overallMasteryPercent = Math.round(
    ((readCount * 0.4 + testedCount * 0.3 + masteredCount * 0.3) / totalTickets) * 100
  );

  return {
    totalTickets,
    readCount,
    testedCount,
    masteredCount,
    totalCorrect,
    totalWrong,
    totalQuestionsAnswered,
    accuracyPercent,
    overallMasteryPercent
  };
}
