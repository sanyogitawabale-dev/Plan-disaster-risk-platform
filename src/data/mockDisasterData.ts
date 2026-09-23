import {
  CriticalAsset,
  RoadSegment,
  EvacuationShelter,
  SarPixelData,
  StormScenario,
  ArchitectureComparisonItem,
  TemporalTimeStep,
  DigitalTwinNode,
  HistoricalEventMemory,
  DataQualityFeed,
  GovernancePolicyAction
} from '../types';

export const CURRENT_SCENARIO: StormScenario = {
  id: 'cyclone_maya_cat4',
  name: 'Super Cyclone Maya (Category 4)',
  category: 4,
  landfallEtaHours: 5.5,
  maxWindsKmh: 225,
  centralPressureHpa: 938,
  projectedSurgeMaxM: 4.8,
  rainfallAccumulationMm: 340,
  currentTrackCoords: [
    [27.42, -81.25],
    [27.65, -81.42],
    [27.88, -81.65],
    [28.12, -81.85]
  ],
  regionalFramework: 'GLOBAL_MAPLE'
};

export const INDIA_SCENARIO: StormScenario = {
  id: 'cyclone_dana_bay_of_bengal',
  name: 'Severe Cyclonic Storm Dana (Odisha Coast)',
  category: 3,
  landfallEtaHours: 4.0,
  maxWindsKmh: 185,
  centralPressureHpa: 962,
  projectedSurgeMaxM: 3.5,
  rainfallAccumulationMm: 280,
  currentTrackCoords: [
    [19.82, 86.10],
    [20.45, 86.85],
    [21.12, 87.35],
    [21.60, 87.80]
  ],
  regionalFramework: 'INDIA_NDMA'
};

