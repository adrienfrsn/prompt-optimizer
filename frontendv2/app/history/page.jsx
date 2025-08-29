"use client"

import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { History, Copy, Search, Filter, Calendar, Bot, Sparkles, TrendingUp, Clock, User, CheckCircle2, Trash2 } from 'lucide-react';
import Header from '@/components/Header';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [copySuccess, setCopySuccess] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set())

  const models = [
    { value: '', label: 'All Models' },
    { value: 'GPT-4', label: 'GPT-4' },
    { value: 'GPT-3.5', label: 'GPT-3.5' },
    { value: 'Claude 4', label: 'Claude 4' },
    { value: 'Claude 3', label: 'Claude 3' },
    { value: 'Gemini Pro', label: 'Gemini Pro' },
    { value: 'Gemini Flash', label: 'Gemini Flash' },
    { value: 'Mistral', label: 'Mistral' },
    { value: 'LLaMA 3', label: 'LLaMA 3' }
  ];

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
    else {
      fetchHistory();
    }
  }, [router]);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, selectedModel, sortBy]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/prompt/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = history.filter(item => {
      const matchesSearch = 
        item.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.optimizedPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelUsed.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesModel = !selectedModel || item.modelUsed === selectedModel;
      
      return matchesSearch && matchesModel;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'best-score':
          return b.optimizedScore - a.optimizedScore;
        case 'improvement':
          return (b.optimizedScore - b.baseScore) - (a.optimizedScore - a.baseScore);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`Delete ${selectedItems.size} selected item(s)?`)) {
      const idsArrays = Array.from(selectedItems);
      const response = await fetch('http://localhost:8080/api/prompt/history', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(idsArrays)
      });
      if (response.ok) {
        const newHistory = history.filter(item => !selectedItems.has(item.id));
        setHistory(newHistory);
        setSelectedItems(new Set());
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getModelIcon = (model) => {
    switch (model.toLowerCase()) {
      case 'gpt-4':
      case 'gpt-3.5':
        return '🧠';
      case 'claude 4':
      case 'claude 3':
        return '🎭';
      case 'gemini pro':
      case 'gemini flash':
        return '💎';
      case 'mistral':
        return '🌪️';
      case 'llama 3':
        return '🦙';
      default:
        return '🤖';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <History className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-lg text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto p-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
            <History className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Prompt History</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Review and manage your optimized prompts
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex gap-3 items-center">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-[140px]"
                >
                  {models.map(model => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-[160px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="best-score">Best Score</option>
                  <option value="improvement">Most Improved</option>
                </select>
              </div>

              {selectedItems.size > 0 && (
                <button
                  onClick={deleteSelectedItems}
                  className="flex items-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete ({selectedItems.size})
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredHistory.length} of {history.length} prompts
            </span>
            <span>
              {selectedItems.size > 0 && `${selectedItems.size} selected`}
            </span>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="space-y-6">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
                  selectedItems.has(item.id) 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800' 
                    : 'border-white/20 dark:border-gray-700/20 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:bg-gray-700"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getModelIcon(item.modelUsed)}</span>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{item.modelUsed}</span>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(item.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Original</div>
                        <div className="font-bold text-gray-700 dark:text-gray-300">{item.baseScore}/100</div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <div className="text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Optimized</div>
                        <div className="font-bold text-green-600 dark:text-green-400">{item.optimizedScore}/100</div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                        +{item.optimizedScore - item.baseScore}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <Bot className="w-4 h-4 mr-2" />
                          Original Prompt
                        </label>
                        <button
                          onClick={() => copyToClipboard(item.originalPrompt, `original-${item.id}`)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy original prompt"
                        >
                          {copySuccess === `original-${item.id}` ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {item.originalPrompt}
                        </pre>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                          Optimized Prompt
                        </label>
                        <button
                          onClick={() => copyToClipboard(item.optimizedPrompt, `optimized-${item.id}`)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy optimized prompt"
                        >
                          {copySuccess === `optimized-${item.id}` ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {item.optimizedPrompt}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <History className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No History Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || selectedModel 
                ? 'Try adjusting your search or filter criteria'
                : 'Start optimizing prompts to build your history'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedModel('');
              }}
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}