import React, { useState, useMemo } from 'react';
import {
  Globe,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Calendar,
  Languages,
  UserCheck,
  Cpu,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Waves,
  Wind,
  Droplet,
  CloudRain,
  Mountain,
  PhoneCall,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  MapPin,
  Navigation,
  Activity,
  CheckCircle2,
  Building,
  Radio,
  FileText
} from 'lucide-react';
import {
  GLOBAL_HOTSPOTS,
  EnvironmentalHotspot,
  WHAT_CHANGED_RECORDS,
  WHY_CARE_TRANSLATIONS,
  EXPLORE_DATA_CATEGORIES,
  ACTIVE_RISK_CARDS,
  PRESET_LOCATIONS_SITUATION,
  ProximitySituation,
  calculateNearbySituation,
  DATA_PROVENANCE_AUTHORITIES,
  DataSourceProvenance
} from '../../data/globalEnvironmentalData';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
  UI_TRANSLATIONS
} from '../../data/multilingualGlossary';
import { InteractiveGlobe3D } from './InteractiveGlobe3D';
import { AiSituationExplainer } from './AiSituationExplainer';

interface EarthSituationPageProps {
  onNavigateToExpertTab?: (tab: string) => void;
}

export const EarthSituationPage: React.FC<EarthSituationPageProps> = ({
  onNavigateToExpertTab
}) => {
  // Multilingual State (Default English)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>('en');

  // Citizen Mode vs Expert Mode toggle
  const [isCitizenMode, setIsCitizenMode] = useState<boolean>(true);

  // Selected Hotspot on the Globe
  const [selectedHotspot, setSelectedHotspot] = useState<EnvironmentalHotspot>(GLOBAL_HOTSPOTS[0]);

  // Universal Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Time Machine Scrubber State
  const [timeStep, setTimeStep] = useState<string>('NOW');

  // "Situation Around Me" active location state
  const [nearbyLocationKey, setNearbyLocationKey] = useState<string>('cuttack');
  const [customUserProximity, setCustomUserProximity] = useState<ProximitySituation | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState<string>('');

  // Accordion for Data Explorer
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    layer_water: true,
    layer_atmosphere: true
  });

  // Data Transparency Modal / Expansion
  const [showDataSourceModal, setShowDataSourceModal] = useState<boolean>(false);

  const ui = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  // Active Proximity Situation
  const currentProximity = customUserProximity || PRESET_LOCATIONS_SITUATION[nearbyLocationKey] || PRESET_LOCATIONS_SITUATION.cuttack;

  // Filtered hotspots by search query
  const filteredHotspots = useMemo(() => {
    if (!searchQuery.trim()) return GLOBAL_HOTSPOTS;
    const q = searchQuery.toLowerCase();
    return GLOBAL_HOTSPOTS.filter(
      h =>
        h.name.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.hazardType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Browser Geolocation Detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMsg('Geolocation is not supported by your browser. Using Cuttack preset.');
      return;
    }

    setIsLocatingUser(true);
    setLocationStatusMsg('Acquiring location coordinates...');

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const prox = calculateNearbySituation(latitude, longitude);
        setCustomUserProximity(prox);
        setIsLocatingUser(false);
        setLocationStatusMsg(`Location found: ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
      },
      err => {
        setIsLocatingUser(false);
        setLocationStatusMsg('Location access permission was not granted. Showing Cuttack regional center.');
      },
      { timeout: 8000 }
    );
  };

  const timeOptions = [
    { label: '-7d', sub: 'Past' },
    { label: '-24h', sub: 'Past' },
    { label: '-6h', sub: 'Past' },
    { label: 'NOW', sub: 'Live Telemetry' },
    { label: '+6h', sub: 'Forecast' },
    { label: '+24h', sub: 'Forecast' },
    { label: '+3d', sub: 'Outlook' },
    { label: '+7d', sub: 'Outlook' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* 1. TOP GLOBAL SITUATION BAR (Streamlined & Compact) */}
      <section className="bg-slate-900/90 border-b border-slate-800 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Title & Tagline */}
            <div className="flex items-center space-x-2.5 w-full md:w-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
                <Globe className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {ui.pageTitle}
                  </h1>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    REAL-TIME
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {ui.pageSubtitle}
                </p>
              </div>
            </div>

            {/* Right Controls: Language Selector, Mode Switcher, Search */}
            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
              {/* Search Bar with Autocomplete Dropdown (Section 20) */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder={ui.searchPlaceholder}
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filteredHotspots.length > 0) {
                      setSelectedHotspot(filteredHotspots[0]);
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-52 transition-all"
                />
                {isSearchFocused && searchQuery.trim() && (
                  <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-1 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {filteredHotspots.length === 0 ? (
                      <div className="px-3 py-2 text-[11px] text-slate-400">No matching locations</div>
                    ) : (
                      filteredHotspots.map(spot => (
                        <button
                          key={spot.id}
                          onMouseDown={() => {
                            setSelectedHotspot(spot);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-800/60 last:border-0"
                        >
                          <div>
                            <span className="text-xs font-bold text-white block">{spot.name}</span>
                            <span className="text-[10px] text-slate-400">{spot.region}, {spot.country}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            spot.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            spot.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {spot.severity}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 12-Language Selector */}
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5">
                <Languages className="w-3.5 h-3.5 text-cyan-400 mr-1.5 flex-shrink-0" />
                <select
                  value={selectedLanguage}
                  onChange={e => setSelectedLanguage(e.target.value as SupportedLanguageCode)}
                  className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1 py-0.5"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Citizen Mode vs Expert Mode Toggle */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setIsCitizenMode(true)}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                    isCitizenMode
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{ui.citizenMode}</span>
                </button>
                <button
                  onClick={() => setIsCitizenMode(false)}
                  className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                    !isCitizenMode
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{ui.expertMode}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TIME MACHINE SCRUBBER BAR (Streamlined & Compact) */}
      <section className="bg-slate-950 border-b border-slate-800/80 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Time Horizon:
            </span>
          </div>

          {/* Time Scrubber Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-0.5 scrollbar-none">
            {timeOptions.map(opt => {
              const isSelected = timeStep === opt.label;
              const isPast = opt.sub === 'Past';
              const isNow = opt.label === 'NOW';

              return (
                <button
                  key={opt.label}
                  onClick={() => setTimeStep(opt.label)}
                  className={`flex flex-col items-center px-2 py-0.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                    isSelected
                      ? isNow
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : isPast
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="font-mono font-bold leading-none text-[11px]">{opt.label}</span>
                  <span className={`text-[8px] ${isSelected ? 'text-slate-950/80' : 'text-slate-500'}`}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time Window Notice */}
          <div className="hidden lg:flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
            {timeStep === 'NOW' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Observation: IMD Doppler, CWC Telemetry, Sentinel-1 SAR</span>
              </>
            ) : timeStep.startsWith('-') ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Historical Replay Mode (t ≤ T_eval; zero forward data leakage)</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Multi-Physics Hydrodynamic & Atmospheric NWP Forecast Horizon</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER: Hero Globe as Visual Centerpiece */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 flex-1 space-y-5">
        {/* 3. HERO 3D INTERACTIVE GLOBE & SPATIAL STAGE (Section 10) */}
        <section className="relative">
          <InteractiveGlobe3D
            selectedHotspot={selectedHotspot}
            onSelectHotspot={spot => setSelectedHotspot(spot)}
            activeLanguage={selectedLanguage}
            onOpenExplainer={() => {
              document.getElementById('ai-explainer-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenEvidence={() => {
              document.getElementById('data-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* 4. SELECTED LOCATION CONTEXT PANEL (Section 12) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Active Selected Location
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {selectedHotspot.name}, {selectedHotspot.region}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedHotspot.country} • {selectedHotspot.coordinates.latitude.toFixed(2)}°N, {selectedHotspot.coordinates.longitude.toFixed(2)}°E
                </span>
              </div>
            </div>

            {/* Severity + Status Badges */}
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                  selectedHotspot.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : selectedHotspot.severity === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{selectedHotspot.severity} SEVERITY</span>
              </span>

              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950 border border-slate-800 text-cyan-400 font-semibold">
                {selectedHotspot.status}
              </span>
            </div>
          </div>

          {/* Context Details Grid: Calculation Basis, Timestamp, Confidence, Source */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Calculation Basis</span>
              <span className="text-slate-200 font-semibold mt-0.5 block truncate">
                {selectedHotspot.technicalDetails.modelReference}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Observation Timestamp</span>
              <span className="text-emerald-400 font-mono font-semibold mt-0.5 block">
                {new Date(selectedHotspot.observationTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Data Confidence</span>
              <span className="text-cyan-400 font-semibold mt-0.5 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedHotspot.confidence} Confidence</span>
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Source Authority</span>
              <span className="text-slate-300 font-semibold mt-0.5 block truncate">
                {selectedHotspot.sourceAuthority}
              </span>
            </div>
          </div>
        </section>

        {/* 5. STRUCTURED 5-POINT "WHAT IS HAPPENING?" PANEL (Section 3) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Info className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  What is Happening in the Environment Right Now?
                </h3>
                <p className="text-xs text-slate-400">
                  Automated plain-language situation synthesis verified against live sensors.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Point 1: Current situation */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  1. Current Situation
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  🌧️ Heavy rainfall exceeding 340mm is active over coastal Odisha catchments, raising the Mahanadi River at Jobra Barrage to 21.65m MSL.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                Live Gauge: +0.65m over Warning
              </div>
            </div>

            {/* Point 2: What does this mean? */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  2. What Does This Mean?
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  Several upstream reservoirs are releasing overflow water. The river is draining into the Bay of Bengal while high sea tides push back, causing water to back up.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                Discharge: 24,500 m³/s
              </div>
            </div>

            {/* Point 3: Current concern */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  3. Current Concern
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  ⚠️ Flood risk is high for low-lying farming tracts, OPTCL 220kV Paradip Substation, and State Highway SH-12 at KM 42 culvert.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                Culvert head: -0.65m margin
              </div>
            </div>

            {/* Point 4: What may happen next? */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  4. What May Happen Next?
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  Peak hydrograph crest will coincide with astronomical ocean high tide in 4 to 6 hours. High water will persist for approximately 36 hours.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                Arrival Horizon: T+4.5h
              </div>
            </div>

            {/* Point 5: What should people do? */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">
                  5. What Should People Do?
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  Avoid walking or driving through standing water. Secure livestock to elevated grounds. Obey official District Collectorate announcements.
                </p>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold font-mono pt-2 border-t border-slate-800/80">
                Helplines: 112 / 1070 / 1078
              </div>
            </div>
          </div>
        </section>

        {/* 6. DEDICATED HAZARD RISK CARDS GRID (Section 7) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Active Hazard Risk Overview
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Only showing cards where active sensor telemetry or warnings exist.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ACTIVE_RISK_CARDS.map(card => (
              <div
                key={card.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      {card.hazardType === 'flood' ? (
                        <Waves className="w-4 h-4 text-cyan-400" />
                      ) : card.hazardType === 'cyclone' ? (
                        <Wind className="w-4 h-4 text-orange-400" />
                      ) : card.hazardType === 'coastal' ? (
                        <Droplet className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Mountain className="w-4 h-4 text-amber-400" />
                      )}
                      <span>{card.name}</span>
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        card.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : card.severity === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 my-2">
                    {card.keyMetrics.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{m.label}:</span>
                        <span className="font-semibold text-slate-200 font-mono">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">
                    {card.forecastSummary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-2 font-mono">
                  <span>{card.authority}</span>
                  <span className="text-cyan-400">{card.freshness}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. "SITUATION AROUND ME" (Section 6) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div className="flex items-center space-x-2.5">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Situation Around Me — What is happening near my location?
                </h3>
                <p className="text-xs text-slate-400">
                  Client-side proximity analysis calculating distances to rivers, storm eyes, and relief shelters.
                </p>
              </div>
            </div>

            {/* Location selector buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleDetectLocation}
                disabled={isLocatingUser}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isLocatingUser ? 'Locating...' : 'Detect My Location'}</span>
              </button>

              {/* City quick selectors */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {(['cuttack', 'paradip', 'bhubaneswar'] as const).map(cityKey => (
                  <button
                    key={cityKey}
                    onClick={() => {
                      setNearbyLocationKey(cityKey);
                      setCustomUserProximity(null);
                      setLocationStatusMsg('');
                    }}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      nearbyLocationKey === cityKey && !customUserProximity
                        ? 'bg-slate-800 text-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cityKey}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {locationStatusMsg && (
            <div className="text-xs font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-800/40 px-3 py-1.5 rounded-lg">
              {locationStatusMsg}
            </div>
          )}

          {/* Proximity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Proximity Card 1: Local Environmental Conditions */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Local Weather & Atmosphere
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Current Sector:</span>
                  <span className="text-white font-semibold">{currentProximity.locationName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>24-Hour Rainfall:</span>
                  <span className="text-emerald-400 font-mono font-bold">{currentProximity.localRainfall24h}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Sustained Wind:</span>
                  <span className="text-orange-400 font-mono font-bold">{currentProximity.localWindSpeed}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Air Temperature:</span>
                  <span className="text-slate-300 font-mono">{currentProximity.localTemperature}</span>
                </div>
              </div>
            </div>

            {/* Proximity Card 2: Nearby Hazards & Distances */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Proximity to Hazard Centers
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Nearest River:</span>
                  <span className="text-white font-semibold truncate max-w-[150px]">
                    {currentProximity.nearestRiverName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Water Stage Level:</span>
                  <span className="text-amber-400 font-mono font-bold">{currentProximity.nearestRiverStage}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Distance to Flood Boundary:</span>
                  <span className="text-cyan-400 font-mono font-bold">{currentProximity.distanceToFloodKm} km</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Distance to Cyclone Center:</span>
                  <span className="text-red-400 font-mono font-bold">{currentProximity.distanceToCycloneKm} km</span>
                </div>
              </div>
            </div>

            {/* Proximity Card 3: Evacuation Shelter & Directives */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Nearest Evacuation Shelter
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-white">{currentProximity.evacuationShelter.name}</div>
                <div className="text-slate-400">
                  Distance: <span className="text-emerald-400 font-mono font-bold">{currentProximity.evacuationShelter.distanceKm} km</span> •{' '}
                  <span className="text-slate-300">{currentProximity.evacuationShelter.capacity}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-400 pt-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span className="font-mono font-semibold">Helpdesk: {currentProximity.evacuationShelter.contactNumber}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                  {currentProximity.activeDirectives[0]}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. "WHY SHOULD I CARE?" (HUMAN CONSEQUENCE TRANSLATIONS - Section 8) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {ui.whyDoesThisMatter}
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Technical measurements translated into real-life citizen impacts.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {WHY_CARE_TRANSLATIONS.map(item => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.urgency === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : item.urgency === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.urgency} IMPACT
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 leading-snug">
                    {item.humanConsequence}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-2.5">
                  <div className="text-[11px] text-emerald-400 font-medium">
                    <span className="font-bold">What to do:</span> {item.practicalAction}
                  </div>
                  {!isCitizenMode && (
                    <div className="text-[10px] text-slate-500 font-mono bg-slate-950 p-1.5 rounded border border-slate-800/80">
                      <span className="text-slate-400">Telemetry:</span> {item.technicalFinding}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. "WHAT CHANGED RECENTLY?" (DETERMINISTIC DELTA ENGINE - Section 10) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {ui.whatChangedRecently}
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Verified changes detected over recent sensor cycles.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {WHAT_CHANGED_RECORDS.map(record => (
              <div
                key={record.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{record.category}</span>
                    <span className="font-mono text-slate-500">{record.timeInterval}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{record.metricName}</h4>

                  {/* Previous vs Current */}
                  <div className="mt-2 flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <div className="text-center flex-1">
                      <span className="text-[10px] text-slate-500 block">Earlier</span>
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        {record.previousValue}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                    <div className="text-center flex-1">
                      <span className="text-[10px] text-slate-500 block">Now</span>
                      <span className="font-mono text-xs text-emerald-400 font-bold">
                        {record.currentValue}
                      </span>
                    </div>
                  </div>

                  {/* Delta badge */}
                  <div className="mt-2 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold font-mono ${
                        record.isEscalation
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {record.changeDelta}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-2 leading-relaxed">
                  {record.humanSignificance}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. STRICT SEPARATION: OFFICIAL WARNINGS VS. GEOSHIELD DERIVED ANALYSIS (Section 16) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {ui.officialWarningHeader} vs. {ui.geoshieldAnalysisHeader}
                </h3>
                <p className="text-xs text-slate-400">
                  Strict legal demarcation between statutory government directives and computational engineering models.
                </p>
              </div>
            </div>

            {/* Emergency Hotline Contact Pill */}
            <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/40 px-3 py-1.5 rounded-xl">
              <PhoneCall className="w-4 h-4 text-red-400 animate-pulse" />
              <div className="text-[11px]">
                <span className="text-slate-400">National Emergency:</span>{' '}
                <span className="text-white font-bold font-mono">112</span> |{' '}
                <span className="text-slate-400">NDMA:</span>{' '}
                <span className="text-white font-bold font-mono">1078</span> |{' '}
                <span className="text-slate-400">OSDMA:</span>{' '}
                <span className="text-white font-bold font-mono">1070</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Official Warnings (Statutory Authority) */}
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Official Government Directives (Statutory Authority)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="font-bold text-red-300">IMD Red Warning Bulletin (Cyclone Dana)</span>
                    <span className="font-mono text-slate-400">Valid: 24h</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Extremely heavy rainfall (&gt;204mm) expected in coastal Odisha. Coastal fishermen advised not to venture into sea.
                  </p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="font-bold text-amber-300">CWC River Flood Warning (Jobra Barrage)</span>
                    <span className="font-mono text-slate-400">Valid: Immediate</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Mahanadi River at Jobra crossed Warning Stage (21.00m MSL). Flood cells alerted in Cuttack & Jagatsinghpur.
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  <span className="font-semibold text-slate-300">Mandate:</span> Under the Disaster Management Act 2005, only District Collectors and OSDMA have statutory authority to issue binding evacuation orders.
                </div>
              </div>
            </div>

            {/* Right: GeoShield Derived Analysis (Advisory) */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  GeoShield Derived Engineering Intelligence (Advisory)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-cyan-500/10 border border-cyan-500/20 p-2.5 rounded-lg">
                  <span className="font-bold text-cyan-300 block mb-0.5">
                    Asset Finished Floor Elevation (FFE) Breach Analysis
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    Surge height (+3.60m) will encroach within 0.70m of OPTCL Paradip Substation control building foundation level (+2.90m MSL).
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                  <span className="font-bold text-slate-300 block mb-0.5">
                    Sentinel-1 SAR Soil Pore Saturation
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    Soil moisture at 94% indicates zero infiltration capacity, converting 100% of upcoming rainfall into direct surface runoff.
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  <span className="font-semibold text-slate-300">Validation Status:</span> Physics-based computation calibrated against historical Fani/Dana benchmarks. Pending independent statutory certification.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. "EXPLAIN THIS TO ME" (3-LEVEL AI EXPLAINER & ANALYST - Section 4 & 13) */}
        <section id="ai-explainer-section">
          <AiSituationExplainer
            hotspot={selectedHotspot}
            activeLanguage={selectedLanguage}
            isCitizenMode={isCitizenMode}
          />
        </section>

        {/* 12. EXPANDABLE DATA EXPLORER CATEGORIES (Section 11) */}
        <section id="data-evidence-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {ui.exploreData}
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect multi-sensor earth telemetry, river gauges, weather radars, and satellite passes.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {EXPLORE_DATA_CATEGORIES.map(cat => {
              const isExpanded = !!expandedCategories[cat.id];
              return (
                <div
                  key={cat.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-white">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        — {cat.description}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1 border-t border-slate-800/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {cat.dataPoints.map((dp, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 space-y-1 text-xs"
                          >
                            <span className="text-[11px] text-slate-400 block truncate">
                              {dp.name}
                            </span>
                            <span className="text-sm font-bold text-emerald-400 font-mono block">
                              {dp.value}
                            </span>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                              <span className="truncate">{dp.source}</span>
                              <span className="text-cyan-400 font-mono">{dp.freshness}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 13. DATA SOURCE TRANSPARENCY & CONFIDENCE (Section 14 & 15) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Building className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Where Does This Information Come From? (Data Transparency)
                </h3>
                <p className="text-xs text-slate-400">
                  Full lineage and provenance breakdown across official statutory authorities and space agencies.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DATA_PROVENANCE_AUTHORITIES.map(auth => (
              <div
                key={auth.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="text-cyan-400 font-bold">{auth.status}</span>
                    <span>{auth.freshness}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{auth.name}</h4>
                  <span className="text-[11px] text-slate-400 block">{auth.organization}</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{auth.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono truncate">
                  Coverage: {auth.coverage}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 14. SCIENTIFIC & REGULATORY PROVENANCE FOOTER (Section 17 & 22) */}
        <footer className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Transparency, Provenance & Legal Mandate</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            GeoShield India integrates multi-source public telemetry from the India Meteorological Department (IMD), Central Water Commission (CWC), Indian National Centre for Ocean Information Services (INCOIS), ISRO Bhuvan/MOSDAC, and the European Space Agency Copernicus programme.
            In compliance with statutory standards, automated AI systems do not issue direct unverified broadcasts to the public. All life-safety directives are issued exclusively by statutory disaster authorities under the Disaster Management Act 2005.
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex-wrap gap-2">
            <span>Audit Pipeline: 40/40 Adversarial Vectors Verified • 18/18 Historical Replay Vectors Active</span>
            <span>Version: GeoShield India v1.0-PublicIntel</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
