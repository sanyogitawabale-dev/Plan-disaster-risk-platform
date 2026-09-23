import React from 'react';
import {
  Shield,
  AlertTriangle,
  Layers,
  Cpu,
  Send,
  FileText,
  Activity,
  Sliders,
  GitBranch,
  Lock,
  Globe,
  Sparkles,
  Radio,
  FileCheck
} from 'lucide-react';
import { StormScenario, RegionalProfile } from '../types';

export type AppTabType =
  | 'geospatial'
  | 'risk-engine'
  | 'digital-twin'
  | 'simulator'
  | 'governance'
  | 'alerts'
  | 'data-quality'
  | 'validation-lab'
  | 'architecture';

interface HeaderProps {
  scenario: StormScenario;
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  regionalProfile: RegionalProfile;
  setRegionalProfile: (profile: RegionalProfile) => void;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scenario,
  activeTab,
  setActiveTab,
  regionalProfile,
  setRegionalProfile,
  hasGeminiKey
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  GeoShield<span className="text-amber-400">.AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-950/80 text-red-400 border border-red-800/60 rounded-full flex items-center space-x-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>EOC ACTIVE</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {regionalProfile === 'INDIA_NDMA'
                  ? 'National Disaster Management (NDMA / SDMA) • Bay of Bengal Coastal Corridor'
                  : 'Operational Disaster-Risk Intelligence Platform • Maple County EOC'}
              </p>
            </div>
          </div>

          {/* Regional Profile Switcher & Scenario Pill */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Regional Mode Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                id="profile-toggle-global"
                onClick={() => setRegionalProfile('GLOBAL_MAPLE')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center space-x-1 ${
                  regionalProfile === 'GLOBAL_MAPLE'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Global / US Reference Framework (NOAA, ECMWF, FEMA, ASCE 24, NAVD88)"
              >
                <Globe className="w-3 h-3" />
                <span>Global / Maple</span>
              </button>
              <button
                id="profile-toggle-india"
                onClick={() => setRegionalProfile('INDIA_NDMA')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center space-x-1 ${
                  regionalProfile === 'INDIA_NDMA'
                    ? 'bg-orange-950/90 text-orange-300 font-bold border border-orange-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="India NDMA / IMD / CWC / SACHET Profile (IS Standards, Bay of Bengal Corridor)"
              >
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span>India NDMA</span>
              </button>
            </div>

            {/* Storm Status Banner */}
            <div className="hidden xl:flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-amber-400 font-semibold">{scenario.name}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                ETA: <span className="font-mono text-red-400 font-bold">T-{scenario.landfallEtaHours}h</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                Surge: <span className="font-mono text-amber-300 font-bold">+{scenario.projectedSurgeMaxM}m</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80 text-xs">
          <button
            id="nav-tab-geospatial"
            onClick={() => setActiveTab('geospatial')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'geospatial'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Geospatial & Temporal Studio</span>
          </button>

          <button
            id="nav-tab-risk-engine"
            onClick={() => setActiveTab('risk-engine')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'risk-engine'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Dedicated Risk & Uncertainty</span>
          </button>

          <button
            id="nav-tab-digital-twin"
            onClick={() => setActiveTab('digital-twin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'digital-twin'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Digital Twin & Cascades</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'simulator'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Scenario & What-If Lab</span>
          </button>

          <button
            id="nav-tab-governance"
            onClick={() => setActiveTab('governance')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'governance'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Governance & Event Memory</span>
          </button>

          <button
            id="nav-tab-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'alerts'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>OASIS CAP Dispatch</span>
          </button>

          <button
            id="nav-tab-data-quality"
            onClick={() => setActiveTab('data-quality')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'data-quality'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Data Feeds & Quality</span>
          </button>

          <button
            id="nav-tab-validation-lab"
            onClick={() => setActiveTab('validation-lab')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'validation-lab'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-emerald-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>GeoShield India v1.0 Audit Lab</span>
          </button>

          <button
            id="nav-tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'architecture'
                ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                : 'text-amber-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>12-Layer System Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
