"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { cardClass } from "@/components/ui/card";
import { importToolsCsv, type ImportCsvResponse } from "@/lib/admin-tools-client";

export function ToolsCsvImportForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportCsvResponse | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImporting(true);
    setProgress(null);
    setError(null);
    setResult(null);

    try {
      const response = await importToolsCsv(file, (done, total) => setProgress({ done, total }));
      setResult(response);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "CSV import failed.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const failedRows = result?.results.filter((row) => !row.ok) ?? [];
  const vectorWarningRows = result?.results.filter((row) => row.ok && row.vectorIndexError) ?? [];

  return (
    <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
      <p className="text-eyebrow text-brand-cyan-strong">Bulk import</p>
      <h2 className="text-heading-2 mt-2 text-text-primary">Import AI tools from CSV</h2>
      <p className="text-body mt-1 text-text-secondary">
        Upload a CSV using the standard column set (<code>name</code>, <code>category</code>,{" "}
        <code>shortDescription</code> required). List fields like <code>features</code> or{" "}
        <code>tags</code> use <code>|</code> to separate values; <code>faqs</code> and{" "}
        <code>featureNotes</code> use <code>question::answer</code> pairs separated by{" "}
        <code>|</code>. Each row is upserted by slug, saved to Postgres, and indexed into
        Pinecone automatically.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={importing}
          className="hidden"
          id="tools-csv-input"
        />
        <label
          htmlFor="tools-csv-input"
          className={`cursor-pointer rounded-pill bg-brand-electric px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-electric-strong ${
            importing ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {importing ? "Importing…" : "Choose CSV file"}
        </label>
        {fileName ? <span className="text-caption text-text-muted">{fileName}</span> : null}
        {importing && progress ? (
          <span className="text-caption text-text-muted">
            {progress.done} / {progress.total} rows
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="text-body mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-300">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-border-subtle px-3 py-1.5 text-text-secondary">
              {result.total} rows read
            </span>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-300">
              {result.succeeded} succeeded
            </span>
            {result.failed > 0 ? (
              <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-red-300">
                {result.failed} failed
              </span>
            ) : null}
            {result.skipped ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-amber-300">
                {result.skipped} skipped
              </span>
            ) : null}
          </div>

          {vectorWarningRows.length > 0 ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
              <p className="text-caption font-medium text-amber-300">
                Saved to the catalog, but Pinecone indexing failed for {vectorWarningRows.length} row
                {vectorWarningRows.length === 1 ? "" : "s"} — check the backend&rsquo;s Pinecone
                configuration, then use “Reindex” per tool once it&rsquo;s fixed.
              </p>
            </div>
          ) : null}

          {failedRows.length > 0 ? (
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-2xl border border-border-subtle bg-surface-1 p-4">
              {failedRows.map((row) => (
                <p key={row.index} className="text-caption text-text-secondary">
                  Row {row.row ?? row.index + 1}
                  {row.name ? ` (${row.name})` : ""}: {row.error}
                </p>
              ))}
            </div>
          ) : null}

          {result.skippedRows && result.skippedRows.length > 0 ? (
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-2xl border border-border-subtle bg-surface-1 p-4">
              {result.skippedRows.map((row) => (
                <p key={row.row} className="text-caption text-text-secondary">
                  Row {row.row} skipped: {row.error}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
