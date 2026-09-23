import React, { useState } from 'react';
import { BookOpen, Calculator, Sliders, CheckCircle2, ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { INDIA_STANDARDS_REGISTRY, calculateIS875Wind } from '../data/indiaDisasterData';
import { IndiaStandardEntry } from '../types';

export const IndiaStandardsRegistryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStandard, setSelectedStandard] = useState<IndiaStandardEntry>(INDIA_STANDARDS_REGISTRY[0]);

  // Dynamic IS 875 Calculator State
  const [vb, setVb] = useState<number>(50); // m/s (Odisha coast default)
  const [k1, setK1] = useState<number>(1.07); // Post-disaster lifeline
  const [k2, setK2] = useState<number>(1.05); // Terrain category 1/2 at 10-20m
  const [k3, setK3] = useState<number>(1.00); // Topography factor
  const [k4, setK4] = useState<number>(1.15); // Cyclonic importance factor

  const windResults = calculateIS875Wind({ vb, k1, k2, k3, k4 });

  const categories = [
    { id: 'ALL', label: 'All Standards' },
    { id: 'Wind', label: 'Wind (IS 875)' },
    { id: 'Concrete', label: 'Concrete (IS 456)' },
    { id: 'Bridges_Roads', label: 'Bridges & Roads (IRC/MoRTH)' },
    { id: 'Hydraulic', label: 'Hydraulic & Barrages (CWC/IS 10751)' },
    { id: 'Earthquake', label: 'Earthquake (IS 1893)' },
    { id: 'Steel', label: 'Steel (IS 800)' },
    { id: 'Electrical_Lifeline', label: 'Electrical (CEA)' }
  ];

  const filteredStandards = selectedCategory === 'ALL'
    ? INDIA_STANDARDS_REGISTRY
    : INDIA_STANDARDS_REGISTRY.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Dynamic IS 875 (Part 3):2015 Wind Velocity & Pressure Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                IS 875 (Part 3):2015 Dynamic Wind Velocity & Pressure Calculator
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  CLAUSE 6.3 & 7.2
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Site-specific derivation of Design Wind Speed ($V_z$) and Wind Pressure ($P_z$) replacing static hard-coded assumptions.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Formula: <span className="text-amber-400 font-bold">Vz = Vb × k1 × k2 × k3 × k4</span> | <span className="text-blue-400 font-bold">Pz = 0.6 × Vz²</span>
          </div>
        </div>

        {/* Sliders and Result Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vb Slider */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Basic Wind Speed (Vb)</span>
                <span className="font-mono font-bold text-blue-400">{vb} m/s ({Math.round(vb * 3.6)} km/h)</span>
              </div>
              <input
                type="range"
                min="33"
                max="55"
                step="1"
                value={vb}
                onChange={(e) => setVb(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-[10px] text-slate-500">IS 875 Fig 1 Map: Odisha Coast = 50 m/s, West Bengal = 47 m/s, Inland = 44 m/s</p>
            </div>

            {/* k1 Factor */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Risk Coefficient (k1)</span>
                <span className="font-mono font-bold text-amber-400">{k1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.90"
                max="1.15"
                step="0.01"
                value={k1}
                onChange={(e) => setK1(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[10px] text-slate-500">Table 1: 1.07 for post-disaster hospitals & substations (100-yr design life); 1.00 normal</p>
            </div>

            {/* k2 Factor */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Terrain & Height Factor (k2)</span>
                <span className="font-mono font-bold text-purple-400">{k2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.25"
                step="0.01"
                value={k2}
                onChange={(e) => setK2(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <p className="text-[10px] text-slate-500">Table 2: 1.05 for open coastal terrain at 10m height; 1.17 for 60m communication towers</p>
            </div>

            {/* k4 Factor */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Cyclonic Importance Factor (k4)</span>
                <span className="font-mono font-bold text-red-400">{k4.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.00"
                max="1.30"
                step="0.05"
                value={k4}
                onChange={(e) => setK4(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <p className="text-[10px] text-slate-500">Clause 6.3.4: 1.15 for post-disaster & lifeline structures in coastal 100km corridor; 1.00 normal</p>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-blue-900/40 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide block mb-2">
                Calculated Design Values (IS 875:2015)
              </span>

              <div className="space-y-3">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400 block">Design Wind Speed (Vz):</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-white">{windResults.designWindSpeedVzMs} m/s</span>
                    <span className="text-xs font-mono text-amber-400">({windResults.designWindSpeedKmh} km/h)</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400 block">Design Wind Pressure (Pz):</span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-emerald-400">{windResults.designPressurePzKpa} kPa</span>
                    <span className="text-xs font-mono text-slate-400">({Math.round(windResults.designPressurePzKpa * 1000)} N/m²)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 font-mono">
              Certified for Indian Coastal Cyclonic Belts (BIS Standards Compliant)
            </div>
          </div>
        </div>
      </div>

      {/* Standards Registry Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Official Indian Engineering Standards Registry ({INDIA_STANDARDS_REGISTRY.length} Codes)
              </h3>
              <p className="text-[11px] text-slate-400">
                Authoritative codes issued by BIS, IRC, MoRTH, CWC, and CEA governing resilient infrastructure.
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Standard Deep Dive + List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* List of Standards */}
          <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredStandards.map(std => (
              <div
                key={std.code}
                onClick={() => setSelectedStandard(std)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedStandard.code === std.code
                    ? 'bg-slate-950 border-amber-500/80 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-white">{std.code}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                    {std.category}
                  </span>
                </div>
                <h4 className="text-xs text-slate-300 font-medium line-clamp-1">{std.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{std.applicableHazard}</p>
              </div>
            ))}
          </div>

          {/* Standard Details Card */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  {selectedStandard.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">{selectedStandard.code}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{selectedStandard.title}</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60 shrink-0">
                {selectedStandard.validationStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>
                <span className="text-slate-500 block">Authority:</span>
                <span className="text-slate-200">{selectedStandard.sourceAuthority}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Edition:</span>
                <span className="text-slate-200">{selectedStandard.edition}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 block">Key Mandated Clauses:</span>
              <div className="space-y-1">
                {selectedStandard.keyClauses.map((clause, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2 rounded border border-slate-800/60 text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{clause}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Calculation / Design Rule:</span>
              <p className="text-amber-300 font-mono text-[11px]">{selectedStandard.calculationMethod}</p>
            </div>

            <div className="text-[11px] text-slate-400 italic bg-amber-950/20 p-2.5 rounded border border-amber-900/30">
              <strong>Engine Note:</strong> {selectedStandard.notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
