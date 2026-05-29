import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { AlertTriangle, ArrowLeft, CheckCircle, Code, FileText, Plus, Save, Settings, TestTube, X } from 'lucide-react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  functionMetadata: z.object({
    functionName: z.string().min(1, 'Function name is required'),
    functionSignature: z.object({
      java: z.string().min(1, 'Java signature is required'),
      cpp: z.string().min(1, 'C++ signature is required'),
      javascript: z.string().min(1, 'JavaScript signature is required'),
    }),
    returnType: z.object({
      java: z.string().min(1, 'Java return type is required'),
      cpp: z.string().min(1, 'C++ return type is required'),
      javascript: z.string().min(1, 'JavaScript return type is required'),
    }),
  }).optional(),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
    explanation: z.string().min(1),
  })).min(1),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
  })).min(1),
  startCode: z.array(z.object({
    language: z.enum(['cpp', 'java', 'javascript']),
    initialCode: z.string().min(1),
  })).length(3),
  referenceSolution: z.array(z.object({
    language: z.enum(['cpp', 'java', 'javascript']),
    completeCode: z.string().min(1),
  })).length(3),
});

function AdminPanel() {
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: 'easy',
      tags: 'array',
      functionMetadata: {
        functionName: '',
        functionSignature: { java: '', cpp: '', javascript: '' },
        returnType: { java: '', cpp: '', javascript: '' },
      },
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'cpp', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' },
      ],
      referenceSolution: [
        { language: 'cpp', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' },
      ],
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      setCreateLoading(true);
      setError(null);
      await axiosClient.post('/problem/create', data);
      navigate('/admin');
    } catch (err) {
      console.error('Create error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create problem');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-bold text-emerald-200">
              <Plus className="h-4 w-4" />
              New problem
            </div>
            <h1 className="text-4xl font-black text-white lg:text-6xl">Create Problem</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Build a complete coding challenge with statements, tests, starter code, and reference solutions.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate('/admin')} className="btn-secondary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black">
              <ArrowLeft className="h-4 w-4" />
              Admin Panel
            </button>
            <button type="submit" form="create-form" disabled={createLoading} className="btn-primary-premium inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black disabled:opacity-50">
              <Save className="h-4 w-4" />
              {createLoading ? 'Creating...' : 'Create Problem'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-400/25 bg-red-400/10 p-4 text-sm font-bold text-red-200">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form id="create-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormSection icon={FileText} title="Basic Information">
            <Field label="Title" error={errors.title?.message}>
              <input {...register('title')} placeholder="Problem title" className="field-premium w-full px-4 py-3" />
            </Field>
            <Field label="Description" error={errors.description?.message}>
              <textarea {...register('description')} placeholder="Problem description" rows={6} className="field-premium w-full resize-y px-4 py-3" />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Difficulty">
                <select {...register('difficulty')} className="field-premium w-full px-4 py-3">
                  <option className="bg-slate-950" value="easy">Easy</option>
                  <option className="bg-slate-950" value="medium">Medium</option>
                  <option className="bg-slate-950" value="hard">Hard</option>
                </select>
              </Field>
              <Field label="Category">
                <select {...register('tags')} className="field-premium w-full px-4 py-3">
                  <option className="bg-slate-950" value="array">Array</option>
                  <option className="bg-slate-950" value="linkedList">Linked List</option>
                  <option className="bg-slate-950" value="graph">Graph</option>
                  <option className="bg-slate-950" value="dp">DP</option>
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection icon={Settings} title="LeetCode-Style Configuration">
            <Field label="Function Name" error={errors.functionMetadata?.functionName?.message}>
              <input {...register('functionMetadata.functionName')} placeholder="addTwoNumbers" className="field-premium w-full px-4 py-3" />
            </Field>
            <div className="grid gap-4 lg:grid-cols-3">
              {['java', 'cpp', 'javascript'].map((lang) => (
                <Field key={lang} label={`${languageLabel(lang)} Signature`} error={errors.functionMetadata?.functionSignature?.[lang]?.message}>
                  <input {...register(`functionMetadata.functionSignature.${lang}`)} placeholder={lang === 'javascript' ? 'function solve(a, b)' : 'int solve(int a, int b)'} className="field-premium w-full px-4 py-3 font-mono text-sm" />
                </Field>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {['java', 'cpp', 'javascript'].map((lang) => (
                <Field key={lang} label={`${languageLabel(lang)} Return Type`}>
                  <input {...register(`functionMetadata.returnType.${lang}`)} placeholder={lang === 'javascript' ? 'number' : 'int'} className="field-premium w-full px-4 py-3 font-mono text-sm" />
                </Field>
              ))}
            </div>
          </FormSection>

          <TestCaseSection title="Visible Test Cases" icon={TestTube} fields={visibleFields} append={() => appendVisible({ input: '', output: '', explanation: '' })} remove={removeVisible}>
            {(index) => (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextArea label="Input" register={register(`visibleTestCases.${index}.input`)} />
                  <TextArea label="Expected Output" register={register(`visibleTestCases.${index}.output`)} />
                </div>
                <TextArea label="Explanation" register={register(`visibleTestCases.${index}.explanation`)} />
              </>
            )}
          </TestCaseSection>

          <TestCaseSection title="Hidden Test Cases" icon={Settings} fields={hiddenFields} append={() => appendHidden({ input: '', output: '' })} remove={removeHidden}>
            {(index) => (
              <div className="grid gap-4 md:grid-cols-2">
                <TextArea label="Input" register={register(`hiddenTestCases.${index}.input`)} />
                <TextArea label="Expected Output" register={register(`hiddenTestCases.${index}.output`)} />
              </div>
            )}
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
            <button type="button" onClick={() => navigate('/admin')} className="btn-secondary-premium flex-1 rounded-lg px-5 py-3 font-black">Cancel</button>
            <button type="submit" disabled={createLoading} className="btn-primary-premium flex-1 rounded-lg px-5 py-3 font-black disabled:opacity-50">
              {createLoading ? 'Creating Problem...' : 'Create Problem'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const FormSection = ({ icon: Icon, title, children }) => (
  <section className="surface rounded-lg p-5 lg:p-6">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-2xl font-black text-white">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-200">{label}</label>
    {children}
    {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
  </div>
);

const TextArea = ({ label, register, rows = 4, mono = false }) => (
  <Field label={label}>
    <textarea {...register} rows={rows} className={`field-premium w-full resize-y px-4 py-3 ${mono ? 'font-mono text-sm' : ''}`} />
  </Field>
);

const TestCaseSection = ({ title, icon: Icon, fields, append, remove, children }) => (
  <FormSection icon={Icon} title={title}>
    <div className="mb-2 flex justify-end">
      <button type="button" onClick={append} className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300 hover:bg-cyan-400/15">
        <Plus className="h-4 w-4" />
        Add Case
      </button>
    </div>
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-lg border border-slate-700/60 bg-slate-950/60 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-black text-white">Case {index + 1}</h3>
            <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-400/15">
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
          <div className="space-y-4">{children(index)}</div>
        </div>
      ))}
    </div>
  </FormSection>
);

const languageLabel = (lang) => lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java';

export default AdminPanel;
