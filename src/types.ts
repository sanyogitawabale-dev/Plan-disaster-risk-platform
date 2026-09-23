export type HazardType = 'cyclone_surge' | 'flash_flood' | 'landslide_slope' | 'compound';
export type RegionalProfile = 'GLOBAL_MAPLE' | 'INDIA_NDMA';

export interface CriticalAsset {
  id: string;
  name: string;
  type: 'substation' | 'hospital' | 'bridge' | 'shelter' | 'water_plant' | 'telecom';
  coordinates: [number, number]; // [lat, lng]
  elevationMsl: number; // meters above mean sea level
  finishedFloorElevation: number; // FFE meters
  structuralValueMillions: number;
  criticalityTier: 'Tier-1 Vital Lifeline' | 'Tier-2 Major Utility' | 'Tier-3 Municipal';
  powerDependency: string;
  blueprintSummary: string;
  status: 'operational' | 'at_risk' | 'critical_failure' | 'reinforced';
  projectedSurgeDepth?: number;
  slopeDegrees?: number;
  sarSoilSaturation?: number;
  // Deep Risk Engine & Uncertainty
  riskBreakdown?: RiskEngineBreakdown;
  twinNodeId?: string;
}

export interface RiskEngineBreakdown {
  hazardScore: number;       // 0-100 (What can happen?)
  exposureScore: number;     // 0-100 (What is located there?)
  vulnerabilityScore: number;// 0-100 (How badly could it be affected?)
  criticalityScore: number;  // 0-100 (How important is the asset?)
  compositeRiskIndex: number;// 0-100 (Potential Consequence)
  riskGrade: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidencePercent: number; // 0-100%
  evidence: string[];        // Positive confirmed indicators
  uncertainties: string[];   // Known blind spots / variance
  modelProvenance: {
    hazardModel: string;
    exposureEngine: string;
    vulnerabilityCurve: string;
    riskEngineVersion: string;
    dataTimestamp: string;
  };
}

export interface TemporalTimeStep {
  stepId: 'T-24h' | 'T-12h' | 'T-6h' | 'NOW' | 'T+6h' | 'T+12h';
  label: string;
  isPastOrForecast: 'historical' | 'current' | 'forecast';
  floodExposedAssetsCount: number;
  highRiskRoadsCount: number;
  hospitalExposureGrade: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  projectedSurgeM: number;
  rainfallAccumulationMm: number;
  deltaSummary: string;
  keyDrivers: string[];
}

export interface DigitalTwinNode {
  id: string;
  name: string;
  category: 'power_grid' | 'healthcare' | 'water_sanitation' | 'transport' | 'telecom';
  elevationMsl: number;
  finishedFloorElevation: number;
  upstreamNodeIds: string[];
  downstreamNodeIds: string[];
  status: 'normal' | 'at_risk' | 'failed' | 'isolated' | 'on_generator';
  backupGeneratorAutonomyHours?: number;
  cascadeTimeLagMinutes: number;
  consequenceOnFailure: string;
}

export interface HistoricalEventMemory {
  id: string;
  name: string;
  region: string;
  date: string;
  category: number;
  peakSurgeM: number;
  peakRainfallMm: number;
  predictedInundationKm2: number;
  actualInundationKm2: number;
  errorVariancePercent: number;
  infrastructureDamagedCount: number;
  alertsIssuedCount: number;
  falseAlarmsCount: number;
  lessonsLearned: string[];
  modelCalibrationAdjustment: string;
}

export interface DataQualityFeed {
  id: string;
  name: string;
  category: 'NWP Weather' | 'Satellite SAR' | 'Terrain DEM' | 'River Telemetry' | 'Infrastructure GIS' | 'Sensors & IoT';
  status: 'GREEN' | 'AMBER' | 'RED';
  freshnessLabel: string;
  latencySeconds: number;
  coveragePercent: number;
  uncertaintyFactor: string;
  fallbackAvailable: boolean;
  notes: string;
}

