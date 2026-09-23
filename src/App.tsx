import React, { useState, useEffect } from 'react';
import { Header, AppTabType } from './components/Header';
import { GeospatialStudio } from './components/GeospatialStudio';
import { RiskEngineDashboard } from './components/RiskEngineDashboard';
import { DigitalTwinViewer } from './components/DigitalTwinViewer';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { GovernanceAndEventMemory } from './components/GovernanceAndEventMemory';
import { AlertDispatchHub } from './components/AlertDispatchHub';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { DataQualityMonitor } from './components/DataQualityMonitor';
import { ValidationLab } from './components/ValidationLab';
import { RegistryProvider } from './context/RegistryProvider';
import { CURRENT_SCENARIO, MAPLE_COUNTY_ASSETS, ROAD_SEGMENTS, SHELTERS, SAR_HOTSPOTS } from './data/mockDisasterData';
import { INDIA_SCENARIO, INDIA_ASSETS, INDIA_ROADS, INDIA_SHELTERS, INDIA_SAR_HOTSPOTS } from './data/indiaDisasterData';
import { CriticalAsset, RegionalProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('geospatial');
  const [regionalProfile, setRegionalProfile] = useState<RegionalProfile>('INDIA_NDMA');
  const isIndia = regionalProfile === 'INDIA_NDMA';

  const currentScenario = isIndia ? INDIA_SCENARIO : CURRENT_SCENARIO;
  const currentAssets = isIndia ? INDIA_ASSETS : MAPLE_COUNTY_ASSETS;
  const currentRoads = isIndia ? INDIA_ROADS : ROAD_SEGMENTS;
  const currentShelters = isIndia ? INDIA_SHELTERS : SHELTERS;
  const currentSarHotspots = isIndia ? INDIA_SAR_HOTSPOTS : SAR_HOTSPOTS;

  const [selectedAsset, setSelectedAsset] = useState<CriticalAsset>(INDIA_ASSETS[0]);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // Sync selected asset when switching regional profile
  useEffect(() => {
    setSelectedAsset(isIndia ? INDIA_ASSETS[0] : MAPLE_COUNTY_ASSETS[0]);
  }, [isIndia]);

  // Check backend health & Gemini configuration
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setHasGeminiKey(Boolean(data.hasGeminiKey));
        }
      })
      .catch(err => {
        console.warn('Backend health check error:', err);
      });
  }, []);

  const handleSelectAssetForRiskEngine = (asset: CriticalAsset) => {
    setSelectedAsset(asset);
    setActiveTab('risk-engine');
  };

  return (
    <RegistryProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Platform Header */}
        <Header
          scenario={currentScenario}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          regionalProfile={regionalProfile}
          setRegionalProfile={setRegionalProfile}
          hasGeminiKey={hasGeminiKey}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'geospatial' && (
            <GeospatialStudio
              scenario={currentScenario}
              assets={currentAssets}
              roads={currentRoads}
              shelters={currentShelters}
              sarHotspots={currentSarHotspots}
              regionalProfile={regionalProfile}
              onSelectAssetForAudit={handleSelectAssetForRiskEngine}
            />
          )}

          {activeTab === 'risk-engine' && (
            <RiskEngineDashboard
              assets={currentAssets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              regionalProfile={regionalProfile}
              hasGeminiKey={hasGeminiKey}
            />
          )}

          {activeTab === 'digital-twin' && (
            <DigitalTwinViewer
              regionalProfile={regionalProfile}
            />
          )}

          {activeTab === 'simulator' && (
            <ScenarioSimulator
              scenario={currentScenario}
              regionalProfile={regionalProfile}
              hasGeminiKey={hasGeminiKey}
            />
          )}

          {activeTab === 'governance' && (
            <GovernanceAndEventMemory
              regionalProfile={regionalProfile}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertDispatchHub
              scenario={currentScenario}
              roads={currentRoads}
              shelters={currentShelters}
              hasGeminiKey={hasGeminiKey}
              regionalProfile={regionalProfile}
            />
          )}

          {activeTab === 'data-quality' && (
            <DataQualityMonitor
              regionalProfile={regionalProfile}
            />
          )}

          {activeTab === 'validation-lab' && (
            <ValidationLab />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureInspector />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/80 py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-slate-400">GeoShield AI Operational Node v3.8</span>
              <span>•</span>
              <span>
                {regionalProfile === 'INDIA_NDMA'
                  ? 'NDMA / SDMA National Disaster Management System'
                  : 'Maple County EOC Disaster Intelligence'}
              </span>
            </div>

            {/* Integrated Data Quality Status Bar in Footer */}
            <DataQualityMonitor
              regionalProfile={regionalProfile}
              isCompactView={true}
              onOpenFullView={() => setActiveTab('data-quality')}
            />

            <div className="font-mono text-[11px] text-slate-400">
              {regionalProfile === 'INDIA_NDMA'
                ? 'IMD Mausam NWP • CWC Telemetry • Copernicus 30m DEM • SACHET CAP-CP'
                : 'ECMWF IFS NWP • Copernicus 30m DEM • Sentinel-1 InSAR • OASIS CAP v1.2'}
            </div>
          </div>
        </footer>
      </div>
    </RegistryProvider>
  );
}
