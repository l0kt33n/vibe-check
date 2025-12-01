import { GitHubRepo, RepoContext, CommitInfo } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export const parseRepoUrl = (url: string): GitHubRepo | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

export const fetchRepoContext = async (
  { owner, repo }: GitHubRepo,
  token?: string
): Promise<RepoContext> => {
  const headers = getHeaders(token);
  
  // 1. Fetch Metadata
  const metaRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
  if (!metaRes.ok) {
    if (metaRes.status === 403) throw new Error("GitHub API rate limit exceeded. Please provide a token.");
    if (metaRes.status === 404) throw new Error("Repository not found. Check the URL or visibility.");
    throw new Error(`GitHub Error: ${metaRes.statusText}`);
  }
  const metadata = await metaRes.json();

  // 2. Fetch Recent Commits (Last 15)
  const commitsRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=15`, { headers });
  const commitsData = commitsRes.ok ? await commitsRes.json() : [];
  const recentCommits: CommitInfo[] = Array.isArray(commitsData) ? commitsData.map((c: any) => ({
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date
  })) : [];

  // 3. Fetch Root File Structure
  const contentsRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`, { headers });
  const contentsData = contentsRes.ok ? await contentsRes.json() : [];
  const fileStructure = Array.isArray(contentsData) ? contentsData.map((f: any) => f.name) : [];

  // 4. Check for Specific Config Files (Cursor, Windsurf, etc.)
  const configFilesToLookFor = ['.cursorrules', '.windsurfrules', '.c3', 'copilot-instructions.md'];
  const configFileContents: Record<string, string> = {};

  for (const file of configFilesToLookFor) {
    if (fileStructure.includes(file)) {
      try {
        const fileRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${file}`, { headers });
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          // content is base64 encoded
          if (fileData.content) {
            configFileContents[file] = atob(fileData.content.replace(/\n/g, ''));
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch content for ${file}`, e);
      }
    }
  }

  // 5. Fetch README
  let readmeContent = null;
  try {
    const readmeRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        readmeContent = atob(readmeData.content.replace(/\n/g, ''));
        // Truncate readme to avoid hitting token limits in Gemini if it's massive
        if (readmeContent.length > 8000) {
          readmeContent = readmeContent.substring(0, 8000) + "...(truncated)";
        }
      }
    }
  } catch (e) {
    console.warn("Failed to fetch README", e);
  }

  return {
    metadata,
    fileStructure,
    recentCommits,
    readmeContent,
    configFileContents
  };
};