export interface ScenarioSimulationParams {
  rainfallMultiplier: number; // e.g. 1.0 = normal, 1.3 = +30%
  trackShiftEastKm: number;  // e.g. -50 to +50 km
  substation4BTripped: boolean;
  road101ClosedCounterfactual: boolean;
  surgeHeightAdjustmentM: number;
}

export interface GovernancePolicyAction {
  id: string;
  title: string;
  actionDomain: 'alert' | 'grid_control' | 'evacuation' | 'traffic';
  automationTier: 'Automatic' | 'Internal Alert' | 'Approval Required' | 'Human Authorization' | 'Dual Authorization';
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'STANDBY' | 'EXECUTED';
  approverRoleRequired: string;
  requiresDualPin: boolean;
  description: string;
  consequenceWarning: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  startCoord: [number, number];
  endCoord: [number, number];
  elevationMin: number;
  cutoffTimeEtaHours: number; // hours until submerged
  status: 'open' | 'contingency_only' | 'severed';
  evacuationCorridorPriority: 'Primary' | 'Secondary' | 'Local';
  rerouteImpactHospitalMinutes?: number;
  rerouteImpactShelterMinutes?: number;
}

export interface EvacuationShelter {
  id: string;
  name: string;
  coordinates: [number, number];
  elevationMsl: number;
  capacity: number;
  currentOccupancy: number;
  hasBackupGenerator: boolean;
  generatorElevationMsl: number;
  status: 'standby' | 'active_open' | 'at_capacity' | 'compromised';
}

export interface SarPixelData {
  id: string;
  coordinates: [number, number];
  slopeDegrees: number;
  sarRelativeSaturation: number; // 0 to 1.0 (Sentinel-1 VV/VH backscatter ratio)
  insarDisplacementRateMmYr: number; // mm/year displacement
  landslideProbability: number; // 0 to 100%
}

export interface StormScenario {
  id: string;
  name: string;
  category: number;
  landfallEtaHours: number;
  maxWindsKmh: number;
  centralPressureHpa: number;
  projectedSurgeMaxM: number;
  rainfallAccumulationMm: number;
  currentTrackCoords: [number, number][];
  regionalFramework: RegionalProfile;
  // Official IMD Warning Lifecycle Fields
  imdWarningStage?: 'PRE_CYCLONE_WATCH' | 'CYCLONE_ALERT' | 'CYCLONE_WARNING' | 'POST_LANDFALL_OUTLOOK';
  imdWarningColor?: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  imdIntensityCategory?: 'CS' | 'SCS' | 'VSCS' | 'ESCS' | 'SuCS';
  bulletinNumber?: number;
  issueTime?: string;
  validTime?: string;
  nextBulletinTime?: string;
  windRadiiKm?: {
    galeRadius50kt: number;
    stormRadius34kt: number;
  };
}

// -------------------------------------------------------------
// Official Authority vs. GeoShield Calculated Separation
// -------------------------------------------------------------
export interface OfficialAuthorityStatus {
  authority: 'IMD' | 'CWC' | 'INCOIS' | 'NDMA' | 'OSDMA';
  productName: string;
  officialStatusText: string;
  severityColor: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  timestamp: string;
  disclaimer: string;
}

// -------------------------------------------------------------
// India Standards Registry
// -------------------------------------------------------------
export interface IndiaStandardEntry {
  code: string;
  title: string;
  category: 'Wind' | 'Concrete' | 'Earthquake' | 'Steel' | 'Bridges_Roads' | 'Hydraulic' | 'Coastal' | 'Electrical_Lifeline';
  edition: string;
  effectiveDate: string;
  applicableAssetTypes: string[];
  applicableHazard: string;
  keyClauses: string[];
  calculationMethod: string;
  requiredInputs: string[];
  sourceAuthority: string;
  validationStatus: 'CONFIRMED_CURRENT' | 'OBSOLETE' | 'PROVISIONAL';
  notes: string;
}

