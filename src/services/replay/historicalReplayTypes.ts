/**
 * GeoShield India v1.0 — Phase 8.3: Historical Replay Types & Interfaces
 *
 * Implements strict definitions for historical dataset boundaries, full decision-chain
 * model-version locking, D1-D10 fault injection, 4-event lead time decomposition with
 * NOT_COMPUTABLE handling, and scientific validation classifications.
 */

export type HistoricalScenarioId = 
  | 'CYCLONE_FANI_2019' 
  | 'CYCLONE_DANA_2024' 
  | 'SUPER_CYCLONE_1999';

export type ScenarioReplayRole =
  | 'MODERN_HISTORICAL_REPLAY'          // Multi-sensor DWR + INSAT-3DR + AWS network
  | 'RECENT_HISTORICAL_REPLAY'          // Oceansat-3 + DWR Paradip + CWC telemetry
  | 'HISTORICAL_STRESS_REFERENCE_REPLAY';// Boundary stress test with legacy analog data

export type ObservationType =
  | 'OBSERVED_DATA'
  | 'FORECAST_DATA'
  | 'SATELLITE_DATA'
  | 'SENSOR_DATA'
  | 'SCENARIO_ASSUMPTION'
  | 'DERIVED_VALUE'
  | 'REFERENCE_VALUE';

export type HistoricalProvenanceStatus =
  | 'OBSERVED_HISTORICAL'
  | 'SECONDARY_HISTORICAL_REFERENCE'
  | 'SYNTHETIC_TEST_FIXTURE';

export type SatelliteEvidenceAvailability =
  | 'SATELLITE_AVAILABLE'
  | 'SATELLITE_PARTIAL'
  | 'SATELLITE_UNAVAILABLE'
  | 'SATELLITE_DERIVED'
  | 'SATELLITE_REFERENCE_ONLY';

export type ReplayDimension =
  | 'DIMENSION_A_OBSERVATIONS_ONLY'
  | 'DIMENSION_B_OBSERVATIONS_AND_FORECAST'
  | 'DIMENSION_C_OBSERVATIONS_AND_SATELLITE'
  | 'DIMENSION_D_SENSOR_FAILURE_STRESS_TEST';

export type ReplayTimeStep = 'T-24h' | 'T-12h' | 'T-6h' | 'T-3h' | 'T-1h' | 'T0';

export type FaultInjectionType =
  | 'D1_COMPLETE_SENSOR_OUTAGE'
  | 'D2_STALE_SENSOR_DATA'
  | 'D3_DUPLICATED_OBSERVATION'
  | 'D4_TIMESTAMP_CORRUPTION'
  | 'D5_UNIT_CORRUPTION'
  | 'D6_GEOGRAPHIC_COORDINATE_CORRUPTION'
  | 'D7_INTERMITTENT_PACKET_LOSS'
  | 'D8_DELAYED_OBSERVATION'
  | 'D9_CONTRADICTORY_PROVIDER_OBSERVATION'
  | 'D10_MALFORMED_PAYLOAD';

export type ReplayStatus =
  | 'SUCCESS_DETERMINISTIC'
  | 'SUCCESS_WITH_MISSING_DATA'
  | 'SUCCESS_WITH_SENSOR_FAILURE'
  | 'BLOCKED_FUTURE_DATA'
  | 'INSUFFICIENT_HISTORICAL_EVIDENCE'
  | 'DATA_PROVENANCE_INCOMPLETE'
  | 'MODEL_EXECUTION_FAILURE'
  | 'NOT_COMPARABLE';

export type ValidationStatus =
  | 'CALIBRATED_HISTORICAL_BENCHMARK'
  | 'OPERATIONAL_VALIDATION_PENDING'
  | 'INDEPENDENT_VALIDATION_PENDING';

export interface HistoricalRecord {
  recordId: string;
  eventId: HistoricalScenarioId;
  timestamp: string;               // Reported ISO-8601 observation time
  sourceAgency: string;            // 'IMD' | 'CWC' | 'INCOIS' | 'ISRO' | 'OSDMA'
  sourceDataset: string;           // Official report or dataset designation
  sourceDocument: string;          // Official document title
  sourceUrlOrArchiveId: string;    // Archive citation ID
  observationType: ObservationType;
  variableName: string;            // 'central_pressure_hpa', 'max_wind_kmh', 'storm_surge_m', etc.
  value: number;
  unit: string;
  coordinates: [number, number];   // [latitude, longitude]
  verticalDatum?: string;          // 'MSL_SURVEY_OF_INDIA' where applicable
  crs: string;                     // 'EPSG:4326'
  originalTimestamp: string;
  ingestionTimestamp: string;
  provenanceStatus: HistoricalProvenanceStatus;
  evidenceHash: string;
  satelliteMetadata?: {
    sensor: string;
    productVersion: string;
    availability: SatelliteEvidenceAvailability;
    observationTimestamp: string;
  };
}

