import React from 'react';
import {
  ShieldAlert,
  Radio,
  Sliders,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

export const ProvenanceAttributionTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800 rounded-full">
                GATE 9 AUDIT • PROVENANCE & ATTRIBUTION TAXONOMY
              </span>
              <span className="text-xs text-slate-400 font-mono">Disaster Operations UI Standard</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Information Provenance & Attribution Matrix
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              In high-stress disaster control rooms, visual ambiguity between an <strong>official government decree</strong> and an <strong>AI simulation</strong> can lead to catastrophic missteps.
              GeoShield enforces 5 distinct visual tiers with color-coded badges, distinct iconographies, and explicit watermark attributions.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-right flex-shrink-0">
            <span className="text-slate-500 block text-[10px]">GOVERNANCE PRINCIPLE</span>
            <span className="text-blue-400 font-bold text-sm">Zero Ambiguity</span>
            <span className="text-emerald-400 text-[10px] block mt-0.5">Strict Visual Partitioning</span>
          </div>
        </div>
      </div>

      {/* The 5-Tier Provenance Taxonomy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tier 1: Official Government Warning */}
        <div className="bg-slate-900 border-2 border-rose-500/80 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-400" />
              OFFICIAL GOVERNMENT WARNING
            </span>
            <span className="text-[10px] font-mono text-slate-400">TIER 1</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Statutory Authority Warning</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bulletins originated exclusively by IMD, CWC, INCOIS, or NDMA/OSDMA. GeoShield treats these as immutable boundary facts.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-rose-900/50 space-y-1.5 text-xs font-mono">
            <div className="text-[11px] text-rose-400 font-bold">LIVE SAMPLE WIDGET:</div>
            <div className="text-white font-bold">IMD Red Cyclone Warning • 175 km/h Gale</div>
            <div className="text-[10px] text-slate-400">Source: RSMC New Delhi Bulletin #14 (DWR Paradip)</div>
            <div className="text-[10px] text-emerald-400">Status: Legally Binding Statutory Directive</div>
          </div>
        </div>

        {/* Tier 2: GeoShield Simulated Hazard */}
        <div className="bg-slate-900 border-2 border-indigo-500/80 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-indigo-400" />
              GEOSHIELD SIMULATED HAZARD
            </span>
            <span className="text-[10px] font-mono text-slate-400">TIER 2</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Coupled Hydrodynamic Simulation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Physics engine outputs synthesizing wind vortex, astronomical tide, wave setup, and estuarine river discharge.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-indigo-900/50 space-y-1.5 text-xs font-mono">
            <div className="text-[11px] text-indigo-400 font-bold">LIVE SAMPLE WIDGET:</div>
            <div className="text-white font-bold">ADCIRC-2DDI + SWAN Coupled Surge: 3.4m GTS</div>
            <div className="text-[10px] text-slate-400">Model: Holland Vortex + HEC-RAS 2D (50m Mesh)</div>
            <div className="text-[10px] text-amber-400">Status: Mathematical Simulation (Uncertainty ±0.35m)</div>
          </div>
        </div>

        {/* Tier 3: GeoShield Asset Vulnerability Assessment */}
        <div className="bg-slate-900 border-2 border-amber-500/80 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              ASSET VULNERABILITY ASSESSMENT
            </span>
            <span className="text-[10px] font-mono text-slate-400">TIER 3</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Engineering Standard FMEA</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluates site-specific asset geometry against CEA Regulations, IS codes, IRC bridge scour, and inundation limits.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-amber-900/50 space-y-1.5 text-xs font-mono">
            <div className="text-[11px] text-amber-400 font-bold">LIVE SAMPLE WIDGET:</div>
            <div className="text-white font-bold">Substation 4B: Inundation Clearance 0.15m Remaining</div>
            <div className="text-[10px] text-slate-400">Rule: CEA 2026 Reg 44(3A) Inundation De-energization</div>
            <div className="text-[10px] text-rose-400">Status: Critical Engineering Cascade Alert</div>
          </div>
        </div>

        {/* Tier 4: GeoShield Recommended Action */}
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-400" />
              RECOMMENDED ADVISORY ACTION
            </span>
            <span className="text-[10px] font-mono text-slate-400">TIER 4</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">AI / Algorithmic Action Proposal</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Algorithmic recommendations for evacuation corridors, shelter allocation, and feeder load shedding. Non-binding until authorized.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/50 space-y-1.5 text-xs font-mono">
            <div className="text-[11px] text-emerald-400 font-bold">LIVE SAMPLE WIDGET:</div>
            <div className="text-white font-bold">Advise Rerouting Convoys via NH-16 Inland Loop</div>
            <div className="text-[10px] text-slate-400">Engine: GeoShield Multi-Criteria Evacuation Routing</div>
            <div className="text-[10px] text-slate-300">Status: Decision Support Proposal (Advisory Only)</div>
          </div>
        </div>

        {/* Tier 5: Human-Authorized Action */}
        <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-xl p-4 space-y-3 relative overflow-hidden md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-cyan-400" />
              HUMAN-AUTHORIZED STATUTORY ACTION
            </span>
            <span className="text-[10px] font-mono text-slate-400">TIER 5 (FINAL)</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Legally Signed Disaster Management Act Directive</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Directives reviewed and digitally signed by an authorized Indian government officer (Special Relief Commissioner / District Collector).
              Carries statutory weight under Section 30 of the Disaster Management Act, 2005.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-cyan-900/50 space-y-1.5 text-xs font-mono">
            <div className="text-[11px] text-cyan-400 font-bold">LIVE SIGNED ACTION AUDIT:</div>
            <div className="text-white font-bold">Order #SRC/OD/2026/CYC-09: Mandatory Coastal Evacuation Authorized</div>
            <div className="text-[10px] text-slate-400">Signatory: Special Relief Commissioner, Odisha (CCA Digital Signature SHA-256)</div>
            <div className="text-[10px] text-emerald-400">Dispatched To: SACHET Cell Broadcast, AIR FM, Police Wireless Network</div>
          </div>
        </div>
      </div>
    </div>
  );
};
