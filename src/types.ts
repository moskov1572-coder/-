export interface TheoryQuestion {
  id: number;
  title: string;
  category: string;
  shortSummary?: string;
  content: string[]; // Параграфы или блоки текста со всеми деталями
}

export interface TestQuestion {
  id: string;
  ticketId: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type TicketStatus = 'not_started' | 'reading' | 'read' | 'tested';

export interface TicketProgress {
  ticketId: number;
  isRead: boolean;
  bestScore?: number; // из 5
  lastAttemptDate?: string;
  totalAttempts: number;
  correctAnswersTotal: number;
  wrongAnswersTotal: number;
}

export interface UserProgress {
  tickets: Record<number, TicketProgress>;
  wrongQuestionIds: string[]; // Вопросы, на которые пользователь ошибался
  bookmarkedTicketIds: number[];
}

export type ActiveTab = 'theory' | 'testing' | 'cabinet';

export type TestMode = 'ticket' | 'express' | 'marathon' | 'mistakes';
