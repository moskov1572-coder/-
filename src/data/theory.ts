import { TheoryQuestion } from '../types';
import { theoryPart1 } from './theory1';
import { theoryPart2 } from './theory2';
import { theoryPart3 } from './theory3';

export const allTheoryQuestions: TheoryQuestion[] = [
  ...theoryPart1,
  ...theoryPart2,
  ...theoryPart3
];

export const CATEGORIES = [
  "Все категории",
  "Предмет, правоотношения и система МВП",
  "Источники МВП и принципы",
  "Субъекты и история МВП",
  "Роль МВФ, ВТО и интеграции",
  "Золото, контроль и МВФ как институт",
  "Конвертируемость, расчёты и ЕС",
  "Валютное регулирование и контроль в РФ"
];
