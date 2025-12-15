export type Tone =
  | "formal"
  | "informal"
  | "neutral"
  | "friendly"
  | "authoritative"
  | "playful";

export type OutputFormat =
  | "plain_text"
  | "markdown"
  | "json"
  | "code"
  | "step_by_step";

export interface PromptParameters {
  useCaseTitle: string;
  useCaseDescription: string;
  aiRole: string;
  audience: string;
  tone: Tone;
  language: string;
  styleGuidelines: string;
  depthLevel: 1 | 2 | 3 | 4 | 5;
  reasoningStyle: "chain_of_thought" | "direct_answer" | "socratic" | "examples_first";
  maxTokens: number;
  avoidTopics: string[];
  mustInclude: string[];
  forbiddenPhrases: string[];
  allowTools: boolean;
  toolTypesAllowed: string[];
  useSections: boolean;
  includeCitations: boolean;
  outputFormat: OutputFormat;
  safetyLevel: "default" | "strict" | "custom";
  customSafetyNotes?: string;
  positiveExamples: string[];
  negativeExamples: string[];
  additionalNotes?: string;
}

export interface GeneratedPrompt {
  systemPrompt: string;
  userPrompt: string;
  toolInstructions?: string;
  notes?: string;
}
