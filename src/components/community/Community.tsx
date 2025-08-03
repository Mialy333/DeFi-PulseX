import React from 'react';
import LeaderboardCard from './LeaderboardCard';
import CommunityPosts from './CommunityPosts';

const Community: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Leaderboard Section */}
      <div className="col-span-12 lg:col-span-4">
        <LeaderboardCard />
      </div>

      {/* Posts Section */}
      <div className="col-span-12 lg:col-span-8">
        <CommunityPosts />
      </div>
    </div>
  );
};

export default Community;
