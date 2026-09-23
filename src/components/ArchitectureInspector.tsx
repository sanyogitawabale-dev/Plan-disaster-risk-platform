import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, Layers, Cpu, Radio, Database, HelpCircle, Check, Sparkles } from 'lucide-react';
import { ARCHITECTURE_COMPARISONS } from '../data/mockDisasterData';
import { ArchitectureComparisonItem } from '../types';

export const ArchitectureInspector: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'CRITICAL' | 'HIGH' | 'MODERATE'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredItems = selectedFilter === 'all'
    ? ARCHITECTURE_COMPARISONS
    : ARCHITECTURE_COMPARISONS.filter(item => item.flawSeverity === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Strategic Header & Technical Verdict */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Technical Architecture Audit & Scientific Defense
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
              Rigorous evaluation of the Maple County AI Automation Framework across physical climatology, radar remote sensing, deterministic spatial topology, and life-critical AI safety.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Architectural Status:</span>
            <span className="px-3 py-1 bg-red-950/80 text-red-400 border border-red-800/80 rounded-full font-mono text-xs font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>6 CRITICAL DEFECTS REDESIGNED</span>
            </span>
          </div>
        </div>

        {/* Executive Synthesis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-semibold block">
              The Fundamental Core Flaw
            </span>
            <h4 className="text-sm font-bold text-slate-100">Asking LLMs to Do Geometric Math</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prompting an LLM to visually overlay CAD drawings onto satellite hazard maps causes spatial hallucinations. Disaster risk calculation must be <strong>deterministic</strong> (PostGIS / GDAL for exact water depth above finished floors), reserving <strong>Gemini 3.8 Flash</strong> for qualitative engineering FMEA and contingency playbooks.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold block">
              The Climatological Flaw
            </span>
            <h4 className="text-sm font-bold text-slate-100">Using Historical ERA5 for Live Early Warnings</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ERA5 has a 5-day to 2-month latency (it is a retrospective reanalysis product, not a forecast). Real-time cyclone early warning requires low-latency <strong>ECMWF IFS Open Data + NOAA GFS / NHC track feeds</strong>, reserving ERA5 strictly for baseline 30-year return flood modeling.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
              The Remote Sensing Flaw
            </span>
            <h4 className="text-sm font-bold text-slate-100">Sentinel-1 SAR 6-to-12 Day Revisit Lag</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sentinel-1 C-band SAR cannot provide real-time landslide warnings hours before landfall due to orbital revisit gaps and rain/canopy attenuation. It must be paired with <strong>NASA GPM IMERG 30-minute rainfall accumulation</strong> and <strong>Infinite Slope Stability models (SHALSTAB)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Target Production Architecture Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Updated Defensible System Architecture & Dataflow Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {/* Layer 1: Ingestion */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Layer 1</span>
                <Database className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-2">Operational Multi-Sensor Data Ingestion</h4>
              <ul className="text-[11px] text-slate-400 space-y-1.5 leading-tight">
                <li>• <strong>NWP:</strong> ECMWF IFS (0.1°) + NOAA GFS (15-min streaming)</li>
                <li>• <strong>Tracks:</strong> NOAA NHC / JTWC storm surge cones</li>
                <li>• <strong>Terrain:</strong> Copernicus 30m DEM slope gradients</li>
                <li>• <strong>Moisture:</strong> GPM IMERG Early Run + InSAR baseline</li>
              </ul>
            </div>
            <span className="mt-3 text-[10px] text-blue-400/80 font-mono">Latency: &lt; 15 mins</span>
          </div>

          {/* Layer 2: Deterministic GIS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Layer 2</span>
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-2">Deterministic GIS & Physics Simulation</h4>
              <ul className="text-[11px] text-slate-400 space-y-1.5 leading-tight">
                <li>• <strong>PostGIS:</strong> Exact ST_Intersects & ST_Buffer</li>
                <li>• <strong>Hydrology:</strong> Net Inundation = Surge - FFE</li>
                <li>• <strong>Geotech:</strong> Infinite Slope Factor of Safety (FS)</li>
                <li>• <strong>Graph Network:</strong> Road cutoffs & N-1 grid dependency</li>
              </ul>
            </div>
            <span className="mt-3 text-[10px] text-amber-400/80 font-mono">Accuracy: 100% Deterministic</span>
          </div>

          {/* Layer 3: AI Reasoning */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Layer 3</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-2">Gemini 3.8 Flash FMEA & Engineering Synthesis</h4>
              <ul className="text-[11px] text-slate-400 space-y-1.5 leading-tight">
                <li>• <strong>Blueprint Parsing:</strong> Electrical clearances & FFE</li>
                <li>• <strong>FMEA:</strong> Submerged transformer arc flash failure</li>
                <li>• <strong>Lifeline Cascades:</strong> Hospital & water plant outages</li>
                <li>• <strong>Mitigation:</strong> ASCE 24 floodproofing playbooks</li>
              </ul>
            </div>
            <span className="mt-3 text-[10px] text-emerald-400/80 font-mono">Model: gemini-3.8-flash</span>
          </div>

          {/* Layer 4: Alerting */}
          <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Layer 4</span>
                <Radio className="w-4 h-4 text-red-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-2">OASIS CAP & Multi-Channel Broadcast</h4>
              <ul className="text-[11px] text-slate-400 space-y-1.5 leading-tight">
                <li>• <strong>Standard:</strong> OASIS CAP v1.2 / ITU-T X.1303</li>
                <li>• <strong>Official:</strong> Signed XML feeds for FEMA / IPAWS</li>
                <li>• <strong>Multilingual:</strong> English, Spanish, Hindi/Tagalog</li>
                <li>• <strong>Citizen:</strong> Twilio Cell Broadcast & WhatsApp</li>
              </ul>
            </div>
            <span className="mt-3 text-[10px] text-red-400/80 font-mono">Compliance: WMO / OASIS Standard</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Granular Flaw Analysis & Technical Substitutions
          </h3>

          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['all', 'CRITICAL', 'HIGH', 'MODERATE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  selectedFilter === filter
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden transition-all"
              >
                {/* Accordion Row */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      item.flawSeverity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                      item.flawSeverity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {item.flawSeverity}
                    </span>
                    <span className="font-bold text-slate-200 text-xs sm:text-sm">
                      {item.module}
                    </span>
                  </div>

                  <span className="text-xs text-amber-400 font-medium">
                    {isExpanded ? 'Collapse' : 'Inspect Defense'}
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/60 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {/* Original Proposal & Flaw */}
                      <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-3.5 space-y-2">
                        <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                          Original Proposal & Identified Defect:
                        </span>
                        <div className="text-slate-300 font-medium">{item.originalProposal}</div>
                        <div className="text-red-300 text-[11px] leading-relaxed bg-red-950/40 p-2.5 rounded border border-red-900/60">
                          <strong>Root Failure:</strong> {item.identifiedFlaw}
                        </div>
                      </div>

                      {/* Defensible Alternative */}
                      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3.5 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                          Defensible Production Architecture:
                        </span>
                        <div className="text-emerald-300 text-[11px] leading-relaxed">
                          {item.defensibleAlternative}
                        </div>
                      </div>
                    </div>

                    {/* Scientific Validation & Latency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-[11px]">
                      <div>
                        <strong className="text-slate-300 block mb-0.5">Scientific & Engineering Validation:</strong>
                        <p className="text-slate-400 leading-relaxed">{item.scientificValidation}</p>
                      </div>
                      <div>
                        <strong className="text-slate-300 block mb-0.5">Cost, Throughput & Latency Impact:</strong>
                        <p className="text-amber-400 leading-relaxed">{item.costLatencyImpact}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Questions for Stakeholder Sign-Off */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-3">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Key Architectural Questions for Project Stakeholder Sign-Off
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Before finalizing the deployment roadmap with municipal commissioners and civil infrastructure directors, address these 4 operational governance questions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">1. Finished Floor Elevation (FFE) Benchmark Survey:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Do municipal engineering departments possess verified NAVD88 vertical datum benchmarks for critical transformer pads, or must we ingest drone LiDAR / RTK GPS surveys during onboarding?
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">2. Grid De-Energization Authority & Protocol:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Can the automated platform issue recommended remote tripping commands directly to the SCADA grid operator, or does civil liability mandate human-in-the-loop dispatch with physical verification?
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">3. InSAR Deformation Baseline vs Real-time Slopes:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Will the district sponsor satellite corner reflectors or ground piezometers in the high-risk Pine Valley escarpment to calibrate Sentinel-1 radar phase coherence?
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">4. Official Common Alerting Protocol (CAP) Clearing:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Does the platform connect to FEMA IPAWS / Meteoalarm as an Originator (requiring digital X.509 certs), or purely as a municipal advisory relay for county EOC commissioners?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
