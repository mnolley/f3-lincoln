"use client";

import { useEffect, useState } from "react";

export const PAX_AUTH_KEY = "f3lincoln-pax-stats";
export const PAX_PASSWORD = "gloom";

type Props = {
  children: React.ReactNode;
  /** Optional subtitle under the unlock form */
  blurb?: string;
};

/**
 * Shared password gate for PAX-only tools (stats, leaderboard).
 * One unlock covers both pages for the browser session.
 */
export function PaxAuthGate({ children, blurb }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PAX_AUTH_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      // ignore private mode
    }
    setReady(true);
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim().toLowerCase() === PAX_PASSWORD) {
      try {
        sessionStorage.setItem(PAX_AUTH_KEY, "1");
      } catch {
        // ignore
      }
      setUnlocked(true);
      setAuthError("");
      setPassword("");
    } else {
      setAuthError("Wrong password. Try again, HIM.");
    }
  }

  function handleLock() {
    try {
      sessionStorage.removeItem(PAX_AUTH_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  }

  if (!ready) {
    return (
      <div className="card-panel p-8 text-center text-sm text-ink-dim">
        Loading…
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <div className="card-panel p-6 sm:p-8">
          <p className="section-label">Restricted</p>
          <h2 className="mt-2 font-display text-xl font-bold uppercase text-white">
            Enter the Gloom
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            {blurb ??
              "PAX tools are for the pack. Enter the password to continue."}
          </p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="pax-auth-password"
                className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wide text-ink-dim"
              >
                Password
              </label>
              <input
                id="pax-auth-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="•••••"
              />
            </div>
            {authError ? (
              <p className="text-sm text-f3-red" role="alert">
                {authError}
              </p>
            ) : null}
            <button type="submit" className="btn btn-primary w-full">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-ghost min-h-10 px-3 text-xs"
          onClick={handleLock}
        >
          Lock
        </button>
      </div>
      {children}
    </div>
  );
}
