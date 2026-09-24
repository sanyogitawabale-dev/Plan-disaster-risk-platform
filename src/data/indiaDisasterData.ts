import {
  CriticalAsset,
  RoadSegment,
  EvacuationShelter,
  SarPixelData,
  StormScenario,
  TemporalTimeStep,
  DigitalTwinNode,
  HistoricalEventMemory,
  DataQualityFeed,
  GovernancePolicyAction,
  OfficialAuthorityStatus,
  IndiaStandardEntry,
  CompoundHazardDecomposition,
  RoadHydraulicAssessment,
  SourceHierarchyTier,
  EmergencyContactRecord,
  HazardPlugin,
  GoogleFloodGaugeRecord
} from '../types';

// ==========================================
// 1. INDIA CYCLONE SCENARIO (IMD Standards)
// ==========================================
export const INDIA_SCENARIO: StormScenario = {
  id: 'cyclone_dana_bay_of_bengal',
  name: 'Very Severe Cyclonic Storm (VSCS) Dana',
  category: 4, // IMD Very Severe Cyclonic Storm scale (64–89 knots / 118–166 km/h sustain, gusts to 185–205 km/h)
  landfallEtaHours: 4.5,
  maxWindsKmh: 185, // Sustained 185 km/h, peak gusts 205 km/h (Grounded in IMD DWR Paradip & AWS observations)
  centralPressureHpa: 954,
  projectedSurgeMaxM: 3.8, // 3.8m above astronomical spring high tide (GTS Datum MSL)
  rainfallAccumulationMm: 340, // 340mm in 24 hours (Extreme Heavy Rainfall category per IMD)
  currentTrackCoords: [
    [19.82, 86.10], // Offshore Puri / Konark
    [20.35, 86.70], // Paradip coastal approach
    [20.80, 87.15], // Dhamra estuary landfall zone
    [21.40, 87.65]  // Northward tracking toward Balasore / Digha
  ],
  regionalFramework: 'INDIA_NDMA',
  // Official IMD 4-Stage Warning Lifecycle Integration
  imdWarningStage: 'CYCLONE_WARNING',
  imdWarningColor: 'RED',
  imdIntensityCategory: 'VSCS',
  bulletinNumber: 16,
  issueTime: '2026-09-22T06:00:00+05:30',
  validTime: '2026-09-22T12:00:00+05:30',
  nextBulletinTime: '2026-09-22T09:00:00+05:30',
  windRadiiKm: {
    galeRadius50kt: 110,
    stormRadius34kt: 235
  }
};

// ==========================================
// 2. INDIA CRITICAL INFRASTRUCTURE ASSETS
// ==========================================
export const INDIA_ASSETS: CriticalAsset[] = [
  {
    id: 'asset_optcl_paradip_substation',
    name: 'OPTCL 220kV/132kV Paradip Grid Substation',
    type: 'substation',
    coordinates: [20.312, 86.608],
    elevationMsl: 2.3, // Great Trigonometrical Survey (GTS) Datum MSL
    finishedFloorElevation: 2.9, // Control room FFE at +2.9m GTS MSL
    structuralValueMillions: 51.0, // ₹420 Crore approx
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Primary bulk transmission feed for Paradip Port Oil Handling Complex, IOCL Refinery, and SCB Medical College emergency feeders',
    blueprintSummary: 'Air-insulated 220kV switchyard with SF6 circuit breakers on concrete plinths at +0.75m above grade. Ground floor control room at +2.9m GTS MSL. Structural wind loads derived per IS 875 (Part 3):2015 (Vb=50 m/s for coastal Jagatsinghpur, k1=1.07 lifeline factor, k2=1.05 terrain cat 1, k3=1.0, k4=1.15 cyclonic importance -> design Vz=64.7 m/s, design pressure Pz=2.51 kPa); concrete plinths designed to IS 456:2000 for marine cover durability (50mm nominal cover against saline atmospheric attack).',
    status: 'at_risk',
    projectedSurgeDepth: 3.6, // Net water depth +0.70m above FFE, +2.05m above switchyard plinths
    slopeDegrees: 1.2,
    sarSoilSaturation: 0.92,
    twinNodeId: 'node_optcl_paradip_220kv',
    riskBreakdown: {
      hazardScore: 94,
      exposureScore: 96,
      vulnerabilityScore: 91,
      criticalityScore: 98,
      compositeRiskIndex: 95,
      riskGrade: 'CRITICAL',
      confidencePercent: 90,
      evidence: [
        'Projected coastal storm surge of +3.60m above GTS MSL breaches Finished Floor Elevation (+2.90m) by 0.70m',
        'Direct spatial intersection with CWC Mahanadi Estuarine delta 100-year inundation polygon (ST_Intersects = TRUE)',
        'ISRO Bhuvan InSAR soil moisture saturation at 92% indicating saturated marine clay substrate',
        'Single point of failure for SCB Medical College backup lines and Paradip Port Oil Handling Berth'
      ],
      uncertainties: [
        'Tidal bore amplification along Mahanadi distributary creeks estimated at ±0.30m',
        'Transformer cable trench water-stop neoprene seals aged past 5-year replacement cycle'
      ],
      modelProvenance: {
        hazardModel: 'IMD Advanced Storm Surge Model (IIT Delhi / INCOIS Coupled Hydrodynamic ADCIRC)',
        exposureEngine: 'PostGIS ST_Intersects on ISRO Bhuvan National Cadastral Vector Layer',
        vulnerabilityCurve: 'Central Electricity Authority (CEA) / NDMA Substation Flood Fragility Matrix',
        riskEngineVersion: 'GeoShield India RiskCore v3.1 (IS 875 / IS 456 Compliant)',
        dataTimestamp: '2026-09-22T05:30:00Z'
      }
    }
  },
  {
    id: 'asset_scb_medical_college',
    name: 'SCB Medical College & AIIMS Coastal Emergency Trauma Ward',
    type: 'hospital',
    coordinates: [20.468, 85.882],
    elevationMsl: 12.4,
    finishedFloorElevation: 13.2,
    structuralValueMillions: 102.0, // ₹850 Crore
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Dual-circuit 33kV feed from OPTCL + 2x 1000kVA Kirloskar diesel generators with 48h underground diesel storage',
    blueprintSummary: 'Tertiary trauma ICU and neonatal life-support ward located on 2nd floor (+18.0m GTS MSL). Liquid Medical Oxygen (LMO) tank compound surrounded by 1.8m reinforced concrete flood bund.',
    status: 'operational',
    projectedSurgeDepth: 0.0, // Inland elevation safe from marine storm surge
    slopeDegrees: 2.4,
    sarSoilSaturation: 0.81,
    twinNodeId: 'node_scb_hospital_icu',
    riskBreakdown: {
      hazardScore: 42,
      exposureScore: 35,
      vulnerabilityScore: 38,
      criticalityScore: 99,
      compositeRiskIndex: 44,
      riskGrade: 'MEDIUM',
      confidencePercent: 92,
      evidence: [
        'Elevated GTS topography (+12.4m) provides absolute immunity against marine storm surge (+3.8m max)',
        'Rooftop Kirloskar 2000kVA generator tested with 48-hour fuel autonomy',
        'ICU ventilators and central medical oxygen manifolds positioned on 2nd and 3rd floors'
      ],
      uncertainties: [
        'Municipal storm runoff along Ring Road may submerge ground-level ambulance bay by 0.35m',
        'Fuel tanker resupply routes severed if State Highway SH-12 Marshaghai is blocked'
      ],
      modelProvenance: {
        hazardModel: 'CWC Mahanadi Basin Hydrological Runoff Model (MIKE 11 Coupled)',
        exposureEngine: 'OSDMA State Disaster Resource Network (SDRN) Geoportal',
        vulnerabilityCurve: 'NDMA Hospital Disaster Resilience & Mitigation Guidelines',
        riskEngineVersion: 'GeoShield India RiskCore v2.4',
        dataTimestamp: '2026-09-22T05:30:00Z'
      }
    }
  },
  {
    id: 'asset_mahanadi_jobra_barrage',
    name: 'Mahanadi River Jobra Barrage & Gate Control Center',
    type: 'water_plant',
    coordinates: [20.485, 85.908],
    elevationMsl: 18.2,
    finishedFloorElevation: 19.5,
    structuralValueMillions: 41.0, // ₹340 Crore
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Direct 11kV hydro feeder from Jobra powerhouse with dedicated standby diesel generators',
    blueprintSummary: '72 radial sluice gates regulating 1.2 million cusecs peak flood discharge from Hirakud Dam catchment into Bay of Bengal delta. SCADA gate winches with manual hand-crank failover mechanism. Hydraulic capacity engineered to CWC Guidelines for Design of Barrages and Weirs, IS 10751 (Planning & Design of Barrages & Weirs), and IS 11532 (Hydrodynamic and Gate Operation Criteria).',
    status: 'at_risk',
    projectedSurgeDepth: 0.0, // Riverine flood stage rather than ocean surge
    slopeDegrees: 4.8,
    sarSoilSaturation: 0.94,
    twinNodeId: 'node_mahanadi_intake',
    riskBreakdown: {
      hazardScore: 88,
      exposureScore: 85,
      vulnerabilityScore: 78,
      criticalityScore: 96,
      compositeRiskIndex: 87,
      riskGrade: 'HIGH',
      confidencePercent: 88,
      evidence: [
        'CWC stage telemetry reports discharge approaching 950,000 cusecs (Danger Level: 21.50m GTS MSL)',
        'Simultaneous cyclone landfall storm surge retards riverine drainage at the river mouth (estuarine compound flooding)',
        'Failure of radial gates to open in sequence would inundate Cuttack city low-lying wards'
      ],
      uncertainties: [
        'Hirakud dam release schedule from Upper Mahanadi catchment in Chhattisgarh subject to 12h transit lag'
      ],
      modelProvenance: {
        hazardModel: 'Central Water Commission (CWC) Integrated Flood Forecast System (IFFS)',
        exposureEngine: 'National Remote Sensing Centre (NRSC) River Basin Cadastre',
        vulnerabilityCurve: 'Central Water Power Research Station (CWPRS) Gate Hydrodynamic Curves & IS 10751',
        riskEngineVersion: 'GeoShield India RiskCore v3.1',
        dataTimestamp: '2026-09-22T05:30:00Z'
      }
    }
  },
  {
    id: 'asset_kendrapara_ncrmp_shelter',
    name: 'Kendrapara Multipurpose Cyclone Shelter (NCRMP Phase-II / OSDMA)',
    type: 'shelter',
    coordinates: [20.521, 86.745],
    elevationMsl: 5.5,
    finishedFloorElevation: 8.5, // Built on reinforced concrete stilts 3.0m above ground
    structuralValueMillions: 2.2, // ₹18 Crore
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Rooftop 15kW solar-battery hybrid microgrid + 25kVA soundproof diesel generator',
    blueprintSummary: 'Constructed under National Cyclone Risk Mitigation Project (NCRMP Phase-II) and OSDMA. Concrete framing designed per IS 456:2000 for marine environmental durability (M35 grade, 50mm cover); structural wind resistance per IS 875 (Part 3):2015 (Vb=50 m/s, k4=1.15 cyclonic factor); deep pile foundations designed against hydrodynamic scour and wave action per IRC:78 and IS 7784. Ground livestock refuge with elevated human quarters (+8.5m GTS MSL).',
    status: 'operational',
    projectedSurgeDepth: 3.2, // Submerges ground livestock pen, but shelter living quarters (+8.5m) remain 5.3m above water
    slopeDegrees: 0.8,
    sarSoilSaturation: 0.90,
    twinNodeId: 'node_ncrmp_shelter_04',
    riskBreakdown: {
      hazardScore: 75,
      exposureScore: 60,
      vulnerabilityScore: 18,
      criticalityScore: 92,
      compositeRiskIndex: 26,
      riskGrade: 'LOW',
      confidencePercent: 95,
      evidence: [
        'Finished Floor Elevation (+8.5m) sits 4.9m above projected surge peak (+3.6m)',
        'Engineered RCC stilt columns designed to IS 456:2000 (marine grade M35 concrete with 50mm cover), with foundation scour resistance verified under IRC:78 / IS 7784',
        'Solar microgrid provides autonomous lighting, water filtration, and VHF emergency comms'
      ],
      uncertainties: [
        'Access ramp might be inundated for 4 hours during peak surge, preventing late vehicle arrivals'
      ],
      modelProvenance: {
        hazardModel: 'IMD / INCOIS Coastal Surge Inundation Grid',
        exposureEngine: 'OSDMA GIS Web-Atlas (NCRMP Asset Repository)',
        vulnerabilityCurve: 'IIT Kharagpur / NDMA Multi-Hazard Cyclone Shelter Vulnerability Curve',
        riskEngineVersion: 'GeoShield India RiskCore v3.1',
        dataTimestamp: '2026-09-22T05:30:00Z'
      }
    }
  },
  {
    id: 'asset_dhamra_lng_terminal',
    name: 'Dhamra Port LNG Terminal & Cryogenic Storage Vault',
    type: 'water_plant',
    coordinates: [20.812, 86.974],
    elevationMsl: 4.1,
    finishedFloorElevation: 5.2,
    structuralValueMillions: 625.0, // ₹5,200 Crore
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Dedicated gas-turbine co-generation plant + triple-redundant UPS power architecture',
    blueprintSummary: 'Full-containment LNG storage tanks with outer 900mm prestressed concrete walls designed to withstand 500-year cyclone storm surge and IS 1893 Zone-III seismic motions. Perimeter sea dyke crest elevated to +7.2m GTS MSL.',
    status: 'at_risk',
    projectedSurgeDepth: 3.8, // Water level reaches +3.8m MSL, staying 3.4m below sea dyke crest (+7.2m)
    slopeDegrees: 1.5,
    sarSoilSaturation: 0.88,
    twinNodeId: 'node_dhamra_lng_terminal',
    riskBreakdown: {
      hazardScore: 95,
      exposureScore: 82,
      vulnerabilityScore: 45,
      criticalityScore: 97,
      compositeRiskIndex: 68,
      riskGrade: 'HIGH',
      confidencePercent: 91,
      evidence: [
        'Perimeter sea dyke (+7.2m MSL) maintains 3.4m freeboard over projected surge crest (+3.8m)',
        'Automated emergency shut-down (ESD) valves isolate cryogenic transfer lines at marine jetty',
        'Vessel unberthing protocol completed 12 hours prior to landfall under Port Cyclone SOP'
      ],
      uncertainties: [
        'Wave overtopping spray during 185 km/h winds may trip auxiliary flare gas ignition circuits'
      ],
      modelProvenance: {
        hazardModel: 'INCOIS Ocean Surge & Wave Model (SWAN-ADCIRC Coupled)',
        exposureEngine: 'Ministry of Ports, Shipping and Waterways Cadastral Survey',
        vulnerabilityCurve: 'Oil Industry Safety Directorate (OISD) Standard 117 Flood Fragility',
        riskEngineVersion: 'GeoShield India RiskCore v2.4',
        dataTimestamp: '2026-09-22T05:30:00Z'
      }
    }
  },
  {
    id: 'asset_bsnl_microwave_paradip',
    name: 'BSNL / DoT Coastal Emergency VHF & Microwave Tower',
    type: 'telecom',
    coordinates: [20.298, 86.685],
    elevationMsl: 28.5,
    finishedFloorElevation: 29.2,
    structuralValueMillions: 1.5, // ₹12 Crore
    criticalityTier: 'Tier-1 Vital Lifeline',
    powerDependency: 'Grid connection + 120-hour backup battery bank + 50kVA diesel generator with elevated fuel tank',
    blueprintSummary: 'Self-supporting 60m triangular steel lattice tower engineered per IS 875 (Part 3):2015 and IS 800:2007 (Basic wind speed Vb=50 m/s, risk factor k1=1.07 for post-disaster communication, terrain category 1 k2=1.17 at 60m, hill slope k3=1.08, cyclonic importance factor k4=1.15 per clause 6.3.4 -> design wind speed Vz=77.8 m/s / 280 km/h, design pressure Pz=3.63 kPa). Houses C-DOT Pan-India Cell Broadcast transmitter, OSDMA VHF wireless relay, and coastal police communications.',
    status: 'operational',
    projectedSurgeDepth: 0.0,
    slopeDegrees: 12.0,
    sarSoilSaturation: 0.62,
    twinNodeId: 'node_bsnl_paradip_tower',
    riskBreakdown: {
      hazardScore: 32,
      exposureScore: 12,
      vulnerabilityScore: 22,
      criticalityScore: 94,
      compositeRiskIndex: 25,
      riskGrade: 'LOW',
      confidencePercent: 96,
      evidence: [
        'Positioned on elevated laterite ridge (+28.5m GTS MSL) well above any potential coastal surge',
        'Tower structural engineering certified for 280 km/h design wind gusts under IS 875 (Part 3):2015 (Cyclone Dana peak gusts 205 km/h)',
        'Provides primary backbone for C-DOT SACHET emergency cell broadcast broadcasts'
      ],
      uncertainties: [
        'Extreme rainfall attenuation (rain fade) may degrade 7GHz microwave link to Bhubaneswar state EOC for 2-3 hours during eyewall passage'
      ],
      modelProvenance: {
        hazardModel: 'IS 875 (Part 3):2015 & IS 800:2007 Structural Aeroelastic Response Model',
        exposureEngine: 'Department of Telecommunications (DoT) Telecom Tower Registry',
        vulnerabilityCurve: 'Telecommunications Standards Development Society, India (TSDSI) Fragility',
        riskEngineVersion: 'GeoShield India RiskCore v3.1',
        dataTimestamp: '2026-09-22T05:30:00Z'
      }
    }
  }
];

