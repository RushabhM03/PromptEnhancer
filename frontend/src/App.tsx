/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { PromptParameters, GeneratedPrompt, Tone, OutputFormat } from "./types";
import { generatePrompt, refinePromptLLM } from "./api";

const defaultParams: PromptParameters = {
  useCaseTitle: "",
  useCaseDescription: "",
  aiRole: "You are a helpful AI assistant.",
  audience: "general users",
  tone: "neutral",
  language: "English",
  styleGuidelines: "",
  depthLevel: 3,
  reasoningStyle: "direct_answer",
  maxTokens: 800,
  avoidTopics: [],
  mustInclude: [],
  forbiddenPhrases: [],
  allowTools: false,
  toolTypesAllowed: [],
  useSections: true,
  includeCitations: false,
  outputFormat: "markdown",
  safetyLevel: "default",
  customSafetyNotes: "",
  positiveExamples: [],
  negativeExamples: [],
  additionalNotes: "",
};

function App() {
  const [params, setParams] = useState<PromptParameters>(defaultParams);
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof PromptParameters>(
    key: K,
    value: PromptParameters[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleBasicArrayChange = (
    key: keyof PromptParameters,
    text: string
  ) => {
    const arr = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    handleChange(key as any, arr as any);
  };

  const onGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await generatePrompt(params);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate prompt. Check backend and console.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const onRefine = async () => {
    if (!result) return;
    setRefining(true);
    setError(null);
    try {
      const refined = await refinePromptLLM(result);
      setResult(refined);
    } catch (err: any) {
      console.error(err);
      setError(
        "Refine failed. Check Hugging Face token/model and backend logs."
      );
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              DP
            </div>
            <div>
              <h1 className="text-lg font-semibold">Deep Prompt Generator</h1>
              <p className="text-xs text-slate-400">
                Full‑stack prompt builder with Hugging Face refinement
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500">
            Backend: http://localhost:4000
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-lg shadow-slate-950/40">
          <form onSubmit={onGenerate} className="flex flex-col gap-5 text-sm">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-base font-semibold text-slate-100">
                Prompt Parameters
              </h2>
              {error && <span className="text-xs text-red-400">{error}</span>}
            </div>

            {/* Core context */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Core Context
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Use case title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.useCaseTitle}
                    onChange={(e) =>
                      handleChange("useCaseTitle", e.target.value)
                    }
                    placeholder="e.g. System design coach"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Audience
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.audience}
                    onChange={(e) => handleChange("audience", e.target.value)}
                    placeholder="e.g. mid‑level backend engineers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  AI role
                </label>
                <textarea
                  className="w-full h-20 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none"
                  value={params.aiRole}
                  onChange={(e) => handleChange("aiRole", e.target.value)}
                  placeholder="e.g. You are a senior Java backend engineer..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Use case description
                </label>
                <textarea
                  className="w-full h-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none"
                  value={params.useCaseDescription}
                  onChange={(e) =>
                    handleChange("useCaseDescription", e.target.value)
                  }
                  placeholder="Describe what the assistant should do and in what context..."
                />
              </div>
            </div>

            {/* Answer style */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Answer Style
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tone
                  </label>
                  <select
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.tone}
                    onChange={(e) =>
                      handleChange("tone", e.target.value as Tone)
                    }
                  >
                    <option value="formal">formal</option>
                    <option value="informal">informal</option>
                    <option value="neutral">neutral</option>
                    <option value="friendly">friendly</option>
                    <option value="authoritative">authoritative</option>
                    <option value="playful">playful</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    placeholder="English"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Depth level (1–5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.depthLevel}
                    onChange={(e) =>
                      handleChange(
                        "depthLevel",
                        Number(e.target.value) as 1 | 2 | 3 | 4 | 5
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Reasoning style
                  </label>
                  <select
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.reasoningStyle}
                    onChange={(e) =>
                      handleChange(
                        "reasoningStyle",
                        e.target.value as PromptParameters["reasoningStyle"]
                      )
                    }
                  >
                    <option value="direct_answer">direct_answer</option>
                    <option value="chain_of_thought">chain_of_thought</option>
                    <option value="socratic">socratic</option>
                    <option value="examples_first">examples_first</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Max tokens (hint)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.maxTokens}
                    onChange={(e) =>
                      handleChange("maxTokens", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Output format
                  </label>
                  <select
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    value={params.outputFormat}
                    onChange={(e) =>
                      handleChange(
                        "outputFormat",
                        e.target.value as OutputFormat
                      )
                    }
                  >
                    <option value="plain_text">plain_text</option>
                    <option value="markdown">markdown</option>
                    <option value="json">json</option>
                    <option value="code">code</option>
                    <option value="step_by_step">step_by_step</option>
                  </select>
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                      checked={params.allowTools}
                      onChange={(e) =>
                        handleChange("allowTools", e.target.checked)
                      }
                    />
                    Allow tools
                  </label>
                </div>
              </div>
            </div>

            {/* Advanced constraints */}
            <details className="space-y-3">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center justify-between">
                Advanced constraints
                <span className="text-[10px] text-slate-500">
                  (avoid / must‑include / forbidden)
                </span>
              </summary>

              <div className="flex flex-col gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Avoid topics (one per line)
                  </label>
                  <textarea
                    className="w-full h-16 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none"
                    value={params.avoidTopics.join("\n")}
                    onChange={(e) =>
                      handleBasicArrayChange("avoidTopics", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Must include (one per line)
                  </label>
                  <textarea
                    className="w-full h-16 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none"
                    value={params.mustInclude.join("\n")}
                    onChange={(e) =>
                      handleBasicArrayChange("mustInclude", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Forbidden phrases (one per line)
                  </label>
                  <textarea
                    className="w-full h-16 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none"
                    value={params.forbiddenPhrases.join("\n")}
                    onChange={(e) =>
                      handleBasicArrayChange("forbiddenPhrases", e.target.value)
                    }
                  />
                </div>
              </div>
            </details>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Generating..." : "Generate Prompt"}
            </button>
          </form>
        </section>
        {/* Right: Preview */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-lg shadow-slate-950/40 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-slate-100">
              Generated Prompt
            </h2>
            {result && (
              <button
                onClick={onRefine}
                disabled={refining}
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-slate-950 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {refining ? "Refining..." : "Refine with HF LLM"}
              </button>
            )}
          </div>

          {!result && (
            <p className="text-sm text-slate-400">
              No prompt yet. Fill parameters on the left and click{" "}
              <span className="font-semibold text-emerald-400">
                Generate Prompt
              </span>
              .
            </p>
          )}

          {result && (
            <div className="flex flex-col gap-4 text-xs">
              <div>
                <h3 className="mb-1 text-xs font-semibold text-slate-200">
                  System Prompt
                </h3>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 max-h-64 overflow-auto">
                  <pre className="whitespace-pre-wrap break-words text-slate-100">
                    {result.systemPrompt}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-semibold text-slate-200">
                  User Prompt
                </h3>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 max-h-56 overflow-auto">
                  <pre className="whitespace-pre-wrap break-words text-slate-100">
                    {result.userPrompt}
                  </pre>
                </div>
              </div>

              {result.toolInstructions && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-slate-200">
                    Tool Instructions
                  </h3>
                  <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 max-h-40 overflow-auto">
                    <pre className="whitespace-pre-wrap break-words text-slate-100">
                      {result.toolInstructions}
                    </pre>
                  </div>
                </div>
              )}

              {result.notes && (
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-slate-200">
                    Notes
                  </h3>
                  <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 max-h-32 overflow-auto">
                    <pre className="whitespace-pre-wrap break-words text-slate-100">
                      {result.notes}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
