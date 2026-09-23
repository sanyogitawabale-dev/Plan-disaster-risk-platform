import React from 'react';
import { Truck, Car, Anchor, AlertTriangle, ShieldCheck, ArrowRight, Compass } from 'lucide-react';
import { INDIA_ROAD_HYDRAULIC_ASSESSMENTS } from '../data/indiaDisasterData';
import { RoadHydraulicAssessment } from '../types';

export const IndiaRoadHydraulicsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header and Operational Guidelines */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <Truck className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Road & Bridge IRC-MoRTH Hydraulic Assessment Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">
                  IRC:78 / MoRTH 5th REV
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Live hydrodynamic inundation, pier scour risk, and multi-modal convoy vehicle clearance thresholds.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Light Vehicle Cutoff: <strong className="text-amber-400">&gt;0.15m</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Heavy Truck Cutoff: <strong className="text-red-400">&gt;0.35m</strong>
            </span>
          </div>
        </div>

        {/* Operational IRC/MoRTH Standards Reference Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">IRC:78 Lacey Foundation Scour</span>
            <p className="text-[11px] text-slate-400">
              <code className="text-slate-300">dsm = 1.34 × (Db² / f)^(1/3)</code>; pier scour multiplier 2.0× dsm across estuarine sandy beds.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold block">MoRTH Section 300 Subgrade Stability</span>
            <p className="text-[11px] text-slate-400">
              Embankment slip circle factor of safety FOS &ge; 1.3 under 90%+ saturation; geotextile filter protection.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-purple-400 font-bold block">IRC:SP:13 Culvert Hydraulic Freeboard</span>
            <p className="text-[11px] text-slate-400">
              Waterway ratio &gt;1.0 indicates submerged culvert barrel with road overtopping risk.
            </p>
          </div>
        </div>
      </div>

      {/* Road Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDIA_ROAD_HYDRAULIC_ASSESSMENTS.map((road) => {
          const isCutoff = road.closureDecision === 'PHYSICAL_CORDON_MANDATORY';

          return (
            <div
              key={road.roadId}
              className={`bg-slate-900 border rounded-xl p-5 space-y-4 transition-all ${
                isCutoff
                  ? 'border-red-900/60 shadow-lg shadow-red-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{road.roadName}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {road.governingStandards.map((std, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase shrink-0 ${
                    isCutoff
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {isCutoff ? 'CORDON MANDATORY' : 'OPEN PASSAGE'}
                </span>
              </div>

              {/* Hydrodynamic Telemetry Matrix */}
              <div className="grid grid-cols-4 gap-2 text-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Water Depth:</span>
                  <span className={`font-mono font-bold ${road.currentWaterDepthM > 0.35 ? 'text-red-400' : road.currentWaterDepthM > 0.15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {road.currentWaterDepthM.toFixed(2)}m
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Flow Velocity:</span>
                  <span className="font-mono font-bold text-slate-200">{road.flowVelocityMs} m/s</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Scour Risk:</span>
                  <span className={`font-mono font-bold ${road.scourRiskGrade === 'CRITICAL' ? 'text-red-400' : road.scourRiskGrade === 'HIGH' ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {road.scourRiskGrade}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Saturation:</span>
                  <span className="font-mono font-bold text-slate-200">{road.embankmentSaturationPercent}%</span>
                </div>
              </div>

              {/* Vehicle Clearance Triad */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className={`p-2 rounded border flex flex-col items-center justify-center text-center ${
                  road.accessibilityStatus.lightVehicles === 'PASSABLE'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                    : 'bg-red-950/40 border-red-800/60 text-red-400'
                }`}>
                  <Car className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">Light Vehicles</span>
                  <span className="text-[10px] font-mono mt-0.5">{road.accessibilityStatus.lightVehicles}</span>
                </div>

                <div className={`p-2 rounded border flex flex-col items-center justify-center text-center ${
                  road.accessibilityStatus.heavyRescueTrucks === 'PASSABLE'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                    : 'bg-red-950/40 border-red-800/60 text-red-400'
                }`}>
                  <Truck className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">Heavy Trucks</span>
                  <span className="text-[10px] font-mono mt-0.5">{road.accessibilityStatus.heavyRescueTrucks}</span>
                </div>

                <div className={`p-2 rounded border flex flex-col items-center justify-center text-center ${
                  road.accessibilityStatus.rescueBoatsOdrf === 'OPTIMAL'
                    ? 'bg-teal-950/40 border-teal-800/60 text-teal-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <Anchor className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">ODRF Boats</span>
                  <span className="text-[10px] font-mono mt-0.5">{road.accessibilityStatus.rescueBoatsOdrf}</span>
                </div>
              </div>

              {/* Detour Recommendation */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase block">Routing Advisory / Detour:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{road.recommendedDetour}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
