import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import { Bot, CheckCircle, ChevronDown, ChevronRight, Code2, FileText, History, Lightbulb, Play, Send, Terminal, XCircle } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAI from '../components/ChatAI';
import Editorial from '../components/Editorial';

const langMap = { cpp: 'cpp', java: 'java', javascript: 'javascript' };

const leftTabs = [
  ['description', FileText, 'Description'],
  ['editorial', Lightbulb, 'Editorial'],
  ['solutions', Code2, 'Solutions'],
  ['submissions', History, 'Submissions'],
  ['chatAI', Bot, 'AI Chat'],
];

const rightTabs = [
  ['code', Code2, 'Code'],
  ['testcase', Terminal, 'Testcase'],
  ['result', Send, 'Result'],
];

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
  const { problemId } = useParams();
  const { handleSubmit } = useForm();

  const getStorageKey = (key) => `problem_${problemId}_${key}`;
  const saveToStorage = (key, value) => {
    try { localStorage.setItem(getStorageKey(key), JSON.stringify(value)); } catch (error) { console.warn('Failed to save to localStorage:', error); }
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

  useEffect(() => {
    setSelectedLanguage(loadFromStorage('selectedLanguage', 'javascript'));
    setActiveLeftTab(loadFromStorage('activeLeftTab', 'description'));
    setActiveRightTab(loadFromStorage('activeRightTab', 'code'));
  }, [problemId]);

  useEffect(() => saveToStorage('selectedLanguage', selectedLanguage), [selectedLanguage, problemId]);
  useEffect(() => saveToStorage('activeLeftTab', activeLeftTab), [activeLeftTab, problemId]);
  useEffect(() => saveToStorage('activeRightTab', activeRightTab), [activeRightTab, problemId]);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const persistedCode = loadFromStorage(`code_${selectedLanguage}`, '');
        const startCodeForLang = response.data.startCode?.find((sc) => sc.language === langMap[selectedLanguage]);
        const initialCode = startCodeForLang?.initialCode || '// Write your code here';
        setProblem(response.data);
        setCode(persistedCode || initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (!problem) return;
    const persistedCode = loadFromStorage(`code_${selectedLanguage}`, '');
    const startCodeForLang = problem.startCode?.find((sc) => sc.language === langMap[selectedLanguage]);
    setCode(persistedCode || startCodeForLang?.initialCode || '// Write your code here');
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    const newCode = value || '';
    setCode(newCode);
    saveToStorage(`code_${selectedLanguage}`, newCode);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: error.response?.data || 'Internal server error' });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({ success: false, error: error.response?.data || 'Submission failed' });
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !problem) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-300"></span>
      </div>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <section className="flex min-h-0 flex-col border-r border-slate-700/50">
          <TabBar tabs={leftTabs} active={activeLeftTab} setActive={setActiveLeftTab} />
          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-950/70 p-5 lg:p-6">
            {problem && (
              <>
                {activeLeftTab === 'description' && <Description problem={problem} />}
                {activeLeftTab === 'editorial' && (
                  <PanelTitle title="Editorial" subtitle="Detailed explanation and approach analysis">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                  </PanelTitle>
                )}
                {activeLeftTab === 'solutions' && <Solutions problem={problem} />}
                {activeLeftTab === 'submissions' && (
                  <PanelTitle title="My Submissions" subtitle="Track your submission history and performance">
                    <SubmissionHistory problemId={problemId} />
                  </PanelTitle>
                )}
                {activeLeftTab === 'chatAI' && <ChatAI problem={problem} problemId={problemId} />}
              </>
            )}
          </div>
        </section>

        <section className="flex min-h-0 flex-col">
          <TabBar tabs={rightTabs} active={activeRightTab} setActive={setActiveRightTab} />
          <div className="min-h-0 flex-1 bg-slate-950">
            {activeRightTab === 'code' && (
              <form onSubmit={handleSubmit(handleSubmitCode)} className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-4 py-3">
                  <div className="flex gap-2">
                    {['javascript', 'java', 'cpp'].map((lang) => (
                      <button key={lang} type="button" className={`rounded-lg px-3 py-2 text-xs font-black transition ${selectedLanguage === lang ? 'bg-cyan-300 text-slate-950' : 'bg-slate-800 text-slate-300 ring-1 ring-slate-700 hover:bg-slate-700'}`} onClick={() => setSelectedLanguage(lang)}>
                        {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-h-0 flex-1">
                  <Editor
                    height="100%"
                    language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={(editor) => { editorRef.current = editor; }}
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
                      mouseWheelZoom: true,
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-700/50 bg-slate-900/80 p-3">
                  <button type="button" className="btn-secondary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black" onClick={handleRun} disabled={loading}>
                    <Play className="h-4 w-4" />
                    {loading ? 'Running...' : 'Run'}
                  </button>
                  <button type="button" className="btn-primary-premium inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black" onClick={handleSubmitCode} disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
            {activeRightTab === 'testcase' && <RunResults runResult={runResult} expandedTestCase={expandedTestCase} setExpandedTestCase={setExpandedTestCase} />}
            {activeRightTab === 'result' && <SubmitResults submitResult={submitResult} />}
          </div>
        </section>
      </div>
    </main>
  );
};

const TabBar = ({ tabs, active, setActive }) => (
  <div className="border-b border-slate-700/50 bg-slate-900/90 px-3 py-2">
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map(([id, Icon, label]) => (
        <button key={id} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-black transition ${active === id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`} onClick={() => setActive(id)}>
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  </div>
);

const Description = ({ problem }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-black text-white">{problem.title}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-md border px-3 py-1.5 text-xs font-black ${getDifficultyColor(problem.difficulty)}`}>{capitalize(problem.difficulty)}</span>
        <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-200">{formatTag(problem.tags)}</span>
      </div>
    </div>
    <section className="premium-card p-5">
      <h2 className="mb-3 text-sm font-black uppercase text-slate-500">Problem Description</h2>
      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{problem.description}</div>
    </section>
    <section className="space-y-4">
      <h3 className="text-sm font-black uppercase text-slate-500">Examples</h3>
      {problem.visibleTestCases?.map((example, index) => (
        <div key={index} className="premium-card p-4">
          <div className="mb-3 text-sm font-black text-emerald-300">Example {index + 1}</div>
          <CodeBlock label="Input" value={example.input} />
          <CodeBlock label="Output" value={example.output} />
          {example.explanation && <p className="mt-3 text-sm leading-6 text-slate-400">{example.explanation}</p>}
        </div>
      ))}
    </section>
  </div>
);

const Solutions = ({ problem }) => (
  <PanelTitle title="Solutions" subtitle="Reference solutions for this problem">
    <div className="space-y-4">
      {problem.referenceSolution?.length ? problem.referenceSolution.map((solution, index) => (
        <div key={index} className="premium-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/70 px-4 py-3">
            <h3 className="text-sm font-black text-white">{problem.title}</h3>
            <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-black text-emerald-300">{solution?.language}</span>
          </div>
          <pre className="overflow-x-auto bg-[#060a12] p-4 text-xs leading-6 text-emerald-300"><code>{solution?.completeCode}</code></pre>
        </div>
      )) : (
        <div className="premium-card p-8 text-center">
          <h3 className="text-lg font-black text-white">Solutions Locked</h3>
          <p className="mt-2 text-sm text-slate-400">Try solving the problem first, then compare your approach.</p>
        </div>
      )}
    </div>
  </PanelTitle>
);

const RunResults = ({ runResult, expandedTestCase, setExpandedTestCase }) => (
  <div className="h-full overflow-y-auto p-6">
    <h3 className="mb-4 text-xl font-black text-white">Test Results</h3>
    {!runResult ? <EmptyState title="No results yet" description="Run your code to test the visible cases." /> : (
      <div className="space-y-4">
        <StatusLine ok={runResult.success} label={runResult.success ? 'Accepted' : 'Wrong Answer'} />
        {runResult.success && (
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Runtime" value={`${runResult.runtime} sec`} />
            <Metric label="Memory" value={`${runResult.memory} KB`} />
          </div>
        )}
        <div className="space-y-2">
          {runResult.testCases?.map((tc, i) => {
            const passed = runResult.success || tc.status_id == 3;
            return (
              <div key={i} className={`overflow-hidden rounded-lg border ${passed ? 'border-emerald-400/25' : 'border-red-400/25'}`}>
                <button className={`flex w-full items-center justify-between p-3 text-left ${passed ? 'bg-emerald-400/10' : 'bg-red-400/10'}`} onClick={() => setExpandedTestCase(expandedTestCase === i ? null : i)}>
                  <span className="flex items-center gap-2 text-sm font-black text-white">
                    {passed ? <CheckCircle className="h-4 w-4 text-emerald-300" /> : <XCircle className="h-4 w-4 text-red-300" />}
                    Test Case {i + 1}
                  </span>
                  {expandedTestCase === i ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                </button>
                {expandedTestCase === i && (
                  <div className="space-y-3 bg-slate-950 p-3">
                    <CodeBlock label="Input" value={tc.stdin} />
                    <CodeBlock label="Expected" value={tc.expected_output} />
                    <CodeBlock label="Output" value={tc.stdout} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

const SubmitResults = ({ submitResult }) => (
  <div className="h-full overflow-y-auto p-6">
    <h3 className="mb-4 text-xl font-black text-white">Submission Result</h3>
    {!submitResult ? <EmptyState title="No submission yet" description="Submit your solution to evaluate all test cases." /> : (
      <div className="space-y-4">
        <StatusLine ok={submitResult.accepted} label={submitResult.accepted ? 'Accepted' : submitResult.error || 'Submission failed'} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Test Cases" value={`${submitResult.passedTestCases || 0}/${submitResult.totalTestCases || 0}`} />
          <Metric label="Runtime" value={submitResult.runtime || '-'} />
          <Metric label="Memory" value={submitResult.memory || '-'} />
        </div>
        <div className={`rounded-lg border p-4 text-sm ${submitResult.accepted ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/25 bg-amber-400/10 text-amber-200'}`}>
          {submitResult.accepted ? 'Congratulations. Your solution passed all tests.' : 'Review the failing case and check edge cases before trying again.'}
        </div>
      </div>
    )}
  </div>
);

const PanelTitle = ({ title, subtitle, children }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </div>
    <div className="premium-card p-5">{children}</div>
  </div>
);

const CodeBlock = ({ label, value }) => (
  <div className="mt-3">
    <div className="mb-1 text-xs font-black uppercase text-slate-500">{label}</div>
    <pre className="overflow-x-auto rounded-lg border border-slate-700/50 bg-[#060a12] p-3 text-xs leading-6 text-slate-200"><code>{value}</code></pre>
  </div>
);

const EmptyState = ({ title, description }) => (
  <div className="premium-card p-10 text-center">
    <h4 className="text-lg font-black text-white">{title}</h4>
    <p className="mt-2 text-sm text-slate-400">{description}</p>
  </div>
);

const Metric = ({ label, value }) => (
  <div className="premium-card p-4">
    <div className="text-xs font-black uppercase text-slate-500">{label}</div>
    <div className="mt-1 text-lg font-black text-white">{value}</div>
  </div>
);

const StatusLine = ({ ok, label }) => (
  <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-black ${ok ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : 'border-red-400/25 bg-red-400/10 text-red-300'}`}>
    {ok ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
    {label}
  </div>
);

const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);
const formatTag = (tag = '') => tag === 'linkedList' ? 'Linked List' : tag === 'dp' ? 'DP' : capitalize(tag);

const getDifficultyColor = (difficulty = '') => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300';
    case 'medium': return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
    case 'hard': return 'border-red-400/30 bg-red-400/10 text-red-300';
    default: return 'border-slate-600 bg-slate-800 text-slate-300';
  }
};

export default ProblemPage;
