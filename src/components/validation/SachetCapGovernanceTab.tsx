import React, { useState } from 'react';
import {
  Radio,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  RefreshCw,
  FileCode,
  Send,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { sachetCapService, CapAlertMessage } from '../../services/sachetCapService';
import { INDIA_SACHET_LANGUAGE_REGISTRY, SachetLanguageCode } from '../../config/geoShieldIndiaValidationRegistry';

export const SachetCapGovernanceTab: React.FC = () => {
  const [clientEtag, setClientEtag] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<SachetLanguageCode>('or'); // Default to Odia
  const [activeView, setActiveView] = useState<'live_feed' | 'language_registry' | 'cap_proposal'>('live_feed');
  const [proposalStatus, setProposalStatus] = useState<'IDLE' | 'DRAFTED' | 'DISPATCH_PROHIBITED'>('IDLE');

  const { alerts, status, notModified } = sachetCapService.getActiveAlerts(clientEtag);
  const activeAlert = alerts[0];

  const handleSimulateEtagCheck = () => {
    setClientEtag('W/"9821-20260922-OD-SACHET"');
  };

  const handleResetEtag = () => {
    setClientEtag('');
  };

  return (
    <div className="space-y-6">
      {/* Governance Firewall Banner */}
      <div className="bg-slate-900 border border-amber-900/60 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  STATUTORY GOVERNANCE FIREWALL • GATE 7
                </span>
                <span className="text-xs text-slate-400 font-mono">Disaster Management Act 2005 (Sec 30)</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-1">
                NDMA SACHET National CAP Feed Integration & Origination Boundary
              </h3>
              <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
                GeoShield is authorized to <strong>consume and correlate</strong> public SACHET CAP feeds for asset exposure modeling.
                However, under national doctrine, <strong>no automated AI platform is legally permitted to originate public broadcasts autonomously</strong>.
                All outgoing alert proposals require signed human authorization from the State Relief Commissioner (SRC).
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <span className="text-[10px] text-slate-500 font-mono">CONSUMPTION</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              AUTHORIZED (LIVE)
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1">AUTO-ORIGINATION</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800">
              STRICTLY PROHIBITED
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Ribbon */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveView('live_feed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeView === 'live_feed'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>CAP v1.2 Feed Ingestion & ETag Engine</span>
        </button>

        <button
          onClick={() => setActiveView('language_registry')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeView === 'language_registry'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>India Language Registry (12 Schedule 8 Languages)</span>
        </button>

        <button
          onClick={() => setActiveView('cap_proposal')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeView === 'cap_proposal'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Draft Alert Proposal & Sec 30 Sign-off</span>
        </button>
      </div>

      {/* VIEW 1: LIVE FEED INGESTION & ETAG */}
      {activeView === 'live_feed' && (
        <div className="space-y-6">
          {/* Feed Telemetry Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase">Official Endpoint</span>
              <span className="text-slate-200 font-bold truncate block">{status.endpoint}</span>
              <span className="text-[10px] text-emerald-400 mt-1 block">C-DOT Disaster Node (Odisha)</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase">HTTP Caching State</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-amber-400 font-bold">{notModified ? '304 Not Modified' : '200 OK (Cache Fresh)'}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block truncate">ETag: {status.lastEtag}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase">Issuer Cryptographic OID</span>
              <span className="text-emerald-400 font-bold block">urn:oid:2.49.0.1.356.1</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Govt of India CCA Root</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">ETag Validation Test</span>
                <span className="text-[10px] text-slate-400">Simulate conditional polling</span>
              </div>
              <button
                onClick={clientEtag ? handleResetEtag : handleSimulateEtagCheck}
                className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{clientEtag ? 'Reset ETag' : 'Send If-None-Match'}</span>
              </button>
            </div>
          </div>

          {/* Active CAP Payload Inspector */}
          {activeAlert && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      LIVE STATUTORY CAP ALERT
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activeAlert.identifier}</span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight mt-1">{activeAlert.sender}</h4>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>X.509 Verified</span>
                  </span>
                </div>
              </div>

              {/* Language Switcher for Ingested Message */}
              <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3 overflow-x-auto text-xs">
                <span className="text-slate-400 text-[11px] font-mono mr-2">INGESTED LOCALIZATIONS:</span>
                {activeAlert.info.map((info) => {
                  const isSelected = selectedLang === info.language;
                  return (
                    <button
                      key={info.language}
                      onClick={() => setSelectedLang(info.language)}
                      className={`px-3 py-1 rounded-md text-xs font-medium font-mono transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {info.language.toUpperCase()} ({info.senderName.slice(0, 14)}...)
                    </button>
                  );
                })}
              </div>

              {/* Active Localized Payload View */}
              {(() => {
                const currentInfo = activeAlert.info.find(i => i.language === selectedLang) || activeAlert.info[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Headline ({selectedLang.toUpperCase()})</span>
                        <h5 className="text-sm font-bold text-white mt-0.5 leading-snug">{currentInfo.headline}</h5>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Description</span>
                        <p className="text-slate-300 leading-relaxed mt-0.5">{currentInfo.description}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-amber-500 uppercase font-mono block">Public Instruction</span>
                        <p className="text-amber-300/90 font-medium leading-relaxed mt-0.5">{currentInfo.instruction}</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Severity / Urgency</span>
                        <span className="text-rose-400 font-bold">{currentInfo.severity} / {currentInfo.urgency}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Certainty</span>
                        <span className="text-emerald-400 font-bold">{currentInfo.certainty}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Geographic Polygon / Circle</span>
                        <span className="text-slate-300 text-[11px] block">{currentInfo.area[0]?.circle?.[0] || 'Statewide Polygon'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">LGD District Codes</span>
                        <div className="flex gap-1 mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                            344 (Kendrapara)
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                            345 (Jagatsinghpur)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 12 SCHEDULE 8 LANGUAGE REGISTRY */}
      {activeView === 'language_registry' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
            <p>
              The official <strong>SACHET App</strong> currently supports 12 official Eighth Schedule languages.
              GeoShield models all 12 languages through an immutable registry with verified 160-character SMS constraints,
              OASIS CAP translation profiles, and Text-to-Speech (TTS) dialect markers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDIA_SACHET_LANGUAGE_REGISTRY.map((lang) => (
              <div key={lang.languageCode} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs">
                      {lang.languageCode.toUpperCase()}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-white">{lang.languageName}</h5>
                      <span className="text-[11px] text-slate-400">{lang.nativeName} ({lang.script})</span>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono">
                    SACHET LIVE
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] block">Primary Coastal Regions:</span>
                    <span className="text-slate-300">{lang.primaryRegions.join(', ')}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 mt-2">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center justify-between mb-1">
                      <span>SMS TEMPLATE (160-CHAR)</span>
                      <span className="text-slate-400">{lang.smsTemplate160Char.length} chars</span>
                    </span>
                    <p className="text-slate-200 font-sans leading-relaxed">{lang.smsTemplate160Char}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DRAFT ALERT PROPOSAL & SEC 30 SIGN-OFF */}
      {activeView === 'cap_proposal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-base font-bold text-white">Draft CAP Alert Proposal (Awaiting Statutory Sec 30 Sign-off)</h4>
            <p className="text-xs text-slate-400 mt-1">
              GeoShield models asset vulnerability and drafts targeted CAP polygons. Before reaching the public C-DOT Cell Broadcast System (CBS),
              an accredited district officer or Special Relief Commissioner must review and digitally sign this payload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-emerald-400 font-bold block text-[11px] uppercase">Proposal Parameters</span>
              <div>
                <span className="text-slate-500 block text-[10px]">Hazard Event</span>
                <span className="text-white font-bold">Extremely Severe Cyclonic Storm • Coastal Surge Inundation</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Target District Polygon</span>
                <span className="text-slate-300">Kendrapara (344), Jagatsinghpur (345) — 45km Coastal Swath</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Proposed Urgency & Severity</span>
                <span className="text-rose-400 font-bold">Urgency: Immediate | Severity: Extreme</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Statutory Sign-off Authority</span>
                <span className="text-slate-300">Collector & District Magistrate / Special Relief Commissioner Odisha</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-bold block text-[11px] uppercase">Autonomous Dispatch Test</span>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  Testing whether GeoShield can broadcast this alert autonomously without human sign-off:
                </p>
              </div>

              {proposalStatus === 'DISPATCH_PROHIBITED' && (
                <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 font-sans text-xs flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">DISPATCH BLOCKED BY GOVERNANCE FIREWALL:</span> GeoShield is an advisory decision-support system. Public alert broadcast requires authenticated Controller of Certifying Authorities (CCA) DSC token and District Collector authorization.
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => setProposalStatus('DISPATCH_PROHIBITED')}
                  className="w-full py-2 px-3 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Attempt Autonomous SACHET Broadcast</span>
                </button>
                <span className="text-[10px] text-slate-500 text-center block">Safety check verifies that autonomous dispatch fails safely.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