export const MAPLE_COUNTY_ASSETS: CriticalAsset[] = [
  {
    id: 'asset_substation_4b',
    name: 'Maple Coastal Substation 4B (69kV)',
    type: 'substation',
    coordinates: [27.78, -81.56],
    elevationMsl: 2.1,
    finishedFloorElevation: 2.7,
    structuralValueMillions: 48.5,
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Primary feed for Maple General Hospital & South Water Treatment Plant',
    blueprintSummary: 'Step-down oil-cooled transformers mounted on concrete pad at +0.6m above grade. Busbar insulators rated to IP65, unsealed control cabinets in ground vault.',
    status: 'at_risk',
    projectedSurgeDepth: 4.4,
    slopeDegrees: 3.2,
    sarSoilSaturation: 0.88,
    twinNodeId: 'node_substation_4b',
    riskBreakdown: {
      hazardScore: 92,
      exposureScore: 95,
      vulnerabilityScore: 88,
      criticalityScore: 96,
      compositeRiskIndex: 91,
      riskGrade: 'CRITICAL',
      confidencePercent: 88,
      evidence: [
        'Projected hydrodynamic surge of +4.4m exceeds Finished Floor Elevation (2.7m) by 1.70m',
        'Direct topological intersection with 100-year coastal flood zone polygon (ST_Intersects = TRUE)',
        'Sentinel-1 SAR antecedent moisture ratio at 88% indicating saturated coastal soil bed',
        'Single point of failure for downstream regional trauma center and water booster pumps'
      ],
      uncertainties: [
        'Wave setup / runup cresting uncertainty of ±0.35m due to nearshore bathymetry roughness',
        'Basement conduit water-stop seal integrity unverified since 2021 municipal inspection'
      ],
      modelProvenance: {
        hazardModel: 'NOAA SLOSH Cat 4 Ensemble (Run 12Z)',
        exposureEngine: 'PostGIS ST_Intersects v3.4 on Municipal Cadastre',
        vulnerabilityCurve: 'USACE Electrical Substation Depth-Damage Function (EM 1110-2-1415)',
        riskEngineVersion: 'GeoShield RiskCore v2.4 (Strict Factor Separation)',
        dataTimestamp: '2026-09-22T04:45:00Z'
      }
    }
  },
  {
    id: 'asset_hospital_general',
    name: 'Maple Memorial County Hospital',
    type: 'hospital',
    coordinates: [27.82, -81.52],
    elevationMsl: 5.4,
    finishedFloorElevation: 6.2,
    structuralValueMillions: 142.0,
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Dual redundant feed from Substation 4B + rooftop 1.2MW diesel genset',
    blueprintSummary: 'ICU located on 2nd floor (elevation +9.5m). Primary oxygen storage tanks and chiller plant at grade (+5.4m MSL). Basement holds emergency supply warehouse.',
    status: 'operational',
    projectedSurgeDepth: 3.8,
    slopeDegrees: 4.0,
    sarSoilSaturation: 0.72,
    twinNodeId: 'node_hospital_icu',
    riskBreakdown: {
      hazardScore: 68,
      exposureScore: 40,
      vulnerabilityScore: 62,
      criticalityScore: 98,
      compositeRiskIndex: 58,
      riskGrade: 'MEDIUM',
      confidencePercent: 91,
      evidence: [
        'Finished Floor Elevation (+6.2m) maintains +2.4m freeboard above active surge (+3.8m)',
        'Rooftop emergency generator positioned at +14.5m with autonomous 72-hour fuel capacity',
        'ICU critical life-support suites situated on second level (+9.5m)'
      ],
      uncertainties: [
        'Chiller plant at grade level (+5.4m) vulnerable to splash backflow if sewer lines surcharge',
        'Access roads (Route 101) submerged, preventing ambulance arrival from southern district'
      ],
      modelProvenance: {
        hazardModel: 'SLOSH Hydrodynamic + River Hydraulic Coupled Model',
        exposureEngine: 'Vector Overlay on Hospital Campus Masterplan',
        vulnerabilityCurve: 'FEMA Hazus-MH Hospital Resilience Curve',
        riskEngineVersion: 'GeoShield RiskCore v2.4',
        dataTimestamp: '2026-09-22T04:45:00Z'
      }
    }
  },
  {
    id: 'asset_bridge_pine_valley',
    name: 'Pine Valley Mountain Access Bridge',
    type: 'bridge',
    coordinates: [27.91, -81.43],
    elevationMsl: 38.0,
    finishedFloorElevation: 39.5,
    structuralValueMillions: 28.0,
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Autonomous solar-battery signaling & structural tilt sensors',
    blueprintSummary: 'Prestressed concrete box girder span. Northern abutment sits on colluvial slope with historical InSAR creep rate of 14mm/yr.',
    status: 'critical_failure',
    projectedSurgeDepth: 0.0,
    slopeDegrees: 31.5,
    sarSoilSaturation: 0.94,
    twinNodeId: 'node_bridge_pine',
    riskBreakdown: {
      hazardScore: 94,
      exposureScore: 85,
      vulnerabilityScore: 90,
      criticalityScore: 82,
      compositeRiskIndex: 89,
      riskGrade: 'CRITICAL',
      confidencePercent: 84,
      evidence: [
        'Terrain slope angle of 31.5° exceeds critical stability angle for colluvial soil',
        'Sentinel-1 SAR relative saturation at 94% with antecedent rainfall accumulation > 220mm',
        'Infinite Slope Factor of Safety calculated at FS = 0.82 (imminent rotational shear)',
        'Historical InSAR baseline shows chronic 14mm/yr downslope creep at northern abutment'
      ],
      uncertainties: [
        'Deep bedrock slip surface depth estimated via geophysical proxy (no direct borehole)',
        'Exact pore-water dissipation rate during lull periods'
      ],
      modelProvenance: {
        hazardModel: 'SHALSTAB / TRIGRS Dynamic Slope Stability Model',
        exposureEngine: 'Copernicus 30m DEM + DOT Bridge Vector Layer',
        vulnerabilityCurve: 'FHWA Geotechnical Scour & Abutment Failure Fragility',
        riskEngineVersion: 'GeoShield RiskCore v2.4',
        dataTimestamp: '2026-09-22T04:45:00Z'
      }
    }
  },
  {
    id: 'asset_water_treatment',
    name: 'South Basin Water Reclamation Facility',
    type: 'water_plant',
    coordinates: [27.74, -81.59],
    elevationMsl: 1.8,
    finishedFloorElevation: 2.2,
    structuralValueMillions: 36.0,
    criticalityTier: 'Tier-2 Major Utility',
    powerDependency: 'Feeder circuit from Substation 4B; no elevated backup generators',
    blueprintSummary: 'Aeration basins at grade. Chlorine storage containment dyke wall crest at +2.9m MSL.',
    status: 'at_risk',
    projectedSurgeDepth: 4.6,
    slopeDegrees: 1.5,
    sarSoilSaturation: 0.91,
    twinNodeId: 'node_water_plant',
    riskBreakdown: {
      hazardScore: 96,
      exposureScore: 92,
      vulnerabilityScore: 94,
      criticalityScore: 78,
      compositeRiskIndex: 90,
      riskGrade: 'CRITICAL',
      confidencePercent: 86,
      evidence: [
        'Surge depth (+4.6m) overtops protective perimeter dyke (+2.9m) by 1.7m',
        'Direct power dependency on Substation 4B which is slated for catastrophic arc flash',
        'Raw sewage discharge hazard into coastal estuary within 3 hours of inundation'
      ],
      uncertainties: [
        'Emergency chlorine cylinder shutoff valve status currently unconfirmed via SCADA'
      ],
      modelProvenance: {
        hazardModel: 'SLOSH Hydrodynamic Inundation v2.4',
        exposureEngine: 'EPA Facility Registry System + Municipal CAD',
        vulnerabilityCurve: 'EPA Water Sector Flood Fragility Curves',
        riskEngineVersion: 'GeoShield RiskCore v2.4',
        dataTimestamp: '2026-09-22T04:45:00Z'
      }
    }
  },
  {
    id: 'asset_telecom_tower_north',
    name: 'Ridge Telecom & FirstNet Microwave Tower',
    type: 'telecom',
    coordinates: [27.95, -81.38],
    elevationMsl: 112.0,
    finishedFloorElevation: 112.8,
    structuralValueMillions: 9.5,
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Direct grid connection + 72-hour propane generator',
    blueprintSummary: 'Lattice tower anchored to basalt bedrock with 12m tensioned ground anchors. High wind survivability to 260 km/h.',
    status: 'operational',
    projectedSurgeDepth: 0.0,
    slopeDegrees: 18.0,
    sarSoilSaturation: 0.55,
    twinNodeId: 'node_telecom_tower',
    riskBreakdown: {
      hazardScore: 35,
      exposureScore: 10,
      vulnerabilityScore: 25,
      criticalityScore: 90,
      compositeRiskIndex: 28,
      riskGrade: 'LOW',
      confidencePercent: 94,
      evidence: [
        'Tower sits at +112m MSL on solid basalt bedrock (completely immune to storm surge)',
        'Wind design tolerance rated to 260 km/h (storm maximum wind is 225 km/h)',
        '72-hour autonomous propane generator tested and operational'
      ],
      uncertainties: [
        'Microwave line-of-sight path may suffer heavy rain fade during peak eyewall passage'
      ],
      modelProvenance: {
        hazardModel: 'ASCE 7-22 Wind Load Structural Response Engine',
        exposureEngine: 'FCC Antenna Structure Registration (ASR) Database',
        vulnerabilityCurve: 'Telecommunications Tower Fragility Function',
        riskEngineVersion: 'GeoShield RiskCore v2.4',
        dataTimestamp: '2026-09-22T04:45:00Z'
      }
    }
  }
];

