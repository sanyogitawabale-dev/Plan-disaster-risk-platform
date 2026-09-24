import { CriticalAsset, GoogleFloodGaugeRecord, RoadSegment, EvacuationShelter, SarPixelData, StormScenario, TemporalTimeStep } from '../types';

export type AreaSelectionType = 'click' | 'radius' | 'search' | 'hazard_zone' | 'asset';

export interface SpatialAreaSelection {
  type: AreaSelectionType;
  coords: {
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
  };
  radiusKm: number;
  locationName: string;
  districtState: string;
  hazardZoneType?: 'surge_inundation' | 'river_channel' | 'slope_escarpment' | 'sar_soil_moisture' | 'asset_zone';
  assetRef?: CriticalAsset;
  gaugeRef?: GoogleFloodGaugeRecord;
}

export interface EnvironmentalConditionItem {
  id: string;
  name: string;
  icon: string;
  category: 'rainfall' | 'river' | 'wind' | 'storm' | 'surge' | 'slope';
  currentStatus: string;
  statusBadge: 'NORMAL' | 'ELEVATED' | 'WARNING' | 'DANGER' | 'CRITICAL';
  trend: 'increasing' | 'decreasing' | 'stable';
  observedValue: string;
  referenceBaseline: string;
  changeLabel: string;
  changeValuePct?: number;
  sourceAuthority: string;
  sourceType: 'observed' | 'model_derived' | 'forecast' | 'historical';
  stationOrModel: string;
  timestamp: string;
  mapHighlightKey: 'rainfall' | 'river' | 'wind' | 'storm' | 'surge' | 'slope';
}

export interface ChangeDetectionItem {
  id: string;
  metric: string;
  icon: string;
  pastValue: string;
  currentValue: string;
  deltaText: string;
  direction: 'up' | 'down' | 'neutral';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  timeframe: string;
  pastTimestamp: string;
  currentTimestamp: string;
  explanation: string;
}

export interface NearbyAssetExposure {
  asset: CriticalAsset;
  distanceKm: number;
  direction: string;
  elevationDiffM: number;
  situation: 'Normal' | 'Monitoring' | 'Potential Exposure' | 'Elevated River Backwater' | 'Submerged';
  situationSeverity: 'safe' | 'monitoring' | 'warning' | 'danger';
  netInundationM: number;
  safeFreeboardM: number;
  powerDependency: string;
  consequence: string;
  mapX: number;
  mapY: number;
}

export interface CascadingImpactNode {
  id: string;
  name: string;
  category: 'hazard' | 'hydraulic' | 'infrastructure' | 'network' | 'lifeline_service';
  status: 'active' | 'threatened' | 'disrupted' | 'isolated' | 'operational';
  statusLabel: string;
  triggerDescription: string;
  consequenceDescription: string;
  confidencePct: number;
  modelSource: string;
  svgX: number;
  svgY: number;
}

export interface AreaForecastHorizonStep {
  timeStep: string;
  hoursOffset: number;
  timestamp: string;
  rainfallMm: number;
  riverLevelM?: number;
  surgeLevelM?: number;
  windSpeedKmh: number;
  expectedCondition: string;
  uncertaintySpread: string;
  probabilityExceedancePct: number;
  isDanger: boolean;
}

export interface ContributingLayerEvidence {
  layerId: string;
  layerName: string;
  icon: string;
  status: 'active' | 'degraded' | 'offline';
  sourceName: string;
  sourceType: 'LIVE' | 'MODEL_DERIVED' | 'STATUTORY_BENCHMARK' | 'HISTORICAL';
  freshness: string;
  measurementValue: string;
  accuracyOrUncertainty: string;
  mandate: string;
  docsUrl?: string;
  mapHighlightKey: string;
}

export interface ScientificEvidenceDetail {
  observation: {
    source: string;
    stationCode: string;
    timestamp: string;
    value: string;
    unit: string;
    calibrationDatum: string;
  };
  derivedData: {
    processingMethod: string;
    model: string;
    version: string;
    resolution: string;
  };
  riskAssessment: {
    riskModel: string;
    governingStandard: string;
    appliedThresholds: string;
    confidenceGrade: string;
  };
  aiExplanation: {
    aiModel: string;
    systemInstructionContext: string;
    groundedTelemetryFeeds: string[];
    generationTimestamp: string;
  };
}

export interface SpatialStoryStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  narrative: string;
  highlightLayer: 'location' | 'conditions' | 'change' | 'hazards' | 'assets' | 'forecast' | 'evidence';
  svgTarget?: { x: number; y: number; radius: number };
  badge: string;
}

export interface AreaIntelligenceAnalysis {
  selection: SpatialAreaSelection;
  analysisTime: string;
  dataFreshness: string;
  liveStatus: 'LIVE' | 'BENCHMARK / FALLBACK' | 'HISTORICAL' | 'FORECAST';
  plainLanguageSynthesis: string;
  overallConcernGrade: 'LOW' | 'MONITORING' | 'ELEVATED' | 'INCREASING_CONCERN' | 'CRITICAL_DANGER';
  overallConcernText: string;
  conditions: EnvironmentalConditionItem[];
  causalChain: Array<{
    title: string;
    type: 'Observed' | 'Model-derived' | 'AI explanation';
    description: string;
  }>;
  recentChanges: ChangeDetectionItem[];
  spatialChangeBeforeNow: {
    timeframePast: string;
    timeframeNow: string;
    pastMetrics: { floodExtentKm2: number; riverLevelM: number; rainfallMm: number };
    currentMetrics: { floodExtentKm2: number; riverLevelM: number; rainfallMm: number };
    deltaDescription: string;
  };
  contributingLayers: ContributingLayerEvidence[];
  nearbyAssets: NearbyAssetExposure[];
  cascadingImpacts: CascadingImpactNode[];
  forecastTimeline: AreaForecastHorizonStep[];
  scenarioMode: {
    baseRainfallMm: number;
    baseSurgeM: number;
    baseRiverStageM: number;
  };
  aiExplanations: {
    simple: string;
    detailed: {
      rainfall: string;
      river: string;
      terrain: string;
      infrastructure: string;
      trend: string;
      forecast: string;
    };
    expert: {
      measurements: string;
      thresholds: string;
      models: string;
      parameters: string;
      confidence: string;
      provenance: string;
    };
  };
  scientificEvidence: ScientificEvidenceDetail;
  storySteps: SpatialStoryStep[];
}
