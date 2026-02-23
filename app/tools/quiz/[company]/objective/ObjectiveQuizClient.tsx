"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { ArrowLeft, Check, X, Loader2, Send, RotateCcw } from 'lucide-react';

interface ObjectiveQuestion {
  id: string;
  company: string;
  exam_year: number;
  section: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export default function ObjectiveQuizClient({ company }: { company: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ObjectiveQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [debug, setDebug] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [company]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('objective_questions')
        .select('*')
        .ilike('company', company);

      console.log('Questions:', data?.length, error);
      setDebug(`Found ${data?.length || 0} questions for ${company}`);
      
      if (error) throw error;
      setQuestions(shuffleArray(data || []).slice(0, 20));
    } catch (error: any) {
      console.error('Error:', error);
      setDebug(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      alert(`Please answer all ${questions.length} questions`);
      return;
    }

    setSubmitting(true);

    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) correct++;
    });

    setScore({ correct, total: questions.length });
    setSubmitting(false);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setScore({ correct: 0, total: 0 });
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background.muted }}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-2" size={32} style={{ color: theme.colors.primary.DEFAULT }} />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
        <div className="px-4 py-3" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
          <div className="max-w-lg mx-auto">
            <Link href={`/tools/quiz/${company.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <ArrowLeft size={18} />
              Back
            </Link>
          </div>
        </div>
        <div className="max-w-sm mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 mb-2">No questions found</p>
          <p className="text-xs text-gray-400">{debug}</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score.correct / score.total) * 100);

    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
        <div className="px-4 py-3" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href={`/tools/quiz/${company.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <ArrowLeft size={18} />
              Exit
            </Link>
            <span className="text-white text-sm font-medium">Results</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="bg-white rounded-xl p-6 text-center mb-4" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: percentage >= 70 ? '#10B98120' : '#EF444420' }}>
              <span className="text-2xl font-bold" style={{ color: percentage >= 70 ? theme.colors.success : theme.colors.error }}>
                {percentage}%
              </span>
            </div>
            <p className="text-gray-600 text-sm">{score.correct}/{score.total} correct</p>
          </div>

          <div className="space-y-3 mb-4">
            {questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correct_answer;

              return (
                <div key={q.id} className="bg-white rounded-lg p-3" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {isCorrect ? <Check size={12} /> : <X size={12} />}
                    </span>
                    <p className="text-sm font-medium text-gray-900 flex-1">Q{idx + 1}. {q.question_text}</p>
                  </div>
                  <div className="ml-7 space-y-1">
                    <p className="text-xs text-gray-600">Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAns}</span></p>
                    {!isCorrect && (
                      <p className="text-xs text-gray-500">Correct: <span className="text-green-600">{q.correct_answer}</span></p>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={restartQuiz} className="w-full py-3 rounded-lg font-medium text-sm" style={{ backgroundColor: theme.colors.primary.DEFAULT, color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.muted }}>
      <div className="px-4 py-3 sticky top-0 z-10" style={{ backgroundColor: theme.colors.primary.DEFAULT }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href={`/tools/quiz/${company.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
            <ArrowLeft size={18} />
            Exit
          </Link>
          <span className="text-white text-sm font-medium">{answeredCount}/{questions.length}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="mb-3">
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div className="h-full rounded-full" style={{ width: `${(answeredCount / questions.length) * 100}%`, backgroundColor: theme.colors.primary.DEFAULT }} />
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-lg p-4" style={{ border: `1px solid ${theme.colors.border.DEFAULT}` }}>
              <p className="text-sm font-medium text-gray-900 mb-3">Q{idx + 1}. {q.question_text}</p>

              <div className="space-y-2">
                {['A', 'B', 'C', 'D', 'E'].map(opt => {
                  const key = `option_${opt.toLowerCase()}` as keyof ObjectiveQuestion;
                  const text = q[key] as string;
                  if (!text) return null;

                  const isSelected = answers[q.id] === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSelect(q.id, opt)}
                      className={`w-full p-2.5 rounded-lg border text-left text-sm flex items-center gap-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {opt}
                      </span>
                      <span className="text-gray-700">{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < questions.length}
          className="w-full mt-4 py-3 rounded-lg font-medium text-sm disabled:opacity-50"
          style={{ backgroundColor: theme.colors.primary.DEFAULT, color: '#fff' }}
        >
          {submitting ? 'Submitting...' : `Submit (${answeredCount}/${questions.length})`}
        </button>
      </div>
    </div>
  );
}
