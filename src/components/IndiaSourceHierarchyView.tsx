import React from 'react';
import { Layers, Shield, Database, Satellite, Cpu, Radio, CheckCircle, AlertOctagon } from 'lucide-react';
import { INDIA_SOURCE_HIERARCHY } from '../data/indiaDisasterData';

export const IndiaSourceHierarchyView: React.FC = () => {
  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1:
        return <Shield className="w-5 h-5 text-orange-400" />;
      case 2:
        return <Database className="w-5 h-5 text-blue-400" />;
      case 3:
        return <Satellite className="w-5 h-5 text-purple-400" />;
      case 4:
        return <Radio className="w-5 h-5 text-teal-400" />;
      default:
        return <Cpu className="w-5 h-5 text-amber-400" />;
    }
  };

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return 'bg-orange-950 text-orange-400 border-orange-800';
      case 2:
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 3:
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 4:
        return 'bg-teal-950 text-teal-400 border-teal-800';
      default:
        return 'bg-amber-950 text-amber-400 border-amber-800';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <Layers className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Authoritative Data Source Hierarchy & Non-Override Governance
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                GOVERNANCE COMPLIANT
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Systematized 5-tier architecture ensuring AI decision support never suppresses or overrides statutory government advisories.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
          <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
          <span>Statutory Override: <strong className="text-red-400">STRICTLY PROHIBITED</strong></span>
        </div>
      </div>

      {/* Tier Stack Cards */}
      <div className="space-y-4">
        {INDIA_SOURCE_HIERARCHY.map((tier) => (
          <div
            key={tier.tierNumber}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {getTierIcon(tier.tierNumber)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{tier.tierName}</h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block mt-0.5 ${getTierBadge(tier.tierNumber)}`}>
                    {tier.tierNumber === 1
                      ? 'AUTHORITATIVE BASELINE'
                      : tier.tierNumber === 2
                      ? 'OFFICIAL SPATIAL GROUND TRUTH'
                      : tier.tierNumber === 3
                      ? 'SCIENTIFIC FORCING'
                      : tier.tierNumber === 4
                      ? 'EMPIRICAL FIELD TELEMETRY'
                      : 'AI DECISION SUPPORT ONLY'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono flex items-center space-x-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Can Override Official Warnings: </span>
                <strong className={tier.canOverrideOfficialWarnings ? 'text-red-400' : 'text-emerald-400'}>
                  {tier.canOverrideOfficialWarnings ? 'YES' : 'NO (PROHIBITED)'}
                </strong>
              </div>
            </div>

            {/* Governance Rule */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Mandated Governance Rule:</span>
              <p className="text-slate-300 leading-relaxed font-sans">{tier.governanceRule}</p>
            </div>

            {/* Ingested Agencies / Services */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Ingested Repositories & Services:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                {tier.agenciesOrServices.map((agency, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-slate-900/40 px-2.5 py-1.5 rounded border border-slate-900">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="truncate">{agency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
