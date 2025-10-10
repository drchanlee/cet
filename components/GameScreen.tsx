import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrainingMode, Level, Sample, QuestionResult, AudioSource } from '../types';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { QUESTIONS_PER_SESSION } from '../constants';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { LoopIcon } from './icons/LoopIcon';
import { LEVELS_DATA } from '../data/levels';
import { saveGameModeLevel } from '../services/localStorageService';

interface GameScreenProps {
  mode: TrainingMode;
  initialLevel: Level;
  samples: Sample[];
  onGameEnd: (results: any) => void;
  onGoBack: () => void;
  isGameMode: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ mode, initialLevel, samples, onGameEnd, onGoBack, isGameMode }) => {
    const [questionNumber, setQuestionNumber] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [sessionResults, setSessionResults] = useState<QuestionResult[]>([]);
    
    const { loadAudio, setupAudioGraph, updateCompressorParams, togglePlayPause, stop, setSource, getReductionValue, isPlaying, isLooping, isLoading, loadingMessage, activeSource, toggleLoop } = useAudioEngine();
    
    const [reduction, setReduction] = useState(0);
    const [levelUpMessage, setLevelUpMessage] = useState('');

    // Game Mode State
    const [currentLevel, setCurrentLevel] = useState(initialLevel);
    const [correctInLevel, setCorrectInLevel] = useState(0);
    const [streakInLevel, setStreakInLevel] = useState(0);

    // Mode-specific state
    const [xSource, setXSource] = useState<'A' | 'B' | null>(null); // For ABX, what is X?
    const [activeButton, setActiveButton] = useState<'A'|'B'|'X'|null>(null);

    const getRandomFromRange = (range: [number, number]) => {
        return Math.random() * (range[1] - range[0]) + range[0];
    }
    
    const generateQuestion = useCallback((levelForQuestion: Level) => {
        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        let questionParams: any = { sample: randomSample };
        let correctAnswer: string;
    
        const levelParams = levelForQuestion.params;
    
        switch (mode.id) {
            case 'compressor_presence':
                const isCompressed = Math.random() > 0.5;
                if (isCompressed) {
                    questionParams = { ...questionParams, ...levelParams };
                    correctAnswer = mode.answerOptions[0];
                } else {
                    questionParams = { ...questionParams, ratio: 1, threshold: 0, attack_ms: 0, release_ms: 0, knee_db: 0 };
                    correctAnswer = mode.answerOptions[1];
                }
                break;
            case 'attack':
                const isFastAttack = Math.random() > 0.5;
                questionParams = { ...questionParams, ...levelParams, attack_ms: isFastAttack ? getRandomFromRange(levelParams.fast_ms) : getRandomFromRange(levelParams.slow_ms) };
                correctAnswer = isFastAttack ? mode.answerOptions[0] : mode.answerOptions[1];
                break;
            case 'release':
                const isFastRelease = Math.random() > 0.5;
                questionParams = { ...questionParams, ...levelParams, release_ms: isFastRelease ? getRandomFromRange(levelParams.fast_ms) : getRandomFromRange(levelParams.slow_ms) };
                correctAnswer = isFastRelease ? mode.answerOptions[0] : mode.answerOptions[1];
                break;
            case 'abx_test':
                questionParams.paramsA = { ratio: 1, threshold: 0, attack_ms: 0, release_ms: 0, knee_db: 0 }; // A is always dry
                questionParams.paramsB = { ...levelParams }; // B is always wet
                const xIsA = Math.random() > 0.5;
                setXSource(xIsA ? 'A' : 'B');
                correctAnswer = xIsA ? mode.answerOptions[0] : mode.answerOptions[1]; // 'X = A' or 'X = B'
                break;
            case 'detective':
                const changeType = ['attack', 'release', 'ratio', 'none'][Math.floor(Math.random() * 4)];
                const baseParams = { ...levelParams.base };
                const modifiedParams = { ...baseParams };
                
                switch(changeType) {
                    case 'attack':
                        modifiedParams.attack_ms *= (Math.random() > 0.5 ? levelParams.delta_factor : 1 / levelParams.delta_factor);
                        correctAnswer = 'Attack שונה';
                        break;
                    case 'release':
                        modifiedParams.release_ms *= (Math.random() > 0.5 ? levelParams.delta_factor : 1 / levelParams.delta_factor);
                        correctAnswer = 'Release שונה';
                        break;
                    case 'ratio':
                        const newRatio = modifiedParams.ratio * (Math.random() > 0.5 ? levelParams.delta_factor : 1 / levelParams.delta_factor);
                        modifiedParams.ratio = Math.max(1.1, Math.min(20, newRatio));
                        correctAnswer = 'Ratio שונה';
                        break;
                    case 'none':
                    default:
                         correctAnswer = 'אין הבדל';
                         break;
                }
                if (Math.random() > 0.5) {
                    questionParams.paramsA = baseParams;
                    questionParams.paramsB = modifiedParams;
                } else {
                    questionParams.paramsA = modifiedParams;
                    questionParams.paramsB = baseParams;
                }
                break;
            case 'glue_vs_limiter':
                const isGlue = Math.random() > 0.5;
                // paramsA is Glue, paramsB is Limiter from levels.ts
                const chosenParams = isGlue ? { ...levelParams.paramsA } : { ...levelParams.paramsB };
                
                const targetGR = getRandomFromRange(chosenParams.gr_db || [3, 5]);
                chosenParams.threshold = -20 - targetGR;

                questionParams = { ...questionParams, ...chosenParams };
                // answerOptions are now ['Glue', 'Limiter']
                correctAnswer = isGlue ? mode.answerOptions[0] : mode.answerOptions[1];
                break;
        }

        if (mode.id !== 'detective' && mode.id !== 'abx_test' && mode.id !== 'glue_vs_limiter') {
             const targetGR = getRandomFromRange(levelParams.gr_db || [3, 5]);
             questionParams.threshold = -20 - targetGR;
        } else if (mode.id === 'detective') {
            const targetGRA = getRandomFromRange(questionParams.paramsA.gr_db || [3, 5]);
            questionParams.paramsA.threshold = -20 - targetGRA;
            const targetGRB = getRandomFromRange(questionParams.paramsB.gr_db || [3, 5]);
            questionParams.paramsB.threshold = -20 - targetGRB;
        }

        return { ...questionParams, correctAnswer };
    }, [mode, samples]);
    
    useEffect(() => {
        setCurrentQuestion(generateQuestion(currentLevel));
    }, []);

    useEffect(() => {
        const prepareAudioForQuestion = async () => {
            if (currentQuestion) {
                stop();
                await loadAudio(currentQuestion.sample.url);
                let initialParams = currentQuestion;

                if (mode.id === 'abx_test') {
                    // For ABX, the single compressor (Path B) must be configured with the "wet" params.
                    initialParams = currentQuestion.paramsB;
                } else if (mode.id === 'detective') {
                    // For Detective, we initialize with the params for "Sample A". The user will then switch.
                    initialParams = currentQuestion.paramsA;
                }

                await setupAudioGraph(initialParams);

                if (mode.id === 'detective' || mode.id === 'glue_vs_limiter') {
                    // We set the active path to 'B' (the wet/compressor path), as both A and B are compressed in these modes.
                    setSource('B');
                } else {
                    // For all other modes, we default to hearing Path A (dry) first.
                    setSource('A'); 
                }
                setActiveButton(null);
            }
        };
        prepareAudioForQuestion();
    }, [currentQuestion]);
    
    useEffect(() => {
        let animationFrameId: number;
        if (isPlaying) {
            const animate = () => {
                setReduction(getReductionValue());
                animationFrameId = requestAnimationFrame(animate);
            };
            animate();
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, getReductionValue]);

    const handleAnswer = (answer: string) => {
        if (isRevealed) return;
        setUserAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        if (correct) {
            setScore(s => s + 10 + streak);
            const newStreak = streak + 1;
            setStreak(newStreak);
            if(newStreak > maxStreak) setMaxStreak(newStreak);

            if (isGameMode) {
                const newCorrectCount = correctInLevel + 1;
                const newStreakInLevel = streakInLevel + 1;
                setCorrectInLevel(newCorrectCount);
                setStreakInLevel(newStreakInLevel);

                const shouldLevelUp = newCorrectCount >= 7 || newStreakInLevel >= 5;
                if (shouldLevelUp && currentLevel.level < 8) {
                    const nextLevelNum = currentLevel.level + 1;
                    const modeLevels = LEVELS_DATA[mode.id as keyof typeof LEVELS_DATA];
                    const nextLevelData = modeLevels.find(l => l.level === nextLevelNum);
                    if (nextLevelData) {
                        const newLevelObject = { level: nextLevelNum, description: nextLevelData.description, params: nextLevelData };
                        setCurrentLevel(newLevelObject);
                        saveGameModeLevel(nextLevelNum);
                        setCorrectInLevel(0);
                        setStreakInLevel(0);
                        setLevelUpMessage(`כל הכבוד! עלית לרמה ${nextLevelNum}`);
                        setTimeout(() => setLevelUpMessage(''), 3000);
                    }
                }
            }
        } else {
            setStreak(0);
            if (isGameMode) {
                setStreakInLevel(0);
            }
        }
        setSessionResults(prev => [...prev, {
            questionNumber,
            correct,
            userAnswer: answer,
            correctAnswer: currentQuestion.correctAnswer,
            params: currentQuestion,
        }]);
        setIsRevealed(true);
    };

    const handleNextQuestion = () => {
        if (questionNumber >= QUESTIONS_PER_SESSION) {
            stop();
            onGameEnd({
                score,
                maxStreak,
                accuracy: (sessionResults.filter(r => r.correct).length / sessionResults.length) * 100,
                questions: sessionResults,
            });
            return;
        }
        setIsRevealed(false);
        setUserAnswer(null);
        setQuestionNumber(q => q + 1);
        setCurrentQuestion(generateQuestion(currentLevel));
    };
    
    const handleGoBack = () => {
        stop();
        onGoBack();
    };

    const handlePlaySource = (source: 'A' | 'B' | 'X') => {
        setActiveButton(source);
        if (mode.id === 'detective') {
            const params = source === 'A' ? currentQuestion.paramsA : currentQuestion.paramsB;
            updateCompressorParams(params);
        } else if (mode.id === 'abx_test') {
            if (source === 'X') {
                if (xSource) setSource(xSource);
            } else {
                setSource(source as 'A' | 'B');
            }
        } else {
             setSource(source as 'A' | 'B');
        }
    }

    const answerFeedbackClasses = (option: string) => {
        if (!isRevealed) return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
        const isCorrect = currentQuestion.correctAnswer === option;
        const isUserChoice = userAnswer === option;

        if (isCorrect) return 'bg-green-500 text-white';
        if (isUserChoice && !isCorrect) return 'bg-red-500 text-white';
        return 'bg-gray-100 dark:bg-gray-800 opacity-50';
    };
    
    const grMeterWidth = useMemo(() => {
        const gr = Math.abs(reduction);
        const maxGR = 30;
        const grClamped = Math.max(0, Math.min(maxGR, gr));
        return (grClamped / maxGR) * 100;
    }, [reduction]);

    const renderAudioControls = () => {
        const getButtonClass = (source: 'A'|'B'|'X') => {
            const isActive = activeButton === source;
            
            if (mode.id === 'abx_test' || mode.id === 'detective') {
                 if (source === 'X') return `px-8 py-3 rounded-lg font-bold transition-all ${isActive ? 'bg-yellow-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700'}`
                 return `px-8 py-3 rounded-lg font-bold transition-all ${isActive ? (source === 'A' ? 'bg-purple-500' : 'bg-indigo-500') + ' text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700'}`;
            }

            // Default
            const baseActiveSource = activeSource as 'A' | 'B';
            return `px-8 py-3 rounded-lg font-bold transition-all ${baseActiveSource === source ? (source === 'A' ? 'bg-purple-500' : 'bg-indigo-500') + ' text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700'}`;
        }

        if (mode.id === 'detective') {
            return (
                <div className="flex gap-2 mt-4">
                    <button onClick={() => handlePlaySource('A')} className={getButtonClass('A')}>סמפל A</button>
                    <button onClick={() => handlePlaySource('B')} className={getButtonClass('B')}>סמפל B</button>
                </div>
            )
        }
        if (mode.id === 'abx_test') {
            const labelA = 'A (יבש)';
            const labelB = 'B (דחוס)';
            return (
                <div className="flex gap-2 mt-4">
                    <button onClick={() => handlePlaySource('A')} className={getButtonClass('A')}>{labelA}</button>
                    <button onClick={() => handlePlaySource('B')} className={getButtonClass('B')}>{labelB}</button>
                    <button onClick={() => handlePlaySource('X')} className={getButtonClass('X')}>X</button>
                </div>
            )
        }
        return (
            <div className="flex gap-2 mt-4">
                <button onClick={() => handlePlaySource(AudioSource.A)} className={getButtonClass(AudioSource.A)}>A (יבש)</button>
                <button onClick={() => handlePlaySource(AudioSource.B)} className={getButtonClass(AudioSource.B)}>B (דחוס)</button>
            </div>
        )
    }

    if (isLoading || !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-purple-500 dark:border-purple-400 border-dashed rounded-full animate-spin"></div>
                <p className="mt-4 text-lg">{loadingMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col relative">
             {levelUpMessage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white p-6 rounded-xl z-50 text-3xl font-bold shadow-lg">
                    {levelUpMessage}
                </div>
            )}
            <div className="w-full flex justify-end mb-4">
                <button onClick={handleGoBack} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    חזור
                </button>
            </div>
            <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col" dir="rtl">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mode.name} - רמה {currentLevel.level}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{mode.description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg">שאלה <span className="font-bold">{questionNumber}</span> / {QUESTIONS_PER_SESSION}</p>
                        <p className="text-lg">ניקוד: <span className="font-bold text-purple-600 dark:text-purple-400">{score}</span></p>
                        <p className="text-lg">רצף: <span className="font-bold text-yellow-500 dark:text-yellow-400">{streak}</span></p>
                    </div>
                </header>
                
                <main className="flex-grow flex flex-col md:flex-row gap-6 items-center justify-center">
                    <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                        <h2 className="text-xl font-semibold mb-2">שליטה</h2>
                        <div className="flex items-center gap-4">
                            <button onClick={togglePlayPause} className="p-4 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-transform transform hover:scale-110">
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <button onClick={toggleLoop} className={`p-3 rounded-full ${isLooping ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <LoopIcon />
                            </button>
                        </div>
                        {renderAudioControls()}
                        {isRevealed && (
                             <div className="mt-4 w-full text-center">
                                <h3 className="text-lg font-semibold">Gain Reduction</h3>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2 overflow-hidden">
                                    <div className="bg-yellow-400 h-full" style={{ width: `${grMeterWidth}%` }}></div>
                                </div>
                             </div>
                        )}
                    </div>
                    
                    <div className="w-full md:w-2/3 flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">מה אתה שומע?</h2>
                        <div className={`grid gap-4 w-full max-w-sm ${mode.answerOptions.length > 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                            {mode.answerOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    disabled={isRevealed}
                                    className={`p-6 rounded-lg text-xl font-bold transition-all duration-300 ${answerFeedbackClasses(option)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {isRevealed && (
                            <div className="mt-6 text-center bg-gray-100 dark:bg-gray-900 p-4 rounded-lg w-full max-w-sm">
                                <h3 className={`text-2xl font-bold ${userAnswer === currentQuestion.correctAnswer ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {userAnswer === currentQuestion.correctAnswer ? 'תשובה נכונה!' : 'תשובה שגויה'}
                                </h3>
                                <p className="mt-2 text-lg">התשובה הנכונה היא: <span className="font-bold text-purple-600 dark:text-purple-400">{currentQuestion.correctAnswer}</span></p>
                                <button onClick={handleNextQuestion} className="mt-4 px-6 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105">
                                    {questionNumber === QUESTIONS_PER_SESSION ? 'סיים משחק' : 'שאלה הבאה'}
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GameScreen;