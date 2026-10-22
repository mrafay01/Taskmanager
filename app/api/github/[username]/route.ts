const GITHUB_API = "https://api.github.com";

function github(path: string) {
  return fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
    },
  });
}

export async function GET(_req: Request, ctx: RouteContext<"/api/github/[username]">) {
  const { username } = await ctx.params;

  const [userRes, reposRes] = await Promise.all([
    github(`/users/${encodeURIComponent(username)}`),
    github(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`),
  ]);

  if (userRes.status === 404) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  if (!userRes.ok || !reposRes.ok) {
    const limited = userRes.status === 403 || userRes.status === 429;
    return Response.json(
      { error: limited ? "GitHub rate limit reached, try again later" : "Failed to fetch from GitHub" },
      { status: limited ? 429 : 502 }
    );
  }

  const user = await userRes.json();
  const repos = await reposRes.json();

  return Response.json({
    login: user.login,
    name: user.name,
    avatar: user.avatar_url,
    bio: user.bio,
    url: user.html_url,
    location: user.location,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    repos: repos.map((repo: Record<string, unknown>) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    })),
  });
}
