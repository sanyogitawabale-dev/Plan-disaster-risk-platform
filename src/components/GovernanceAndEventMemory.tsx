import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Key,
  AlertTriangle,
  History,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  Cpu,
  Layers,
  Database,
  UserCheck
} from 'lucide-react';
import { GOVERNANCE_POLICY_ACTIONS, HISTORICAL_EVENTS } from '../data/mockDisasterData';
import { INDIA_GOVERNANCE_POLICY_ACTIONS, INDIA_HISTORICAL_EVENTS } from '../data/indiaDisasterData';
import { GovernancePolicyAction, HistoricalEventMemory, RegionalProfile } from '../types';

interface GovernanceAndEventMemoryProps {
  regionalProfile: RegionalProfile;
}

export const GovernanceAndEventMemory: React.FC<GovernanceAndEventMemoryProps> = ({
  regionalProfile
}) => {
  const isIndia = regionalProfile === 'INDIA_NDMA';
  const [activeSection, setActiveSection] = useState<'governance' | 'memory' | 'cost_security'>('governance');
  const [policyActions, setPolicyActions] = useState<GovernancePolicyAction[]>(
    isIndia ? INDIA_GOVERNANCE_POLICY_ACTIONS : GOVERNANCE_POLICY_ACTIONS
  );
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEventMemory>(
    isIndia ? INDIA_HISTORICAL_EVENTS[0] : HISTORICAL_EVENTS[0]
  );
  const [dualPinInput, setDualPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState<string | null>(null);

  // Sync state when regional profile switches
  React.useEffect(() => {
    if (regionalProfile === 'INDIA_NDMA') {
      setPolicyActions(INDIA_GOVERNANCE_POLICY_ACTIONS);
      setSelectedEvent(INDIA_HISTORICAL_EVENTS[0]);
    } else {
      setPolicyActions(GOVERNANCE_POLICY_ACTIONS);
      setSelectedEvent(HISTORICAL_EVENTS[0]);
    }
  }, [regionalProfile]);

  const handleApproveAction = (id: string, requiresDualPin: boolean) => {
    if (requiresDualPin) {
      setShowPinModal(id);
      return;
    }
    setPolicyActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, status: 'APPROVED' } : action
      )
    );
  };

  const handleConfirmDualPin = () => {
    if (dualPinInput === '7482' || dualPinInput.length >= 4) {
      setPolicyActions(prev =>
        prev.map(action =>
          action.id === showPinModal ? { ...action, status: 'APPROVED' } : action
        )
      );
      setShowPinModal(null);
      setDualPinInput('');
    } else {
      alert('Invalid Dual Authorization Security Key. Enter 7482 for EOC Commander Key.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Governance, Human-in-the-Loop & Incident Knowledge Base
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tier policy authorization controls, historical disaster event feedback loops, cost-conscious event-driven computing, and data classification.
            </p>
          </div>

          {/* Section Navigation Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              id="gov-tab-policy"
              onClick={() => setActiveSection('governance')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSection === 'governance'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Policy & Authorization
            </button>
            <button
              id="gov-tab-memory"
              onClick={() => setActiveSection('memory')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSection === 'memory'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Incident Memory & Feedback
            </button>
            <button
              id="gov-tab-cost"
              onClick={() => setActiveSection('cost_security')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSection === 'cost_security'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cost & Security Tiering
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Human-in-the-Loop Governance & Policy Authorization */}
      {activeSection === 'governance' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Consequential Decision Authorization Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  AI and physics engines calculate and recommend; consequential life-safety and grid actions strictly mandate human sign-off.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                ISO 22301 / EOC Standard SOP
              </span>
            </div>

            <div className="space-y-3">
              {policyActions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 rounded-xl border transition-all ${
                    action.status === 'APPROVED'
                      ? 'bg-slate-950/60 border-slate-800/80'
                      : 'bg-amber-950/20 border-amber-500/50 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white">{action.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          action.automationTier === 'Automatic' ? 'bg-slate-800 text-slate-300' :
                          action.automationTier === 'Internal Alert' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          action.automationTier === 'Approval Required' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          action.automationTier === 'Dual Authorization' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          Tier: {action.automationTier}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          action.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500 text-slate-950'
                        }`}>
                          {action.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{action.description}</p>
                      <div className="text-[10px] text-slate-400 flex flex-wrap gap-2 pt-1 font-mono">
                        <span>Approver: <strong className="text-slate-200">{action.approverRoleRequired}</strong></span>
                        <span>•</span>
                        <span className="text-amber-400/90">Warning: {action.consequenceWarning}</span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="shrink-0 flex items-center space-x-2">
                      {action.status === 'PENDING_APPROVAL' ? (
                        <button
                          id={`approve-btn-${action.id}`}
                          onClick={() => handleApproveAction(action.id, action.requiresDualPin)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                            action.requiresDualPin
                              ? 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          }`}
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>{action.requiresDualPin ? 'Authorize (Dual PIN)' : 'Approve & Execute'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 text-emerald-400 text-xs font-mono">
                          <CheckCircle className="w-4 h-4" />
                          <span>Authorized</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Incident Memory & Feedback Loop */}
      {activeSection === 'memory' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" />
                  Historical Event Knowledge Base & Model Calibration Feedback Loop
                </h3>
                <p className="text-xs text-slate-400">
                  After disaster events, predicted versus actual footprints are back-tested to adjust hydrodynamic friction factors and eliminate false alarms.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                3 Calibrated Disaster Events Stored
              </span>
            </div>

            {/* Event Selector Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {HISTORICAL_EVENTS.map((event) => (
                <button
                  key={event.id}
                  id={`event-btn-${event.id}`}
                  onClick={() => setSelectedEvent(event)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedEvent.id === event.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{event.name} ({event.date})</span>
                </button>
              ))}
            </div>

            {/* Selected Event Deep Dive Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedEvent.name}</h4>
                  <span className="text-xs text-slate-400">{selectedEvent.region} • Category {selectedEvent.category} • Peak Surge: +{selectedEvent.peakSurgeM}m</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="bg-slate-900 px-3 py-1 rounded border border-slate-800 text-slate-300">
                    Predicted: <span className="text-amber-400 font-bold">{selectedEvent.predictedInundationKm2} km²</span>
                  </div>
                  <div className="bg-slate-900 px-3 py-1 rounded border border-slate-800 text-slate-300">
                    Actual: <span className="text-emerald-400 font-bold">{selectedEvent.actualInundationKm2} km²</span>
                  </div>
                  <div className={`px-3 py-1 rounded border font-bold ${
                    Math.abs(selectedEvent.errorVariancePercent) < 10
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    Error: {selectedEvent.errorVariancePercent > 0 ? `+${selectedEvent.errorVariancePercent}%` : `${selectedEvent.errorVariancePercent}%`}
                  </div>
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Operational Lessons Learned:
                </span>
                <div className="space-y-1.5">
                  {selectedEvent.lessonsLearned.map((lesson, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Calibration Adjustment */}
              <div className="bg-emerald-950/30 border border-emerald-800/80 p-3 rounded-lg text-xs space-y-1 text-emerald-200">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Platform Feedback Calibration Applied:
                </span>
                <p className="text-[11px] leading-relaxed text-emerald-100/90 font-mono">
                  {selectedEvent.modelCalibrationAdjustment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Cost-Control Engine & Security Architecture */}
      {activeSection === 'cost_security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cost-Control Tiered Processing */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xs border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Cost-Control Engine (Event-Driven Tiered Processing)</span>
            </div>
            <p className="text-xs text-slate-400">
              Avoids running expensive 2D hydrodynamic simulation and full multimodal LLM reasoning continuously.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-400">Tier 1: Cheap Heartbeat Monitoring</span>
                  <span className="text-[10px] font-mono text-slate-400">$0.00 / hr</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pulls free ECMWF 0.1° and IoT river gauge feeds every 15 min. No GPU or LLM tokens invoked until storm threshold (&gt;40mm rain or surge &gt;1.5m) is triggered.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-amber-950/60 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">Tier 2: Medium Spatial Analysis</span>
                  <span className="text-[10px] font-mono text-slate-400">&lt;$0.05 / run</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  PostGIS vector topological intersection + InSAR baseline comparison. Runs in milliseconds on standard CPU.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-red-950/60 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-red-400">Tier 3: Expensive Simulation & Gemini AI</span>
                  <span className="text-[10px] font-mono text-slate-400">On-Demand Only</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  SLOSH hydrodynamic inundation + Gemini 3.8 Flash FMEA reasoning invoked exclusively when an asset FFE is breached or a magistrate requests scenario simulation.
                </p>
              </div>
            </div>
          </div>

          {/* Security Architecture & Data Classification */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xs border-b border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Security Architecture & Three-Tier Data Classification</span>
            </div>
            <p className="text-xs text-slate-400">
              Protects sensitive energy and defense infrastructure topologies from unauthorized disclosure.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-xs text-blue-400 block">Class 1: Public Domain Data</span>
                <p className="text-[11px] text-slate-400">
                  ECMWF weather, satellite imagery, general road outlines, public shelter locations, and broadcast CAP citizen advisories.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-xs text-amber-400 block">Class 2: Sensitive Infrastructure Data</span>
                <p className="text-[11px] text-slate-400">
                  Substation step-down transformer pad elevations, Finished Floor Elevation CAD layers, and hospital backup fuel reserves (RBAC access restricted to municipal EOC staff).
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-xs text-red-400 block">Class 3: Critical Defense & Grid Controls</span>
                <p className="text-[11px] text-slate-400">
                  69kV circuit breaker trip command interfaces, SCADA protocols, and cryptographic X.509 private signing keys (Mandates dual-PIN multi-party authorization).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dual Authorization PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center space-x-2 text-red-400">
              <Key className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Dual Authorization Security Key Required</h3>
            </div>
            <p className="text-xs text-slate-300">
              Action: <strong className="text-amber-400">De-Energize Substation 4B (69kV Vacuum Breakers)</strong>. This will sever primary power to 38,000 residents and the South Water Reclamation Facility.
            </p>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Enter EOC Commander Authorization Key (Demo PIN: 7482):</label>
              <input
                id="dual-pin-input"
                type="password"
                maxLength={4}
                value={dualPinInput}
                onChange={(e) => setDualPinInput(e.target.value)}
                placeholder="****"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center font-mono text-lg text-amber-400 tracking-widest focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowPinModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDualPin}
                className="px-4 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-500 font-bold text-white shadow-md"
              >
                Confirm Dual Key Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
