import React, { useState } from 'react';
import {
  GitBranch,
  Zap,
  Activity,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowDown,
  CheckCircle,
  Play,
  RotateCcw,
  Fuel,
  Hospital,
  Droplets,
  Radio
} from 'lucide-react';
import { DIGITAL_TWIN_NODES } from '../data/mockDisasterData';
import { INDIA_DIGITAL_TWIN_NODES } from '../data/indiaDisasterData';
import { DigitalTwinNode, RegionalProfile } from '../types';

interface DigitalTwinViewerProps {
  regionalProfile?: RegionalProfile;
}

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  regionalProfile = 'INDIA_NDMA'
}) => {
  const isIndia = regionalProfile === 'INDIA_NDMA';
  const [substationFailed, setSubstationFailed] = useState(false);
  const [generatorRunningHours, setGeneratorRunningHours] = useState(0);

  const toggleSubstationTrip = () => {
    setSubstationFailed(!substationFailed);
  };

  const resetSimulation = () => {
    setSubstationFailed(false);
    setGeneratorRunningHours(0);
  };

  const hospitalFuelAutonomyInitial = isIndia ? 36.0 : 14.5;
  const remainingHospitalFuelHours = Math.max(0, hospitalFuelAutonomyInitial - generatorRunningHours);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Digital Twin of Critical Infrastructure & Cascading Failure Graph
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isIndia
                ? 'Models functional topologies and multi-lifeline dependencies: OPTCL 400kV/220kV State Transmission → Paradip 220kV Substation → SCB Medical College ICU → Kirloskar Backup Genset → Mahanadi Water Treatment.'
                : 'Models functional topologies and multi-lifeline dependencies: High-voltage electrical feeders → substations → hospital ICU life support → emergency fuel autonomy → wastewater treatment.'}
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center space-x-2">
            <button
              id="twin-toggle-trip"
              onClick={toggleSubstationTrip}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                substationFailed
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {substationFailed
                  ? isIndia
                    ? 'OPTCL 220kV Switchyard TRIPPED (De-energized)'
                    : 'Substation 4B TRIPPED (De-energized)'
                  : isIndia
                  ? 'Simulate OPTCL 220kV Substation Saltwater Flashover'
                  : 'Simulate Substation 4B Inundation Trip'}
              </span>
            </button>

            <button
              id="twin-reset-sim"
              onClick={resetSimulation}
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-800 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cascading Consequence Overview Pill */}
      {substationFailed && (
        <div className="bg-red-950/80 border border-red-700/80 rounded-xl p-4 text-xs text-red-200 animate-fadeIn space-y-2">
          <div className="flex items-center space-x-2 font-bold text-red-300 text-sm">
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            <span>CASCADING FAILURE IN PROGRESS: Grid Loss Propagated Downstream</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {isIndia
              ? 'OPTCL 220kV Paradip switchyard vacuum circuit breakers tripped due to saltwater inundation above +2.9m GTS MSL. SCB Medical College Trauma ICU has severed primary grid feed and switched to rooftop 2000kVA Kirloskar diesel generator bank (36.0h fuel burn remaining). Mahanadi Coastal Drinking Water Intake booster pumps have halted, cutting supply to 1.8M citizens in Cuttack & Paradip.'
              : 'Substation 4B 69kV vacuum breakers opened due to saltwater inundation above +2.7m FFE. Memorial Hospital ICU has severed primary grid feed and switched to rooftop 1.2MW diesel genset (14.5h fuel burn remaining). South Basin Water Treatment booster pumps have halted, risking environmental sewage backflow within 90 minutes.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-[10px] font-mono">
            <span className="bg-black/40 px-2 py-0.5 rounded border border-red-800 text-red-300">
              {isIndia ? 'Cascade Lag: 12 mins to water treatment halt' : 'Cascade Lag: 15 mins to water plant failure'}
            </span>
            <span className="bg-black/40 px-2 py-0.5 rounded border border-red-800 text-amber-300">
              {isIndia ? 'SCB Hospital ICU Autonomy: ' : 'Hospital ICU Autonomy: '}
              {remainingHospitalFuelHours.toFixed(1)} hrs
            </span>
            <span className="bg-black/40 px-2 py-0.5 rounded border border-red-800 text-purple-300">
              {isIndia ? 'SH-12 Cuttack-Paradip Expressway: Severed' : 'Ambulance Route 101: Cutoff'}
            </span>
          </div>
        </div>
      )}

      {/* Graph Visualizer Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 pb-3">
          <span>Infrastructure Dependency Topology Graph</span>
          <span className="font-mono text-emerald-400 text-[10px]">
            {isIndia ? 'OPTCL / CEA Grid SCADA Status' : 'Real-time Circuit & Telemetry Status'}
          </span>
        </h3>

        {/* Level 1: Upstream Transmission Feeder */}
        <div className="flex justify-center">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-md w-full text-center space-y-1.5 shadow-lg">
            <div className="flex items-center justify-center space-x-2 text-slate-300 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>
                {isIndia
                  ? 'OPTCL 400kV/220kV Duburi-Paradip Heavy Transmission Line'
                  : 'Bulk 69kV Transmission Line (Regional Grid)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {isIndia ? 'Status: Live 220kV • Elev: +4.8m GTS MSL' : 'Status: Live 69.2kV • Elev: 4.5m MSL'}
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              OPERATIONAL
            </span>
          </div>
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className={`w-0.5 h-6 transition-colors duration-500 ${substationFailed ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <ArrowDown className={`w-4 h-4 ${substationFailed ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
        </div>

        {/* Level 2: Substation (Vulnerable Node) */}
        <div className="flex justify-center">
          <div className={`border p-5 rounded-xl max-w-lg w-full text-center space-y-2 transition-all duration-500 ${
            substationFailed
              ? 'bg-red-950/40 border-red-600 shadow-lg shadow-red-950/50'
              : 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/20'
          }`}>
            <div className="flex items-center justify-center space-x-2 text-sm font-bold text-white">
              <Zap className={`w-4 h-4 ${substationFailed ? 'text-red-400' : 'text-amber-400'}`} />
              <span>
                {isIndia
                  ? 'OPTCL 220kV/132kV Paradip Grid Substation (Air-Insulated)'
                  : 'Maple Coastal Substation 4B (69kV Step-Down)'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Finished Floor Elevation:{' '}
              <span className="font-mono text-slate-200">
                {isIndia ? '2.9m GTS MSL' : '2.7m MSL'}
              </span>{' '}
              • Active Surge:{' '}
              <span className="font-mono text-red-400">
                {isIndia ? '+3.6m GTS MSL (+0.7m over FFE)' : '+4.4m MSL (+1.7m submergence)'}
              </span>
            </p>
            <div className="flex justify-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                substationFailed
                  ? 'bg-red-500 text-white'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {substationFailed ? 'TRIPPED & DE-ENERGIZED' : 'HIGH INUNDATION RISK'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {isIndia ? 'IS 875 Zone V (55m/s wind rated)' : 'Pad: +0.6m above grade'}
              </span>
            </div>
          </div>
        </div>

        {/* Branching Connectors to Downstream Lifelines */}
        <div className="grid grid-cols-2 max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-0.5 h-8 transition-colors duration-500 ${substationFailed ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <ArrowDown className={`w-4 h-4 ${substationFailed ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-0.5 h-8 transition-colors duration-500 ${substationFailed ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <ArrowDown className={`w-4 h-4 ${substationFailed ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
        </div>

        {/* Level 3: Dual Downstream Dependent Lifelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Hospital Branch */}
          <div className={`border p-4 rounded-xl space-y-2.5 transition-all ${
            substationFailed
              ? 'bg-slate-900 border-amber-500/60'
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <Hospital className="w-4 h-4 text-emerald-400" />
              <span>
                {isIndia
                  ? 'SCB Medical College & AIIMS Coastal Trauma ICU'
                  : 'Memorial Hospital ICU & Trauma Suites'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isIndia
                ? 'FFE: +13.2m GTS MSL (Safe inland elevation). Dual 33kV feed lost on Paradip grid trip.'
                : 'FFE: +6.2m MSL (Freeboard +2.4m safe from surge). Primary grid feed lost on Substation trip.'}
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  {isIndia ? 'Rooftop Kirloskar 2000kVA Genset' : 'Rooftop Diesel Genset (1.2MW)'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  substationFailed ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {substationFailed ? 'ACTIVE RUNNING' : 'STANDBY'}
                </span>
              </div>

              {substationFailed && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Fuel Autonomy Remaining:</span>
                    <span className="text-amber-400 font-bold">{remainingHospitalFuelHours.toFixed(1)} Hours</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(remainingHospitalFuelHours / hospitalFuelAutonomyInitial) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-red-400 block pt-0.5 font-mono">
                    {isIndia
                      ? 'SH-12 Expressway severed at KM 42: IOCL fuel convoy blocked!'
                      : 'Route 101 severed: Tanker refuel cannot reach dock!'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Water Treatment Branch */}
          <div className={`border p-4 rounded-xl space-y-2.5 transition-all ${
            substationFailed
              ? 'bg-red-950/30 border-red-700/80 text-red-200'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-xs">
              <Droplets className={`w-4 h-4 ${substationFailed ? 'text-red-400' : 'text-blue-400'}`} />
              <span>
                {isIndia
                  ? 'Mahanadi Coastal Water Intake & Treatment (Jobra Headworks)'
                  : 'South Basin Water Reclamation Facility'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isIndia
                ? 'Embankment: +2.8m GTS MSL. Surge backwater (+3.6m) overtops intake pumphouse. Critical drinking supply for 1.8M citizens.'
                : 'Perimeter dyke: +2.9m MSL. Surge (+4.6m) overtops dyke. No elevated emergency backup generators.'}
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {isIndia ? 'Mahanadi Intake Pumps:' : 'Booster Lift Pumps:'}
                </span>
                <span className={`font-mono font-bold ${substationFailed ? 'text-red-400' : 'text-emerald-400'}`}>
                  {substationFailed ? 'HALTED (Zero Power)' : 'Normal Flow'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {isIndia ? 'Drinking Water Disruption:' : 'Environmental Hazard:'}
                </span>
                <span className={`font-mono ${substationFailed ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                  {substationFailed
                    ? isIndia
                      ? 'Pressure Loss in 45m (1.8M affected)'
                      : 'Untreated Effluent Spill in 90m'
                    : 'Pressure Stable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
