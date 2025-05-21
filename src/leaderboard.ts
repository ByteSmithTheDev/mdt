import { LeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'mdt_leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  const leaderboardData = localStorage.getItem(LEADERBOARD_KEY);
  return leaderboardData ? JSON.parse(leaderboardData) : [];
}

export function updateLeaderboard(officerName: string): void {
  const leaderboard = getLeaderboard();
  const currentDate = new Date().toLocaleString();
  
  const existingEntry = leaderboard.find(entry => entry.officerName === officerName);
  
  if (existingEntry) {
    existingEntry.mdtCount += 1;
    existingEntry.lastEntry = currentDate;
  } else {
    leaderboard.push({
      officerName,
      mdtCount: 1,
      lastEntry: currentDate
    });
  }
  
  // Sort by MDT count (descending)
  leaderboard.sort((a, b) => b.mdtCount - a.mdtCount);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

export function getTopOfficers(limit: number = 10): LeaderboardEntry[] {
  const leaderboard = getLeaderboard();
  return leaderboard.slice(0, limit);
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY);
}