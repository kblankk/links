import { useEffect, useState } from "react";

export type GitHubStats = { repos: number; followers: number };

const TTL = 60 * 60 * 1000;

function readCache(key: string): GitHubStats | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, stats } = JSON.parse(raw) as { at: number; stats: GitHubStats };
    return Date.now() - at < TTL ? stats : null;
  } catch {
    return null;
  }
}

/** Public profile counters from the GitHub REST API (unauthenticated, cached per session). */
export function useGitHubStats(username: string) {
  const key = `gh-stats:${username}`;
  const [stats, setStats] = useState<GitHubStats | null>(() => readCache(key));

  useEffect(() => {
    if (readCache(key)) return;
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${username}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { public_repos: number; followers: number }) => {
        const next = { repos: data.public_repos, followers: data.followers };
        setStats(next);
        try {
          sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), stats: next }));
        } catch {
          /* storage full / disabled */
        }
      })
      .catch(() => {
        /* rate-limited or offline: the card falls back to the handle only */
      });
    return () => ctrl.abort();
  }, [key, username]);

  return stats;
}
