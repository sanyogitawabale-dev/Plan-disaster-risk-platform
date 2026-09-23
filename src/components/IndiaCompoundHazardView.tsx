import React from 'react';
import { Waves, ArrowDown, Droplets, Wind, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { INDIA_COMPOUND_HAZARD } from '../data/indiaDisasterData';

export const IndiaCompoundHazardView: React.FC = () => {
  const ch = INDIA_COMPOUND_HAZARD;

  const stackElements = [
    {
      name: 'Astronomical Spring Tide',
      value: ch.astronomicalTideM,
      color: 'bg-blue-600',
      textColor: 'text-blue-400',
      description: 'Harmonic astronomical tide predicted from Survey of India tide tables (Paradip Port benchmark).'
    },
    {
      name: 'Meteorological Storm Surge',
      value: ch.stormSurgeM,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      description: 'Inverse barometric drop (-75 hPa) + cyclonic onshore wind stress calculated via INCOIS ADCIRC model.'
    },
    {
      name: 'Dynamic Coastal Wave Setup',
      value: ch.waveSetupM,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
      description: 'Radiation stress momentum transfer as 7.5m offshore waves break in shallow shoaling bathymetry.'
    },
    {
      name: 'Swash Wave Runup',
      value: ch.waveRunupM,
      color: 'bg-teal-500',
      textColor: 'text-teal-400',
      description: 'Dynamic swash uprush across the 1:30 sandy coastal foreshore profile.'
    },
    {
      name: 'River Discharge Backwater',
      value: ch.riverDischargeBackwaterM,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: 'Mahanadi River 950,000 cusecs freshwater flood wave impeded by coastal storm surge barrier.'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
            <Waves className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Compound-Hazard Hydrodynamic Decomposition
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800">
                PHYSICS DECOMPOSITION
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Deconstructed hydrodynamic components governing total coastal inundation in the Mahanadi Estuarine delta.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Total Water Level: <span className="text-teal-400 font-bold">+{ch.totalWaterLevelMslM.toFixed(2)}m GTS MSL</span>
        </div>
      </div>

      {/* Primary Visual Comparison: Total Water Level vs Ground & Finished Floor Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Water Level */}
        <div className="bg-slate-950 p-4 rounded-xl border border-teal-900/50 space-y-1">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">Total High Water Level (THWL)</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-white">+{ch.totalWaterLevelMslM.toFixed(2)}m</span>
            <span className="text-xs font-mono text-slate-400">GTS MSL</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Compound sum of astronomical tide, storm surge, wave setup, runup, and river backwater.
          </p>
        </div>

        {/* Ground Elevation */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Asset Ground Elevation</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-slate-200">+{ch.groundElevationGtsM.toFixed(2)}m</span>
            <span className="text-xs font-mono text-slate-400">GTS MSL</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Survey of India (SOI) GTS benchmark & Cartosat-1 DEM calibrated coastal terrain.
          </p>
        </div>

        {/* Net Inundation Depth */}
        <div className="bg-slate-950 p-4 rounded-xl border border-red-900/60 space-y-1">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Net Inundation Above Ground</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-red-400">+{ch.netInundationDepthM.toFixed(2)}m</span>
            <span className="text-xs font-mono text-red-300/80">OVER GROUND</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Exceeds substation plinth (+2.70m FFE) by <strong className="text-red-300">+0.70m</strong>; triggers mandatory de-energization.
          </p>
        </div>
      </div>

      {/* Stacked Decomposition Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-300 font-medium">
          <span>Component Breakdown of Peak Coastal Hydrodynamic Stage (+5.70m GTS MSL)</span>
          <span className="font-mono text-slate-400">Uncertainty Variance: ±{ch.uncertaintySpreadM}m</span>
        </div>

        {/* Visual Stacked Bar */}
        <div className="w-full h-8 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex">
          {stackElements.map((el, idx) => {
            const widthPercent = (el.value / ch.totalWaterLevelMslM) * 100;
            return (
              <div
                key={idx}
                className={`${el.color} h-full relative group transition-all duration-300 flex items-center justify-center`}
                style={{ width: `${widthPercent}%` }}
                title={`${el.name}: +${el.value.toFixed(2)}m (${widthPercent.toFixed(1)}%)`}
              >
                <span className="text-[10px] font-bold text-slate-950 truncate px-1 hidden sm:inline">
                  +{el.value.toFixed(2)}m
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Details List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stackElements.map((el, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${el.textColor}`}>{el.name}</span>
              <span className="text-xs font-mono font-bold text-white">+{el.value.toFixed(2)}m</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {el.description}
            </p>
          </div>
        ))}

        {/* Dominant Uncertainty Callout */}
        <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/40 space-y-1.5 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Dominant Uncertainty
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">±{ch.uncertaintySpreadM}m</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {ch.dominantUncertaintyFactor}
          </p>
        </div>
      </div>
    </div>
  );
};
