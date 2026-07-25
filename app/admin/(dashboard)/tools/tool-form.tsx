"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { cardClass } from "@/components/ui/card";
import {
  emptyToolFormValues,
  saveTool,
  type AdminToolFormValues,
} from "@/lib/admin-tools-client";

const inputClass =
  "w-full rounded-sm border border-border-subtle bg-surface-1 px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-accent";
const labelClass = "text-sm font-medium text-text-secondary";
const listHintClass = "text-caption mt-1 text-text-muted";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint ? <p className={listHintClass}>{hint}</p> : null}
    </div>
  );
}

export function ToolForm({ id, initial }: { id?: string; initial?: AdminToolFormValues }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const [values, setValues] = useState<AdminToolFormValues>(initial ?? emptyToolFormValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  function update<K extends keyof AdminToolFormValues>(key: K, value: AdminToolFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setWarning(null);
    try {
      const result = await saveTool(values, id);
      if (result.vectorIndexError) {
        setWarning(`Saved to the catalog, but Pinecone indexing failed: ${result.vectorIndexError}`);
      }
      router.push("/admin/tools");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save tool.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Basics</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Slug" hint={isEditing ? "Changing this changes the tool's URL." : "Leave blank to auto-generate from name."}>
            <input value={values.slug} onChange={(e) => update("slug", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Category">
            <input
              required
              value={values.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Subcategory" hint="Defaults to category if left blank.">
            <input
              value={values.subcategory}
              onChange={(e) => update("subcategory", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Company" hint="Defaults to name if left blank.">
            <input value={values.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Website">
            <input
              value={values.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </Field>
          <Field label="Domain" hint="Auto-extracted from website if left blank.">
            <input value={values.domain} onChange={(e) => update("domain", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={values.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
              <option value="Active">Active</option>
              <option value="Beta">Beta</option>
              <option value="Waitlist">Waitlist</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </Field>
          <Field label="Favicon URL" hint="Auto-generated from domain if left blank.">
            <input value={values.favicon} onChange={(e) => update("favicon", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Logo URL">
            <input value={values.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Launch year">
            <input
              type="number"
              value={values.launchYear}
              onChange={(e) => update("launchYear", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Rank" hint="Optional manual sort order.">
            <input type="number" value={values.rank} onChange={(e) => update("rank", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Short description">
          <textarea
            required
            rows={2}
            value={values.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Summary" hint="Long editorial summary. Blank paragraph lines create separate paragraphs on the tool page.">
          <textarea rows={8} value={values.summary} onChange={(e) => update("summary", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Pricing</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Free plan" hint="Yes / No / Limited, or free text.">
            <input value={values.freePlan} onChange={(e) => update("freePlan", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Pricing model">
            <input
              value={values.pricingModel}
              onChange={(e) => update("pricingModel", e.target.value)}
              placeholder="Free / Freemium / Subscription / Usage-based / Enterprise / Custom"
              className={inputClass}
            />
          </Field>
          <Field label="Starting price (USD/mo)">
            <input
              type="number"
              value={values.startingPriceUsd}
              onChange={(e) => update("startingPriceUsd", e.target.value)}
              className={inputClass}
            />
          </Field>
          <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={values.freeTrial} onChange={(e) => update("freeTrial", e.target.checked)} />
            Free trial available
          </label>
        </div>
        <Field label="Pricing notes">
          <textarea rows={2} value={values.pricingNotes} onChange={(e) => update("pricingNotes", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Classification & lists</p>
        <p className="text-caption text-text-muted">Separate list items with “ | ” — same convention as the CSV importer.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Features">
            <textarea rows={2} value={values.features} onChange={(e) => update("features", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Best for">
            <textarea rows={2} value={values.bestFor} onChange={(e) => update("bestFor", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Target audience">
            <textarea rows={2} value={values.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Tags">
            <textarea rows={2} value={values.tags} onChange={(e) => update("tags", e.target.value)} className={inputClass} />
          </Field>
          <Field label="AI type">
            <input value={values.aiType} onChange={(e) => update("aiType", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Modalities">
            <input value={values.modalities} onChange={(e) => update("modalities", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Model provider">
            <input value={values.modelProvider} onChange={(e) => update("modelProvider", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Model names">
            <input value={values.modelNames} onChange={(e) => update("modelNames", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Deployment type">
            <input value={values.deploymentType} onChange={(e) => update("deploymentType", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Platforms">
            <input value={values.platforms} onChange={(e) => update("platforms", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Integrations">
            <input value={values.integrations} onChange={(e) => update("integrations", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Security / compliance">
            <input value={values.security} onChange={(e) => update("security", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Technical & trust</p>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={values.apiAvailable} onChange={(e) => update("apiAvailable", e.target.checked)} />
            API available
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={values.openSource} onChange={(e) => update("openSource", e.target.checked)} />
            Open source
          </label>
          <Field label="Team collaboration">
            <select
              value={values.teamCollaboration}
              onChange={(e) => update("teamCollaboration", e.target.value as AdminToolFormValues["teamCollaboration"])}
              className={inputClass}
            >
              <option value="unknown">Unknown</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>
        <Field label="Privacy notes">
          <textarea rows={2} value={values.privacyNotes} onChange={(e) => update("privacyNotes", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Stats</p>
        <p className="text-caption text-text-muted">
          Popularity, rating, and review count are computed automatically — popularity from real
          engagement (views, saves, compares, searches), rating and review count from user
          reviews. None of these can be set here.
        </p>
        {isEditing ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Popularity score">
              <input disabled value={values.popularityScore || "0"} className={`${inputClass} opacity-60`} />
            </Field>
            <Field label="Rating (0-5)">
              <input disabled value={values.rating || "—"} className={`${inputClass} opacity-60`} />
            </Field>
            <Field label="Review count">
              <input disabled value={values.reviewCount || "0"} className={`${inputClass} opacity-60`} />
            </Field>
          </div>
        ) : null}
        <Field label="Last verified" hint="YYYY-MM-DD">
          <input type="date" value={values.lastVerified} onChange={(e) => update("lastVerified", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Editorial</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pros" hint="One per “ | ”-separated entry.">
            <textarea rows={2} value={values.pros} onChange={(e) => update("pros", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Cons">
            <textarea rows={2} value={values.cons} onChange={(e) => update("cons", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Editorial verdict">
          <textarea rows={3} value={values.editorialVerdict} onChange={(e) => update("editorialVerdict", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Alternatives note">
          <textarea rows={2} value={values.alternativesNote} onChange={(e) => update("alternativesNote", e.target.value)} className={inputClass} />
        </Field>
        <Field label="FAQs" hint="One per line: question::answer">
          <textarea
            rows={4}
            value={values.faqs}
            onChange={(e) => update("faqs", e.target.value)}
            placeholder={"Is it free?::Yes, there's a free plan.\nDoes it have an API?::Yes."}
            className={`${inputClass} font-mono text-xs`}
          />
        </Field>
        <Field label="Feature notes" hint="One per line: feature::benefit">
          <textarea
            rows={4}
            value={values.featureNotes}
            onChange={(e) => update("featureNotes", e.target.value)}
            placeholder={"Writing assistance::Draft content faster.\nCoding support::Explain and debug snippets."}
            className={`${inputClass} font-mono text-xs`}
          />
        </Field>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Source attribution</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Source name">
            <input value={values.sourceName} onChange={(e) => update("sourceName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Source type">
            <input value={values.sourceType} onChange={(e) => update("sourceType", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Source URL">
            <input value={values.sourceUrl} onChange={(e) => update("sourceUrl", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>

      {warning ? (
        <p className="text-sm rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-amber-300">{warning}</p>
      ) : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create tool"}
        </button>
      </div>
    </form>
  );
}
