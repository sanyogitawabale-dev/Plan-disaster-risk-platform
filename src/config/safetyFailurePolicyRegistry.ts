/**
 * GeoShield India v1.0 — Safety Failure Policy Registry
 *
 * Implements strict "Fail-Closed" vs "Fail-Safe" governing policies across:
 * - Lifeline operations (CEA electrical clearance, MoRTH road culverts)
 * - Data feeds (CWC hydrology, IMD cyclone tracks, INCOIS surge, Sentinel SAR)
 * - Alerting (NDMA SACHET CAP, Section 30 DM Act evacuations)
 * - AI integration (Gemini synthesis fallbacks, regulatory quote verification)
 * - Cryptographic and Temporal constraints (Anti-leakage, Tampering, CRS/Datum)
 *
 * Statutory Alignment:
 * - Disaster Management Act 2005 (Sec 10, Sec 30)
 * - Central Electricity Authority Safety Regulations 2023 Reg 44(3A) & 2026 Amendment
 * - Ministry of Road Transport & Highways (MoRTH) Section 300 Specification
 * - NDMA SACHET Common Alerting Protocol (CAP) Standard
 */

export type FailureBehavior =
  | 'BLOCK_CALCULATION'          // Fail-closed: execution halted, calculation aborted
  | 'BLOCK_CERTIFICATION'        // Fail-closed: statutory certificate refused
  | 'BLOCK_ALERT_DISPATCH'       // Fail-closed: emergency broadcast prevented
  | 'REQUIRE_HUMAN_REVIEW'       // Fail-safe / Governance gate: escalates to Relief Commissioner
  | 'DEGRADE_MODE_RETAIN_DETERMINISTIC' // Graceful fallback: continue deterministic GIS/physics, strip AI
  | 'REDUCE_CONFIDENCE_FLAG'     // Graceful fallback: mark telemetry as degraded, compute uncertainty
  | 'USE_PERMITTED_FALLBACK'     // Fallback: engage secondary licensed source + flag audit trail
  | 'REJECT_ASSET';              // Safety: drop asset from hazardous computation to prevent false safety

export type FailureDomain =
  | 'AI_INFERENCE'
  | 'SATELLITE_OBSERVATION'
  | 'HYDROLOGIC_TELEMETRY'
  | 'SPATIAL_METROLOGY'
  | 'STATUTORY_COMPLIANCE'
  | 'AUTHORITY_CONSENSUS'
  | 'DISASTER_ALERTING'
  | 'CRYPTOGRAPHIC_AUDIT'
  | 'SENSOR_HARDWARE'
  | 'GEOMETRIC_TOPOLOGY';

