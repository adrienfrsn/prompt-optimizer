"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Copy, Send, Bot, ChevronDown, AlertCircle, CheckCircle2, Zap, TrendingUp } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Header from '@/components/Header';
import axios from 'axios';

function PromptOptimizer() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [baseScore, setBaseScore] = useState(null);
  const [optimizedScore, setOptimizedScore] = useState(null);
  const [showScores, setShowScores] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');

  const models = [
    { value: 'gpt-4', label: 'GPT-4', icon: '🧠' },
    { value: 'gpt-3.5', label: 'GPT-3.5', icon: '⚡' },
    { value: 'claude-4', label: 'Claude 4', icon: '🎭' },
    { value: 'claude-3', label: 'Claude 3', icon: '🎨' },
    { value: 'gemini-pro', label: 'Gemini Pro', icon: '💎' },
    { value: 'gemini-flash', label: 'Gemini Flash', icon: '⚡' },
    { value: 'mistral', label: 'Mistral', icon: '🌪️' },
    { value: 'llama-3', label: 'LLaMA 3', icon: '🦙' }
  ];

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const buildPromptWithAnswers = () => {
    if (!questions.length) return prompt;

    let fullPrompt = prompt + '\n\nAdditional information:\n';
    questions.forEach((q, i) => {
      if (answers[i]?.trim()) {
        fullPrompt += `- ${q} ${answers[i]}\n`;
      }
    });
    return fullPrompt;
  };

  const copyOptimized = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const submitPrompt = async () => {
    if (!prompt.trim() || !model) return;
    
    if (questions.length > 0 && answers.some(a => !a?.trim())) {
      setError('Please answer all questions before proceeding');
      return;
    }

    setIsLoading(true);
    setError('');
    setBaseScore(null);
    setOptimizedScore(null);
    setShowScores(false);

    try {
      const response = await axios.post('http://localhost:8080/api/prompt/improve', {
        prompt: buildPromptWithAnswers(),
        model: model
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setIsLoading(false);

      if (response.data.optimizedPrompt) {
        setOptimizedPrompt(response.data.optimizedPrompt);
        setOptimizedScore(response.data.optimizedScore);
        setQuestions([]);
        setAnswers([]);
      } else if (response.data.questions) {
        setQuestions(response.data.questions);
        setAnswers(Array(response.data.questions.length).fill(''));
      }
    } catch (error) {
      console.error('Error during request:', error);
      setError('Failed to optimize prompt. Please try again.');
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const isSubmitDisabled = !prompt.trim() || !model || (questions.length > 0 && answers.some(a => !a?.trim())) || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="p-4">
        <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI Prompt Optimizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your prompts into powerful, optimized instructions that get better results from AI models
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <Bot className="w-5 h-5 mr-2 text-indigo-600" />
                Your Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here... Be as detailed as possible about what you want the AI to do."
                rows={6}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{prompt.length} characters</span>
                <span>Recommended: 50-500 characters</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                Target AI Model
              </label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="" disabled>Choose an AI model to optimize for</option>
                  {models.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.icon} {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {questions.length > 0 && (
              <div className="space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                    Help us optimize your prompt better
                  </h3>
                </div>
                <p className="text-blue-700 dark:text-blue-300">
                  Please provide additional context to generate the most effective prompt for your needs.
                </p>
                
                <div className="grid gap-4">
                  {questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">
                        {index + 1}. {question}
                      </label>
                      <input
                        type="text"
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-full p-3 border border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200"
                        placeholder="Your answer..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={submitPrompt}
                disabled={isSubmitDisabled}
                className={`flex-1 flex items-center justify-center py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  isSubmitDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Optimizing...
                  </>
                ) : (
                  <>
                    {questions.length ? <Send className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {questions.length ? 'Submit Information' : 'Optimize Prompt'}
                  </>
                )}
              </button>

              {optimizedPrompt && (
                <button
                  onClick={copyOptimized}
                  className="flex items-center justify-center py-4 px-6 border-2 border-indigo-500 text-indigo-600 rounded-2xl font-semibold hover:bg-indigo-50 transition-all duration-200"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Optimized
                    </>
                  )}
                </button>
              )}
            </div>

            {showScores && (baseScore !== null || optimizedScore !== null) && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Prompt Analysis</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {baseScore !== null && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Original Prompt</span>
                        <div className="flex items-center">
                          <span className="font-bold text-2xl text-gray-800 dark:text-gray-200 mr-2">{baseScore}</span>
                          <span className="text-gray-500 dark:text-gray-400">/100</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${getScoreColor(baseScore)}`}
                          style={{ width: `${baseScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        baseScore >= 80 ? 'text-green-600' : baseScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {getScoreLabel(baseScore)}
                      </span>
                    </div>
                  )}

                  {optimizedScore !== null && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Optimized Prompt</span>
                        <div className="flex items-center">
                          <span className="font-bold text-2xl text-gray-800 dark:text-gray-200 mr-2">{optimizedScore}</span>
                          <span className="text-gray-500 dark:text-gray-400">/100</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${getScoreColor(optimizedScore)}`}
                          style={{ width: `${optimizedScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        optimizedScore >= 80 ? 'text-green-600' : optimizedScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {getScoreLabel(optimizedScore)}
                      </span>
                      {baseScore !== null && optimizedScore > baseScore && (
                        <div className="mt-2 flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">+{optimizedScore - baseScore} improvement</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {optimizedPrompt && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">Optimized Prompt</h3>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-xl border border-green-200 dark:border-green-800 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed">
                    {optimizedPrompt}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PromptOptimizer />
  );
}