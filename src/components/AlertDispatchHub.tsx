import React, { useState, useEffect } from 'react';
import { Send, Radio, ShieldAlert, Check, Copy, MessageSquare, PhoneCall, Globe, FileCode, CheckCircle2, AlertOctagon, TrendingUp, Layers } from 'lucide-react';
import { RoadSegment, EvacuationShelter, StormScenario, RegionalProfile } from '../types';
import { INDIA_LANGUAGE_REGISTRY } from '../data/indiaDisasterData';

interface AlertDispatchHubProps {
  scenario: StormScenario;
  roads: RoadSegment[];
  shelters: EvacuationShelter[];
  hasGeminiKey: boolean;
  regionalProfile?: RegionalProfile;
}

export const AlertDispatchHub: React.FC<AlertDispatchHubProps> = ({
  scenario,
  roads,
  shelters,
  hasGeminiKey,
  regionalProfile = 'INDIA_NDMA'
}) => {
  const isIndia = regionalProfile === 'INDIA_NDMA';
  const [language, setLanguage] = useState<string>(isIndia ? 'Odia' : 'English');
  const [escalationLevel, setEscalationLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [selectedFormat, setSelectedFormat] = useState<'cap_xml' | 'cap_json' | 'sms' | 'whatsapp'>('whatsapp');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Advisory state
  const [advisoryData, setAdvisoryData] = useState(() => isIndia ? {
    headline: '🚨 URGENT: NDMA RED ALERT • Extremely Severe Cyclonic Storm (Mahanadi Delta & Paradip Coast)',
    executiveSummary: 'INCOIS/IMD hydrodynamic modeling projects catastrophic storm surge of +5.4m GTS MSL at T-4.5 hours coinciding with high astronomical tide. Immediate evacuation ordered for Erasama, Kujang, and Paradip coastal sectors.',
    actionDirectives: [
      'MANDATORY EVACUATION: Coastal villages below +5.0m GTS MSL moved to Cyclone Relief Centers (ODRF/NDRF active).',
      'ROAD CUTOFF: SH-12 Cuttack-Paradip expressway submerged at km 48; route all logistics traffic via NH-16 high-level corridor.',
      'SHELTER ACTIVATION: Paradip Multipurpose Cyclone Shelter (+14m, Cap 2,200) and Erasama Center fully operational with 48h food/water reserves and DG sets.',
      'GRID SAFETY: OPTCL 220kV Paradip Substation busbars de-energized at T-3.0h under Standard Operating Procedure.'
    ],
    smsDispatchCopy: 'ଜରୁରୀ ସୂଚନା: ପ୍ରବଳ ବାତ୍ୟା ଦାନା ତୀବ୍ର ହେଉଛି। ପାରାଦୀପ ଏବଂ କେନ୍ଦ୍ରାପଡା ଉପକୂଳରେ ୩.୮ ମିଟର ଉଚ୍ଚ ଜୁଆର ଆଶଙ୍କା। ସମସ୍ତେ ତୁରନ୍ତ ନିକଟସ୍ଥ ବହୁମୁଖୀ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳକୁ ଯାଆନ୍ତୁ। ବିପର୍ଯ୍ୟୟ ନିୟନ୍ତ୍ରଣ କକ୍ଷ: ୧୦୭୭।',
    whatsappTemplate: `*GOVERNMENT OF ODISHA - SPECIAL RELIEF COMMISSIONER / NDMA*\n🚨 *RED ALERT: EXTREMELY SEVERE CYCLONIC STORM*\n\n*EXPECTED LANDFALL:* Paradip Coast (T-4.5 Hours)\n*PROJECTED STORM SURGE:* +5.4 Meters GTS MSL\n*WIND SPEED:* Gusting to 220 km/h\n\n*IMMEDIATE ACTION ORDERS:*\n1. Move to nearest Pucca Cyclone Shelter immediately.\n2. SH-12 Cuttack-Paradip Highway submerged; use NH-16 inland bypass.\n3. Dial 1077 (District EOC) or 112 for emergency rescue.\n\n*OSDMA Live Shelter Tracker:* https://osdma.odisha.gov.in/shelters`
  } : {
    headline: 'URGENT: Category 4 Coastal Surge & Slope Liquefaction Warning • Maple County',
    executiveSummary: 'Hydrodynamic modeling projects peak storm surge of +4.8m MSL at T-5.5 hours. Low-elevation coastal sectors and Route 101 Causeway will sever imminently.',
    actionDirectives: [
      'MANDATORY EVACUATION: Sectors 4 and 7 (Alluvial coastal basin below +4.5m MSL) effective immediately.',
      'ROAD SEVERANCE: Route 101 South Coastal Causeway cordoned at Milepost 12 at T-2.2h. Direct all traffic to Highway 44 Highland Bypass.',
      'SHELTER ACTIVATION: Westbrook Central High School (Elev +18.5m, Cap 850) and St. Jude Complex (Elev +11.2m, Cap 400) fully active with backup gensets.',
      'DE-ENERGIZE: Maple Coastal Substation 4B de-energized at T-3.0h to prevent explosive saltwater arc flash.'
    ],
    smsDispatchCopy: 'EMERGENCY ALERT: Evacuate Maple County Sectors 4 & 7 now due to severe +4.8m storm surge. Route 101 closing. Shelter open at Westbrook HS. Call 911 for aid.',
    whatsappTemplate: `*MAPLE COUNTY EMERGENCY OPERATIONS CENTER*\n🚨 *CRITICAL DISASTER WARNING: CYCLONE MAYA*\n\n*ESTIMATED LANDFALL:* T-5.5 Hours\n*MAX SURGE:* +4.8 Meters MSL\n\n*IMMEDIATE ACTIONS:*\n1. Evacuate Sectors 4 & 7 immediately.\n2. Primary Refuge: Westbrook Central High School (+18.5m elevation).\n3. Avoid Route 101 Causeway — completely impassable.\n\n*EOC Hotline:* 1-800-555-MAPLE\n*Live Shelter Tracker:* https://maple.gov/eoc/shelters`
  });

  // When language is selected in India profile, auto-switch to registry message
  const handleLanguageSelect = (langName: string) => {
    setLanguage(langName);
    if (isIndia) {
      const reg = INDIA_LANGUAGE_REGISTRY.find(l => l.name === langName);
      if (reg) {
        setAdvisoryData(prev => ({
          ...prev,
          smsDispatchCopy: reg.defaultEmergencyMessage,
          whatsappTemplate: `*GOVERNMENT OF ODISHA - SRC / NDMA SACHET*\n🚨 *RED ALERT (${reg.nativeName})*\n\n${reg.defaultEmergencyMessage}\n\n*Control Room Hotline:* 1077 / 112\n*Shelter Portal:* https://osdma.odisha.gov.in`
        }));
      }
    }
  };

  useEffect(() => {
    if (isIndia) {
      handleLanguageSelect('Odia');
    } else {
      setLanguage('English');
    }
  }, [isIndia]);

  const handleGenerateAdvisory = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionName: isIndia ? 'Odisha Coastal District (Paradip / Jagatsinghpur / Kendrapara)' : 'Maple County Coastal & Mountain District',
          hazardType: isIndia ? 'Extremely Severe Cyclonic Storm (BoB) Surge & Inundation' : 'Category 4 Cyclone Surge & Rainfall Slope Failure',
          severity: 'Extreme / Life-Threatening',
          roadCutoffs: roads.map(r => `${r.name} (Cutoff: T-${r.cutoffTimeEtaHours}h)`),
          shelterActivations: shelters.filter(s => s.status === 'active_open').map(s => `${s.name} (Elev: ${s.elevationMsl}m, Cap: ${s.capacity})`),
          targetAudience: isIndia ? 'State Disaster Management Authority, District Magistrates, Panchayats & Citizens' : 'Municipal First Responders & Citizens',
          language
        })
      });

      const data = await response.json();
      if (data.success && data.advisory) {
        setAdvisoryData({
          headline: data.advisory.headline || advisoryData.headline,
          executiveSummary: data.advisory.executiveSummary || advisoryData.executiveSummary,
          actionDirectives: data.advisory.actionDirectives || advisoryData.actionDirectives,
          smsDispatchCopy: data.advisory.smsDispatchCopy || advisoryData.smsDispatchCopy,
          whatsappTemplate: data.advisory.whatsappTemplate || advisoryData.whatsappTemplate
        });
      }
    } catch (err) {
      console.error('Advisory generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateDispatch = () => {
    setDispatchStatus(
      isIndia
        ? 'Dispatching via NDMA SACHET CAP-based alert integration / India CAP profile gateway...'
        : 'Dispatching via OASIS CAP Broadcast & Twilio Carrier Gateway...'
    );
    setTimeout(() => {
      setDispatchStatus(
        isIndia
          ? 'SUCCESS: Broadcast transmitted via NDMA SACHET CAP-based Integrated Alert System (India CAP Profile) to 1,480,000 mobile subscribers via C-DOT Cell Broadcast Service (CBS), AIR Cuttack, and Odisha State DIB network.'
          : 'SUCCESS: Broadcast transmitted to 42,850 registered devices, 14 EOC radio terminals, and 2 municipal webhooks. 0 carrier bounce.'
      );
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const capXmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${isIndia ? 'NDMA-SACHET-ODISHA-2026-CYC-01' : 'GEO-SHIELD-EOC-2026-MAYA-04'}</identifier>
  <sender>${isIndia ? 'control-room@osdma.odisha.gov.in' : 'eoc-director@maplecounty.gov'}</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>${isIndia ? 'Extremely Severe Cyclonic Storm &amp; Coastal Surge' : 'Tropical Cyclone Surge &amp; Debris Flow'}</event>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <headline>${advisoryData.headline}</headline>
    <description>${advisoryData.executiveSummary}</description>
    <instruction>${advisoryData.actionDirectives.join(' ')}</instruction>
    <area>
      <areaDesc>${isIndia ? 'Odisha Coastal District (Paradip, Erasama, Kujang, Mahakalapada)' : 'Maple County Coastal District Sectors 4 and 7'}</areaDesc>
      <polygon>${isIndia ? '20.15,86.40 20.45,86.75 20.65,86.95 20.30,86.60' : '27.72,-81.62 27.85,-81.50 27.95,-81.38 27.74,-81.59'}</polygon>
    </area>
  </info>
</alert>`;

  return (
    <div className="space-y-6">
      {/* Title & Architectural Rationale Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg">
                <Radio className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Automated Early-Warning & Stakeholder Advisory Node
              </h2>
              <span className="text-xs bg-red-950/80 text-red-400 font-mono px-2.5 py-0.5 rounded-full border border-red-800/60">
                OASIS CAP v1.2 / ITU-T X.1303 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              <strong className="text-slate-200">Defensible Architecture:</strong> Raw unformatted WhatsApp messages risk carrier spam blocking and lack legal chain of custody. 
              Our node generates machine-readable <span className="text-red-400 font-mono">OASIS Common Alerting Protocol (CAP)</span> feeds for emergency broadcast authorities (IPAWS/WMO), 
              then translates them into bite-sized, multilingual SMS and WhatsApp dispatches with verified road cutoffs and shelter routing.
            </p>
          </div>

          {/* Controls: Language & Regenerate */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            {isIndia ? (
              <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs max-w-full overflow-x-auto">
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                <span className="text-[10px] text-slate-500 font-mono uppercase px-1">SACHET Lang:</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageSelect(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-amber-300 font-medium text-xs rounded px-2 py-1 outline-none cursor-pointer focus:border-amber-400"
                >
                  {INDIA_LANGUAGE_REGISTRY.map((lang) => (
                    <option key={lang.code} value={lang.name} className="bg-slate-900 text-white">
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                {(['English', 'Spanish', 'Hindi'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      language === lang
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}

            <button
              id="btn-regenerate-advisory"
              onClick={handleGenerateAdvisory}
              disabled={isGenerating}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Tier Alert Escalation Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">Multi-Tier Alert Escalation Protocol</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {regionalProfile === 'INDIA_NDMA' ? '(NDMA / SDMA / SACHET Workflow)' : '(NIMS / ICS Standard)'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-400 font-bold">Current Tier: Level {escalationLevel}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { lvl: 1, name: 'Level 1: Dashboard', desc: 'Internal monitoring & sensor fusion logs' },
            { lvl: 2, name: 'Level 2: Operations', desc: 'Field teams, depot staging, pump pre-checks' },
            { lvl: 3, name: 'Level 3: District Authority', desc: 'Magistrate & DDMA alert notification' },
            { lvl: 4, name: 'Level 4: EOC Activation', desc: 'Inter-agency command center & shelters open' },
            { lvl: 5, name: 'Level 5: Public Broadcast', desc: 'Cell broadcast, siren & emergency SMS' },
          ].map((item) => {
            const isSelected = escalationLevel === item.lvl;
            return (
              <button
                key={item.lvl}
                id={`escalation-level-${item.lvl}`}
                onClick={() => setEscalationLevel(item.lvl as any)}
                className={`p-2 rounded-lg text-left border transition-all ${
                  isSelected
                    ? item.lvl >= 4
                      ? 'bg-red-500/20 border-red-500 text-white'
                      : 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-[11px] font-mono flex items-center justify-between">
                  <span>{item.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Advisory Generator & Live Channel Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Action Directives & Road/Shelter Operational Matrix */}
        <div className="lg:col-span-6 space-y-4">
          {/* Executive Situation Briefing Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Executive Briefing for Municipal Magistrates
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400">Severity: EXTREME</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs leading-relaxed text-slate-200">
              <strong className="text-white block mb-1 text-sm">{advisoryData.headline}</strong>
              <p className="text-slate-400">{advisoryData.executiveSummary}</p>
            </div>

            {/* Tactical Action Directives */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Command Action Directives:
              </span>
              <div className="space-y-2">
                {advisoryData.actionDirectives.map((dir, i) => (
                  <div key={i} className="flex items-start space-x-2.5 p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 border border-red-800 flex items-center justify-center font-bold text-[10px] font-mono shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{dir}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Road Cutoff & Shelter Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Roads Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Road Severance Matrix
              </h4>
              <div className="space-y-2">
                {roads.map(r => (
                  <div key={r.id} className="p-2 bg-slate-950 rounded text-xs border border-slate-800/60">
                    <div className="font-semibold text-slate-200">{r.name}</div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Cutoff: {r.cutoffTimeEtaHours < 10 ? `T-${r.cutoffTimeEtaHours}h` : 'Passable'}</span>
                      <span className={r.status === 'severed' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shelters Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Shelter Activation Matrix
              </h4>
              <div className="space-y-2">
                {shelters.map(s => (
                  <div key={s.id} className="p-2 bg-slate-950 rounded text-xs border border-slate-800/60">
                    <div className="font-semibold text-slate-200">{s.name}</div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Occ: {s.currentOccupancy}/{s.capacity}</span>
                      <span className={s.status === 'compromised' ? 'text-red-400 font-bold' : 'text-teal-400 font-bold'}>
                        {s.status === 'compromised' ? 'EVACUATE' : 'ACTIVE (+18m MSL)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Channel Dispatch Preview (CAP / WhatsApp / SMS) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[500px]">
            {/* Format Selector Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Carrier Dispatch Payloads
                </h3>
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  id="tab-format-whatsapp"
                  onClick={() => setSelectedFormat('whatsapp')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    selectedFormat === 'whatsapp' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  id="tab-format-sms"
                  onClick={() => setSelectedFormat('sms')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    selectedFormat === 'sms' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SMS (160c)
                </button>
                <button
                  id="tab-format-cap"
                  onClick={() => setSelectedFormat('cap_xml')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    selectedFormat === 'cap_xml' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isIndia ? 'CAP XML (NDMA SACHET)' : 'CAP XML (IPAWS)'}
                </button>
              </div>
            </div>

            {/* Payload Viewer */}
            <div className="mt-4 flex-1 flex flex-col">
              {selectedFormat === 'whatsapp' && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="bg-[#0b141a] border border-[#202c33] rounded-xl p-4 text-xs font-sans text-slate-200 flex-1 shadow-inner relative">
                    <div className="text-[10px] text-slate-500 font-mono mb-2">
                      {isIndia ? 'OSDMA / District Collectorate Verified WhatsApp Channel' : 'WhatsApp Business API Payload (EOC Official Verified Channel)'}
                    </div>
                    <div className="bg-[#1f2c34] p-3.5 rounded-lg border border-[#2a3942] text-slate-200 whitespace-pre-line leading-relaxed shadow font-sans">
                      {advisoryData.whatsappTemplate}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>
                      {isIndia
                        ? 'Target Audience: 450,000 Coastal Residents (Paradip, Erasama, Kujang, Mahakalapada)'
                        : 'Target Audience: 42,850 Opt-in Residents in Maple County'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(advisoryData.whatsappTemplate)}
                      className="flex items-center space-x-1 text-amber-400 hover:underline cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Template'}</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedFormat === 'sms' && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 flex-1 relative">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                      <span>
                        {isIndia
                          ? 'C-DOT / NDMA SACHET Cell Broadcast Service (CBS)'
                          : 'Twilio Wireless Emergency Alert (WEA) SMS'}
                      </span>
                      <span className={`${advisoryData.smsDispatchCopy.length > 160 ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                        {advisoryData.smsDispatchCopy.length} / 160 chars
                      </span>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded border border-slate-800 leading-relaxed text-amber-300 font-sans">
                      {advisoryData.smsDispatchCopy}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>
                      {isIndia
                        ? 'Zero network congestion dependency • Geofenced tower broadcast'
                        : 'Cell Broadcast Service (CBS) • Zero network congestion dependency'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(advisoryData.smsDispatchCopy)}
                      className="flex items-center space-x-1 text-amber-400 hover:underline cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy SMS'}</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedFormat === 'cap_xml' && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 flex-1 overflow-x-auto max-h-[340px]">
                    <div className="text-[10px] text-red-400 font-bold mb-2">
                      {isIndia
                        ? 'OASIS Common Alerting Protocol 1.2 (NDMA SACHET CAP-based alert integration / India CAP Profile)'
                        : 'OASIS Common Alerting Protocol 1.2 (FEMA IPAWS compliant)'}
                    </div>
                    <pre className="text-emerald-400">{capXmlPayload}</pre>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Complies with ITU-T Recommendation X.1303</span>
                    <button
                      onClick={() => copyToClipboard(capXmlPayload)}
                      className="flex items-center space-x-1 text-amber-400 hover:underline cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy XML'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Broadcast Trigger Button */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <button
                  id="btn-simulate-dispatch"
                  onClick={handleSimulateDispatch}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Simulate Multi-Agency Emergency Broadcast</span>
                </button>

                {dispatchStatus && (
                  <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/80 rounded-lg text-[11px] text-emerald-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{dispatchStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