export const ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'road_rt101_causeway',
    name: 'Route 101 South Coastal Causeway',
    startCoord: [27.72, -81.62],
    endCoord: [27.81, -81.55],
    elevationMin: 1.4,
    cutoffTimeEtaHours: 2.2,
    status: 'severed',
    evacuationCorridorPriority: 'Primary',
    rerouteImpactHospitalMinutes: 45,
    rerouteImpactShelterMinutes: 30
  },
  {
    id: 'road_rt44_highland',
    name: 'Highway 44 Inland Highland Bypass',
    startCoord: [27.80, -81.50],
    endCoord: [27.92, -81.42],
    elevationMin: 14.5,
    cutoffTimeEtaHours: 99.0,
    status: 'open',
    evacuationCorridorPriority: 'Primary',
    rerouteImpactHospitalMinutes: 0,
    rerouteImpactShelterMinutes: 0
  },
  {
    id: 'road_pine_valley_gap',
    name: 'Pine Valley Mountain Pass Rd',
    startCoord: [27.88, -81.46],
    endCoord: [27.94, -81.40],
    elevationMin: 28.0,
    cutoffTimeEtaHours: 3.5,
    status: 'contingency_only',
    evacuationCorridorPriority: 'Secondary',
    rerouteImpactHospitalMinutes: 60,
    rerouteImpactShelterMinutes: 40
  }
];

export const SHELTERS: EvacuationShelter[] = [
  {
    id: 'shelter_westbrook_hs',
    name: 'Westbrook Central High School',
    coordinates: [27.86, -81.48],
    elevationMsl: 18.5,
    capacity: 850,
    currentOccupancy: 412,
    hasBackupGenerator: true,
    generatorElevationMsl: 20.0,
    status: 'active_open'
  },
  {
    id: 'shelter_st_jude',
    name: 'St. Jude Civic Community Complex',
    coordinates: [27.84, -81.51],
    elevationMsl: 11.2,
    capacity: 400,
    currentOccupancy: 365,
    hasBackupGenerator: true,
    generatorElevationMsl: 12.0,
    status: 'active_open'
  },
  {
    id: 'shelter_harbor_recreation',
    name: 'Harbor Marina Community Center',
    coordinates: [27.76, -81.58],
    elevationMsl: 2.4,
    capacity: 300,
    currentOccupancy: 0,
    hasBackupGenerator: false,
    generatorElevationMsl: 2.4,
    status: 'compromised' // In surge evacuation zone
  }
];

