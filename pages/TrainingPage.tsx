import React, { useState, useEffect, useCallback } from 'react';
import type { GlossaryTerm } from '../types';
import { glossaryData } from '../data/glossaryData';
import { RefreshCw, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import type { Translations } from '../hooks/useTranslations';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface Question {
  term: GlossaryTerm;
  options: string[];
  correctAnswer: string;
}

interface TrainingPageProps {
    t: Translations;
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ t }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);

  const generateQuestion = useCallback(() => {
    const termsWithMeaning = glossaryData.filter(term => term.meaning && term.meaning.trim() !== '');
    
    if (termsWithMeaning.length < 4) {
      setQuestion(null);
      return;
    }
    
    const shuffledTerms = shuffleArray(termsWithMeaning);
    const selectedTerms = shuffledTerms.slice(0, 4);

    const correctTerm = selectedTerms[0];
    const options = shuffleArray(selectedTerms.map(t => t.meaning));
    
    setQuestion({
      term: correctTerm,
      options,
      correctAnswer: correctTerm.meaning,
    });

    setSelectedAnswer(null);
    setIsAnswered(false);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setTotalAsked(prev => prev + 1);
    if (answer === question?.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setTotalAsked(0);
    generateQuestion();
  };

  const getButtonClass = (answer: string) => {
    if (!isAnswered) {
      return 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border-transparent';
    }
    if (answer === question?.correctAnswer) {
      return 'bg-green-100 dark:bg-green-500/20 border-green-500 text-green-800 dark:text-green-300';
    }
    if (answer === selectedAnswer) {
      return 'bg-red-100 dark:bg-red-500/20 border-red-500 text-red-800 dark:text-red-300';
    }
    return 'bg-gray-100 dark:bg-white/5 border-transparent opacity-60';
  };
  
  const getIcon = (answer: string) => {
    if (!isAnswered) return null;
    if (answer === question?.correctAnswer) return <CheckCircle className="text-green-500" />;
    if (answer === selectedAnswer) return <XCircle className="text-red-500" />;
    return null;
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">{t.notEnoughData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{t.trainingMode}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t.trainingSubtitle}</p>
      </div>
      
      <div className="bg-white dark:bg-black/30 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20 flex justify-between items-center">
        <div className="text-lg">
          <span className="font-semibold text-gray-800 dark:text-white">{t.score}: </span>
          <span className="font-bold text-cyan-600 dark:text-cyan-300">{score} / {totalAsked}</span>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20"
        >
          <RefreshCw size={16} />
          <span>{t.restart}</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-black/30 p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-cyan-400/20">
        <p className="text-lg text-gray-600 dark:text-gray-400">{t.whatIsMeaningOf}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
            <ruby>
                {question.term.term}
                <rt className="text-base font-normal text-cyan-600 dark:text-cyan-400/80">{question.term.reading}</rt>
            </ruby>
        </h3>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={isAnswered}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 flex justify-between items-start gap-3 ${getButtonClass(option)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-gray-800 dark:text-gray-200">{option}</span>
              {getIcon(option)}
            </button>
          ))}
        </div>
      </div>
      
      {isAnswered && (
        <div className="flex justify-end animate-fade-in-slow">
            <button
              onClick={generateQuestion}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900"
            >
              <span>{t.nextQuestion}</span>
              <ArrowRight size={20} />
            </button>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        
        @keyframes fade-in-slow {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in-slow { animation: fade-in-slow 0.5s ease-out 0.3s forwards; animation-fill-mode: backwards; }
      `}</style>
    </div>
  );
};