export interface HistoricalDatasetManifest {
  datasetId: string;
  eventId: HistoricalScenarioId;
  eventName: string;
  year: number;
  replayRole: ScenarioReplayRole;
  source: string;
  coverageStart: string;
  coverageEnd: string;
  retrievalDate: string;
  archiveDate: string;
  sourceVersion: string;
  recordCount: number;
  spatialExtent: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  temporalResolutionMinutes: number;
  checksum: string;
  license: string;
  provenanceStatus: ValidationStatus;
  description: string;
}

export interface RejectedFutureRecord {
  recordId: string;
  variableName: string;
  timestamp: string;
  tEval: string;
  leakageDeltaMinutes: number;
  reason: 'POST_EVAL_LEAKAGE_PREVENTED';
  interceptionTimestamp: string;
}

export interface FaultInjectionEvaluation {
  faultType: FaultInjectionType;
  affectedRecordId: string;
  baselineValue: number;
  injectedValue: any;
  baselineRiskScore: number;
  failureRiskScore: number;
  riskDelta: number;
  confidenceDelta: number;
  systemBehavior: 'FAIL_CLOSED' | 'DEGRADED_OPERATION' | 'SUPPRESSED_ALERT' | 'FALLBACK_ACTIVATED';
  fallbackProvider?: string;
  details: string;
}

export interface LeadTimeMetrics {
  t1BreachTimestamp: string | null;           // First threshold breach
  t2RecommendationTimestamp: string | null;   // Actionable recommendation
  t3OfficialAlertTimestamp: string | null;     // Official warning/alert
  t4ObservedImpactTimestamp: string | null;    // Predefined observed impact threshold
  detectionLeadTimeHours: number | 'NOT_COMPUTABLE';
  recommendationLeadTimeHours: number | 'NOT_COMPUTABLE';
  officialWarningLeadTimeHours: number | 'NOT_COMPUTABLE';
  computabilityReasons: {
    detectionLeadTimeReason?: string;
    recommendationLeadTimeReason?: string;
    officialWarningLeadTimeReason?: string;
  };
}

export interface FullDecisionModelLock {
  softwareLock: {
    codeCommit: string;
    nodeVersion: string;
    runtimeVersion: string;
    dependencyLockHash: string;
    telemetrySchemaVersion: string;
    normalizerVersion: string;
  };
  modelLock: {
    hazardModelVersion: string;
    hydrodynamicModelVersion: string;
    demModelVersion: string;
    rainfallModelVersion: string;
    vulnerabilityModelVersion: string;
    riskEngineVersion: string;
    aiModelIdentifier: string;
    parametersHash: string;
  };
  governanceLock: {
    regulatoryRegistryVersion: string;
    authorityRegistryVersion: string;
    policyRegistryVersion: string;
    alertRulesVersion: string;
  };
  inputManifestHash: string;
  decisionInputHash: string;
  decisionConfigurationHash: string;
  modelLockHash: string;
}

export interface HistoricalReplayManifest {
  runId: string;
  scenarioId: HistoricalScenarioId;
  eventName: string;
  year: number;
  replayRole: ScenarioReplayRole;
  dimension: ReplayDimension;
  timeStep: ReplayTimeStep;
  nominalTEval: string;
  executionTimestamp: string;
  datasetManifestRef: string;
  totalCorpusRecordsExamined: number;
  acceptedRecordsCount: number;
  rejectedFutureRecordsCount: number;
  rejectedRecordsLog: RejectedFutureRecord[];
  faultInjectionsApplied: FaultInjectionEvaluation[];
  modelLock: FullDecisionModelLock;
  predictedState: {
    centralPressureHpa: number;
    maxWindSpeedKmh: number;
    peakStormSurgeM: number;
    peakRainfall24hMm: number;
    inundationAreaKm2: number;
    exposedAssetsCount: number;
    severedRoadsCount: number;
    criticalSubstationsAtRisk: string[];
    recommendedEvacuationCount: number;
  };
  referenceOutcome: {
    actualMaxWindKmh: number;
    actualPeakSurgeM: number;
    actualRainfallMm: number;
    actualInundationKm2: number;
    actualEvacuatedCount: number;
  };
  leadTimes: LeadTimeMetrics;
  replayStatus: ReplayStatus;
  validationStatus: ValidationStatus;
  scientificDisclaimer: string;
  manifestHash: string; // SHA-256 of the complete execution record
}