export const SAR_HOTSPOTS: SarPixelData[] = [
  {
    id: 'sar_pine_bluff',
    coordinates: [27.915, -81.428],
    slopeDegrees: 33.2,
    sarRelativeSaturation: 0.96,
    insarDisplacementRateMmYr: 18.4,
    landslideProbability: 88
  },
  {
    id: 'sar_ridge_east',
    coordinates: [27.892, -81.445],
    slopeDegrees: 26.8,
    sarRelativeSaturation: 0.84,
    insarDisplacementRateMmYr: 7.2,
    landslideProbability: 64
  },
  {
    id: 'sar_valley_wash',
    coordinates: [27.845, -81.490],
    slopeDegrees: 14.1,
    sarRelativeSaturation: 0.78,
    insarDisplacementRateMmYr: 1.5,
    landslideProbability: 22
  }
];

// Temporal "What Changed?" Engine Sequence
export const TEMPORAL_TIMELINE: TemporalTimeStep[] = [
  {
    stepId: 'T-24h',
    label: '24 Hours Before Landfall',
    isPastOrForecast: 'historical',
    floodExposedAssetsCount: 4,
    highRiskRoadsCount: 1,
    hospitalExposureGrade: 'LOW',
    projectedSurgeM: 1.8,
    rainfallAccumulationMm: 45,
    deltaSummary: 'Baseline tropical cyclone watch initialized. Low-lying salt marshes exposed.',
    keyDrivers: ['Offshore cyclone track heading NW at 14 knots', 'Tide at low cycle']
  },
  {
    stepId: 'T-12h',
    label: '12 Hours Before Landfall',
    isPastOrForecast: 'historical',
    floodExposedAssetsCount: 12,
    highRiskRoadsCount: 3,
    hospitalExposureGrade: 'LOW',
    projectedSurgeM: 2.9,
    rainfallAccumulationMm: 110,
    deltaSummary: 'Surge projection escalated +1.1m. Route 101 coastal shoulders inundated.',
    keyDrivers: ['Forward storm motion decelerated, intensifying coastal water piling', 'Heavy rain bands saturate soil']
  },
  {
    stepId: 'T-6h',
    label: '6 Hours Before Landfall (Previous)',
    isPastOrForecast: 'historical',
    floodExposedAssetsCount: 19,
    highRiskRoadsCount: 5,
    hospitalExposureGrade: 'MEDIUM',
    projectedSurgeM: 3.9,
    rainfallAccumulationMm: 210,
    deltaSummary: 'Pine Valley Bridge abutment creep crosses warning threshold; Substation 4B perimeter flooded.',
    keyDrivers: ['Inflow eye wall winds reach 205 km/h', 'River estuary tidal backwater begins']
  },
  {
    stepId: 'NOW',
    label: 'Current Operational Assessment (NOW)',
    isPastOrForecast: 'current',
    floodExposedAssetsCount: 27,
    highRiskRoadsCount: 8,
    hospitalExposureGrade: 'MEDIUM',
    projectedSurgeM: 4.8,
    rainfallAccumulationMm: 340,
    deltaSummary: 'CRITICAL DELTA: Exposed assets jumped 19 → 27 (+42%). Substation 4B FFE breached by +1.7m. Route 101 severed.',
    keyDrivers: [
      'Forecast rainfall upgraded from 260mm to 340mm',
      'Astronomical spring high tide coincides with peak storm surge arrival at 18:30 hrs',
      'Pine Valley slope saturation exceeds 94%'
    ]
  },
  {
    stepId: 'T+6h',
    label: '6 Hours Post-Landfall (Forecast)',
    isPastOrForecast: 'forecast',
    floodExposedAssetsCount: 31,
    highRiskRoadsCount: 11,
    hospitalExposureGrade: 'HIGH',
    projectedSurgeM: 4.2,
    rainfallAccumulationMm: 420,
    deltaSummary: 'Inland flash flood crests. River overflow isolates Memorial Hospital ground corridors.',
    keyDrivers: ['Runoff transit lag from mountain watersheds reaches coastal floodplain', 'Backup generator fuel burn exceeds 6 hours']
  },
  {
    stepId: 'T+12h',
    label: '12 Hours Post-Landfall (Recovery Phase)',
    isPastOrForecast: 'forecast',
    floodExposedAssetsCount: 16,
    highRiskRoadsCount: 6,
    hospitalExposureGrade: 'LOW',
    projectedSurgeM: 1.5,
    rainfallAccumulationMm: 460,
    deltaSummary: 'Tidal drainage commences. Sediment deposition and debris obstacles remain on highway corridors.',
    keyDrivers: ['Winds ease below gale force', 'Pumping stations resume on emergency priority circuits']
  }
];

