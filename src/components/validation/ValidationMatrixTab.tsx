import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import {
  GEOSHIELD_INDIA_VALIDATION_MATRIX,
  ValidationMatrixRow,
  AuditVerificationStatus,
  calculateValidationSummary
} from '../../config/geoShieldIndiaValidationRegistry';

export const ValidationMatrixTab: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(1);

  const summary = calculateValidationSummary();

  const categories = [
    'ALL',
    ...Array.from(new Set(GEOSHIELD_INDIA_VALIDATION_MATRIX.map(r => r.category)))
  ];

  const filteredRows = GEOSHIELD_INDIA_VALIDATION_MATRIX.filter(row => {
    const matchesStatus = selectedStatus === 'ALL' || row.status === selectedStatus;
    const matchesCategory = selectedCategory === 'ALL' || row.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      row.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.officialAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.statutoryStandard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.governingModelOrEngine.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: AuditVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            VERIFIED
          </span>
        );
      case 'NEEDS_VALIDATION':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            NEEDS_VALIDATION
          </span>
        );
      case 'INCORRECT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            INCORRECT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <HelpCircle className="w-3 h-3 mr-1" />
            NOT_APPLICABLE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Audit Health & Governance Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Total Matrix Rows</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{summary.total}</span>
            <span className="text-xs text-slate-400">Statutory Core Components</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Comprehensive audit surface across meteorology, ocean, grid, highways, and AI inference.</p>
        </div>

        <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-4">
          <div className="text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">Authoritatively Verified</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{summary.verified}</span>
            <span className="text-xs text-emerald-500/80 font-mono">({summary.verifiedPercentage}%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Backbone models with verified statutory mandate and live API / dataset grounding.</p>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-xl p-4">
          <div className="text-amber-400 text-xs font-mono uppercase tracking-wider mb-1">Needs Validation</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">{summary.needsValidation}</span>
            <span className="text-xs text-amber-500/80 font-mono">Explicitly Flagged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">E.g., GSI InSAR-to-pore-pressure transfer function and localized urban storm micro-drainage.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">GeoShield v1.0 Gate Status</div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              {summary.isReadyForV1 ? 'READY FOR V1.0 RELEASE CANDIDATE' : 'AUDIT IN PROGRESS'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Zero incorrect rows permitted; all exceptions transparently documented.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search component, authority (IMD, CWC, CEA), standard (IS 875, IRC)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {['ALL', 'VERIFIED', 'NEEDS_VALIDATION'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-slate-800/60 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Row</th>
                <th className="py-3 px-4">Component & Category</th>
                <th className="py-3 px-4">Statutory Authority & Dataset</th>
                <th className="py-3 px-4">Standard / Governing Equation</th>
                <th className="py-3 px-4">Resolution & Horizon</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRows.map((row) => {
                const isExpanded = expandedRowId === row.rowId;
                return (
                  <React.Fragment key={row.rowId}>
                    <tr
                      onClick={() => setExpandedRowId(isExpanded ? null : row.rowId)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        isExpanded ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{row.rowId}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white tracking-tight">{row.component}</div>
                        <div className="text-[11px] text-emerald-400/80 font-mono mt-0.5">{row.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{row.officialAuthority}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{row.officialDatasetOrApi}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300 text-[11px]">{row.statutoryStandard}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{row.governingModelOrEngine}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        <div>{row.spatialResolution}</div>
                        <div className="text-[10px] text-slate-500">{row.temporalCadence}</div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(row.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRowId(isExpanded ? null : row.rowId);
                          }}
                          className="px-2 py-1 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-mono"
                        >
                          {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                        </button>
                      </td>
                    </tr>

                    {/* Detailed Audit Inspection Panel */}
                    {isExpanded && (
                      <tr className="bg-slate-950/80 border-b border-slate-800">
                        <td colSpan={7} className="p-5">
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-emerald-400 font-bold">COMPONENT AUDIT SPECIFICATION</span>
                                <span className="text-slate-500">|</span>
                                <span className="text-white font-medium">{row.currentEffectiveVersion}</span>
                              </div>
                              {row.officialSourceUrl && (
                                <a
                                  href={row.officialSourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                                >
                                  <span>Authoritative Source Document</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Inputs & Outputs */}
                              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                                <div className="font-bold text-slate-300 font-mono text-[11px] uppercase">Telemetry Inputs & Outputs</div>
                                <div>
                                  <span className="text-slate-500 block text-[10px]">Primary Inputs:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {row.primaryInputs.map((inp, idx) => (
                                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[10px]">
                                        {inp}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="pt-2">
                                  <span className="text-slate-500 block text-[10px]">Primary Outputs:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {row.primaryOutputs.map((out, idx) => (
                                      <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 font-mono text-[10px]">
                                        {out}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Validation Methodology & Historical Proof */}
                              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                                <div className="font-bold text-slate-300 font-mono text-[11px] uppercase">Validation & Ground Truth</div>
                                <div>
                                  <span className="text-slate-500 block text-[10px]">Validation Methodology:</span>
                                  <p className="text-slate-300 leading-relaxed text-[11px] mt-0.5">{row.validationMethodology}</p>
                                </div>
                                <div className="pt-2">
                                  <span className="text-slate-500 block text-[10px]">Historical Benchmark Event:</span>
                                  <p className="text-amber-400 font-medium text-[11px] mt-0.5">{row.historicalTestEvent}</p>
                                </div>
                              </div>

                              {/* Uncertainty, Fallback & Failure Mode */}
                              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                                <div className="font-bold text-slate-300 font-mono text-[11px] uppercase">Failure Modes & Safety Fallbacks</div>
                                <div>
                                  <span className="text-slate-500 block text-[10px]">Dominant Uncertainty:</span>
                                  <p className="text-slate-400 text-[11px] mt-0.5">{row.dominantUncertainty}</p>
                                </div>
                                <div className="pt-2">
                                  <span className="text-slate-500 block text-[10px]">Statutory Fallback Source:</span>
                                  <p className="text-slate-300 text-[11px] font-mono mt-0.5">{row.fallbackSource}</p>
                                </div>
                                <div className="pt-2">
                                  <span className="text-slate-500 block text-[10px]">Failure Condition:</span>
                                  <p className="text-rose-400 text-[11px] mt-0.5">{row.failureCondition}</p>
                                </div>
                              </div>
                            </div>

                            {/* Audit Notes Callout */}
                            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start space-x-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <span className="font-bold text-slate-200">Formal Audit Conclusion: </span>
                                <span className="text-slate-300">{row.auditNotes}</span>
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
    </div>
  );
};
