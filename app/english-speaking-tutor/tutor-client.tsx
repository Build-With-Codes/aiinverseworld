"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TutorMessage = {
  id: string;
  role: "user" | "tutor";
  text: string;
  correction?: string;
  score?: number;
};

type TutorTurnResponse = {
  sessionId: string;
  transcript: string;
  reply: string;
  correction: string;
  score: number;
  focus: string;
  nextQuestion: string;
};

type TutorProgress = {
  enabled: boolean;
  sessions: Array<{
    id: string;
    focus: string;
    averageScore: number | null;
    startedAt: string;
    turnCount: number;
  }>;
  commonMistakes: Array<{
    mistake: string;
    correction: string;
    category: string;
    count: number;
  }>;
};

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResult = {
  0: SpeechRecognitionResultItem;
};

type SpeechRecognitionResultList = {
  length: number;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
};

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const starterMessages: TutorMessage[] = [
  {
    id: "welcome",
    role: "tutor",
    text: "Hi, I am your English speaking tutor. Tell me what you did today, and I will correct your sentence naturally.",
    score: 82,
  },
];

const focusOptions = ["Daily conversation", "Job interview", "Grammar", "Vocabulary"];
const openRouterStatus =
  "OpenRouter text tutor ready. Use the mic button below for browser speech input.";

