import { TrainingMode, SamplePack } from './types';

export const TRAINING_MODES: TrainingMode[] = [
  {
    id: 'compressor_presence',
    name: 'שמיעת קומפרסור',
    description: 'האם הופעל קומפרסור על הסמפל?',
    answerOptions: ['דחוס', 'יבש'],
  },
  {
    id: 'attack',
    name: 'שמיעת Attack',
    description: 'זהה אם ה-Attack מהיר או איטי.',
    answerOptions: ['מהיר', 'איטי'],
  },
  {
    id: 'release',
    name: 'שמיעת Release',
    description: 'זהה אם ה-Release מהיר או איטי.',
    answerOptions: ['מהיר', 'איטי'],
  },
  {
    id: 'abx_test',
    name: 'מבחן ABX',
    description: 'זהה אם X זהה ל-A או ל-B במבחן עיוור.',
    answerOptions: ['X = A', 'X = B'],
  },
  {
    id: 'detective',
    name: 'בלש: מה השתנה?',
    description: 'מצא את ההבדל בין שתי גרסאות דחוסות.',
    answerOptions: ['Attack שונה', 'Release שונה', 'Ratio שונה', 'אין הבדל'],
  },
  {
    id: 'glue_vs_limiter',
    name: 'Glue או Limiter?',
    description: 'זהה אם הדחיסה היא Glue עדין או Limiter אגרסיבי.',
    answerOptions: ['Glue', 'Limiter'],
  }
];

export const SAMPLE_PACKS: SamplePack[] = [
    { name: 'הכל', tags: ['drums', 'piano', 'guitar', 'vocal', 'bass', 'synth', 'mix', 'melody'] },
    { name: 'תופים', tags: ['drums'] },
    { name: 'בס', tags: ['bass'] },
    { name: 'פסנתר', tags: ['piano'] },
    { name: 'גיטרה', tags: ['guitar'] },
    { name: 'סינת\'', tags: ['synth'] },
    { name: 'מיקס', tags: ['mix'] },
    { name: 'שירה', tags: ['vocal'] },
];

export const QUESTIONS_PER_SESSION = 10;