// ==========================================
// 3. INDIA ROAD & HIGHWAY CORRIDORS (NHAI/PWD)
// ==========================================
export const INDIA_ROADS: RoadSegment[] = [
  {
    id: 'road_nh16_coastal_artery',
    name: 'National Highway NH-16 (Kolkata-Chennai Golden Quadrilateral Artery)',
    startCoord: [20.45, 85.85], // Cuttack
    endCoord: [21.49, 86.93],   // Balasore
    elevationMin: 4.8,
    cutoffTimeEtaHours: 99.0, // Open 4-lane elevated corridor
    status: 'open',
    evacuationCorridorPriority: 'Primary',
    rerouteImpactHospitalMinutes: 0,
    rerouteImpactShelterMinutes: 0
  },
  {
    id: 'road_sh12_cuttack_paradip',
    name: 'State Highway SH-12 (Cuttack-Paradip Port Expressway)',
    startCoord: [20.44, 85.92], // Cuttack
    endCoord: [20.31, 86.61],   // Paradip
    elevationMin: 1.6, // Low-lying canal embankment near Marshaghai
    cutoffTimeEtaHours: 2.2, // Severed by storm surge tidal creek overtopping
    status: 'severed',
    evacuationCorridorPriority: 'Primary',
    rerouteImpactHospitalMinutes: 55,
    rerouteImpactShelterMinutes: 35
  },
  {
    id: 'road_erasama_cyclone_corridor',
    name: 'Erasama Coastal Saline Embankment Road (MDR-44)',
    startCoord: [20.32, 86.65],
    endCoord: [20.53, 86.76],
    elevationMin: 1.1,
    cutoffTimeEtaHours: 1.5,
    status: 'severed',
    evacuationCorridorPriority: 'Secondary',
    rerouteImpactHospitalMinutes: 80,
    rerouteImpactShelterMinutes: 45
  },
  {
    id: 'road_chandikhol_paradip_nh53',
    name: 'National Highway NH-53 (Chandikhol-Duburi Mining & Heavy Transport Corridor)',
    startCoord: [20.58, 86.15],
    endCoord: [20.32, 86.58],
    elevationMin: 7.5,
    cutoffTimeEtaHours: 99.0,
    status: 'open',
    evacuationCorridorPriority: 'Primary',
    rerouteImpactHospitalMinutes: 15,
    rerouteImpactShelterMinutes: 10
  }
];

// ==========================================
// 4. INDIA EVACUATION SHELTERS (NCRMP/OSDMA)
// ==========================================
export const INDIA_SHELTERS: EvacuationShelter[] = [
  {
    id: 'shelter_erasama_mpcs_04',
    name: 'Erasama NCRMP Multipurpose Cyclone Shelter #04 (Kendrapara)',
    coordinates: [20.521, 86.745],
    elevationMsl: 8.5, // Stilt FFE
    capacity: 1800,
    currentOccupancy: 1240,
    hasBackupGenerator: true,
    generatorElevationMsl: 9.2,
    status: 'active_open'
  },
  {
    id: 'shelter_paradip_port_kalyan',
    name: 'Paradip Port Trust (PPT) Kalyan Mandap Relief Complex',
    coordinates: [20.315, 86.612],
    elevationMsl: 9.8,
    capacity: 2500,
    currentOccupancy: 1850,
    hasBackupGenerator: true,
    generatorElevationMsl: 10.5,
    status: 'active_open'
  },
  {
    id: 'shelter_kendrapara_college',
    name: 'Kendrapara Autonomous Government College Centre',
    coordinates: [20.505, 86.425],
    elevationMsl: 14.2,
    capacity: 1200,
    currentOccupancy: 640,
    hasBackupGenerator: true,
    generatorElevationMsl: 14.8,
    status: 'active_open'
  },
  {
    id: 'shelter_marshaghai_school',
    name: 'Marshaghai High School Relief Centre',
    coordinates: [20.442, 86.515],
    elevationMsl: 1.9, // Low lying, inside surge zone
    capacity: 600,
    currentOccupancy: 0,
    hasBackupGenerator: false,
    generatorElevationMsl: 1.9,
    status: 'compromised' // Evacuated to higher ground
  }
];

// ==========================================
// 5. INDIA SAR HOTSPOTS & GEOTECHNICAL RISKS
// ==========================================
export const INDIA_SAR_HOTSPOTS: SarPixelData[] = [
  {
    id: 'sar_mahanadi_estuary_delta',
    coordinates: [20.335, 86.635],
    slopeDegrees: 2.1,
    sarRelativeSaturation: 0.94, // InSAR saturation index
    insarDisplacementRateMmYr: 14.2, // Alluvial compaction and soil settlement
    landslideProbability: 18 // Low slope, but severe liquifaction & scour threat
  },
  {
    id: 'sar_chandipur_dune_breach',
    coordinates: [21.465, 87.025],
    slopeDegrees: 8.5,
    sarRelativeSaturation: 0.88,
    insarDisplacementRateMmYr: 28.5, // Rapid intertidal sand spit erosion
    landslideProbability: 76
  },
  {
    id: 'sar_similipal_laterite_scarp',
    coordinates: [21.725, 86.350],
    slopeDegrees: 34.5,
    sarRelativeSaturation: 0.91,
    insarDisplacementRateMmYr: 22.0,
    landslideProbability: 84 // High flash-flood mudflow / debris slide threat
  }
];

