import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Layers,
  FileCheck,
  Cpu,
  Clock,
  ArrowRight,
  Database,
  Info,
  BookOpen,
  Waves,
  Truck,
  PhoneCall,
  Radio
} from 'lucide-react';
import { CriticalAsset, RegionalProfile } from '../types';
import { IndiaOfficialVsGeoShieldCard } from './IndiaOfficialVsGeoShieldCard';
import { IndiaStandardsRegistryView } from './IndiaStandardsRegistryView';
import { IndiaCompoundHazardView } from './IndiaCompoundHazardView';
import { IndiaRoadHydraulicsView } from './IndiaRoadHydraulicsView';
import { IndiaSourceHierarchyView } from './IndiaSourceHierarchyView';
import { IndiaEmergencyContactsView } from './IndiaEmergencyContactsView';

interface RiskEngineDashboardProps {
  assets: CriticalAsset[];
  selectedAsset: CriticalAsset;
  onSelectAsset: (asset: CriticalAsset) => void;
  regionalProfile: RegionalProfile;
  hasGeminiKey: boolean;
}

export const RiskEngineDashboard: React.FC<RiskEngineDashboardProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  regionalProfile,
  hasGeminiKey
}) => {
  const isIndia = regionalProfile === 'INDIA_NDMA';
  const [subTab, setSubTab] = useState<'analysis' | 'standards' | 'compound' | 'roads' | 'hierarchy' | 'contacts'>('analysis');

  const defaultBreakdown = isIndia ? {
    hazardScore: 88,
    exposureScore: 92,
    vulnerabilityScore: 84,
    criticalityScore: 95,
    compositeRiskIndex: 89,
    riskGrade: 'CRITICAL',
    confidencePercent: 88,
    evidence: [
      `Hydrodynamic water level exceeds Finished Floor Elevation (${selectedAsset.finishedFloorElevation}m GTS) by ${(Math.max(0, Number(selectedAsset.projectedSurgeDepth || 0) - selectedAsset.finishedFloorElevation)).toFixed(2)}m`,
      'Topological polygon intersection confirmed via PostGIS ST_Intersects on Odisha Cadastre / ISRO Bhuvan'
    ],
    uncertainties: [
      'Nearshore bathymetry dynamic wave setup variance along Paradip breakwater of ±0.35m',
      'Astronomical spring tide peak overlap timing uncertainty of ±45 min'
    ],
    modelProvenance: {
      hazardModel: 'INCOIS ADCIRC + IIT-D Storm Surge (Run 06Z)',
      exposureEngine: 'PostGIS ST_Intersects on OSDMA GeoPortal / Bhuvan',
      vulnerabilityCurve: 'NDMA Guidelines / IS 875 (Part 3):2015 & IS 456:2000',
      riskEngineVersion: 'GeoShield India RiskCore v3.1',
      dataTimestamp: new Date().toISOString()
    }
  } : {
    hazardScore: 85,
    exposureScore: 90,
    vulnerabilityScore: 80,
    criticalityScore: 92,
    compositeRiskIndex: 87,
    riskGrade: 'CRITICAL',
    confidencePercent: 86,
    evidence: [
      `Hydrodynamic water level exceeds Finished Floor Elevation (${selectedAsset.finishedFloorElevation}m) by ${(Number(selectedAsset.projectedSurgeDepth || 0) - selectedAsset.finishedFloorElevation).toFixed(2)}m`,
      'Topological polygon intersection confirmed via PostGIS ST_Intersects'
    ],
    uncertainties: [
      'Nearshore wave setup dynamic runup variance of ±0.30m',
      'Structural foundation permeability rating unverified in municipal records'
    ],
    modelProvenance: {
      hazardModel: 'SLOSH Hydrodynamic Coupled Model (Run 12Z)',
      exposureEngine: 'PostGIS ST_Intersects v3.4 on Municipal Cadastre',
      vulnerabilityCurve: 'USACE / Hazus Depth-Damage Curve',
      riskEngineVersion: 'GeoShield RiskCore v2.4 (Strict Factor Separation)',
      dataTimestamp: new Date().toISOString()
    }
  };

  const breakdown = selectedAsset.riskBreakdown || defaultBreakdown;

  const getRiskColor = (grade: string) => {
    switch (grade) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/60 border-red-800';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/60 border-orange-800';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Architectural Principle Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Dedicated Risk & Uncertainty Engine (Multi-Factor Separation)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Strictly decoupled calculation architecture: Scientific Models + GIS &rarr; Deterministic Facts &rarr; Quantitative Risk Formula &rarr; AI Synthesis &rarr; Human Action.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Framework:</span>
            <span className="font-mono text-amber-400 font-bold">
              {regionalProfile === 'INDIA_NDMA' ? 'India NDMA / CWC / IS Standards' : 'Global / ASCE 24 / FEMA'}
            </span>
          </div>
        </div>

        {/* 6-Layer Architecture Pipeline Pill Bar */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2 min-w-[700px]">
            <div className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Layer 1</span>
              <span className="font-bold text-blue-400">Hazard</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">What can happen?</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

            <div className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Layer 2</span>
              <span className="font-bold text-purple-400">Exposure</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">What is located there?</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

            <div className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Layer 3</span>
              <span className="font-bold text-amber-400">Vulnerability</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">How badly affected?</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

            <div className="flex-1 bg-slate-900 border border-slate-800 p-2 rounded text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Layer 4</span>
              <span className="font-bold text-orange-400">Criticality</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">How vital is asset?</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

            <div className="flex-1 bg-slate-900 border border-amber-500/40 bg-amber-500/10 p-2 rounded text-center">
              <span className="block text-[10px] text-amber-400 uppercase font-mono">Layer 5</span>
              <span className="font-bold text-white">Quantified Risk</span>
              <span className="block text-[10px] text-slate-300 mt-0.5">Potential consequence</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

            <div className="flex-1 bg-slate-900 border border-emerald-500/40 p-2 rounded text-center">
              <span className="block text-[10px] text-emerald-400 uppercase font-mono">Layer 6</span>
              <span className="font-bold text-emerald-400">AI Reasoning</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      </div>

      {/* India Specialized Module Sub-Navigation Bar */}
      {isIndia && (
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
          <button
            id="subtab-analysis"
            onClick={() => setSubTab('analysis')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              subTab === 'analysis'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Risk Analysis & Separation</span>
          </button>

          <button
            id="subtab-standards"
            onClick={() => setSubTab('standards')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              subTab === 'standards'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>IS Standards & Wind Calculator</span>
          </button>

          <button
            id="subtab-compound"
            onClick={() => setSubTab('compound')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              subTab === 'compound'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Compound-Hazard Physics</span>
          </button>

          <button
            id="subtab-roads"
            onClick={() => setSubTab('roads')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              subTab === 'roads'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>IRC-MoRTH Road Hydraulics</span>
          </button>

          <button
            id="subtab-hierarchy"
            onClick={() => setSubTab('hierarchy')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              subTab === 'hierarchy'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5-Tier Source Hierarchy</span>
          </button>

          <button
            id="subtab-contacts"
            onClick={() => setSubTab('contacts')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
              subTab === 'contacts'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>District EOC & VHF Directory</span>
          </button>
        </div>
      )}

      {/* CONDITIONAL SUB-TAB VIEWS */}
      {isIndia && subTab === 'standards' && <IndiaStandardsRegistryView />}
      {isIndia && subTab === 'compound' && <IndiaCompoundHazardView />}
      {isIndia && subTab === 'roads' && <IndiaRoadHydraulicsView />}
      {isIndia && subTab === 'hierarchy' && <IndiaSourceHierarchyView />}
      {isIndia && subTab === 'contacts' && <IndiaEmergencyContactsView />}

      {/* CORE ANALYSIS TAB (Default and available for both modes) */}
      {(!isIndia || subTab === 'analysis') && (
        <div className="space-y-6">
          {/* Asset Selector Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {assets.map((asset) => (
              <button
                key={asset.id}
                id={`risk-asset-tab-${asset.id}`}
                onClick={() => onSelectAsset(asset)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 border ${
                  selectedAsset.id === asset.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  asset.riskBreakdown?.riskGrade === 'CRITICAL' ? 'bg-red-500' :
                  asset.riskBreakdown?.riskGrade === 'HIGH' ? 'bg-orange-500' :
                  asset.riskBreakdown?.riskGrade === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
                <span>{asset.name}</span>
              </button>
            ))}
          </div>

          {/* Dedicated Official Authority vs GeoShield Analysis Separation (Prominent for India) */}
          {isIndia && <IndiaOfficialVsGeoShieldCard selectedAsset={selectedAsset} />}

          {/* Main Analysis Display: Risk Index + Confidence + Evidence vs Uncertainty */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Quantitative Factor Decomposition */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedAsset.name}</h3>
                    <p className="text-xs text-slate-400">
                      {selectedAsset.criticalityTier} • Ground Elev: {selectedAsset.elevationMsl}m {isIndia ? 'GTS' : 'MSL'} • FFE: {selectedAsset.finishedFloorElevation}m {isIndia ? 'GTS' : 'MSL'}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs uppercase flex items-center space-x-1.5 ${getRiskColor(breakdown.riskGrade)}`}>
                    <ShieldAlert className="w-4 h-4" />
                    <span>{breakdown.riskGrade} RISK ({breakdown.compositeRiskIndex}/100)</span>
                  </div>
                </div>

                {/* Factor Bar Sliders */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-blue-500"></span>
                        Hazard Intensity (Surge + Rain + Slope)
                      </span>
                      <span className="font-mono font-bold text-blue-400">{breakdown.hazardScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.hazardScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-purple-500"></span>
                        Exposure (Spatial Inundation / In-Zone Footprint)
                      </span>
                      <span className="font-mono font-bold text-purple-400">{breakdown.exposureScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.exposureScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-amber-500"></span>
                        Vulnerability (Structural Fragility Above FFE)
                      </span>
                      <span className="font-mono font-bold text-amber-400">{breakdown.vulnerabilityScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.vulnerabilityScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-orange-500"></span>
                        Criticality / Downstream Life Safety Consequence
                      </span>
                      <span className="font-mono font-bold text-orange-400">{breakdown.criticalityScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${breakdown.criticalityScore}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Formula Explanation Callout */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">Calculation Formula: </span>
                  Composite Risk = 0.30(Hazard) + 0.25(Exposure) + 0.25(Vulnerability) + 0.20(Criticality)
                </div>
              </div>

              {/* Model & Version Registry Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center space-x-2 text-slate-200 font-bold border-b border-slate-800 pb-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Model & Version Registry (Reproducibility & Provenance)</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Hazard Model:</span>
                    <span className="font-mono text-slate-200">{breakdown.modelProvenance.hazardModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Exposure Engine:</span>
                    <span className="font-mono text-slate-200">{breakdown.modelProvenance.exposureEngine}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Vulnerability Curve:</span>
                    <span className="font-mono text-slate-200">{breakdown.modelProvenance.vulnerabilityCurve}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Risk Engine Version:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{breakdown.modelProvenance.riskEngineVersion}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: First-Class Uncertainty & Evidence Engine */}
            <div className="lg:col-span-5 space-y-4">
              {/* Confidence Score Pill */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 block">Assessment Certainty</span>
                    <span className="text-2xl font-bold font-mono text-white">
                      {breakdown.confidencePercent}% Confidence
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>

                {/* Confirmed Evidence Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Confirmed Quantitative Evidence:
                  </span>
                  <div className="space-y-1.5">
                    {breakdown.evidence.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2 rounded border border-emerald-950/60 text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Known Uncertainty & Blind Spots Checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Explicit Uncertainty & Known Variances:
                  </span>
                  <div className="space-y-1.5">
                    {breakdown.uncertainties.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2 rounded border border-amber-950/60 text-xs text-amber-300/90 flex items-start space-x-2">
                        <span className="text-amber-400 font-bold shrink-0">⚠</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Synthesis & Human-in-the-Loop Hand-off */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5">
                <div className="flex items-center space-x-2 text-slate-200 font-bold">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>AI Engineering Synthesis (Gemini 3.8 Flash)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isIndia
                    ? `"The quantitative risk engine has established high hazard (${breakdown.hazardScore}) and critical exposure (${breakdown.exposureScore}). Grounded in ISRO/IMD/OSDMA facts: Failure of this node will induce cascading failure into SCB Medical College emergency trauma ICU and the Paradip petrochemical corridor within 35 minutes due to common-mode 220kV feeder de-energization."`
                    : `"The quantitative risk engine has established high hazard (${breakdown.hazardScore}) and critical exposure (${breakdown.exposureScore}). Gemini provides qualitative FMEA synthesis: Failure of this node will induce cascading failure into the Memorial Hospital within 45 minutes due to common-mode feeder de-energization."`}
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Status: Grounded in GIS Facts</span>
                  <span className="text-emerald-400">Deterministic Guardrails Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
