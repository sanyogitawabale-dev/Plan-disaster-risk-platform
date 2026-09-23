import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { CEA_SAFETY_REGULATION_FAMILY } from '../../config/geoShieldIndiaValidationRegistry';

export const CeaRegulatoryTab: React.FC = () => {
  const [selectedAmendment, setSelectedAmendment] = useState<number>(2026);
  const family = CEA_SAFETY_REGULATION_FAMILY;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800 rounded-full">
                GATE 2 AUDIT • REGULATORY EVOLUTION
              </span>
              <span className="text-xs text-slate-400 font-mono">Central Electricity Authority (CEA)</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              CEA Safety & Grid Regulation Family Specification
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              GeoShield models electrical regulations not as a static snapshot, but as a living statutory family.
              The base 2010 regulations were superseded by the comprehensive <strong>2023 revision</strong> and augmented by the <strong>2026 amendments</strong>,
              introducing explicit 300mm flood de-energization thresholds and 100-year High Flood Level (HFL) plinth norms.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-right flex-shrink-0">
            <span className="text-slate-500 block text-[10px]">CURRENT EFFECTIVE REVISION</span>
            <span className="text-amber-400 font-bold text-sm">2023 (Incorporating 2026)</span>
            <span className="text-emerald-400 text-[10px] block mt-0.5">✓ Gazetted & Operational</span>
          </div>
        </div>
      </div>

      {/* Regulation Evolution Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Statutory Evolution History (2010 → 2026)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Base 2010 */}
          <div
            onClick={() => setSelectedAmendment(2010)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAmendment === 2010
                ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-slate-400">BASE 2010</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">BASE ACT</span>
            </div>
            <h5 className="font-bold text-white text-sm">CEA Safety Regulations 2010</h5>
            <p className="text-[11px] text-slate-400 mt-1">Established general clearance distances and earthing requirements across generation, transmission, and distribution.</p>
          </div>

          {/* 2015 & 2018 Amendments */}
          <div
            onClick={() => setSelectedAmendment(2018)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAmendment === 2018
                ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-slate-400">2015 & 2018</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">AMENDMENT</span>
            </div>
            <h5 className="font-bold text-white text-sm">EHV & GIS Amendments</h5>
            <p className="text-[11px] text-slate-400 mt-1">Introduced Gas Insulated Substation (GIS) indoor clearances and EHV multi-circuit crossing heights over navigable rivers.</p>
          </div>

          {/* 2023 Comprehensive Revision */}
          <div
            onClick={() => setSelectedAmendment(2023)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAmendment === 2023
                ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-emerald-400">2023 REVISION</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">MAJOR</span>
            </div>
            <h5 className="font-bold text-white text-sm">CEA Safety Regulations 2023</h5>
            <p className="text-[11px] text-slate-400 mt-1">Comprehensive revision in Gazette No. 408. Substation plinth must be minimum 300mm above 100-year High Flood Level (HFL).</p>
          </div>

          {/* 2026 Amendment */}
          <div
            onClick={() => setSelectedAmendment(2026)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAmendment === 2026
                ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-amber-400">2026 AMENDMENT</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">CURRENT</span>
            </div>
            <h5 className="font-bold text-white text-sm">Regulation 44(3A) Inundation De-energization</h5>
            <p className="text-[11px] text-slate-400 mt-1">Mandates automatic and manual feeder isolation when water level reaches within 300mm of live plinth or busbar baseline.</p>
          </div>
        </div>

        {/* Selected Amendment Detail Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Selected Regulatory Focus: Year {selectedAmendment}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {family.amendments.find(a => a.year === selectedAmendment)?.gazetteNotification || 'Gazette of India Baseline'}
            </span>
          </div>

          <div className="text-xs space-y-2">
            <span className="text-slate-500 font-mono text-[10px] block uppercase">Key Substantive Clauses Applied in GeoShield:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(family.applicableClauses).map(([clause, description], idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-mono font-bold block text-[11px]">{clause}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