export function EnglishTutorClient() {
  const [messages, setMessages] = useState<TutorMessage[]>(starterMessages);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [focus, setFocus] = useState(focusOptions[0]);
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const realtimeStatus = openRouterStatus;
  const [progress, setProgress] = useState<TutorProgress | null>(null);
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const sessionIdRef = useRef<string | undefined>(undefined);

  const latestScore = useMemo(() => {
    const scored = [...messages].reverse().find((message) => message.score);
    return scored?.score ?? 0;
  }, [messages]);

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setDraft(transcript.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function setActiveSession(nextSessionId?: string) {
    if (!nextSessionId) {
      return;
    }

    sessionIdRef.current = nextSessionId;
    setSessionId(nextSessionId);
  }

  function toggleListening() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setDraft("");
    recognition.start();
    setIsListening(true);
  }

  async function saveTurn(userText: string, tutorText: string) {
    try {
      const response = await fetch("/api/english-tutor/turns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current ?? sessionId,
          userText,
          tutorText,
          focus,
          provider: "openrouter",
        }),
      });

      if (!response.ok) {
        return;
      }

      const saved = (await response.json()) as {
        sessionId?: string;
        correction?: string;
        score?: number;
      };

      if (saved.sessionId) {
        setActiveSession(saved.sessionId);
      }

      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1 && message.role === "tutor"
            ? {
                ...message,
                correction: saved.correction,
                score: saved.score,
              }
            : message,
        ),
      );
      await loadProgress();
    } catch {
      return;
    }
  }

  async function loadProgress() {
    setIsProgressLoading(true);

    try {
      const response = await fetch("/api/english-tutor/progress", {
        cache: "no-store",
      });

      if (response.ok) {
        setProgress((await response.json()) as TutorProgress);
      }
    } catch {
      setProgress(null);
    } finally {
      setIsProgressLoading(false);
    }
  }

  useEffect(() => {
    loadProgress();
  }, []);

  async function submitTurn() {
    const transcript = draft.trim();
    if (!transcript || isSending) {
      return;
    }

    const userMessage: TutorMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: transcript,
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/english-tutor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          sessionId: sessionIdRef.current ?? sessionId,
          focus,
        }),
      });

      if (!response.ok) {
        throw new Error("Tutor request failed");
      }

      const turn = (await response.json()) as TutorTurnResponse;
      setActiveSession(turn.sessionId);
      const tutorText = `${turn.reply} ${turn.nextQuestion}`;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "tutor",
          text: tutorText,
          correction: turn.correction,
          score: turn.score,
        },
      ]);
      await saveTurn(transcript, tutorText);
      speak(tutorText);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "tutor",
          text: "I could not reach the tutor backend. You can still type or speak your sentence, then try again.",
          correction: "Check that the backend service is running on port 3001.",
          score: latestScore || 70,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="pb-10 pt-8 sm:pt-12">
      <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-emerald-100 uppercase">
            Real-time speaking practice
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              AI English Speaking Tutor
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-text-secondary">
              Speak naturally, hear a tutor response, and get instant grammar
              corrections, fluency scoring, and a next question for continued
              practice.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Fluency score" value={`${latestScore}`} />
            <Metric label="Tutor mode" value={focus.split(" ")[0]} />
            <Metric
              label="Voice loop"
              value={speechSupported ? "Browser" : "Text"}
            />
          </div>

          <div className="rounded-card border border-border-subtle bg-surface-2 p-6">
            <p className="text-sm font-semibold text-white">AI pipeline</p>
            <div className="mt-5 grid gap-3">
              {[
                "Browser mic",
                "STT transcript",
                "OpenRouter tutor",
                "TTS voice",
                "Progress store",
              ].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan/10 text-sm font-semibold text-brand-cyan-strong">
                      {index + 1}
                    </span>
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-card border border-border-subtle bg-surface-2 p-6">
            <p className="text-sm font-semibold text-white">Learning memory</p>
            <div className="mt-4 space-y-3">
              {isProgressLoading ? (
                <div className="space-y-3" aria-busy="true" aria-live="polite">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border-subtle bg-surface-1 p-3"
                    >
                      <div className="skeleton-shimmer h-4 w-4/5 rounded-full" />
                      <div className="skeleton-shimmer mt-3 h-3 w-2/5 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : progress?.commonMistakes.length ? (
                progress.commonMistakes.slice(0, 4).map((mistake) => (
                  <div
                    key={`${mistake.mistake}-${mistake.correction}`}
                    className="rounded-2xl border border-border-subtle bg-surface-1 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-200">
                      {mistake.mistake} -&gt; {mistake.correction}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {mistake.category} - {mistake.count} time
                      {mistake.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-text-muted">
                  Saved mistakes and session scores will appear here after
                  practice.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-border-subtle bg-surface-1/90 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.34)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
            <div>
              <p className="text-sm font-semibold text-white">Live tutor room</p>
              <p className="mt-1 text-xs text-text-muted">
                Mic input, transcript, corrections, and spoken reply
              </p>
            </div>
            <select
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              className="rounded-full border border-border-subtle bg-surface-1 px-4 py-2 text-sm text-slate-200 outline-none"
              aria-label="Practice focus"
            >
              {focusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 rounded-[22px] border border-border-accent bg-brand-cyan/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">OpenRouter voice practice</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {realtimeStatus}
                </p>
              </div>
              <span className="rounded-full border border-border-accent bg-brand-cyan/10 px-5 py-3 text-sm font-semibold text-cyan-100">
                Use mic below
              </span>
            </div>
          </div>

          <div className="mt-4 h-[440px] space-y-4 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-card border p-4 ${
                  message.role === "user"
                    ? "ml-auto border-border-accent bg-brand-cyan/10"
                    : "mr-auto border-border-subtle bg-surface-2"
                } max-w-[92%]`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cyan-strong">
                  {message.role === "user" ? "You" : "Tutor"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{message.text}</p>
                {message.correction ? (
                  <div className="mt-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/8 p-3">
                    <p className="text-xs font-semibold text-emerald-200">Correction</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      {message.correction}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
            {isSending ? (
              <div
                className="mr-auto max-w-[92%] rounded-card border border-border-subtle bg-surface-2 p-4"
                aria-busy="true"
                aria-live="polite"
              >
                <div className="skeleton-shimmer h-3 w-20 rounded-full" />
                <div className="skeleton-shimmer mt-4 h-4 w-72 max-w-full rounded-full" />
                <div className="skeleton-shimmer mt-3 h-4 w-56 max-w-full rounded-full" />
              </div>
            ) : null}
          </div>

          <div className="mt-5 rounded-card border border-border-subtle bg-surface-2 p-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Speak or type: I want practice English..."
              className="min-h-24 w-full resize-none rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm leading-6 text-slate-100 outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggleListening}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${
                  isListening
                    ? "bg-rose-300 text-slate-950"
                    : "border border-border-accent bg-brand-cyan/10 text-cyan-100"
                }`}
              >
                {isListening ? "Stop mic" : "Start mic"}
              </button>
              <button
                type="button"
                onClick={submitTurn}
                disabled={!draft.trim() || isSending}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? "Thinking..." : "Send to tutor"}
              </button>
            </div>
            {!speechSupported ? (
              <p className="mt-3 text-xs leading-5 text-amber-200">
                Speech recognition is not available in this browser. Text
                practice still works.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}


function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border-subtle bg-surface-2 p-5">
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-text-muted">{label}</p>
    </div>
  );
}