// Digital Twin Network Graph
export const DIGITAL_TWIN_NODES: DigitalTwinNode[] = [
  {
    id: 'node_69kv_grid_feeder',
    name: 'Bulk 69kV Transmission Feeder Line',
    category: 'power_grid',
    elevationMsl: 4.5,
    finishedFloorElevation: 5.0,
    upstreamNodeIds: [],
    downstreamNodeIds: ['node_substation_4b'],
    status: 'normal',
    cascadeTimeLagMinutes: 0,
    consequenceOnFailure: 'De-energizes regional distribution circuit'
  },
  {
    id: 'node_substation_4b',
    name: 'Maple Coastal Substation 4B (Step-Down 69kV/13.8kV)',
    category: 'power_grid',
    elevationMsl: 2.1,
    finishedFloorElevation: 2.7,
    upstreamNodeIds: ['node_69kv_grid_feeder'],
    downstreamNodeIds: ['node_hospital_icu', 'node_water_plant'],
    status: 'at_risk',
    cascadeTimeLagMinutes: 15,
    consequenceOnFailure: 'Submersion causes catastrophic busbar arc flash, cutting primary power to Hospital & Water Treatment'
  },
  {
    id: 'node_hospital_icu',
    name: 'Maple Memorial Hospital ICU & Surgical Theaters',
    category: 'healthcare',
    elevationMsl: 5.4,
    finishedFloorElevation: 6.2,
    upstreamNodeIds: ['node_substation_4b'],
    downstreamNodeIds: ['node_hospital_genset'],
    status: 'on_generator',
    backupGeneratorAutonomyHours: 14.5,
    cascadeTimeLagMinutes: 45,
    consequenceOnFailure: 'Failure of primary feed triggers automatic transfer to rooftop 1.2MW diesel genset (14.5h fuel autonomy)'
  },
  {
    id: 'node_hospital_genset',
    name: 'Hospital Rooftop 1.2MW Emergency Generator',
    category: 'healthcare',
    elevationMsl: 14.5,
    finishedFloorElevation: 14.8,
    upstreamNodeIds: ['node_hospital_icu'],
    downstreamNodeIds: [],
    status: 'normal',
    backupGeneratorAutonomyHours: 14.5,
    cascadeTimeLagMinutes: 0,
    consequenceOnFailure: 'Exhaustion of fuel supply forces emergency evacuation of 84 ICU ventilator patients'
  },
  {
    id: 'node_water_plant',
    name: 'South Basin Water Reclamation & Booster Pumps',
    category: 'water_sanitation',
    elevationMsl: 1.8,
    finishedFloorElevation: 2.2,
    upstreamNodeIds: ['node_substation_4b'],
    downstreamNodeIds: [],
    status: 'failed',
    cascadeTimeLagMinutes: 30,
    consequenceOnFailure: 'Loss of power halts booster pumps; untreated effluent floods residential canal within 90 minutes'
  }
];

// Data Quality & Provenance Monitoring Feeds
export const DATA_QUALITY_FEEDS: DataQualityFeed[] = [
  {
    id: 'feed_ecmwf',
    name: 'ECMWF IFS Open Data (0.1° NWP)',
    category: 'NWP Weather',
    status: 'GREEN',
    freshnessLabel: 'Fresh (Updated 28 mins ago)',
    latencySeconds: 1680,
    coveragePercent: 100,
    uncertaintyFactor: '±12% track spread in 48h horizon',
    fallbackAvailable: true,
    notes: 'Primary global atmospheric boundary model operating normally.'
  },
  {
    id: 'feed_sar_sentinel1',
    name: 'Copernicus Sentinel-1 SAR & InSAR',
    category: 'Satellite SAR',
    status: 'AMBER',
    freshnessLabel: 'Degraded Pass (4.2 days old)',
    latencySeconds: 362880,
    coveragePercent: 88,
    uncertaintyFactor: 'Orbital repeat gap; coupled with GPM IMERG 30m rain for dynamic soil moisture',
    fallbackAvailable: true,
    notes: 'C-band SAR baseline valid for chronic creep, active rainfall attenuation compensated by NASA GPM.'
  },
  {
    id: 'feed_dem_copernicus',
    name: 'Copernicus GLO-30 Digital Elevation Model',
    category: 'Terrain DEM',
    status: 'GREEN',
    freshnessLabel: 'Static Ground Truth (10m Resampled)',
    latencySeconds: 0,
    coveragePercent: 100,
    uncertaintyFactor: 'Vertical accuracy ±1.8m in dense canopy',
    fallbackAvailable: true,
    notes: 'Calibrated against municipal LiDAR benchmarks.'
  },
  {
    id: 'feed_municipal_gis',
    name: 'County Municipal Infrastructure Cadastre',
    category: 'Infrastructure GIS',
    status: 'AMBER',
    freshnessLabel: 'Stale (Substations updated 2023)',
    latencySeconds: 31536000,
    coveragePercent: 92,
    uncertaintyFactor: 'Finished Floor Elevation missing for 8 secondary pump stations',
    fallbackAvailable: false,
    notes: 'Substation 4B FFE verified via RTK GPS survey. Secondary nodes use street-grade elevation proxy.'
  },
  {
    id: 'feed_iot_river_gauges',
    name: 'USGS / CWC Real-Time River Gauges',
    category: 'River Telemetry',
    status: 'GREEN',
    freshnessLabel: 'Live Telemetry (Updated 4 mins ago)',
    latencySeconds: 240,
    coveragePercent: 95,
    uncertaintyFactor: 'Gauge 02B telemetry signal noisy due to debris impact',
    fallbackAvailable: true,
    notes: 'Stage height 4.2m MSL rising at 0.35m/hr.'
  }
];

