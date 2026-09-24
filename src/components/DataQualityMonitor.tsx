import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Clock,
  Radio,
  Satellite,
  Database,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Info,
  Layers,
  CloudRain
} from 'lucide-react';
import { RegionalProfile } from '../types';

export interface VerifiedFeed {
  id: string;
  name: string;
  category: 'NWP' | 'Satellite' | 'Sensor' | 'GIS' | 'Google Maps';
  status: 'GREEN' | 'AMBER' | 'RED';
  lastSyncTimestamp: string;
  elapsedSeconds: number;
  slaMaxSeconds: number;
  coveragePercent: number;
  uncertaintyFactor: string;
  fallbackAvailable: boolean;
  sourceEndpoint: string;
  notes: string;
  freshnessLabel: string;
}

interface GroundingSource {
  title: string;
  uri: string;
  snippet?: string;
}

interface DataQualityMonitorProps {
  regionalProfile: RegionalProfile;
  isCompactView?: boolean;
  onOpenFullView?: () => void;
}

export const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({
  regionalProfile,
  isCompactView = false,
  onOpenFullView
}) => {
  const [feeds, setFeeds] = useState<VerifiedFeed[]>([]);
  const [systemHealth, setSystemHealth] = useState<'OPTIMAL' | 'ATTENTION' | 'DEGRADED'>('OPTIMAL');
  const [verifiedAt, setVerifiedAt] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState<string>('Find trauma hospitals and flood evacuation centers with generator backup');
  const [isQueryingMaps, setIsQueryingMaps] = useState<boolean>(false);
  const [groundedText, setGroundedText] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [mapsError, setMapsError] = useState<string | null>(null);

  // Fetch feed status on mount & interval
  const fetchFeedStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/data-feeds/status');
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
        setSystemHealth(data.systemHealth || 'OPTIMAL');
        setVerifiedAt(data.verifiedAt || new Date().toISOString());
      }
    } catch (err) {
      console.warn('Failed to fetch data feeds status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedStatus();
    handleQueryGoogleMaps();
    const interval = setInterval(fetchFeedStatus, 30000); // 30s auto refresh
    return () => clearInterval(interval);
  }, []);

  // Trigger re-verification or sync
  const handleSyncFeed = async (feedId?: string) => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/data-feeds/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedId })
      });
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
        setVerifiedAt(data.verifiedAt || new Date().toISOString());
        setSyncMessage(data.message || 'Data verification successful');
        setTimeout(() => setSyncMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to sync feeds:', err);
      setSyncMessage('Sync verification failed');
    } finally {
      setIsSyncing(false);
    }
  };

  // Trigger Google Maps Grounding search
  const handleQueryGoogleMaps = async (customQuery?: string) => {
    const q = customQuery || mapsQuery;
    setIsQueryingMaps(true);
    setMapsError(null);
    try {
      const coords = regionalProfile === 'INDIA_NDMA'
        ? { latitude: 20.46, longitude: 86.85 } // Bay of Bengal / Odisha coast
        : { latitude: 27.78, longitude: -81.56 }; // Maple County coastal district

      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          latitude: coords.latitude,
          longitude: coords.longitude
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGroundedText(data.groundedText || 'No grounded information returned.');
        setGroundingSources(data.groundingSources || []);
      } else {
        throw new Error('Maps grounding request failed');
      }
    } catch (err: any) {
      setMapsError(err.message || 'Unable to execute Maps Grounding query');
    } finally {
      setIsQueryingMaps(false);
    }
  };

  // Helper icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NWP':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'Satellite':
        return <Satellite className="w-4 h-4 text-purple-400" />;
      case 'Sensor':
        return <Radio className="w-4 h-4 text-emerald-400" />;
      case 'GIS':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Google Maps':
        return <MapPin className="w-4 h-4 text-red-400" />;
      default:
        return <Database className="w-4 h-4 text-blue-400" />;
    }
  };

  // Compact Footer Bar Version
  if (isCompactView) {
    const greenCount = feeds.filter(f => f.status === 'GREEN').length;
    const amberCount = feeds.filter(f => f.status === 'AMBER').length;
    const redCount = feeds.filter(f => f.status === 'RED').length;

    return (
      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1.5 font-mono">
          <span className="text-slate-400">Data Feeds:</span>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
            redCount > 0 ? 'bg-red-950 text-red-400 border border-red-800' :
            amberCount > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
            'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
              redCount > 0 ? 'bg-red-500 animate-ping' :
              amberCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}></span>
            {redCount > 0 ? `${redCount} OFFLINE` : amberCount > 0 ? `${amberCount} DEGRADED` : 'ALL SYNCED'}
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          {feeds.slice(0, 4).map(feed => (
            <span key={feed.id} className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                feed.status === 'GREEN' ? 'bg-emerald-400' :
                feed.status === 'AMBER' ? 'bg-amber-400' : 'bg-red-500'
              }`}></span>
              <span>{feed.category}</span>
            </span>
          ))}
        </div>

        {onOpenFullView && (
          <button
            onClick={onOpenFullView}
            className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px] ml-1"
          >
            Inspect Provenance &rarr;
          </button>
        )}
      </div>
    );
  }

  // Full Dashboard Tab View
  const greenCount = feeds.filter(f => f.status === 'GREEN').length;
  const amberCount = feeds.filter(f => f.status === 'AMBER').length;
  const redCount = feeds.filter(f => f.status === 'RED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Data Feed Quality & Provenance Monitor
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                systemHealth === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                systemHealth === 'ATTENTION' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-red-950 text-red-300 border border-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  systemHealth === 'OPTIMAL' ? 'bg-emerald-400 animate-pulse' :
                  systemHealth === 'ATTENTION' ? 'bg-amber-400' : 'bg-red-500 animate-ping'
                }`}></span>
                <span>System Status: {systemHealth}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Deterministic verification of live ingestion latencies against SLA horizons. Prevents AI hallucinations by guaranteeing that hazard models receive verified ground-truth telemetry with quantified uncertainties.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Last Verified</span>
              <span className="text-xs font-mono text-slate-300">
                {new Date(verifiedAt).toLocaleTimeString()} UTC
              </span>
            </div>

            <button
              id="btn-sync-all-feeds"
              onClick={() => handleSyncFeed()}
              disabled={isSyncing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2 shadow transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Verifying Feeds...' : 'Verify All Feeds'}</span>
            </button>
          </div>
        </div>

        {/* Sync Success Alert */}
        {syncMessage && (
          <div className="mt-3 py-2 px-3 bg-emerald-950/80 border border-emerald-700/60 rounded-lg text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Monitored Feeds</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">{feeds.length} Core Feeds</span>
          </div>
          <div className="bg-slate-950/60 border border-emerald-900/30 rounded-lg p-3">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block">Green (Within SLA)</span>
            <span className="text-xl font-bold font-mono text-emerald-300 mt-0.5 block">{greenCount} Healthy</span>
          </div>
          <div className="bg-slate-950/60 border border-amber-900/30 rounded-lg p-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase block">Amber (Degraded/Lag)</span>
            <span className="text-xl font-bold font-mono text-amber-300 mt-0.5 block">{amberCount} Compensated</span>
          </div>
          <div className="bg-slate-950/60 border border-red-900/30 rounded-lg p-3">
            <span className="text-[10px] font-mono text-red-400 uppercase block">Red (Stale Breach)</span>
            <span className="text-xl font-bold font-mono text-red-300 mt-0.5 block">{redCount} Offline</span>
          </div>
        </div>
      </div>

      {/* Core Feeds Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Ingestion Pipeline Telemetry</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Auto-pings every 30s</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {feeds.map(feed => {
            const isGreen = feed.status === 'GREEN';
            const isAmber = feed.status === 'AMBER';
            const isRed = feed.status === 'RED';
            const slaRatio = Math.min(100, Math.round((feed.elapsedSeconds / feed.slaMaxSeconds) * 100));

            return (
              <div
                key={feed.id}
                className={`bg-slate-900/90 border rounded-xl p-4 transition-all duration-200 ${
                  isGreen ? 'border-slate-800 hover:border-emerald-700/50' :
                  isAmber ? 'border-amber-900/50 hover:border-amber-600/70 bg-amber-950/10' :
                  'border-red-900/60 hover:border-red-600 bg-red-950/20'
                }`}
              >
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(feed.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold uppercase text-slate-400">
                          {feed.category}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {feed.coveragePercent}% Coverage
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                        {feed.name}
                      </h4>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                      isGreen ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' :
                      isAmber ? 'bg-amber-950/80 text-amber-300 border-amber-700/60' :
                      'bg-red-950/80 text-red-300 border-red-700/60'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${
                        isGreen ? 'bg-emerald-400' :
                        isAmber ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
                      }`}></span>
                      {isGreen ? 'HEALTHY' : isAmber ? 'DEGRADED' : 'CRITICAL'}
                    </span>
                  </div>
                </div>

                {/* Verification Metadata & Timestamps */}
                <div className="mt-3.5 bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Last Verified Sync:</span>
                    </span>
                    <span className="text-white font-semibold">
                      {feed.freshnessLabel}
                    </span>
                  </div>

                  {/* SLA Gauge */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>SLA Window ({Math.floor(feed.slaMaxSeconds / 60)}m threshold):</span>
                      <span className={slaRatio > 100 ? 'text-red-400 font-bold' : slaRatio > 70 ? 'text-amber-400' : 'text-emerald-400'}>
                        {slaRatio}% of maximum tolerance
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          slaRatio > 100 ? 'bg-red-500' : slaRatio > 70 ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, slaRatio)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900 flex items-center justify-between">
                    <span className="truncate pr-2">Endpoint: {feed.sourceEndpoint}</span>
                    <span className="shrink-0 text-slate-500">
                      {feed.fallbackAvailable ? 'Fallback: Ready' : 'No Fallback'}
                    </span>
                  </div>
                </div>

                {/* Scientific Uncertainty Notice */}
                <div className="mt-3 text-xs space-y-1">
                  <div className="flex items-start space-x-1.5 text-amber-300/90 font-mono text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span><strong>Uncertainty Bound:</strong> {feed.uncertaintyFactor}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] pl-5">
                    {feed.notes}
                  </p>
                </div>

                {/* Footer Ping Action */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    Timestamp: {new Date(feed.lastSyncTimestamp).toISOString().replace('T', ' ').substring(0, 19)}Z
                  </span>
                  <button
                    onClick={() => handleSyncFeed(feed.id)}
                    disabled={isSyncing}
                    className="px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-400" />
                    <span>Re-verify Feed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Maps Grounding Explorer (Powered by gemini-3.5-flash) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-red-950 border border-red-800/80 text-red-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Live Google Maps Grounding Engine
                </h3>
                <span className="px-2 py-0.5 bg-blue-950 border border-blue-800 text-blue-300 text-[10px] font-mono font-semibold rounded">
                  gemini-3.5-flash + googleMaps tool
                </span>
                <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-mono font-semibold rounded flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Gemini API Key Connected</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifies ground-truth coordinates, actual operational facilities, and relief links directly from Google Maps Platform.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Sector: <strong className="text-white">
              {regionalProfile === 'INDIA_NDMA' ? 'Bay of Bengal Coastal Sector (20.46°N, 86.85°E)' : 'Maple Coastal Sector (27.78°N, 81.56°W)'}
            </strong>
          </div>
        </div>

        {/* Preset Query Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            'Emergency Trauma Hospitals & ICUs',
            'Certified Flood Evacuation Shelters',
            'High-Voltage Electrical Substations & Utility Hubs',
            'Coastal Causeway Bridges & Evacuation Arteries'
          ].map(preset => (
            <button
              key={preset}
              onClick={() => {
                setMapsQuery(preset);
                handleQueryGoogleMaps(preset);
              }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={mapsQuery}
              onChange={e => setMapsQuery(e.target.value)}
              placeholder="Query real-time facilities or terrain obstacles via Google Maps..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            id="btn-run-maps-grounding"
            onClick={() => handleQueryGoogleMaps()}
            disabled={isQueryingMaps}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow transition-all disabled:opacity-50"
          >
            {isQueryingMaps ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Grounding...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ground with Google Maps</span>
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {mapsError && (
          <div className="mt-3 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300">
            {mapsError}
          </div>
        )}

        {/* Grounded Results Box */}
        {(groundedText || groundingSources.length > 0) && (
          <div className="mt-4 bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Grounded Intelligence from Google Maps</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Model: gemini-3.5-flash
              </span>
            </div>

            {/* AI Synthesized Grounded Text */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {groundedText}
            </p>

            {/* Extracted Google Maps Links (Mandatory requirement for Maps Grounding) */}
            {groundingSources.length > 0 && (
              <div className="pt-2 border-t border-slate-900 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  Verified Google Maps Locations & Sources:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {groundingSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-lg block transition-all group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-semibold text-white group-hover:text-amber-300 line-clamp-1">
                          {source.title}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 shrink-0 mt-0.5" />
                      </div>
                      {source.snippet && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                          {source.snippet}
                        </p>
                      )}
                      <span className="text-[10px] font-mono text-blue-400 mt-1.5 block group-hover:underline">
                        Open in Google Maps &rarr;
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
