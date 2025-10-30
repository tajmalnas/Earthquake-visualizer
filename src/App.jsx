import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import FilterBar from './components/FilterBar';
import StatsPanel from './components/StatsPanel';
import GeminiInsights from './components/GeminiInsights';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch earthquake data
  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        
        if (!response.ok) {
          throw new Error('Failed to fetch earthquake data');
        }
        
        const data = await response.json();
        setEarthquakes(data.features);
        setFilteredEarthquakes(data.features);
        toast.success(`Loaded ${data.features.length} earthquakes`);
      } catch (err) {
        setError(err.message);
        toast.error('Error loading earthquake data');
        console.error('Error fetching earthquakes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchEarthquakes, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleFilter = (filters) => {
    let filtered = earthquakes;

    // Filter by magnitude
    if (filters.minMagnitude > 0) {
      filtered = filtered.filter(eq => 
        eq.properties.mag >= filters.minMagnitude
      );
    }

    // Filter by time
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
      };

      const timeAgo = new Date(now.getTime() - timeRanges[filters.timeRange]);
      filtered = filtered.filter(eq => 
        new Date(eq.properties.time) >= timeAgo
      );
    }

    setFilteredEarthquakes(filtered);
  };

  if (loading && earthquakes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading earthquake data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                🌍 Earthquake Visualizer
              </h1>
              <p className="text-gray-600 text-sm">
                Real-time seismic activity monitoring with AI insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm">
                <span>🤖</span>
                <span>Gemini AI Powered</span>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Data from USGS
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Sidebar - Stats, Filters, and AI Insights */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <StatsPanel earthquakes={filteredEarthquakes} />
              <FilterBar onFilter={handleFilter} />
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-96 sm:h-[500px] lg:h-[600px]">
                {error ? (
                  <div className="h-full flex items-center justify-center text-red-600">
                    <div className="text-center">
                      <p className="text-lg font-semibold">Error loading map</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                ) : (
                  <MapView earthquakes={filteredEarthquakes} />
                )}
              </div>
            </div>
            <div className='py-4'>
              <GeminiInsights earthquakes={filteredEarthquakes} />
            </div>
          </div>
        </div>



        {/* Earthquake List for Mobile */}
        <div className="lg:hidden mt-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Recent Earthquakes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEarthquakes.slice(0, 10).map((earthquake) => (
                <div key={earthquake.id} className="border-l-4 border-blue-500 pl-3 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{earthquake.properties.place}</p>
                      <p className="text-sm text-gray-600">
                        Magnitude: <span className="font-semibold">{earthquake.properties.mag}</span>
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      earthquake.properties.mag >= 5 ? 'bg-red-100 text-red-800' :
                      earthquake.properties.mag >= 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      M{earthquake.properties.mag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(earthquake.properties.time).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;