// ==========================================
// 6. INDIA DIGITAL TWIN INFRASTRUCTURE GRAPH
// ==========================================
export const INDIA_DIGITAL_TWIN_NODES: DigitalTwinNode[] = [
  {
    id: 'node_optcl_400kv_feeder',
    name: 'Powergrid / OPTCL 400kV Bulk Grid Transmission Feeder',
    category: 'power_grid',
    elevationMsl: 5.5,
    finishedFloorElevation: 6.2,
    upstreamNodeIds: [],
    downstreamNodeIds: ['node_optcl_paradip_220kv'],
    status: 'normal',
    cascadeTimeLagMinutes: 0,
    consequenceOnFailure: 'De-energizes primary Odisha coastal high-voltage grid corridor'
  },
  {
    id: 'node_optcl_paradip_220kv',
    name: 'OPTCL 220kV/132kV Paradip Grid Substation',
    category: 'power_grid',
    elevationMsl: 2.3,
    finishedFloorElevation: 2.9,
    upstreamNodeIds: ['node_optcl_400kv_feeder'],
    downstreamNodeIds: ['node_scb_hospital_icu', 'node_mahanadi_intake'],
    status: 'at_risk',
    cascadeTimeLagMinutes: 15,
    consequenceOnFailure: 'Submersion causes catastrophic busbar arc flash, cutting primary power to SCB Hospital feeders and municipal water pumping'
  },
  {
    id: 'node_scb_hospital_icu',
    name: 'SCB Medical College ICU & Trauma Life-Support Ward',
    category: 'healthcare',
    elevationMsl: 12.4,
    finishedFloorElevation: 13.2,
    upstreamNodeIds: ['node_optcl_paradip_220kv'],
    downstreamNodeIds: ['node_hospital_genset_scb'],
    status: 'on_generator',
    backupGeneratorAutonomyHours: 24.0,
    cascadeTimeLagMinutes: 45,
    consequenceOnFailure: 'Grid cut triggers automatic changeover to twin 1000kVA Kirloskar diesel generators (24h fuel autonomy)'
  },
  {
    id: 'node_hospital_genset_scb',
    name: 'Hospital Rooftop 2000kVA Kirloskar Diesel Generator Bank',
    category: 'healthcare',
    elevationMsl: 18.5,
    finishedFloorElevation: 18.8,
    upstreamNodeIds: ['node_scb_hospital_icu'],
    downstreamNodeIds: [],
    status: 'normal',
    backupGeneratorAutonomyHours: 24.0,
    cascadeTimeLagMinutes: 0,
    consequenceOnFailure: 'Depletion of diesel tanks would endanger 120 critical ventilator and neonatal incubator patients'
  },
  {
    id: 'node_mahanadi_intake',
    name: 'Mahanadi Coastal Drinking Water Pumping & Treatment Plant',
    category: 'water_sanitation',
    elevationMsl: 1.9,
    finishedFloorElevation: 2.4,
    upstreamNodeIds: ['node_optcl_paradip_220kv'],
    downstreamNodeIds: [],
    status: 'failed',
    cascadeTimeLagMinutes: 30,
    consequenceOnFailure: 'Loss of electric power shuts off intake pumps; potable water supply to 220,000 citizens halted'
  }
];

// ==========================================
// 7. INDIA TEMPORAL TIMELINE ("What Changed?")
// ==========================================
export const INDIA_TEMPORAL_TIMELINE: TemporalTimeStep[] = [
  {
    stepId: 'T-24h',
    label: '24 Hours Before Landfall (IMD Yellow Watch)',
    isPastOrForecast: 'historical',
    floodExposedAssetsCount: 3,
    highRiskRoadsCount: 1,
    hospitalExposureGrade: 'LOW',
    projectedSurgeM: 1.5,
    rainfallAccumulationMm: 40,
    deltaSummary: 'IMD Bulletin #04 issues Cyclone Alert. District Collectors (DM) put ODRF & NDRF teams on 30-minute standby.',
    keyDrivers: ['Cyclone Dana intensifies over East-Central Bay of Bengal', 'Sea surface temperatures at 30.5°C fueling convection']
  },
  {
    stepId: 'T-12h',
    label: '12 Hours Before Landfall (IMD Orange Alert)',
    isPastOrForecast: 'historical',
    floodExposedAssetsCount: 11,
    highRiskRoadsCount: 2,
    hospitalExposureGrade: 'LOW',
    projectedSurgeM: 2.4,
    rainfallAccumulationMm: 110,
    deltaSummary: 'Surge projection elevated +0.9m. OSDMA orders mandatory evacuation of 250,000 residents within 5km coastal zone.',
    keyDrivers: ['Forward motion slows to 11 km/h increasing storm surge piling', 'Spring tide high cycle approaches']
  },
  {
    stepId: 'T-6h',
    label: '6 Hours Before Landfall (IMD Red Warning)',
    isPastOrForecast: 'historical',
    floodExposedAssetsCount: 18,
    highRiskRoadsCount: 4,
    hospitalExposureGrade: 'MEDIUM',
    projectedSurgeM: 3.2,
    rainfallAccumulationMm: 220,
    deltaSummary: 'State Highway SH-12 Marshaghai overtopped by 0.4m brackish water. C-DOT SACHET cell broadcast alert triggered.',
    keyDrivers: ['Eyewall gale winds reach 175 km/h', 'Mahanadi distributaries experience severe tidal backwater surge']
  },
  {
    stepId: 'NOW',
    label: 'Current Operational Assessment (NOW - Eye Approaching)',
    isPastOrForecast: 'current',
    floodExposedAssetsCount: 26,
    highRiskRoadsCount: 7,
    hospitalExposureGrade: 'MEDIUM',
    projectedSurgeM: 3.8,
    rainfallAccumulationMm: 340,
    deltaSummary: 'CRITICAL DELTA: Exposed assets jumped 18 → 26 (+44%). OPTCL Paradip Substation FFE breached by +0.70m. SH-12 severed.',
    keyDrivers: [
      'Peak storm surge (+3.8m above GTS MSL) coincides with astronomical spring high tide at 19:15 IST',
      'Rainfall rate upgraded to 45mm/hour in Kendrapara and Jagatsinghpur blocks',
      'Mahanadi delta soil saturation at 92%'
    ]
  },
  {
    stepId: 'T+6h',
    label: '6 Hours Post-Landfall (Inland Flood Surge)',
    isPastOrForecast: 'forecast',
    floodExposedAssetsCount: 30,
    highRiskRoadsCount: 9,
    hospitalExposureGrade: 'HIGH',
    projectedSurgeM: 2.8,
    rainfallAccumulationMm: 440,
    deltaSummary: 'Runoff from Hirakud downstream catchment reaches Cuttack delta. Jobra barrage gates discharge 900,000 cusecs.',
    keyDrivers: ['Severe riverine discharge meets receding tidal barrier', 'SCB Hospital operates on emergency generator']
  },
  {
    stepId: 'T+12h',
    label: '12 Hours Post-Landfall (Restoration Phase)',
    isPastOrForecast: 'forecast',
    floodExposedAssetsCount: 14,
    highRiskRoadsCount: 4,
    hospitalExposureGrade: 'LOW',
    projectedSurgeM: 1.1,
    rainfallAccumulationMm: 480,
    deltaSummary: 'Tidal drainage underway. ODRF / NDRF clearance teams restore traffic on National Highway NH-16.',
    keyDrivers: ['Winds ease below 65 km/h', 'OPTCL grid testing commences under State EOC clearance']
  }
];

// ==========================================
// 8. INDIA DATA QUALITY & TELEMETRY FEEDS
// ==========================================
export const INDIA_DATA_FEEDS: DataQualityFeed[] = [
  {
    id: 'feed_imd_mausam',
    name: 'IMD Mausam Numerical Weather Prediction (0.1° GFS/WRF & DWR Paradip Radar)',
    category: 'NWP Weather',
    status: 'GREEN',
    freshnessLabel: 'Live Sync (Updated 14 mins ago)',
    latencySeconds: 840,
    coveragePercent: 100,
    uncertaintyFactor: '±14% track spread in 48h horizon; DWR Doppler beam width 1.0°',
    fallbackAvailable: true,
    notes: 'Operational IMD NWP model coupled with Doppler Weather Radars at Paradip & Kolkata.'
  },
  {
    id: 'feed_isro_insat_oceansat',
    name: 'ISRO INSAT-3DR Rapid Scan & Oceansat-3 Wind Scatterometer (MOSDAC)',
    category: 'Satellite SAR',
    status: 'GREEN',
    freshnessLabel: 'Rapid Scan (Updated 18 mins ago)',
    latencySeconds: 1080,
    coveragePercent: 96,
    uncertaintyFactor: 'Ocean surface wind vector retrieval error ±1.8 m/s',
    fallbackAvailable: true,
    notes: 'Thermal Infrared and Water Vapour imagery capturing cyclonic eyewall convection.'
  },
  {
    id: 'feed_cwc_river_telemetry',
    name: 'CWC Hydrological Observations & Flood Forecasting (Mahanadi Basin)',
    category: 'River Telemetry',
    status: 'GREEN',
    freshnessLabel: 'Live Telemetry (Updated 5 mins ago)',
    latencySeconds: 300,
    coveragePercent: 98,
    uncertaintyFactor: 'Acoustic stage gauge sensor variance ±0.03m; rating-curve drift ±6%',
    fallbackAvailable: true,
    notes: 'CWC hydrological observations/telemetry and flood-forecast products, where available for the target basin/station (Jobra barrage telemetry active).'
  },
  {
    id: 'feed_isro_bhuvan_cartodem',
    name: 'ISRO Disaster Management Ecosystem (Bhuvan, Bhoonidhi, NDEM & Cartosat-1 10m DEM)',
    category: 'Terrain DEM',
    status: 'GREEN',
    freshnessLabel: 'Static Ground Truth (SOI GTS Calibrated)',
    latencySeconds: 0,
    coveragePercent: 100,
    uncertaintyFactor: 'Vertical accuracy ±1.5m in dense estuarine mangrove zones',
    fallbackAvailable: true,
    notes: 'ISRO Bhuvan emergency geoportal, Bhoonidhi open data, NDEM resources, and Cartosat-1 DEM calibrated to Survey of India (SOI) GTS benchmarks.'
  },
  {
    id: 'feed_cdot_sachet_cap',
    name: 'NDMA SACHET CAP-based Integrated Alert System / India CAP Profile',
    category: 'Infrastructure GIS',
    status: 'GREEN',
    freshnessLabel: 'Gateway Active (Zero Alert Queue)',
    latencySeconds: 15,
    coveragePercent: 99,
    uncertaintyFactor: 'Cell tower congestion factor in peak disaster blast < 2.5%',
    fallbackAvailable: true,
    notes: 'NDMA SACHET Common Alerting Protocol (India CAP Profile) integrated with Pan-India Cell Broadcast System (DoT/C-DOT).'
  }
];

