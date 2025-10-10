
import React from 'react';
import { SessionResults, TrainingMode, Level } from '../types';

interface ResultsScreenProps {
  results: SessionResults;
  onPlayAgain: () => void;
  mode: TrainingMode | null;
  level: Level | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onPlayAgain, mode, level }) => {
  if (!results) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">אין נתונים להצגה</h1>
        <button onClick={onPlayAgain} className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600">
          חזור למסך הראשי
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">סיכום סשן</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        {mode?.name} - רמה {level?.level}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">ניקוד סופי</p>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{results.score}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">דיוק</p>
          <p className="text-4xl font-bold text-indigo-500 dark:text-indigo-400">{results.accuracy.toFixed(0)}%</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">רצף שיא</p>
          <p className="text-4xl font-bold text-yellow-500 dark:text-yellow-400">{results.maxStreak}</p>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">פירוט שאלות</h2>
        <div className="max-h-64 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 rounded-lg space-y-2">
          {results.questions.map((q, index) => (
            <div key={index} className={`p-3 rounded-md flex justify-between items-center ${q.correct ? 'bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-red-500/20 text-red-800 dark:text-red-300'}`}>
              <span className="font-bold">שאלה #{q.questionNumber}</span>
              <span>התשובה שלך: <span className="font-semibold">{q.userAnswer}</span></span>
              {!q.correct && <span>התשובה הנכונה: <span className="font-semibold">{q.correctAnswer}</span></span>}
              {q.correct ? 
                <span className="text-green-600 dark:text-green-400 font-bold">✓ נכון</span> : 
                <span className="text-red-600 dark:text-red-400 font-bold">✗ שגוי</span>
              }
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">מה הלאה?</p>
          <div className="flex gap-4">
            <button onClick={onPlayAgain} className="px-8 py-4 bg-purple-500 text-white font-bold text-lg rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105">
                שחק שוב
            </button>
            <button onClick={onPlayAgain} className="px-8 py-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold text-lg rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-transform transform hover:scale-105">
                שנה הגדרות
            </button>
          </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
