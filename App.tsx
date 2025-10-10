import React, { useState, useCallback, useEffect } from 'react';
import { GameState, TrainingMode, Level, Sample, Stats } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import { SAMPLES } from './data/samples';
import { getInitialStats, saveStats, resetProgress } from './services/localStorageService';
import ThemeToggleButton from './components/ThemeToggleButton';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [trainingMode, setTrainingMode] = useState<TrainingMode | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [samplePack, setSamplePack] = useState<Sample[]>(SAMPLES);
  const [sessionResults, setSessionResults] = useState<any>(null);
  const [stats, setStats] = useState<Stats>(getInitialStats());
  const [isGameMode, setIsGameMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleStartGame = useCallback((mode: TrainingMode, selectedLevel: Level, samples: Sample[], gameMode: boolean) => {
    setTrainingMode(mode);
    setLevel(selectedLevel);
    setSamplePack(samples);
    setIsGameMode(gameMode);
    setGameState(GameState.Playing);
  }, []);

  const handleGameEnd = useCallback((results: any) => {
    setSessionResults(results);
    const newStats = { ...stats };
    
    if (trainingMode && level) {
        const modeKey = trainingMode.id;
        if (!newStats[modeKey]) {
            newStats[modeKey] = {};
        }
        const existingLevelStats = newStats[modeKey][level.level] || { accuracy: 0, attempts: 0, bestStreak: 0 };
        const totalAttempts = existingLevelStats.attempts + results.questions.length;
        const correctAnswers = results.questions.filter((q: any) => q.correct).length;
        const oldCorrectAnswers = existingLevelStats.accuracy * existingLevelStats.attempts / 100;

        newStats[modeKey][level.level] = {
            accuracy: ((oldCorrectAnswers + correctAnswers) / totalAttempts) * 100,
            attempts: totalAttempts,
            bestStreak: Math.max(existingLevelStats.bestStreak, results.maxStreak),
        };
    }
    setStats(newStats);
    saveStats(newStats);
    setGameState(GameState.Results);
  }, [stats, trainingMode, level]);

  const handlePlayAgain = useCallback(() => {
    setGameState(GameState.Start);
    setSessionResults(null);
  }, []);
  
  const handleReset = useCallback(() => {
      if (window.confirm("האם אתה בטוח שברצונך לאפס את כל ההתקדמות והסטטיסטיקות?")) {
        resetProgress();
        setStats(getInitialStats());
        alert("ההתקדמות אופסה.");
      }
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        if (trainingMode && level) {
          return <GameScreen mode={trainingMode} initialLevel={level} samples={samplePack} onGameEnd={handleGameEnd} onGoBack={handlePlayAgain} isGameMode={isGameMode} />;
        }
        return <StartScreen onStart={handleStartGame} stats={stats} onReset={handleReset}/>;
      case GameState.Results:
        return <ResultsScreen results={sessionResults} onPlayAgain={handlePlayAgain} mode={trainingMode} level={level} />;
      case GameState.Start:
      default:
        return <StartScreen onStart={handleStartGame} stats={stats} onReset={handleReset} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 flex flex-col items-center p-4 font-sans">
        <header className="w-full max-w-4xl flex justify-between items-center pt-4 pb-2">
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
            <div className="text-center">
                <h1 className="text-5xl font-extrabold tracking-widest text-gray-900 dark:text-white uppercase">Mixing</h1>
                <p className="text-lg text-purple-600 dark:text-purple-400 font-light">by Dr. Chan</p>
            </div>
             <div className="w-12 h-12"></div> {/* Spacer */}
        </header>
        <main className="flex-grow w-full flex items-center justify-center py-4">
            {renderContent()}
        </main>
        <footer className="text-center text-xs text-gray-500 dark:text-gray-500 pb-2">
            <p>כל הזכויות שמורות לסאיי רקורדס ו Probeat</p>
        </footer>
    </div>
  );
};

export default App;