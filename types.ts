export enum GameState {
  Start = 'Start',
  Playing = 'Playing',
  Results = 'Results',
}

export interface TrainingMode {
  id: 'compressor_presence' | 'attack' | 'release' | 'abx_test' | 'detective' | 'glue_vs_limiter';
  name: string;
  description: string;
  answerOptions: [string, string] | [string, string, string, string];
}

export interface Level {
  level: number;
  description: string;
  params: any;
}

export interface Sample {
  id: string;
  url: string;
  bpm?: number;
  tags: string[];
  preLUFS?: number;
}

export interface SamplePack {
  name: string;
  tags: string[];
}

export enum AudioSource {
    A = 'A',
    B = 'B',
}

export interface QuestionResult {
    questionNumber: number;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
    params: any;
}

export interface SessionResults {
    score: number;
    maxStreak: number;
    accuracy: number;
    questions: QuestionResult[];
}

export interface LevelStats {
    accuracy: number;
    attempts: number;
    bestStreak: number;
}

export interface Stats {
    [key: string]: {
        [level: number]: LevelStats;
    };
}