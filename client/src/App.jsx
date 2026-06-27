import React, { useState } from 'react'; 
import TriageDesk from './components/TriageDesk';
import EmergencyDesk from './components/EmergencyDesk';
import CommunityFeed from './components/CommunityFeed';
import AnalyticsCards from './components/AnalyticsCards';
import ReportScamForm from './components/ReportScamForm';

function App() {
  const [refreshFeed, setRefreshFeed] = useState(false);

  const triggerFeedRefresh = () => {
    setRefreshFeed(prev => !prev);
  };

  return (
    <div className="bg-[#070a12] pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        <AnalyticsCards refreshTrigger={refreshFeed} />
        <TriageDesk onScamDetected={triggerFeedRefresh} />
        <CommunityFeed refreshTrigger={refreshFeed} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EmergencyDesk />
          </div>
          <div className="lg:col-span-1">
            <ReportScamForm onScamReported={triggerFeedRefresh} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;