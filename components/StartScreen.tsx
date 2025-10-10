import React, { useState, useMemo } from 'react';
import { TrainingMode, Level, Sample, Stats, SamplePack } from '../types';
import { TRAINING_MODES, SAMPLE_PACKS } from '../constants';
import { SAMPLES } from '../data/samples';
import { LEVELS_DATA } from '../data/levels';
import { getGameModeLevel } from '../services/localStorageService';

interface StartScreenProps {
  onStart: (mode: TrainingMode, level: Level, samples: Sample[], isGameMode: boolean) => void;
  stats: Stats;
  onReset: () => void;
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="relative group" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help w-5 h-5 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-bold text-xs">?</span>
      <div className="absolute bottom-full mb-2 w-64 p-3 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" style={{ right: '50%', transform: 'translateX(50%)'}}>
        {text}
      </div>
    </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart, stats, onReset }) => {
  const [selectedMode, setSelectedMode] = useState<TrainingMode>(TRAINING_MODES[0]);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedSamplePack, setSelectedSamplePack] = useState<SamplePack>(SAMPLE_PACKS[0]);
  const [isGameMode, setIsGameMode] = useState(false);

  const levelsForMode = useMemo(() => {
    const modeKey = selectedMode.id as keyof typeof LEVELS_DATA;
    return LEVELS_DATA[modeKey].map(l => ({
      level: l.level,
      description: l.description,
      params: l
    }));
  }, [selectedMode]);

  const handleStart = () => {
    let startingLevelNumber = selectedLevel;
    if (isGameMode) {
      startingLevelNumber = getGameModeLevel();
    }
    const levelData = levelsForMode.find(l => l.level === startingLevelNumber);

    if (levelData) {
      const samples = SAMPLES.filter(s => 
        selectedSamplePack.tags.some(tag => s.tags.includes(tag))
      );
      onStart(selectedMode, levelData, samples.length > 0 ? samples : SAMPLES, isGameMode);
    }
  };

  const getLevelStats = (modeId: string, level: number): string => {
    const levelStat = stats[modeId]?.[level];
    if (levelStat && levelStat.attempts > 0) {
      return `דיוק: ${levelStat.accuracy.toFixed(0)}%`;
    }
    if (level <= 2) return 'מתחיל';
    if (level <= 4) return 'בינוני';
    if (level <= 6) return 'מאתגר';
    return 'מתקדם';
  };
  
  const getModeTooltipText = (modeId: string) => {
      if (modeId === 'abx_test') {
          return "מצב שבו המשתמש שומע את A (יבש) ו-B (דחוס), ואז מקבל מקור שלישי, X, שהוא באופן אקראי או A או B. המשימה היא לזהות האם X הוא A או B. זוהי הדרך המדעית והמדויקת ביותר לבצע מבחן האזנה עיוור.";
      }
      if (modeId === 'detective') {
          return "במקום להגיד לך מה לחפש, אנו מציגים שני סמפלים (A ו-B) ושואלים: 'מה ההבדל?'. אפשרויות התשובה יהיו: 'Attack שונה', 'Release שונה', 'Ratio שונה', או 'אין הבדל'. זה מדמה מצב מיקס אמיתי.";
      }
      if (modeId === 'glue_vs_limiter') {
        return "אימון מתקדם להבחנה בין שני סוגי דחיסה נפוצים על מיקס שלם: Bus Glue שנועד 'להדביק' את הכלים יחד בעדינות, ו-Limiter שנועד להגביר עוצמה ולחתוך פיקים בצורה אגרסיבית. בכל שאלה תשמע סמפל דחוס ותצטרך לקבוע אם מדובר ב-Glue או Limiter.";
      }
      return '';
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 text-center">מאמן שמיעה לקומפרסיה</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">חדד את יכולות השמיעה שלך ולמד לזהות דחיסה כמו מקצוען.</p>
      
      <div className="w-full space-y-6">
        {/* Training Mode Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">1. בחר סוג אימון</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TRAINING_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode)}
                className={`p-4 rounded-lg text-center transition-all duration-200 relative ${selectedMode.id === mode.id ? 'bg-purple-500 text-white shadow-lg ring-2 ring-purple-300' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {(mode.id === 'abx_test' || mode.id === 'detective' || mode.id === 'glue_vs_limiter') && (
                    <div className="absolute top-2 left-2">
                        <InfoTooltip text={getModeTooltipText(mode.id)} />
                    </div>
                )}
                <span className="font-bold">{mode.name}</span>
                <p className="text-xs mt-1 opacity-80">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className={`transition-opacity duration-300 ${isGameMode ? 'opacity-50' : 'opacity-100'}`}>
          <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">2. בחר רמת קושי</h2>
          <div 
            className="grid grid-cols-4 md:grid-cols-8 gap-2"
            style={{ pointerEvents: isGameMode ? 'none' : 'auto' }}
          >
            {levelsForMode.map(level => (
              <button
                key={level.level}
                onClick={() => setSelectedLevel(level.level)}
                className={`p-2 aspect-square flex flex-col justify-center items-center rounded-lg transition-all duration-200 ${selectedLevel === level.level && !isGameMode ? 'bg-purple-500 text-white shadow-lg ring-2 ring-purple-300' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                title={level.description}
              >
                <span className="text-2xl font-bold">{level.level}</span>
                <span className="text-xs opacity-80">{getLevelStats(selectedMode.id, level.level)}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Game Mode */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsGameMode(prev => !prev)} 
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isGameMode ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    מצב משחק
                </button>
                 <div className="relative group">
                    <span className="cursor-help w-6 h-6 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-bold">!</span>
                    <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ right: '50%', transform: 'translateX(50%)'}}>
                        התקדם אוטומטית בין הרמות. עליית רמה מתרחשת אחרי 5 תשובות נכונות ברצף או 7 תשובות נכונות בסך הכל ברמה הנוכחית. ההתקדמות נשמרת.
                    </div>
                </div>
            </div>
        </div>

        {/* Sample Pack Selection */}
        <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">3. בחר חבילת סמפלים</h2>
            <div className="flex flex-wrap gap-2">
                {SAMPLE_PACKS.map(pack => (
                    <button
                        key={pack.name}
                        onClick={() => setSelectedSamplePack(pack)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedSamplePack.name === pack.name ? 'bg-purple-500 text-white ring-2 ring-purple-300' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        {pack.name}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="w-full mt-10 py-4 px-8 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg"
      >
        {isGameMode ? 'המשך אימון!' : 'התחל אימון!'}
      </button>

      <div className="mt-6 text-center">
        <button onClick={onReset} className="text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors underline">
            איפוס התקדמות וסטטיסטיקה
        </button>
      </div>
    </div>
  );
};

export default StartScreen;