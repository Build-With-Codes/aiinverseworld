"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromptToolSlug } from "@/lib/prompt-tools";

type ToolActionsProps = {
  slug: PromptToolSlug;
  actionLabel: string;
};

const modelPrices = {
  "GPT-4.1 mini": { input: 0.4, output: 1.6, context: 1047576 },
  "Claude Sonnet": { input: 3, output: 15, context: 200000 },
  "Gemini Flash": { input: 0.35, output: 1.05, context: 1000000 },
  Custom: { input: 1, output: 3, context: 128000 },
};

const ratios = ["16:9", "1:1", "4:5", "9:16", "3:2"];

function estimateTokens(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const chars = trimmed.length;
  return Math.max(1, Math.round((chars / 4 + words * 0.75) / 2));
}

function formatPrompt(text: string, role: string, output: string) {
  const clean = text.trim() || "Describe the task, audience, inputs, and success criteria.";
  return [
    `Role: ${role || "Senior expert assistant"}`,
    "",
    "Task:",
    clean,
    "",
    "Context:",
    "- Add relevant background, audience, constraints, and source material.",
    "",
    "Output format:",
    `- ${output || "Clear structured answer"}`,
    "",
    "Quality bar:",
    "- Be specific, practical, and concise.",
    "- State assumptions when information is missing.",
    "- Include next steps where useful.",
  ].join("\n");
}

function cleanPrompt(text: string) {
  return (text || "Paste a messy prompt here.")
    .replace(/\s+/g, " ")
    .replace(/\b(please\s+)?kindly\b/gi, "please")
    .replace(/\bvery very\b/gi, "very")
    .replace(/\bmake sure to make sure\b/gi, "make sure")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function templatePrompt(topic: string, audience: string, variables: string) {
  const vars = variables
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `{{${item.replace(/[{}]/g, "")}}}`)
    .join(", ");

  return [
    `Template: ${topic || "Reusable AI workflow"}`,
    `Audience: ${audience || "Define target user"}`,
    `Variables: ${vars || "{{topic}}, {{audience}}, {{goal}}, {{format}}"}`,
    "",
    "Prompt:",
    "Act as a senior specialist. Help {{audience}} accomplish {{goal}} about {{topic}}.",
    "Use the provided context, respect constraints, and return the answer in {{format}}.",
    "",
    "Acceptance criteria:",
    "- Clear enough for repeat use.",
    "- Includes assumptions and risks.",
    "- Produces an actionable final answer.",
  ].join("\n");
}

function systemPrompt(role: string, rules: string, boundaries: string) {
  return [
    `You are ${role || "a reliable enterprise AI assistant"}.`,
    "",
    "Operating principles:",
    rules || "- Be accurate, concise, transparent, and useful.\n- Ask only necessary clarifying questions.\n- Prefer structured outputs.",
    "",
    "Boundaries:",
    boundaries || "- Do not invent facts.\n- Explain uncertainty.\n- Protect private or sensitive information.",
    "",
    "Response contract:",
    "- Lead with the answer.",
    "- Use bullets or tables when they improve clarity.",
    "- End with concrete next steps when useful.",
  ].join("\n");
}

function imagePrompt(kind: "midjourney" | "flux", subject: string, style: string, composition: string, ratio: string) {
  if (kind === "flux") {
    return [
      `${subject || "premium AI product dashboard"}, ${style || "clean enterprise visual design"}, ${composition || "centered composition with generous negative space"}, realistic details, crisp lighting, commercial-grade finish`,
      "Negative prompt: clutter, warped text, low resolution, blurry UI, extra fingers, distorted logo, harsh shadows",
    ].join("\n");
  }

  return `${subject || "premium AI product dashboard"}, ${style || "clean enterprise SaaS style"}, ${composition || "wide editorial composition"}, soft studio lighting, refined materials, crisp detail --ar ${ratio}`;
}

