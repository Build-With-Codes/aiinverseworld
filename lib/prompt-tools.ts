export type PromptToolSlug =
  | "token-counter"
  | "cost-calculator"
  | "context-window-calculator"
  | "prompt-formatter"
  | "prompt-cleaner"
  | "template-builder"
  | "system-prompt-builder"
  | "midjourney-prompt-builder"
  | "flux-prompt-builder";

export type PromptTool = {
  slug: PromptToolSlug;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  category: string;
  href: string;
  primaryAction: string;
  outcome: string;
  examples: string[];
  faqs: { question: string; answer: string }[];
};

export type PromptRecipe = {
  title: string;
  useCase: string;
  models: string[];
  prompt: string;
};

export const promptToolBasePath = "/prompt-tools";

export const promptTools: PromptTool[] = [
  {
    slug: "token-counter",
    title: "Token Counter",
    shortTitle: "Tokens",
    description: "Estimate tokens, words, characters, and reading size before sending a prompt to an AI model.",
    eyebrow: "Measure prompt size",
    category: "Analysis",
    href: "/prompt-tools/token-counter",
    primaryAction: "Count tokens",
    outcome: "Fast prompt size estimate",
    examples: ["Check long system prompts", "Estimate context usage", "Prepare prompts for long-context models"],
    faqs: [
      {
        question: "Is this an exact tokenizer?",
        answer: "No. It uses a deterministic browser estimate that is useful for planning before you paste into a model.",
      },
      {
        question: "Does text leave my browser?",
        answer: "No. The calculation runs locally in the page.",
      },
    ],
  },
  {
    slug: "cost-calculator",
    title: "AI Cost Calculator",
    shortTitle: "Cost",
    description: "Estimate API cost from input tokens, output tokens, request volume, and model pricing.",
    eyebrow: "Plan usage cost",
    category: "Finance",
    href: "/prompt-tools/cost-calculator",
    primaryAction: "Calculate cost",
    outcome: "Daily and monthly API estimate",
    examples: ["Forecast product usage", "Compare model budgets", "Estimate batch processing cost"],
    faqs: [
      {
        question: "Are prices live?",
        answer: "No. This is an editable local calculator. Always verify final pricing with the provider.",
      },
      {
        question: "Can I change prices?",
        answer: "Yes. Use the custom pricing inputs to model any provider.",
      },
    ],
  },
  {
    slug: "context-window-calculator",
    title: "Context Window Calculator",
    shortTitle: "Context",
    description: "Check how much room your prompt, documents, and expected answer need inside a model context window.",
    eyebrow: "Fit long prompts",
    category: "Planning",
    href: "/prompt-tools/context-window-calculator",
    primaryAction: "Check fit",
    outcome: "Context fit and remaining room",
    examples: ["Plan RAG prompts", "Size policy documents", "Avoid context overflow"],
    faqs: [
      {
        question: "What token ratio is used?",
        answer: "The default estimate is roughly four characters per token, which is adjustable in future modules.",
      },
      {
        question: "Why include output tokens?",
        answer: "Models need room for both your input and the answer. Large outputs reduce available input space.",
      },
    ],
  },
  {
    slug: "prompt-formatter",
    title: "Prompt Formatter",
    shortTitle: "Formatter",
    description: "Convert rough notes into a clean prompt structure with role, task, context, constraints, and output format.",
    eyebrow: "Structure messy drafts",
    category: "Writing",
    href: "/prompt-tools/prompt-formatter",
    primaryAction: "Format prompt",
    outcome: "Clean production prompt",
    examples: ["Clean meeting notes", "Prepare reusable prompts", "Format prompt library entries"],
    faqs: [
      {
        question: "Does it rewrite with AI?",
        answer: "No. It uses deterministic formatting so the result is instant and private.",
      },
      {
        question: "Can I edit the output?",
        answer: "Yes. Copy the result and adjust it for your model or team style.",
      },
    ],
  },
  {
    slug: "prompt-cleaner",
    title: "Prompt Cleaner",
    shortTitle: "Cleaner",
    description: "Remove filler, duplicate spacing, vague phrasing, and conflicting instructions from prompt drafts.",
    eyebrow: "Reduce prompt noise",
    category: "Quality",
    href: "/prompt-tools/prompt-cleaner",
    primaryAction: "Clean prompt",
    outcome: "Shorter, clearer prompt",
    examples: ["Simplify copied prompts", "Remove repeated instructions", "Make prompts easier to scan"],
    faqs: [
      {
        question: "Will it change meaning?",
        answer: "It is conservative and focuses on spacing, duplicate language, and obvious filler.",
      },
      {
        question: "Is it safe for private drafts?",
        answer: "Yes. Processing happens in your browser.",
      },
    ],
  },
  {
    slug: "template-builder",
    title: "Prompt Template Builder",
    shortTitle: "Templates",
    description: "Create reusable prompt templates with variables, audience, task, constraints, and acceptance criteria.",
    eyebrow: "Build reusable prompts",
    category: "Systems",
    href: "/prompt-tools/template-builder",
    primaryAction: "Build template",
    outcome: "Reusable prompt template",
    examples: ["Team prompt systems", "Client workflows", "Repeatable content operations"],
    faqs: [
      {
        question: "What are variables for?",
        answer: "Variables mark fields your team can replace later, such as product, audience, tone, and deliverable.",
      },
      {
        question: "Can this scale into a library?",
        answer: "Yes. The output format is intentionally clean so it can become a saved prompt later.",
      },
    ],
  },
  {
    slug: "system-prompt-builder",
    title: "System Prompt Builder",
    shortTitle: "System",
    description: "Design reliable system prompts with role, operating rules, safety boundaries, output contracts, and escalation logic.",
    eyebrow: "Define AI behavior",
    category: "Agents",
    href: "/prompt-tools/system-prompt-builder",
    primaryAction: "Build system prompt",
    outcome: "Production-ready behavior spec",
    examples: ["Support agents", "Research assistants", "Internal AI copilots"],
    faqs: [
      {
        question: "Is this for ChatGPT only?",
        answer: "No. The structure works for most chat and agent systems that support system instructions.",
      },
      {
        question: "Why include boundaries?",
        answer: "Boundaries reduce unpredictable behavior and make the assistant easier to evaluate.",
      },
    ],
  },
  {
    slug: "midjourney-prompt-builder",
    title: "Midjourney Prompt Builder",
    shortTitle: "Midjourney",
    description: "Generate compact visual prompts with subject, style, composition, lighting, lens, mood, and aspect ratio.",
    eyebrow: "Create cinematic image prompts",
    category: "Image",
    href: "/prompt-tools/midjourney-prompt-builder",
    primaryAction: "Build image prompt",
    outcome: "Polished Midjourney prompt",
    examples: ["Campaign visuals", "Editorial images", "Product concept art"],
    faqs: [
      {
        question: "Does it generate the image?",
        answer: "No. It generates the prompt you can paste into Midjourney.",
      },
      {
        question: "Can I change aspect ratio?",
        answer: "Yes. The builder includes common ratios for web, social, and mobile visuals.",
      },
    ],
  },
  {
    slug: "flux-prompt-builder",
    title: "FLUX Prompt Builder",
    shortTitle: "FLUX",
    description: "Create direct, high-adherence image prompts with commercial styling, composition, material details, and negative prompts.",
    eyebrow: "Build precise image prompts",
    category: "Image",
    href: "/prompt-tools/flux-prompt-builder",
    primaryAction: "Build FLUX prompt",
    outcome: "Clear visual generation brief",
    examples: ["Product photography", "Brand visuals", "UI concept scenes"],
    faqs: [
      {
        question: "How is this different from Midjourney?",
        answer: "FLUX prompts usually benefit from direct visual language and clear object-level details.",
      },
      {
        question: "Does it include negative prompts?",
        answer: "Yes. It creates a separate negative prompt line for common visual defects and clutter.",
      },
    ],
  },
];

