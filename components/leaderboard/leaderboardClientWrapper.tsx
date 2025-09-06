"use client";

import { useState } from "react";
import { LeaderboardCard } from "./leaderboard-card";

interface Props {
  entries: any[];
  currentUserId: string;
}

export const LeaderboardClientWrapper = ({ entries, currentUserId }: Props) => {
  const [type, setType] = useState<"weekly" | "monthly" | "allTime">("weekly");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {(["weekly", "monthly", "allTime"] as const).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-medium ${
              type === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setType(tab)}
          >
            {tab === "weekly" ? "Weekly" : tab === "monthly" ? "Monthly" : "All-Time"}
          </button>
        ))}
      </div>

      <LeaderboardCard entries={entries} type={type} currentUserId={currentUserId} />
    </div>
  );
};