// ==========================================
// 9. INDIA GOVERNANCE POLICY ACTIONS (DM ACT 2005)
// ==========================================
export const INDIA_GOVERNANCE_POLICY_ACTIONS: GovernancePolicyAction[] = [
  {
    id: 'act_ingest_imd_data',
    title: 'Automated IMD Mausam & CWC Telemetry Ingestion',
    actionDomain: 'alert',
    automationTier: 'Automatic',
    status: 'APPROVED',
    approverRoleRequired: 'System Pipeline Engine',
    requiresDualPin: false,
    description: 'Autonomous pulling of IMD 0.1° numerical forecast, INCOIS storm surge tables, and CWC water stages every 10 minutes.',
    consequenceWarning: 'None (read-only telemetry).'
  },
  {
    id: 'act_calc_risk_is875',
    title: 'Deterministic PostGIS & IS 875 Risk Index Calculation',
    actionDomain: 'alert',
    automationTier: 'Automatic',
    status: 'APPROVED',
    approverRoleRequired: 'System Pipeline Engine',
    requiresDualPin: false,
    description: 'Calculates net flood depth above GTS Finished Floor Elevation (FFE) and structural wind drag forces (IS 875 Part 3).',
    consequenceWarning: 'None (analytical computation).'
  },
  {
    id: 'act_collector_sec34_evac',
    title: 'Disaster Management Act 2005 Section 34 Mandatory Evacuation Order',
    actionDomain: 'alert',
    automationTier: 'Human Authorization',
    status: 'APPROVED',
    approverRoleRequired: 'District Magistrate & Collector (DDMA Chairman)',
    requiresDualPin: false,
    description: 'Invokes Section 34 of Disaster Management Act 2005 for compulsory evacuation of 250,000 residents to Multipurpose Cyclone Shelters.',
    consequenceWarning: 'Deploys police force and civil defense to enforce zero-casualty evacuation.'
  },
  {
    id: 'act_sachet_cell_broadcast',
    title: 'C-DOT SACHET Multi-Lingual Pan-India Cell Broadcast Blast',
    actionDomain: 'alert',
    automationTier: 'Approval Required',
    status: 'APPROVED',
    approverRoleRequired: 'State EOC Director (OSDMA / SDMA) & Incident Commander',
    requiresDualPin: false,
    description: 'Broadcasts geo-targeted sirens and emergency text alerts in Odia, Hindi, Bengali, and English to 1.4 million mobile phones in the coastal corridor.',
    consequenceWarning: 'Activates high-priority acoustic warning tone on all active cellular devices across 4 districts.'
  },
  {
    id: 'act_nhai_cordon_sh12',
    title: 'Enact Traffic Diversion & Barricade State Highway SH-12 at Marshaghai',
    actionDomain: 'traffic',
    automationTier: 'Human Authorization',
    status: 'APPROVED',
    approverRoleRequired: 'Superintendent of Police (Traffic) & State PWD Executive Engineer',
    requiresDualPin: false,
    description: 'Physically barricades flood-prone coastal stretch of SH-12 and diverts all emergency traffic onto elevated NH-16 / NH-53.',
    consequenceWarning: 'Increases transit time for patient transfer convoys by +55 minutes.'
  },
  {
    id: 'act_optcl_grid_deenergize',
    title: 'Controlled De-Energization of OPTCL 220kV Paradip Substation',
    actionDomain: 'grid_control',
    automationTier: 'Dual Authorization',
    status: 'PENDING_APPROVAL',
    approverRoleRequired: 'State Load Despatch Centre (SLDC) Chief Controller + OSDMA Disaster Commissioner (Dual PIN Required)',
    requiresDualPin: true,
    description: 'Opens 220kV transmission line breakers before salt-water inundation exceeds switchyard equipment clearance (+0.75m), preventing catastrophic arc flash fires.',
    consequenceWarning: 'Cuts primary grid power to 310,000 consumers, port installations, and requires SCB Hospital to operate on diesel generators.'
  }
];

// ==========================================
// 10. INDIA HISTORICAL EVENT MEMORY
// ==========================================
export const INDIA_HISTORICAL_EVENTS: HistoricalEventMemory[] = [
  {
    id: 'event_odisha_super_cyclone_1999',
    name: '1999 Odisha Super Cyclone (05B - Erasama / Paradip)',
    region: 'Jagatsinghpur & Kendrapara Corridor',
    date: 'October 1999',
    category: 5,
    peakSurgeM: 9.8,
    peakRainfallMm: 520,
    predictedInundationKm2: 950,
    actualInundationKm2: 1280,
    errorVariancePercent: 34.7,
    infrastructureDamagedCount: 1420,
    alertsIssuedCount: 12,
    falseAlarmsCount: 0,
    lessonsLearned: [
      'Catalyzed the establishment of OSDMA, NDMA, and the National Cyclone Risk Mitigation Project (NCRMP).',
      'Proved that single-story school buildings are completely death traps in 9m+ storm surges; necessitated elevated stilt-column Multipurpose Cyclone Shelters.',
      'Total collapse of telecommunications mandated the creation of redundant VHF wireless networks and satellite emergency phones.'
    ],
    modelCalibrationAdjustment: 'Calibrated extreme tidal surge baseline equation with 100-year return period bathymetric friction for Bay of Bengal.'
  },
  {
    id: 'event_cyclone_phailin_2013',
    name: 'Cyclone Phailin (Gopalpur / Ganjam Coast)',
    region: 'South Odisha Coastal Corridor',
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
      'Global benchmark mission: successfully evacuated 1.2 million citizens to NCRMP shelters in 48 hours with minimal loss of life.',
      'Telecom microwave towers built to IS 875 (Part 3) survived 220 km/h winds, maintaining emergency radio operations.'
    ],
    modelCalibrationAdjustment: 'Calibrated SLOSH astronomical tide timing to Survey of India (SOI) harmonic constants.'
  },
  {
    id: 'event_cyclone_fani_2019',
    name: 'Extremely Severe Cyclonic Storm Fani (Puri / Bhubaneswar)',
    region: 'Puri, Khordha & Cuttack Urban Corridor',
    date: 'May 2019',
    category: 5,
    peakSurgeM: 4.2,
    peakRainfallMm: 310,
    predictedInundationKm2: 340,
    actualInundationKm2: 360,
    errorVariancePercent: 5.8,
    infrastructureDamagedCount: 540,
    alertsIssuedCount: 94,
    falseAlarmsCount: 1,
    lessonsLearned: [
      'Wind damage caused catastrophic failure of 150,000 electric poles and 34 grid substations; spurred the policy mandate for underground coastal power cables.',
      'AIIMS Bhubaneswar and SCB Hospital managed 100% ICU patient survival by pre-stocking 7 days of diesel for backup generators.'
    ],
    modelCalibrationAdjustment: 'Integrated urban building roughness parameters into wind load structural damage fragility curves.'
  },
  {
    id: 'event_cyclone_amphan_2020',
    name: 'Super Cyclone Amphan (Sundarbans / West Bengal & Odisha)',
    region: 'Sundarbans Mangrove Delta',
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
      'Sundarbans dense mangrove forest dampens storm surge wave energy by up to 1.4m compared to unshielded embankments.',
      'Pan-India cell broadcast messages sent in Bengali and Odia reached rural populations without requiring mobile internet.'
    ],
    modelCalibrationAdjustment: 'Added mangrove vegetative drag coefficient (Cd = 0.14) to coastal hydrodynamic dissipation equation.'
  }
];

// ==========================================
// 11. OFFICIAL AUTHORITY STATUSES (TIER-1 AUTHORITATIVE)
// ==========================================
export const INDIA_OFFICIAL_AUTHORITIES: OfficialAuthorityStatus[] = [
  {
    authority: 'IMD',
    productName: 'National Cyclone Warning Bulletin #16',
    officialStatusText: 'Very Severe Cyclonic Storm (VSCS) Dana over East-Central Bay of Bengal. Cyclone Warning (RED) issued for Odisha Coast (Puri, Jagatsinghpur, Kendrapara, Bhadrak, Balasore). Sustained winds 185 km/h, gusts to 205 km/h.',
    severityColor: 'RED',
    timestamp: '2026-09-22T06:00:00+05:30',
    disclaimer: 'Authoritative operational cyclone bulletin issued under the authority of Director General of Meteorology, IMD New Delhi.'
  },
  {
    authority: 'INCOIS',
    productName: 'Ocean Storm Surge & Inundation Warning (ADCIRC Model)',
    officialStatusText: 'Storm surge of 2.0 to 3.8m above astronomical spring high tide predicted to inundate low-lying coastal areas of Kendrapara, Jagatsinghpur and Bhadrak districts around landfall.',
    severityColor: 'RED',
    timestamp: '2026-09-22T06:15:00+05:30',
    disclaimer: 'INCOIS operational storm surge model coupled with ADCIRC hydrodynamic simulation and Survey of India harmonic tides.'
  },
  {
    authority: 'CWC',
    productName: 'Mahanadi Basin Flood Forecast & River Telemetry',
    officialStatusText: 'Jobra Barrage (Cuttack) discharge at 820,000 cusecs, projected to touch 950,000 cusecs by 18:00 IST. River stage currently 20.85m GTS MSL (Warning Level: 21.00m, Danger Level: 21.50m).',
    severityColor: 'ORANGE',
    timestamp: '2026-09-22T06:20:00+05:30',
    disclaimer: 'CWC hydrological observations/telemetry and flood-forecast products, where available for the target basin/station.'
  },
  {
    authority: 'NDMA',
    productName: 'National Disaster Alerting Platform (SACHET CAP)',
    officialStatusText: 'Multi-hazard CAP alert broadcast active. Priority evacuation advisory issued to 14 coastal districts across Odisha and West Bengal.',
    severityColor: 'RED',
    timestamp: '2026-09-22T06:25:00+05:30',
    disclaimer: 'NDMA SACHET CAP-based Integrated Alert System / India CAP Profile.'
  },
  {
    authority: 'OSDMA',
    productName: 'State Emergency Operations Centre (SEOC) Directive',
    officialStatusText: 'Invoked Section 34 of Disaster Management Act 2005. Zero-Casualty mission active: 285,000 vulnerable citizens evacuated to 480 NCRMP cyclone shelters. 20 NDRF + 30 ODRF teams deployed.',
    severityColor: 'RED',
    timestamp: '2026-09-22T06:30:00+05:30',
    disclaimer: 'OSDMA Government of Odisha statutory disaster management order.'
  }
];