// -------------------------------------------------------------
// Compound Hazard Physics Decomposition
// -------------------------------------------------------------
export interface CompoundHazardDecomposition {
  astronomicalTideM: number;      // Astronomical tide at spring peak (SOI harmonic)
  stormSurgeM: number;            // INCOIS ADCIRC hydrodynamic ocean surge
  waveSetupM: number;             // Dynamic wave setup from breaking waves
  waveRunupM: number;             // Wave runup along sloping coast/embankments
  riverDischargeBackwaterM: number;// CWC Mahanadi backwater impoundment at estuary
  groundElevationGtsM: number;    // Cartosat-1 / SOI GTS Datum ground level
  totalWaterLevelMslM: number;    // Sum of hydraulic components
  netInundationDepthM: number;    // Total Water Level - Ground Elevation
  dominantUncertaintyFactor: string; // Component driving largest variance (e.g. Wave setup)
  uncertaintySpreadM: number;     // e.g. ±0.45m
}

// -------------------------------------------------------------
// IRC + MoRTH Road & Bridge Hydraulic Vulnerability Assessment
// -------------------------------------------------------------
export interface RoadHydraulicAssessment {
  roadId: string;
  roadName: string;
  governingStandards: string[]; // e.g. ['IRC:6-2017', 'IRC:78-2014', 'MoRTH Section 300']
  currentWaterDepthM: number;
  flowVelocityMs: number;
  scourRiskGrade: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  embankmentSaturationPercent: number;
  culvertWaterwayRatio: number; // Water level relative to culvert soffit (1.0 = overtopping)
  accessibilityStatus: {
    lightVehicles: 'PASSABLE' | 'RESTRICTED' | 'CUTOFF'; // cutoff > 0.15m or > 1.5 m/s
    heavyRescueTrucks: 'PASSABLE' | 'CAUTION' | 'CUTOFF'; // cutoff > 0.35m or > 2.0 m/s
    rescueBoatsOdrf: 'DRY' | 'SHALLOW' | 'OPTIMAL'; // optimal > 0.50m
  };
  closureDecision: 'OPEN' | 'WARNING_ISSUED' | 'PHYSICAL_CORDON_MANDATORY';
  recommendedDetour: string;
}

// -------------------------------------------------------------
// Multi-Tier Source Hierarchy (Tier 1 to Tier 5)
// -------------------------------------------------------------
export interface SourceHierarchyTier {
  tierNumber: 1 | 2 | 3 | 4 | 5;
  tierName: string;
  governanceRule: string;
  agenciesOrServices: string[];
  canOverrideOfficialWarnings: boolean;
}

// -------------------------------------------------------------
// District Emergency Contact Registry
// -------------------------------------------------------------
export interface EmergencyContactRecord {
  id: string;
  state: string;
  district: string;
  authorityName: string;
  eocType: 'District EOC (DEOC)' | 'State EOC (SEOC)' | 'Port EOC' | 'NDRF Control' | 'ODRF Base' | 'Hospital Emergency';
  tollFreeNumber: string;
  primaryPhone: string;
  alternatePhone?: string;
  unified112Available: boolean;
  vhfRadioChannel?: string;
  officialPortalUrl: string;
  lastVerifiedDate: string;
}

// -------------------------------------------------------------
// Multi-Hazard Plugin Architecture
// -------------------------------------------------------------
export interface HazardPlugin {
  id: string;
  name: string;
  iconName: string;
  officialAuthority: string;
  primaryDataSource: string;
  hazardModel: string;
  exposureEngine: string;
  vulnerabilityStandard: string;
  warningProtocol: string;
  activeInPilot: boolean;
}

export interface VulnerabilityAuditResult {
  structuralThreatScore: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  compositeRiskIndex: number;
  hydrodynamicFailureMode: string;
  geotechnicalSlopeRisk: string;
  lifelineCascadeImpact: string;
  engineeringCountermeasures: string[];
  capUrgency: 'Immediate' | 'Expected' | 'Future';
  recommendedActionCode: string;
  riskBreakdown?: RiskEngineBreakdown;
}

export interface ArchitectureComparisonItem {
  module: string;
  originalProposal: string;
  identifiedFlaw: string;
  flawSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  defensibleAlternative: string;
  scientificValidation: string;
  costLatencyImpact: string;
}

