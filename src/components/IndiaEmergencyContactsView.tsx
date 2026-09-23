import React, { useState } from 'react';
import { PhoneCall, Radio, Shield, Copy, Check, ExternalLink, AlertCircle, Headphones } from 'lucide-react';
import { INDIA_EMERGENCY_CONTACTS } from '../data/indiaDisasterData';

export const IndiaEmergencyContactsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                District Emergency Operations Centre (DEOC) & VHF Radio Directory
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  VERIFIED DIRECTORY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Authoritative emergency control rooms, district toll-free lines, and tactical VHF radio frequencies for the Odisha coastal belt.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300">
              National Unified Hotline: <strong className="text-white">112</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-300">
              State EOC Toll-Free: <strong className="text-white">1070</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              District EOC: <strong className="text-white">1077</strong>
            </span>
          </div>
        </div>

        {/* Tactical VHF Notice */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center space-x-3 text-xs text-slate-300">
          <Radio className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            <strong>OSDMA Tactical VHF Mesh:</strong> In the event of cellular tower grid failure during cyclone landfall, all district emergency dispatches revert to the designated VHF simplex repeaters listed below.
          </span>
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDIA_EMERGENCY_CONTACTS.map((contact) => (
          <div
            key={contact.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  {contact.eocType}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Verified: {contact.lastVerifiedDate}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{contact.authorityName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{contact.district}, {contact.state}</p>
              </div>

              {/* Numbers */}
              <div className="space-y-1.5 pt-1">
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Primary Phone:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-emerald-400">{contact.primaryPhone}</span>
                    <button
                      onClick={() => handleCopy(contact.primaryPhone, `${contact.id}-phone`)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy Number"
                    >
                      {copiedId === `${contact.id}-phone` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Toll-Free Hotline:</span>
                  <span className="font-mono font-bold text-amber-400">{contact.tollFreeNumber}</span>
                </div>

                {contact.vhfRadioChannel && (
                  <div className="bg-slate-950 p-2 rounded border border-orange-950/40 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-orange-400" />
                      VHF Channel:
                    </span>
                    <span className="font-mono text-[11px] text-orange-300 font-semibold truncate max-w-[170px]" title={contact.vhfRadioChannel}>
                      {contact.vhfRadioChannel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">112 Unified Service: YES</span>
              {contact.officialPortalUrl && (
                <a
                  href={contact.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>NIC Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
