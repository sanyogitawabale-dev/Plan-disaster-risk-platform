import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  Truck
} from 'lucide-react';
import { StormScenario, RegionalProfile } from '../types';

interface ScenarioSimulatorProps {
  scenario: StormScenario;
  regionalProfile: RegionalProfile;
  hasGeminiKey: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  scenario,
  regionalProfile,
  hasGeminiKey
}) => {
  const [rainfallMultiplier, setRainfallMultiplier] = useState<number>(1.3); // +30% default
  const [trackShiftEastKm, setTrackShiftEastKm] = useState<number>(25); // +25km East
  const [substation4BTripped, setSubstation4BTripped] = useState<boolean>(true);
  const [road101ClosedCounterfactual, setRoad101ClosedCounterfactual] = useState<boolean>(true);
  const [surgeAdjustmentM, setSurgeAdjustmentM] = useState<number>(0.4);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [synthesisResult, setSynthesisResult] = useState<any>(null);

  // Deterministic local live estimates
  const baseRain = scenario.rainfallAccumulationMm;
  const effectiveRain = Math.round(baseRain * rainfallMultiplier);
  const baseSurge = scenario.projectedSurgeMaxM;
  const effectiveSurge = Number((baseSurge + surgeAdjustmentM + (trackShiftEastKm > 0 ? 0.35 : -0.25)).toFixed(2));
  const estimatedExposedAssets = Math.min(38, Math.round(18 + (rainfallMultiplier - 1) * 20 + surgeAdjustmentM * 5));
  const estimatedRerouteDelayMin = road101ClosedCounterfactual ? 48 : 0;

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/simulate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainfallMultiplier,
          trackShiftEastKm,
          substation4BTripped,
          road101ClosedCounterfactual,
          surgeHeightAdjustmentM: surgeAdjustmentM,
          regionalFramework: regionalProfile
        })
      });
      const data = await res.json();
      if (data.success && data.synthesis) {
        setSynthesisResult(data.synthesis);
      }
    } catch (err) {
      console.warn('Simulation API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRainfallMultiplier(1.0);
    setTrackShiftEastKm(0);
    setSubstation4BTripped(false);
    setRoad101ClosedCounterfactual(false);
    setSurgeAdjustmentM(0);
    setSynthesisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Scenario Simulator & Counterfactual "What-If" Analysis Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test operational interventions before taking irreversible action: Stress-test rainfall deltas, cyclone eye deviations, grid de-energization, and evacuation corridor closures.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="sim-reset-btn"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
            <button
              id="sim-run-btn"
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Simulating...' : 'Run AI Strategic Synthesis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Real-Time Feedback on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Scenario Sliders & Counterfactual Toggles */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Simulation Stress Parameters</span>
              <span className="text-[10px] text-amber-400 font-mono">Dynamic Inputs</span>
            </h3>

            {/* Slider 1: Rainfall Multiplier */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Precipitation Accumulation Modifier:</span>
                <span className="font-mono text-blue-400 font-bold">
                  {rainfallMultiplier >= 1 ? `+${Math.round((rainfallMultiplier - 1) * 100)}%` : `-${Math.round((1 - rainfallMultiplier) * 100)}%`} ({effectiveRain} mm)
                </span>
              </div>
              <input
                id="sim-slider-rain"
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={rainfallMultiplier}
                onChange={(e) => setRainfallMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-20% (Dry Lull)</span>
                <span>Normal (340mm)</span>
                <span>+50% (Intense Convective Band)</span>
              </div>
            </div>

            {/* Slider 2: Cyclone Track Deviation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Storm Track Lateral Shift:</span>
                <span className="font-mono text-purple-400 font-bold">
                  {trackShiftEastKm > 0 ? `+${trackShiftEastKm} km East` : trackShiftEastKm < 0 ? `${trackShiftEastKm} km West` : 'On Predicted Centerline'}
                </span>
              </div>
              <input
                id="sim-slider-track"
                type="range"
                min="-50"
                max="50"
                step="10"
                value={trackShiftEastKm}
                onChange={(e) => setTrackShiftEastKm(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 km West (Inland Track)</span>
                <span>0 km (Centerline)</span>
                <span>50 km East (Direct Estuary Landfall)</span>
              </div>
            </div>

            {/* Counterfactual Decision 1: Road 101 Closure */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Counterfactual: Pre-emptively Close Route 101?</span>
                  <span className="text-[11px] text-slate-400">Forces all traffic & ambulances onto Highland Bypass</span>
                </div>
                <button
                  id="sim-toggle-road"
                  onClick={() => setRoad101ClosedCounterfactual(!road101ClosedCounterfactual)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    road101ClosedCounterfactual
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {road101ClosedCounterfactual ? 'CORDONED / CLOSED' : 'LEFT OPEN'}
                </button>
              </div>
            </div>

            {/* Counterfactual Decision 2: Substation 4B Manual Breaker Trip */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Counterfactual: Manual De-Energize Substation 4B?</span>
                  <span className="text-[11px] text-slate-400">Protects transformers from arc fire; cuts hospital main power</span>
                </div>
                <button
                  id="sim-toggle-substation"
                  onClick={() => setSubstation4BTripped(!substation4BTripped)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    substation4BTripped
                      ? 'bg-red-600 text-white shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {substation4BTripped ? 'TRIPPED (Safe from Fire)' : 'LIVE (Risking Explosion)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Impact & AI Counterfactual Synthesis */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Peak Surge</span>
              <span className="text-xl font-bold font-mono text-amber-400">+{effectiveSurge}m</span>
              <span className="text-[10px] text-slate-500 block">MSL Datum</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Exposed Assets</span>
              <span className="text-xl font-bold font-mono text-red-400">{estimatedExposedAssets}</span>
              <span className="text-[10px] text-slate-500 block">+{(estimatedExposedAssets - 19)} vs baseline</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Ambulance Delay</span>
              <span className="text-xl font-bold font-mono text-purple-400">+{estimatedRerouteDelayMin}m</span>
              <span className="text-[10px] text-slate-500 block">Highland Bypass</span>
            </div>
          </div>

          {/* AI Synthesis or Interactive Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Decision Support & Counterfactual Tradeoff Analysis</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                Gemini 3.8 Flash Evaluator
              </span>
            </div>

            {synthesisResult ? (
              <div className="space-y-3 text-xs animate-fadeIn">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">{synthesisResult.scenarioTitle}</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{synthesisResult.executiveFinding}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wide block">
                    Cascading Domino Impacts:
                  </span>
                  {synthesisResult.cascadingConsequences?.map((consequence: string, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2">
                      <span className="text-red-400 font-bold shrink-0">&bull;</span>
                      <span>{consequence}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-amber-950/60 text-[11px] space-y-1 text-slate-300">
                  <span className="text-amber-400 font-bold block">Tradeoff Analysis:</span>
                  <p className="leading-relaxed">{synthesisResult.counterfactualTradeoffAnalysis}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wide block">
                    Recommended Operational Adjustments:
                  </span>
                  {synthesisResult.recommendedEmergencyAdjustments?.map((adj: string, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-2 rounded border border-emerald-950/60 text-[11px] text-slate-300 flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{adj}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center">
                  <Sliders className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-300">Adjust the sliders and click "Run AI Strategic Synthesis"</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    The platform will compute hydrodynamic and topological changes, then prompt Gemini 3.8 Flash to evaluate the policy tradeoffs of your counterfactual decisions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
