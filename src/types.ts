export interface Player {
  id: string;
  name: string;
  score: number;
  role: string;
  project: string;
  efficiency: number;
  status: 'online' | 'idle' | 'offline';
  playtimeHistory: number[]; // play durations in different sessions
  violationsRate: number; // percent of incorrect procedures (e.g. Phase 3 & 4 violations)
}

export interface Campaign {
  id: string;
  name: string;
  phase: string;
  description: string;
  teamIds: string[];
  deadline: string;
  progress: number;
  category: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface SystemMetrics {
  serverLoad: number;
  memoryUsage: number;
  networkInGbps: number;
}
