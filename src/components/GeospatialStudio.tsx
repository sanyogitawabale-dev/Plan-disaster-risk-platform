import React, { useState, useEffect } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Wind,
  Droplet,
  Mountain,
  Clock,
  ChevronRight,
  Activity,
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Database,
  GitCommit,
  Waves,
  ExternalLink,
  Search,
  Compass,
  Crosshair,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  HelpCircle,
  Info
} from 'lucide-react';
import {
  CriticalAsset,
  RoadSegment,
  EvacuationShelter,
  SarPixelData,
  StormScenario,
  TemporalTimeStep,
  RegionalProfile,
  GoogleFloodGaugeRecord
} from '../types';
import { TEMPORAL_TIMELINE, DATA_QUALITY_FEEDS } from '../data/mockDisasterData';
import { INDIA_TEMPORAL_TIMELINE, INDIA_DATA_FEEDS, INDIA_CWC_GAUGES } from '../data/indiaDisasterData';
import { SpatialAreaSelection } from '../types/areaIntelligence';
import { analyzeSpatialContext, resolveGeographicLocation } from '../services/areaIntelligenceEngine';
import { AreaIntelligencePanel } from './geospatial/AreaIntelligencePanel';

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
  const [showRiverGauges, setShowRiverGauges] = useState(true);

  // Time scrubber (hours until landfall)
  const [timeOffsetHours, setTimeOffsetHours] = useState(scenario.landfallEtaHours);
  const [selectedTimeStepId, setSelectedTimeStepId] = useState<'T-24h' | 'T-12h' | 'T-6h' | 'NOW' | 'T+6h' | 'T+12h'>('NOW');
  const [showDataQualityDrawer, setShowDataQualityDrawer] = useState(false);

  // Selected asset or CWC river gauge
  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset | null>(assets[0] || null);
  const [selectedGauge, setSelectedGauge] = useState<GoogleFloodGaugeRecord | null>(null);
  const [cwcGauges, setCwcGauges] = useState<GoogleFloodGaugeRecord[]>(INDIA_CWC_GAUGES);

  // =========================================================================
  // AREA INTELLIGENCE & SPATIAL SITUATION INSPECTOR STATE
  // =========================================================================
  const [isObserveAreaMode, setIsObserveAreaMode] = useState<boolean>(true);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(10);
  const [selectedArea, setSelectedArea] = useState<SpatialAreaSelection | null>(() => {
    return {
      type: 'click',
      coords: isIndia
        ? { lat: 20.490, lng: 85.892, svgX: 240, svgY: 245 }
        : { lat: 27.77, lng: -81.55, svgX: 380, svgY: 290 },
      radiusKm: 10,
      locationName: isIndia ? 'Jobra Barrage & Cuttack Delta' : 'Maple General Hospital Complex',
      districtState: isIndia ? 'Cuttack, Odisha' : 'Central District, Maple County'
    };
  });

  // Right Panel Tab: 'area_intelligence' or 'asset_inspector'
  const [inspectorTab, setInspectorTab] = useState<'area_intelligence' | 'asset_inspector'>('area_intelligence');

  // Location search state
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // Feature highlighting trigger from "Show on Map"
  const [highlightedFeature, setHighlightedFeature] = useState<{
    type: string;
    coords?: { x: number; y: number };
    name?: string;
    timestamp: number;
  } | null>(null);

  // Spatial Story Mode active step index
  const [activeStoryStepIndex, setActiveStoryStepIndex] = useState<number | null>(null);

  useEffect(() => {
    if (assets.length > 0) {
      setSelectedAsset(assets[0]);
    }
  }, [assets]);

  // Fetch live CWC gauges from Google Flood Forecasting API endpoint
  useEffect(() => {
    fetch('/api/telemetry/gauges')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.gauges && d.gauges.length > 0) {
          setCwcGauges(d.gauges);
        }
      })
      .catch(e => console.warn('Could not fetch /api/telemetry/gauges, using static dataset:', e));
  }, []);

  // Current temporal step data
  const currentStepData = activeTimeline.find(t => t.stepId === selectedTimeStepId) || activeTimeline[3];
  const previousStepData = activeTimeline[Math.max(0, activeTimeline.findIndex(t => t.stepId === selectedTimeStepId) - 1)];

  // Surge level scales dynamically with time offset
  const dynamicSurgeLevel = Math.max(0.8, scenario.projectedSurgeMaxM * (1 - Math.abs(timeOffsetHours - 0.5) / 10));

  // Compute live Area Intelligence Analysis
  const areaAnalysis = selectedArea
    ? analyzeSpatialContext(
        selectedArea,
        selectedTimeStepId,
        scenario,
        assets,
        roads,
        shelters,
        sarHotspots,
        cwcGauges,
        regionalProfile
      )
    : null;

  // Handle map click anywhere on SVG stage to select and observe area
  const handleSvgMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const svgX = Math.round((clickX / rect.width) * 800);
    const svgY = Math.round((clickY / rect.height) * 600);

    const clampedX = Math.max(20, Math.min(780, svgX));
    const clampedY = Math.max(20, Math.min(580, svgY));

    const geo = resolveGeographicLocation(clampedX, clampedY, isIndia);

    setSelectedArea({
      type: 'click',
      coords: {
        lat: geo.lat,
        lng: geo.lng,
        svgX: clampedX,
        svgY: clampedY
      },
      radiusKm: selectedRadiusKm,
      locationName: geo.locationName,
      districtState: geo.districtState
    });

    setInspectorTab('area_intelligence');
  };

  // Handle "Show on Map" highlight request
  const handleHighlightFeature = (featureType: string, details?: any) => {
    let targetCoords = { x: 240, y: 245 };
    if (featureType === 'river') {
      targetCoords = { x: 240, y: 245 };
    } else if (featureType === 'surge') {
      targetCoords = { x: 550, y: 340 };
    } else if (featureType === 'wind' || featureType === 'storm') {
      targetCoords = isIndia ? { x: 680, y: 200 } : { x: 100, y: 150 };
    } else if (featureType === 'slope') {
      targetCoords = { x: 100, y: 80 };
    } else if (featureType === 'asset' && details) {
      if (details.id?.includes('paradip_substation')) targetCoords = { x: 505, y: 325 };
      else if (details.id?.includes('scb_medical')) targetCoords = { x: 180, y: 250 };
      else if (details.id?.includes('jobra_barrage')) targetCoords = { x: 215, y: 235 };
      else if (details.id?.includes('kendrapara')) targetCoords = { x: 380, y: 175 };
      else if (details.id?.includes('dhamra')) targetCoords = { x: 600, y: 120 };
    } else if (details && details.x && details.y) {
      targetCoords = { x: details.x, y: details.y };
    }

    setHighlightedFeature({
      type: featureType,
      coords: targetCoords,
      name: details?.name || featureType,
      timestamp: Date.now()
    });

    setTimeout(() => {
      setHighlightedFeature((curr) => (curr && Date.now() - curr.timestamp >= 5900 ? null : curr));
    }, 6000);
  };

  // Predefined location anchors for quick search
  const searchAnchors = isIndia
    ? [
        { name: 'Jobra Barrage & Cuttack Delta', district: 'Cuttack, Odisha', x: 240, y: 245, lat: 20.490, lng: 85.892 },
        { name: 'Naraj Delta Head', district: 'Cuttack, Odisha', x: 200, y: 230, lat: 20.468, lng: 85.802 },
        { name: 'SCB Medical College & AIIMS', district: 'Cuttack, Odisha', x: 180, y: 250, lat: 20.468, lng: 85.882 },
        { name: 'OPTCL 220kV Paradip Grid', district: 'Jagatsinghpur, Odisha', x: 505, y: 325, lat: 20.312, lng: 86.608 },
        { name: 'Paradip Port & Estuary', district: 'Jagatsinghpur, Odisha', x: 560, y: 340, lat: 20.290, lng: 86.670 },
        { name: 'Jenapur Railway Bridge', district: 'Jajpur, Odisha', x: 275, y: 135, lat: 20.865, lng: 86.024 },
        { name: 'Anandapur River Basin', district: 'Keonjhar, Odisha', x: 260, y: 65, lat: 21.215, lng: 86.120 },
        { name: 'Alipingal & Devi River Estuary', district: 'Jagatsinghpur, Odisha', x: 385, y: 370, lat: 20.240, lng: 86.230 },
        { name: 'Dhamra Port & Estuarine Buffer', district: 'Bhadrak, Odisha', x: 600, y: 120, lat: 20.814, lng: 86.953 },
        { name: 'Similipal Foothills & Escarpment', district: 'Mayurbhanj, Odisha', x: 100, y: 80, lat: 21.500, lng: 85.900 }
      ]
    : [
        { name: 'Maple General Hospital Complex', district: 'Central District', x: 380, y: 290, lat: 27.77, lng: -81.55 },
        { name: 'Substation 4B Coastal Transmission', district: 'Bayfront Sector', x: 270, y: 340, lat: 27.72, lng: -81.62 },
        { name: 'South River Lift Station & Treatment', district: 'River Estuary', x: 220, y: 470, lat: 27.65, lng: -81.65 },
        { name: 'Pine Ridge Mountain Escarpment', district: 'Highland Ridge', x: 640, y: 90, lat: 27.90, lng: -81.42 }
      ];

  const filteredAnchors = searchAnchors.filter(a =>
    a.name.toLowerCase().includes(searchLocationQuery.toLowerCase()) ||
    a.district.toLowerCase().includes(searchLocationQuery.toLowerCase())
  );

  // SVG radius pixel conversion: 1km approx 4px
  const radiusSvgPx = selectedRadiusKm / 0.25;

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
                  ? 'Multi-Hazard Geospatial Studio • Live Spatial Composite & Area Intelligence'
                  : 'Multi-Hazard Geospatial Studio • Maple County Corridor'}
              </h2>
              <span className="text-[11px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                {isIndia ? 'EPSG:3857 • ISRO Bhuvan / Cartosat-1 • GTS Datum' : 'EPSG:3857 • 10m Copernicus DEM'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any area on the map to inspect real-time contributing conditions, active hazards, infrastructure exposure, deltas, and scientific provenance.
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

              <button
                id="layer-toggle-river-gauges"
                onClick={() => setShowRiverGauges(!showRiverGauges)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  showRiverGauges
                    ? 'bg-cyan-950/40 border-cyan-800/80 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CWC River Gauges (Google Flood API)</span>
                </div>
                {showRiverGauges ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
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
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative min-h-[580px] flex flex-col">
          {/* Map Top Action & Search Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
            {/* Observe Area Tool Toggle */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-observe-area-toggle"
                onClick={() => setIsObserveAreaMode(!isObserveAreaMode)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isObserveAreaMode
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="When active, click anywhere on map or hazard polygon to inspect area"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>🔍 Observe Area</span>
                {isObserveAreaMode && (
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping ml-0.5"></span>
                )}
              </button>

              {/* Radius Quick Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
                {[5, 10, 25].map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRadiusKm(r);
                      if (selectedArea) setSelectedArea({ ...selectedArea, radiusKm: r });
                    }}
                    className={`px-1.5 py-0.5 rounded ${
                      selectedRadiusKm === r ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}k
                  </button>
                ))}
              </div>
            </div>

            {/* Location Quick Search Dropdown */}
            <div className="relative">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 space-x-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city, river, asset..."
                  value={searchLocationQuery}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-36 sm:w-44"
                />
                {searchLocationQuery && (
                  <button
                    onClick={() => {
                      setSearchLocationQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="text-slate-500 hover:text-slate-300 text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {showSearchDropdown && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl z-50 p-1 space-y-1 max-h-56 overflow-y-auto">
                  <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 border-b border-slate-800/80">
                    Jump to Spatial Location:
                  </div>
                  {filteredAnchors.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setSelectedArea({
                          type: 'search',
                          coords: { lat: item.lat, lng: item.lng, svgX: item.x, svgY: item.y },
                          radiusKm: selectedRadiusKm,
                          locationName: item.name,
                          districtState: item.district
                        });
                        setInspectorTab('area_intelligence');
                        setShowSearchDropdown(false);
                        setSearchLocationQuery('');
                      }}
                      className="w-full text-left p-1.5 rounded hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200 transition-colors"
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate text-[11px]">{item.name}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{item.district}</div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Status Bar */}
          <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="font-mono text-slate-300 truncate">
                {selectedArea ? `Selected: ${selectedArea.locationName} (${selectedRadiusKm}km ring)` : 'Click map to inspect any area'}
              </span>
            </div>
            <div className="text-[10px] text-amber-400 font-mono">
              [Click anywhere to inspect]
            </div>
          </div>

          {/* Interactive SVG Geospatial Stage */}
          <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-2 select-none cursor-crosshair">
            <svg
              viewBox="0 0 800 600"
              onClick={handleSvgMapClick}
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

                {/* Radial spotlight for selected area focus */}
                {selectedArea && (
                  <mask id="areaSpotlightMask">
                    <rect x="0" y="0" width="800" height="600" fill="#ffffff" />
                    <circle
                      cx={selectedArea.coords.svgX}
                      cy={selectedArea.coords.svgY}
                      r={radiusSvgPx}
                      fill="#666666"
                    />
                  </mask>
                )}
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
                  {/* Mahanadi River Trunk & Delta Channels - Clickable Hazard Area */}
                  <path
                    d="M 0,230 C 130,220 200,245 320,270 C 400,290 460,310 505,325"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="7"
                    strokeLinecap="round"
                    className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArea({
                        type: 'hazard_zone',
                        coords: { lat: 20.490, lng: 85.892, svgX: 240, svgY: 245 },
                        radiusKm: selectedRadiusKm,
                        locationName: 'Mahanadi River Basin (Trunk Channel)',
                        districtState: 'Cuttack District, Odisha',
                        hazardZoneType: 'river_channel'
                      });
                      setInspectorTab('area_intelligence');
                    }}
                  />
                  <path
                    d="M 220,245 C 270,285 360,370 480,440"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="cursor-pointer hover:stroke-cyan-300 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArea({
                        type: 'hazard_zone',
                        coords: { lat: 20.240, lng: 86.230, svgX: 385, svgY: 370 },
                        radiusKm: selectedRadiusKm,
                        locationName: 'Devi Distributary River Channel',
                        districtState: 'Jagatsinghpur District, Odisha',
                        hazardZoneType: 'river_channel'
                      });
                      setInspectorTab('area_intelligence');
                    }}
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
                <g
                  id="dem-slope-layer"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArea({
                      type: 'hazard_zone',
                      coords: { lat: 21.50, lng: 85.90, svgX: 100, svgY: 80 },
                      radiusKm: selectedRadiusKm,
                      locationName: isIndia ? 'Similipal Foothills & Eastern Ghats Ridge' : 'Pine Ridge Escarpment',
                      districtState: isIndia ? 'Mayurbhanj District, Odisha' : 'Highland Ridge',
                      hazardZoneType: 'slope_escarpment'
                    });
                    setInspectorTab('area_intelligence');
                  }}
                >
                  {isIndia ? (
                    <>
                      <path
                        d="M 0,0 L 220,0 C 200,80 150,150 100,200 L 0,210 Z"
                        fill="url(#slopeGrad)"
                        stroke="#f97316"
                        strokeWidth="1.5"
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
                      <g
                        key={spot.id}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArea({
                            type: 'hazard_zone',
                            coords: { lat: spot.coordinates[0], lng: spot.coordinates[1], svgX: cx, svgY: cy },
                            radiusKm: selectedRadiusKm,
                            locationName: `SAR Soil Saturation Hotspot (${(spot.sarRelativeSaturation * 100).toFixed(0)}%)`,
                            districtState: isIndia ? 'Coastal Floodplain, Odisha' : 'Wetland Zone',
                            hazardZoneType: 'sar_soil_moisture'
                          });
                          setInspectorTab('area_intelligence');
                        }}
                      >
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

              {/* Hydrodynamic Storm Surge Inundation Polygon Layer (Clickable Hazard Zone) */}
              {showSurgeLayer && (
                <g
                  id="hydrodynamic-surge-layer"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArea({
                      type: 'hazard_zone',
                      coords: { lat: 20.35, lng: 86.70, svgX: 550, svgY: 340 },
                      radiusKm: selectedRadiusKm,
                      locationName: isIndia ? 'Bay of Bengal Hydrodynamic Surge Zone' : 'Ocean Surge Inundation Corridor',
                      districtState: isIndia ? 'Coastal Jagatsinghpur / Kendrapara' : 'Coastal Zone',
                      hazardZoneType: 'surge_inundation'
                    });
                    setInspectorTab('area_intelligence');
                  }}
                >
                  {isIndia ? (
                    <>
                      <path
                        d={`M 800,0 L 800,600 L ${620 - dynamicSurgeLevel * 16},600 C ${570 - dynamicSurgeLevel * 20},520 ${500 - dynamicSurgeLevel * 24},440 ${480 - dynamicSurgeLevel * 26},350 C ${460 - dynamicSurgeLevel * 20},240 ${500 - dynamicSurgeLevel * 14},130 ${520 - dynamicSurgeLevel * 12},0 Z`}
                        fill="url(#surgeWater)"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:opacity-90"
                      />
                      <path
                        d="M 750,50 C 510,180 470,330 520,550"
                        fill="none"
                        stroke="#7dd3fc"
                        strokeWidth="1"
                        strokeDasharray="5 3"
                      />
                      <text x="460" y="420" fill="#bae6fd" fontSize="12" fontWeight="bold" fontFamily="monospace">
                        Surge Crest: +{dynamicSurgeLevel.toFixed(1)}m GTS MSL (Click to Inspect)
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
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArea({
                            type: 'hazard_zone',
                            coords: { lat: 20.38, lng: 86.32, svgX: 350, svgY: 290 },
                            radiusKm: selectedRadiusKm,
                            locationName: 'SH-12 Cuttack-Paradip Highway Causeway',
                            districtState: 'Cuttack / Jagatsinghpur, Odisha'
                          });
                          setInspectorTab('area_intelligence');
                        }}
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
                      <path
                        d="M 170,540 Q 230,420 260,330"
                        fill="none"
                        stroke={dynamicSurgeLevel > 2.0 ? '#ef4444' : '#a855f7'}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 260,330 C 350,290 420,220 540,160"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="8 3"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(asset);
                          setSelectedGauge(null);
                          setSelectedArea({
                            type: 'asset',
                            coords: { lat: asset.coordinates[0], lng: asset.coordinates[1], svgX: px, svgY: py },
                            radiusKm: selectedRadiusKm,
                            locationName: asset.name,
                            districtState: isIndia ? 'Odisha Lifeline Node' : 'Lifeline Node',
                            assetRef: asset
                          });
                        }}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        {isSelected && (
                          <circle r="22" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                        )}

                        <circle
                          r="14"
                          fill={isSubmerged ? '#7f1d1d' : asset.status === 'critical_failure' ? '#78350f' : '#0f172a'}
                          stroke={isSubmerged ? '#ef4444' : asset.status === 'critical_failure' ? '#f59e0b' : '#38bdf8'}
                          strokeWidth="2.5"
                        />

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

              {/* CWC Telemetric River Stage Gauges (Google Flood Forecasting API Gateway) */}
              {showRiverGauges && (
                <g id="river-gauges-layer">
                  {cwcGauges.map((gauge) => {
                    let gx = 200;
                    let gy = 230;
                    if (gauge.stationCode === 'CWC_MHD_03B') { gx = 200; gy = 230; }
                    else if (gauge.stationCode === 'CWC_MHD_04A') { gx = 240; gy = 245; }
                    else if (gauge.stationCode === 'CWC_BRH_02C') { gx = 275; gy = 135; }
                    else if (gauge.stationCode === 'CWC_BTR_01A') { gx = 260; gy = 65; }
                    else if (gauge.stationCode === 'CWC_MHD_08F') { gx = 385; gy = 370; }

                    const isSelected = selectedGauge?.gaugeId === gauge.gaugeId;
                    const isDanger = gauge.waterLevelM >= gauge.dangerLevelM;
                    const isWarning = gauge.waterLevelM >= gauge.warningLevelM;

                    return (
                      <g
                        key={gauge.gaugeId}
                        transform={`translate(${gx}, ${gy})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGauge(gauge);
                          setSelectedAsset(null);
                          setSelectedArea({
                            type: 'hazard_zone',
                            coords: { lat: gauge.coordinates.latitude, lng: gauge.coordinates.longitude, svgX: gx, svgY: gy },
                            radiusKm: selectedRadiusKm,
                            locationName: `${gauge.gaugeName} (${gauge.riverName})`,
                            districtState: `${gauge.basin.replace(/_/g, ' ')}, Odisha`,
                            gaugeRef: gauge
                          });
                        }}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        {isSelected && (
                          <circle r="22" fill="none" stroke="#06b6d4" strokeWidth="2.5" className="animate-pulse" />
                        )}
                        <circle
                          r="13"
                          fill={isDanger ? '#7f1d1d' : isWarning ? '#78350f' : '#083344'}
                          stroke={isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#06b6d4'}
                          strokeWidth="2"
                        />
                        <text
                          y="4"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          💧
                        </text>
                        <text
                          x="16"
                          y="4"
                          fill={isSelected ? '#22d3ee' : '#cbd5e1'}
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          className="drop-shadow"
                        >
                          {gauge.gaugeName.split(' ')[0]} ({gauge.waterLevelM.toFixed(1)}m)
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

              {/* ==================================================================== */}
              {/* SECTION 23: "FOCUS THIS AREA" VISUAL EFFECT OVERLAY                  */}
              {/* Dims unrelated areas, highlights selected radius boundary & crosshair */}
              {/* ==================================================================== */}
              {selectedArea && (
                <g id="area-focus-overlay" pointerEvents="none">
                  {/* Subtle darkening vignette on unselected map areas */}
                  <rect
                    x="0"
                    y="0"
                    width="800"
                    height="600"
                    fill="#030712"
                    opacity="0.30"
                    mask="url(#areaSpotlightMask)"
                  />

                  {/* Pulsing Selection Radius Ring */}
                  <circle
                    cx={selectedArea.coords.svgX}
                    cy={selectedArea.coords.svgY}
                    r={radiusSvgPx}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                    opacity="0.9"
                  />

                  {/* Secondary Outer Context Ring */}
                  <circle
                    cx={selectedArea.coords.svgX}
                    cy={selectedArea.coords.svgY}
                    r={radiusSvgPx + 8}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    opacity="0.5"
                  />

                  {/* Center Crosshair Marker */}
                  <g transform={`translate(${selectedArea.coords.svgX}, ${selectedArea.coords.svgY})`}>
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#f59e0b" strokeWidth="2" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#f59e0b" strokeWidth="2" />
                    <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  </g>

                  {/* Floating Boundary Label Badge */}
                  <g transform={`translate(${selectedArea.coords.svgX}, ${Math.max(25, selectedArea.coords.svgY - radiusSvgPx - 10)})`}>
                    <rect
                      x="-70"
                      y="-12"
                      width="140"
                      height="18"
                      rx="4"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="1"
                      fill="#fbbf24"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {selectedRadiusKm}km Context Ring
                    </text>
                  </g>
                </g>
              )}

              {/* Dynamic Feature Highlight Animation (when user clicks "Show on Map") */}
              {highlightedFeature && highlightedFeature.coords && (
                <g transform={`translate(${highlightedFeature.coords.x}, ${highlightedFeature.coords.y})`} pointerEvents="none">
                  <circle r="35" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="5 3" className="animate-spin" />
                  <circle r="50" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                  <rect x="-55" y="-30" width="110" height="18" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
                  <text textAnchor="middle" y="-18" fill="#e0f2fe" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Focused: {highlightedFeature.type.toUpperCase()}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* SECTION 24: MAP LEGEND (Progressive Disclosure) */}
          <div className="bg-slate-900/90 border-t border-slate-800 p-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300 text-[10px] uppercase font-mono tracking-wider">Map Legend:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Surge</span>
                <span className="text-[8px] text-slate-500 font-mono">(Model)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>River Gauge</span>
                <span className="text-[8px] text-emerald-400 font-mono">(Live CWC)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                <span>Slopes</span>
                <span className="text-[8px] text-slate-500 font-mono">(DEM)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>SAR Saturation</span>
                <span className="text-[8px] text-emerald-400 font-mono">(Sentinel-1)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Lifeline Assets</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>Evacuation Roads</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Area Intelligence Inspector OR Asset/Gauge Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Inspector Tab Switcher */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center justify-between text-xs">
            <button
              id="tab-btn-area-intelligence"
              onClick={() => setInspectorTab('area_intelligence')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                inspectorTab === 'area_intelligence'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>📍 Area Situation</span>
            </button>

            <button
              id="tab-btn-asset-inspector"
              onClick={() => setInspectorTab('asset_inspector')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                inspectorTab === 'asset_inspector'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{selectedGauge ? '💧 River Gauge' : '🏢 Asset Inspector'}</span>
            </button>
          </div>

          {/* Tab 1: Area Intelligence Panel */}
          {inspectorTab === 'area_intelligence' && areaAnalysis ? (
            <AreaIntelligencePanel
              analysis={areaAnalysis}
              selectedRadiusKm={selectedRadiusKm}
              onRadiusChange={(r) => {
                setSelectedRadiusKm(r);
                if (selectedArea) {
                  setSelectedArea({ ...selectedArea, radiusKm: r });
                }
              }}
              onHighlightFeature={handleHighlightFeature}
              onClose={() => setInspectorTab('asset_inspector')}
              onSelectAssetForAudit={(asset) => {
                setSelectedAsset(asset);
                setSelectedGauge(null);
                onSelectAssetForAudit(asset);
              }}
              activeStoryStepIndex={activeStoryStepIndex}
              onStartStoryMode={() => setActiveStoryStepIndex(0)}
              onStepStoryMode={(nextIdx) => {
                setActiveStoryStepIndex(nextIdx);
                const step = areaAnalysis.storySteps[nextIdx];
                if (step && step.svgTarget) {
                  handleHighlightFeature(step.highlightLayer, step.svgTarget);
                }
              }}
              onExitStoryMode={() => setActiveStoryStepIndex(null)}
            />
          ) : (
            /* Tab 2: Single Asset or CWC River Gauge Inspector */
            <div className="space-y-4">
              {selectedGauge ? (
                <div className="bg-slate-900 border border-cyan-800/60 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                          {selectedGauge.riverName} River • {selectedGauge.basin.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
                        {selectedGauge.gaugeName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                          Station: {selectedGauge.stationCode}
                        </span>
                        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                          selectedGauge.floodSeverity === 'DANGER'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                            : selectedGauge.floodSeverity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {selectedGauge.floodSeverity} STAGE
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedGauge(null);
                        if (assets.length > 0) setSelectedAsset(assets[0]);
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
                      title="Switch to Infrastructure Assets"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Water Stage Metrics */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-cyan-900/40 space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Current Water Stage:</span>
                      <span className="text-cyan-400 text-sm font-bold">{selectedGauge.waterLevelM.toFixed(2)}m GTS MSL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Warning Level:</span>
                      <span className="text-amber-400 font-bold">{selectedGauge.warningLevelM.toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Danger Level:</span>
                      <span className="text-red-400 font-bold">{selectedGauge.dangerLevelM.toFixed(2)}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Record High (HFL):</span>
                      <span className="text-purple-400 font-bold">{selectedGauge.historicalHighestFloodLevelM.toFixed(2)}m</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-300 font-sans font-semibold">Stage Differential:</span>
                      <span className={`text-xs font-bold ${
                        selectedGauge.waterLevelM >= selectedGauge.dangerLevelM
                          ? 'text-red-400'
                          : selectedGauge.waterLevelM >= selectedGauge.warningLevelM
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {selectedGauge.waterLevelM >= selectedGauge.dangerLevelM
                          ? `+${(selectedGauge.waterLevelM - selectedGauge.dangerLevelM).toFixed(2)}m ABOVE DANGER`
                          : `${(selectedGauge.dangerLevelM - selectedGauge.waterLevelM).toFixed(2)}m below danger`}
                      </span>
                    </div>
                  </div>

                  {/* Hydro Discharge & Sluice Gate Control */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Discharge & Sluice Status</span>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Discharge Rate:</span>
                      <span className="text-slate-200 font-mono">{selectedGauge.dischargeM3s.toLocaleString()} m³/s</span>
                    </div>
                    {selectedGauge.sluiceGateStatus && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sluice Gates:</span>
                        <span className="text-amber-300 font-mono text-[11px]">{selectedGauge.sluiceGateStatus.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Return Period (2-Yr):</span>
                      <span className="text-slate-300 font-mono">{selectedGauge.returnPeriodThresholds.rp2YearsM}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Return Period (50-Yr):</span>
                      <span className="text-slate-300 font-mono">{selectedGauge.returnPeriodThresholds.rp50YearsM}m</span>
                    </div>
                  </div>

                  {/* Official Google Flood Forecasting Gateway Citation */}
                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/60 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-cyan-400 font-semibold text-[10px]">
                      <span>DATA SOURCE: CWC / GOOGLE FLOOD API</span>
                      <a
                        href="https://developers.google.com/flood-forecasting"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-0.5"
                      >
                        Docs <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Statutory river stage data via Google Flood Forecasting API (developers.google.com/flood-forecasting) under CWC National Flood Forecasting Initiative.
                    </p>
                  </div>
                </div>
              ) : selectedAsset ? (
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
                  Click any infrastructure node or river gauge on the map to inspect.
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
          )}
        </div>
      </div>
    </div>
  );
};