export const promptToolMap = new Map(promptTools.map((tool) => [tool.slug, tool]));

export const promptStudioValues = [
  {
    title: "Browser-only",
    description: "Drafting, scoring, counting, formatting, and estimating run in the page without an AI API.",
  },
  {
    title: "Offline-ready logic",
    description: "Core tools keep working after the page has loaded because the calculations are deterministic.",
  },
  {
    title: "Model-aware",
    description: "Guidance covers chat, reasoning, coding, image, and long-context prompt workflows.",
  },
  {
    title: "Free for teams",
    description: "Useful for creators, operators, marketers, developers, and enterprise AI teams.",
  },
];

export const modelPlaybooks = [
  {
    name: "ChatGPT",
    bestFor: "General reasoning, writing, coding, and structured workflows.",
    guidance: "Give clear context, desired role, constraints, output format, and examples when precision matters.",
  },
  {
    name: "Claude",
    bestFor: "Long context, careful writing, analysis, policies, and product thinking.",
    guidance: "Use plain language, provide source material, and state evaluation criteria before asking for the output.",
  },
  {
    name: "Gemini",
    bestFor: "Research, multimodal tasks, spreadsheet-like analysis, and Google ecosystem workflows.",
    guidance: "Specify input types, citation expectations, and the exact format for synthesized answers.",
  },
  {
    name: "Midjourney",
    bestFor: "Art direction, editorial imagery, cinematic scenes, and style exploration.",
    guidance: "Describe subject, medium, composition, lighting, lens, mood, and aspect ratio in a compact sequence.",
  },
  {
    name: "FLUX",
    bestFor: "High-adherence image generation and commercial visual systems.",
    guidance: "Use direct visual language, brand constraints, material details, and negative space requirements.",
  },
  {
    name: "DeepSeek",
    bestFor: "Technical reasoning, code review, and cost-conscious workflows.",
    guidance: "Break hard tasks into steps, include test cases, and request concise reasoning before final output.",
  },
];