export function ToolActions({ slug, actionLabel }: ToolActionsProps) {
  const [text, setText] = useState("Create a practical launch plan for an AI product aimed at small business owners.");
  const [role, setRole] = useState("senior product strategist");
  const [output, setOutput] = useState("Checklist with timeline, risks, and success metrics");
  const [model, setModel] = useState<keyof typeof modelPrices>("GPT-4.1 mini");
  const [inputTokens, setInputTokens] = useState(12000);
  const [outputTokens, setOutputTokens] = useState(2000);
  const [requests, setRequests] = useState(1000);
  const [context, setContext] = useState(128000);
  const [reservedOutput, setReservedOutput] = useState(4000);
  const [variables, setVariables] = useState("topic, audience, goal, format");
  const [boundaries, setBoundaries] = useState("Do not invent facts. Explain uncertainty. Protect private information.");
  const [style, setStyle] = useState("premium, minimal, realistic, high detail");
  const [composition, setComposition] = useState("wide hero composition with clean negative space");
  const [ratio, setRatio] = useState(ratios[0]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const tokenCount = estimateTokens(text);
    if (slug === "token-counter") {
      return [
        `Estimated tokens: ${tokenCount.toLocaleString()}`,
        `Words: ${text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : "0"}`,
        `Characters: ${text.length.toLocaleString()}`,
        `Estimated reading time: ${Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 220))} min`,
      ].join("\n");
    }

    if (slug === "cost-calculator") {
      const price = modelPrices[model];
      const perRequest = (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
      const total = perRequest * requests;
      return [
        `Model: ${model}`,
        `Cost per request: $${perRequest.toFixed(6)}`,
        `Total estimate: $${total.toFixed(2)}`,
        `Monthly at same daily volume: $${(total * 30).toFixed(2)}`,
      ].join("\n");
    }

    if (slug === "context-window-calculator") {
      const used = tokenCount + reservedOutput;
      const remaining = context - used;
      return [
        `Estimated input tokens: ${tokenCount.toLocaleString()}`,
        `Reserved output tokens: ${reservedOutput.toLocaleString()}`,
        `Total context needed: ${used.toLocaleString()}`,
        remaining >= 0 ? `Fits. Remaining room: ${remaining.toLocaleString()} tokens` : `Too large by ${Math.abs(remaining).toLocaleString()} tokens`,
      ].join("\n");
    }

    if (slug === "prompt-formatter") return formatPrompt(text, role, output);
    if (slug === "prompt-cleaner") return cleanPrompt(text);
    if (slug === "template-builder") return templatePrompt(text, output, variables);
    if (slug === "system-prompt-builder") return systemPrompt(role, text, boundaries);
    if (slug === "midjourney-prompt-builder") return imagePrompt("midjourney", text, style, composition, ratio);
    return imagePrompt("flux", text, style, composition, ratio);
  }, [boundaries, composition, context, inputTokens, model, output, outputTokens, ratio, requests, reservedOutput, role, slug, style, text, variables]);

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const isCost = slug === "cost-calculator";
  const isContext = slug === "context-window-calculator";
  const isImage = slug === "midjourney-prompt-builder" || slug === "flux-prompt-builder";
  const isTemplate = slug === "template-builder";
  const isSystem = slug === "system-prompt-builder";
  const showRole = slug === "prompt-formatter" || isSystem;
  const showOutput = slug === "prompt-formatter" || isTemplate;

  return (
    <section id="tool-workspace" className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-5 shadow-card sm:p-6">
        <div className="grid gap-4">
          {isCost ? (
            <>
              <label className="grid gap-2 text-sm font-semibold text-text-primary">
                Model
                <select value={model} onChange={(event) => setModel(event.target.value as keyof typeof modelPrices)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-text-primary outline-none focus:border-border-accent">
                  {Object.keys(modelPrices).map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <NumberField label="Input tokens" value={inputTokens} onChange={setInputTokens} />
                <NumberField label="Output tokens" value={outputTokens} onChange={setOutputTokens} />
                <NumberField label="Requests" value={requests} onChange={setRequests} />
              </div>
            </>
          ) : (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              {isImage ? "Visual subject" : isSystem ? "Operating rules" : "Prompt or source text"}
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={7}
                className="resize-none rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm leading-6 text-text-primary outline-none focus:border-border-accent"
              />
            </label>
          )}

          {isContext ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Context window" value={context} onChange={setContext} />
              <NumberField label="Reserved output" value={reservedOutput} onChange={setReservedOutput} />
            </div>
          ) : null}

          {showRole ? (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Role
              <input value={role} onChange={(event) => setRole(event.target.value)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent" />
            </label>
          ) : null}

          {showOutput ? (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Output format or audience
              <input value={output} onChange={(event) => setOutput(event.target.value)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent" />
            </label>
          ) : null}

          {isTemplate ? (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Variables
              <input value={variables} onChange={(event) => setVariables(event.target.value)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent" />
            </label>
          ) : null}

          {isSystem ? (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Boundaries
              <textarea value={boundaries} onChange={(event) => setBoundaries(event.target.value)} rows={3} className="resize-none rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent" />
            </label>
          ) : null}

          {isImage ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-text-primary">
                Style
                <input value={style} onChange={(event) => setStyle(event.target.value)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-text-primary">
                Aspect ratio
                <select value={ratio} onChange={(event) => setRatio(event.target.value)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-text-primary outline-none focus:border-border-accent">
                  {ratios.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-text-primary sm:col-span-2">
                Composition
                <input value={composition} onChange={(event) => setComposition(event.target.value)} className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent" />
              </label>
            </div>
          ) : null}

          <Button type="button" onClick={copyResult} size="lg" className="w-full">
            {copied ? "Copied result" : actionLabel}
          </Button>
        </div>
      </div>

      <div className="flex min-h-[30rem] flex-col rounded-card-lg border border-border-accent bg-surface-2 p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-eyebrow text-brand-cyan-strong">Result</p>
            <h2 className="text-heading-1 mt-2 text-text-primary">Ready to copy</h2>
          </div>
          <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1 text-xs font-semibold text-text-muted">
            Local
          </span>
        </div>
        <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-3xl border border-border-subtle bg-surface-1 p-5 font-mono text-sm leading-7 text-text-secondary">
          {result}
        </pre>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-text-primary">
      {label}
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none focus:border-border-accent"
      />
    </label>
  );
}
