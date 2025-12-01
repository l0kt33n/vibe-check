export interface GitHubRepo {
  owner: string;
  repo: string;
}

export interface CommitInfo {
  message: string;
  author: string;
  date: string;
}

export interface RepoContext {
  metadata: any;
  fileStructure: string[];
  recentCommits: CommitInfo[];
  readmeContent: string | null;
  configFileContents: Record<string, string>; // e.g., content of .cursorrules if found
}

export interface VibeAnalysisResult {
  score: number; // 0 to 100
  verdict: string; // e.g., "Certified Vibe Coded", "Human Crafted"
  reasoning: string;
  evidence: string[]; // List of specific findings
  aiToolsDetected: string[]; // e.g., ["Cursor", "Copilot"]
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  FETCHING_GITHUB = 'FETCHING_GITHUB',
  ANALYZING_GEMINI = 'ANALYZING_GEMINI',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