export const promptRecipes: PromptRecipe[] = [
  {
    title: "Landing Page Critic",
    useCase: "Marketing",
    models: ["ChatGPT", "Claude", "Gemini"],
    prompt:
      "Act as a senior conversion strategist. Review this landing page copy for clarity, trust, differentiation, objections, and conversion intent. Return prioritized fixes with before-and-after examples.",
  },
  {
    title: "Code Review Partner",
    useCase: "Engineering",
    models: ["Claude", "ChatGPT", "DeepSeek"],
    prompt:
      "Act as a senior engineer reviewing this change. Focus on correctness, security, performance, maintainability, and missing tests. Lead with concrete findings and reference exact files or functions.",
  },
  {
    title: "Research Brief Builder",
    useCase: "Research",
    models: ["Gemini", "Claude", "ChatGPT"],
    prompt:
      "Create a research brief for this topic. Include the question, audience, known facts, unknowns, likely sources, evaluation criteria, and a concise executive summary format.",
  },
  {
    title: "Agent Task Spec",
    useCase: "AI Agents",
    models: ["Claude", "ChatGPT", "DeepSeek"],
    prompt:
      "Turn this goal into an agent-ready task spec with objective, inputs, constraints, tools, validation steps, stop conditions, and expected final response.",
  },
  {
    title: "Image Campaign Prompt",
    useCase: "Image generation",
    models: ["Midjourney", "FLUX", "Stable Diffusion"],
    prompt:
      "Create an image prompt for a premium campaign visual. Include subject, setting, composition, lighting, material details, brand mood, aspect ratio, and negative prompt.",
  },
  {
    title: "Executive Summary Builder",
    useCase: "Operations",
    models: ["ChatGPT", "Claude", "Gemini"],
    prompt:
      "Summarize this information for an executive audience. Include decision context, risks, options, recommendation, timeline, and open questions.",
  },
];

export const promptToolModels = modelPlaybooks.map((model) => model.name);

export function getPromptTool(slug: PromptToolSlug) {
  return promptToolMap.get(slug);
}

export function getRelatedPromptTools(slug: PromptToolSlug, limit = 3) {
  const current = getPromptTool(slug);
  const sameCategory = promptTools.filter((tool) => tool.slug !== slug && tool.category === current?.category);
  const others = promptTools.filter((tool) => tool.slug !== slug && tool.category !== current?.category);
  return [...sameCategory, ...others].slice(0, limit);
}
