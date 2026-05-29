import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { AlertTriangle, ArrowLeft, CheckCircle, Code, Edit3, FileText, Filter, Plus, Save, Search, Settings, TestTube, X } from 'lucide-react';
import { NavLink } from 'react-router';

const languageEnum = z.enum(['cpp', 'c++', 'java', 'javascript']);

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().min(1) })).min(1),
  hiddenTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1) })).min(1),
  startCode: z.array(z.object({ language: languageEnum, initialCode: z.string().min(1) })).length(3),
  referenceSolution: z.array(z.object({ language: languageEnum, completeCode: z.string().min(1) })).length(3),
  functionMetadata: z.object({
    functionName: z.string().min(1),
    functionSignature: z.object({ java: z.string().min(1), cpp: z.string().min(1), javascript: z.string().min(1) }),
    returnType: z.object({ java: z.string().min(1), cpp: z.string().min(1), javascript: z.string().min(1) }),
  }).optional(),
});

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(`Failed to fetch problems: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (problem) => {
    try {
      const { data } = await axiosClient.get(`/problem/problemById/${problem._id}`);
      setSelectedProblem(data);
    } catch (err) {
      setError('Failed to fetch problem details');
      console.error(err);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      setUpdateLoading(true);
      await axiosClient.put(`/problem/update/${selectedProblem._id}`, normalizeLanguages(updatedData));
      setSuccessMessage(`Problem "${selectedProblem.title}" updated successfully.`);
      setSelectedProblem(null);
      fetchProblems();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      setError('Failed to update problem');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      || problem.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || problem.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  }), [filterDifficulty, problems, searchTerm]);

  if (loading) return <LoadingState label="Loading problems..." />;
  if (error && !problems.length && !selectedProblem) return <ErrorState error={error} />;

  if (selectedProblem) {
    return (
      <EditProblemForm
        problem={selectedProblem}
        onUpdate={handleUpdate}
        onCancel={() => setSelectedProblem(null)}
        updateLoading={updateLoading}
      />
    );
  }

  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-sm font-bold text-amber-200">
              <Edit3 className="h-4 w-4" />
              Content maintenance
            </div>
            <h1 className="text-4xl font-black text-white lg:text-6xl">Update Problems</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Edit statements, tests, code templates, and function metadata.</p>
          </div>
          <NavLink to="/admin" className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
            <ArrowLeft className="h-4 w-4" />
            Admin Panel
          </NavLink>
        </div>

        {successMessage && <Notice type="success" icon={CheckCircle}>{successMessage}</Notice>}
        {error && <Notice type="error" icon={AlertTriangle}>{error}</Notice>}

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <Metric label="Total Problems" value={problems.length} />
          <Metric label="Easy" value={problems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length} />
          <Metric label="Medium" value={problems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length} />
        </section>

        <section className="surface mb-6 rounded-lg p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title or tag" className="field-premium w-full py-3 pl-10 pr-3" />
            </label>
            <label className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="field-premium w-full py-3 pl-10 pr-3">
                <option className="bg-slate-950" value="all">All Difficulties</option>
                <option className="bg-slate-950" value="easy">Easy</option>
                <option className="bg-slate-950" value="medium">Medium</option>
                <option className="bg-slate-950" value="hard">Hard</option>
              </select>
            </label>
          </div>
        </section>

        <div className="overflow-hidden rounded-lg border border-slate-700/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                {filteredProblems.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-400">No problems found.</td></tr>
                ) : filteredProblems.map((problem, index) => (
                  <tr key={problem._id} className="text-slate-300 hover:bg-slate-900">
                    <td className="px-4 py-4 font-mono text-slate-500">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="font-black text-white">{problem.title}</div>
                      <div className="mt-1 max-w-xl truncate text-xs text-slate-500">{problem.description}</div>
                    </td>
                    <td className="px-4 py-4"><DifficultyBadge value={problem.difficulty} /></td>
                    <td className="px-4 py-4"><TagBadge value={problem.tags} /></td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleEdit(problem)} className="inline-flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-300 transition hover:bg-amber-400/15">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-slate-500">Showing {filteredProblems.length} of {problems.length} problems</p>
      </div>
    </main>
  );
};

const EditProblemForm = ({ problem, onUpdate, onCancel, updateLoading }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: problem.title || '',
      description: problem.description || '',
      difficulty: problem.difficulty?.toLowerCase() || 'easy',
      tags: problem.tags || 'array',
      visibleTestCases: problem.visibleTestCases || [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: problem.hiddenTestCases || [{ input: '', output: '' }],
      startCode: normalizeCodeArray(problem.startCode, 'initialCode'),
      referenceSolution: normalizeCodeArray(problem.referenceSolution, 'completeCode'),
      functionMetadata: {
        functionName: problem.functionMetadata?.functionName || '',
        functionSignature: {
          java: problem.functionMetadata?.functionSignature?.java || '',
          cpp: problem.functionMetadata?.functionSignature?.cpp || '',
          javascript: problem.functionMetadata?.functionSignature?.javascript || '',
        },
        returnType: {
          java: problem.functionMetadata?.returnType?.java || '',
          cpp: problem.functionMetadata?.returnType?.cpp || '',
          javascript: problem.functionMetadata?.returnType?.javascript || '',
        },
      },
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-sm font-bold text-amber-200">
              <Edit3 className="h-4 w-4" />
              Editing problem
            </div>
            <h1 className="text-4xl font-black text-white lg:text-6xl">{problem.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Update the problem content, tests, and code templates.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onCancel} className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
              <ArrowLeft className="h-4 w-4" />
              Problem List
            </button>
            <button type="submit" form="edit-form" disabled={updateLoading} className="btn-primary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black disabled:opacity-50">
              <Save className="h-4 w-4" />
              {updateLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <form id="edit-form" onSubmit={handleSubmit(onUpdate)} className="space-y-6">
          <FormSection icon={FileText} title="Basic Information">
            <Field label="Title" error={errors.title?.message}><input {...register('title')} className="field-premium w-full px-4 py-3" /></Field>
            <Field label="Description" error={errors.description?.message}><textarea {...register('description')} rows={6} className="field-premium w-full resize-y px-4 py-3" /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Difficulty"><select {...register('difficulty')} className="field-premium w-full px-4 py-3"><option className="bg-slate-950" value="easy">Easy</option><option className="bg-slate-950" value="medium">Medium</option><option className="bg-slate-950" value="hard">Hard</option></select></Field>
              <Field label="Category"><select {...register('tags')} className="field-premium w-full px-4 py-3"><option className="bg-slate-950" value="array">Array</option><option className="bg-slate-950" value="linkedList">Linked List</option><option className="bg-slate-950" value="graph">Graph</option><option className="bg-slate-950" value="dp">DP</option></select></Field>
            </div>
          </FormSection>

          <FormSection icon={Settings} title="Function Metadata">
            <Field label="Function Name"><input {...register('functionMetadata.functionName')} className="field-premium w-full px-4 py-3" /></Field>
            <div className="grid gap-4 lg:grid-cols-3">
              {['java', 'cpp', 'javascript'].map((lang) => (
                <Field key={lang} label={`${languageLabel(lang)} Signature`}>
                  <input {...register(`functionMetadata.functionSignature.${lang}`)} className="field-premium w-full px-4 py-3 font-mono text-sm" />
                </Field>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {['java', 'cpp', 'javascript'].map((lang) => (
                <Field key={lang} label={`${languageLabel(lang)} Return Type`}>
                  <input {...register(`functionMetadata.returnType.${lang}`)} className="field-premium w-full px-4 py-3 font-mono text-sm" />
                </Field>
              ))}
            </div>
          </FormSection>

          <TestCaseSection title="Visible Test Cases" icon={TestTube} fields={visibleFields} append={() => appendVisible({ input: '', output: '', explanation: '' })} remove={removeVisible}>
            {(index) => <><div className="grid gap-4 md:grid-cols-2"><TextArea label="Input" register={register(`visibleTestCases.${index}.input`)} /><TextArea label="Expected Output" register={register(`visibleTestCases.${index}.output`)} /></div><TextArea label="Explanation" register={register(`visibleTestCases.${index}.explanation`)} /></>}
          </TestCaseSection>

          <TestCaseSection title="Hidden Test Cases" icon={Settings} fields={hiddenFields} append={() => appendHidden({ input: '', output: '' })} remove={removeHidden}>
            {(index) => <div className="grid gap-4 md:grid-cols-2"><TextArea label="Input" register={register(`hiddenTestCases.${index}.input`)} /><TextArea label="Expected Output" register={register(`hiddenTestCases.${index}.output`)} /></div>}
          </TestCaseSection>

          <FormSection icon={Code} title="Code Templates">
            <div className="grid gap-5 lg:grid-cols-3">
              {['C++', 'Java', 'JavaScript'].map((label, index) => (
                <div key={label} className="rounded-lg border border-slate-700/60 bg-slate-950/60 p-4">
                  <h3 className="mb-4 text-lg font-black text-cyan-200">{label}</h3>
                  <TextArea label="Initial Code" register={register(`startCode.${index}.initialCode`)} rows={7} mono />
                  <TextArea label="Reference Solution" register={register(`referenceSolution.${index}.completeCode`)} rows={9} mono />
                </div>
              ))}
            </div>
          </FormSection>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={onCancel} className="btn-secondary-premium flex-1 rounded-lg px-5 py-3 font-black">Cancel</button>
            <button type="submit" disabled={updateLoading} className="btn-primary-premium flex-1 rounded-lg px-5 py-3 font-black disabled:opacity-50">{updateLoading ? 'Updating Problem...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </main>
  );
};

const FormSection = ({ icon: Icon, title, children }) => (
  <section className="surface rounded-lg p-5 lg:p-6">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"><Icon className="h-5 w-5" /></span>
      <h2 className="text-2xl font-black text-white">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Field = ({ label, error, children }) => <div><label className="mb-2 block text-sm font-bold text-slate-200">{label}</label>{children}{error && <p className="mt-2 text-sm text-red-300">{error}</p>}</div>;
const TextArea = ({ label, register, rows = 4, mono = false }) => <Field label={label}><textarea {...register} rows={rows} className={`field-premium w-full resize-y px-4 py-3 ${mono ? 'font-mono text-sm' : ''}`} /></Field>;

const TestCaseSection = ({ title, icon: Icon, fields, append, remove, children }) => (
  <FormSection icon={Icon} title={title}>
    <div className="mb-2 flex justify-end">
      <button type="button" onClick={append} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300 hover:bg-cyan-400/15"><Plus className="h-4 w-4" />Add Case</button>
    </div>
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-lg border border-slate-700/60 bg-slate-950/60 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-black text-white">Case {index + 1}</h3>
            <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-400/15"><X className="h-4 w-4" />Remove</button>
          </div>
          <div className="space-y-4">{children(index)}</div>
        </div>
      ))}
    </div>
  </FormSection>
);

const Metric = ({ label, value }) => <div className="premium-card p-5"><div className="text-3xl font-black text-white">{value}</div><div className="mt-1 text-xs font-black uppercase text-slate-500">{label}</div></div>;
const Notice = ({ children, type, icon: Icon }) => <div className={`mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm font-bold ${type === 'success' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-red-400/25 bg-red-400/10 text-red-200'}`}><Icon className="h-5 w-5" />{children}</div>;
const DifficultyBadge = ({ value = '' }) => {
  const tone = value?.toLowerCase() === 'easy' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : value?.toLowerCase() === 'medium' ? 'border-amber-400/25 bg-amber-400/10 text-amber-300' : 'border-red-400/25 bg-red-400/10 text-red-300';
  return <span className={`rounded-md border px-2.5 py-1 text-xs font-black capitalize ${tone}`}>{value}</span>;
};
const TagBadge = ({ value = '' }) => <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-black text-cyan-200">{value}</span>;
const LoadingState = ({ label }) => <div className="app-shell flex min-h-screen items-center justify-center"><div className="text-center"><span className="loading loading-spinner loading-lg text-cyan-300"></span><p className="mt-4 font-bold text-slate-300">{label}</p></div></div>;
const ErrorState = ({ error }) => <div className="app-shell flex min-h-screen items-center justify-center px-5"><div className="max-w-md rounded-lg border border-red-400/25 bg-red-400/10 p-5 text-red-200"><h3 className="font-black">Error</h3><p className="mt-1 text-sm">{error}</p></div></div>;
const languageLabel = (lang) => lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java';
const normalizeCodeArray = (items, codeKey) => {
  const fallback = [
    { language: 'cpp', [codeKey]: '' },
    { language: 'java', [codeKey]: '' },
    { language: 'javascript', [codeKey]: '' },
  ];
  if (!Array.isArray(items) || items.length !== 3) return fallback;
  return items.map((item) => ({ ...item, language: item.language === 'c++' ? 'cpp' : item.language }));
};
const normalizeLanguages = (data) => ({
  ...data,
  startCode: data.startCode.map((item) => ({ ...item, language: item.language === 'c++' ? 'cpp' : item.language })),
  referenceSolution: data.referenceSolution.map((item) => ({ ...item, language: item.language === 'c++' ? 'cpp' : item.language })),
});

export default AdminUpdate;
