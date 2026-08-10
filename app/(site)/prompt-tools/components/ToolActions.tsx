"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BuilderSection } from "@/app/(site)/prompt-tools/components/BuilderSection";
import { PromptOutput } from "@/app/(site)/prompt-tools/components/PromptOutput";
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

const toolInputClass = "platform-input rounded-card px-4 py-3 text-sm";
const toolTextareaClass = "platform-textarea resize-none rounded-card px-4 py-3 text-sm";

type CalculatorStat = {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
};

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

  const isCost = slug === "cost-calculator";
  const isContext = slug === "context-window-calculator";
  const isFlux = slug === "flux-prompt-builder";
  const isMidjourney = slug === "midjourney-prompt-builder";
  const isImage = isMidjourney || isFlux;
  const isTemplate = slug === "template-builder";
  const isSystem = slug === "system-prompt-builder";
  const isCleaner = slug === "prompt-cleaner";
  const isFormatter = slug === "prompt-formatter";
  const showRole = isFormatter || isSystem;
  const showOutput = isFormatter || isTemplate;

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

    if (isCost) {
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

    if (isContext) {
      const used = tokenCount + reservedOutput;
      const remaining = context - used;
      return [
        `Estimated input tokens: ${tokenCount.toLocaleString()}`,
        `Reserved output tokens: ${reservedOutput.toLocaleString()}`,
        `Total context needed: ${used.toLocaleString()}`,
        remaining >= 0 ? `Fits. Remaining room: ${remaining.toLocaleString()} tokens` : `Too large by ${Math.abs(remaining).toLocaleString()} tokens`,
      ].join("\n");
    }

    if (isFormatter) return formatPrompt(text, role, output);
    if (isCleaner) return cleanPrompt(text);
    if (isTemplate) return templatePrompt(text, output, variables);
    if (isSystem) return systemPrompt(role, text, boundaries);
    if (isMidjourney) return imagePrompt("midjourney", text, style, composition, ratio);
    return imagePrompt("flux", text, style, composition, ratio);
  }, [boundaries, composition, context, inputTokens, isCleaner, isCost, isContext, isFormatter, isMidjourney, isSystem, isTemplate, model, output, outputTokens, ratio, requests, reservedOutput, role, slug, style, text, variables]);

  // Calculators get real stat tiles instead of the code-block used for
  // builders/transformers — a calculator's answer is numbers, not a prompt
  // someone wrote. `result` (above) stays available so Copy still copies a
  // readable plain-text summary.
  const calculatorStats: CalculatorStat[] | null = useMemo(() => {
    const tokenCount = estimateTokens(text);

    if (slug === "token-counter") {
      return [
        { label: "Estimated tokens", value: tokenCount.toLocaleString() },
        { label: "Words", value: (text.trim() ? text.trim().split(/\s+/).length : 0).toLocaleString() },
        { label: "Characters", value: text.length.toLocaleString() },
        {
          label: "Reading time",
          value: `${Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 220))} min`,
        },
      ];
    }

    if (isCost) {
      const price = modelPrices[model];
      const perRequest = (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
      const total = perRequest * requests;
      return [
        { label: "Model", value: model },
        { label: "Cost per request", value: `$${perRequest.toFixed(6)}` },
        { label: "Total estimate", value: `$${total.toFixed(2)}`, tone: "success" },
        { label: "Monthly at this volume", value: `$${(total * 30).toFixed(2)}` },
      ];
    }

    if (isContext) {
      const used = tokenCount + reservedOutput;
      const remaining = context - used;
      const fits = remaining >= 0;
      return [
        { label: "Input tokens", value: tokenCount.toLocaleString() },
        { label: "Reserved output", value: reservedOutput.toLocaleString() },
        { label: "Total needed", value: used.toLocaleString() },
        {
          label: fits ? "Remaining room" : "Over budget by",
          value: `${Math.abs(remaining).toLocaleString()} tokens`,
          tone: fits ? "success" : "danger",
        },
      ];
    }

    return null;
  }, [context, inputTokens, isCost, isContext, model, outputTokens, requests, reservedOutput, slug, text]);

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  // Labels that were previously one generic string shared across several
  // tools — now specific to what each field actually means for this tool.
  const mainFieldLabel = isImage
    ? "Subject"
    : isSystem
      ? "Operating rules"
      : isTemplate
        ? "Topic"
        : "Prompt or source text";
  const outputFieldLabel = isTemplate ? "Audience" : "Output format";

  const parsedVariables = variables
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const outputEyebrow = isCleaner
    ? "After"
    : isFormatter
      ? "After"
      : "Generated prompt";
  const outputTitle = isCleaner ? "Cleaned result" : isFormatter ? "Formatted result" : "Live output";
  const inputEyebrow = isCleaner || isFormatter ? "Before" : "Tool workspace";
  const inputTitle = isCleaner
    ? "Your original prompt"
    : isFormatter
      ? "Your rough draft"
      : "Tune the inputs";

  return (
    <section
      id="tool-workspace"
      aria-labelledby="tool-workspace-title"
      className="grid scroll-mt-28 gap-6 rounded-card-lg bg-surface-1 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div>
        <div className="mb-5">
          <p className="text-eyebrow text-brand-electric-strong">{inputEyebrow}</p>
          <h2 id="tool-workspace-title" className="text-heading-1 mt-2 text-text-primary">
            {inputTitle}
          </h2>
        </div>
        <div className="grid gap-5">
          {isCost ? (
            <BuilderSection label="Model & volume">
              <label className="grid gap-2 text-sm font-semibold text-text-primary">
                Model
                <select value={model} onChange={(event) => setModel(event.target.value as keyof typeof modelPrices)} className={toolInputClass}>
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
            </BuilderSection>
          ) : isSystem ? (
            <>
              <BuilderSection label="Role">
                <input value={role} onChange={(event) => setRole(event.target.value)} className={toolInputClass} placeholder="e.g. a senior support agent" />
              </BuilderSection>
              <BuilderSection label="Operating rules">
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={5}
                  className={`${toolTextareaClass} leading-6`}
                />
              </BuilderSection>
              <BuilderSection label="Boundaries">
                <textarea value={boundaries} onChange={(event) => setBoundaries(event.target.value)} rows={3} className={toolTextareaClass} />
              </BuilderSection>
            </>
          ) : isTemplate ? (
            <>
              <BuilderSection label="Topic">
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={4}
                  className={`${toolTextareaClass} leading-6`}
                />
              </BuilderSection>
              <BuilderSection label="Audience">
                <input value={output} onChange={(event) => setOutput(event.target.value)} className={toolInputClass} />
              </BuilderSection>
              <BuilderSection label="Variables">
                <input
                  value={variables}
                  onChange={(event) => setVariables(event.target.value)}
                  className={toolInputClass}
                  placeholder="topic, audience, goal, format"
                />
                {parsedVariables.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5" aria-label="Parsed template variables">
                    {parsedVariables.map((item) => (
                      <span
                        key={item}
                        className="rounded-sm border border-brand-cyan-strong/30 bg-brand-cyan/12 px-2 py-1 font-mono text-xs font-semibold text-brand-cyan-strong"
                      >
                        {`{{${item}}}`}
                      </span>
                    ))}
                  </div>
                ) : null}
              </BuilderSection>
            </>
          ) : isImage ? (
            <>
              <BuilderSection label="Subject">
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={4}
                  className={`${toolTextareaClass} leading-6`}
                />
              </BuilderSection>
              <BuilderSection label="Style & composition">
                <input value={style} onChange={(event) => setStyle(event.target.value)} className={toolInputClass} placeholder="Style" />
                <input value={composition} onChange={(event) => setComposition(event.target.value)} className={toolInputClass} placeholder="Composition" />
                {isMidjourney ? (
                  <label className="grid gap-2 text-sm font-semibold text-text-primary">
                    Aspect ratio
                    <select value={ratio} onChange={(event) => setRatio(event.target.value)} className={toolInputClass}>
                      {ratios.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </BuilderSection>
            </>
          ) : (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              {mainFieldLabel}
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={7}
                className={`${toolTextareaClass} leading-6`}
              />
            </label>
          )}

          {isContext ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Context window" value={context} onChange={setContext} />
              <NumberField label="Reserved output" value={reservedOutput} onChange={setReservedOutput} />
            </div>
          ) : null}

          {showRole && !isSystem ? (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Role
              <input value={role} onChange={(event) => setRole(event.target.value)} className={toolInputClass} />
            </label>
          ) : null}

          {showOutput && !isTemplate ? (
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              {outputFieldLabel}
              <input value={output} onChange={(event) => setOutput(event.target.value)} className={toolInputClass} />
            </label>
          ) : null}

          {calculatorStats ? (
            <Button type="button" onClick={() => void copyResult()} size="lg" className="w-full">
              {copied ? "Copied ✓" : actionLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {calculatorStats ? (
        <div className="flex min-h-[16rem] flex-col rounded-card-lg bg-surface-2 p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-eyebrow text-brand-electric-strong">Result</p>
              <h2 className="text-heading-1 mt-2 text-text-primary">Breakdown</h2>
            </div>
            <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1 text-xs font-semibold text-text-muted">
              Local
            </span>
          </div>
          <div className="grid flex-1 auto-rows-min gap-3 sm:grid-cols-2">
            {calculatorStats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-card border p-4 ${
                  stat.tone === "success"
                    ? "border-emerald-400/25 bg-emerald-400/8"
                    : stat.tone === "danger"
                      ? "border-rose-400/25 bg-rose-400/8"
                      : "border-border-subtle bg-surface-1"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{stat.label}</p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    stat.tone === "success"
                      ? "text-emerald-300"
                      : stat.tone === "danger"
                        ? "text-rose-300"
                        : "text-text-primary"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <PromptOutput
          eyebrow={outputEyebrow}
          title={outputTitle}
          content={result}
          highlightVariables={isTemplate}
          actionLabel={actionLabel}
        />
      )}
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
        className={toolInputClass}
      />
    </label>
  );
}
