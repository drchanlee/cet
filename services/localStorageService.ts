import { Stats } from '../types';

const STATS_KEY = 'compressorTrainerStats';
const GAME_MODE_LEVEL_KEY = 'compressorTrainerGameModeLevel';

export const getInitialStats = (): Stats => {
  try {
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
      return JSON.parse(savedStats);
    }
  } catch (error) {
    console.error("Failed to parse stats from localStorage", error);
  }
  return {};
};

export const saveStats = (stats: Stats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats to localStorage", error);
  }
};

export const getGameModeLevel = (): number => {
    try {
        const savedLevel = localStorage.getItem(GAME_MODE_LEVEL_KEY);
        if (savedLevel) {
            const level = parseInt(savedLevel, 10);
            return isNaN(level) ? 1 : level;
        }
    } catch (error) {
        console.error("Failed to parse game mode level from localStorage", error);
    }
    return 1;
};

export const saveGameModeLevel = (level: number) => {
    try {
        localStorage.setItem(GAME_MODE_LEVEL_KEY, String(level));
    } catch (error) {
        console.error("Failed to save game mode level to localStorage", error);
    }
};

export const resetProgress = () => {
    try {
        localStorage.removeItem(STATS_KEY);
        localStorage.removeItem(GAME_MODE_LEVEL_KEY);
    } catch (error) {
        console.error("Failed to reset progress in localStorage", error);
    }
};