// ==========================================
// 12. INDIA ENGINEERING STANDARDS REGISTRY
// ==========================================
export const INDIA_STANDARDS_REGISTRY: IndiaStandardEntry[] = [
  {
    code: 'IS 875 (Part 3):2015',
    title: 'Design Loads (Other Than Earthquake) For Buildings and Structures — Code of Practice: Part 3 Wind Loads',
    category: 'Wind',
    edition: 'Third Revision (2015, Reaffirmed 2020)',
    effectiveDate: '2016-04-01',
    applicableAssetTypes: ['substation', 'telecom', 'hospital', 'shelter', 'bridge'],
    applicableHazard: 'Cyclonic winds, gust aerodynamic loading, along-wind & across-wind dynamic effects',
    keyClauses: [
      'Clause 6.2: Basic wind speed (Vb) lookup by site coordinates from Fig. 1 wind map (e.g. 50 m/s for coastal Odisha)',
      'Clause 6.3.1: Risk coefficient k1 (1.07 for post-disaster hospitals, substations, and emergency telecom; 1.00 normal)',
      'Clause 6.3.2: Terrain, height and structure size factor k2 (Terrain Category 1 coastal open terrain vs Category 3 urban)',
      'Clause 6.3.3: Topography factor k3 (1.0 for flat terrain, up to 1.36 for steep ridges/cliffs)',
      'Clause 6.3.4: Importance factor for cyclonic region k4 (1.15 for post-disaster and lifeline structures within 100km of coast, 1.00 for industrial)',
      'Clause 6.3: Design wind speed Vz = Vb * k1 * k2 * k3 * k4',
      'Clause 7.2: Design wind pressure Pz = 0.6 * Vz^2'
    ],
    calculationMethod: 'Vz = Vb * k1 * k2 * k3 * k4; Pz = 0.6 * (Vz)^2 (N/m²); Drag force F = Cf * Ae * Pz',
    requiredInputs: ['Latitude/Longitude', 'Asset Importance Tier', 'Height above grade (m)', 'Terrain Category (1-4)', 'Ridge Slope (%)'],
    sourceAuthority: 'Bureau of Indian Standards (BIS) / CED 57 Structural Engineering',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Crucial: Never hard-code uniform wind speeds. Geographic lookup derives Vb, then factors k1, k2, k3, k4 compute site-specific Vz.'
  },
  {
    code: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete — Code of Practice',
    category: 'Concrete',
    edition: 'Fourth Revision (2000, Reaffirmed 2021)',
    effectiveDate: '2000-10-01',
    applicableAssetTypes: ['substation', 'hospital', 'shelter', 'bridge', 'water_plant'],
    applicableHazard: 'Structural flexure/shear under extreme flood loading; durability in severe/extreme marine saline environments',
    keyClauses: [
      'Table 3: Environmental exposure conditions (Severe / Very Severe / Extreme coastal splash zone)',
      'Table 5: Minimum cement content, maximum water-cement ratio (0.40 for extreme exposure) and minimum grade M35 for coastal reinforced concrete',
      'Table 16: Nominal cover requirements (50mm for severe/extreme marine exposure, up to 75mm for tidal splash zones)',
      'Clause 35: Limit state design for collapse (flexure, compression, shear, torsion) and serviceability (deflection, cracking limits <= 0.1mm)'
    ],
    calculationMethod: 'Ultimate limit state design (1.5 * DL + 1.5 * WL / FL); Durability verification against chloride penetration and saline efflorescence.',
    requiredInputs: ['Concrete compressive strength fck (MPa)', 'Reinforcement yield strength fy (MPa)', 'Cover depth (mm)', 'Exposure Class'],
    sourceAuthority: 'Bureau of Indian Standards (BIS) / CED 2 Cement and Concrete',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'IS 456 is strictly the Indian code for plain and reinforced concrete structural design and marine durability checks, NOT a scour standard.'
  },
  {
    code: 'IRC:78-2014 & IS 7784',
    title: 'Standard Specifications & Code of Practice for Road Bridges Section VII: Foundations and Substructure (with Design of Bridge Pier Scour)',
    category: 'Bridges_Roads',
    edition: 'IRC:78-2014 (Third Revision) / IS 7784:1993',
    effectiveDate: '2014-06-01',
    applicableAssetTypes: ['bridge', 'shelter'],
    applicableHazard: 'Hydrodynamic scouring of foundations, estuarine tidal bore scour, unconstrained channel bed degradation',
    keyClauses: [
      'Clause 703: Lacey design scour depth equation: dsm = 1.34 * (Db^2 / f)^(1/3)',
      'Clause 703.3: Maximum scour depth factors for piers (2.0 * dsm) and abutments (1.27 * dsm)',
      'Silt factor f = 1.76 * sqrt(d50) where d50 is mean sediment particle size in mm',
      'Pile foundation embedment depth minimum 1/3 of scour depth into stable strata'
    ],
    calculationMethod: 'Lacey regime scour depth formula with hydraulic constriction multiplier and sediment grain size parameter.',
    requiredInputs: ['Design discharge Q (m³/s)', 'Effective waterway width W (m)', 'Mean bed sediment size d50 (mm)', 'Pier shape geometry factor'],
    sourceAuthority: 'Indian Roads Congress (IRC) / Ministry of Road Transport and Highways (MoRTH)',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Authoritative Indian standard for foundation hydraulic scour analysis for bridges and elevated stilt cyclone shelters.'
  },
  {
    code: 'MoRTH Specifications & IRC:SP:13-2004',
    title: 'Specifications for Road & Bridge Works (5th Rev) & Guidelines for the Design of Small Bridges and Culverts',
    category: 'Bridges_Roads',
    edition: 'MoRTH 5th Revision (2013) / IRC:SP:13-2004',
    effectiveDate: '2013-04-01',
    applicableAssetTypes: ['bridge'],
    applicableHazard: 'Roadway inundation, culvert waterway throttling, pavement subgrade saturation, embankment washout',
    keyClauses: [
      'MoRTH Section 300: Earthwork, erosion control and embankment subgrade slope stability under saturation',
      'MoRTH Section 2500: River training works and slope pitching/riprap protection with geotextile filters',
      'IRC:SP:13 Clause 6: Hydrologic calculation of flood discharge for small bridges and box culverts',
      'IRC:SP:13 Clause 7: High Flood Level (HFL) and freeboard minimum 0.6m to 1.2m above HFL',
      'Vehicle Safety Thresholds: Light motor vehicle cutoff depth > 0.15m, Heavy rescue convoy cutoff > 0.35m'
    ],
    calculationMethod: 'Overtopping ratio calculation Hw / D; Subgrade soaked CBR testing; Embankment slope slip circle factor of safety FOS >= 1.3',
    requiredInputs: ['Road crest level (m GTS MSL)', 'Surrounding flood stage (m)', 'Water velocity (m/s)', 'Culvert vent dimensions'],
    sourceAuthority: 'Ministry of Road Transport and Highways (MoRTH) & Indian Roads Congress',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Provides operational thresholds for highway closures, cordon enforcement, and emergency convoy routing.'
  },
  {
    code: 'CWC Guidelines & IS 10751 / IS 11532',
    title: 'Guidelines for Planning and Design of Barrages and Weirs (CWC) & IS 10751 / IS 11532 Hydrodynamic Gate Criteria',
    category: 'Hydraulic',
    edition: 'IS 10751:1994 (Reaffirmed 2019) / IS 11532:1995 / CWC Barrage Manual',
    effectiveDate: '1995-01-01',
    applicableAssetTypes: ['water_plant'],
    applicableHazard: 'Riverine flood routing, barrage backwater afflux, hydraulic jump apron scour, gate hoisting SCADA failure',
    keyClauses: [
      'IS 10751 Clause 5: Design flood discharge calculation using 100-year and standard project flood (SPF)',
      'IS 10751 Clause 7: Determination of waterway width, afflux, and pond level regulation',
      'IS 11532 Clause 4: Radial and vertical lift gate hoist capacity under differential water head and wave impact',
      'CWC Operation Manual: Gate operating schedule under estuarine tidal backwater lock-up'
    ],
    calculationMethod: 'Afflux calculation via Bradley formula; Hydraulic jump basin length L = 5 * (y2 - y1); Sluice gate discharge Q = Cd * A * sqrt(2gH)',
    requiredInputs: ['Catchment inflow (cusecs)', 'Downstream tidal surge stage (m)', 'Gate opening height (m)', 'Crest level (m GTS MSL)'],
    sourceAuthority: 'Central Water Commission (CWC) / Bureau of Indian Standards (BIS) River Valley Projects',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Replaces any improper blast standards. Governs river barrages (e.g. Jobra Barrage on the Mahanadi River).'
  },
  {
    code: 'IS 1893 (Part 1):2016',
    title: 'Criteria for Earthquake Resistant Design of Structures — Part 1: General Provisions and Buildings',
    category: 'Earthquake',
    edition: 'Sixth Revision (2016, Reaffirmed 2021)',
    effectiveDate: '2016-12-01',
    applicableAssetTypes: ['substation', 'hospital', 'shelter', 'water_plant'],
    applicableHazard: 'Co-seismic ground motion, liquefaction in saturated coastal alluvium/sands',
    keyClauses: [
      'Clause 6.4.2: Design horizontal seismic coefficient Ah = (Z / 2) * (I / R) * (Sa / g)',
      'Zone III Zone Factor Z = 0.16 for coastal Odisha (Paradip, Cuttack, Bhubaneswar)',
      'Importance Factor I = 1.5 for hospitals, grid substations, and cyclone shelters',
      'Response Reduction Factor R = 5.0 for Special Moment Resisting Frames (SMRF)'
    ],
    calculationMethod: 'Equivalent static lateral force method & Response spectrum dynamic analysis.',
    requiredInputs: ['Seismic Zone (II-V)', 'Importance Factor I', 'Soil Type (Soft / Medium / Rock)', 'Building Period Ta (s)'],
    sourceAuthority: 'Bureau of Indian Standards (BIS) / CED 39 Earthquake Engineering',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Important for verifying compound coastal hazards where saturated sands can undergo seismic liquefaction.'
  },
  {
    code: 'IS 800:2007',
    title: 'General Construction in Steel — Code of Practice',
    category: 'Steel',
    edition: 'Third Revision (2007, Reaffirmed 2022)',
    effectiveDate: '2008-01-01',
    applicableAssetTypes: ['telecom', 'substation'],
    applicableHazard: 'Wind aerodynamic drag on lattice towers, guy wire tension, member buckling under gust pressures',
    keyClauses: [
      'Section 3: Limit state design of steel members and connections',
      'Section 7: Design of compression members under combined axial load and wind bending moments',
      'Section 12: Durability against atmospheric marine corrosion (Hot-dip galvanizing minimum 610 g/m² per IS 4759)'
    ],
    calculationMethod: 'Limit state design for strength and serviceability (sway deflection limit H/500 for microwave antenna towers).',
    requiredInputs: ['Steel grade (Fe 410 / E250)', 'Slenderness ratio (lambda)', 'Wind load Pz', 'Galvanizing coating thickness'],
    sourceAuthority: 'Bureau of Indian Standards (BIS) / CED 7 Structural Steel',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Standard for telecom lattice towers (BSNL/DoT coastal towers) and substation gantry gantries.'
  },
  {
    code: 'CEA Regulations 2010',
    title: 'Central Electricity Authority (Measures Relating to Safety and Electric Supply) Regulations',
    category: 'Electrical_Lifeline',
    edition: '2010 (Amended 2018 & 2023)',
    effectiveDate: '2010-09-20',
    applicableAssetTypes: ['substation'],
    applicableHazard: 'Electric shock, arc flash fire under water ingress, salt contamination flashover on insulators',
    keyClauses: [
      'Regulation 58: Ground clearance and phase-to-ground clearances for 220kV / 132kV switchyards',
      'Regulation 61: Precautions against flood water inundation of substation transformer plinths and control rooms',
      'Creepage distance requirement: minimum 31mm/kV for high pollution marine saline coastal zones (IEC 60815 / CEA)'
    ],
    calculationMethod: 'Clearance verification: 220kV phase-to-ground clearance >= 2100mm; Plinth height >= 50-year HFL + 0.50m freeboard.',
    requiredInputs: ['Operating voltage (kV)', 'Ground water level (m)', 'Plinth elevation (m GTS MSL)', 'Specific creepage (mm/kV)'],
    sourceAuthority: 'Central Electricity Authority (CEA) / Ministry of Power',
    validationStatus: 'CONFIRMED_CURRENT',
    notes: 'Mandatory statutory regulations governing safe de-energization and plinth elevation for grid substations.'
  }
];

// ==========================================
// 13. DYNAMIC IS 875 (PART 3):2015 WIND CALCULATOR
// ==========================================
export function calculateIS875Wind({
  vb,
  k1 = 1.07,
  k2 = 1.05,
  k3 = 1.0,
  k4 = 1.15
}: {
  vb: number;
  k1?: number;
  k2?: number;
  k3?: number;
  k4?: number;
}) {
  const designWindSpeedVz = Number((vb * k1 * k2 * k3 * k4).toFixed(1));
  const designWindPressurePz = Number((0.6 * Math.pow(designWindSpeedVz, 2) / 1000).toFixed(2)); // kPa
  const windSpeedKmh = Number((designWindSpeedVz * 3.6).toFixed(0));

  return {
    basicWindSpeedVb: vb,
    k1RiskImportance: k1,
    k2TerrainHeight: k2,
    k3Topography: k3,
    k4CyclonicFactor: k4,
    designWindSpeedVzMs: designWindSpeedVz,
    designWindSpeedKmh: windSpeedKmh,
    designPressurePzKpa: designWindPressurePz
  };
}

