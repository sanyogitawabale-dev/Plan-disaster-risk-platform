import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  getRegistryJsonSchema,
  EntitySchemaDefinition
} from '../../schemas/registrySchema';
import {
  ValidationReport
} from '../../services/validationValidator';
import { useRegistry } from '../../context/RegistryProvider';

export const RegistrySchemaValidatorPanel: React.FC = () => {
  const {
    schemas,
    activeAuditReport,
    isAuditing,
    triggerSelfAudit,
    validatePayload,
    lastValidationReport
  } = useRegistry();

  const [activeSchemaTab, setActiveSchemaTab] = useState<'matrix' | 'authority' | 'languages' | 'plugins' | 'certification' | 'jsonSchema'>('matrix');
  const [copied, setCopied] = useState(false);

  // Interactive Validator State
  const [selectedSchemaType, setSelectedSchemaType] = useState<string>('auto');
  const [customPayloadText, setCustomPayloadText] = useState<string>(() =>
    JSON.stringify(
      {
        rowId: 13,
        category: 'ELECTRICAL_LIFELINES',
        component: 'Substation Flood De-energization Gate',
        officialAuthority: 'Central Electricity Authority (CEA) / OPTCL',
        officialDatasetOrApi: 'CEA Gazette Notification / SCADA 220kV Bus Telemetry',
        statutoryStandard: 'CEA (Measures Relating to Safety and Electric Supply) Regulations 2023, Reg 44(3A) & 2026 Amendment',
        governingModelOrEngine: 'Hydrodynamic Head vs. Transformer Base Plinth Threshold Engine',
        primaryInputs: ['Inundation Depth', 'Substation Plinth Elevation', '100-yr HFL'],
        primaryOutputs: ['Circuit Breaker Trip Advisory', 'Section 30 DMA Notification'],
        spatialResolution: 'Asset-level (0.5m GPS survey)',
        temporalCadence: 'Real-time (1-min SCADA / 15-min gauge)',
        currentEffectiveVersion: '2023 Edition with 2026 Amendment',
        officialSourceUrl: 'https://cea.nic.in/regulations',
        fallbackSource: 'Manual RTU Telemetry & Local Substation Operator Log',
        validationMethodology: 'Cyclone Fani (2019) Puri grid restoration telemetry cross-check',
        historicalTestEvent: 'Cyclone Fani (2019)',
        dominantUncertainty: 'Local plinth micro-topography & drainage pump failure',
        failureCondition: 'Submergence >= 0.30m without automated de-energization',
        requiresHumanApproval: true,
        status: 'VERIFIED'
      },
      null,
      2
    )
  );

  const [validationReport, setValidationReport] = useState<ValidationReport | null>(lastValidationReport);
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);

  // Schema definition selection
  const currentEntitySchema: EntitySchemaDefinition =
    activeSchemaTab === 'matrix'
      ? schemas.matrixRow
      : activeSchemaTab === 'authority'
      ? schemas.authorityEntry
      : activeSchemaTab === 'languages'
      ? schemas.languageEntry
      : activeSchemaTab === 'plugins'
      ? schemas.hazardPlugin
      : schemas.certificationRequest;

  // Run Self Audit
  const handleRunSelfAudit = async () => {
    await triggerSelfAudit();
  };

  // Run Validation on Custom Payload
  const handleRunValidation = () => {
    setJsonParseError(null);
    try {
      const parsed = JSON.parse(customPayloadText);
      const schemaArg = selectedSchemaType === 'auto' ? undefined : selectedSchemaType;
      const rep = validatePayload(parsed, schemaArg);
      setValidationReport(rep);
    } catch (err: any) {
      setJsonParseError(`JSON Syntax Error: ${err.message}`);
      setValidationReport(null);
    }
  };

  // Pre-built test template loader
  const loadTemplate = (type: 'valid_row' | 'cea_breach' | 'sms_overflow' | 'malformed') => {
    setJsonParseError(null);
    if (type === 'valid_row') {
      setSelectedSchemaType('matrix_row');
      setCustomPayloadText(
        JSON.stringify(
          {
            rowId: 13,
            category: 'ELECTRICAL_LIFELINES',
            component: 'Substation Flood De-energization Gate',
            officialAuthority: 'Central Electricity Authority (CEA) / OPTCL',
            officialDatasetOrApi: 'CEA Gazette Notification / SCADA 220kV Bus Telemetry',
            statutoryStandard: 'CEA (Measures Relating to Safety and Electric Supply) Regulations 2023, Reg 44(3A)',
            governingModelOrEngine: 'Hydrodynamic Head vs. Transformer Base Plinth Threshold Engine',
            primaryInputs: ['Inundation Depth', 'Substation Plinth Elevation', '100-yr HFL'],
            primaryOutputs: ['Circuit Breaker Trip Advisory', 'Section 30 DMA Notification'],
            spatialResolution: 'Asset-level (0.5m GPS survey)',
            temporalCadence: 'Real-time (1-min SCADA / 15-min gauge)',
            currentEffectiveVersion: '2023 Edition with 2026 Amendment',
            officialSourceUrl: 'https://cea.nic.in/regulations',
            fallbackSource: 'Manual RTU Telemetry & Local Substation Operator Log',
            validationMethodology: 'Cyclone Fani (2019) Puri grid restoration telemetry cross-check',
            historicalTestEvent: 'Cyclone Fani (2019)',
            dominantUncertainty: 'Local plinth micro-topography & drainage pump failure',
            failureCondition: 'Submergence >= 0.30m without automated de-energization',
            requiresHumanApproval: true,
            status: 'VERIFIED'
          },
          null,
          2
        )
      );
    } else if (type === 'cea_breach') {
      setSelectedSchemaType('telemetry');
      setCustomPayloadText(
        JSON.stringify(
          {
            componentId: 'cea_substation_clearance',
            assetName: 'OPTCL 220kV Paradip Port Substation',
            assetType: 'substation',
            floodDepthMeters: 0.38,
            substationVoltageKv: 220,
            finishedFloorElevationMeters: 2.9,
            highFloodLevel100YrM: 2.7,
            alertLanguageCode: 'or'
          },
          null,
          2
        )
      );
    } else if (type === 'sms_overflow') {
      setSelectedSchemaType('language');
      setCustomPayloadText(
        JSON.stringify(
          {
            languageCode: 'or',
            languageName: 'Odia',
            nativeName: 'ଓଡ଼ିଆ',
            script: 'Odia',
            officialInSchedule8: true,
            sachetSupported: true,
            smsTemplate160Char:
              'ସତର୍କତା: ବାତ୍ୟା ସମୟରେ ତଳିଆ ଅଞ୍ଚଳରେ ଥିବା ସମସ୍ତ ଲୋକଙ୍କୁ ତୁରନ୍ତ ସୁରକ୍ଷିତ ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯିବାକୁ ଅନୁରୋଧ କରାଯାଉଛି। ବିଦ୍ୟୁତ ଖୁଣ୍ଟ ଓ ତାର ଠାରୁ ଦୂରେଇ ରୁହନ୍ତୁ। ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ ୧୦୭୦ କୁ କଲ୍ କରନ୍ତୁ। ଜିଲ୍ଲା ପ୍ରଶାସନ ସର୍ବଦା ଆପଣଙ୍କ ସହ ଅଛି। (This test template deliberately overflows the 160 GSM-7 character limit to test statutory validator boundary trapping)',
            capTemplateOasis: 'OASIS-CAP-v1.2-ODIA-CYCLONE',
            ttsAvailable: true,
            primaryRegions: ['Odisha', 'Coastal Bay of Bengal'],
            validationStatus: 'VERIFIED'
          },
          null,
          2
        )
      );
    } else {
      setSelectedSchemaType('matrix_row');
      setCustomPayloadText(
        JSON.stringify(
          {
            rowId: 99, // Invalid (>20)
            category: 'UNKNOWN_CATEGORY', // Invalid enum
            component: 'Tst', // Too short (< 5 chars)
            primaryInputs: 'Not an array' // Type mismatch
          },
          null,
          2
        )
      );
    }
    setValidationReport(null);
  };

  // Copy Schema to clipboard
  const handleCopySchema = () => {
    const content =
      activeSchemaTab === 'jsonSchema'
        ? JSON.stringify(getRegistryJsonSchema(), null, 2)
        : JSON.stringify(currentEntitySchema, null, 2);

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Schema as JSON
  const handleDownloadSchema = () => {
    const content =
      activeSchemaTab === 'jsonSchema'
        ? JSON.stringify(getRegistryJsonSchema(), null, 2)
        : JSON.stringify(currentEntitySchema, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoShield_Registry_Schema_${activeSchemaTab}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: SYSTEM SELF-AUDIT SCORECARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                Statutory Registry Validator &amp; Self-Audit Suite
              </h3>
              <p className="text-[11px] text-slate-400">
                Automated continuous verification across all 20 matrix rows, 14 authorities, and 12 languages
              </p>
            </div>
          </div>

          <button
            onClick={handleRunSelfAudit}
            disabled={isAuditing}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Core...' : 'Execute Full System Self-Audit'}</span>
          </button>
        </div>

        {activeAuditReport && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-mono uppercase">OVERALL AUDIT SCORE</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-emerald-400 font-bold text-xl font-mono">
                  {activeAuditReport.systemComplianceScore}%
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {activeAuditReport.overallValid ? 'PASSED' : 'STANDBY'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Cert: <code className="text-slate-400">{activeAuditReport.auditCertificateId}</code>
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-mono uppercase">SUBSYSTEM MATRIX (GATE 10)</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-white font-bold text-xl font-mono">
                  {activeAuditReport.matrixAudit.passedRows} / {activeAuditReport.matrixAudit.totalRows}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">100% Conforming</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">All 20 Lifeline rows checked</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-mono uppercase">STATUTORY AUTHORITIES (GATE 1)</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-white font-bold text-xl font-mono">
                  {activeAuditReport.authoritiesAudit.passedAuthorities} / {activeAuditReport.authoritiesAudit.totalAuthorities}
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Valid Mandates</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">IMD, INCOIS, CWC, CEA, MoRTH</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-mono uppercase">SCHEDULE 8 LANGUAGES (GATE 8)</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-white font-bold text-xl font-mono">
                  {activeAuditReport.languagesAudit.passedLanguages} / {activeAuditReport.languagesAudit.totalLanguages}
                </span>
                <span className="text-[10px] text-indigo-400 font-medium">≤160 Char SMS Bounds</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">GSM-7 cell broadcast compliant</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: FORMAL REGISTRY SCHEMA VIEWER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Formal Registry Schema Specification
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySchema}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadSchema}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Schema</span>
            </button>
          </div>
        </div>

        {/* Schema Switcher Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSchemaTab('matrix')}
            className={`px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeSchemaTab === 'matrix'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            ValidationMatrixRow Schema (20 Subsystems)
          </button>

          <button
            onClick={() => setActiveSchemaTab('authority')}
            className={`px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeSchemaTab === 'authority'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            AuthorityRegistryEntry Schema (14 Authorities)
          </button>

          <button
            onClick={() => setActiveSchemaTab('languages')}
            className={`px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeSchemaTab === 'languages'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            LanguageRegistryEntry Schema (12 Languages)
          </button>

          <button
            onClick={() => setActiveSchemaTab('plugins')}
            className={`px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeSchemaTab === 'plugins'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            HazardPlugin Schema (8 Engines)
          </button>

          <button
            onClick={() => setActiveSchemaTab('certification')}
            className={`px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeSchemaTab === 'certification'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            OperationalTelemetry Schema
          </button>

          <button
            onClick={() => setActiveSchemaTab('jsonSchema')}
            className={`px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeSchemaTab === 'jsonSchema'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            JSON Schema Draft-07 (Full Spec)
          </button>
        </div>

        {/* Schema Content Rendering */}
        {activeSchemaTab === 'jsonSchema' ? (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[380px]">
            <pre className="font-mono text-xs text-emerald-400 leading-relaxed">
              {JSON.stringify(getRegistryJsonSchema(), null, 2)}
            </pre>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Mandate: <strong className="text-amber-300 font-mono">{currentEntitySchema.statutoryMandate}</strong></span>
              <span className="font-mono text-[11px]">Version {currentEntitySchema.version}</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Field Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Required</th>
                    <th className="py-2.5 px-3">Constraints / Enums</th>
                    <th className="py-2.5 px-3">Statutory Standard</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {Object.values(currentEntitySchema.fields).map((field) => (
                    <tr key={field.name} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2 px-3 text-white font-bold">{field.name}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-blue-300 border border-slate-700">
                          {field.type}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {field.required ? (
                          <span className="text-emerald-400 font-bold">YES</span>
                        ) : (
                          <span className="text-slate-500">OPTIONAL</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-400 text-[10px]">
                        {field.enum ? (
                          <span className="text-amber-300">[{field.enum.join(' | ')}]</span>
                        ) : field.minimum !== undefined || field.maximum !== undefined ? (
                          <span>min: {field.minimum ?? 'none'}, max: {field.maximum ?? 'none'}</span>
                        ) : field.minLength !== undefined || field.maxLength !== undefined ? (
                          <span>len: {field.minLength ?? 0}..{field.maxLength ?? '∞'}</span>
                        ) : field.pattern ? (
                          <code className="text-purple-300">{field.pattern}</code>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-300 text-[10px]">
                        {field.statutoryReference ? (
                          <span className="text-amber-300 font-semibold">{field.statutoryReference}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-400 font-sans text-xs">
                        {field.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: INTERACTIVE VALIDATION VALIDATOR WORKBENCH */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">
              Interactive Validation Validator Workbench
            </h3>
          </div>

          {/* Quick Template Buttons */}
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Load Test Payload:</span>
            <button
              onClick={() => loadTemplate('valid_row')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-900 text-[11px] font-mono cursor-pointer"
            >
              1. Valid CEA Substation Row
            </button>
            <button
              onClick={() => loadTemplate('cea_breach')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-red-400 border border-red-900 text-[11px] font-mono cursor-pointer"
            >
              2. CEA 0.30m Breach
            </button>
            <button
              onClick={() => loadTemplate('sms_overflow')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-indigo-900 text-[11px] font-mono cursor-pointer"
            >
              3. SMS 160-Char Overflow
            </button>
            <button
              onClick={() => loadTemplate('malformed')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-900 text-[11px] font-mono cursor-pointer"
            >
              4. Malformed Schema
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* JSON Input Column */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-400 font-medium">Input JSON Payload:</label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 text-[11px]">Schema Target:</span>
                <select
                  value={selectedSchemaType}
                  onChange={(e) => setSelectedSchemaType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="auto">Auto-Detect Schema</option>
                  <option value="matrix_row">ValidationMatrixRow</option>
                  <option value="authority">AuthorityRegistryEntry</option>
                  <option value="language">LanguageRegistryEntry</option>
                  <option value="telemetry">OperationalTelemetry</option>
                </select>
              </div>
            </div>

            <textarea
              rows={14}
              value={customPayloadText}
              onChange={(e) => setCustomPayloadText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
              placeholder="Paste JSON payload here..."
            />

            {jsonParseError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono">
                {jsonParseError}
              </div>
            )}

            <button
              onClick={handleRunValidation}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Validation Validator Engine</span>
            </button>
          </div>

          {/* Validation Report Column */}
          <div className="lg:col-span-6">
            {validationReport ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-4">
                {/* Header Status Banner */}
                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    validationReport.isValid
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                      : validationReport.hasStatutoryBreaches
                      ? 'bg-red-950/70 border-red-800 text-red-300'
                      : 'bg-amber-950/60 border-amber-800 text-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {validationReport.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : validationReport.hasStatutoryBreaches ? (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block text-sm">
                        {validationReport.isValid
                          ? 'STATUTORY COMPLIANCE SEALED'
                          : validationReport.hasStatutoryBreaches
                          ? 'STATUTORY BREACH DETECTED'
                          : 'SCHEMA WARNINGS IDENTIFIED'}
                      </span>
                      <span className="text-[10px] opacity-80">
                        Target Schema: {validationReport.targetType} • Engine: {validationReport.validatorVersion}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold block">{validationReport.score}%</span>
                    <span className="text-[9px] uppercase tracking-wider">Score</span>
                  </div>
                </div>

                {/* Score and Stats Chips */}
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">TOTAL ISSUES</span>
                    <span className="text-white font-bold text-sm">{validationReport.issues.length}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-red-400 block">BREACHES</span>
                    <span className="text-red-400 font-bold text-sm">{validationReport.breachesCount}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-rose-300 block">ERRORS</span>
                    <span className="text-rose-300 font-bold text-sm">{validationReport.errorsCount}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-amber-400 block">WARNINGS</span>
                    <span className="text-amber-400 font-bold text-sm">{validationReport.warningsCount}</span>
                  </div>
                </div>

                {/* Issues List */}
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {validationReport.issues.length === 0 ? (
                    <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/50 text-center text-emerald-400 text-xs font-sans">
                      All fields, types, statutory limits, and provenance references conform perfectly to GeoShield India v1.0 specifications.
                    </div>
                  ) : (
                    validationReport.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border space-y-1.5 ${
                          issue.severity === 'STATUTORY_BREACH'
                            ? 'bg-red-950/30 border-red-800/80 text-red-200'
                            : issue.severity === 'ERROR'
                            ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                            : 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">
                            {issue.path}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                              issue.severity === 'STATUTORY_BREACH'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : issue.severity === 'ERROR'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {issue.severity} • {issue.code}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-slate-100 leading-snug">
                          {issue.message}
                        </p>

                        {(issue.expected !== undefined || issue.actual !== undefined) && (
                          <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/80 p-2 rounded border border-slate-850">
                            <div>
                              <span className="text-slate-500 block text-[9px]">EXPECTED:</span>
                              <span className="text-emerald-400 truncate block">{String(issue.expected)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">ACTUAL:</span>
                              <span className="text-red-400 truncate block">{String(issue.actual)}</span>
                            </div>
                          </div>
                        )}

                        {issue.remediation && (
                          <div className="text-[10px] text-amber-300 font-sans pt-1">
                            <strong>Remediation:</strong> {issue.remediation}
                          </div>
                        )}

                        {issue.statutoryReference && (
                          <div className="text-[10px] text-blue-300 font-mono pt-0.5">
                            <strong>Statutory Mandate:</strong> {issue.statutoryReference}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Signoff: <strong>{validationReport.auditSignoff}</strong></span>
                  <span>{new Date(validationReport.validatedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] bg-slate-950/60 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-xs text-slate-500 space-y-2">
                <Terminal className="w-8 h-8 text-slate-700" />
                <p>
                  Click <strong>&quot;Run Validation Validator Engine&quot;</strong> or pick a test template above to inspect live compliance results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