// Historical Event Memory & Post-Event Feedback Loop
export const HISTORICAL_EVENTS: HistoricalEventMemory[] = [
  {
    id: 'event_cyclone_amphan_2020',
    name: 'Cyclone Amphan (Bay of Bengal / West Bengal & Odisha)',
    region: 'East Coast Delta',
    date: 'May 2020',
    category: 5,
    peakSurgeM: 5.2,
    peakRainfallMm: 380,
    predictedInundationKm2: 420,
    actualInundationKm2: 365,
    errorVariancePercent: -13.1,
    infrastructureDamagedCount: 148,
    alertsIssuedCount: 84,
    falseAlarmsCount: 6,
    lessonsLearned: [
      'Mangrove buffer zones reduced surge height by 1.2m compared to bare-earth SLOSH simulation.',
      'Power grid failure isolated hospital generators because tanker refuel routes were cut off.',
      'OASIS CAP-CP alerts sent to mobile phones saved thousands of coastal lives.'
    ],
    modelCalibrationAdjustment: 'Added mangrove drag coefficient (Cd = 0.12) to coastal hydrodynamic dissipation equation.'
  },
  {
    id: 'event_cyclone_phailin_2013',
    name: 'Cyclone Phailin (Odisha Coast)',
    region: 'Ganjam Corridor',
    date: 'October 2013',
    category: 5,
    peakSurgeM: 3.8,
    peakRainfallMm: 290,
    predictedInundationKm2: 280,
    actualInundationKm2: 295,
    errorVariancePercent: 5.3,
    infrastructureDamagedCount: 92,
    alertsIssuedCount: 62,
    falseAlarmsCount: 2,
    lessonsLearned: [
      'Zero-casualty evacuation succeeded due to 48-hour shelter pre-activation.',
      'Telecom microwave towers survived 220 km/h winds, maintaining emergency radio net.'
    ],
    modelCalibrationAdjustment: 'Calibrated SLOSH astronomical tide timing to India Survey tidal harmonic constituents.'
  },
  {
    id: 'event_hurricane_ian_2022',
    name: 'Hurricane Ian (Gulf Coast)',
    region: 'Coastal Barrier Islands',
    date: 'September 2022',
    category: 4,
    peakSurgeM: 4.6,
    peakRainfallMm: 310,
    predictedInundationKm2: 195,
    actualInundationKm2: 215,
    errorVariancePercent: 10.2,
    infrastructureDamagedCount: 114,
    alertsIssuedCount: 54,
    falseAlarmsCount: 3,
    lessonsLearned: [
      'Causeway bridges severed at the approaches rather than structural spans.',
      'Arc flash fires in flooded substations destroyed control equipment long before water subsided.'
    ],
    modelCalibrationAdjustment: 'Added pre-emptive breaker trip threshold at Net Water Inundation > 0.1m.'
  }
];

