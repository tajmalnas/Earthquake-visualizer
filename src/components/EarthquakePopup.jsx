import React from 'react';

const EarthquakePopup = ({ earthquake }) => {
  const { properties, geometry } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  const getMagnitudeColor = (mag) => {
    if (mag >= 5) return 'text-red-600';
    if (mag >= 3) return 'text-orange-600';
    return 'text-green-600';
  };

  const getSignificanceLevel = (sig) => {
    if (sig >= 600) return 'High';
    if (sig >= 300) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="p-2 min-w-[250px]">
      <div className="border-b border-gray-200 pb-2 mb-3">
        <h3 className="font-bold text-lg text-gray-900 truncate">
          {properties.place}
        </h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Magnitude:</span>
          <span className={`font-bold text-lg ${getMagnitudeColor(properties.mag)}`}>
            M{properties.mag}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Depth:</span>
          <span className="font-medium">{depth.toFixed(1)} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium text-right">
            {new Date(properties.time).toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Significance:</span>
          <span className="font-medium">{getSignificanceLevel(properties.sig)}</span>
        </div>
        
        {properties.tsunami > 0 && (
          <div className="bg-red-100 border border-red-300 rounded px-2 py-1 text-center">
            <span className="text-red-700 font-semibold">🌊 Tsunami Alert</span>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Lat: {latitude.toFixed(3)}°</div>
            <div>Lng: {longitude.toFixed(3)}°</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakePopup;