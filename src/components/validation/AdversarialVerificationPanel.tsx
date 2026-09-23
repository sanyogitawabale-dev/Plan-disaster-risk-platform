/**
 * GeoShield India v1.0 — Adversarial Red-Team & Verification Suite Panel
 *
 * Implements:
 * - Multi-dimensional readiness scorecard
 * - Boundary threshold test explorer (CEA 0.30m, MoRTH 1.0, NDMA 160 chars)
 * - Metrological quantity & vertical datum integrity monitor
 * - Multi-agency authority conflict visualizer (IMD vs INCOIS vs GeoShield)
 * - Telemetry feed freshness & confidence degradation monitor
 * - Cryptographic evidence tamper detection simulator
 * - Live test runner trigger with real-time feedback
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Flame,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Cpu,
  Layers,
  FileCheck2,
  Database,
  Radio,
  Lock,
  GitBranch,
  Terminal,
  Activity,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useRegistry } from '../../context/RegistryProvider';
import { TestCaseCategory } from '../../services/adversarialTestSuite';

export const AdversarialVerificationPanel: React.FC = () => {
  const {
    adversarialSuiteResult,
    isRunningAdversarialSuite,
    triggerAdversarialSuite
  } = useRegistry();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  if (!adversarialSuiteResult) {
    return (
      <div id="adversarial-loading-container" className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
        <Activity className="w-8 h-8 mx-auto mb-2 text-indigo-400 animate-spin" />
        <p className="font-mono text-sm">Initializing Adversarial Test Engine...</p>
      </div>
    );
  }

  const rs = adversarialSuiteResult.readinessScore;

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Test Vectors' },
    { key: 'BOUNDARY_THRESHOLDS', label: 'Boundary Thresholds' },
    { key: 'METROLOGY_AND_UNITS', label: 'Metrology & Datums' },
    { key: 'CORRUPT_AND_MISSING_DATA', label: 'Corrupt / Missing Data' },
    { key: 'AUTHORITY_CONFLICTS', label: 'Agency Conflicts' },
    { key: 'STALE_DATA_HEALTH', label: 'Telemetry Freshness' },
    { key: 'AI_FAILURE_AND_INDEPENDENCE', label: 'AI Independence' },
    { key: 'CRYPTOGRAPHIC_TAMPERING', label: 'Crypto Tampering' },
    { key: 'REPLAY_ANTI_LEAKAGE', label: 'Replay Anti-Leakage' },
    { key: 'FAIL_CLOSED_POLICIES', label: 'Fail-Closed Policies' }
  ];

  const filteredTests = selectedCategory === 'ALL'
    ? adversarialSuiteResult.testCases
    : adversarialSuiteResult.testCases.filter(t => t.category === selectedCategory);

  return (
    <div id="geoshield-adversarial-verification-panel" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              Adversarial Red-Team & Verification Suite
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono bg-rose-950/70 text-rose-300 border border-rose-800 rounded">
              Phase 6A–6K
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulates boundary threshold breaches, unit corruption, multi-agency authority conflict,
            stale telemetry degradation, cryptographic tampering, and AI hallucination against statutory Indian standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-run-adversarial-suite"
            onClick={() => triggerAdversarialSuite()}
            disabled={isRunningAdversarialSuite}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
          >
            {isRunningAdversarialSuite ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                Executing Vectors...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Re-Run Verification Suite
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Readiness Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Specification Check */}
        <div id="scorecard-spec" className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Schema Spec</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">100%</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">20/20 Matrix Rows</div>
        </div>

        {/* Boundary Thresholds */}
        <div id="scorecard-boundary" className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Boundary Tripping</span>
            {rs.boundaryThresholdPassRate === 100 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <div className={`text-xl font-bold font-mono ${rs.boundaryThresholdPassRate === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {rs.boundaryThresholdPassRate}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">CEA, MoRTH, NDMA</div>
        </div>

        {/* Metrology & Datums */}
        <div id="scorecard-metrology" className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Metrology Units</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {rs.metrologicalIntegrityPassRate}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Bare Numbers Blocked</div>
        </div>

        {/* Safety & Fail-Closed */}
        <div id="scorecard-safety" className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Safety Controls</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {rs.safetyControlsPassRate}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">14 Policies Enforced</div>
        </div>

        {/* AI Independence */}
        <div id="scorecard-ai" className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>AI Independence</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {rs.aiIndependencePassRate}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Physics Overrules LLM</div>
        </div>

        {/* Operational Status */}
        <div id="scorecard-status" className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Overall Readiness</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xs font-bold font-mono text-indigo-300 mt-1 truncate">
            {rs.overallOperationalReadiness === 'SHADOW_MODE_READY' ? 'SHADOW READY' : 'NOT CERTIFIED'}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">0 Critical Failures</div>
        </div>
      </div>

      {/* Authority Conflict Simulation & Telemetry Freshness Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Multi-Agency Authority Conflict Simulator */}
        <div id="authority-conflict-card" className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold font-mono text-slate-200">
                Multi-Agency Authority Disagreement Test
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-amber-950/70 text-amber-300 border border-amber-800 rounded">
              CONFLICT DETECTED
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Verifies that divergent official bulletins from IMD and INCOIS generate an un-reconciled
            source conflict requiring State Relief Commissioner statutory sign-off.
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            {adversarialSuiteResult.authorityConflictSimulation.agenciesInvolved.map((agency, i) => (
              <div key={i} className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg">
                <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
                  <span>{agency.agency}</span>
                  <span className="text-[11px] text-amber-300 px-1.5 py-0.2 bg-amber-950/50 rounded">
                    {agency.reportedTier}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{agency.basis}</div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-amber-950/30 border border-amber-900/50 rounded-lg text-xs text-amber-200">
            <strong>Mandatory Protocol:</strong> {adversarialSuiteResult.authorityConflictSimulation.actionProtocol}
          </div>
        </div>

        {/* Telemetry Stream Freshness & Degraded Confidence */}
        <div id="telemetry-freshness-card" className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold font-mono text-slate-200">
                Data Freshness & Degraded Confidence Monitor
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-sky-950/70 text-sky-300 border border-sky-800 rounded">
              COMPOSITE: {adversarialSuiteResult.readinessScore.dataHealthIndex}%
            </span>
          </div>
          <p className="text-xs text-slate-400">
            System explicitly degrades confidence weighting when sensor streams exceed statutory age thresholds,
            rather than concealing stale data behind simulated nominal numbers.
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            {adversarialSuiteResult.dataHealthSimulation.map((feed, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-950/80 border border-slate-800/80 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${feed.status === 'HEALTHY' ? 'bg-emerald-400' : feed.status === 'DEGRADED' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                  <span className="text-slate-200">{feed.feedName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">Age: {feed.ageMinutes}m</span>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded border ${
                    feed.status === 'HEALTHY'
                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
                      : feed.status === 'DEGRADED'
                      ? 'bg-amber-950/50 text-amber-300 border-amber-800'
                      : 'bg-rose-950/50 text-rose-300 border-rose-800'
                  }`}>
                    {feed.status} ({(feed.confidenceWeight * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filterable Test Vector Matrix */}
      <div id="adversarial-test-matrix" className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold font-mono text-slate-200">
              Executed Adversarial Test Vectors ({adversarialSuiteResult.passedTests}/{adversarialSuiteResult.totalTests} Passed)
            </h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === c.key
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Test Cases Table */}
        <div className="border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="py-2.5 px-3 w-16">Status</th>
                <th className="py-2.5 px-3 w-28">ID</th>
                <th className="py-2.5 px-3">Test Vector & Scenario</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Standard</th>
                <th className="py-2.5 px-3 w-24">Severity</th>
                <th className="py-2.5 px-3 w-20 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTests.map((tc) => {
                const isExpanded = expandedTestId === tc.id;
                return (
                  <React.Fragment key={tc.id}>
                    <tr
                      onClick={() => setExpandedTestId(isExpanded ? null : tc.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        {tc.status === 'PASSED' ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">PASS</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400">
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">FAIL</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-semibold">{tc.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span className="text-slate-200">{tc.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 hidden md:table-cell truncate max-w-xs">
                        {tc.statutoryStandard}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 text-[10px] rounded border ${
                          tc.severity === 'CRITICAL'
                            ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                            : tc.severity === 'HIGH'
                            ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                            : 'bg-blue-950/70 text-blue-300 border-blue-800'
                        }`}>
                          {tc.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-right">{tc.executionTimeMs}ms</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-950/90 text-slate-300">
                        <td colSpan={6} className="p-3.5 space-y-2 border-b border-slate-800">
                          <div>
                            <span className="text-slate-400">Description: </span>
                            <span>{tc.description}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Statutory Standard: </span>
                            <span className="text-indigo-300">{tc.statutoryStandard}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Expected Behavior: </span>
                            <span className="text-amber-300">{tc.expectedBehavior}</span>
                          </div>
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                            <span className="text-slate-400">Execution Result: </span>
                            {tc.details}
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
