import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
  FileText,
  FileCode2,
  Terminal,
  Layers,
  Flame
} from 'lucide-react';
import {
  ComponentCertificationResult,
  ComponentCertificationRequest
} from '../../services/validationRegistryService';
import { useRegistry } from '../../context/RegistryProvider';
import { RegistrySchemaValidatorPanel } from './RegistrySchemaValidatorPanel';
import { AdversarialVerificationPanel } from './AdversarialVerificationPanel';
import { OperationalReadinessPackPanel } from './OperationalReadinessPackPanel';
import { ShadowEventRecorder } from './ShadowEventRecorder';

export const ValidationRegistryExplorer: React.FC = () => {
  const {
    stats,
    matrixRows,
    authorities,
    filteredMatrixRows,
    filterOptions,
    setFilterOptions,
    certifyComponent,
    clearCertificate,
    activeCertificate,
    exportDossierMarkdown,
    downloadDossier,
    downloadJsonSchema
  } = useRegistry();

  const [activeViewMode, setActiveViewMode] = useState<'subsystems' | 'schema_validator' | 'adversarial_suite' | 'readiness_pack' | 'shadow_recorder'>('shadow_recorder');

  // Interactive Certification Harness State
  const [certComponentId, setCertComponentId] = useState<string>('cea_substation_clearance');
  const [floodDepthInput, setFloodDepthInput] = useState<number>(0.12);
  const [overtoppingRatioInput, setOvertoppingRatioInput] = useState<number>(0.75);
  const [alertCharsInput, setAlertCharsInput] = useState<number>(142);

  // Run certification on active parameters
  const handleRunCertification = () => {
    const req: ComponentCertificationRequest = {
      componentId: certComponentId,
      operationalParameters: {
        floodDepthMeters: floodDepthInput,
        culvertOvertoppingRatio: overtoppingRatioInput,
        alertCharLength: alertCharsInput,
        finishedFloorElevationMeters: 3.2,
        highFloodLevel100YrM: 2.8,
        alertLanguageCode: 'or'
      }
    };
    certifyComponent(req);
  };

  // Export JSON
  const handleExportJson = () => {
    const payload = {
      registryTitle: 'GeoShield India v1.0 Master Statutory Validation Registry',
      version: '1.0.0-PROD',
      stats,
      validationMatrix: matrixRows,
      authorities,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geoshield_india_validation_registry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Markdown Dossier
  const handleExportMarkdown = () => {
    downloadDossier();
  };

  const categories = [
    'ALL',
    'METEOROLOGY',
    'OCEAN_SURGE',
    'RIVERINE_HYDROLOGY',
    'EARTH_OBSERVATION',
    'ELECTRICAL_LIFELINES',
    'TRANSPORT_LIFELINES',
    'DISASTER_ALERTING',
    'EVACUATION_GOVERNANCE',
    'AI_INFERENCE'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Executive Statistics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono text-xs font-bold">
                REGISTRY SPECIFICATION v1.0
              </span>
              <span className="text-xs text-slate-500 font-mono">STATUS: OPERATIONAL & SEALED</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              GeoShield India v1.0 Validation Registry
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Statutory source-of-truth mapping all computational hazard engines, engineering vulnerability criteria,
              and early warning dispatches to official Government of India authorities, Gazette regulations, and BIS standards.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-all shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Registry (JSON)</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Statutory Dossier (.MD)</span>
            </button>
          </div>
        </div>

        {/* Live Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">COMPLIANCE RATIO</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-emerald-400 font-bold text-lg font-mono">{stats.compliancePercentage}%</span>
              <span className="text-[10px] text-slate-500">Verified</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">CERTIFIED SUBSYSTEMS</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-emerald-400 font-bold text-lg font-mono">{stats.verifiedComponents}</span>
              <span className="text-[10px] text-slate-500">/ {stats.totalMatrixComponents}</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">CONTROLLED BOUNDARY</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-amber-400 font-bold text-lg font-mono">{stats.needsValidationComponents}</span>
              <span className="text-[10px] text-slate-500">Needs Validation</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">OFFICIAL AUTHORITIES</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-blue-400 font-bold text-lg font-mono">{stats.totalAuthorities}</span>
              <span className="text-[10px] text-slate-500">Agencies</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">SCHEDULE 8 LANGUAGES</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-indigo-400 font-bold text-lg font-mono">{stats.totalSchedule8Languages}</span>
              <span className="text-[10px] text-slate-500">Native Scripts</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">INTEGRITY CHECKSUM</span>
            <div className="mt-0.5">
              <span className="text-slate-300 font-mono text-[10px] truncate block" title={stats.registryIntegrityHash}>
                {stats.registryIntegrityHash.slice(0, 14)}...
              </span>
              <span className="text-[9px] text-emerald-500 font-bold">SHA-256 SECURED</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: Subsystems Matrix vs Schema & Validation Validator */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          id="tab-shadow-event-recorder"
          onClick={() => setActiveViewMode('shadow_recorder')}
          className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeViewMode === 'shadow_recorder'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>ShadowEventRecorder &amp; Live Comparator (Phase 8)</span>
        </button>

        <button
          id="tab-readiness-certification-pack"
          onClick={() => setActiveViewMode('readiness_pack')}
          className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeViewMode === 'readiness_pack'
              ? 'bg-sky-950/80 text-sky-300 border border-sky-500/60 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Operational Readiness Certification Pack (Phase 7)</span>
        </button>

        <button
          id="tab-adversarial-verification"
          onClick={() => setActiveViewMode('adversarial_suite')}
          className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeViewMode === 'adversarial_suite'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/60 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Adversarial Red-Team (Phase 6)</span>
        </button>

        <button
          onClick={() => setActiveViewMode('subsystems')}
          className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeViewMode === 'subsystems'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Subsystems Matrix &amp; Certifier (20 Rows)</span>
        </button>

        <button
          onClick={() => setActiveViewMode('schema_validator')}
          className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeViewMode === 'schema_validator'
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-emerald-400" />
          <span>Schema Validator Workbench</span>
        </button>
      </div>

      {activeViewMode === 'shadow_recorder' ? (
        <ShadowEventRecorder />
      ) : activeViewMode === 'readiness_pack' ? (
        <OperationalReadinessPackPanel />
      ) : activeViewMode === 'adversarial_suite' ? (
        <AdversarialVerificationPanel />
      ) : activeViewMode === 'schema_validator' ? (
        <RegistrySchemaValidatorPanel />
      ) : (
        <>
          {/* Interactive Operational Certification Harness */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Interactive Component Statutory Certification Inspector
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Test live operational conditions against governing statutory standards
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Select Operational Component / Standard:</label>
              <select
                value={certComponentId}
                onChange={(e) => {
                  setCertComponentId(e.target.value);
                  clearCertificate();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="cea_substation_clearance">
                  OPTCL Substation — CEA Reg 44(3A) Flood De-energization (0.30m)
                </option>
                <option value="morth_road_overtopping">
                  Highway Corridor NH-316 — MoRTH Section 300 Culvert Overtopping
                </option>
                <option value="ndma_sachet_cap">
                  NDMA SACHET CAP — 160-Char Single SMS Length Boundary
                </option>
                <option value="incois_storm_surge">
                  INCOIS ADCIRC — Coastal Surge & Wave Radiation Stress Setup
                </option>
                <option value="imd_cyclone_track">
                  IMD RSMC — Tropical Cyclone Classification & Wind Track
                </option>
              </select>
            </div>

            {/* Dynamic Slider 1: Inundation Depth */}
            {(certComponentId === 'cea_substation_clearance' || certComponentId === 'morth_road_overtopping') && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Flood Inundation Depth:</span>
                  <span className="font-mono font-bold text-emerald-400">{floodDepthInput.toFixed(2)} meters</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={floodDepthInput}
                  onChange={(e) => setFloodDepthInput(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.00m (Dry)</span>
                  <span className="text-amber-400">0.30m (CEA Reg 44(3A) Trip Limit)</span>
                  <span>1.00m (Severe Submergence)</span>
                </div>
              </div>
            )}

            {/* Dynamic Slider 2: Culvert Overtopping Ratio */}
            {certComponentId === 'morth_road_overtopping' && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Culvert Discharge Ratio (Q / Q_cap):</span>
                  <span className="font-mono font-bold text-amber-400">{overtoppingRatioInput.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.05"
                  value={overtoppingRatioInput}
                  onChange={(e) => setOvertoppingRatioInput(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.2x (Clear)</span>
                  <span className="text-red-400">1.0x (Culvert Surcharge)</span>
                  <span>2.0x (Violent Overwash)</span>
                </div>
              </div>
            )}

            {/* Dynamic Slider 3: Alert Character Length */}
            {certComponentId === 'ndma_sachet_cap' && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Alert Payload Length:</span>
                  <span className="font-mono font-bold text-indigo-400">{alertCharsInput} characters</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="220"
                  step="2"
                  value={alertCharsInput}
                  onChange={(e) => setAlertCharsInput(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>80 chars</span>
                  <span className="text-emerald-400">160 chars (Single SMS Boundary)</span>
                  <span className="text-red-400">220 chars (Multi-part SMS)</span>
                </div>
              </div>
            )}

            <button
              onClick={handleRunCertification}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Registry Certification Audit</span>
            </button>
          </div>

          {/* Certificate Result Column */}
          <div className="lg:col-span-7">
            {activeCertificate ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500">CERTIFICATE NO:</span>
                    <span className="font-bold text-white">{activeCertificate.certificateId}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeCertificate.status === 'CERTIFIED_COMPLIANT'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : activeCertificate.status === 'CONDITIONAL_PASS'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {activeCertificate.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-500">Component: </span>
                    <span className="text-slate-200 font-bold">{activeCertificate.componentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Governing Standard: </span>
                    <span className="text-amber-300 font-semibold">{activeCertificate.governingClause}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Statutory Authority: </span>
                    <span className="text-blue-400">{activeCertificate.authority}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                  <span className="text-slate-400 block font-sans font-bold">Audit Verdict:</span>
                  <p className="text-slate-200 font-sans leading-relaxed">{activeCertificate.verdictSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block">SAFETY MARGIN:</span>
                    <span className="text-emerald-400 font-bold">{activeCertificate.marginOfSafety}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block">VERIFIED BY:</span>
                    <span className="text-slate-300 truncate block">{activeCertificate.verifiedBy}</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] space-y-0.5">
                  <span className="text-slate-500 block font-sans">Mandatory Action Protocol:</span>
                  <p className="text-amber-200 font-sans">{activeCertificate.recommendation}</p>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-900">
                  <span>Sign: <code className="text-slate-400">{activeCertificate.cryptographicSignature.slice(0, 32)}...</code></span>
                  <span>{new Date(activeCertificate.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[220px] bg-slate-950/60 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-xs text-slate-500 space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-700" />
                <p>Adjust operational parameters on the left and click <strong>&quot;Run Registry Certification Audit&quot;</strong> to evaluate statutory compliance.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Registry Browser */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search components, authorities, standards, or failure modes..."
              value={filterOptions.searchQuery}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={filterOptions.status}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, status: e.target.value }))}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">VERIFIED Only (17)</option>
              <option value="NEEDS_VALIDATION">NEEDS VALIDATION (3)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterOptions(prev => ({ ...prev, category: cat }))}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap transition-all ${
                filterOptions.category === cat
                  ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-500/50'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Rows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatrixRows.map((row) => (
          <div
            key={row.rowId}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                    Row {row.rowId} • {row.category}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight mt-1">{row.component}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                    row.status === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {row.status}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-slate-200">{row.officialAuthority}</span>
                </div>
                <div className="text-[11px] text-amber-300 font-mono">
                  {row.statutoryStandard}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-850">
                <div>
                  <span className="text-slate-500 block text-[9px]">SPATIAL RES:</span>
                  <span className="text-slate-300">{row.spatialResolution}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">TEMPORAL CADENCE:</span>
                  <span className="text-slate-300">{row.temporalCadence}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded border border-slate-800 space-y-1">
                <div className="text-slate-500 text-[10px] font-mono uppercase">Dominant Physical Uncertainty:</div>
                <p className="text-slate-300 leading-snug">{row.dominantUncertainty}</p>
              </div>

              <div className="text-[11px] text-red-300 bg-red-950/20 p-2.5 rounded border border-red-900/40 space-y-1">
                <div className="text-red-400 text-[10px] font-mono uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Failure Mode If Breached:
                </div>
                <p className="text-red-200 leading-snug">{row.failureCondition}</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Fallback: <strong className="text-slate-300">{row.fallbackSource}</strong></span>
              <span className="text-emerald-400 font-bold">{row.status === 'VERIFIED' ? '100% AUDITED' : 'IN REVIEW'}</span>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};