export interface SafetyPolicyRule {
  policyId: string;
  triggerCondition: string;
  domain: FailureDomain;
  behavior: FailureBehavior;
  statutoryBasis: string;
  failClosedOrSafe: 'FAIL_CLOSED' | 'FAIL_SAFE_DEGRADED';
  actionProtocol: string;
  auditSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const SAFETY_FAILURE_POLICY_REGISTRY: Record<string, SafetyPolicyRule> = {
  AI_API_UNAVAILABLE: {
    policyId: 'POL-01-AI-UNAVAIL',
    triggerCondition: 'Gemini API unreachable, timeout, or rate-limited',
    domain: 'AI_INFERENCE',
    behavior: 'DEGRADE_MODE_RETAIN_DETERMINISTIC',
    statutoryBasis: 'GeoShield AI Independence Directive: LLM is non-essential advisory tier',
    failClosedOrSafe: 'FAIL_SAFE_DEGRADED',
    actionProtocol: 'Bypass LLM synthesis. Retain deterministic hydrodynamic calculations. Flag UI with "AI synthesis unavailable".',
    auditSeverity: 'HIGH'
  },
  AI_DETERMINISTIC_CONFLICT: {
    policyId: 'POL-02-AI-CONFLICT',
    triggerCondition: 'AI advisory contradicts deterministic GIS/hydrodynamic hazard polygon boundary',
    domain: 'AI_INFERENCE',
    behavior: 'DEGRADE_MODE_RETAIN_DETERMINISTIC',
    statutoryBasis: 'CEA Reg 44(3A) & NDMA SOP Gate 12: Deterministic physics supersedes generative tokens',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'AI conclusion explicitly rejected. Deterministic result retained. Conflict recorded in decision ledger for human review.',
    auditSeverity: 'CRITICAL'
  },
  AI_REGULATION_HALLUCINATION: {
    policyId: 'POL-03-AI-HALLUCINATION',
    triggerCondition: 'AI quotes or cites unknown or unverified statutory clause not in GeoShield Registry',
    domain: 'AI_INFERENCE',
    behavior: 'BLOCK_CERTIFICATION',
    statutoryBasis: 'BIS / CEA Legal Gazette Authenticity Requirement',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Regulatory citation validation fails. AI statement revoked from official audit trail. Block certification.',
    auditSeverity: 'CRITICAL'
  },
  SATELLITE_FEED_UNAVAILABLE: {
    policyId: 'POL-04-SAT-UNAVAIL',
    triggerCondition: 'Sentinel-1 SAR or Sentinel-2 MSI feed latency > 5 days or downlink unavailable',
    domain: 'SATELLITE_OBSERVATION',
    behavior: 'REDUCE_CONFIDENCE_FLAG',
    statutoryBasis: 'ISRO Disaster Management Support Programme (DMSP) standard',
    failClosedOrSafe: 'FAIL_SAFE_DEGRADED',
    actionProtocol: 'Switch to gauge-interpolated hydrodynamics. Reduce spatial confidence index to 0.65. Append visual warning.',
    auditSeverity: 'MEDIUM'
  },
  CWC_FEED_UNAVAILABLE: {
    policyId: 'POL-05-CWC-UNAVAIL',
    triggerCondition: 'CWC river gauge stream silent > 120 minutes during active monsoon alert',
    domain: 'HYDROLOGIC_TELEMETRY',
    behavior: 'USE_PERMITTED_FALLBACK',
    statutoryBasis: 'Central Water Commission Hydrological Observation Manual',
    failClosedOrSafe: 'FAIL_SAFE_DEGRADED',
    actionProtocol: 'Engage state Water Resources Department (WRD) manual gauge log fallback. Flag data health as DEGRADED.',
    auditSeverity: 'HIGH'
  },
  CRS_UNKNOWN_OR_UNSPECIFIED: {
    policyId: 'POL-06-CRS-UNKNOWN',
    triggerCondition: 'Coordinate Reference System missing or not conforming to EPSG:4326 / EPSG:32645',
    domain: 'SPATIAL_METROLOGY',
    behavior: 'BLOCK_CALCULATION',
    statutoryBasis: 'National Geospatial Policy 2022 & Survey of India Geodetic Norms',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Halt spatial intersection. Reject bare latitude/longitude pairs missing datum definition.',
    auditSeverity: 'CRITICAL'
  },
  VERTICAL_DATUM_UNSPECIFIED: {
    policyId: 'POL-07-DATUM-UNKNOWN',
    triggerCondition: 'Elevation or flood depth provided without vertical datum (MSL / SOI Datum / Local Plinth)',
    domain: 'SPATIAL_METROLOGY',
    behavior: 'BLOCK_CALCULATION',
    statutoryBasis: 'CEA Regulations 2023 Schedule VII (Height relative to 100-yr HFL)',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Reject bare numeric elevation value. Require explicit vertical reference datum and unit (meters).',
    auditSeverity: 'CRITICAL'
  },
  REGULATORY_RULE_UNKNOWN: {
    policyId: 'POL-08-RULE-UNKNOWN',
    triggerCondition: 'Component certification requested against non-registered or obsolete statute',
    domain: 'STATUTORY_COMPLIANCE',
    behavior: 'BLOCK_CERTIFICATION',
    statutoryBasis: 'GeoShield Statutory Validation Matrix v1.0',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Refuse automated compliance assertion. Require statutory mapping before operational deployment.',
    auditSeverity: 'CRITICAL'
  },
  AUTHORITY_CONFLICT_DETECTED: {
    policyId: 'POL-09-AUTH-CONFLICT',
    triggerCondition: 'Two or more official authorities emit contradicting hazard tiers (e.g. IMD Severe Cyclone vs INCOIS Moderate Surge)',
    domain: 'AUTHORITY_CONSENSUS',
    behavior: 'REQUIRE_HUMAN_REVIEW',
    statutoryBasis: 'NDMA Standard Operating Procedure for Multi-Agency Cyclone Protocol',
    failClosedOrSafe: 'FAIL_SAFE_DEGRADED',
    actionProtocol: 'Generate first-class "SOURCE CONFLICT" dossier. Do not auto-reconcile. Escalate to District Collector / Relief Commissioner.',
    auditSeverity: 'HIGH'
  },
  UNAUTHORIZED_ALERT_ATTEMPT: {
    policyId: 'POL-10-UNAUTH-ALERT',
    triggerCondition: 'Automated agent or unauthorized role attempts to dispatch public broadcast without SEC_30 credential',
    domain: 'DISASTER_ALERTING',
    behavior: 'BLOCK_ALERT_DISPATCH',
    statutoryBasis: 'Disaster Management Act 2005 Section 30 & NDMA CAP Authorization Spec',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Immediately abort alert transmission. Record security audit incident. Alert dispatch requires dual human key sign-off.',
    auditSeverity: 'CRITICAL'
  },
  EVIDENCE_PACKAGE_TAMPERED: {
    policyId: 'POL-11-EVIDENCE-TAMPERED',
    triggerCondition: 'Computed SHA-256 hash does not match immutable decision record package hash',
    domain: 'CRYPTOGRAPHIC_AUDIT',
    behavior: 'BLOCK_CALCULATION',
    statutoryBasis: 'Indian Evidence Act 1872 Sec 65B & IT Act 2000 Electronic Records Integrity',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Mark evidentiary dossier invalid. Invalidate forensic integrity. Block downstream regulatory submission.',
    auditSeverity: 'CRITICAL'
  },
  TEMPORAL_LEAKAGE_DETECTED: {
    policyId: 'POL-12-TEMPORAL-LEAKAGE',
    triggerCondition: 'Replay scenario contains telemetry timestamped AFTER nominal simulation time T_eval',
    domain: 'CRYPTOGRAPHIC_AUDIT',
    behavior: 'BLOCK_CALCULATION',
    statutoryBasis: 'GeoShield Anti-Leakage & Replay Integrity Standard',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Reject future observation data point. Log temporal contamination event. Re-run replay with strict time filtering.',
    auditSeverity: 'CRITICAL'
  },
  CRITICAL_SENSOR_FAILURE: {
    policyId: 'POL-13-SENSOR-FAILURE',
    triggerCondition: 'Substation SCADA RTU or IoT flood sensor reports NaN, negative depth, or out-of-range value',
    domain: 'SENSOR_HARDWARE',
    behavior: 'DEGRADE_MODE_RETAIN_DETERMINISTIC',
    statutoryBasis: 'IEC 61850 Substation Automation & Telemetry Integrity',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Reject anomalous reading. Mark telemetry offline. Switch to nearest upstream hydraulic gauge estimation.',
    auditSeverity: 'HIGH'
  },
  INVALID_GEOMETRY_DETECTED: {
    policyId: 'POL-14-INVALID-GEOM',
    triggerCondition: 'Asset coordinate outside territorial boundaries of India or self-intersecting boundary polygon',
    domain: 'GEOMETRIC_TOPOLOGY',
    behavior: 'REJECT_ASSET',
    statutoryBasis: 'Survey of India Boundaries & OGC Simple Feature Access ISO 19125',
    failClosedOrSafe: 'FAIL_CLOSED',
    actionProtocol: 'Drop asset from spatial risk buffer. Flag geometry error in ingestion audit log.',
    auditSeverity: 'HIGH'
  }
};

/**
 * Evaluates the safety policy for a given scenario condition.
 */
export function evaluateSafetyFailurePolicy(triggerKey: keyof typeof SAFETY_FAILURE_POLICY_REGISTRY): SafetyPolicyRule {
  const policy = SAFETY_FAILURE_POLICY_REGISTRY[triggerKey];
  if (!policy) {
    throw new Error(`CRITICAL FAILURE: Unknown safety policy trigger "${triggerKey}". System must fail closed.`);
  }
  return policy;
}