// Governance & Policy Authorization Actions
export const GOVERNANCE_POLICY_ACTIONS: GovernancePolicyAction[] = [
  {
    id: 'act_ingest_data',
    title: 'NWP & Satellite Data Ingestion',
    actionDomain: 'alert',
    automationTier: 'Automatic',
    status: 'APPROVED',
    approverRoleRequired: 'System Pipeline Engine',
    requiresDualPin: false,
    description: 'Autonomous pulling of ECMWF, NOAA, and GPM satellite telemetry every 15 minutes.',
    consequenceWarning: 'None (read-only telemetry).'
  },
  {
    id: 'act_calc_risk',
    title: 'Deterministic GIS & Risk Index Calculation',
    actionDomain: 'alert',
    automationTier: 'Automatic',
    status: 'APPROVED',
    approverRoleRequired: 'System Pipeline Engine',
    requiresDualPin: false,
    description: 'PostGIS ST_Intersects, FFE delta, and SHALSTAB Factor of Safety computations.',
    consequenceWarning: 'None (analytical computation).'
  },
  {
    id: 'act_internal_alert',
    title: 'EOC Internal Command Advisory',
    actionDomain: 'alert',
    automationTier: 'Internal Alert',
    status: 'APPROVED',
    approverRoleRequired: 'Automated Dispatch to Incident Commander',
    requiresDualPin: false,
    description: 'Automated notification dispatched to municipal magistrates & first responder terminals.',
    consequenceWarning: 'Alerts internal personnel; does not disrupt public broadcasts.'
  },
  {
    id: 'act_public_warning',
    title: 'OASIS CAP Public Broadcast & WEA Cell Blast',
    actionDomain: 'alert',
    automationTier: 'Approval Required',
    status: 'PENDING_APPROVAL',
    approverRoleRequired: 'County Emergency Management Director / District Magistrate',
    requiresDualPin: false,
    description: 'Broadcasts sirens, SMS cell alerts (160c), and WhatsApp warnings to 42,850 citizens.',
    consequenceWarning: 'Triggering public alert causes widespread commercial shutdown and traffic rerouting.'
  },
  {
    id: 'act_road_closure',
    title: 'Execute Traffic Rerouting & Road 101 Cordon',
    actionDomain: 'traffic',
    automationTier: 'Human Authorization',
    status: 'APPROVED',
    approverRoleRequired: 'Highway Patrol Commander & Transportation Commissioner',
    requiresDualPin: false,
    description: 'Physical deployment of barricades and digital variable-message highway signs at Milepost 12.',
    consequenceWarning: 'Reroutes all ambulance traffic onto Highway 44 Bypass (+45 min transit lag).'
  },
  {
    id: 'act_grid_trip',
    title: 'Controlled De-Energization of Substation 4B (69kV)',
    actionDomain: 'grid_control',
    automationTier: 'Dual Authorization',
    status: 'PENDING_APPROVAL',
    approverRoleRequired: 'Utility Grid Chief Dispatcher + Municipal EOC Director (Dual PIN Required)',
    requiresDualPin: true,
    description: 'Opens 69kV transmission vacuum breakers to prevent explosive saltwater arc flash fires before surge crests.',
    consequenceWarning: 'Cuts primary grid power to 38,000 households, South Water Plant, and forces Hospital onto backup genset.'
  }
];

