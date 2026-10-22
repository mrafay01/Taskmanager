"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
};

type Profile = {
  login: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  url: string;
  location: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  repos: Repo[];
};

export default function GitHubSearch() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const res = await fetch(`/api/github/${encodeURIComponent(username.trim())}`);
      const data = await res.json();
      if (res.ok) setProfile(data);
      else setError(data.error);
    } catch {
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; Back to tasks
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">GitHub Profile Search</h1>
      <p className="mt-1 text-sm text-zinc-500">Look up any GitHub user and their latest repositories.</p>

      <form onSubmit={search} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a GitHub username"
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {profile && (
        <section className="mt-8">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-200 p-5 text-center sm:flex-row sm:text-left dark:border-zinc-800">
            <Image src={profile.avatar} alt={profile.login} width={80} height={80} className="rounded-full" />
            <div className="flex-1">
              <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">
                {profile.name || profile.login}
              </a>
              <p className="text-sm text-zinc-500">@{profile.login}{profile.location && ` · ${profile.location}`}</p>
              {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
              <div className="mt-3 flex justify-center gap-4 text-sm sm:justify-start">
                <span><strong>{profile.followers.toLocaleString()}</strong> followers</span>
                <span><strong>{profile.following.toLocaleString()}</strong> following</span>
                <span><strong>{profile.publicRepos.toLocaleString()}</strong> repos</span>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-lg font-semibold">Recently updated repositories</h2>
          {profile.repos.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No public repositories.</p>
          ) : (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {profile.repos.map((repo) => (
                <li key={repo.id} className="flex flex-col rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                    {repo.name}
                  </a>
                  <p className="mt-1 flex-1 text-sm text-zinc-500">{repo.description || "No description"}</p>
                  <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                    {repo.language && <span>{repo.language}</span>}
                    <span>★ {repo.stars.toLocaleString()}</span>
                    <span>Forks {repo.forks.toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