// ==========================================
// 14. COMPOUND HAZARD DECOMPOSITION (ODISHA COAST)
// ==========================================
export const INDIA_COMPOUND_HAZARD: CompoundHazardDecomposition = {
  astronomicalTideM: 1.40, // Spring high tide relative to GTS MSL (Survey of India tide table)
  stormSurgeM: 2.40,      // Pure meteorological surge calculated by INCOIS ADCIRC model
  waveSetupM: 0.65,       // Dynamic coastal wave breaking setup in shallow shelf
  waveRunupM: 0.45,       // Swash run-up along 1:30 sandy coastal slope
  riverDischargeBackwaterM: 0.80, // Mahanadi river flood wave impounded by ocean surge barrier
  groundElevationGtsM: 2.30,      // OPTCL Paradip Substation ground elevation above GTS MSL
  totalWaterLevelMslM: 5.70,      // Net hydrodynamic stage: 1.40 + 2.40 + 0.65 + 0.45 + 0.80 = 5.70m
  netInundationDepthM: 3.40,      // Inundation above ground: 5.70m - 2.30m = 3.40m (+0.70m above FFE)
  dominantUncertaintyFactor: 'Dynamic wave setup & estuarine backwater interaction (estimated variance ±0.42m)',
  uncertaintySpreadM: 0.42
};

// ==========================================
// 15. ROAD & BRIDGE IRC-MoRTH HYDRAULIC ASSESSMENTS
// ==========================================
export const INDIA_ROAD_HYDRAULIC_ASSESSMENTS: RoadHydraulicAssessment[] = [
  {
    roadId: 'road_nh16_coastal_artery',
    roadName: 'National Highway NH-16 (Kolkata-Chennai Golden Quadrilateral)',
    governingStandards: ['IRC:6-2017', 'IRC:78-2014', 'MoRTH Section 300 (5th Rev)'],
    currentWaterDepthM: 0.04,
    flowVelocityMs: 0.2,
    scourRiskGrade: 'LOW',
    embankmentSaturationPercent: 42,
    culvertWaterwayRatio: 0.25,
    accessibilityStatus: {
      lightVehicles: 'PASSABLE',
      heavyRescueTrucks: 'PASSABLE',
      rescueBoatsOdrf: 'DRY'
    },
    closureDecision: 'OPEN',
    recommendedDetour: 'None required. Designated as primary 4-lane national logistics spine for NDRF convoy movements.'
  },
  {
    roadId: 'road_sh12_cuttack_paradip',
    roadName: 'State Highway SH-12 (Cuttack-Paradip Port Expressway at Marshaghai)',
    governingStandards: ['IRC:SP:13-2004', 'IRC:78-2014', 'MoRTH Section 2500'],
    currentWaterDepthM: 0.65,
    flowVelocityMs: 1.85,
    scourRiskGrade: 'HIGH',
    embankmentSaturationPercent: 88,
    culvertWaterwayRatio: 1.35, // Culverts submerged and overtopped
    accessibilityStatus: {
      lightVehicles: 'CUTOFF',       // Severely exceeds 0.15m limit
      heavyRescueTrucks: 'CUTOFF',   // Exceeds 0.35m limit and 1.5 m/s velocity
      rescueBoatsOdrf: 'OPTIMAL'    // Water depth > 0.50m suitable for Gemini inflatable boats
    },
    closureDecision: 'PHYSICAL_CORDON_MANDATORY',
    recommendedDetour: 'All vehicular traffic diverted via NH-53 Chandikhol-Duburi-Paradip bypass (+55 mins).'
  },
  {
    roadId: 'road_erasama_cyclone_corridor',
    roadName: 'Erasama Coastal Saline Embankment Road (MDR-44)',
    governingStandards: ['IRC:SP:20-2002', 'MoRTH Section 300', 'OSDMA Rural Road Resilience Norms'],
    currentWaterDepthM: 1.15,
    flowVelocityMs: 2.30,
    scourRiskGrade: 'CRITICAL',
    embankmentSaturationPercent: 96,
    culvertWaterwayRatio: 1.80,
    accessibilityStatus: {
      lightVehicles: 'CUTOFF',
      heavyRescueTrucks: 'CUTOFF',
      rescueBoatsOdrf: 'OPTIMAL'
    },
    closureDecision: 'PHYSICAL_CORDON_MANDATORY',
    recommendedDetour: 'Vehicular movement impossible. Active SAR sector: ODRF & Indian Coast Guard hovercraft operations only.'
  },
  {
    roadId: 'road_chandikhol_paradip_nh53',
    roadName: 'National Highway NH-53 (Heavy Industrial & Port Corridor)',
    governingStandards: ['IRC:6-2017', 'MoRTH Section 300'],
    currentWaterDepthM: 0.08,
    flowVelocityMs: 0.35,
    scourRiskGrade: 'LOW',
    embankmentSaturationPercent: 54,
    culvertWaterwayRatio: 0.40,
    accessibilityStatus: {
      lightVehicles: 'PASSABLE',
      heavyRescueTrucks: 'PASSABLE',
      rescueBoatsOdrf: 'DRY'
    },
    closureDecision: 'OPEN',
    recommendedDetour: 'Primary open corridor for fuel tanker resupply to SCB Medical College and Paradip emergency generators.'
  }
];

// ==========================================
// 16. MULTI-TIER DATA SOURCE HIERARCHY
// ==========================================
export const INDIA_SOURCE_HIERARCHY: SourceHierarchyTier[] = [
  {
    tierNumber: 1,
    tierName: 'TIER 1 — Official Operational Authorities',
    governanceRule: 'Authoritative national baseline truth. Legally mandated warnings. Automated AI models and GeoShield engines MUST ingest and NEVER override Tier-1 warnings.',
    agenciesOrServices: [
      'India Meteorological Department (IMD) — Official Cyclone, Wind & Rainfall Bulletins',
      'Central Water Commission (CWC) — Official Riverine Hydrology & Flood Forecasts',
      'Indian National Centre for Ocean Information Services (INCOIS) — Official Storm Surge & Tsunami Alerts',
      'National Disaster Management Authority (NDMA) — National Policy & SACHET Alerts',
      'Odisha State Disaster Management Authority (OSDMA) — State EOC Directives & Evacuations'
    ],
    canOverrideOfficialWarnings: false
  },
  {
    tierNumber: 2,
    tierName: 'TIER 2 — Government EO & Spatial Repositories',
    governanceRule: 'Authoritative geospatial ground-truth and cadastral boundaries. Used for spatial intersections (ST_Intersects) and elevation referencing.',
    agenciesOrServices: [
      'ISRO Bhuvan Geoportal (Thematic, Sectoral & Disaster Management Applications)',
      'ISRO Bhoonidhi (Open Earth Observation Data Hub)',
      'National Database for Emergency Management (NDEM)',
      'Survey of India (SOI) — Great Trigonometrical Survey (GTS) Benchmarks'
    ],
    canOverrideOfficialWarnings: false
  },
  {
    tierNumber: 3,
    tierName: 'TIER 3 — Scientific & Global Remote Sensing',
    governanceRule: 'Independent scientific cross-validation and background model forcing. Used to compute antecedent soil moisture and rainfall accumulation trends.',
    agenciesOrServices: [
      'Copernicus Sentinel-1 SAR & Sentinel-2 Optical (ESA)',
      'NASA/JAXA Global Precipitation Measurement (GPM) IMERG',
      'ECMWF ERA5 Atmospheric Reanalysis',
      'GEBCO Global Ocean Bathymetry'
    ],
    canOverrideOfficialWarnings: false
  },
  {
    tierNumber: 4,
    tierName: 'TIER 4 — Commercial & Local Telemetry',
    governanceRule: 'Localized empirical field observations. Subject to automated data-quality filtering and sensor drift calibration before ingestion.',
    agenciesOrServices: [
      'State SCADA Telemetry (OPTCL Substation Transducers, CWC Acoustic Gauges)',
      'Telecom Tower IoT Health Status (BSNL/DoT Tower Ping Feeds)',
      'Municipal Rain Gauges and AWS Networks'
    ],
    canOverrideOfficialWarnings: false
  },
  {
    tierNumber: 5,
    tierName: 'TIER 5 — AI Inference & Qualitative Synthesis',
    governanceRule: 'Decision support, multi-node failure mode synthesis, and localized dispatch drafting ONLY. Explicitly labeled as GeoShield Analysis and strictly prohibited from altering official warnings.',
    agenciesOrServices: [
      'Gemini 3.8 Flash LLM (FMEA Qualitative Reasoning & Multi-lingual Dispatch Drafting)',
      'GeoShield Network Graph Cascading Failure Engine',
      'GeoShield Deterministic IS 875 / IRC Risk Calculators'
    ],
    canOverrideOfficialWarnings: false
  }
];

// ==========================================
// 17. DISTRICT EMERGENCY CONTACT REGISTRY
// ==========================================
export const INDIA_EMERGENCY_CONTACTS: EmergencyContactRecord[] = [
  {
    id: 'contact_deoc_jagatsinghpur',
    state: 'Odisha',
    district: 'Jagatsinghpur (Paradip Port)',
    authorityName: 'District Emergency Operations Centre (DEOC) Jagatsinghpur',
    eocType: 'District EOC (DEOC)',
    tollFreeNumber: '1077',
    primaryPhone: '06724-220368',
    alternatePhone: '06724-220127',
    unified112Available: true,
    vhfRadioChannel: 'VHF Ch 16 (Marine) / OSDMA Grid 4 (156.800 MHz)',
    officialPortalUrl: 'https://jagatsinghpur.nic.in',
    lastVerifiedDate: '2026-09-20'
  },
  {
    id: 'contact_deoc_kendrapara',
    state: 'Odisha',
    district: 'Kendrapara',
    authorityName: 'District Emergency Operations Centre (DEOC) Kendrapara',
    eocType: 'District EOC (DEOC)',
    tollFreeNumber: '1077',
    primaryPhone: '06727-232803',
    alternatePhone: '06727-232804',
    unified112Available: true,
    vhfRadioChannel: 'OSDMA Wireless Grid 3 (162.450 MHz)',
    officialPortalUrl: 'https://kendrapara.nic.in',
    lastVerifiedDate: '2026-09-20'
  },
  {
    id: 'contact_deoc_cuttack',
    state: 'Odisha',
    district: 'Cuttack',
    authorityName: 'District Emergency Operations Centre (DEOC) Cuttack',
    eocType: 'District EOC (DEOC)',
    tollFreeNumber: '1077',
    primaryPhone: '0671-2507842',
    alternatePhone: '0671-2507843',
    unified112Available: true,
    vhfRadioChannel: 'OSDMA Wireless Grid 2 (161.925 MHz)',
    officialPortalUrl: 'https://cuttack.nic.in',
    lastVerifiedDate: '2026-09-21'
  },
  {
    id: 'contact_seoc_odisha',
    state: 'Odisha',
    district: 'Statewide (Bhubaneswar HQ)',
    authorityName: 'State Emergency Operations Centre (SEOC) / OSDMA Control Room',
    eocType: 'State EOC (SEOC)',
    tollFreeNumber: '1070',
    primaryPhone: '0674-2534177',
    alternatePhone: '0674-2395398',
    unified112Available: true,
    vhfRadioChannel: 'State Disaster Radio Repeater Net',
    officialPortalUrl: 'https://osdma.org',
    lastVerifiedDate: '2026-09-22'
  },
  {
    id: 'contact_ndrf_3bn_mundali',
    state: 'Odisha',
    district: 'Cuttack / Coastal Response Base',
    authorityName: '3rd Battalion National Disaster Response Force (NDRF) Mundali',
    eocType: 'NDRF Control',
    tollFreeNumber: '1078',
    primaryPhone: '0671-2879710',
    alternatePhone: '0671-2879711',
    unified112Available: true,
    vhfRadioChannel: 'NDRF Tactical Tac-1 (148.500 MHz)',
    officialPortalUrl: 'https://ndrf.gov.in',
    lastVerifiedDate: '2026-09-21'
  },
  {
    id: 'contact_scb_hospital_emergency',
    state: 'Odisha',
    district: 'Cuttack',
    authorityName: 'SCB Medical College & Hospital 24x7 Trauma Casualty',
    eocType: 'Hospital Emergency',
    tollFreeNumber: '108 (Ambulance)',
    primaryPhone: '0671-2414004',
    alternatePhone: '0671-2414147',
    unified112Available: true,
    officialPortalUrl: 'https://scbmch.in',
    lastVerifiedDate: '2026-09-22'
  }
];