export const ARCHITECTURE_COMPARISONS: ArchitectureComparisonItem[] = [
  {
    module: 'Module 1: Climate & Weather Ingestion',
    originalProposal: 'Google Earth Engine pulling ERA5 (reanalysis), NOAA, and CHIRPS rainfall for real-time cyclone tracking.',
    identifiedFlaw: 'ERA5 has a 5-day to 2-month latency lag (it is a historical reanalysis dataset, NOT an operational forecast). CHIRPS has a 1-2 day lag at coarse 5km resolution. Neither can drive real-time cyclone early warnings.',
    flawSeverity: 'CRITICAL',
    defensibleAlternative: 'Operational Numerical Weather Prediction (NWP) feeds: ECMWF IFS Open Data (0.1° resolution) + NOAA GFS / HRRR live grids + NOAA NHC / JTWC / IMD live cyclone advisory bulletins (GeoJSON tracks, wind radii cones, SLOSH storm surge heights).',
    scientificValidation: 'WMO (World Meteorological Organization) operational guidelines require low-latency forecast models. ERA5 is only valid for calculating 30-year climatological return periods (design basis), never operational tracking.',
    costLatencyImpact: 'Reduces data ingestion latency from 5 days (useless) to sub-15 minutes via S3/NOAA NOMADS open streaming.'
  },
  {
    module: 'Module 2: Multimodal AI Risk Auditor',
    originalProposal: 'Gemini 3.7 Flash prompted to visually overlay CAD/PDF blueprints onto hazard maps and calculate topological intersections / exposure scores.',
    identifiedFlaw: 'LLMs suffer from severe geometric hallucination, cannot handle geodetic coordinate projections (EPSG:4326 to UTM meters), and cannot perform topological math (ST_Intersects, ST_DWithin). Prompt-engineering an LLM to eyeball spatial overlap in life-critical situations is dangerous.',
    flawSeverity: 'CRITICAL',
    defensibleAlternative: 'Hybrid Deterministic-Geospatial + AI Architecture: A deterministic GIS engine (PostGIS / Turf.js / GDAL) calculates exact mathematical spatial intersections, water depth above Finished Floor Elevation (FFE), and buffer radiuses. Gemini 3.8 Flash is then fed structured spatial facts + blueprint engineering specifications to perform Failure Mode Effects Analysis (FMEA), cascading grid vulnerability, and contingency playbook generation.',
    scientificValidation: 'ASCE 24-14 / NBC 2016 (Flood Resistant Design) requires deterministic freeboard depth calculation. AI handles semantic reasoning and engineering synthesis, not raw trigonometric geometry.',
    costLatencyImpact: 'Eliminates 90% of token overhead from feeding massive raw map rasters; increases spatial calculation accuracy from ~60% probabilistic guess to 100% deterministic precision.'
  },
  {
    module: 'Module 3: SAR Soil & Landslide Monitor',
    originalProposal: 'Sentinel-1 SAR processed via GEE to measure real-time soil saturation and slope stability hours before cyclone landfall.',
    identifiedFlaw: 'Sentinel-1 C-band SAR has a 6-to-12 day orbital revisit interval. If a cyclone strikes in 24 hours, the satellite may not fly overhead for 5 days. Furthermore, C-band SAR radar backscatter is attenuated and scattered by heavy rainfall and dense tree canopies, distorting bare-soil moisture readings.',
    flawSeverity: 'HIGH',
    defensibleAlternative: 'Multi-Sensor Fusion: Combine historic Sentinel-1 InSAR baseline coherence/displacement (chronic slow creep) with real-time Antecedent Precipitation Index (API) from NASA GPM IMERG Early Run (30-min latency) + a deterministic Infinite Slope Stability Model (SHALSTAB / TRIGRS physics-based factor of safety).',
    scientificValidation: 'Standard geotechnical landslide forecasting (USGS / Italian CNR-IRPI) relies on cumulative antecedent rainfall thresholds coupled with high-resolution DEM slope angles (Copernicus 30m / CartoDEM), using InSAR as baseline vulnerability rather than single-day weather imagery.',
    costLatencyImpact: 'Ensures 100% operational uptime independent of satellite orbital pass schedules.'
  },
  {
    module: 'Module 4: Infrastructure Vector Layer',
    originalProposal: 'OpenStreetMap (OSM) APIs alone to pull critical infrastructure locations (power grids, arterial roads, shelters).',
    identifiedFlaw: 'OSM is open-source and crowdsourced. Power grid substations, transformer elevations, emergency hospital generator locations, and culvert capacities are frequently missing, incomplete, or unverified in OSM, creating catastrophic blind spots in disaster scenarios.',
    flawSeverity: 'HIGH',
    defensibleAlternative: 'Layered Ingestion Pipeline: Tier-1 Verified Municipal CAD/GIS layers (Shapefile, GeoJSON, DXF) with schema validation (requiring Finished Floor Elevation / FFE datum) merged with OSM for general road connectivity, backed by OpenInfraMap and National/State Infrastructure databases.',
    scientificValidation: 'National Infrastructure Protection Plan (NIPP / NDMA) mandates authenticated ground-truth benchmarks for critical utility assets.',
    costLatencyImpact: 'Automated schema validator rejects incomplete assets missing elevation attributes, preventing false-safety flags.'
  },
  {
    module: 'Module 5: Blueprint Ingestion Pipeline',
    originalProposal: 'Multimodal ingestion of CAD/PDF drawings directly into the LLM vision prompt.',
    identifiedFlaw: 'Engineering CAD files (.dwg/.dxf) are rich vector databases with coordinate reference layers. Converting them to flat images loses georeferencing, exact millimetric elevation benchmarks, and electrical circuit schematics.',
    flawSeverity: 'MODERATE',
    defensibleAlternative: 'Dual-Path Ingestion Pipeline: Extract vector geometries and georeferenced coordinates via DXF/GIS parsers (ezdxf / GDAL); extract textual specs and electrical single-line diagrams via OCR; pass the structured engineering metadata to Gemini 3.8 Flash for vulnerability synthesis.',
    scientificValidation: 'BIM/GIS integration standards (ISO 19650) require preserving geospatial coordinate reference systems across design and hazard domains.',
    costLatencyImpact: 'Prevents massive image token costs while preserving sub-centimeter vertical accuracy.'
  },
  {
    module: 'Module 6: Alert Dispatch & Advisory',
    originalProposal: 'Directly dispatching custom alerts via Twilio / WhatsApp Business API.',
    identifiedFlaw: 'Sending ad-hoc messages without standard protocols risks carrier spam blocking, message truncation, lack of digital cryptographic signatures, and incompatibility with national emergency broadcast systems (WEA, FEMA IPAWS, India SACHET / CAP-CP).',
    flawSeverity: 'MODERATE',
    defensibleAlternative: 'OASIS Common Alerting Protocol (CAP v1.2 / ITU-T X.1303 / CAP-CP) compliant notification hub. Generates verified CAP XML/JSON feeds for official agencies, then translates into localized, multilingual citizen alerts for Twilio SMS, WhatsApp Business, and Webhooks with delivery acknowledgment.',
    scientificValidation: 'WMO and OASIS mandate CAP for all multi-hazard early warning systems (MHEWS) to prevent conflicting emergency messages across municipal boundaries.',
    costLatencyImpact: 'Enables direct integration with official government dispatch desks with zero message delivery rejections.'
  }
];
