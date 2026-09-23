import React, { useState, useEffect } from 'react';
import { Layers, Eye, EyeOff, AlertTriangle, ShieldCheck, MapPin, Wind, Droplet, Mountain, Clock, ChevronRight, Activity, ArrowUpRight, TrendingUp, CheckCircle, AlertCircle, Database, GitCommit } from 'lucide-react';
import { CriticalAsset, RoadSegment, EvacuationShelter, SarPixelData, StormScenario, TemporalTimeStep, RegionalProfile } from '../types';
import { TEMPORAL_TIMELINE, DATA_QUALITY_FEEDS } from '../data/mockDisasterData';
import { INDIA_TEMPORAL_TIMELINE, INDIA_DATA_FEEDS } from '../data/indiaDisasterData';

interface GeospatialStudioProps {
  scenario: StormScenario;
  assets: CriticalAsset[];
  roads: RoadSegment[];
  shelters: EvacuationShelter[];
  sarHotspots: SarPixelData[];
  onSelectAssetForAudit: (asset: CriticalAsset) => void;
  regionalProfile?: RegionalProfile;
}

export const GeospatialStudio: React.FC<GeospatialStudioProps> = ({
  scenario,
  assets,
  roads,
  shelters,
  sarHotspots,
  onSelectAssetForAudit,
  regionalProfile = 'INDIA_NDMA'
}) => {
  const isIndia = regionalProfile === 'INDIA_NDMA';
  const activeTimeline = isIndia ? INDIA_TEMPORAL_TIMELINE : TEMPORAL_TIMELINE;
  const activeDataFeeds = isIndia ? INDIA_DATA_FEEDS : DATA_QUALITY_FEEDS;

  // Layer toggles
  const [showSurgeLayer, setShowSurgeLayer] = useState(true);
  const [showDemSlope, setShowDemSlope] = useState(true);
  const [showSarMoisture, setShowSarMoisture] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showShelters, setShowShelters] = useState(true);

  // Time scrubber (hours until landfall)
  const [timeOffsetHours, setTimeOffsetHours] = useState(scenario.landfallEtaHours);
  const [selectedTimeStepId, setSelectedTimeStepId] = useState<'T-24h' | 'T-12h' | 'T-6h' | 'NOW' | 'T+6h' | 'T+12h'>('NOW');
  const [showDataQualityDrawer, setShowDataQualityDrawer] = useState(false);

  // Selected asset
  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset | null>(assets[0] || null);

  useEffect(() => {
    if (assets.length > 0) {
      setSelectedAsset(assets[0]);
    }
  }, [assets]);

  // Current temporal step data
  const currentStepData = activeTimeline.find(t => t.stepId === selectedTimeStepId) || activeTimeline[3];
  const previousStepData = activeTimeline[Math.max(0, activeTimeline.findIndex(t => t.stepId === selectedTimeStepId) - 1)];

  // Surge level scales dynamically with time offset
  const dynamicSurgeLevel = Math.max(0.8, scenario.projectedSurgeMaxM * (1 - Math.abs(timeOffsetHours - 0.5) / 10));

  return (
    <div className="space-y-4">
      {/* Studio Banner & Time Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                {isIndia
                  ? 'Multi-Hazard Geospatial Studio • Odisha Coast & Mahanadi Delta (IMD / OSDMA)'
                  : 'Multi-Hazard Geospatial Studio • Maple County Corridor'}
              </h2>
              <span className="text-[11px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                {isIndia ? 'EPSG:3857 • ISRO Bhuvan / Cartosat-1 • GTS Datum' : 'EPSG:3857 • 10m Copernicus DEM'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time hydrodynamic SLOSH surge simulation + Sentinel-1 SAR soil saturation + critical infrastructure GIS overlay.
            </p>
          </div>

          {/* Quick Data Quality Pill */}
          <button
            onClick={() => setShowDataQualityDrawer(!showDataQualityDrawer)}
            className="flex items-center space-x-2 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Data Quality:</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              AMBER (1 Degraded Feed)
            </span>
            <ChevronRight className={`w-3 h-3 text-slate-400 transform transition-transform ${showDataQualityDrawer ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Temporal Sequence & What Changed Controller */}
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-3 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Temporal Engine ("What Changed?")</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                {currentStepData.label}
              </span>
            </div>
            <div className="text-right font-mono text-xs flex items-center space-x-3">
              <span className="text-slate-400 text-[11px]">Active Surge: <span className="text-red-400 font-bold">+{currentStepData.projectedSurgeM}m</span></span>
              <span className="text-slate-400 text-[11px]">Rainfall: <span className="text-blue-400 font-bold">{currentStepData.rainfallAccumulationMm}mm</span></span>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {TEMPORAL_TIMELINE.map((step) => {
              const isSelected = selectedTimeStepId === step.stepId;
              return (
                <button
                  key={step.stepId}
                  id={`step-${step.stepId}`}
                  onClick={() => {
                    setSelectedTimeStepId(step.stepId);
                    if (step.stepId === 'T-24h') setTimeOffsetHours(24);
                    else if (step.stepId === 'T-12h') setTimeOffsetHours(12);
                    else if (step.stepId === 'T-6h') setTimeOffsetHours(6);
                    else if (step.stepId === 'NOW') setTimeOffsetHours(scenario.landfallEtaHours);
                    else if (step.stepId === 'T+6h') setTimeOffsetHours(0);
                    else if (step.stepId === 'T+12h') setTimeOffsetHours(-6);
                  }}
                  className={`p-2 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-400">{step.stepId}</span>
                    <span className={`text-[9px] px-1 rounded uppercase font-semibold ${
                      step.isPastOrForecast === 'current'
                        ? 'bg-red-500/20 text-red-300'
                        : step.isPastOrForecast === 'forecast'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.isPastOrForecast}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">
                    Surge: +{step.projectedSurgeM}m
                  </div>
                </button>
              );
            })}
          </div>

          {/* Delta Diff Box: What changed since previous assessment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-slate-200">
                  What changed since {previousStepData.stepId !== currentStepData.stepId ? previousStepData.stepId : 'baseline'}?
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="text-slate-300">
                  Flood Exposure: <span className="text-amber-400 font-bold">{previousStepData.floodExposedAssetsCount} → {currentStepData.floodExposedAssetsCount} assets</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">
                  High-Risk Roads: <span className="text-purple-400 font-bold">{previousStepData.highRiskRoadsCount} → {currentStepData.highRiskRoadsCount}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">
                  Hospital: <span className="text-red-400 font-bold">{previousStepData.hospitalExposureGrade} → {currentStepData.hospitalExposureGrade}</span>
                </span>
              </div>
            </div>

            <p className="mt-2 text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-amber-300">Summary: </strong>{currentStepData.deltaSummary}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
              {currentStepData.keyDrivers.map((driver, idx) => (
                <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                  <span>{driver}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Data Quality & Provenance Drawer */}
        {showDataQualityDrawer && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Data Ingestion, Provenance & Quality Monitoring Engine
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Auto-evaluates data trust status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeDataFeeds.map((feed) => (
                <div key={feed.id} className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{feed.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      feed.status === 'GREEN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : feed.status === 'AMBER'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {feed.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>{feed.category}</span>
                    <span className="font-mono text-slate-300">{feed.freshnessLabel}</span>
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono pt-1 border-t border-slate-800/60">
                    Uncertainty: {feed.uncertaintyFactor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Studio View: Map + Controls & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Layer Controls Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Geospatial Layers</span>
              <span className="text-[10px] text-emerald-400 font-mono">6 Active</span>
            </h3>

            <div className="space-y-2">
              <button
                id="layer-toggle-surge"
                onClick={() => setShowSurgeLayer(!showSurgeLayer)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showSurgeLayer
                    ? 'bg-blue-950/40 border-blue-800/80 text-blue-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-blue-500 opacity-80"></div>
                  <span>Hydrodynamic Surge Extent</span>
                </div>
                {showSurgeLayer ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                id="layer-toggle-dem"
                onClick={() => setShowDemSlope(!showDemSlope)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showDemSlope
                    ? 'bg-orange-950/40 border-orange-800/80 text-orange-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Mountain className="w-3.5 h-3.5 text-orange-400" />
                  <span>DEM Slope & Steepness (&gt;25°)</span>
                </div>
                {showDemSlope ? <Eye className="w-3.5 h-3.5 text-orange-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                id="layer-toggle-sar"
                onClick={() => setShowSarMoisture(!showSarMoisture)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showSarMoisture
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SAR Soil Saturation & Creep</span>
                </div>
                {showSarMoisture ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                id="layer-toggle-assets"
                onClick={() => setShowAssets(!showAssets)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showAssets
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Critical Lifeline Assets</span>
                </div>
                {showAssets ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                id="layer-toggle-roads"
                onClick={() => setShowRoads(!showRoads)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showRoads
                    ? 'bg-purple-950/40 border-purple-800/80 text-purple-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-purple-400"></div>
                  <span>Evacuation Road Network</span>
                </div>
                {showRoads ? <Eye className="w-3.5 h-3.5 text-purple-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                id="layer-toggle-shelters"
                onClick={() => setShowShelters(!showShelters)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showShelters
                    ? 'bg-teal-950/40 border-teal-800/80 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Emergency Shelters</span>
                </div>
                {showShelters ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Scientific Pipeline Status */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>NWP Model:</span>
                <span className="text-slate-200 font-mono">{isIndia ? 'IMD NCMRWF NEPS 4km' : 'ECMWF IFS 0.1°'}</span>
              </div>
              <div className="flex justify-between">
                <span>DEM Source:</span>
                <span className="text-slate-200 font-mono">{isIndia ? 'ISRO Cartosat-1 10m' : 'Copernicus GLO-30'}</span>
              </div>
              <div className="flex justify-between">
                <span>Radar Pass:</span>
                <span className="text-slate-200 font-mono">{isIndia ? 'Sentinel-1 / NISAR Cal.' : 'Sentinel-1A Desc.'}</span>
              </div>
              <div className="flex justify-between">
                <span>Spatial Engine:</span>
                <span className="text-emerald-400 font-mono">{isIndia ? 'PostGIS / OSDMA GeoPortal' : 'PostGIS ST_Intersects'}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats on Infrastructure */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Exposure Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-red-950/60">
                <span className="text-[10px] text-slate-400 block">Submerged Assets</span>
                <span className="text-xl font-bold font-mono text-red-400">2</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-amber-950/60">
                <span className="text-[10px] text-slate-400 block">High Landslide Risk</span>
                <span className="text-xl font-bold font-mono text-amber-400">1</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-purple-950/60">
                <span className="text-[10px] text-slate-400 block">Severed Roads</span>
                <span className="text-xl font-bold font-mono text-purple-400">1</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-teal-950/60">
                <span className="text-[10px] text-slate-400 block">Safe Shelters</span>
                <span className="text-xl font-bold font-mono text-teal-400">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Map Canvas */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative min-h-[520px] flex flex-col">
          {/* Map Status Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="font-mono text-slate-300">
                {isIndia ? 'Live Spatial Composite • 20.31°N, 86.61°E (Bay of Bengal / Mahanadi Delta)' : 'Live Spatial Composite • 27.7°N, -81.5°W'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> {isIndia ? 'Bay of Bengal Surge' : 'Ocean Surge'}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-600 inline-block"></span> {isIndia ? 'Ghats Escarpment' : 'Steep Slopes'}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> {isIndia ? 'ISRO/InSAR Saturation' : 'SAR Saturation'}
              </span>
            </div>
          </div>

          {/* Interactive SVG Geospatial Stage */}
          <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-2 select-none">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full max-h-[580px]"
              style={{ background: 'radial-gradient(circle at 70% 30%, #091e3a 0%, #030712 85%)' }}
            >
              <defs>
                {/* Coastal gradient */}
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b2447" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#040d1a" stopOpacity="0.95" />
                </linearGradient>

                {/* Storm surge water gradient */}
                <linearGradient id="surgeWater" x1="0%" y1="0%" x2="100%" y2="80%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#0369a1" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
                </linearGradient>

                {/* Steep slope mountain pattern */}
                <linearGradient id="slopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.75" />
                </linearGradient>

                {/* SAR moisture pattern */}
                <radialGradient id="sarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Grid Reference Coordinate Lines */}
              <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3">
                <line x1="100" y1="0" x2="100" y2="600" />
                <line x1="250" y1="0" x2="250" y2="600" />
                <line x1="400" y1="0" x2="400" y2="600" />
                <line x1="550" y1="0" x2="550" y2="600" />
                <line x1="700" y1="0" x2="700" y2="600" />
                <line x1="0" y1="120" x2="800" y2="120" />
                <line x1="0" y1="240" x2="800" y2="240" />
                <line x1="0" y1="360" x2="800" y2="360" />
                <line x1="0" y1="480" x2="800" y2="480" />
              </g>

              {/* Coastline Base Landmass & Ocean Basin */}
              {isIndia ? (
                <>
                  {/* Odisha Coast Base Landmass */}
                  <path
                    d="M 0,0 L 520,0 C 510,130 480,240 500,350 C 520,440 570,520 620,600 L 0,600 Z"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  {/* Bay of Bengal Ocean Water */}
                  <path
                    d="M 520,0 L 800,0 L 800,600 L 620,600 C 570,520 520,440 500,350 C 480,240 510,130 520,0 Z"
                    fill="url(#oceanGrad)"
                  />
                  {/* Mahanadi River Trunk & Delta Channels */}
                  <path
                    d="M 0,230 C 130,220 200,245 320,270 C 400,290 460,310 505,325"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 220,245 C 270,285 360,370 480,440"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M 280,0 C 260,140 230,220 200,320 C 170,420 120,510 60,600 L 800,600 L 800,0 Z"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 0,0 L 280,0 C 260,140 230,220 200,320 C 170,420 120,510 60,600 L 0,600 Z"
                    fill="url(#oceanGrad)"
                  />
                </>
              )}

              {/* DEM Elevation Contours & Mountain Slopes Layer */}
              {showDemSlope && (
                <g id="dem-slope-layer">
                  {isIndia ? (
                    <>
                      <path
                        d="M 0,0 L 220,0 C 200,80 150,150 100,200 L 0,210 Z"
                        fill="url(#slopeGrad)"
                        stroke="#f97316"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                      />
                      <text x="30" y="70" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        Similipal & Eastern Ghats Ridge (Slope: 28°-36°)
                      </text>
                    </>
                  ) : (
                    <>
                      <path
                        d="M 520,30 C 580,70 680,120 760,80 L 790,260 C 720,290 640,240 560,180 Z"
                        fill="url(#slopeGrad)"
                        stroke="#f97316"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                      />
                      <text x="640" y="140" fill="#fdba74" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        Pine Ridge Escarpment (Slope: 31°-38°)
                      </text>
                      <path
                        d="M 380,180 C 430,220 480,260 520,380 C 460,420 400,360 360,260 Z"
                        fill="#431407"
                        fillOpacity="0.35"
                        stroke="#c2410c"
                        strokeWidth="0.8"
                      />
                    </>
                  )}
                </g>
              )}

              {/* Sentinel-1 SAR Soil Moisture & InSAR Creep Layer */}
              {showSarMoisture && (
                <g id="sar-moisture-layer">
                  {sarHotspots.map((spot) => {
                    const cx = isIndia
                      ? 220 + ((spot.coordinates[1] - 85.8) / 1.4) * 450
                      : 580 - (spot.coordinates[1] + 81.4) * 800;
                    const cy = isIndia
                      ? 450 - ((spot.coordinates[0] - 20.0) / 1.0) * 350
                      : 200 + (27.95 - spot.coordinates[0]) * 1500;
                    return (
                      <g key={spot.id} className="cursor-pointer">
                        <circle cx={cx} cy={cy} r="45" fill="url(#sarGlow)" />
                        <circle cx={cx} cy={cy} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx={cx} cy={cy} r="18" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="3 2" className="animate-spin" />
                        <text x={cx + 10} y={cy + 4} fill="#6ee7b7" fontSize="10" fontFamily="monospace">
                          SAR Sat: {(spot.sarRelativeSaturation * 100).toFixed(0)}% • Creep: {spot.insarDisplacementRateMmYr}mm/yr
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Hydrodynamic Storm Surge Inundation Polygon Layer */}
              {showSurgeLayer && (
                <g id="hydrodynamic-surge-layer">
                  {isIndia ? (
                    <>
                      <path
                        d={`M 800,0 L 800,600 L ${620 - dynamicSurgeLevel * 16},600 C ${570 - dynamicSurgeLevel * 20},520 ${500 - dynamicSurgeLevel * 24},440 ${480 - dynamicSurgeLevel * 26},350 C ${460 - dynamicSurgeLevel * 20},240 ${500 - dynamicSurgeLevel * 14},130 ${520 - dynamicSurgeLevel * 12},0 Z`}
                        fill="url(#surgeWater)"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <path
                        d="M 750,50 C 510,180 470,330 520,550"
                        fill="none"
                        stroke="#7dd3fc"
                        strokeWidth="1"
                        strokeDasharray="5 3"
                      />
                      <text x="460" y="420" fill="#bae6fd" fontSize="12" fontWeight="bold" fontFamily="monospace">
                        Surge Crest: +{dynamicSurgeLevel.toFixed(1)}m GTS MSL
                      </text>
                    </>
                  ) : (
                    <>
                      <path
                        d={`M 0,0 L 280,0 C ${310 + dynamicSurgeLevel * 14},140 ${300 + dynamicSurgeLevel * 18},260 ${270 + dynamicSurgeLevel * 20},360 C ${230 + dynamicSurgeLevel * 22},460 ${160 + dynamicSurgeLevel * 18},540 60,600 L 0,600 Z`}
                        fill="url(#surgeWater)"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                      <path
                        d="M 20,20 C 220,120 260,250 210,480"
                        fill="none"
                        stroke="#7dd3fc"
                        strokeWidth="1"
                        strokeDasharray="5 3"
                      />
                      <text x="180" y="380" fill="#bae6fd" fontSize="12" fontWeight="bold" fontFamily="monospace">
                        Surge Crest Zone: +{dynamicSurgeLevel.toFixed(1)}m MSL
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* Evacuation Road Arterials */}
              {showRoads && (
                <g id="road-network-layer">
                  {isIndia ? (
                    <>
                      {/* NH-16 Golden Quadrilateral (Inland corridor - Safe) */}
                      <path
                        d="M 50,570 Q 150,300 240,30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="8 3"
                      />
                      {/* SH-12 Cuttack-Paradip Expressway */}
                      <path
                        d="M 180,250 C 290,280 400,305 505,325"
                        fill="none"
                        stroke={dynamicSurgeLevel > 2.0 ? '#ef4444' : '#a855f7'}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {dynamicSurgeLevel > 2.0 && (
                        <g transform="translate(420, 310)">
                          <circle r="12" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ffffff" strokeWidth="2" />
                          <line x1="5" y1="-5" x2="-5" y2="5" stroke="#ffffff" strokeWidth="2" />
                        </g>
                      )}
                      {/* Erasama Coastal Embankment Road */}
                      <path
                        d="M 505,325 Q 490,430 550,550"
                        fill="none"
                        stroke={dynamicSurgeLevel > 1.5 ? '#ef4444' : '#eab308'}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    <>
                      {/* Route 101 South Causeway (Coastal - Submerged) */}
                      <path
                        d="M 170,540 Q 230,420 260,330"
                        fill="none"
                        stroke={dynamicSurgeLevel > 2.0 ? '#ef4444' : '#a855f7'}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {dynamicSurgeLevel > 2.0 && (
                        <g transform="translate(210, 430)">
                          <circle r="12" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ffffff" strokeWidth="2" />
                          <line x1="5" y1="-5" x2="-5" y2="5" stroke="#ffffff" strokeWidth="2" />
                        </g>
                      )}
                      {/* Highway 44 Highland Bypass (Safe Route) */}
                      <path
                        d="M 260,330 C 350,290 420,220 540,160"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="8 3"
                      />
                      {/* Pine Valley Mountain Road */}
                      <path
                        d="M 420,220 Q 510,180 620,120"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                </g>
              )}

              {/* Critical Infrastructure Asset Pins */}
              {showAssets && (
                <g id="assets-layer">
                  {assets.map((asset) => {
                    const isSubstation = asset.type === 'substation';
                    const isHospital = asset.type === 'hospital';
                    const isBridge = asset.type === 'bridge';
                    const isWater = asset.type === 'water_plant';

                    let px = 300;
                    let py = 300;
                    if (isIndia) {
                      if (asset.id.includes('paradip_substation')) { px = 505; py = 325; }
                      else if (asset.id.includes('scb_medical')) { px = 180; py = 250; }
                      else if (asset.id.includes('jobra_barrage')) { px = 215; py = 235; }
                      else if (asset.id.includes('kendrapara')) { px = 380; py = 175; }
                      else if (asset.id.includes('dhamra')) { px = 600; py = 120; }
                      else if (asset.id.includes('bsnl') || asset.id.includes('cell')) { px = 330; py = 340; }
                      else { px = 400; py = 300; }
                    } else {
                      if (isSubstation) { px = 270; py = 340; }
                      else if (isHospital) { px = 380; py = 290; }
                      else if (isBridge) { px = 550; py = 170; }
                      else if (isWater) { px = 220; py = 470; }
                      else { px = 640; py = 90; }
                    }

                    const isSelected = selectedAsset?.id === asset.id;
                    const isSubmerged = dynamicSurgeLevel > asset.finishedFloorElevation;

                    return (
                      <g
                        key={asset.id}
                        transform={`translate(${px}, ${py})`}
                        onClick={() => setSelectedAsset(asset)}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        {/* Selection halo */}
                        {isSelected && (
                          <circle r="22" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                        )}

                        {/* Status outer circle */}
                        <circle
                          r="14"
                          fill={isSubmerged ? '#7f1d1d' : asset.status === 'critical_failure' ? '#78350f' : '#0f172a'}
                          stroke={isSubmerged ? '#ef4444' : asset.status === 'critical_failure' ? '#f59e0b' : '#38bdf8'}
                          strokeWidth="2.5"
                        />

                        {/* Center glyph */}
                        <text
                          y="4"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {isSubstation ? '⚡' : isHospital ? '🏥' : isBridge ? '🌉' : isWater ? '💧' : '📡'}
                        </text>

                        {/* Label */}
                        <text
                          x="18"
                          y="4"
                          fill={isSelected ? '#f59e0b' : '#e2e8f0'}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                          className="drop-shadow"
                        >
                          {asset.name.split(' ')[0]} {asset.name.split(' ')[1] || ''}
                        </text>

                        {isSubmerged && (
                          <rect
                            x="18"
                            y="7"
                            width="64"
                            height="13"
                            rx="2"
                            fill="#ef4444"
                          />
                        )}
                        {isSubmerged && (
                          <text x="21" y="17" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace">
                            FLOODED -{(dynamicSurgeLevel - asset.finishedFloorElevation).toFixed(1)}m
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Evacuation Shelters */}
              {showShelters && (
                <g id="shelters-layer">
                  {shelters.map((sh, idx) => {
                    const sx = isIndia
                      ? (idx === 0 ? 470 : idx === 1 ? 525 : 360)
                      : (idx === 0 ? 460 : idx === 1 ? 390 : 210);
                    const sy = isIndia
                      ? (idx === 0 ? 385 : idx === 1 ? 310 : 185)
                      : (idx === 0 ? 250 : idx === 1 ? 270 : 490);
                    return (
                      <g key={sh.id} transform={`translate(${sx}, ${sy})`}>
                        <polygon
                          points="0,-12 11,8 -11,8"
                          fill={sh.status === 'compromised' ? '#ef4444' : '#0d9488'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text x="14" y="6" fill="#5eead4" fontSize="9" fontWeight="bold" fontFamily="monospace">
                          {sh.name.split(' ')[0]} ({sh.capacity} cap)
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Cyclone Eye / Wind Vector Overlay */}
              <g
                transform={isIndia ? "translate(680, 200)" : "translate(100, 150)"}
                className="animate-spin"
                style={{ transformOrigin: isIndia ? '680px 200px' : '100px 150px', animationDuration: '24s' }}
              >
                <circle r="40" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                <circle r="70" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="10 5" opacity="0.4" />
                <line x1="-30" y1="0" x2="30" y2="0" stroke="#ef4444" strokeWidth="2" />
                <line x1="0" y1="-30" x2="0" y2="30" stroke="#ef4444" strokeWidth="2" />
              </g>
              <text
                x={isIndia ? "600" : "110"}
                y={isIndia ? "275" : "210"}
                fill="#f87171"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {scenario.name} Eye • {scenario.maxWindsKmh} km/h
              </text>
            </svg>
          </div>
        </div>

        {/* Selected Asset & Vulnerability Inspector */}
        <div className="lg:col-span-3 space-y-4">
          {selectedAsset ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                    {selectedAsset.criticalityTier}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
                    {selectedAsset.name}
                  </h3>
                </div>
                <div className={`p-1.5 rounded-lg ${
                  dynamicSurgeLevel > selectedAsset.finishedFloorElevation
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : 'bg-slate-800 text-emerald-400'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              {/* Elevation & Hydrology Metrics */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ground Elevation:</span>
                  <span className="text-white font-bold">{selectedAsset.elevationMsl}m {isIndia ? 'GTS MSL' : 'MSL'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Finished Floor (FFE):</span>
                  <span className="text-amber-400 font-bold">{selectedAsset.finishedFloorElevation}m {isIndia ? 'GTS MSL' : 'MSL'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Projected Surge Level:</span>
                  <span className="text-red-400 font-bold">+{dynamicSurgeLevel.toFixed(1)}m {isIndia ? 'GTS MSL' : 'MSL'}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 font-sans font-semibold">Net Inundation:</span>
                  <span className={`text-sm font-bold ${
                    dynamicSurgeLevel > selectedAsset.finishedFloorElevation
                      ? 'text-red-500 animate-pulse'
                      : 'text-emerald-400'
                  }`}>
                    {dynamicSurgeLevel > selectedAsset.finishedFloorElevation
                      ? `+${(dynamicSurgeLevel - selectedAsset.finishedFloorElevation).toFixed(2)}m (SUBMERGED)`
                      : `-${(selectedAsset.finishedFloorElevation - dynamicSurgeLevel).toFixed(2)}m (SAFE FREEBOARD)`}
                  </span>
                </div>
              </div>

              {/* Geotechnical Terrain & SAR Data */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Terrain & Sentinel-1 Data</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slope Angle:</span>
                  <span className="text-slate-200 font-mono">{selectedAsset.slopeDegrees}° ({Number(selectedAsset.slopeDegrees) > 20 ? 'High Risk' : 'Low'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SAR Soil Saturation:</span>
                  <span className="text-emerald-400 font-mono">{((selectedAsset.sarSoilSaturation || 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Replacement:</span>
                  <span className="text-slate-200 font-mono">{isIndia ? `₹${selectedAsset.structuralValueMillions} Cr` : `$${selectedAsset.structuralValueMillions}M`}</span>
                </div>
              </div>

              {/* Blueprint & Circuit Dependency */}
              <div className="text-xs space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Lifeline Cascading Risk</span>
                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800/80">
                  {selectedAsset.powerDependency}
                </p>
              </div>

              {/* Send to AI Auditor CTA */}
              <button
                id="btn-audit-selected-asset"
                onClick={() => onSelectAssetForAudit(selectedAsset)}
                className="w-full mt-2 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Run AI Engineering Vulnerability Audit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Click any infrastructure node on the map to inspect its real-time inundation and geotechnical risk.
            </div>
          )}

          {/* Real-time Road Cutoff Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Arterial Evacuation Routes</span>
              <span className="text-[10px] text-red-400 font-mono">1 Severed</span>
            </h3>

            <div className="space-y-2">
              {roads.map((road) => (
                <div key={road.id} className="p-2 bg-slate-950 rounded border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-200 text-[11px]">{road.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Min Elev: {road.elevationMin}m • Cutoff: {road.cutoffTimeEtaHours < 5 ? `T-${road.cutoffTimeEtaHours}h` : 'Passable'}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    road.status === 'severed' ? 'bg-red-950 text-red-400 border border-red-800' :
                    road.status === 'contingency_only' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {road.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
