import { GeneratedPrompt, PromptParameters } from "../types/prompt";

export function buildPrompt(params: PromptParameters): GeneratedPrompt {
  const {
    useCaseTitle,
    useCaseDescription,
    aiRole,
    audience,
    tone,
    language,
    styleGuidelines,
    depthLevel,
    reasoningStyle,
    maxTokens,
    avoidTopics,
    mustInclude,
    forbiddenPhrases,
    allowTools,
    toolTypesAllowed,
    useSections,
    includeCitations,
    outputFormat,
    safetyLevel,
    customSafetyNotes,
    positiveExamples,
    negativeExamples,
    additionalNotes,
  } = params;

  const depthText = (() => {
    switch (depthLevel) {
      case 1: return "Provide a brief, high-level answer.";
      case 2: return "Provide a concise but reasonably detailed answer.";
      case 3: return "Provide a moderately detailed, structured answer.";
      case 4: return "Provide a detailed, well-structured answer with explanations.";
      case 5: return "Provide an exhaustive, deeply detailed answer with step-by-step reasoning where useful.";
      default: return "";
    }
  })();

  const reasoningText = (() => {
    switch (reasoningStyle) {
      case "chain_of_thought":
        return "Think step by step and explain your reasoning before giving the final answer, but keep it concise.";
      case "socratic":
        return "Guide the user using questions and answers to help them reach understanding.";
      case "examples_first":
        return "Use concrete examples early in the response, then generalize.";
      case "direct_answer":
      default:
        return "Provide a direct answer without exposing unnecessary internal reasoning.";
    }
  })();

  const toneText = `Use a ${tone} tone targeted at ${audience}.`;
  const langText = `Respond in ${language}.`;

  const safetyText = (() => {
    if (safetyLevel === "strict") {
      return "Avoid any harmful, unsafe, or sensitive content. If asked for such content, refuse and gently redirect.";
    }
    if (safetyLevel === "custom" && customSafetyNotes) {
      return customSafetyNotes;
    }
    return "Follow standard safety and content guidelines.";
  })();

  const avoidText =
    avoidTopics.length > 0
      ? `Avoid discussing these topics unless absolutely necessary: ${avoidTopics.join(", ")}.`
      : "";

  const mustIncludeText =
    mustInclude.length > 0
      ? `Ensure the answer includes: ${mustInclude.join("; ")}.`
      : "";

  const forbiddenText =
    forbiddenPhrases.length > 0
      ? `Do not use the following phrases: ${forbiddenPhrases.join(", ")}.`
      : "";

  const toolsText =
    allowTools && toolTypesAllowed.length > 0
      ? `You may use the following tools when helpful: ${toolTypesAllowed.join(", ")}. Do not mention tools to the user.`
      : "Do not rely on external tools; answer using your internal knowledge and reasoning.";

  const sectionsText = useSections
    ? "Organize the answer into clear sections with headings where appropriate."
    : "A structured answer is good, but headings are optional.";

  const citationsText = includeCitations
    ? "When you reference external facts, mention the source at a high level without URLs unless asked."
    : "No citations are strictly required unless the user asks for them.";

  const formatText = (() => {
    switch (outputFormat) {
      case "markdown":
        return "Format the answer as Markdown.";
      case "json":
        return "Return the answer strictly as valid JSON that matches the requested schema.";
      case "code":
        return "Focus on code blocks and minimal explanatory text.";
      case "step_by_step":
        return "Structure the answer as a step-by-step list of actions.";
      case "plain_text":
      default:
        return "Plain text is acceptable.";
    }
  })();

  const examplesText = [
    positiveExamples.length
      ? "Here are examples of good answers:\n" +
        positiveExamples.map((ex, i) => `Example ${i + 1} (good):\n${ex}`).join("\n\n")
      : "",
    negativeExamples.length
      ? "Here are examples of bad answers you must avoid reproducing:\n" +
        negativeExamples.map((ex, i) => `Example ${i + 1} (bad):\n${ex}`).join("\n\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemPromptLines = [
    `You are: ${aiRole || "a helpful AI assistant."}`,
    `Use case: ${useCaseTitle}.`,
    `Use case description: ${useCaseDescription}.`,
    toneText,
    langText,
    depthText,
    reasoningText,
    sectionsText,
    formatText,
    toolsText,
    citationsText,
    safetyText,
    styleGuidelines ? `Additional style guidelines: ${styleGuidelines}` : "",
    avoidText,
    mustIncludeText,
    forbiddenText,
    additionalNotes ? `Additional project notes: ${additionalNotes}` : "",
    examplesText ? "Follow the intent of the good examples and avoid the patterns in the bad examples." : "",
    maxTokens
      ? `Keep the answer within a budget corresponding to approximately ${maxTokens} tokens; prioritize clarity and usefulness.`
      : "",
  ].filter(Boolean);

  const systemPrompt = systemPromptLines.join("\n\n");

  const userPrompt = `User request: Please assist with the following task in the context of the described use case.`;

  const toolInstructions = allowTools
    ? "Tool usage: You may internally call allowed tools to gather information or run code. Never mention tools, API keys, or internal mechanisms to the end user."
    : undefined;

  return {
    systemPrompt,
    userPrompt,
    toolInstructions,
    notes: "Use systemPrompt as system message, userPrompt as user message, then append the user's actual query.",
  };
}
