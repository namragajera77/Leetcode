import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAI from '../components/ChatAI';
import Editorial from '../components/Editorial';

const langMap = {
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript'
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [expandedTestCase, setExpandedTestCase] = useState(null);
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  const { handleSubmit } = useForm();

  // Helper functions for localStorage
  const getStorageKey = (key) => `problem_${problemId}_${key}`;
  
  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };
  
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(getStorageKey(key));
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  };

  // Load persisted state on component mount
  useEffect(() => {
    const persistedLanguage = loadFromStorage('selectedLanguage', 'javascript');
    const persistedLeftTab = loadFromStorage('activeLeftTab', 'description');
    const persistedRightTab = loadFromStorage('activeRightTab', 'code');
    
    setSelectedLanguage(persistedLanguage);
    setActiveLeftTab(persistedLeftTab);
    setActiveRightTab(persistedRightTab);
  }, [problemId]);

  // Save state changes to localStorage
  useEffect(() => {
    saveToStorage('selectedLanguage', selectedLanguage);
  }, [selectedLanguage, problemId]);

  useEffect(() => {
    saveToStorage('activeLeftTab', activeLeftTab);
  }, [activeLeftTab, problemId]);

  useEffect(() => {
    saveToStorage('activeRightTab', activeRightTab);
  }, [activeRightTab, problemId]);




  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        
        // Load persisted code for the current language, or use initial code
        const persistedCode = loadFromStorage(`code_${selectedLanguage}`, '');
        
        // Safely get initial code with fallback
        const startCodeForLang = response.data.startCode?.find(sc => sc.language === langMap[selectedLanguage]);
        const initialCode = startCodeForLang?.initialCode || '// Write your code here';
        
        setProblem(response.data);
        
        // Use persisted code if available, otherwise use initial code
        setCode(persistedCode || initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      // Load persisted code for the new language, or use initial code
      const persistedCode = loadFromStorage(`code_${selectedLanguage}`, '');
      
      // Safely get initial code with fallback
      const startCodeForLang = problem.startCode?.find(sc => sc.language === langMap[selectedLanguage]);
      const initialCode = startCodeForLang?.initialCode || '// Write your code here';
      
      setCode(persistedCode || initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    const newCode = value || '';
    setCode(newCode);
    // Save code to localStorage for the current language
    saveToStorage(`code_${selectedLanguage}`, newCode);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      // Backend auto-detects LeetCode-style vs Legacy based on functionMetadata
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      console.log(response)

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: error.response?.data || 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      // Backend auto-detects LeetCode-style vs Legacy based on functionMetadata
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code:code,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        success: false,
        error: error.response?.data || 'Submission failed'
      });
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const toggleTestCase = (index) => {
    setExpandedTestCase(expandedTestCase === index ? null : index);
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-900">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-slate-700/50">
        {/* Left Tabs */}
        <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 border-b border-slate-700/50">
          <div className="flex items-center gap-1">
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeLeftTab === 'description' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveLeftTab('description')}
            >
              Description
            </button>
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeLeftTab === 'editorial' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveLeftTab('editorial')}
            >
              Editorial
            </button>
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeLeftTab === 'solutions' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveLeftTab('solutions')}
            >
              Solutions
            </button>
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeLeftTab === 'submissions' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveLeftTab('submissions')}
            >
              Submissions
            </button>
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeLeftTab === 'chatAI' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveLeftTab('chatAI')}
            >
              AI Chat
            </button>
          </div>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div className="space-y-6">
                  {/* Problem Header */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                        {problem.tags}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-5">
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Problem Description</h2>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {problem.description}
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-300">Examples</h3>
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
                        <div className="text-xs font-medium text-emerald-400 mb-3">Example {index + 1}</div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Input:</div>
                            <pre className="font-mono text-xs bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">
{example.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 mb-1">Output:</div>
                            <pre className="font-mono text-xs bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">
{example.output}
                            </pre>
                          </div>
                          {example.explanation && (
                            <div>
                              <div className="text-xs text-slate-400 mb-1">Explanation:</div>
                              <div className="text-xs text-slate-300 leading-relaxed">
                                {example.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Editorial</h2>
                    <p className="text-sm text-slate-400">Detailed explanation and approach analysis</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-5">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Solutions</h2>
                    <p className="text-sm text-slate-400">Reference solutions for this problem</p>
                  </div>

                  <div className="space-y-4">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
                        <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white text-sm">{problem?.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/30">
                                {solution?.language}
                              </span>
                              <span className="text-xs text-slate-400">Solution #{index + 1}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <pre className="text-emerald-400 text-xs overflow-x-auto font-mono leading-relaxed bg-slate-900 p-3 rounded border border-slate-700/50">
<code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-slate-400 text-xl">🔒</span>
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-2">Solutions Locked</h3>
                        <p className="text-xs text-slate-400 mb-3">
                          Solutions will be available after you solve the problem.
                        </p>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded max-w-md mx-auto">
                          <p className="text-xs text-emerald-400">
                            Tip: Try solving the problem first, then compare your solution.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">My Submissions</h2>
                    <p className="text-sm text-slate-400">Track your submission history and performance</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-5">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="h-full">
                  <ChatAI problem={problem} problemId={problemId} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 border-b border-slate-700/50">
          <div className="flex items-center gap-1">
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeRightTab === 'code' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveRightTab('code')}
            >
              Code
            </button>
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeRightTab === 'testcase' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveRightTab('testcase')}
            >
              Testcase
            </button>
            <button 
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                activeRightTab === 'result' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveRightTab('result')}
            >
              Result
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-3 border-b border-slate-700/50 bg-slate-800/50">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                        selectedLanguage === lang 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t border-slate-700/50 bg-slate-800/50 flex justify-end items-center gap-2">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded transition-all border ${
                    loading ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-700 text-white hover:bg-slate-600 border-slate-600'
                  }`}
                  onClick={handleRun}
                  disabled={loading}
                >
                  {loading ? 'Running...' : 'Run Code'}
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                    loading ? 'bg-emerald-800 text-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
                
                {runResult ? (
                  <div className="space-y-4">
                    {runResult.success ? (
                      <>
                        {/* Success Status */}
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                          <span className="text-lg">✔</span>
                          <span className="font-medium">Accepted</span>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                            <div className="text-xs text-slate-400 mb-1">Runtime</div>
                            <div className="text-sm font-medium text-white">{runResult.runtime} sec</div>
                          </div>
                          <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                            <div className="text-xs text-slate-400 mb-1">Memory</div>
                            <div className="text-sm font-medium text-white">{runResult.memory} KB</div>
                          </div>
                        </div>

                        {/* Test Cases Accordions */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-slate-300 mb-2">Test Cases</div>
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="border border-emerald-500/30 rounded overflow-hidden">
                              <button
                                className="w-full flex items-center justify-between p-3 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                                onClick={() => toggleTestCase(i)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-emerald-400 text-sm">✓</span>
                                  <span className="text-sm text-white">Test Case {i + 1}</span>
                                </div>
                                <span className="text-slate-400 text-xs">
                                  {expandedTestCase === i ? '▼' : '▶'}
                                </span>
                              </button>
                              {expandedTestCase === i && (
                                <div className="p-3 bg-slate-800/50 border-t border-emerald-500/30 space-y-2">
                                  <div>
                                    <div className="text-xs text-slate-400 mb-1">Input</div>
                                    <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">{tc.stdin}</pre>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-400 mb-1">Expected</div>
                                    <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">{tc.expected_output}</pre>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-400 mb-1">Output</div>
                                    <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">{tc.stdout}</pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Error Status */}
                        <div className="flex items-center gap-3 text-red-400 mb-4">
                          <span className="text-lg">✖</span>
                          <span className="font-medium">Wrong Answer</span>
                        </div>

                        {/* Test Cases */}
                        <div className="space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className={`border rounded overflow-hidden ${
                              tc.status_id == 3 ? 'border-emerald-500/30' : 'border-red-500/30'
                            }`}>
                              <button
                                className={`w-full flex items-center justify-between p-3 transition-colors ${
                                  tc.status_id == 3 ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-red-500/5 hover:bg-red-500/10'
                                }`}
                                onClick={() => toggleTestCase(i)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm ${tc.status_id == 3 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {tc.status_id == 3 ? '✓' : '✗'}
                                  </span>
                                  <span className="text-sm text-white">Test Case {i + 1}</span>
                                  <span className={`text-xs ${tc.status_id == 3 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {tc.status_id == 3 ? 'Passed' : 'Failed'}
                                  </span>
                                </div>
                                <span className="text-slate-400 text-xs">
                                  {expandedTestCase === i ? '▼' : '▶'}
                                </span>
                              </button>
                              {expandedTestCase === i && (
                                <div className={`p-3 border-t space-y-2 ${
                                  tc.status_id == 3 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'
                                }`}>
                                  <div>
                                    <div className="text-xs text-slate-400 mb-1">Input</div>
                                    <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">{tc.stdin}</pre>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-400 mb-1">Expected</div>
                                    <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">{tc.expected_output}</pre>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-400 mb-1">Output</div>
                                    <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-2 rounded border border-slate-700/50 overflow-x-auto">{tc.stdout}</pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 mb-2">No results yet</div>
                    <p className="text-xs text-slate-500">
                      Click "Run Code" to test your solution
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Submission Result</h3>
                
                {submitResult ? (
                  <div className="space-y-4">
                    {submitResult.accepted ? (
                      <>
                        {/* Success Status */}
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                          <span className="text-lg">✔</span>
                          <span className="font-medium">Accepted</span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                            <div className="text-xs text-slate-400 mb-1">Test Cases</div>
                            <div className="text-lg font-semibold text-emerald-400">
                              {submitResult.passedTestCases}/{submitResult.totalTestCases}
                            </div>
                            <div className="text-xs text-slate-500">Passed</div>
                          </div>
                          <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                            <div className="text-xs text-slate-400 mb-1">Runtime</div>
                            <div className="text-lg font-semibold text-white">{submitResult.runtime}</div>
                            <div className="text-xs text-slate-500">seconds</div>
                          </div>
                          <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                            <div className="text-xs text-slate-400 mb-1">Memory</div>
                            <div className="text-lg font-semibold text-white">{submitResult.memory}</div>
                            <div className="text-xs text-slate-500">KB</div>
                          </div>
                        </div>

                        {/* Success Message */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-4">
                          <p className="text-sm text-emerald-300">
                            Congratulations! Your solution has been accepted.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Error Status */}
                        <div className="flex items-center gap-3 text-red-400 mb-4">
                          <span className="text-lg">✖</span>
                          <span className="font-medium">{submitResult.error}</span>
                        </div>

                        {/* Test Results */}
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded p-4">
                          <div className="text-xs text-slate-400 mb-1">Test Cases</div>
                          <div className="text-lg font-semibold text-white mb-2">
                            {submitResult.passedTestCases}/{submitResult.totalTestCases}
                          </div>
                          <div className="text-xs text-slate-400">
                            {submitResult.passedTestCases} test case(s) passed
                          </div>
                        </div>

                        {/* Tip */}
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
                          <p className="text-sm text-yellow-300">
                            Review your logic and try again. Consider edge cases and algorithm efficiency.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 mb-2">No submission yet</div>
                    <p className="text-xs text-slate-500">
                      Click "Submit" to evaluate your solution
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;


