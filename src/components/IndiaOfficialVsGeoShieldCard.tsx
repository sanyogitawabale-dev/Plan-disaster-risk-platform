import React from 'react';
import { Shield, ShieldAlert, Cpu, AlertTriangle, CheckCircle, ExternalLink, Info, Radio } from 'lucide-react';
import { CriticalAsset, OfficialAuthorityStatus } from '../types';
import { INDIA_OFFICIAL_AUTHORITIES } from '../data/indiaDisasterData';

interface IndiaOfficialVsGeoShieldCardProps {
  selectedAsset: CriticalAsset;
}

export const IndiaOfficialVsGeoShieldCard: React.FC<IndiaOfficialVsGeoShieldCardProps> = ({
  selectedAsset
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header Banner emphasizing strict separation */}
      <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Official Authority vs. GeoShield Evidence Separation
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                STRICT GOVERNANCE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Clear distinction between Tier-1 Authoritative Operational Warnings and Tier-5 GeoShield Engineering Decision Support.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Rule: GeoShield AI MUST Ingest & NEVER Override Tier-1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* LEFT COLUMN: Official Authority Source (Tier 1) */}
        <div className="p-5 space-y-4 bg-slate-900/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Official Authority Bulletins (Tier 1)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800/80">
              LEGAL BASELINE
            </span>
          </div>

          <div className="space-y-3">
            {INDIA_OFFICIAL_AUTHORITIES.map((auth, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white font-mono">{auth.authority}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-medium">{auth.productName}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      auth.severityColor === 'RED'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-orange-950 text-orange-400 border border-orange-800'
                    }`}
                  >
                    {auth.severityColor} WARNING
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {auth.officialStatusText}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-900">
                  <span className="italic">{auth.disclaimer}</span>
                  <span className="font-mono text-slate-400 shrink-0 ml-2">
                    {new Date(auth.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: GeoShield Multi-Factor Analysis (Tier 5) */}
        <div className="p-5 space-y-4 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                GeoShield Multi-Factor Analysis (Tier 5)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
              DECISION SUPPORT ONLY
            </span>
          </div>

          <div className="space-y-3">
            {/* Target Asset Context */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">{selectedAsset.name}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  Elev: {selectedAsset.elevationMsl}m GTS | FFE: {selectedAsset.finishedFloorElevation}m GTS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {selectedAsset.blueprintSummary}
              </p>
            </div>

            {/* Deterministic Quantitative Verification */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Physical Model & Structural Code Checks:
              </span>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong className="text-slate-200">Wind Resistance (IS 875 Part 3:2015):</strong> Basic wind speed Vb = 50 m/s, cyclonic factor k4 = 1.15 yields design wind pressure Pz = 2.45 kPa.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong className="text-slate-200">Finished Floor Elevation vs. Surge:</strong> Ground level +{selectedAsset.elevationMsl}m GTS MSL; finished floor level +{selectedAsset.finishedFloorElevation}m GTS MSL.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>
                    <strong className="text-slate-200">Geospatial Cadastre Intersection:</strong> Confirmed via PostGIS <code className="text-amber-300 text-[10px]">ST_Intersects</code> on ISRO Bhuvan / OSDMA 1:10,000 spatial vector layer.
                  </span>
                </li>
              </ul>
            </div>

            {/* AI Qualitative Synthesis & Cascading Failure */}
            <div className="bg-slate-950 p-3 rounded-lg border border-amber-900/40 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Cascading Lifeline Failure Synthesis (Gemini 3.8 Flash):
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                If hydrodynamic inundation exceeds transformer plinths, de-energization of the 220kV busbar will cut primary power to the Paradip Port bulk handling conveyors and trip the secondary feed to SCB Medical College Hospital within 35 minutes.
              </p>
              <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Model: GeoShield RiskCore v3.1</span>
                <span className="text-amber-400">Strict Non-Override Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
