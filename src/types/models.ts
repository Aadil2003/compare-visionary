
export interface Project {
  id: string;
  name: string;
  description: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  testCount: number;
  snapshots: number;
}

export interface Test {
  id: string;
  projectId: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  createdAt: string;
  updatedAt: string;
  browser: string;
  viewport: string;
  snapshotCount: number;
}

export interface Snapshot {
  id: string;
  testId: string;
  projectId: string;
  name: string;
  status: 'approved' | 'rejected' | 'pending' | 'new' | 'failed';
  baselineUrl: string | null;
  currentUrl: string;
  diffUrl: string | null;
  diffPercentage: number | null;
  createdAt: string;
  updatedAt: string;
  browser: string;
  viewport: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
