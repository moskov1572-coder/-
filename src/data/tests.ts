import { TestQuestion } from '../types';
import { testsPart1_12 } from './tests1_12';
import { testsPart13_24 } from './tests13_24';
import { testsPart25_36 } from './tests25_36';
import { testsPart37_48 } from './tests37_48';

export const allTestQuestions: TestQuestion[] = [
  ...testsPart1_12,
  ...testsPart13_24,
  ...testsPart25_36,
  ...testsPart37_48
];

export function getQuestionsByTicketId(ticketId: number): TestQuestion[] {
  return allTestQuestions.filter(q => q.ticketId === ticketId);
}

export function getRandomQuestions(count: number, excludedIds?: string[]): TestQuestion[] {
  let pool = allTestQuestions;
  if (excludedIds && excludedIds.length > 0) {
    pool = allTestQuestions.filter(q => !excludedIds.includes(q.id));
    if (pool.length < count) pool = allTestQuestions; // fallback если исключено слишком много
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