// ==========================================
// 18. MULTI-HAZARD PLUGIN ARCHITECTURE
// ==========================================
export const INDIA_HAZARD_PLUGINS: HazardPlugin[] = [
  {
    id: 'hazard_cyclone',
    name: 'Tropical Cyclone & Gale Winds',
    iconName: 'Wind',
    officialAuthority: 'India Meteorological Department (IMD)',
    primaryDataSource: 'IMD DWR Radar Network, INSAT-3DR, Oceansat-3',
    hazardModel: 'IMD NWP (GFS/WRF) & Empirical Cyclone Wind Field Model',
    exposureEngine: 'ISRO Bhuvan National Cadastral Vector Layer',
    vulnerabilityStandard: 'IS 875 (Part 3):2015 Wind Loading',
    warningProtocol: 'IMD 4-Stage Cyclone Warning (Watch, Alert, Warning, Outlook)',
    activeInPilot: true
  },
  {
    id: 'hazard_storm_surge',
    name: 'Coastal Storm Surge & Wave Overtopping',
    iconName: 'Waves',
    officialAuthority: 'INCOIS & IMD',
    primaryDataSource: 'INCOIS Coastal Wave Radars, GTS Tide Gauges, Cartosat DEM',
    hazardModel: 'ADCIRC Hydrodynamic Ocean Surge Model (IIT Delhi / INCOIS)',
    exposureEngine: 'PostGIS ST_Intersects on GTS Topographic Contours',
    vulnerabilityStandard: 'NDMA Coastal Inundation Fragility Matrix',
    warningProtocol: 'INCOIS Ocean State Forecast & Coastal Surge Warnings',
    activeInPilot: true
  },
  {
    id: 'hazard_riverine_flood',
    name: 'Riverine Basin Flood & Backwater Swell',
    iconName: 'Droplets',
    officialAuthority: 'Central Water Commission (CWC)',
    primaryDataSource: 'CWC Mahanadi Basin Telemetry & Gauge Network',
    hazardModel: 'CWC Integrated Flood Forecast System (IFFS) / MIKE 11',
    exposureEngine: 'NRSC River Basin Cadastre & OSDMA Geoportal',
    vulnerabilityStandard: 'IS 10751 / IS 11532 Barrage and Embankment Criteria',
    warningProtocol: 'CWC River Stage Warnings (Warning Level / Danger Level)',
    activeInPilot: true
  },
  {
    id: 'hazard_urban_flood',
    name: 'Urban Cloudburst & Stormwater Inundation',
    iconName: 'CloudRain',
    officialAuthority: 'IMD & Municipal Corporations (CMC/BMC)',
    primaryDataSource: 'Doppler Weather Radar (DWR) Paradip & Urban Rain Gauges',
    hazardModel: 'SWMM (Storm Water Management Model) 2D Hydrodynamic',
    exposureEngine: 'Municipal Storm Drainage GIS Network',
    vulnerabilityStandard: 'CPHEEO Manual on Storm Water Drainage Systems',
    warningProtocol: 'IMD Urban Flood Impact Warnings',
    activeInPilot: false
  },
  {
    id: 'hazard_landslide',
    name: 'Landslide & Hill Slope Instability',
    iconName: 'Mountain',
    officialAuthority: 'Geological Survey of India (GSI) & ISRO NRSC',
    primaryDataSource: 'ISRO CartoDEM, Sentinel-1 InSAR, GSI Landslide Inventory',
    hazardModel: 'TRIGRS Transient Rainfall Infiltration and Grid-based Slope Stability',
    exposureEngine: 'Survey of India Hill Road & Habitation Atlas',
    vulnerabilityStandard: 'IS 14458 / NDMA Landslide Management Guidelines',
    warningProtocol: 'GSI Regional Landslide Early Warning System (LEWS)',
    activeInPilot: false
  },
  {
    id: 'hazard_lightning',
    name: 'Lightning Strike & Severe Convection',
    iconName: 'Zap',
    officialAuthority: 'IMD & IITM Pune (Damini Platform)',
    primaryDataSource: 'IITM National Lightning Detection Network (LNDN)',
    hazardModel: 'Atmospheric Convective Available Potential Energy (CAPE) Model',
    exposureEngine: 'Gram Panchayat Geospatial Settlement Layers',
    vulnerabilityStandard: 'IS/IEC 62305 Protection Against Lightning',
    warningProtocol: 'Damini App / IMD Nowcast 3-Hour Lightning Alerts',
    activeInPilot: false
  },
  {
    id: 'hazard_heatwave',
    name: 'Extreme Heatwave & Wet-Bulb Stress',
    iconName: 'Sun',
    officialAuthority: 'India Meteorological Department (IMD)',
    primaryDataSource: 'IMD Automatic Weather Stations & ECMWF Temperature Grids',
    hazardModel: 'IMD Maximum Temperature Anomaly & Heat Index Calculations',
    exposureEngine: 'National Vulnerability Census & Outdoor Worker Density',
    vulnerabilityStandard: 'NDMA National Heat Wave Action Guidelines',
    warningProtocol: 'IMD Color-Coded Heatwave Advisories (Yellow/Orange/Red)',
    activeInPilot: false
  },
  {
    id: 'hazard_tsunami',
    name: 'Subduction Tsunami & Infragravity Waves',
    iconName: 'Anchor',
    officialAuthority: 'INCOIS (Indian Tsunami Early Warning Centre - ITEWC)',
    primaryDataSource: 'BPR Ocean Bottom Pressure Recorders, Coastal Tide Gauges',
    hazardModel: 'TUNAMI-N2 Numerical Inundation Model',
    exposureEngine: 'INCOIS Coastal Multi-Hazard Vulnerability Maps',
    vulnerabilityStandard: 'NDMA Guidelines on Management of Tsunamis',
    warningProtocol: 'ITEWC Threat Bulletins (Warning / Alert / Watch)',
    activeInPilot: false
  }
];

// ==========================================
// 19. SACHET 12+ INDIAN LANGUAGE REGISTRY
// ==========================================
export interface LanguageRegistryEntry {
  code: string;
  name: string;
  nativeName: string;
  regionPriority: boolean;
  sachetSupported: boolean;
  defaultEmergencyMessage: string;
}

export const INDIA_LANGUAGE_REGISTRY: LanguageRegistryEntry[] = [
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    regionPriority: true,
    sachetSupported: true,
    defaultEmergencyMessage: 'ଜରୁରୀ ସୂଚନା: ପ୍ରବଳ ବାତ୍ୟା ଦାନା ତୀବ୍ର ହେଉଛି। ପାରାଦୀପ ଏବଂ କେନ୍ଦ୍ରାପଡା ଉପକୂଳରେ ୩.୮ ମିଟର ଉଚ୍ଚ ଜୁଆର ଆଶଙ୍କା। ସମସ୍ତେ ତୁରନ୍ତ ନିକଟସ୍ଥ ବହୁମୁଖୀ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳକୁ ଯାଆନ୍ତୁ। ବିପର୍ଯ୍ୟୟ ନିୟନ୍ତ୍ରଣ କକ୍ଷ: ୧୦୭୭।'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    regionPriority: true,
    sachetSupported: true,
    defaultEmergencyMessage: 'आपदा चेतावनी: भीषण चक्रवात दाना ओडिशा तट की ओर बढ़ रहा है। 3.8 मीटर तक समुद्री तूफान और 185 किमी/घंटा हवाओं की संभावना। तुरंत नजदीकी बहुउद्देशीय चक्रवात आश्रय में शरण लें। नियंत्रण कक्ष: 1077 या 112।'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    regionPriority: true,
    sachetSupported: true,
    defaultEmergencyMessage: 'জরুরি সতর্কতা: অতি প্রবল ঘূর্ণিঝড় ডানা উপকূলে আছড়ে পড়তে চলেছে। ৩.৮ মিটার পর্যন্ত জলোচ্ছ্বাসের আশঙ্কা। দ্রুত নিকটস্থ বহুমুখী সাইক্লোন সেন্টারে আশ্রয় নিন। জেলা হেল্পলাইন: ১০৭৭ বা ১১২।'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    regionPriority: true,
    sachetSupported: true,
    defaultEmergencyMessage: 'CRITICAL EMERGENCY: Very Severe Cyclonic Storm Dana approaching Odisha coast. 3.8m coastal surge and 185 km/h winds forecast. Evacuate immediately to Multipurpose Cyclone Shelters. Control Room: 1077 / 112.'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    regionPriority: true,
    sachetSupported: true,
    defaultEmergencyMessage: 'అత్యవసర హెచ్చరిక: తీవ్ర తుఫాను దానా తీరానికి చేరుకుంటోంది. 3.8 మీటర్ల తుఫాను ఆటుపోట్లు మరియు 185 కి.మీ వేగంతో గాలులు వీచే అవకాశం ఉంది. వెంటనే సురక్షిత తుఫాను ఆశ్రయాలకు వెళ్లండి. కంట్రోల్ రూమ్: 1077.'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'அவசர எச்சரிக்கை: மிக தீவிர டானா புயல் கரையைக் கடக்க உள்ளது. 3.8 மீட்டர் புயல் அலை மற்றும் 185 கி.மீ காற்று வீசும். உடனடியாக அருகிலுள்ள புயல் பாதுகாப்பு மையத்திற்குச் செல்லுங்கள். அவசர எண்: 1077.'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'आपत्कालीन चेतावणी: तीव्र चक्रीवादळ दाना किनारपट्टीवर धडकण्याची शक्यता आहे. 3.8 मीटर लाटा आणि 185 किमी/तास वाऱ्याचा अंदाज. तातडीने जवळच्या सुरक्षित निवारा केंद्रात पोहोचा. मदत क्रमांक: 1077.'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'કટોકટી ચેતવણી: અતિ તીવ્ર ચક્રવાત દાના દરિયાકાંઠે ટકરાવાની સંભાવના છે. 3.8 મીટર મોજા અને 185 કિમી/કલાકના પવનની આગાહી. તાત્કાલિક સાયક્લોન આશ્રયસ્થાનમાં ખસી જાઓ. હેલ્પલાઇન: 1077.'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ: ತೀವ್ರ ಚಂಡಮಾರುತ ದಾನಾ ಕರಾವಳಿ ತೀರಕ್ಕೆ ಅಪ್ಪಳಿಸಲಿದೆ. 3.8 ಮೀಟರ್ ಎತ್ತರದ ಅಲೆಗಳು ಮತ್ತು 185 ಕಿಮೀ ವೇಗದ ಗಾಳಿ ಸಾಧ್ಯತೆ. ತಕ್ಷಣವೇ ಸಾರ್ವಜನಿಕ ಆಶ್ರಯ ಕೇಂದ್ರಗಳಿಗೆ ತೆರಳಿ. ನಿಯಂತ್ರಣ ಕೊಠಡಿ: 1077.'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'അടിയന്തര മുന്നറിയിപ്പ്: അതിതീവ്ര ദാന ചുഴലിക്കാറ്റ് കരയിലേക്ക് അടുക്കുന്നു. 3.8 മീറ്റർ ഉയർന്ന തിരമാലകൾക്കും 185 കി.മീ കാറ്റിനും സാധ്യത. ഉടൻ സുരക്ഷിത ചുഴലിക്കാറ്റ് ഷെൽട്ടറുകളിലേക്ക് മാറുക. കൺട്രോൾ റൂം: 1077.'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ: ਬਹੁਤ ਗੰਭੀਰ ਚੱਕਰਵਾਤ ਦਾਨਾ ਤੱਟ ਵੱਲ ਵਧ ਰਿਹਾ ਹੈ। 3.8 ਮੀਟਰ ਉੱਚੀਆਂ ਲਹਿਰਾਂ ਅਤੇ 185 ਕਿਲੋਮੀਟਰ/ਘੰਟੇ ਦੀਆਂ ਹਵਾਵਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ। ਤੁਰੰਤ ਸੁਰੱਖਿਅਤ ਸ਼ੈਲਟਰਾਂ ਵਿੱਚ ਜਾਓ। ਕੰਟਰੋਲ ਰੂਮ: 1077.'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    regionPriority: false,
    sachetSupported: true,
    defaultEmergencyMessage: 'জৰুৰী সতৰ্কবাণী: অতি তীব্ৰ ঘূৰ্ণীবতাহ দানা উপকূলৰ দিশে অগ্ৰসৰ হৈছে। ৩.৮ মিটাৰ উচ্চ জোৱাৰ আৰু ১৮৫ কিমি/ঘণ্টা বেগেৰে বতাহ বলি পাৰে। তৎক্ষণাৎ নিকটৱৰ্তী সুৰক্ষিত আশ্ৰয়স্থললৈ যাওক। নিয়ন্ত্ৰণ কক্ষ: ১০৭৭।'
  }
];

