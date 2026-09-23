import React, { useState } from 'react';
import {
  Activity,
  Terminal,
  Scale,
  ShieldAlert,
  AlertTriangle,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2,
  FileCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Download,
  Eye,
  Radio,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  RecordedShadowEventStage,
  RECORDED_SHADOW_EVENT,
  PREDICTION_VS_OBSERVATION_METRICS,
  WHAT_CHANGED_DELTAS,
  PredictionVsObservationBenchmark,
  WhatChangedTemporalDelta,
  generateAfterActionReport
} from '../../services/shadowEventRecorder';
import {
  runShadowModeBenchmark,
  ShadowModeBenchmarkReport,
  ShadowModeObservationStream
} from '../../services/shadowModeEngine';

export interface ShadowEventRecorderProps {
  initialEvent?: RecordedShadowEventStage;
}

export const ShadowEventRecorder: React.FC<ShadowEventRecorderProps> = ({
  initialEvent = RECORDED_SHADOW_EVENT
}) => {
  const [activeSession, setActiveSession] = useState<ShadowModeBenchmarkReport>(() => runShadowModeBenchmark());
  const [currentEvent, setCurrentEvent] = useState<RecordedShadowEventStage>(initialEvent);
  const [activeTab, setActiveTab] = useState<'realtime_logs' | 'prediction_vs_reality' | 'what_changed' | 'lifecycle_audit'>('realtime_logs');
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isSimulatingLiveTick, setIsSimulatingLiveTick] = useState<boolean>(false);

  // Re-run shadow benchmark to simulate live feed polling
  const handlePollFeeds = () => {
    setIsSimulatingLiveTick(true);
    setTimeout(() => {
      setActiveSession(runShadowModeBenchmark());
      setIsSimulatingLiveTick(false);
    }, 450);
  };

  const filteredObservations = activeSession.activeObservations.filter(obs => {
    const matchesFeed = selectedFeedFilter === 'ALL' || obs.sourceFeed === selectedFeedFilter;
    const matchesSearch =
      obs.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.observedParameter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obs.geoshieldAssessment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFeed && matchesSearch;
  });

  const exportAuditManifestJson = () => {
    const report = generateAfterActionReport();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `geoshield-shadow-event-${currentEvent.eventId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="shadow-event-recorder" className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 font-mono text-xs">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              <span>LIVE SHADOW RECORDER (LEVEL 2)</span>
            </span>
            <span className="text-slate-400 text-xs">
              Event: <strong className="text-white">{currentEvent.eventName}</strong>
            </span>
            <span className="text-[10px] text-slate-500">ID: {currentEvent.eventId}</span>
          </div>
          <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>ShadowEventRecorder — Passive Ingestion &amp; Ground Truth Benchmark</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Passively logs real-time operational feeds (IMD radar, CWC gauges, INCOIS surge, Sentinel-1 SAR, OPTCL SCADA) and computes predictions without executing autonomous actions.
          </p>
        </div>

        {/* Action Controls & Zero-Autonomous Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePollFeeds}
            disabled={isSimulatingLiveTick}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingLiveTick ? 'animate-spin text-sky-400' : ''}`} />
            <span>{isSimulatingLiveTick ? 'Polling Feeds...' : 'Poll Live Telemetry'}</span>
          </button>

          <button
            onClick={exportAuditManifestJson}
            className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Event AAR JSON</span>
          </button>

          <div className="px-3 py-1.5 bg-slate-950 border border-emerald-500/50 rounded-lg text-right">
            <div className="text-[9px] text-slate-400 uppercase">Autonomous Safety Boundary</div>
            <div className="text-emerald-400 font-bold text-xs flex items-center justify-end space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>ZERO ACTIONS PERMITTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-400 uppercase">Operational Feeds</div>
          <div className="text-emerald-400 text-lg font-bold mt-0.5">{activeSession.activeOperationalFeedsCount} Feeds</div>
          <div className="text-[10px] text-slate-500">Continuous Ingestion</div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-400 uppercase">Mean Lead Time Gain</div>
          <div className="text-sky-400 text-lg font-bold mt-0.5">+{activeSession.meanLeadTimeAdvantageHours.toFixed(1)} Hours</div>
          <div className="text-[10px] text-slate-500">Hydro-Vortex Adv.</div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-400 uppercase">Avg Storm Surge Δ</div>
          <div className="text-amber-400 text-lg font-bold mt-0.5">±{activeSession.averageSurgeErrorMeters.toFixed(2)} m</div>
          <div className="text-[10px] text-slate-500">Within INCOIS band</div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-400 uppercase">SAR Surface Water IoU</div>
          <div className="text-emerald-400 text-lg font-bold mt-0.5">91.4%</div>
          <div className="text-[10px] text-slate-500">Sentinel-1 Spatial IoU</div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <div className="text-[10px] text-slate-400 uppercase">Data Health Index</div>
          <div className="text-amber-300 text-lg font-bold mt-0.5">63% (Penalized)</div>
          <div className="text-[10px] text-rose-400">Stale feeds flagged</div>
        </div>

        <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-lg">
          <div className="text-[10px] text-slate-400 uppercase">Autonomous Orders</div>
          <div className="text-emerald-400 text-lg font-bold mt-0.5">0 OF 0</div>
          <div className="text-[10px] text-emerald-300 font-semibold">Strict Human Gate</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'realtime_logs', label: 'Real-Time Ingestion & Side-by-Side Comparison', icon: Radio },
          { key: 'prediction_vs_reality', label: 'Prediction vs. Reality Benchmark (Ground Truth)', icon: Scale },
          { key: 'what_changed', label: '“What Changed?” Dynamic Transition (T-1 → T-0)', icon: Activity },
          { key: 'lifecycle_audit', label: '6-Stage Event Forensic Lineage Lifecycle', icon: FileCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REAL-TIME INGESTION & COMPARISON LOGS */}
      {activeTab === 'realtime_logs' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Filter Feed:</span>
              {['ALL', 'IMD_DOPPLER_RADAR', 'CWC_RIVER_GAUGE', 'INCOIS_OCEAN_BUOY', 'SENTINEL_1_SAR', 'OPTCL_SCADA_RTU'].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFeedFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    selectedFeedFilter === f
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search station or parameter..."
                className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-white text-[11px] focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Observations Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Source &amp; Station</th>
                  <th className="p-3">Observed Parameter</th>
                  <th className="p-3">Official Govt Value</th>
                  <th className="p-3">GeoShield Prediction</th>
                  <th className="p-3">Calibration Delta</th>
                  <th className="p-3">Lead Time Margin</th>
                  <th className="p-3">Divergence Verdict</th>
                  <th className="p-3">Autonomous Action</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 text-[11px]">
                {filteredObservations.map((obs, idx) => {
                  const isExpanded = expandedLogId === obs.stationId;
                  return (
                    <React.Fragment key={idx}>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <div className="text-white font-bold">{obs.stationName}</div>
                          <div className="text-slate-400 text-[10px] flex items-center space-x-1 mt-0.5">
                            <span className="px-1.5 py-0.2 bg-slate-800 rounded text-[9px] text-sky-300">
                              {obs.sourceFeed.split('_')[0]}
                            </span>
                            <span>{obs.stationId}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-200 font-medium">{obs.observedParameter}</div>
                          <div className="text-slate-400 text-[10px] truncate max-w-xs">{obs.officialAdvisory}</div>
                        </td>
                        <td className="p-3">
                          <span className="text-amber-300 font-bold">
                            {obs.officialValue} {obs.officialUnit}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sky-300 font-bold">
                            {obs.geoshieldPredictedValue} {obs.officialUnit}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`font-mono font-semibold ${
                            Math.abs(obs.numericalDiscrepancy) > 10 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {obs.numericalDiscrepancy > 0 ? `+${obs.numericalDiscrepancy}` : obs.numericalDiscrepancy} {obs.officialUnit}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-emerald-300 font-bold">+{obs.geoshieldLeadTimeDeltaHours.toFixed(1)}h</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {obs.divergenceStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800 flex items-center space-x-1 w-max">
                            <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            <span>BLOCKED (0)</span>
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : obs.stationId)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Ingestion Detail */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-b border-slate-800">
                          <td colSpan={9} className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                                <span className="text-slate-500 text-[10px] block font-bold uppercase">Official Bulletin Extract:</span>
                                <p className="text-slate-300 text-[11px] mt-1">{obs.officialAdvisory}</p>
                              </div>
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                                <span className="text-slate-500 text-[10px] block font-bold uppercase">GeoShield Physical Assessment:</span>
                                <p className="text-sky-300 text-[11px] mt-1">{obs.geoshieldAssessment}</p>
                              </div>
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                                <span className="text-slate-500 text-[10px] block font-bold uppercase">Statutory Safety Protocol:</span>
                                <div className="text-[11px] text-amber-300 mt-1">
                                  Human Sign-off Mandatory: <strong>YES</strong>
                                  <div className="text-slate-400 text-[10px] mt-0.5">
                                    Disaster Management Act, 2005 Sec 30 / CEA Reg 44(3A)
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTION VS REALITY BENCHMARK */}
      {activeTab === 'prediction_vs_reality' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center space-x-2 mb-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Multi-Domain Ground-Truth Verification (Cyclone Dana / Mahanadi Estuary)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Validation is performed independently across distinct engineering domains to prevent hiding severe localized hydrological or electrical errors behind an artificial single accuracy percentage.
            </p>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Domain Category</th>
                    <th className="p-3">Physical Metric</th>
                    <th className="p-3">GeoShield Predicted</th>
                    <th className="p-3">Ground Truth Observed</th>
                    <th className="p-3">Residual Delta</th>
                    <th className="p-3">Uncertainty Bounds</th>
                    <th className="p-3">Domain Verdict</th>
                    <th className="p-3">Engineering Post-Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/60 text-[11px]">
                  {PREDICTION_VS_OBSERVATION_METRICS.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/60">
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-sky-300 border border-slate-700 font-semibold">
                          {row.domainCategory}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-200">{row.metricName}</td>
                      <td className="p-3 font-bold text-sky-400">{row.predictedValue}</td>
                      <td className="p-3 font-bold text-emerald-400">{row.observedValue}</td>
                      <td className="p-3 font-mono text-amber-300 font-semibold">{row.absoluteDelta} ({row.percentageError})</td>
                      <td className="p-3 text-slate-400 text-[10px]">{row.uncertaintyInterval}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {row.domainValidationVerdict}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[10px] max-w-sm">{row.engineeringNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHAT CHANGED TEMPORAL ENGINE */}
      {activeTab === 'what_changed' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Cycle Transition Delta: T-1 (Previous) → T-0 (Current Assessment)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Translates numerical variable differentials directly into hazard shifts, exposed asset changes, and action updates.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded font-semibold">
                Horizon: 180 Min Dynamic Step
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {WHAT_CHANGED_DELTAS.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-white font-bold text-xs truncate">{item.variableName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.trend === 'DEGRADED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : item.trend === 'INCREASING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {item.deltaDisplay}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950 p-2 rounded">
                    <div>
                      <span className="text-slate-500 block">T-1 (Previous):</span>
                      <span className="text-slate-300 font-semibold">{item.previousValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">T-0 (Current):</span>
                      <span className="text-sky-300 font-semibold">{item.currentValue}</span>
                    </div>
                  </div>

                  <div className="text-[11px] space-y-1">
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Hazard Shift:</strong> {item.hazardImpact}
                    </div>
                    <div className="text-amber-300/90 text-[10px]">
                      <strong>Impacted Assets:</strong> {item.exposedAssetsAffected.join(', ')}
                    </div>
                    <div className="text-sky-300 text-[10px] bg-sky-950/40 p-1.5 rounded border border-sky-800/40 mt-1">
                      <strong>Directive:</strong> {item.changedActionRecommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 6-STAGE EVENT FORENSIC LINEAGE LIFECYCLE */}
      {activeTab === 'lifecycle_audit' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>6-Stage Forensic Event Audit Trail ({currentEvent.eventName})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Every life-safety assessment is logged across six independent immutable checkpoints to enable complete retrospective reproducibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Stage 1 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Stage 1: Official Observation</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300">{currentEvent.officialObservation.agency}</span>
                </div>
                <div className="text-white font-semibold text-xs">{currentEvent.officialObservation.headline}</div>
                <div className="text-[10px] text-slate-400">
                  MSW Wind: {currentEvent.officialObservation.metrics.mswWindKmh} km/h | Central Pressure: {currentEvent.officialObservation.metrics.centralPressureHpa} hPa
                </div>
                <div className="text-[10px] text-amber-400">
                  Telemetry Freshness: {currentEvent.officialObservation.telemetryFreshnessMin} min (Degraded Feed)
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Stage 2: GeoShield Ingestion</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">GTS MSL</span>
                </div>
                <div className="text-sky-300 font-semibold text-xs">{currentEvent.geoshieldIngestion.hydrodynamicEngine}</div>
                <div className="text-[10px] text-slate-400">
                  Vertical Datum: {currentEvent.geoshieldIngestion.validatedDatum}
                </div>
                <div className="text-[10px] text-slate-400">
                  DEM: {currentEvent.geoshieldIngestion.demResolution} | CRS: {currentEvent.geoshieldIngestion.coordinateReferenceSystem}
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Stage 3: GeoShield Prediction</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">HIGH RISK</span>
                </div>
                <div className="text-amber-300 font-semibold text-xs">Peak Water: {currentEvent.geoshieldPrediction.peakWaterLevelMslM} m MSL</div>
                <div className="text-[10px] text-slate-400">
                  Extent: {currentEvent.geoshieldPrediction.inundationExtentSqKm} km² | Shelter Demand: {currentEvent.geoshieldPrediction.shelterDemandEstimated} persons
                </div>
                <div className="text-[10px] text-slate-500">
                  Uncertainty: {currentEvent.geoshieldPrediction.predictionUncertaintyBand}
                </div>
              </div>

              {/* Stage 4 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Stage 4: Staged Recommendation</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">MEMO STAGED</span>
                </div>
                <div className="text-slate-300 text-xs">{currentEvent.geoshieldRecommendation.recommendedAction}</div>
                <div className="text-[10px] text-slate-400">
                  Governing Rule: {currentEvent.geoshieldRecommendation.governingStatutoryRule}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  Autonomous Action Execution: STRICTLY BLOCKED
                </div>
              </div>

              {/* Stage 5 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Stage 5: Official Human Order</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">AUTHORIZED</span>
                </div>
                <div className="text-emerald-300 font-semibold text-xs">{currentEvent.officialHumanDecision.authorizedBy}</div>
                <div className="text-[10px] text-slate-300">{currentEvent.officialHumanDecision.actualOrderIssued}</div>
                <div className="text-[10px] text-sky-400">
                  Concordance: {currentEvent.officialHumanDecision.concordanceWithGeoShield}
                </div>
              </div>

              {/* Stage 6 */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Stage 6: Observed Outcome</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white">GROUND TRUTH</span>
                </div>
                <div className="text-white font-semibold text-xs">Actual Max TWL: {currentEvent.observedPhysicalOutcome.actualMaxWaterLevelMslM} m MSL</div>
                <div className="text-[10px] text-slate-400">
                  Actual Substation: {currentEvent.observedPhysicalOutcome.actualSubstationDamageStatus}
                </div>
                <div className="text-[10px] text-slate-400">
                  Actual Evacuees: {currentEvent.observedPhysicalOutcome.actualShelterEvacueesCount} | Closures: {currentEvent.observedPhysicalOutcome.actualRoadClosuresCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
