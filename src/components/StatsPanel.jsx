import React from 'react';

const StatsPanel = ({ earthquakes }) => {
  const stats = React.useMemo(() => {
    if (!earthquakes.length) {
      return {
        total: 0,
        maxMagnitude: 0,
        averageDepth: 0,
        significant: 0,
        recent: 0
      };
    }

    const magnitudes = earthquakes.map(eq => eq.properties.mag);
    const depths = earthquakes.map(eq => eq.geometry.coordinates[2]);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return {
      total: earthquakes.length,
      maxMagnitude: Math.max(...magnitudes),
      averageDepth: depths.reduce((a, b) => a + b, 0) / depths.length,
      significant: earthquakes.filter(eq => eq.properties.mag >= 4.5).length,
      recent: earthquakes.filter(eq => new Date(eq.properties.time) >= oneHourAgo).length
    };
  }, [earthquakes]);

  const StatCard = ({ title, value, subtitle, color = 'blue' }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200 rounded-lg p-4`}>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  if (earthquakes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earthquake Statistics</h3>
        <div className="text-center text-gray-500 py-4">
          No earthquakes match current filters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Earthquake Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Earthquakes"
          value={stats.total}
          subtitle="Last 24 hours"
          color="blue"
        />
        
        <StatCard
          title="Max Magnitude"
          value={stats.maxMagnitude.toFixed(1)}
          subtitle="Highest recorded"
          color="red"
        />
        
        <StatCard
          title="Avg Depth"
          value={stats.averageDepth.toFixed(1)}
          subtitle="Kilometers"
          color="green"
        />
        
        <StatCard
          title="Significant"
          value={stats.significant}
          subtitle="M4.5+"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Last hour:</span>
          <span className="font-semibold text-blue-600">{stats.recent} events</span>
        </div>
        
        {/* Activity Level Indicator */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Activity Level</span>
            <span>
              {stats.recent >= 10 ? 'High' : stats.recent >= 5 ? 'Moderate' : 'Low'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                stats.recent >= 10 ? 'bg-red-500' : 
                stats.recent >= 5 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (stats.recent / 15) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;