"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import QRCode from "qrcode";
import styles from "./qr-generator.module.css";

type ErrorLevel = "L" | "M" | "Q" | "H";

const ERROR_LEVELS: { value: ErrorLevel; label: string; hint: string }[] = [
  { value: "L", label: "L", hint: "7%" },
  { value: "M", label: "M", hint: "15%" },
  { value: "Q", label: "Q", hint: "25%" },
  { value: "H", label: "H", hint: "30%" },
];

const PNG_SIZE = 1024;

function normalizeFilename(input: string): string {
  try {
    const url = new URL(input);
    return url.hostname.replace(/[^a-z0-9.-]/gi, "") || "qr-code";
  } catch {
    return "qr-code";
  }
}

function isLikelyValid(input: string): boolean {
  return input.trim().length > 0;
}

export function QrGenerator() {
  const [url, setUrl] = useState("https://vercel.com");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [svgMarkup, setSvgMarkup] = useState<string>("");
  const [pngDataUrl, setPngDataUrl] = useState<string>("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [error, setError] = useState<string | null>(null);

  const deferredUrl = useDeferredValue(url);
  const canGenerate = isLikelyValid(deferredUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!canGenerate) {
      setSvgMarkup("");
      setPngDataUrl("");
      setError(null);
      return;
    }

    let cancelled = false;

    const options = {
      errorCorrectionLevel: errorLevel,
      margin: 1,
      color: {
        dark: "#0a0a0a",
        light: "#ffffff",
      },
    } as const;

    Promise.all([
      QRCode.toString(deferredUrl, { ...options, type: "svg" }),
      QRCode.toDataURL(deferredUrl, { ...options, width: PNG_SIZE }),
    ])
      .then(([svg, png]) => {
        if (cancelled) return;
        setSvgMarkup(svg);
        setPngDataUrl(png);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "could not generate qr.";
        setError(message);
        setSvgMarkup("");
        setPngDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [deferredUrl, errorLevel, canGenerate]);

  const baseFilename = useMemo(() => normalizeFilename(deferredUrl), [deferredUrl]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    triggerDownload(href, `${baseFilename}.svg`);
    URL.revokeObjectURL(href);
  }, [svgMarkup, baseFilename]);

  const handleDownloadPng = useCallback(() => {
    if (!pngDataUrl) return;
    triggerDownload(pngDataUrl, `${baseFilename}.png`);
  }, [pngDataUrl, baseFilename]);

  const handleCopy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      // clipboard blocked — silent.
    }
  }, [url]);

  const handleClear = useCallback(() => {
    setUrl("");
    inputRef.current?.focus();
  }, []);

  return (
    <section className={styles.wrap} aria-labelledby="qr-heading">
      <h2 id="qr-heading" className={styles.srOnly}>
        qr generator
      </h2>

      <div className={styles.grid}>
        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="url-input" className={styles.label}>
              <span className={styles.labelIndex}>1</span>
              <span>paste url</span>
            </label>
            <div className={styles.inputRow}>
              <input
                id="url-input"
                ref={inputRef}
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="https://example.com"
                className={styles.input}
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
              {url && (
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={handleClear}
                  aria-label="clear input"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3l8 8M11 3l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <span className={styles.label}>
                <span className={styles.labelIndex}>2</span>
                <span>error correction</span>
              </span>
            </legend>
            <div className={styles.segmented} role="radiogroup">
              {ERROR_LEVELS.map((level) => {
                const selected = errorLevel === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`${styles.segment} ${
                      selected ? styles.segmentActive : ""
                    }`}
                    onClick={() => setErrorLevel(level.value)}
                  >
                    <span className={styles.segmentLabel}>{level.label}</span>
                    <span className={styles.segmentHint}>{level.hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.field}>
            <span className={styles.label}>
              <span className={styles.labelIndex}>3</span>
              <span>download</span>
            </span>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={handleDownloadSvg}
                disabled={!svgMarkup}
              >
                <DownloadIcon />
                <span>svg</span>
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={handleDownloadPng}
                disabled={!pngDataUrl}
              >
                <DownloadIcon />
                <span>png</span>
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={handleCopy}
                disabled={!url}
              >
                {copyState === "copied" ? "copied" : "copy url"}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.preview}>
          <div className={styles.previewFrame}>
            {svgMarkup ? (
              <div
                className={styles.svgHost}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                aria-label={`qr code for ${deferredUrl}`}
                role="img"
              />
            ) : (
              <div className={styles.placeholder} aria-hidden="true">
                <span>— paste a url —</span>
              </div>
            )}
          </div>
          <div className={styles.meta}>
            <span className={styles.metaKey}>→</span>
            <span className={styles.metaValue} title={deferredUrl}>
              {deferredUrl || "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 2v8m0 0l3-3m-3 3L5 7M2.5 13.5h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
