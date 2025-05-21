import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  if (!entries.length) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">No MDT entries yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="text-xl font-semibold dark:text-white">Top MDT Officers</h2>
      </div>
      
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div 
            key={entry.officerName}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <span className={`
                w-6 h-6 flex items-center justify-center rounded-full font-semibold
                ${index === 0 ? 'bg-yellow-500 text-white' : 
                  index === 1 ? 'bg-gray-300 text-gray-800' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}
              `}>
                {index + 1}
              </span>
              <span className="font-medium dark:text-white">{entry.officerName}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold dark:text-white">{entry.mdtCount} MDTs</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Last: {entry.lastEntry}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}