// ==========================================
// 15. CWC RIVER GAUGES (GOOGLE FLOOD FORECASTING API GATEWAY)
// Statutory Network: Mahanadi, Brahmani, Baitarani Basins
// Reference: https://developers.google.com/flood-forecasting
// ==========================================
export const INDIA_CWC_GAUGES: GoogleFloodGaugeRecord[] = [
  {
    gaugeId: "google_flood_gauge_cwc_naraj_03b",
    gaugeName: "Naraj Delta Head Barrage",
    riverName: "Mahanadi",
    basin: "MAHANADI_LOWER_BASIN",
    stationCode: "CWC_MHD_03B",
    coordinates: { latitude: 20.468, longitude: 85.802 },
    waterLevelM: 26.45,
    warningLevelM: 25.41,
    dangerLevelM: 26.41,
    historicalHighestFloodLevelM: 27.60,
    qualityVerified: true,
    floodSeverity: "DANGER",
    dischargeM3s: 27750.0,
    sluiceGateStatus: "32_OF_36_GATES_OPEN",
    returnPeriodThresholds: { rp2YearsM: 25.80, rp5YearsM: 26.40, rp20YearsM: 27.10, rp50YearsM: 27.65 },
    forecasts7Day: [
      { forecastTimestamp: "+24h", forecastedWaterLevelM: 26.85, probabilityExceedancePct: 88 },
      { forecastTimestamp: "+48h", forecastedWaterLevelM: 27.15, probabilityExceedancePct: 82 },
      { forecastTimestamp: "+72h", forecastedWaterLevelM: 26.90, probabilityExceedancePct: 75 },
      { forecastTimestamp: "+96h", forecastedWaterLevelM: 26.20, probabilityExceedancePct: 65 },
      { forecastTimestamp: "+120h", forecastedWaterLevelM: 25.50, probabilityExceedancePct: 55 },
      { forecastTimestamp: "+144h", forecastedWaterLevelM: 24.80, probabilityExceedancePct: 40 },
      { forecastTimestamp: "+168h", forecastedWaterLevelM: 24.10, probabilityExceedancePct: 30 }
    ],
    sourceReference: "https://developers.google.com/flood-forecasting"
  },
  {
    gaugeId: "google_flood_gauge_cwc_jobra_04a",
    gaugeName: "Jobra Barrage Cuttack",
    riverName: "Mahanadi",
    basin: "MAHANADI_LOWER_BASIN",
    stationCode: "CWC_MHD_04A",
    coordinates: { latitude: 20.490, longitude: 85.892 },
    waterLevelM: 21.65,
    warningLevelM: 21.00,
    dangerLevelM: 21.94,
    historicalHighestFloodLevelM: 22.85,
    qualityVerified: true,
    floodSeverity: "WARNING",
    dischargeM3s: 24500.0,
    sluiceGateStatus: "ALL_GATES_OPEN",
    returnPeriodThresholds: { rp2YearsM: 21.20, rp5YearsM: 21.90, rp20YearsM: 22.40, rp50YearsM: 22.90 },
    forecasts7Day: [
      { forecastTimestamp: "+24h", forecastedWaterLevelM: 22.05, probabilityExceedancePct: 85 },
      { forecastTimestamp: "+48h", forecastedWaterLevelM: 22.35, probabilityExceedancePct: 80 },
      { forecastTimestamp: "+72h", forecastedWaterLevelM: 22.10, probabilityExceedancePct: 70 },
      { forecastTimestamp: "+96h", forecastedWaterLevelM: 21.40, probabilityExceedancePct: 60 },
      { forecastTimestamp: "+120h", forecastedWaterLevelM: 20.80, probabilityExceedancePct: 45 },
      { forecastTimestamp: "+144h", forecastedWaterLevelM: 20.10, probabilityExceedancePct: 35 },
      { forecastTimestamp: "+168h", forecastedWaterLevelM: 19.50, probabilityExceedancePct: 25 }
    ],
    sourceReference: "https://developers.google.com/flood-forecasting"
  },
  {
    gaugeId: "google_flood_gauge_cwc_jenapur_02c",
    gaugeName: "Jenapur Railway Bridge",
    riverName: "Brahmani",
    basin: "BRAHMANI_BASIN",
    stationCode: "CWC_BRH_02C",
    coordinates: { latitude: 20.865, longitude: 86.024 },
    waterLevelM: 67.20,
    warningLevelM: 66.00,
    dangerLevelM: 67.00,
    historicalHighestFloodLevelM: 68.40,
    qualityVerified: true,
    floodSeverity: "DANGER",
    dischargeM3s: 14200.0,
    returnPeriodThresholds: { rp2YearsM: 66.40, rp5YearsM: 67.00, rp20YearsM: 67.80, rp50YearsM: 68.50 },
    forecasts7Day: [
      { forecastTimestamp: "+24h", forecastedWaterLevelM: 67.55, probabilityExceedancePct: 90 },
      { forecastTimestamp: "+48h", forecastedWaterLevelM: 67.80, probabilityExceedancePct: 84 },
      { forecastTimestamp: "+72h", forecastedWaterLevelM: 67.30, probabilityExceedancePct: 75 },
      { forecastTimestamp: "+96h", forecastedWaterLevelM: 66.50, probabilityExceedancePct: 60 },
      { forecastTimestamp: "+120h", forecastedWaterLevelM: 65.80, probabilityExceedancePct: 45 },
      { forecastTimestamp: "+144h", forecastedWaterLevelM: 65.10, probabilityExceedancePct: 35 },
      { forecastTimestamp: "+168h", forecastedWaterLevelM: 64.50, probabilityExceedancePct: 20 }
    ],
    sourceReference: "https://developers.google.com/flood-forecasting"
  },
  {
    gaugeId: "google_flood_gauge_cwc_anandapur_01a",
    gaugeName: "Anandapur Road Bridge",
    riverName: "Baitarani",
    basin: "BAITARANI_BASIN",
    stationCode: "CWC_BTR_01A",
    coordinates: { latitude: 21.215, longitude: 85.992 },
    waterLevelM: 38.50,
    warningLevelM: 37.45,
    dangerLevelM: 38.36,
    historicalHighestFloodLevelM: 39.80,
    qualityVerified: true,
    floodSeverity: "DANGER",
    dischargeM3s: 9800.0,
    returnPeriodThresholds: { rp2YearsM: 37.80, rp5YearsM: 38.36, rp20YearsM: 39.10, rp50YearsM: 39.90 },
    forecasts7Day: [
      { forecastTimestamp: "+24h", forecastedWaterLevelM: 38.90, probabilityExceedancePct: 86 },
      { forecastTimestamp: "+48h", forecastedWaterLevelM: 38.65, probabilityExceedancePct: 78 },
      { forecastTimestamp: "+72h", forecastedWaterLevelM: 37.90, probabilityExceedancePct: 65 },
      { forecastTimestamp: "+96h", forecastedWaterLevelM: 37.20, probabilityExceedancePct: 50 },
      { forecastTimestamp: "+120h", forecastedWaterLevelM: 36.50, probabilityExceedancePct: 40 },
      { forecastTimestamp: "+144h", forecastedWaterLevelM: 35.80, probabilityExceedancePct: 30 },
      { forecastTimestamp: "+168h", forecastedWaterLevelM: 35.00, probabilityExceedancePct: 20 }
    ],
    sourceReference: "https://developers.google.com/flood-forecasting"
  },
  {
    gaugeId: "google_flood_gauge_cwc_alipingal_08f",
    gaugeName: "Alipingal Devi River Crossing",
    riverName: "Devi (Mahanadi Estuary)",
    basin: "MAHANADI_ESTUARY_BASIN",
    stationCode: "CWC_MHD_08F",
    coordinates: { latitude: 20.245, longitude: 86.275 },
    waterLevelM: 12.65,
    warningLevelM: 11.76,
    dangerLevelM: 12.56,
    historicalHighestFloodLevelM: 13.50,
    qualityVerified: true,
    floodSeverity: "DANGER",
    dischargeM3s: 18500.0,
    returnPeriodThresholds: { rp2YearsM: 12.10, rp5YearsM: 12.56, rp20YearsM: 13.10, rp50YearsM: 13.60 },
    forecasts7Day: [
      { forecastTimestamp: "+24h", forecastedWaterLevelM: 12.95, probabilityExceedancePct: 88 },
      { forecastTimestamp: "+48h", forecastedWaterLevelM: 13.20, probabilityExceedancePct: 84 },
      { forecastTimestamp: "+72h", forecastedWaterLevelM: 12.75, probabilityExceedancePct: 72 },
      { forecastTimestamp: "+96h", forecastedWaterLevelM: 12.10, probabilityExceedancePct: 58 },
      { forecastTimestamp: "+120h", forecastedWaterLevelM: 11.40, probabilityExceedancePct: 40 },
      { forecastTimestamp: "+144h", forecastedWaterLevelM: 10.80, probabilityExceedancePct: 30 },
      { forecastTimestamp: "+168h", forecastedWaterLevelM: 10.20, probabilityExceedancePct: 20 }
    ],
    sourceReference: "https://developers.google.com/flood-forecasting"
  }
];
