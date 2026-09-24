import React, { useState } from 'react';
import {
  AreaIntelligenceAnalysis,
  EnvironmentalConditionItem,
  ChangeDetectionItem,
  NearbyAssetExposure,
  CascadingImpactNode,
  SpatialStoryStep
} from '../../types/areaIntelligence';
import {
  MapPin,
  Clock,
  Activity,
  Layers,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Droplet,
  Wind,
  Waves,
  Eye,
  ArrowRight,
  Sparkles,
  Info,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Database,
  ExternalLink,
  Play,
  RotateCcw,
  Sliders,
  Compass,
  CheckCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

interface AreaIntelligencePanelProps {
  analysis: AreaIntelligenceAnalysis;
  selectedRadiusKm: number;
  onRadiusChange: (newRadiusKm: number) => void;
  onHighlightFeature: (featureType: string, details?: any) => void;
  onClose: () => void;
  onSelectAssetForAudit?: (asset: any) => void;
  activeStoryStepIndex?: number | null;
  onStartStoryMode?: () => void;
  onStepStoryMode?: (nextIndex: number) => void;
  onExitStoryMode?: () => void;
}

export const AreaIntelligencePanel: React.FC<AreaIntelligencePanelProps> = ({
  analysis,
  selectedRadiusKm,
  onRadiusChange,
  onHighlightFeature,
  onClose,
  onSelectAssetForAudit,
  activeStoryStepIndex = null,
  onStartStoryMode,
  onStepStoryMode,
  onExitStoryMode
}) => {
  // Simple View vs Technical View Toggle
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');

  // AI Explanation Level
  const [aiLevel, setAiLevel] = useState<'simple' | 'detailed' | 'expert'>('simple');

  // Evidence Drawer
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);

  // Selected Change Item for Drilldown
  const [selectedChangeItem, setSelectedChangeItem] = useState<ChangeDetectionItem | null>(null);

  // Scenario Mode Inputs
  const [scenarioRainMultiplier, setScenarioRainMultiplier] = useState(1.0);
  const [scenarioSurgeDeltaM, setScenarioSurgeDeltaM] = useState(0.0);

  // Expandable condition cards
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(null);

  // Cascading impact selected node
  const [selectedCascadeNode, setSelectedCascadeNode] = useState<CascadingImpactNode | null>(null);

  const {
    selection,
    analysisTime,
    dataFreshness,
    liveStatus,
    plainLanguageSynthesis,
    overallConcernGrade,
    overallConcernText,
    conditions,
    causalChain,
    recentChanges,
    spatialChangeBeforeNow,
    contributingLayers,
    nearbyAssets,
    cascadingImpacts,
    forecastTimeline,
    aiExplanations,
    scientificEvidence,
    storySteps
  } = analysis;

  const isStoryActive = activeStoryStepIndex !== null && activeStoryStepIndex >= 0;
  const currentStoryStep: SpatialStoryStep | undefined = isStoryActive ? storySteps[activeStoryStepIndex] : undefined;

  // Scenario preview calculations
  const scenarioRainResult = Math.round(analysis.scenarioMode.baseRainfallMm * scenarioRainMultiplier);
  const scenarioSurgeResult = Number((analysis.scenarioMode.baseSurgeM + scenarioSurgeDeltaM).toFixed(2));
  const scenarioEstimatedExposedAssets = Math.min(
    nearbyAssets.length,
    Math.round(nearbyAssets.filter(a => a.situationSeverity !== 'safe').length * scenarioRainMultiplier + (scenarioSurgeDeltaM > 0 ? 1 : 0))
  );

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-140px)] animate-fadeIn">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  liveStatus === 'LIVE' ? 'bg-emerald-400' : liveStatus === 'FORECAST' ? 'bg-blue-400' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  liveStatus === 'LIVE' ? 'bg-emerald-500' : liveStatus === 'FORECAST' ? 'bg-blue-500' : 'bg-amber-500'
                }`}></span>
              </span>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>📍 Area Intelligence</span>
              </h2>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                liveStatus === 'LIVE'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : liveStatus === 'FORECAST'
                  ? 'bg-blue-950/80 text-blue-300 border-blue-800/80'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
              }`}>
                ● {liveStatus}
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <h3 className="text-xs font-bold text-slate-100">{selection.locationName}</h3>
              <span className="text-[10px] text-slate-400 font-mono">({selection.districtState})</span>
            </div>

            <div className="mt-1 flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{analysisTime}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400/90 font-medium">{dataFreshness}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Simple vs Technical Switcher */}
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex text-[10px] font-medium">
              <button
                id="btn-view-simple"
                onClick={() => setViewMode('simple')}
                className={`px-2 py-1 rounded transition-colors ${
                  viewMode === 'simple'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                👤 Simple
              </button>
              <button
                id="btn-view-technical"
                onClick={() => setViewMode('technical')}
                className={`px-2 py-1 rounded transition-colors ${
                  viewMode === 'technical'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔬 Technical
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Area Inspector"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Spatial Context Radius Selector Ring */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400">Context Radius:</span>
          </div>

          <div className="flex items-center space-x-1">
            {[1, 5, 10, 25, 50].map((r) => (
              <button
                key={r}
                id={`radius-btn-${r}km`}
                onClick={() => onRadiusChange(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  selectedRadiusKm === r
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>

          {/* Spatial Story Mode Launcher */}
          {onStartStoryMode && !isStoryActive && (
            <button
              id="btn-start-story-mode"
              onClick={onStartStoryMode}
              className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 transition-all"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>▶ Explain the Area</span>
            </button>
          )}
        </div>
      </div>

      {/* Spatial Story Mode Active Banner */}
      {isStoryActive && currentStoryStep && (
        <div className="bg-indigo-950/90 border-b border-indigo-800/80 p-3 space-y-2 text-xs animate-fadeIn shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Spatial Story Guide • {currentStoryStep.badge}
            </span>
            <button
              onClick={onExitStoryMode}
              className="text-[10px] text-indigo-300/80 hover:text-white underline"
            >
              Exit Tour
            </button>
          </div>
          <h4 className="font-bold text-white text-xs leading-snug">{currentStoryStep.title}</h4>
          <p className="text-indigo-200/90 text-[11px] leading-relaxed">{currentStoryStep.narrative}</p>
          <div className="flex items-center justify-between pt-1">
            <button
              disabled={activeStoryStepIndex === 0}
              onClick={() => onStepStoryMode && onStepStoryMode(activeStoryStepIndex - 1)}
              className="px-2 py-1 rounded bg-indigo-900/60 disabled:opacity-30 text-indigo-200 text-[10px] font-bold"
            >
              ← Previous
            </button>
            <div className="flex space-x-1">
              {storySteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === activeStoryStepIndex ? 'bg-indigo-400 scale-125' : 'bg-indigo-800'
                  }`}
                />
              ))}
            </div>
            <button
              disabled={activeStoryStepIndex === storySteps.length - 1}
              onClick={() => onStepStoryMode && onStepStoryMode(activeStoryStepIndex + 1)}
              className="px-2 py-1 rounded bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-[10px] font-bold"
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Main Content */}
      <div className="overflow-y-auto p-4 space-y-4 flex-1">
        {/* SECTION 4: WHAT IS HAPPENING HERE? (Prominent Headline) */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              What is happening here?
            </span>
            <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
              overallConcernGrade === 'CRITICAL_DANGER'
                ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                : overallConcernGrade === 'INCREASING_CONCERN'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {overallConcernText}
            </span>
          </div>

          <p className="text-white text-xs font-medium leading-relaxed">
            {plainLanguageSynthesis}
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Ground truth verified</span>
            <span className="font-mono text-slate-300">Lat: {selection.coords.lat.toFixed(2)}° • Lng: {selection.coords.lng.toFixed(2)}°</span>
          </div>
        </div>

        {/* SECTION 5: WHAT EXACTLY IS HAPPENING? (Breakdown into conditions) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Environmental Conditions
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Click card to focus</span>
          </div>

          <div className="space-y-2">
            {conditions.map((item) => {
              const isExpanded = expandedConditionId === item.id;
              return (
                <div
                  key={item.id}
                  id={`condition-card-${item.id}`}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            item.statusBadge === 'CRITICAL' || item.statusBadge === 'DANGER'
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : item.statusBadge === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.currentStatus}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Observed: <strong className="text-white">{item.observedValue}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onHighlightFeature(item.mapHighlightKey, item)}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-semibold text-amber-400 hover:text-amber-300 rounded flex items-center space-x-1 transition-colors"
                        title="Show on Map"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Show on Map</span>
                      </button>

                      <button
                        onClick={() => setExpandedConditionId(isExpanded ? null : item.id)}
                        className="p-1 text-slate-400 hover:text-slate-200"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded condition details */}
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] animate-fadeIn">
                      <div className="flex justify-between text-slate-400">
                        <span>Baseline:</span>
                        <span className="font-mono text-slate-300">{item.referenceBaseline}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Trend:</span>
                        <span className="font-mono text-amber-300 font-bold">{item.changeLabel}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Source Authority:</span>
                        <span className="font-mono text-slate-300">{item.sourceAuthority}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Sensor / Station:</span>
                        <span className="font-mono text-slate-300">{item.stationOrModel}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 7: WHY IS THIS HAPPENING? (Causal relationship diagram) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Why is this happening?
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Relationship Chain</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {causalChain.map((node, idx) => (
              <div key={idx} className="relative flex items-start space-x-2.5 group">
                {/* Connecting vertical line */}
                {idx < causalChain.length - 1 && (
                  <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-800 group-hover:bg-amber-500/50 transition-colors" />
                )}
                {/* Step indicator */}
                <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold z-10 ${
                  node.type === 'Observed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : node.type === 'Model-derived'
                    ? 'bg-blue-950 text-blue-300 border border-blue-700'
                    : 'bg-amber-950 text-amber-300 border border-amber-700'
                }`}>
                  {idx + 1}
                </div>

                <div className="flex-1 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-[11px]">{node.title}</span>
                    <span className={`text-[9px] font-mono px-1 rounded uppercase font-semibold ${
                      node.type === 'Observed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : node.type === 'Model-derived'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {node.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-snug">{node.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8 & 9: WHAT CHANGED? (Interactive Delta & Before-Now) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              🔄 What changed?
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Now vs Previous 6h</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {recentChanges.map((change) => {
              const isSelected = selectedChangeItem?.id === change.id;
              return (
                <button
                  key={change.id}
                  id={`change-card-${change.id}`}
                  onClick={() => setSelectedChangeItem(isSelected ? null : change)}
                  className={`p-2 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{change.icon}</span>
                    <span className={`text-[10px] font-mono font-bold ${
                      change.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {change.deltaText}
                    </span>
                  </div>
                  <div className="font-bold text-slate-200 text-[10px] mt-1 truncate">{change.metric}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {change.pastValue} → {change.currentValue}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Drilldown details on selected change */}
          {selectedChangeItem && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-lg p-2.5 text-xs space-y-1.5 animate-fadeIn">
              <div className="flex justify-between font-bold text-slate-200 text-[11px]">
                <span>{selectedChangeItem.metric} Change Detail</span>
                <span className="text-amber-400 font-mono">{selectedChangeItem.deltaText}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{selectedChangeItem.explanation}</p>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                <span>From: {selectedChangeItem.pastTimestamp}</span>
                <span>To: {selectedChangeItem.currentTimestamp}</span>
              </div>
            </div>
          )}

          {/* Before -> Now Visual Comparison */}
          <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Spatial Footprint: Before vs Now
            </span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">{spatialChangeBeforeNow.timeframePast}</span>
                <span className="text-sm font-bold text-slate-300">{spatialChangeBeforeNow.pastMetrics.floodExtentKm2} km²</span>
                <span className="text-[9px] text-slate-500 block">River: {spatialChangeBeforeNow.pastMetrics.riverLevelM}m</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-amber-500/40">
                <span className="text-[9px] text-amber-400 block">{spatialChangeBeforeNow.timeframeNow}</span>
                <span className="text-sm font-bold text-amber-300">{spatialChangeBeforeNow.currentMetrics.floodExtentKm2} km²</span>
                <span className="text-[9px] text-amber-400/90 block">River: {spatialChangeBeforeNow.currentMetrics.riverLevelM}m</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">{spatialChangeBeforeNow.deltaDescription}</p>
          </div>
        </div>

        {/* SECTION 10: EVIDENCE CONTRIBUTING TO ASSESSMENT */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Evidence Contributing to Assessment
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">{contributingLayers.length} Feeds Active</span>
          </div>

          <div className="space-y-1.5">
            {contributingLayers.map((layer) => (
              <div
                key={layer.layerId}
                className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{layer.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
                      <span>{layer.layerName}</span>
                      <span className={`text-[8px] font-mono px-1 rounded uppercase font-bold ${
                        layer.sourceType === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {layer.sourceType}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      {layer.sourceName} • {layer.freshness}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-white">{layer.measurementValue}</div>
                  <button
                    onClick={() => onHighlightFeature(layer.mapHighlightKey)}
                    className="text-[9px] text-amber-400 hover:underline flex items-center gap-0.5 justify-end"
                  >
                    <span>Highlight</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
            className="w-full mt-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded text-[10px] font-bold flex items-center justify-center space-x-1 transition-all"
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>{showEvidenceDrawer ? 'Hide Deep Scientific Evidence' : '🔬 Show Scientific Provenance & Models'}</span>
          </button>

          {/* Deep Scientific Evidence Drawer */}
          {showEvidenceDrawer && (
            <div className="bg-slate-900 border border-cyan-800/80 rounded-lg p-3 space-y-2 text-xs font-mono animate-fadeIn">
              <div className="text-[10px] uppercase font-bold text-cyan-400 border-b border-cyan-900/60 pb-1">
                Scientific Observation & Calibration Provenance
              </div>
              <div className="space-y-1 text-[10px] text-slate-300">
                <div><strong>Source:</strong> {scientificEvidence.observation.source}</div>
                <div><strong>Station Code:</strong> {scientificEvidence.observation.stationCode}</div>
                <div><strong>Measurement:</strong> {scientificEvidence.observation.value} {scientificEvidence.observation.unit}</div>
                <div><strong>Calibration Datum:</strong> {scientificEvidence.observation.calibrationDatum}</div>
              </div>

              <div className="text-[10px] uppercase font-bold text-cyan-400 border-b border-cyan-900/60 pb-1 pt-1">
                Derived Hydrodynamic Model
              </div>
              <div className="space-y-1 text-[10px] text-slate-300">
                <div><strong>Processing:</strong> {scientificEvidence.derivedData.processingMethod}</div>
                <div><strong>Model Engine:</strong> {scientificEvidence.derivedData.model} ({scientificEvidence.derivedData.version})</div>
                <div><strong>Resolution:</strong> {scientificEvidence.derivedData.resolution}</div>
              </div>

              <div className="text-[10px] uppercase font-bold text-cyan-400 border-b border-cyan-900/60 pb-1 pt-1">
                Risk Engine & Statutory Mandate
              </div>
              <div className="space-y-1 text-[10px] text-slate-300">
                <div><strong>Standard:</strong> {scientificEvidence.riskAssessment.governingStandard}</div>
                <div><strong>Thresholds:</strong> {scientificEvidence.riskAssessment.appliedThresholds}</div>
                <div><strong>Confidence:</strong> {scientificEvidence.riskAssessment.confidenceGrade}</div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 13: NEARBY CRITICAL INFRASTRUCTURE */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Nearby Critical Infrastructure ({nearbyAssets.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Radius: {selectedRadiusKm}km</span>
          </div>

          {nearbyAssets.length === 0 ? (
            <div className="text-[11px] text-slate-500 text-center py-3 bg-slate-900/40 rounded-lg">
              No critical infrastructure located within {selectedRadiusKm}km radius. Expand context radius to 25km or 50km.
            </div>
          ) : (
            <div className="space-y-2">
              {nearbyAssets.slice(0, 4).map((item) => (
                <div
                  key={item.asset.id}
                  className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-200 text-[11px] flex items-center gap-1">
                        <span>{item.asset.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Distance: <strong className="text-white">{item.distanceKm} km</strong> • FFE: {item.asset.finishedFloorElevation}m MSL
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold ${
                      item.situationSeverity === 'danger'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : item.situationSeverity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : item.situationSeverity === 'monitoring'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {item.situation}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    {item.powerDependency}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <button
                      onClick={() => onHighlightFeature('asset', item.asset)}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Show on Map</span>
                    </button>

                    {onSelectAssetForAudit && (
                      <button
                        onClick={() => onSelectAssetForAudit(item.asset)}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Audit Asset →</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 14: CASCADING IMPACT GRAPH ("What could this affect?") */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              What could this affect?
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Cascading Dependencies</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {cascadingImpacts.map((node, idx) => {
              const isSelected = selectedCascadeNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedCascadeNode(isSelected ? null : node)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{idx + 1}.</span>
                      <span>{node.name}</span>
                    </span>
                    <span className={`text-[9px] font-mono px-1 rounded uppercase font-semibold ${
                      node.status === 'disrupted' || node.status === 'isolated'
                        ? 'bg-red-500/20 text-red-300'
                        : node.status === 'threatened'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {node.statusLabel}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-300 animate-fadeIn">
                      <div><strong>Trigger:</strong> {node.triggerDescription}</div>
                      <div><strong>Impact:</strong> {node.consequenceDescription}</div>
                      <div className="flex justify-between text-slate-400 font-mono pt-1">
                        <span>Confidence: {node.confidencePct}%</span>
                        <span>Model: {node.modelSource}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 15: WHAT MAY HAPPEN NEXT? (Forecast Timeline + Uncertainty) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              🔮 What may happen next?
            </span>
            <span className="text-[10px] text-slate-400 font-mono">24h Hydrological Horizon</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
            {forecastTimeline.map((step) => (
              <div
                key={step.timeStep}
                className={`p-1.5 rounded border transition-colors ${
                  step.isDanger
                    ? 'bg-red-950/40 border-red-800/80 text-red-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[9px] font-bold text-slate-400">{step.timeStep}</div>
                <div className="text-[10px] text-slate-500">{step.timestamp}</div>
                <div className="text-[11px] font-bold mt-1 text-cyan-300">
                  {step.riverLevelM ? `${step.riverLevelM}m` : `+${step.rainfallMm}mm`}
                </div>
                <div className="text-[8px] text-amber-300/90">{step.probabilityExceedancePct}% prob</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 p-2 rounded text-[10px] text-slate-400 flex items-center justify-between">
            <span>Peak Hydro-Crest Window: <strong>00:30 IST (+6h)</strong></span>
            <span className="font-mono text-amber-300">Uncertainty: ±0.28m</span>
          </div>
        </div>

        {/* SECTION 16: SCENARIO MODE ("What if?") */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              What If? (Scenario Mode)
            </span>
            <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
              SCENARIO — NOT A PREDICTION
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Rainfall Adjustment:</span>
                <span className="font-mono font-bold text-amber-400">
                  {scenarioRainMultiplier === 1.0 ? 'Baseline (0%)' : `+${Math.round((scenarioRainMultiplier - 1) * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.5"
                step="0.1"
                value={scenarioRainMultiplier}
                onChange={(e) => setScenarioRainMultiplier(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Surge Level Adjustment:</span>
                <span className="font-mono font-bold text-cyan-400">+{scenarioSurgeDeltaM.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.2"
                value={scenarioSurgeDeltaM}
                onChange={(e) => setScenarioSurgeDeltaM(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded cursor-pointer mt-1"
              />
            </div>

            {/* Scenario Result Preview */}
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated 24h Rain:</span>
                <span className="font-mono text-white font-bold">{scenarioRainResult} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated Coastal Surge:</span>
                <span className="font-mono text-cyan-400 font-bold">+{scenarioSurgeResult} m MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Exposed Assets:</span>
                <span className="font-mono text-red-400 font-bold">{scenarioEstimatedExposedAssets} assets at risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 17: AI EXPLANATION (3 TIERS) */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              🧠 Explain This Area
            </span>

            {/* 3-Level Toggle */}
            <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex text-[10px]">
              <button
                onClick={() => setAiLevel('simple')}
                className={`px-2 py-0.5 rounded ${aiLevel === 'simple' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Simple
              </button>
              <button
                onClick={() => setAiLevel('detailed')}
                className={`px-2 py-0.5 rounded ${aiLevel === 'detailed' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Detailed
              </button>
              <button
                onClick={() => setAiLevel('expert')}
                className={`px-2 py-0.5 rounded ${aiLevel === 'expert' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Expert
              </button>
            </div>
          </div>

          {aiLevel === 'simple' && (
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              "{aiExplanations.simple}"
            </p>
          )}

          {aiLevel === 'detailed' && (
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80 space-y-1.5 text-[11px] text-slate-300 leading-snug">
              <div><strong className="text-amber-300">Rainfall:</strong> {aiExplanations.detailed.rainfall}</div>
              <div><strong className="text-cyan-300">River Stage:</strong> {aiExplanations.detailed.river}</div>
              <div><strong className="text-slate-300">Terrain:</strong> {aiExplanations.detailed.terrain}</div>
              <div><strong className="text-purple-300">Lifelines:</strong> {aiExplanations.detailed.infrastructure}</div>
              <div><strong className="text-emerald-300">Outlook:</strong> {aiExplanations.detailed.forecast}</div>
            </div>
          )}

          {aiLevel === 'expert' && (
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80 space-y-1.5 text-[10px] font-mono text-slate-300">
              <div><strong className="text-cyan-300">Measurements:</strong> {aiExplanations.expert.measurements}</div>
              <div><strong className="text-amber-300">Thresholds:</strong> {aiExplanations.expert.thresholds}</div>
              <div><strong className="text-purple-300">Models:</strong> {aiExplanations.expert.models}</div>
              <div><strong className="text-emerald-300">Confidence:</strong> {aiExplanations.expert.confidence}</div>
              <div><strong className="text-slate-400">Provenance:</strong> {aiExplanations.expert.provenance}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
